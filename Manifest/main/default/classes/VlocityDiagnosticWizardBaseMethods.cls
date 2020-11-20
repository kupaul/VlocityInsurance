public virtual class VlocityDiagnosticWizardBaseMethods implements vlocity_ins.VlocityOpenInterface2
{
	public static VlocityDiagnosticWizardDescriber dc = new VlocityDiagnosticWizardDescriber();

	/* REST path for Tooling API */
	public static final String toolingUrl = '/services/data/v43.0/tooling';

	/* Tooling SObject Query URL */
	public static final String toolingSObjectQueryUrl = toolingUrl + '/query/?q=' + 'SELECT+Id,__NAMEFIELD__+FROM+__SOBJECTNAME__+WHERE+__NAMEFIELD__=\'__NAMEVALUE__\'';

	/* Tooling SObject Query with NamespacePrefix URL */
	public static final String toolingSObjectQueryWithNamespaceUrl = toolingUrl + '/query/?q=' + 'SELECT+Id,NamespacePrefix,__NAMEFIELD__+FROM+__SOBJECTNAME__+WHERE+__NAMEFIELD__=\'__NAMEVALUE__\'+AND+NamespacePrefix=\'__NAMESPACE__\'';

	/* Tooling SObject Retrieve URL (must be used in a composite request with a query before it) */
	public static final String toolingSObjectRetrieveUrl = toolingUrl + '/sobjects/__SOBJECTNAME__/@{__PARENTREFID__.records[0].Id}';

	/**
	 * The VlocityOpenInterface2 method override to dynamically call methods available in this class
	 * @param  methodName  The name of the method that will be invoked
	 * @param  inputs      The inputs of the method
	 * @param  outputs     A map to store output information in
	 * @param  options     Any optional parameters
	 * @return Object      Returns the output map
	 */
	public virtual Object invokeMethod(String methodName,
	                                   Map<String,Object> inputs,
	                                   Map<String,Object> output,
	                                   Map<String,Object> options)
	{
		switch on methodName
		{
			when 'checkBatchStatus'
			{
				return checkBatchStatus(inputs, output, options);
			}
			when 'checkSObjectsExist'
			{
				return checkSObjectsExist(inputs, output, options);
			}
			when 'checkSObject'
			{
				return checkSObject(inputs, output, options);
			}
			when 'setSObject'
			{
				return setSObject(inputs, output, options);
			}
			when 'deployDataPack'
			{
				return deployDataPack(inputs, output, options);
			}
			when 'toolingQueryCustomField'
			{
				return toolingQueryCustomField(inputs, output, options);
			}
			when 'toolingUpdateSObject'
			{
				return toolingUpdateSObject(inputs, output, options);
			}
			when 'toolingCreateSObject'
			{
				return toolingCreateSObject(inputs, output, options);
			}
			when 'toolingQuerySObject'
			{
				return toolingQuerySObject(inputs, output, options);
			}
			when 'checkDefaultContractType'
			{
				return checkDefaultContractType(inputs, output, options);
			}
			when 'createDefaultContractType'
			{
				return createDefaultContractType(inputs, output, options);
			}
            when 'runApexJob'
            {
                return runApexJob('apex', inputs, output, options);
            }
            when 'runBatchJob'
            {
                return runApexJob('batch', inputs, output, options);
            }
			when 'PLACEHOLDER'
			{
				output.put('hasErrors', false);
				return output;
			}
			when else
			{
				output.put('hasErrors', true);
				output.put('errorMessage', 'No Apex method found for name: ' + methodName);
				return output;
			}
		}
	}

	/**
	 * checkBatchStatus description
	 * @param  inputs  inputs contains record, the UpgradeStep__c record with a batch job to monitor. The RelatedBatchJobId__c field is used.
	 * @param  output  output displays the output of the method
	 * @param  options options is a map that potentially contains the key 'BatchJobsToMonitor', which is a comma separated list of batch ApexClass names to monitor
	 * @return         return output(either batch job is found, or error message)
	 */
	public static Map<String,Object> checkBatchStatus(Map<String,Object> inputs,
	                                                  Map<String,Object> output,
	                                                  Map<String,Object> options)
	{
		Map<String,Object> stepMap = dc.sObjectToMap(((UpgradeStep__c)inputs.get('record')));

		List<String> expectedBatchJobNames = new List<String>();
		Set<String> queriedBatchJobNames = new Set<String>();
		List<String> missingBatchJobs = new List<String>();

        // Some lists to track the status of the jobs
        List<String> pendingJobs = new List<String>();
        List<String> failedJobs = new List<String>();
        List<String> completeJobs = new List<String>();

        // Some data from the step
		DateTime lastExecutionDateTime = (DateTime)stepMap.get('LastExecutionDateTime');
		Id batchJobId = (Id)stepMap.get('RelatedBatchJobId');
		String frequency = (String)stepMap.get('StepFrequency');

        // Do we have a batch job name we expect?
		if (options.containsKey('BatchJobsToMonitor'))
		{
			expectedBatchJobNames = ((String) options.get('BatchJobsToMonitor')).split(',');
		}

		// Trim expected batch job names
		for (String batchJobName : expectedBatchJobNames)
		{
			batchJobName = batchJobName.trim();
		}

		//Query batch jobs and add class names to queriedBatchJobNames
		if (lastExecutionDateTime != null)
		{
			for (AsyncApexJob batchJob :  [SELECT Id,Status,NumberOfErrors,ApexClass.Name
			                               FROM AsyncApexJob
			                               WHERE Id = :batchJobId OR
                                                (CreatedDate >= :lastExecutionDateTime
			                                AND CompletedDate >= :lastExecutionDateTime
			                                AND ApexClass.Name IN :expectedBatchJobNames)
                                           ORDER BY CreatedDate DESC
			                               LIMIT 50])
			{
                // Only take into account the LAST executed job
                String name = batchJob.ApexClass.Name;
                if(!queriedBatchJobNames.contains(name))
                {

                    //Both Id and ApexClass.Name can be used to check
                    queriedBatchJobNames.add(name); 
                    queriedBatchJobNames.add(batchJob.Id);

                    // Add to the correct tracking list
                    if(batchJob.Status == 'Completed' && batchJob.NumberOfErrors == 0)
                    {
                        completeJobs.add(name);
                    }
                    else if(batchJob.Status == 'Queued' || batchJob.Status == 'Preparing' || batchJob.Status == 'Processing' || batchJob.Status == 'Holding')
                    {
                        pendingJobs.add(name);
                    }
                    else
                    {
                        failedJobs.add(name);
                    }
                }
			}
		}

        // Add the ID of the job (if exists) to expected batch jobs
        if(batchJobId != null)
        {
            expectedBatchJobNames.add((String)batchJobId);
        }

		if (!queriedBatchJobNames.isEmpty())
		{
            // All expected batch jobs MUST be in the queriedBatchJobsName
			for (String batchJobName : expectedBatchJobNames)
			{
				if (!queriedBatchJobNames.contains(batchJobName))
				{
					missingBatchJobs.add(batchJobName);
				}
			}

            // If missing batch jobs, return error
            if(!missingBatchJobs.isEmpty())
            {
                output.put('hasErrors', true);
                output.put('errorMessage','The following jobs were not found: ' + String.join(missingBatchJobs, ', '));
                return output;
            }

            // Let's prepare the results
            if(!pendingJobs.isEmpty())
            {
                output.put('hasErrors', true);  // This will allow to trigger the step again
                output.put('hasWarnings', true);
                output.put('warningMessage','The following jobs are running: ' + String.join(pendingJobs, ', '));
            }

            if(!failedJobs.isEmpty())
            {
                output.put('hasErrors', true);
                output.put('errorMessage','The following jobs failed to complete: ' + String.join(failedJobs, ', '));
            }
		}
		else
		{
			output.put('hasErrors', true);
            output.put('hasInfos', true);
			output.put('infoMessage','Jobs have not started.');
		}

		return output;
	}

	/**
	 * checkSObjectsExist compares the queried records to the number and operator given
	 * @param  inputs  inputs are the inputs of the method (not used)
	 * @param  output  output is the output of the method
	 * @param  options options are the parameters of the method in form:
	 *  {'SObject'=> new Map<String,Object>{'SObjectType' => 'objectApiName'}, 'SObjectQuery'=> new Map<String,Object>{'Compare' => '>2', 'QueryWhere' => 'WHERE Name = \'Example\''}}
	 * Note that the key 'QueryWhere' is optional, and provides a where clause to the end of the query
	 * @return         return output (either queried record is as expected, or error message)
	 */
	public static Map<String,Object> checkSObjectsExist(Map<String,Object> inputs,
	                                                    Map<String,Object> output,
	                                                    Map<String,Object> options)
	{
		String sObjectType, queryString, expectedOperator;
		Integer numRecords, expectedNumber;

		try
		{
			//SObject Options
			Map<String,Object> sObjectOptions = (Map<String,Object>)options.get('SObject');
			sObjectType = (String)sObjectOptions.remove('SObjectType');

			//SObjectQuery Options
			Map<String,Object> sObjectQuery = (Map<String,Object>)options.get('SObjectQuery');

			String whereString = sObjectQuery.containsKey('QueryWhere')
			                     ? (String)sObjectQuery.get('QueryWhere')
			                     : '';

			String compareString = ( (String) sObjectQuery.get('Compare') ).deleteWhitespace();

			if (!compareString.containsOnly('!=<>0123456789') ||
			    !compareString.containsAny('!=<>') ||
			    !compareString.containsAny('0123456789'))
			{
				output.put('hasErrors', true);
				output.put('errorMessage','Incorrect options given to method.');
				output.put('consoleMessage','Compare String for VlocityDiagnosticWizardBaseMethods.checkSObjectsExist contain an operator and a number, and nothing else.');
				return output;
			}

			expectedOperator = compareString.replaceAll('[0-9]','');
			expectedNumber = Integer.valueOf( compareString.replaceAll('[^0-9]','') );

			//Query String
			queryString = 'SELECT Id FROM ' + sObjectType + ' ' + whereString;
		}
		catch (NullPointerException e)
		{
			output.put('hasErrors', true);
			output.put('errorMessage','Incorrect options given to checkSObjectsExist');
			return output;
		}

		try
		{
			List<SObject> records = Database.Query(queryString);
			numRecords = records.size();
		}
		catch (QueryException e)
		{
			numRecords = 0;
		}

		List<String> validOperators = new List<String> {'>','<','!=','=='};

		output.put('hasErrors', false);

		if (!validOperators.contains(expectedOperator))
		{
			output.put('hasErrors', true);
			output.put('errorMessage','Incorrect options given to method.');
			output.put('consoleMessage','Valid compare operators are ">", "<", "!=", "==", but "' + expectedOperator + '" was given.');
		}
		else if (expectedOperator == '>' && !(numRecords > expectedNumber))
		{
			output.put('hasErrors', true);
			output.put('hasWarnings', true);
			output.put('consoleMessage','<= ' + expectedNumber + ' ' + sObjectType + ' records exist.');
		}
		else if (expectedOperator == '<' && !(numRecords < expectedNumber))
		{
			output.put('hasErrors', true);
			output.put('hasWarnings', true);
			output.put('consoleMessage','>= ' + expectedNumber + ' ' + sObjectType + ' records exist.');
		}
		else if (expectedOperator == '==' && !(numRecords == expectedNumber))
		{
			output.put('hasErrors', true);
			output.put('hasWarnings', true);
			output.put('consoleMessage', '!= ' + expectedNumber + ' ' + sObjectType + ' records exist.');
		}
		else if (expectedOperator == '!=' && !(numRecords != expectedNumber))
		{
			output.put('hasErrors', true);
			output.put('hasWarnings', true);
			output.put('consoleMessage', '== ' + expectedNumber + ' ' + sObjectType + ' records exist.');
		}

		return output;
	}

	/**
	 * checkSObject checks that a queried record matches the expected fields given
	 * @param  inputs  inputs are the inputs of the method (not used)
	 * @param  output  output is the output of the method
	 * @param  options options are the parameters of the method in form:
	 *  {'SObject'=> new Map<String,Object>{'SObjectType' => 'objectApiName', 'Name' => 'recordName', 'objectField1'=> 'field 1 expected val', ...}}
	 * Note that all keys under 'SObject' other than 'SObjectType', 'UniqueField', and 'Name'/value of 'UniqueField' are used as field names for the specified SObjectType
	 * @return         return output (either queried record is as expected, or error message)
	 */
	public static Map<String,Object> checkSObject(Map<String,Object> inputs,
	                                              Map<String,Object> output,
	                                              Map<String,Object> options)
	{
		Map<String,Object> sObjectOptions = (Map<String,Object>)options.get('SObject');
		String recordSObjectType = (String)sObjectOptions.remove('SObjectType');
		String uniqueFieldName = sObjectOptions.containsKey('UniqueField')
		                         ? (String)sObjectOptions.remove('UniqueField')
		                         : 'Name';
		String uniqueFieldValue = (String)sObjectOptions.get(uniqueFieldName);
		List<String> fieldNames = new List<String>(sObjectOptions.keySet());
		String recordQuery = 'SELECT ' + String.join(fieldNames,',')
		                     + ' FROM ' + recordSObjectType
		                     + ' WHERE ' + uniqueFieldName + '=\'' + uniqueFieldValue +'\'';

		//Query record
		SObject record;
		List<SObject> records = Database.Query(recordQuery);
		if (records.size()>1)
		{
			output.put('hasErrors', true);
			output.put('consoleMessage','More than one record was returned, UniqueField is not unique.');
			return output;
		}
		else if (records.isEmpty())
		{
			output.put('hasErrors', true);
			output.put('hasWarnings', true);
			output.put('consoleMessage','The record "' + uniqueFieldValue + '" does not exist.');
			return output;
		}
		else
		{
			record = records[0];
		}

		for (String fieldName : fieldNames)
		{
			//accumulateerror messages
			if (record.get(fieldName) != sObjectOptions.get(fieldName))
			{
				output.put('hasErrors', true);
				output.put('hasWarnings', true);
				output.put('consoleMessage', 'The field ' + fieldName + ' is not equal to "' + sObjectOptions.get(fieldName) + '".');
				return output;
			}
		}
		output.put('queriedRecord', record);
		output.put('hasErrors', false);
		return output;
	}

	/**
	 * setSObject upserts a queried record (or creates a new record) with specified field values
	 * @param  inputs  inputs are the inputs of the method (not used)
	 * @param  output  output is the output of the method
	 * @param  options options are the parameters of the method in form:
	 *	{'SObject'=> new Map<String,Object>{'SObjectType' => 'objectApiName', 'Name' => 'recordName', 'objectField1'=> 'field 1 requested val', ...}}
	 * Note that all keys under 'SObject' other than 'SObjectType', 'UniqueField', and 'Name'/value of 'UniqueField' are used as field names for the specified SObjectType
	 * @return         return output (either record is upserted, or error message)
	 */
	public static Map<String,Object> setSObject(Map<String,Object> inputs,
	                                            Map<String,Object> output,
	                                            Map<String,Object> options)
	{
		Map<String,Object> sObjectOptions = (Map<String,Object>)options.get('SObject');
		String recordSObjectType = (String)sObjectOptions.remove('SObjectType');

		String uniqueFieldName = sObjectOptions.containsKey('UniqueField')
		                         ? (String)sObjectOptions.remove('UniqueField')
		                         : 'Name';

		String uniqueFieldValue = (String)sObjectOptions.get(uniqueFieldName);

		List<String> fieldNames = new List<String>(sObjectOptions.keySet());

		String recordQuery = 'SELECT ' + String.join(fieldNames,',')
		                     + ' FROM ' + recordSObjectType
		                     + ' WHERE ' + uniqueFieldName + '=\'' + uniqueFieldValue +'\'';
		SObject record;
		//Query record
		List<SObject> records = Database.Query(recordQuery);

		if (records.size()>1)
		{
			output.put('hasErrors', true);
			output.put('errorMessage','More than one ' + recordSObjectType + ' record was returned in the query as the unique field is not unique.');
			return output;
		}
		else if (records.isEmpty())
		{
			record = Schema.getGlobalDescribe().get(recordSObjectType).newSObject();
			record.put(uniqueFieldName, uniqueFieldValue);
		}
		else
		{
			record = records[0];
		}

		for (String fieldName : fieldNames)
		{
			record.put(fieldName, sObjectOptions.get(fieldName));
		}

		upsert record;

		output.put('updatedRecord', record);

		output.put('hasErrors', false);
		return output;
	}


	/**
	 * deployDataPack uses the vlocity_ins.DrDataPackServiceBatch class to start a deploy of a datapack from a static resource
	 * @param  inputs  inputs are the inputs of the method (not used)
	 * @param  output  output is the output of the method
	 * @param  options options are the parameters of the method in form:
	 *   {'DataPackName' => 'StaticResourceNameOfDataPackGoesHere'}
	 * @return         return output (containing a batchJobId to later check if the batch job has been completed, or error message)
	 */
	public static Map<String,Object> deployDataPack(Map<String,Object> inputs,Map<String,Object> output,Map<String,Object> options)
	{
		Map<String,Object> stepMap = dc.sObjectToMap(((UpgradeStep__c)inputs.get('record')));

        // Get the validation fields && input data
        Id batchJobId = (Id)stepMap.get('RelatedBatchJobId');
        String frequency = (String)stepMap.get('StepFrequency');
		String dataPackName = (String) options.get('DataPackName');

		try
		{
            if(frequency == 'Always' || frequency == 'Diagnostic' || batchJobId == null)
            {
                batchJobId = vlocity_ins.DRDataPackServiceBatch.startResourceDeploy(dataPackName);
            }

            output.put('hasErrors', false);
            output.put('hasInfos', true);
            output.put('batchJobId', batchJobId);
            output.put('infoMessage', 'Batch job ' + batchJobId + ' has been submitted.');
		}
		catch(Exception e)
		{
			output.put('hasErrors', true);
			output.put('errorMessage', 'Error while attempting to deploy datapack.');
		}

		return output;
	}

	/**
	 * toolingQuerySObject uses the Tooling REST API to check if a given Tooling SObjectType (like a Custom Object or Remote Site Setting, something not accessible in standard Apex) exists
	 * @param  inputs  inputs are the inputs of the method (not used)
	 * @param  output  output is the output of the method
	 * @param  options options are the parameters of the method in form:
	 *	{'ToolingAPI' => new Map<String,Object>{'SObjectType' => 'RemoteProxy', 'UniqueField' => 'SiteName', 'SiteName' => 'StreamingAPI'}}
	 * Note that 'UniqueField' defaults to 'DeveloperName' if no value is given
	 * @return   return output (containing the tooling api response under the key toolingResponse, or an error message)
	 */
	public static Map<String,Object> toolingQuerySObject(Map<String,Object> inputs,
	                                                     Map<String,Object> output,
	                                                     Map<String,Object> options)
	{
		output.put('hasErrors', true);
		Map<String,Object> sObjectOptions = (Map<String,Object>)options.get('ToolingAPI');

		String namespacePrefix = (String)sObjectOptions.get('namespacePrefix');
		String objectType = (String)sObjectOptions.get('SObjectType');

		String uniqueFieldName = sObjectOptions.containsKey('UniqueField')
		                         ? (String)sObjectOptions.remove('UniqueField')
		                         : 'DeveloperName';

		String uniqueFieldValue = (String)sObjectOptions.get(uniqueFieldName);

		if (uniqueFieldName == 'DeveloperName')
		{
			uniqueFieldValue = uniqueFieldValue.countMatches('__') == 2 ? uniqueFieldValue.substringBetween('__') : uniqueFieldValue.substringBefore('__');
		}

		ToolingCompositeRequest compRequest = new ToolingCompositeRequest();
		String queryUrl = String.isBlank(namespacePrefix) ? toolingSObjectQueryUrl : toolingSObjectQueryWithNamespaceUrl.replace('__NAMESPACE__', namespacePrefix);

		ToolingSubRequest querySubRequest = new ToolingSubRequest();
		querySubRequest.method = 'GET';
		querySubRequest.referenceId = 'query_ref_id';
		querySubRequest.url = queryUrl.replace
		                              ('__SOBJECTNAME__', objectType).replace('__NAMEFIELD__', uniqueFieldName).replace('__NAMEVALUE__', uniqueFieldValue);

		ToolingSubRequest retrieveSubRequest = new ToolingSubRequest();
		retrieveSubRequest.method = 'GET';
		retrieveSubRequest.referenceId = 'retrieve_ref_id';
		retrieveSubRequest.url = toolingSObjectRetrieveUrl.replace
		                                 ('__SOBJECTNAME__', objectType).replace('__PARENTREFID__', querySubRequest.referenceId);

		compRequest.compositeRequest.add(querySubRequest);
		compRequest.compositeRequest.add(retrieveSubRequest);

		String toolingResponse = toolingRequest('POST', '/composite', JSON.serialize(compRequest));

		output.put('toolingResponse',toolingResponse);
		output.put('hasErrors', false);
		return output;
	}


	/**
	 * toolingQueryCustomField uses the Tooling REST API to query a CustomField
	 * @param  inputs  inputs are the inputs of the method (not used)
	 * @param  output  output is the output of the method
	 * @param  options options are the parameters of the method in form:
	 *	{'ToolingAPI' => new Map<String,Object>{'objectName' => 'Element__c', 'customFieldName' => 'Type__c'}}
	 * @return   return output (containing the tooling api response under the key toolingResponse, or an error message)
	 */
	public static Map<String,Object> toolingQueryCustomField(Map<String,Object> inputs,
	                                                         Map<String,Object> output,
	                                                         Map<String,Object> options)
	{
		output.put('hasErrors', true);

		Map<String,Object> sObjectOptions = (Map<String,Object>)options.get('ToolingAPI');

		String objectName = (String)sObjectOptions.get('ObjectName');
		String fieldName = (String)sObjectOptions.get('FieldName');

		//retrieve object type using VlocityDiagnosticWizardDescriber to check if it is valid
		SObjectType sObjType = dc.getSObjectType(objectName);

		if (sObjType == null)
		{
			output.put('consoleMessage', 'SObject "' + objectName + '" does not exist.');
			return output;
		}

		//retrieve field and check if it is valid
		String properFieldName = dc.getProperFieldName(fieldName, sObjType.getDescribe().fields.getMap());

		if (properFieldName == null) {
			output.put('consoleMessage', 'Field "' + fieldName + '" does not exist.');
			return output;
		}
		fieldName = properFieldName;

        // If is standard field, exit
        if(!fieldName.endsWith('__c')) 
        {
            output.put('isStandardField', true);
            return output;
        }

		//set namespace friendly object name
		objectName = sObjType.getDescribe().getLocalName();

		String objectNS;
		String objectDeveloperName = objectName;
		Boolean isCustomObject = true;

		//first check if object is valid in apex
		switch on objectName.countMatches('__')
		{
			when 2
			{
				objectNS = objectName.substringBefore('__');
				objectDeveloperName = objectName.substringBetween('__');
			}
			when 1
			{
				objectDeveloperName = objectName.substringBefore('__');
			}
			when else
			{
				isCustomObject = false;
			}
		}

        String fieldDeveloperName = fieldName.countMatches('__') == 2 ? fieldName.substringBetween('__') : fieldName.substringBefore('__');

		//Initialize ToolingCompositeRequest and ToolingSubRequest objects
		ToolingCompositeRequest compRequest = new ToolingCompositeRequest();
		ToolingSubRequest objectSubRequest = new ToolingSubRequest();
		ToolingSubRequest fieldSubRequest = new ToolingSubRequest();
		ToolingSubRequest fieldRetrieveSubRequest = new ToolingSubRequest();

		//CustomObject Query
		if (isCustomObject)
		{
			//URL For querying custom object
			String customObjectQueryUrl = String.isBlank(objectNS) ? toolingSObjectQueryUrl : toolingSObjectQueryWithNamespaceUrl.replace('__NAMESPACE__', objectNS);
			customObjectQueryUrl = customObjectQueryUrl.replace('__SOBJECTNAME__','CustomObject').replace('__NAMEFIELD__', 'DeveloperName');

			objectSubRequest.method = 'GET';
			objectSubRequest.referenceId = 'customobject_ref_id';
			objectSubRequest.url = customObjectQueryUrl.replace('__NAMEVALUE__', objectDeveloperName);

			compRequest.compositeRequest.add(objectSubRequest);
		}
		else
		{
			output.put('objectTableEnum', objectDeveloperName);
		}

		//CustomField Query
		//Url for querying custom field, given the above custom objects Id
		String tableEnumOrId = isCustomObject ? '@{' + objectSubRequest.referenceId + '.records[0].Id}' : objectDeveloperName;
		String customFieldQueryUrl = toolingSObjectQueryUrl.replace('__SOBJECTNAME__','CustomField').replace('__NAMEFIELD__', 'DeveloperName') + '+AND+TableEnumOrId=\'' + tableEnumOrId + '\'';

		fieldSubRequest.method = 'GET';
		fieldSubRequest.referenceId = 'customfield_ref_id';
		fieldSubRequest.url = customFieldQueryUrl.replace('__NAMEVALUE__', fieldDeveloperName);

		compRequest.compositeRequest.add(fieldSubRequest);

		//CustomField Retrieve
		fieldRetrieveSubRequest.method = 'GET';
		fieldRetrieveSubRequest.referenceId = 'customfield_retrieve_ref_id';
		fieldRetrieveSubRequest.url = toolingSObjectRetrieveUrl.replace('__SOBJECTNAME__','CustomField').replace('__PARENTREFID__', fieldSubRequest.referenceId);

		compRequest.compositeRequest.add(fieldRetrieveSubRequest);

		String toolingResponse = toolingRequest('POST', '/composite', JSON.serialize(compRequest));

		output.put('toolingResponse',toolingResponse);
		output.put('hasErrors', false);
		return output;
	}

	/**
	 * toolingQuerySObject uses the Tooling REST API to update the given SObject of SObjectType with Id ObjectId with the contents of the key objectPayload
	 * @param  inputs  inputs are the inputs of the method (not used)
	 * @param  output  output is the output of the method
	 * @param  options options are the parameters of the method in form:
	 *	{'ToolingAPI' => new Map<String,Object>{'SObjectType' => 'StaticResource', 'ObjectId' => '1545345363000', 'objectPayload' => {...}}}
	 * @return   return output (containing the tooling api response under the key toolingResponse, or an error message)
	 */
	public static Map<String,Object> toolingUpdateSObject(Map<String,Object> inputs,
	                                                      Map<String,Object> output,
	                                                      Map<String,Object> options)
	{
		output.put('hasErrors', true);
		Map<String,Object> sObjectOptions = (Map<String,Object>)options.get('ToolingAPI');

		String objectType = (String)sObjectOptions.get('SObjectType');
		String objectId = (String)sObjectOptions.get('objectId');
		String objectPayload = JSON.serialize(sObjectOptions.get('objectPayload'));

		String reqUrl = '/sobjects/' + objectType + '/' + objectId;
		String toolingResponse = toolingRequest('PATCH', reqUrl, objectPayload);

		output.put('toolingResponse',toolingResponse);
		output.put('hasErrors', false);
		return output;
	}

	/**
	 * toolingQuerySObject uses the Tooling REST API to create the given SObject of SObjectType with the contents of the key objectPayload
	 * @param  inputs  inputs are the inputs of the method (not used)
	 * @param  output  output is the output of the method
	 * @param  options options are the parameters of the method in form:
	 *	{'ToolingAPI' => new Map<String,Object>{'SObjectType' => 'StaticResource', 'objectPayload' => {...}}}
	 * @return   return output (containing the tooling api response under the key toolingResponse, or an error message)
	 */
	public static Map<String,Object> toolingCreateSObject(Map<String,Object> inputs,
	                                                      Map<String,Object> output,
	                                                      Map<String,Object> options)
	{
		output.put('hasErrors', true);
		Map<String,Object> sObjectOptions = (Map<String,Object>)options.get('ToolingAPI');

		String objectType = (String)sObjectOptions.get('SObjectType');
		String objectPayload = JSON.serialize(sObjectOptions.get('objectPayload'));

		String reqUrl = '/sobjects/' + objectType;
		String toolingResponse = toolingRequest('POST', reqUrl, objectPayload.replace('__SALESFORCEBASEURL__', dc.baseUrl));

		output.put('toolingResponse',toolingResponse);
		output.put('hasErrors', false);
		return output;
	}

    /**
	 * checkDefaultContractType queries vlocity_ins__ContractType__c records with the name 'Default', and returns an error if no record is found
	 * @param  inputs  inputs are the inputs of the method (not used)
	 * @param  output  output is the output of the method
	 * @param  options options are the parameters of the method (not used)
	 * @return   return output
	 */
	public static Map<String,Object> checkDefaultContractType(Map<String,Object> inputs,
	                                                          Map<String,Object> output,
	                                                          Map<String,Object> options)
	{
		List<vlocity_ins__ContractType__c> defaultContractTypes = [SELECT Id FROM vlocity_ins__ContractType__c WHERE Name='Default' LIMIT 5];

		Boolean noDefaultContractType = defaultContractTypes.isEmpty();

		if (noDefaultContractType)
		{
			String errorMessage = 'No Default Contract Type exists.';
			output.put('hasErrors', true);
			output.put('hasWarnings', true);
			output.put('errorMessage', errorMessage);
		}

		return output;
	}

    /**
	 * createDefaultContractType calls Vlocity wrapper class to create default contract type
	 * @param  inputs  inputs are the inputs of the method (not used)
	 * @param  output  output is the output of the method
	 * @param  options options are the parameters of the method (not used)
	 * @return   return output
	 */
	public static Map<String,Object> createDefaultContractType(Map<String,Object> inputs,
	                                                           Map<String,Object> output,
	                                                           Map<String,Object> options)
	{
		vlocity_ins.CmPostInstallClass.createDefaultContractType();
		output.put('hasErrors', false);
		return output;
	}


    /**
	 * runApexJob Executes an APEX job. It can be a batch or apex job.
	 * @param  inputs  inputs are the inputs of the method (not used)
	 * @param  output  output is the output of the method
	 * @param  options options are the parameters of the method (not used)
	 * @return   return output
	 */
    public static Map<String,Object> runApexJob(string jobType, Map<String,Object> inputs,
	                                                           Map<String,Object> output,
	                                                           Map<String,Object> options)
	{
		Map<String,Object> stepMap = dc.sObjectToMap(((UpgradeStep__c)inputs.get('record')));

        // Get the validation fields && input data
		Id batchJobId = (Id)stepMap.get('RelatedBatchJobId');

		String frequency = (String)stepMap.get('StepFrequency');
		String lastExecutionStatus = (String)stepMap.get('LastExecutionStatus');

        String jobName = (String) options.get('JobName');
		Integer batchSize = 200;
		if(options.containsKey('BatchSize'))
		{
			batchSize = (Integer) options.get('BatchSize');
		}
        String namespace = '';
		String capitalJobType = jobType == 'batch' ? 'Batch' : 'Apex';

        // Do we have namespace?
        if(jobName.indexOf('.') > -1)
        {
            List<String> parts = jobName.split('\\.');

            if(parts.size() > 2)
            {
                output.put('hasErrors', false);
                output.put('errorMessage', 'Invalid job name.');
                return output;
            }

            namespace = parts[0];
            jobName = parts[1];
        }

        try
		{
			Boolean jobFailed = false;
			if(batchJobId != null)
			{
				String batchJobStatus = [SELECT Status FROM AsyncApexJob WHERE Id = :batchJobId].Status;
				jobFailed = (batchJobStatus == 'Failed');
			}

			if(batchJobId == null || jobFailed)
            {
                Type t = Type.forName(namespace, jobName);
                if(t == null)
                {
                    output.put('hasErrors', true);
                    output.put('errorMessage', 'Could not find job ' + jobName);
                    return output;
                }

                if(jobType == 'batch')
                {
                    batchJobId = (Id)Database.executeBatch((Database.Batchable<Object>)t.newInstance(), batchSize);
                }
                else
                {
                    batchJobId = System.enqueueJob((Queueable)t.newInstance());
                }
		        output.put('infoMessage', capitalJobType + ' job ' + batchJobId + ' has been submitted.');
            }
			else 
			{
				output.put('infoMessage', capitalJobType + ' job ' + batchJobId + ' already submitted.');
			}
			output.put('hasErrors', false);
            output.put('hasInfos', true);
            output.put('batchJobId', batchJobId);
		}
		catch(Exception e)
		{
			output.put('hasErrors', true);
			output.put('errorMessage', 'Error while attempting to run the ' + jobType + ' job.');
		}
		return output;
	}


	/**
	 * toolingRequest makes an HTTP Request to the org's REST Tooling API
	 * @param  httpMethodName httpMethodName is the HTTP request method name (GET, POST, PATCH, etc.)
	 * @param  path           path is the given tooling API path (eg. /composite)
	 * @param  requestBody    requestBody is the body of the request (can be empty for GET requests)
	 * @return                return HTTP Response as String
	 */
	private static String toolingRequest(String httpMethodName, String path, String requestBody)
	{
		HTTPRequest req = new HTTPRequest();
		String reqEndpoint = dc.baseUrl +  toolingUrl + path;

		req.setMethod(httpMethodName);
		req.setHeader('Authorization', 'Bearer ' + VlocityDiagnosticWizardController.getVFSessionId());
		req.setHeader('Content-Type', 'application/json');

		if (httpMethodName == 'PATCH')
		{
			req.setHeader('X-HTTP-Method-Override','PATCH');
			req.setMethod('POST');
			reqEndpoint += '?_HttpMethod=PATCH';
		}

		req.setEndpoint(reqEndpoint);

		if (httpMethodName != 'GET')
		{
			req.setBody(requestBody);
		}

		String resBody = '';

		Http h = new Http();
		HttpResponse res = h.send(req);
		resBody = res.getBody();

		return resBody;
	}

	public class ToolingCompositeRequest {
		public Boolean allOrNone = false;
		public List<ToolingSubRequest> compositeRequest = new List<ToolingSubRequest>();
	}

	public class ToolingSubRequest {
		public String method;
		public String url;
		public String referenceId;
		public Object body;
	}
}
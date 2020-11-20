public class VlocityDiagnosticWizardDescriber
{
	public String nsPrefix;
	public String ns;

	/* Salesforce Base URL (replaces visualforce version if needed) */
	public final String baseUrl = URL.getSalesforceBaseUrl().toExternalForm().replaceAll('(--c\\.|\\.)([a-z]{0,3}[0-9]{0,3}\\.)?visual(\\.)?force\\.com', '.my.salesforce.com');

	public VlocityDiagnosticWizardDescriber()
	{
		String classNameSpace = (String) [SELECT NamespacePrefix FROM ApexClass WHERE Name LIKE '%DRAttributeService%'][0].NamespacePrefix;
		this.nsPrefix = classNameSpace + '__';
		this.ns = classNameSpace;
	}

	/**
	 * normalizeJSON receives a JSON string and returns a normalized Map<String,Object> with no namespaces or __c endings
	 * @param  jsonStr jsonStr is a serialized JSON string
	 * @return         return Map<String,Object> representation of jsonStr
	 */
	public Map<String,Object> normalizeJSON (String jsonStr)
	{
		Map<String,Object> oldMap = (Map<String,Object>) JSON.deserializeUntyped(jsonStr);
		return normalizeJSONMap(oldMap);
	}

	/**
	 * normalizeJSONMap receives a Map (from a static resource) and removes namespaces and __c endings of custom objects and fields
	 * @param  oldMap oldMap is the deserialized JSON
	 * @return        return a cleaned Map<String,Object> with no specific namespaces or __c endings
	 */
	public Map<String,Object> normalizeJSONMap (Map<String,Object> oldMap)
	{
		Map<String,Object> newMap = new Map<String,Object>();

		for (String key : oldMap.keySet())
		{
			String partialKey = key.removeStart(this.nsPrefix).removeEnd('__c');
			Object fieldValue = oldMap.get(key);

			if (fieldValue == null || partialKey.endsWith('__r'))
			{
				//Don't include relationship fields or null vals
				continue;
			}
			else if (fieldValue instanceof List<Object>)
			{
				//recursively parse lists
				List<Object> newFieldValue = new List<Object>();

				for (Object obj : (List<Object>) fieldValue)
				{
					newFieldValue.add(this.normalizeJSONMap((Map<String,Object>) obj));
				}

				newMap.put(partialKey, newFieldValue);
			}
			else if (partialKey.equalsIgnoreCase('Options') && fieldValue instanceof Map<String,Object>)
			{
				//for UpgradeStep__c Options field, serialize to JSON so it can save
				String optionString = JSON.serialize(fieldValue);

				if (!String.isBlank(optionString) && optionString != '""')
				{
					newMap.put(partialKey, optionString);
				}
			}
			else if (fieldValue instanceof Map<String,Object>)
			{
				//recursivley iterate through keys if value is a map
				newMap.put(partialKey, this.normalizeJSONMap((Map<String,Object>) fieldValue));
			}
			else
			{
				newMap.put(partialKey, fieldValue);
			}

		}
		return newMap;
	}

	public Map<String,Object> sObjectToMap(SObject sObj)
	{
		return sObjectToMap(sObj, true);
	}

	/**
	 * sObjectToMap receives an SObject record and removes namespaces and __c endings, returning a map
	 * @param  sObj sObj is any SObject record
	 * @return      return a cleaned Map<String, Object> representation of the SObj
	 */
	public Map<String,Object> sObjectToMap(SObject sObj, Boolean removePostFix)
	{
		try
		{
			Map<String,Object> oldMap = sObj.getPopulatedFieldsAsMap();
			Map<String,Object> newMap = new Map<String,Object>();

			for (String key : oldMap.keySet())
			{
				String partialKey = removePostFix ? key.removeStart(this.nsPrefix).removeEnd('__c') : key.removeStart(this.nsPrefix);
				Object fieldValue = oldMap.get(key);

				if (partialKey.endsWith('__r') && fieldValue instanceof List<Object>)
				{
					//recursive call if field is a related list relationship
					newMap.put(partialKey, this.sObjectToMap_List((List<SObject>) fieldValue));
				}
				else if (partialKey.endsWith('__r'))
				{
					//recursive call if the field is a master-detail / lookup relationship
					newMap.put(partialKey, this.sObjectToMap((SObject) fieldValue));
				}
				else
				{
					newMap.put(partialKey, fieldValue);
				}
			}

			return newMap;
		}
		catch (Exception e)
		{
			VlocityDiagnosticWizardController.throwAuraException('Error converting SObject to Map: ', e);
		}

		return null;
	}

	/**
	 * sObjectToMap receives a list of SObject records and removes namespaces and __c endings, returning a list of maps
	 * @param  sObjs sObjs is a list of SObject records (must be the same type)
	 * @return       return a cleaned List<Map<String, Object>> representation of the SObjs list
	 */
	public List<Map<String,Object> > sObjectToMap_List(List<SObject> sObjs)
	{
		try
		{
			List<Map<String,Object> > mapList = new List<Map<String,Object> >();

			for (SObject sObj : sObjs)
			{
				mapList.add( this.sObjectToMap(sObj) );
			}

			return mapList;
		}
		catch (Exception e)
		{
			VlocityDiagnosticWizardController.throwAuraException('Error converting List of SObject to Map: ', e);
		}

		return null;
	}

	/**
	 * mapToSObject receives a cleaned map representation of an SObject and restores its namespace and __c ending of fields
	 * @param  objMap   objMap is the cleaned map
	 * @param  sObjName sObjName is the sObj to be casted (eg. UpgradeStep__c or vlocity_ins__VlocitySystemLog__c)
	 * @return          return SObject that can then be cast into sObjName
	 */
	public SObject mapToSObject(Object obj, String sObjName)
	{
		try
		{
			SObjectType sObjType = this.getSObjectType(sObjName);
			Map<String,Schema.SObjectField> sObjFields = sObjType.getDescribe().fields.getMap();

			Map<String,Object> objMap = (Map<String,Object>) obj;
			return mapToSObjectHelper(objMap, sObjType, sObjFields);
		}
		catch (Exception e)
		{
			VlocityDiagnosticWizardController.throwAuraException('Error converting Map to SObject: ', e);
		}

		return null;
	}

	/**
	 * mapToSObject_List receives a list of cleaned map representations of SObjects and restores their namespace and __c ending of fields
	 * @param  objList   mapList is a list of cleaned maps
	 * @param  sObjName  sObjName is the sObj to be casted (eg. UpgradeStep__c or vlocity_ins__VlocitySystemLog__c)
	 * @return           return List<SObject> that can then be cast into List<sObjName>
	 */
	public List<SObject> mapToSObject_List(List<Object> objList, String sObjName)
	{
		try
		{
			SObjectType sObjType = this.getSObjectType(sObjName);
			Map<String,Schema.SObjectField> sObjFields = sObjType.getDescribe().fields.getMap();

			List<SObject> sObjList = new List<SObject>();

			for (Object obj : objList)
			{
				Map<String,Object> objMap = (Map<String,Object>) obj;
				sObjList.add( mapToSObjectHelper(objMap, sObjType, sObjFields) );
			}

			return sObjList;
		}
		catch (Exception e)
		{
			VlocityDiagnosticWizardController.throwAuraException('Error converting List of Map to SObject: ', e);
		}

		return null;
	}

	/**
	 * getTypeAndFields returns the SObjectType and SObjectFields related to the given sObject name
	 * @param  sObjName sObjName the name of the desired SObject
	 * @return          return Map<String,Object> with keys SObjectType, SObjectFields
	 */
	public SObjectType getSObjectType(String sObjName)
	{
		//Check name with namespace first
		String nsName = sObjName.startsWith(this.nsPrefix) ? sObjName : this.nsPrefix + sObjName;

		SObjectType sObjType = Schema.getGlobalDescribe().get(nsName);

		if (sObjType == null)
		{
			String alternateName = nsName.removeStart(this.nsPrefix);
			sObjType = Schema.getGlobalDescribe().get(alternateName);
		}

		return sObjType;
	}

	/**
	 * getProperFieldName returns a namespace-friendly fieldname for the given base field name
	 * @param  fieldName  fieldName is the name of a SObject field
	 * @param  sObjFields sObjFields is a Map of fields from an SObject
	 * @return            return matching field name or null
	 */
	public String getProperFieldName(String fieldName, Map<String,Schema.SObjectField> sObjFields)
	{
		String key = fieldName.removeStart(this.nsPrefix).removeEnd('__c');

		List<String> keys = new List<String> {this.nsPrefix+key+'__c', key+'__c', key};

		for (String item : keys)
		{
			if (!item.endsWith('__r') && sObjFields.containsKey(item.toLowerCase()))
			{
				return item;
			}
		}

		return null;
	}

	/**
	 * mapToSObjectHelper receives a cleaned map representation of an SObject, the SObject type, and a Map of its schema fields, then builds the desired SObject
	 * @param  objMap     objMap is the cleaned map
	 * @param  sObjType   sObjType is the SObjectType of the desired SObject
	 * @param  sObjFields sObjFields is a map of the SObjectField elements of the desired SObject
	 * @return            return SObject that can be cast into sObjType
	 */
	private SObject mapToSObjectHelper(Map<String,Object> objMap, SObjectType sObjType, Map<String,Schema.SObjectField> sObjFields)
	{
		SObject sObj = sObjType.newSObject();

		for (String key : objMap.keySet())
		{
			String properKey = getProperFieldName(key, sObjFields);

			if (properKey == null)
			{
				continue;
			}

			Schema.DisplayType dt = sObjFields.get(properKey.toLowerCase()).getDescribe().getType();

			switch on dt
			{
				when DATETIME
				{
					sObj.put(properKey, (DateTime) JSON.deserialize(JSON.serialize(objMap.get(key)), DateTime.class));
				}
				when else
				{
					sObj.put(properKey, objMap.get(key));
				}
			}
		}

		return sObj;
	}
}
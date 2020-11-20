{
    "type": "VlocityStepCreator",
    "fileName": "VlocityStepCreator_VCloud",
    "plan": {
        "Name": "VCloud",
        "UniqueId": "VCloud"
    },
    "steps": [
        {
            "ExternalId": "subscribeToCloudService",
            "UniqueId": "subscribeToCloudService",
            "Name": "Subscribe to Vlocity Cloud Service",
            "Priority": "None",
            "Tags": "CLM VCloud (Beta)",
            "VersionIntroduced": "",
            "IsActive": true,
            "Type": "Auto",
            "StepFrequency": "Diagnostic",
            "Instruction": "<p>Copy and paste the <b>HashCode</b> and <b>EncryptedSecret</b> that you received from the authorization email for Vlocity Cloud Service to the appropriate fields. Save the information. Then execute the step. <i><b>Important:</b> Every HashCode and EncryptedSecret is assigned to a specific Salesforce org, so you must copy this information to the correct org.</i></p>",
            "CustomInputLabel": "HashCode",
            "CustomInputValue": "",
            "CustomInputLabel2": "EncryptedSecret",
            "CustomInputValue2": "",
            "Options": {
                "hashCode": "__CUSTOMINPUT__",
                "encryptedSecret": "__CUSTOMINPUT2__"
            },
            "ArgumentList": "",
            "StepCommand": "",
            "CheckResultUrl": "",
            "PrecursorStepUniqueId": "",
            "ParentStepUniqueId": "",
            "PreCheckMethod": "$VlocityNS.VCloudServiceInstallationAssistant.hasSubscription",
            "PostCheckMethod": "",
            "ExecutionMethod": "$VlocityNS.VCloudServiceInstallationAssistant.subscribeToCloudService"
        }
    ]

}

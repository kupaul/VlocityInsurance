{
    "dataPackId": "",
    "dataPacks": [
        {
            "VlocityDataPackData": {
                "%vlocity_namespace%__VlocityUITemplate__c": [
                    {
                        "%vlocity_namespace%__Active__c": true,
                        "%vlocity_namespace%__Author__c": "Vlocity",
                        "%vlocity_namespace%__CustomJavascript__c": "baseCtrl.prototype.setIPScope = function(scp) {\n    'use strict';\n    var afterSlash = '/' + window.location.href.split('.com/')[1].split('/')[0];\n    window.VlocOmniSI = scp;\n    if (afterSlash === 'apex') {\n        afterSlash = '';\n    }\n    scp.applyCallResp({\n        urlPrefix: window.location.origin + afterSlash\n    });\n\n    window.addEventListener('message', function(event) {\n        if (event.data && event.data.constructor === Object && event.data.hasOwnProperty('docGenAttachmentId')) {\n            baseCtrl.prototype.$scope.bpTree.response.isWordAttachDone = true;\n            window.VlocOmniSI.applyCallResp(event.data);\n            scp.aggregate(scp, scp.control.index, scp.control.indexInParent, true, -1);\n        }\n        if (event.data && event.data.constructor === Object && event.data.hasOwnProperty('pdfGenAttachmentId')) {\n            baseCtrl.prototype.$scope.bpTree.response.isPDFAttachDone = true;\n            window.VlocOmniSI.applyCallResp(event.data);\n            scp.aggregate(scp, scp.control.index, scp.control.indexInParent, true, -1);\n        }\n        if (event.data && event.data.constructor === Object && event.data.hasOwnProperty('deleteAttachment')) {\n            delete baseCtrl.prototype.$scope.bpTree.response.isWordAttachDone;\n            delete baseCtrl.prototype.$scope.bpTree.response.docGenAttachmentId;\n            delete baseCtrl.prototype.$scope.bpTree.response.isPDFAttachDone;\n            delete baseCtrl.prototype.$scope.bpTree.response.pdfGenAttachmentId;\n            delete event.data.deleteAttachment;\n            window.VlocOmniSI.applyCallResp(event.data);\n            scp.aggregate(scp, scp.control.index, scp.control.indexInParent, true, -1);\n        }\n    }, false);\n};",
                        "%vlocity_namespace%__Definition__c": "",
                        "%vlocity_namespace%__Description__c": "",
                        "%vlocity_namespace%__DisplayOn__c": "",
                        "%vlocity_namespace%__ExternalID__c": "object-document-creation-default/1/Vlocity/1494014625407",
                        "%vlocity_namespace%__HTML__c": "<div ng-if=\"baseCtrl.setIPScope(this)\"></div>\n<iframe ng-if=\"bpTree.response.docId\" ng-show=\"src = bpTree.response.urlPrefix + '/apex/' + baseCtrl.$scope.nsPrefix + 'ObjectDocumentCreationNew?id='+bpTree.response.docId+'&templateId='+bpTree.response.templateId+'&documentName='+bpTree.response.documentName+'&contextId='+bpTree.response.contextId\" id=\"obj-doc-creation-os-iframe\" ng-src=\"{{src}}\" style=\"width: 100%; border: none;\" height=\"0\" onload=\"this.height = '200';\" vloc-prop-set=\"{{control.propSetMap}}\"></iframe>",
                        "%vlocity_namespace%__ParentID__c": "",
                        "%vlocity_namespace%__SampleJson__c": "{\"AddToCart\":\"Add to Cart\",\"OmniMonthly\":\"Monthly Cost\",\"OmniOneTime\":\"One Time Cost\",\"control\":{\"itemsKey\":\"results\",\"propSetMap\":{\"label\":\"Property Label\"},\"vlcSI\":{\"results\":[{\"Description\":\"Product Description\",\"MonthlyCost\":20,\"Name\":\"Product Name\",\"OneTimeCost\":100,\"added\":false}]}}}",
                        "%vlocity_namespace%__Type__c": "OmniScript Selectable Items",
                        "%vlocity_namespace%__Version__c": 1,
                        "Name": "object-document-creation-default",
                        "VlocityDataPackIsIncluded": true,
                        "VlocityDataPackType": "SObject",
                        "VlocityRecordSObjectType": "%vlocity_namespace%__VlocityUITemplate__c",
                        "VlocityRecordSourceKey": "VlocityUITemplate/object-document-creation-default/%vlocity_namespace%__VlocityUITemplate__c/object-document-creation-default"
                    }
                ],
                "VlocityDataPackIsIncluded": true,
                "VlocityDataPackKey": "VlocityUITemplate/object-document-creation-default",
                "VlocityDataPackType": "VlocityUITemplate"
            },
            "VlocityDataPackIsIncluded": true,
            "VlocityDataPackKey": "VlocityUITemplate/object-document-creation-default",
            "VlocityDataPackName": "object-document-creation-default",
            "VlocityDataPackRelationshipType": "Primary",
            "VlocityDataPackStatus": "Success",
            "VlocityDataPackType": "VlocityUITemplate"
        },
        {
            "VlocityDataPackData": {
                "%vlocity_namespace%__VlocityUITemplate__c": [
                    {
                        "%vlocity_namespace%__Active__c": true,
                        "%vlocity_namespace%__Author__c": "Vlocity",
                        "%vlocity_namespace%__CustomJavascript__c": "baseCtrl.prototype.setDocXIPScope = function(scp) {\n    'use strict';\n    var afterSlash = '/' + window.location.href.split('.com/')[1].split('/')[0];\n    window.VlocOmniSI = scp;\n    if (afterSlash === 'apex') {\n        afterSlash = '';\n    }\n    scp.applyCallResp({\n        urlPrefix: window.location.origin + afterSlash\n    });\n\n    window.bpTreeResponseSent = false;\n    window.addEventListener('message', function(event) {\n        if (event.data && event.data.constructor === Object && event.data.hasOwnProperty('docGenContentVersionId')) {\n            baseCtrl.prototype.$scope.bpTree.response.isWordAttachDone = true;\n            window.VlocOmniSI.applyCallResp(event.data);\n            scp.aggregate(scp, scp.control.index, scp.control.indexInParent, true, -1);\n        }\n        else if (event.data && event.data.constructor === Object && event.data.hasOwnProperty('pdfGenContentVersionId')) {\n            baseCtrl.prototype.$scope.bpTree.response.isPDFAttachDone = true;\n            window.VlocOmniSI.applyCallResp(event.data);\n            scp.aggregate(scp, scp.control.index, scp.control.indexInParent, true, -1);\n        }\n        if (event.data && event.data.constructor === Object && event.data.hasOwnProperty('GET_BPTREE_RESPONSE')) {\n            if (!window.bpTreeResponseSent) {\n                var fContentWindow = document.getElementById('obj-doc-creation-docx-os-iframe').contentWindow;\n                fContentWindow.postMessage({'clmDocxBpTreeResponse': baseCtrl.prototype.$scope.bpTree.response}, '*');\n                window.bpTreeResponseSent = true;\n            }\n        }\n    }, false);\n};",
                        "%vlocity_namespace%__Definition__c": "",
                        "%vlocity_namespace%__Description__c": "",
                        "%vlocity_namespace%__DisplayOn__c": "",
                        "%vlocity_namespace%__ExternalID__c": "object-document-creation-docx-template/2/Vlocity/1537469682918",
                        "%vlocity_namespace%__HTML__c": "<div ng-if=\"baseCtrl.setDocXIPScope(this)\"></div>\n<iframe ng-show=\"src = bpTree.response.urlPrefix + '/apex/' + baseCtrl.$scope.nsPrefix + 'ObjectDocumentCreationDocXTemplate'\" id=\"obj-doc-creation-docx-os-iframe\" ng-src=\"{{src}}\" style=\"width: 100%; border: none;\" height=\"0\" onload=\"this.height = '500';\" vloc-prop-set=\"{{control.propSetMap}}\"></iframe>",
                        "%vlocity_namespace%__ParentID__c": "object-document-creation-default/1/Vlocity/1494014625407",
                        "%vlocity_namespace%__SampleJson__c": "{\"AddToCart\":\"Add to Cart\",\"OmniMonthly\":\"Monthly Cost\",\"OmniOneTime\":\"One Time Cost\",\"control\":{\"itemsKey\":\"results\",\"propSetMap\":{\"label\":\"Property Label\"},\"vlcSI\":{\"results\":[{\"Description\":\"Product Description\",\"MonthlyCost\":20,\"Name\":\"Product Name\",\"OneTimeCost\":100,\"added\":false}]}}}",
                        "%vlocity_namespace%__Type__c": "OmniScript Selectable Items",
                        "%vlocity_namespace%__Version__c": 2,
                        "Name": "object-document-creation-docx-template",
                        "VlocityDataPackIsIncluded": true,
                        "VlocityDataPackType": "SObject",
                        "VlocityRecordSObjectType": "%vlocity_namespace%__VlocityUITemplate__c",
                        "VlocityRecordSourceKey": "VlocityUITemplate/object-document-creation-docx-template/%vlocity_namespace%__VlocityUITemplate__c/object-document-creation-docx-template"
                    }
                ],
                "VlocityDataPackIsIncluded": true,
                "VlocityDataPackKey": "VlocityUITemplate/object-document-creation-docx-template",
                "VlocityDataPackType": "VlocityUITemplate"
            },
            "VlocityDataPackIsIncluded": true,
            "VlocityDataPackKey": "VlocityUITemplate/object-document-creation-docx-template",
            "VlocityDataPackName": "object-document-creation-docx-template",
            "VlocityDataPackRelationshipType": "Primary",
            "VlocityDataPackStatus": "Success",
            "VlocityDataPackType": "VlocityUITemplate"
        },
        {
            "VlocityDataPackData": {
                "%vlocity_namespace%__VlocityUITemplate__c": [
                    {
                        "%vlocity_namespace%__Active__c": true,
                        "%vlocity_namespace%__Author__c": "vlocityDev",
                        "%vlocity_namespace%__CustomJavascript__c": "baseCtrl.prototype.setMultiDocXIPScope = function(scp) {\n    'use strict';\n    var afterSlash = '/' + window.location.href.split('.com/')[1].split('/')[0];\n    window.VlocOmniSI = scp;\n    if (afterSlash === 'apex') {\n        afterSlash = '';\n    }\n    scp.applyCallResp({\n        urlPrefix: window.location.origin + afterSlash\n    });\n\n    var insightFeed = {\n        url: baseCtrl.prototype.$scope.bpTree.response.urlPrefix + '/apex/' + baseCtrl.prototype.$scope.nsPrefix + 'ObjectDocumentCreationDocXTemplate', \n        loadIframe: function(templateId) {\n            var wvElement = document.getElementById('viewer');\n            // wvElement.setAttribute('height','500px');\n            // wvElement.setAttribute('width','500px');\n            var iframe = document.createElement('iframe');\n            iframe.style.display = \"block\";\n            iframe.style.height = \"420px\";\n            iframe.style.width = \"700px\";\n            iframe.style.border = \"none\";\n            iframe.src = insightFeed.url;\n            iframe.Id = templateId;\n            iframe.setAttribute('Id', templateId);\n            wvElement.appendChild(iframe);\n            console.log(wvElement);\n            baseCtrl.prototype.$scope.bpTree.response.currentTemplateId = templateId;\n            \n        }\n    };\n\n\n    if(baseCtrl.prototype.$scope.bpTree.response.tracker === undefined && baseCtrl.prototype.$scope.bpTree.response.generateMultipleDocument) {\n        insightFeed.loadIframe(baseCtrl.prototype.$scope.bpTree.response.PickTemplate.MultiDocumentTemplate[0].Id);\n        baseCtrl.prototype.$scope.bpTree.response.tracker = 0;\n    }\n    window.addEventListener('message', function(event) { \n        if (event.data && event.data.constructor === Object && event.data.hasOwnProperty('docGenContentVersionId')) {\n            baseCtrl.prototype.$scope.bpTree.response.isWordAttachDone = true;\n            window.VlocOmniSI.applyCallResp(event.data);\n            baseCtrl.prototype.$scope.bpTree.response.isPDFAttachDone = false;\n            scp.aggregate(scp, scp.control.index, scp.control.indexInParent, true, -1);\n            var attachFileFormat = baseCtrl.prototype.$scope.bpTree.response.attachFileFormat && baseCtrl.prototype.$scope.bpTree.response.attachFileFormat.toLowerCase();\n            var documentType = ((baseCtrl.prototype.$scope.bpTree.response.documentType && baseCtrl.prototype.$scope.bpTree.response.documentType) || 'all')\n            var showDownloadPDF = (documentType === 'all' || documentType === 'pdf');\n\n            if((attachFileFormat && attachFileFormat.indexOf(\"pdf\") < 0 && !showDownloadPDF) && (baseCtrl.prototype.$scope.bpTree.response.docGenerationContentVersionId != event.data.docGenContentVersionId)) {\n                var i = baseCtrl.prototype.$scope.bpTree.response.tracker + 1;\n                if(i < baseCtrl.prototype.$scope.bpTree.response.PickTemplate.MultiDocumentTemplate.length){\n                    baseCtrl.prototype.$scope.bpTree.response.isWordAttachDone = false;\n                    baseCtrl.prototype.$scope.bpTree.response.docGenerationContentVersionId = event.data.docGenContentVersionId;\n                    window.bpTreeResponseSent = false;\n                    insightFeed.loadIframe(baseCtrl.prototype.$scope.bpTree.response.PickTemplate.MultiDocumentTemplate[i].Id);\n                    baseCtrl.prototype.$scope.bpTree.response.tracker++;\n                    baseCtrl.prototype.$scope.bpTree.response.previousTemplateId = baseCtrl.prototype.$scope.bpTree.response.PickTemplate.MultiDocumentTemplate[i].Id\n\n                }\n            }\n        }\n        else if (event.data && event.data.constructor === Object && baseCtrl.prototype.$scope.bpTree.response.isPDFAttachDone == false && event.data.hasOwnProperty('pdfGenContentVersionId')) {\n            baseCtrl.prototype.$scope.bpTree.response.isPDFAttachDone = true;\n            window.VlocOmniSI.applyCallResp(event.data);\n            scp.aggregate(scp, scp.control.index, scp.control.indexInParent, true, -1);\n            var i = baseCtrl.prototype.$scope.bpTree.response.tracker + 1; \n            if(i < baseCtrl.prototype.$scope.bpTree.response.PickTemplate.MultiDocumentTemplate.length){\n                window.bpTreeResponseSent = false;\n                insightFeed.loadIframe(baseCtrl.prototype.$scope.bpTree.response.PickTemplate.MultiDocumentTemplate[i].Id);\n                baseCtrl.prototype.$scope.bpTree.response.tracker++;\n            }\n        }\n        if (event.data && event.data.constructor === Object && event.data.hasOwnProperty('GET_BPTREE_RESPONSE')) {\n            \n            // if(i < document.getElementsByTagName('iframe').length){\n            //     window.bpTreeResponseSent = false;\n            // }\n            if (!window.bpTreeResponseSent) {\n\n                var frameId = baseCtrl.prototype.$scope.bpTree.response.currentTemplateId;\n                var tempId = baseCtrl.prototype.$scope.bpTree.response.currentTemplateId;\n            //    // window.alert('templateId')\n                baseCtrl.prototype.$scope.bpTree.response.templateId = tempId;\n                //window.VlocOmniSI.applyCallResp(baseCtrl.prototype.$scope.bpTree.response);\n                scp.aggregate(scp, scp.control.index, scp.control.indexInParent, true, -1);\n                //window.alert('baseCtrl.prototype.$scope.bpTree.response.templateId::'+baseCtrl.prototype.$scope.bpTree.response.templateId);\n                var fContentWindow = document.getElementById(frameId).contentWindow;\n                fContentWindow.postMessage({'clmDocxBpTreeResponse': baseCtrl.prototype.$scope.bpTree.response}, '*');\n                window.bpTreeResponseSent = true;\n                //baseCtrl.prototype.$scope.bpTree.response.tracker++;\n            }\n        }\n    }, false);\n};",
                        "%vlocity_namespace%__Definition__c": "",
                        "%vlocity_namespace%__Description__c": "",
                        "%vlocity_namespace%__DisplayOn__c": "",
                        "%vlocity_namespace%__ExternalID__c": "object-multi-document-creation-docx-template/1/vlocityDev/1572396285486",
                        "%vlocity_namespace%__HTML__c": "<div ng-if=\"baseCtrl.setMultiDocXIPScope(this)\"></div>\n<div id=\"viewer\" class=\"pdfViewer\"  style='width: 100px; height: 100%;'></div>\n\n<!-- <div ng-repeat=\"template in bpTree.response.PickTemplate.DocumentTemplate\"> \n<iframe ng-show=\"src = bpTree.response.urlPrefix + '/apex/' + baseCtrl.$scope.nsPrefix + 'ObjectDocumentCreationDocXTemplate'\" Id=\"{{template.Id}}\" ng-src=\"{{src}}\" style=\"width: 100%; border: none;\" height=\"0\" onload=\"this.height = '500';\" vloc-prop-set=\"{{control.propSetMap}}\"></iframe> -->",
                        "%vlocity_namespace%__ParentID__c": "object-multi-document-creation/1/vlocityDev/1572293185818",
                        "%vlocity_namespace%__SampleJson__c": "{\"AddToCart\":\"Add to Cart\",\"OmniMonthly\":\"Monthly Cost\",\"OmniOneTime\":\"One Time Cost\",\"control\":{\"itemsKey\":\"results\",\"propSetMap\":{\"label\":\"Property Label\"},\"vlcSI\":{\"results\":[{\"Description\":\"Product Description\",\"MonthlyCost\":20,\"Name\":\"Product Name\",\"OneTimeCost\":100,\"added\":false}]}}}",
                        "%vlocity_namespace%__Type__c": "OmniScript Selectable Items",
                        "%vlocity_namespace%__Version__c": 1,
                        "Name": "object-multi-document-creation-docx-template",
                        "VlocityDataPackIsIncluded": true,
                        "VlocityDataPackType": "SObject",
                        "VlocityRecordSObjectType": "%vlocity_namespace%__VlocityUITemplate__c",
                        "VlocityRecordSourceKey": "VlocityUITemplate/object-multi-document-creation-docx-template/%vlocity_namespace%__VlocityUITemplate__c/object-multi-document-creation-docx-template"
                    }
                ],
                "VlocityDataPackIsIncluded": true,
                "VlocityDataPackKey": "VlocityUITemplate/object-multi-document-creation-docx-template",
                "VlocityDataPackType": "VlocityUITemplate"
            },
            "VlocityDataPackIsIncluded": true,
            "VlocityDataPackKey": "VlocityUITemplate/object-multi-document-creation-docx-template",
            "VlocityDataPackName": "object-multi-document-creation-docx-template",
            "VlocityDataPackRelationshipType": "Primary",
            "VlocityDataPackStatus": "Success",
            "VlocityDataPackType": "VlocityUITemplate"
        }
    ],
    "name": "ObjectDocumentCreation",
    "primaryDataPackKey": "VlocityDeploy",
    "processMultiple": true,
    "status": "Complete",
    "version": 1
}
{
    "dataPackId": "",
    "dataPacks": [
        {
            "VlocityDataPackAllRelationships": null,
            "VlocityDataPackData": {
                "%vlocity_namespace%__VlocityUITemplate__c": [
                    {
                        "%vlocity_namespace%__Active__c": true,
                        "%vlocity_namespace%__Author__c": "Vlocity",
                        "%vlocity_namespace%__CSS__c": ".via-slds .ins-os-product-rules-review-wrapper p {\n  margin-bottom: 1rem; }\n  .via-slds .ins-os-product-rules-review-wrapper p a {\n    color: #16325C; }\n\n.via-slds .ins-os-product-rules-review-wrapper .ins-os-product-rules-review-card {\n  border: 1px solid #0070D2;\n  background-color: #F8FBFE;\n  color: #16325C;\n  border-radius: 0.25rem;\n  padding: 1.25rem 1.5rem;\n  margin-bottom: 1.5rem;\n  line-height: 1.4; }\n  .via-slds .ins-os-product-rules-review-wrapper .ins-os-product-rules-review-card .ins-os-product-rules-review-rule {\n    font-size: 0.8125rem; }\n    .via-slds .ins-os-product-rules-review-wrapper .ins-os-product-rules-review-card .ins-os-product-rules-review-rule .ins-os-product-rules-review-rule-number span {\n      width: 1.75rem;\n      height: 1.75rem;\n      display: block;\n      background-color: #0070D2;\n      border-radius: 50%;\n      color: white;\n      text-align: center;\n      line-height: 1.75rem; }\n    .via-slds .ins-os-product-rules-review-wrapper .ins-os-product-rules-review-card .ins-os-product-rules-review-rule .ins-os-product-rules-review-rule-details h4 {\n      font-weight: bold; }\n",
                        "%vlocity_namespace%__CustomJavascript__c": "vlocity.cardframework.registerModule.controller('insOsProductRulesReviewCtrl', ['$scope', function($scope) {\n    'use strict';\n    $scope.initProductRulesReview = function(control) {\n        console.log('control', control);\n    };\n}]);",
                        "%vlocity_namespace%__Definition__c": "",
                        "%vlocity_namespace%__Description__c": "",
                        "%vlocity_namespace%__DisplayOn__c": "",
                        "%vlocity_namespace%__ExternalID__c": "ins-os-product-rules-review/1/Vlocity/1512769424162",
                        "%vlocity_namespace%__HTML__c": "<div class=\"ins-os-product-rules-review-wrapper\" ng-controller=\"insOsProductRulesReviewCtrl\" ng-if=\"control.vlcSI[control.itemsKey]\" ng-init=\"initProductRulesReview(control)\">\n    <div class=\"ins-os-product-rules-review-container\">\n        <p>Thank You!  Your application has been submitted to our underwriting department for review.  The underwriting will be evaluating the following areas.</p>\n        <div class=\"ins-os-product-rules-review-card\">\n            <div class=\"slds-size--1-of-1 slds-m-bottom--medium\">\n                <h3><strong>Underwriting Evaluation</strong></h3>\n            </div>\n            <div class=\"slds-grid slds-m-bottom--medium ins-os-product-rules-review-rule\" ng-repeat=\"p in control.vlcSI[control.itemsKey]\">\n                <div class=\"slds-max-small-size--1-of-6 slds-size--1-of-12 slds-m-top--xxx-small ins-os-product-rules-review-rule-number\"><span>{{$index + 1}}</span></div>\n                <div class=\"slds-max-small-size--5-of-6 slds-size--11-of-12 ins-os-product-rules-review-rule-details\">\n                    <h4><strong>{{p.ruleDetails['requirement name']}}</strong></h4>\n                    <p class=\"slds-m-bottom--none\"><em>{{p.ruleDetails.message}}</em></p>\n                </div>\n            </div>\n        </div>\n        <p>We look forward to serving you as your insurance needs evolve. Please contact us at <a href=\"https://www.vlocity.com/\" target=\"_blank\"><strong>www.vlocity.com</strong></a>, via email at <a href=\"mailto:customerservice@vlocity.com\"><strong>customerservice@vlocity.com</strong></a> or or via phone at <a href=\"tel:18448562489\"><strong>888.Vlocity</strong></a> if we can be of assistance.</p>\n    </div>\n</div>",
                        "%vlocity_namespace%__ParentID__c": "",
                        "%vlocity_namespace%__SampleJson__c": "{\n    \"AddToCart\": \"Add to Cart\",\n    \"OmniMonthly\": \"Monthly Cost\",\n    \"OmniOneTime\": \"One Time Cost\",\n    \"control\": {\n        \"itemsKey\": \"results\",\n        \"propSetMap\": {\n            \"label\": \"Property Label\"\n        },\n        \"vlcSI\": {\n            \"results\": [\n                {\n                    \"Description\": \"Product Description\",\n                    \"MonthlyCost\": 20,\n                    \"Name\": \"Product Name\",\n                    \"OneTimeCost\": 100,\n                    \"added\": false\n                }\n            ]\n        }\n    }\n}",
                        "%vlocity_namespace%__Sass__c": ".via-slds {\n    .ins-os-product-rules-review-wrapper {\n        p {\n            margin-bottom: 1rem;\n            \n            a {\n                color: #16325C;\n            }\n        }\n        \n        .ins-os-product-rules-review-card {\n            border: 1px solid #0070D2;\n            background-color: #F8FBFE;\n            color: #16325C;\n            border-radius: 0.25rem;\n            padding: 1.25rem 1.5rem;\n            margin-bottom: 1.5rem;\n            line-height: 1.4;\n\n            .ins-os-product-rules-review-rule {\n                font-size: 0.8125rem;\n\n                .ins-os-product-rules-review-rule-number {\n                    span {\n                        width: 1.75rem;\n                        height: 1.75rem;\n                        display: block;\n                        background-color: #0070D2;\n                        border-radius: 50%;\n                        color: white;\n                        text-align: center;\n                        line-height: 1.75rem;\n                    }\n                }\n                .ins-os-product-rules-review-rule-details {\n                    h4 {\n                        font-weight: bold;\n                    }\n                }\n            }\n        }\n    }\n\n    @media screen and (max-width: 650px) {\n        .ins-os-product-rules-review-wrapper {\n            .ins-os-product-rules-review-card {\n                \n            }\n        }\n    }\n}",
                        "%vlocity_namespace%__Type__c": "OmniScript Selectable Items",
                        "%vlocity_namespace%__Version__c": 1,
                        "Name": "ins-os-product-rules-review",
                        "VlocityDataPackIsIncluded": true,
                        "VlocityDataPackType": "SObject",
                        "VlocityRecordSObjectType": "%vlocity_namespace%__VlocityUITemplate__c",
                        "VlocityRecordSourceKey": "VlocityUITemplate/ins-os-product-rules-review/%vlocity_namespace%__VlocityUITemplate__c/ins-os-product-rules-review"
                    }
                ],
                "VlocityDataPackIsIncluded": true,
                "VlocityDataPackKey": "VlocityUITemplate/ins-os-product-rules-review",
                "VlocityDataPackType": "VlocityUITemplate"
            },
            "VlocityDataPackIsIncluded": true,
            "VlocityDataPackKey": "VlocityUITemplate/ins-os-product-rules-review",
            "VlocityDataPackName": "ins-os-product-rules-review",
            "VlocityDataPackStatus": "Success",
            "VlocityDataPackType": "VlocityUITemplate"
        }
    ],
    "name": "InsOSProductRulesReview",
    "primaryDataPackKey": "VlocityDeploy",
    "processMultiple": true,
    "status": "Complete",
    "version": 1
}
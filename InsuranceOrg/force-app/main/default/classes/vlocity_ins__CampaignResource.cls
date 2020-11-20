/*
This file is generated and isn't the actual source code for this
managed global class.
This read-only file shows the class's global constructors,
methods, variables, and properties.
To enable code to compile, all methods return null.
*/
@RestResource(urlMapping='/v1/campaign/*')
global class CampaignResource {
    global CampaignResource() {

    }
    @HttpGet
    global static Map<String,String> doGet() {
        return null;
    }
    @HttpPost
    global static Map<String,String> doPost(String campName, List<vlocity_ins.CampaignMemberStatusObject> customStatus, List<String> contactIds, String contentId) {
        return null;
    }
    @HttpPut
    global static void doPut(List<vlocity_ins.CampaignMemberStatusObject> customStatus, List<String> contactIds, Map<String,Boolean> contents) {

    }
}

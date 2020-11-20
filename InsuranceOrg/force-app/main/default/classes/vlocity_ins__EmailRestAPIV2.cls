/*
This file is generated and isn't the actual source code for this
managed global class.
This read-only file shows the class's global constructors,
methods, variables, and properties.
To enable code to compile, all methods return null.
*/
@RestResource(urlMapping='/v2/campaign/email')
global class EmailRestAPIV2 {
    global EmailRestAPIV2() {

    }
    @HttpPost
    global static vlocity_ins.EmailRestAPIV2.VlocityEmailResponseObjectV2 doPost(vlocity_ins.EmailRestAPIV2.VlocityEmailV2 email) {
        return null;
    }
global class VlocityEmailResponseObjectV2 {
    global String responseMessage;
    global Boolean successful;
    global VlocityEmailResponseObjectV2() {

    }
}
global class VlocityEmailV2 {
    global String body;
    global String campaignId;
    global String contentId;
    global String subject;
    global List<String> toContactId;
    global List<String> toExternalEmailAddresses;
    global VlocityEmailV2() {

    }
}
}

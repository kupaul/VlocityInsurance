/*
This file is generated and isn't the actual source code for this
managed global class.
This read-only file shows the class's global constructors,
methods, variables, and properties.
To enable code to compile, all methods return null.
*/
@RestResource(urlMapping='/v1/campaign/email')
global class EmailRestAPI {
    global EmailRestAPI() {

    }
    @HttpPost
    global static Boolean doPost(vlocity_ins.EmailRestAPI.VlocityEmail email) {
        return null;
    }
global class VlocityEmail {
    global String body;
    global String campaignId;
    global String contentId;
    global String subject;
    global List<String> toContactId;
    global List<String> toExternalEmailAddresses;
    global VlocityEmail() {

    }
}
global class VlocityEmailResponseObject {
    global String responseMessage;
    global Boolean successful;
    global VlocityEmailResponseObject() {

    }
}
}

global with sharing class CommAutoApplicationDocumentUploadDriver implements vlocity_ins.VlocityOpenInterface2{

    /*
 * Kirk Leibert
 * Vlocity - Energy
 * Class used to generate request for Google Vision OCR service - request contains base64 encoded image
 */

    global Boolean invokeMethod(String methodName,
                                Map<String,Object> inputMap,
                                Map<String,Object> outputMap,
                                Map<String,Object> options) {

        System.debug('methodName: ' + methodName);
        System.debug('inputMap: ' + inputMap);
        System.debug('options: ' + options);

        if(methodName == 'createRequest') {
            return createRequest(inputMap, outputMap);
        }
        return false;

    }

    private String mapGetString(Map<String, Object> m, String p) {
        return String.valueOf(m.get(p));
    }

    private List<Object> mapGetList(Map<String, Object> m, String p) {
        return (List<Object>) (m.get(p));
    }

    private Map<String,Object> listGetMap(List<Object> l, Integer i) {
        return (Map<String,Object>) (l[i]);
    }

    private Map<String,Object> mapGetMap(Map<String, Object> m, String p) {
        return (Map<String,Object>) (m.get(p));
    }

    private boolean createRequest(Map<String,Object> inputMap, Map<String,Object> outputMap) {

    Boolean retval = true;

    try {
        System.debug(JSON.serialize(inputMap));
        System.debug('Google Vision OCR Integration Class');

        String parentId = mapGetString(inputMap,'parentId');
        System.debug('parentId');
        System.debug(parentId);

        ContentDocumentLink cdl = [Select Id, ContentDocumentId, LinkedEntityId, ShareType, SystemModstamp from ContentDocumentLink where LinkedEntityId = :parentId Order by SystemModstamp Desc Limit 1];
        ID cdlId = cdl.ContentDocumentId;
        ContentVersion cv=[SELECT id,islatest,versiondata FROM ContentVersion WHERE ContentDocumentId = :cdlId];

        Blob FileBody =cv.VersionData;
        System.debug('Blob Size');
        System.debug(FileBody.size());
        System.debug(FileBody);
        
        //String AsString= EncodingUtil.base64Encode(FileBody); //FileBody.toString();
        //System.debug(AsString);
        String AsString = FileBody.toString();
        System.debug(AsString);
        
        List<String> lines = AsString.split('\n');
        System.debug('Header'+lines[0]);
        System.debug('Body'+lines[1]);
        System.debug('***Size****'+lines.size());
        List<CommercialDriverBuilder> driverBuilderList = new List<CommercialDriverBuilder>();
        List<String> result;
        List<String> headers=lines[0].split(',');
        Map<String, String> bodyMap = new Map<String,String>();
        for(Integer inp=1;inp<lines.size();inp++){
           CommercialDriverBuilder driverBu = new CommercialDriverBuilder();
           List<String> currentline=lines[inp].split(',');
           for(Integer j=0;j<headers.size();j++){
           //obj[headers[j]] = currentline[j];
           bodyMap.put(headers[j],currentline[j]);
               if(headers[j] == '﻿FirstName'){
               		driverBu.FirstName = currentline[j];
               }
               if(headers[j] == 'LastName'){
               		driverBu.LastName = currentline[j];
               }
               if(headers[j] == 'DateofBirth'){
      				driverBu.DateofBirth = currentline[j];
                }
                if(headers[j] == 'Gender'){
                      driverBu.Gender = currentline[j];
                }
                if(headers[j] == 'MaritalStatus'){
                      driverBu.MaritalStatus = currentline[j];
                }
                if(headers[j] == 'TypeOfLicense'){
                      driverBu.TypeOfLicense = currentline[j];
                }
                if(headers[j] == 'LicenseState'){
                      driverBu.LicenseState = currentline[j];
                }
                if(headers[j] == 'LicenseNumber'){
                      driverBu.LicenseNumber = currentline[j];
                }
                if(headers[j] == 'AgeFirstLicensed'){
                      driverBu.AgeFirstLicensed = currentline[j];
                }
                if(headers[j] == 'NumberofAccident'){
                      driverBu.NumberofAccident = currentline[j];
                }
                if(headers[j] == 'NumberofViolation'){
                      driverBu.NumberofViolation = currentline[j];
                }
                if(headers[j] == 'DutiesofDriver'){
                      driverBu.DutiesofDriver = currentline[j];
                }
                if(headers[j] == 'HireDate\r'){
                      driverBu.HireDate = currentline[j];
                }

         }
         driverBuilderList.add(driverBu);   
        }
        String jsonString = JSON.serialize(driverBuilderList);
        System.debug(jsonString);
          
       
        Map<String,Object> requestsWrapper = new Map<String,Object>();
        Map<String,Object> request = new Map<String,Object>();

        //contains
        Map<String,Object> image = new Map<String,Object>();
        Map<String,Object> feature = new Map<String,Object>();
        Map<String,Object> feature2 = new Map<String,Object>();

        List<Object> features = new List<Object>();
        List<Object> requests = new List<Object>();

        feature.put('maxResults',10);
        feature.put('type','TEXT_DETECTION');  // or use DOCUMENT_TEXT_DETECTION
        feature2.put('maxResults',10);
        feature2.put('type','LOGO_DETECTION');

        features.add(feature);
        features.add(feature2);

        image.put('content',jsonString);

        request.put('image',image);
        request.put('features',features);

        requests.add(request);

        requestsWrapper.put('requests',requests);

        System.debug('Google Vision request generated');
        //System.debug(JSON.serialize(requestsWrapper));

        outputMap.put('JSONRequest',requestsWrapper);
        }
     catch(Exception e) {
            System.debug('An exception occurred: ' + e.getMessage());
        }

        return retval;
    }
}
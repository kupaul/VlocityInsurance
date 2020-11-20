    function generatePDFTronDocument(inputMap){
        console.log('client side generation enabled...');
        var l = inputMap.pdfIntegrationConfig;
        l = atob(l);
        console.log('initialize');
        return new Promise(function(resolve, reject) {
            PDFNet.initialize(l).then(function(){
                console.log('docx');
                return new Promise(function (resolve, reject){

                    //The logic needs to be different for New Template attachment
                    if( inputMap.generatedContentVersion != null &&  inputMap.generatedContentVersion !== undefined
                                                                    &&  inputMap.generatedContentVersion.VersionData != null
                                                                    && inputMap.generatedContentVersion.VersionData!= undefined){
                            var blob = b64toBlob(inputMap.generatedContentVersion.VersionData, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
                            console.log("blob=", blob);
                            convertOfficeToPDF(URL.createObjectURL(blob), inputMap.docName + '.pdf', l, inputMap.isDownload).then(function(res){
                                resolve(res);
                            });

                            console.log('conversion done');
                    }else{
                            //Reusing the existing Angular function
                            getTemplateFileContent(inputMap.generatedContentVersion.Id).then(function(templateContentVersion){
                            var blob = b64toBlob(templateContentVersion.Base64VersionData, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
                            console.log("blob=", blob);
                            convertOfficeToPDF(URL.createObjectURL(blob), inputMap.docName + '.pdf', l, inputMap.isDownload).then(function(res){
                            resolve(res);
                           });
                        });
                    }

                });
            })
            .then(function(res) {
                    console.log('PDF ATTACHMENT Complete!');
                    resolve(res);
            })
            .catch(function(error) {
                  console.log('An error was encountered! : ' + error);
                  reject(error);
            });
        });
    }

    function convertOfficeToPDF(url, outputName, l, isDownload) {
            console.log('convertOfficeToPDF');
            console.log('url=' + url);
            console.log('outputName=' + outputName);
            return new Promise(function (resolve, reject){

                try {
                 var promise = PDFNet.Convert.office2PDFBuffer(url, { l: l });

                 promise.then(function(buffer) {
                      console.log('buffer=', buffer);
                      if(isDownload)
                      {
                          saveBufferAsPDFDoc(buffer, outputName);
                          resolve();
                      }
                      else{
                         var base64PDFContent = getBase64(buffer, name, 'application/pdf');
                         resolve(base64PDFContent);

                      }
                    })
                    .catch( function(error) {
                        console.log('error=', error);
                        reject(error);
                    })
                    .finally( function() {

                         console.log('finally');
                    });
                } catch (error) {
                    console.log('error=', error);
                }
                console.log('DONE');
            });
       }

     /**
     *
     */
    function saveBuffer(buf, name, mimetype) {
      var blob = new Blob([buf], {
        type: mimetype
      });
            saveAs(blob, name);
    }

    /**
     *
     */
    function saveBufferAsPDFDoc(buf, name) {
        saveBuffer(buf, name, 'application/pdf');
    }

    var getBase64 = function (buf, name, mimetype) {
       var base64 =  arrayBufferToBase64(buf);
       return pdfContent = base64;
    }

    function getTemplateFileContent(contentVersionId) {
        return new Promise(function (resolve, reject){
            sforce.connection.sessionId = window.sessionId;
            var queryString = 'Select Id, Title, VersionData FROM ContentVersion where Id = \'' + contentVersionId + '\'';
            sforce.connection.query(queryString, {
                onSuccess: function(result) {
                    var templateContentVersion = {
                        'Id': result.records.Id,
                        'Title': result.records.Title,
                        'Base64VersionData': result.records.VersionData
                    }
                    resolve(templateContentVersion);
                },
                onFailure: function(result) {
                    var errorMsg = result.faultstring;
                    reject(errorMsg);
                }
            });
        });
    };

    function b64toBlob(b64Data, contentType, sliceSize) {
        var byteCharacters, byteArrays, offset, slice, byteNumbers, i, byteArray, blob;
        contentType = contentType || '';
        sliceSize = sliceSize || 512;
        byteCharacters = atob(b64Data);
        byteArrays = [];

        for (offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            slice = byteCharacters.slice(offset, offset + sliceSize);
            byteNumbers = new Array(slice.length);
            for (i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }
            byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }
        blob = new Blob(byteArrays, {type: contentType});
        return blob;
    }

    var arrayBufferToBase64 = function( buffer ) {
        var binary = '';
        var bytes = new Uint8Array( buffer );
        var len = bytes.byteLength;
        for (var i = 0; i < len; i++) {
            binary += String.fromCharCode( bytes[ i ] );
        }
        return window.btoa( binary );
    }

// Set resource path in coreControls
var pdfTronSetResourcePath = function(remoteActions, VlocityPDFTronNoSystemUserMsg){
      return new Promise(function (resolve, reject){
         remoteActions.getClientSidePdfLibraries().then(function(result){
                var clientSidePdfGenerationConfig = JSON.parse(result);
                window.CoreControls.forceBackendType('ems');
                //window.CoreControls.setPDFWorkerPath(clientSidePdfGenerationConfig['cs_pdftron_full']);
                window.CoreControls.setPDFWorkerPath(clientSidePdfGenerationConfig['cs_pdftron_lean']);
                window.CoreControls.setOfficeWorkerPath(clientSidePdfGenerationConfig['cs_pdftron_office']);
                window.CoreControls.setPDFResourcePath(clientSidePdfGenerationConfig['cs_pdftron_resource']);
                window.CoreControls.setPDFAsmPath(clientSidePdfGenerationConfig['cs_pdftron_asm']);
                window.CoreControls.setExternalPath(clientSidePdfGenerationConfig['cs_pdftron_external']);

                //Set the path for Fonts
                window.CoreControls.setCustomFontURL(clientSidePdfGenerationConfig['cs_vlocity_webfonts_main'] + '/');
                //Set the path for office workers
                window.CoreControls.setOfficeAsmPath(clientSidePdfGenerationConfig['cs_pdftron_officeasm']);
                window.CoreControls.setOfficeResourcePath(clientSidePdfGenerationConfig['cs_pdftron_officeresource']);
                // Get the License Key
                remoteActions.getPDFIntegrationConfig().then(function(result){
                    lic = atob(JSON.parse(result));
                    var workerTransport = window.CoreControls.initOfficeWorkerTransports('ems', {}, lic);
                    var pdfTronResourceConfig = {
                        'clientSidePdfGenerationConfig': clientSidePdfGenerationConfig,
                        'license': result,
                        'workerTransport': workerTransport
                    };
                        resolve (pdfTronResourceConfig);
                 });
        });
    });

}





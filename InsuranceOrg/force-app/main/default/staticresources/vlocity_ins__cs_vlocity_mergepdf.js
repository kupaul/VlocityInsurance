//Method that accepts the ContentVersionID
//It queries each contentversion to get the versionData and then merges the PDF
// async recursive function with promise
function mergeDocumentsWorking(arrayOfIds, pdfTronLicense, nextCount = 1, doc = null) {
  return new Promise(async function(resolve, reject) {
    getFileBlobById(pdfTronLicense, arrayOfIds[0]).then(function(result){
      doc = result;
      getFileBlobById(pdfTronLicense, arrayOfIds[nextCount]).then(function(result){
        newDoc = result;
        var pages = [];
        for (var i = 0; i < newDoc.numPages; i++) {
          pages.push(i + 1);
        }
        var newPageCount = doc.getPageCount() + newDoc.getPageCount();

        return doc.insertPages(newDoc, pages, doc.getPageCount() + 1).then(function() {
            return resolve(doc);
        });
      });
    })
  })
}

function mergeDocuments(arrayOfIds, pdfTronLicense, nextCount = 1, doc = null) {
  return new Promise(async function(resolve, reject) {
   if(!doc) {
    getFileBlobById(pdfTronLicense, arrayOfIds[0]).then(function(result){
      doc = result;
      return resolve(mergeNextDocument(pdfTronLicense, arrayOfIds,nextCount, doc));
    })
    } else {
      return resolve(mergeNextDocument(pdfTronLicense, arrayOfIds,nextCount, doc));
    }
  }).then(function(res) {
      return res.next ?
        mergeDocuments(arrayOfIds, pdfTronLicense, nextCount + 1, res.doc) :
        res.doc;
    });
}

function mergeNextDocument(pdfTronLicense,arrayOfIds,nextCount, doc ) {
return new Promise(async function(resolve, reject) {
  getFileBlobById(pdfTronLicense, arrayOfIds[nextCount]).then(function(result){
    newDoc = result;
    var pages = [];
    for (var i = 0; i < newDoc.numPages; i++) {
      pages.push(i + 1);
    }
    var newPageCount = doc.getPageCount() + newDoc.getPageCount();

    return doc.insertPages(newDoc, pages, doc.getPageCount() + 1).then(function() {
        return resolve({
          next: arrayOfIds.length - 1 > nextCount,
          doc: doc,
        });
    });
  });
  });
}

// initialize Document object using low-level apis
function createDocument(pdfTronLicense, blob) {
  var url = URL.createObjectURL(blob)
  return new Promise(async function(resolve, reject) {
    // 'file.pdf' is temp name, 'pdf' is file type
    const doc = new CoreControls.Document('file.pdf', 'pdf');
    CoreControls.getDefaultBackendType().then(function(backendType) {
      lic = atob(JSON.parse(pdfTronLicense));
      const options = {
          workerTransportPromise: CoreControls.initPDFWorkerTransports(backendType, {},lic)
      };
      let partRetriever = new CoreControls.PartRetrievers.ExternalPdfPartRetriever(url);
      return doc.loadAsync(partRetriever, (err) => {
          if (err) return reject(err);
          return resolve(doc);
      }, options);
    });
  })
}

function getFileBlobById(pdfTronLicense, contentVersionId){
  return new Promise(function (resolve, reject){
    getTemplateFileContent(contentVersionId).then(function(result) {
      var blobData = base64ToBlob(result.Base64VersionData);
        return createDocument(pdfTronLicense, blobData).then(function(result) {
          return resolve(result);
        });
    }); 
  });    
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

// helper function to turn base64 to blob
function base64ToBlob(base64) {
  var binaryString = atob(base64);
  var len = binaryString.length;
  var bytes = new Uint8Array(len);
  for (let i = 0; i < len; ++i) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  return new Blob([bytes], { type: 'application/pdf' });
};

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
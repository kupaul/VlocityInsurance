  $(document).on('viewerLoaded', function() {
      var custom = JSON.parse(window.ControlUtils.getCustomData());
      var clientSidePdfGenerationConfig = custom.clientSidePdfGenerationConfig;
      window.sampleL = atob(clientSidePdfGenerationConfig.pdfIntegrationConfig);
    
      window.CoreControls.forceBackendType('ems');
      //window.CoreControls.setPDFWorkerPath(clientSidePdfGenerationConfig['cs_pdftron_full']);
      window.CoreControls.setPDFWorkerPath(clientSidePdfGenerationConfig['cs_pdftron_lean']);
      window.CoreControls.setOfficeWorkerPath(clientSidePdfGenerationConfig['cs_pdftron_office']);
      window.CoreControls.setPDFResourcePath(clientSidePdfGenerationConfig['cs_pdftron_resource']);
      window.CoreControls.setPDFAsmPath(clientSidePdfGenerationConfig['cs_pdftron_asm']);
      //window.CoreControls.setWorkerPath(clientSidePdfGenerationConfig['cs_pdftron_external']);
      window.CoreControls.setExternalPath(clientSidePdfGenerationConfig['cs_pdftron_external']);
      //window.CoreControls.setWorkerPath(clientSidePdfGenerationConfig['cs_pdftron_lib']+'/core');
      //Set the path for Fonts
      window.CoreControls.setCustomFontURL(clientSidePdfGenerationConfig['cs_vlocity_webfonts_main'] + '/');
      //Set the path for office workers
      window.CoreControls.setOfficeAsmPath(clientSidePdfGenerationConfig['cs_pdftron_officeasm']); //cs_pdftron_officeresource
      window.CoreControls.setOfficeResourcePath(clientSidePdfGenerationConfig['cs_pdftron_officeresource']);
    
      parent.postMessage({viewerLoadedExternal:true}, '*');
  });
  
  window.addEventListener('message', receiveMessage, false);
  
  function receiveMessage(event) {
    if (event.isTrusted && typeof event.data === 'object') {
      switch (event.data.type) {
        case 'OPEN_DOCUMENT':
          const base64String = event.data.payload;
          var blob = base64ToBlob(base64String);
          event.target.readerControl.loadDocument(blob, { filename: 'my.docx' });
          break;
        default:
          break;
      }
    }
  }

  var base64ToBlob = function(base64) {
    var binaryString = window.atob(base64);
    var len = binaryString.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; ++i) {
      bytes[i] = binaryString.charCodeAt(i);
    }
  
    return new Blob([bytes], { type: 'application/pdf' });
};
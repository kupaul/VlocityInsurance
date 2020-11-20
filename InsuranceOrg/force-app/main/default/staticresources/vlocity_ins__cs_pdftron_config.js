
$(document).on('viewerLoaded', function() {
  var custom = JSON.parse(window.ControlUtils.getCustomData());
  var clientSidePdfGenerationConfig = custom.clientSidePdfGenerationConfig;

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
  
  window.parent.postMessage({viewerLoadedExternal:true}, '*');
});

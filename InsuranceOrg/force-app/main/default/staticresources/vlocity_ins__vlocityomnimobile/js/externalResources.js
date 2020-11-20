// external libraries and custom libraries loaded in mobile hybrid app will also be loaded in omniout
if(window.parent.omniMobile && window.parent.omniMobile.resources) {
    if(window.parent.omniMobile.insertExternalLibs && window.parent.omniMobile.insertCustomLibs) {
        var resources = window.parent.omniMobile.resources;
        window.parent.omniMobile.insertExternalLibs(resources, document);
        window.parent.omniMobile.insertCustomLibs(resources, document);
    }
}
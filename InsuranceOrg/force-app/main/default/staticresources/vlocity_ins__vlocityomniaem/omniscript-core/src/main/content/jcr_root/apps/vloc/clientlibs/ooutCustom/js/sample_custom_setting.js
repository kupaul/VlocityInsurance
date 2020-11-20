    // This is a sample custom setting file to show how to overwrite the default setting
    // please copy this file, rename it to custom_setting.js, then add your customization there
    // custom_setting.js will not be impacted by upgrade

    // NOTE: modify CONNECTED_APP_CONSUMER_KEY to the key of your own Connected App
    var CONNECTED_APP_CONSUMER_KEY = '3MVG9szVa2RxsqBa5tQyU6.tKh61yiGXNhItGzvNJWh1oJh4fcI4pRlqlx1i2MLagkNovsmbaZfSE5mSZ6rCo';
    // NOTE: modify SFDC_NAMESPACE to the name space of the Saleforce/Vlocity package you want to invoke, for example, vlocity_cmt
    var SFDC_NAMESPACE = 'vlocity_cmt';
    // modify SCRIPT_DEF_PATH to change the local script def storage path
    var SCRIPT_DEF_PATH = './scripts/';
    // modify ADDITIONAL_ANGULAR_SVS_INJECT to load extra angular services, array of strings
    var ADDITIONAL_ANGULAR_SVS_INJECT = [];
    // when this flag is true, omniscript will always try to use a local definition even when a forceng connection is live
    window.forceLocalDef = false;
    // when this flag is true, omniscript will call to salesforce on local script load with a connection for extra user info userName, userCurrencyCode, userTimzeZone, userProfile, timeStamp
    window.callUserInfo = false;

    // reset SFDC Connected App Consumer Key
    window.VOmniSetConnectedAppKey(CONNECTED_APP_CONSUMER_KEY);
    
    // reset SFDC package name space
    window.VOmniSetNameSpace(SFDC_NAMESPACE);
    
    
    // use the following to add more custom labels
    // please make sure the custom label key does not conflict with OOTB SFDC custom labels 
    // (refer to setting.js)
    window.VOmniAddMoreCustomLabels({}); 
    
    // use the following to change the default script def path, for example, on AEM, it should be
    // AEM digital assets management folder: '/content/dam/oout/scripts/'
    window.VOmniSetScriptDefPath(SCRIPT_DEF_PATH);
    
    // load additional angular services
    window.VOmniCustomServicesToInject(ADDITIONAL_ANGULAR_SVS_INJECT);

    // custom overwrite for handling authentication check
    //window.customVOmniAuth = function(scope) {
    //};
    
    // custom ajax overwrite for making rest call
    // should return promoise
    //window.customVOmniRestInvoke = function(configObj) {
    //}
    
    // custom ajax overwrite for making rest call
    // should return promoise
    //window.customVOmniRemoteInvoke = function(configObj) {
    //}        
    
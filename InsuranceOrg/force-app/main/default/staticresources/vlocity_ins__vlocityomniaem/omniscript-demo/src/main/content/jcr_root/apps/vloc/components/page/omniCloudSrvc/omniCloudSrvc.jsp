<%@page session="false"
        import="com.day.cq.wcm.webservicesupport.Configuration,
    			org.apache.sling.api.resource.ModifiableValueMap,
                com.day.cq.wcm.webservicesupport.ConfigurationManager,
                com.day.cq.wcm.foundation.Placeholder,
                com.adobe.cq.mcm.salesforce.SalesforceClient,
                com.adobe.cq.mcm.salesforce.SalesforceException,
                com.adobe.cq.mcm.salesforce.SalesforceResponse,
				com.adobe.granite.crypto.CryptoSupport,
                com.day.cq.i18n.I18n" %>
<%--
Vlocity Omniscript Component
Handles authentication using cloudservices configureation Hosts Omniscript page in iframe.
--%>
<%@include file="/libs/foundation/global.jsp"%>
<% %><cq:defineObjects />
<%@page contentType="text/html; charset=utf-8" %>
<% // Pass server's Salesforce-AEM CloudServices to client page
    I18n i18n = new I18n(slingRequest.getResourceBundle(currentPage.getLanguage(false)));
    boolean cloudConfigFound = false;
    Resource configResource = null;
    String salesforceConfigPath = resource.getValueMap().get("cloudserviceconfig","");
    Configuration salesforceConfig = null;
    String[] cloudConfigs = pageProperties.get("cq:cloudserviceconfigs", new String[]{});
    ConfigurationManager configurationManager = resourceResolver.adaptTo(ConfigurationManager.class);
    CryptoSupport cryptoSupport = sling.getService(CryptoSupport.class);

    if(cloudConfigs.length>0){
        if(salesforceConfigPath!="")
			salesforceConfig = configurationManager.getConfiguration(salesforceConfigPath);
        if(salesforceConfig ==null)
        	salesforceConfig = configurationManager.getConfiguration("salesforce",cloudConfigs);
        if(salesforceConfig!=null){
            cloudConfigFound = true;
            configResource = salesforceConfig.getResource();
        }
    }
    
    // draw placeholder for UI mode touch
    boolean isAuthoringUIModeTouch = Placeholder.isAuthoringUIModeTouch(slingRequest);
    if (isAuthoringUIModeTouch) {
        %>
                <%= Placeholder.getDefaultPlaceholder(slingRequest, component, "") %>
        <%
    }

    if(cloudConfigFound){
        // Set Salesforce Client
        SalesforceClient salesforceClient = new SalesforceClient();
        SalesforceResponse salesforceResponse = new SalesforceResponse();
        
        salesforceClient.setAccessToken(salesforceConfig.get("accesstoken",""));
        salesforceClient.setClientId(salesforceConfig.get("customerkey",""));
        salesforceClient.setClientSecret(cryptoSupport.unprotect(salesforceConfig.get("customersecret","")));
        salesforceClient.setInstanceURL(salesforceConfig.get("instanceurl",""));
        salesforceClient.setPath(salesforceConfig.get("authorizationUrl",""));

        String refreshtoken = salesforceConfig.get("refreshtoken","");
        if (cryptoSupport.isProtected(refreshtoken)){
            refreshtoken = cryptoSupport.unprotect(refreshtoken);
        }
        salesforceClient.setRefreshToken(refreshtoken);

        try{
            salesforceResponse = salesforceClient.refreshAccessToken();
        }catch(SalesforceException se){
            %>
                <p>There has been a SalesforceException in refreshing the Access Token</p>
                <%= se %>
            <%
        }

		ModifiableValueMap sfCfgMap = salesforceConfig.getResource().getChild("jcr:content").adaptTo(ModifiableValueMap.class);

        sfCfgMap.put("accesstoken",salesforceClient.getAccessToken());
    	salesforceConfig.getResource().getChild("jcr:content").getResourceResolver().commit();

        %>
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <cq:include path="ngTemps" resourceType="vloc/components/global/ngTemps"/>
            </head>
            <body ng-app="miniApp" >

                <script type="text/javascript" src="/apps/vloc/clientlibs/oout/js/setting.js"></script>
                <script type="text/javascript" src="/apps/vloc/clientlibs/ooutCustom/js/custom_setting.js"></script>
            
                <cq:includeClientLib categories="oout"/>
                <cq:includeClientLib categories="ooutCustom"/>
                <script>
                    var miniApp = angular.module('miniApp', ["forceng", "vlocity-business-process","ngRoute"])
                        .controller('ContactListCtrl', 
                                    function ($scope, force, $location, $route, $routeParams) {
                                        force.init(
                                            {
                                                proxyURL: '<%=resource.getValueMap().get("proxyURL","https://ooproxy.herokuapp.com")%>',
                                                loginURL: '<%= salesforceConfig.get("loginUrl","") %>',
                                                accessToken: '<%= salesforceConfig.get("accesstoken","") %>',
                                                instanceURL: '<%= salesforceConfig.get("instanceurl","") %>',
                                                appId:'<%= salesforceConfig.get("customerkey","") %>'
                                            }
                                        );
                                    }
                         );
    
                </script>
                <style>
                    .test-container {margin:30px;font-size:30px;}
                </style> 
                <div ng-controller="ContactListCtrl" class='vlocity via-slds via-omni' xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" >
                    <div id='VlocityBP' >
                        <div ng-if='scriptNotFound1 || scriptNotFound2' ng-include="'vlcSldsScriptNotFound.html'"></div>
                        <div class="mask vlc-slds-mask" ng-show="loading">
                            <div class="center-block spinner" vlc-slds-spinner="test"></div>
                        </div>
                        <ng-view id='VlocityBPView' autoscroll="true">               
                        </ng-view>
                        <div ng-show='loading' class='modal-backdrop fade in'></div>
                    </div>
                </div>
            </body>
        <%
    } else {
        %>No Cloud Configuration Found: Please ask you administrator to check your Salesforce Cloud Services Configuration<%
    }
%>
<%
%><%
%>







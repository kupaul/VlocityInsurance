<%
%><%@include file="/libs/foundation/global.jsp"%><%
%><cq:defineObjects />
<%@page session="false"%>
<%@page contentType="text/html; charset=utf-8" %><%

String layout = request.getParameter("layout");
Boolean isNewport = layout != null && layout.equals("newport");
String extraScopingClass = isNewport ? "via-nds" : "";
%>
<!DOCTYPE HTML
          PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">

<head>
    <meta name="viewport"
          content="width=device-width, initial-scale=1.0" />
    <cq:include path="customTemplates"
                resourceType="vloc/components/global/customTemplates" />
</head>

<body>

    <script type="text/javascript"
            src="/apps/vloc/clientlibs/oout/js/setting.js"></script>
    <script type="text/javascript"
            src="/apps/vloc/clientlibs/ooutCustom/js/custom_setting.js"></script>

    <script>
        // Optional namespace override
        (function nsOverride() {
            if (SFDC_NAMESPACE !== undefined) {
                SFDC_NAMESPACE = window.parent.sfNameSpaceOverride || SFDC_NAMESPACE;
                window.VOmniSetNameSpace(SFDC_NAMESPACE);
            }
        })();
    </script>

    <cq:includeClientLib categories="oout" />
    <%
        if (isNewport) {%>
    <script type="text/javascript"
            src="/apps/vloc/clientlibs/oout/js/BusinessProcessNewPortTemplates.js"></script>
    <link rel="stylesheet"
          type="text/css"
          href="/apps/vloc/clientlibs/oout/css/vlocity-newport-design-system.min.css">
    <%} else {%>
    <script type="text/javascript"
            src="/apps/vloc/clientlibs/oout/js/BusinessProcessSLDSTemplates.js"></script>
    <link rel="stylesheet"
          type="text/css"
          href="/apps/vloc/clientlibs/oout/css/salesforce-lightning-design-system-vf.min.css">
    <link rel="stylesheet"
          type="text/css"
          href="/apps/vloc/clientlibs/oout/css/OmniScriptOuiSldsCss.css">
    <link rel="stylesheet"
          type="text/css"
          href="/apps/vloc/clientlibs/oout/css/vlocityouislds.css">
    <%}
    %>

    <!-- <script type="text/javascript"
            src="/apps/vloc/clientlibs/oout/js/configIFrameResizerContentWindow.js"></script> -->
    <script type="text/javascript"
            src="/apps/vloc/clientlibs/iframeResizer/js/iframeResizer.contentWindow.js"></script>

    <cq:includeClientLib categories="ooutCustom" />

    <div ng-app="OmniScriptUniversal"
         class='vlocity via-slds via-omni <%= extraScopingClass%>'
         xmlns="http://www.w3.org/2000/svg"
         xmlns:xlink="http://www.w3.org/1999/xlink">
        <div id='VlocityBP'>
            <div ng-if='scriptNotFound1 || scriptNotFound2'
                 ng-include="'vlcSldsScriptNotFound.html'"></div>
            <div class="mask vlc-slds-mask"
                 ng-show="loading">
                <div class="center-block spinner"
                     vlc-slds-spinner="test"></div>
            </div>
            <ng-view id='VlocityBPView'
                     autoscroll="true">
            </ng-view>
            <div ng-show='loading'
                 class='modal-backdrop fade in'></div>
        </div>

        <script type="text/javascript">
            var modules = ['vlocity-business-process'];
            var OmniScriptUniversal = angular.module('OmniScriptUniversal', modules);
        </script>
    </div>
</body>

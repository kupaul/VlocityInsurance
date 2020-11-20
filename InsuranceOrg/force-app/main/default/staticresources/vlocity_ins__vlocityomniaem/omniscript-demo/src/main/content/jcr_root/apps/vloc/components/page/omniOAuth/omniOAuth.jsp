<%--

  OmniScript Page Component component.

  Component for Omniscript Pages

--%><%@include file="/libs/foundation/global.jsp"%><%
%><%@page session="false" contentType="text/html; charset=utf-8" %><%
%><!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <cq:include path="ngTemps" resourceType="vloc/components/global/ngTemps"/>
    </head>

<body>

    <script type="text/javascript" src="/apps/vloc/clientlibs/oout/js/setting.js"></script>
    <script type="text/javascript" src="/apps/vloc/clientlibs/ooutCustom/js/custom_setting.js"></script>

	<cq:includeClientLib categories="oout"/>
	<cq:includeClientLib categories="ooutCustom"/>

    <script>
        angular.module('miniApp', ["forceng", "vlocity-business-process","ngRoute"])
            .controller('ContactListCtrl', function ($scope, force, $location, $route, $routeParams) { 
                $scope.loggedin= false;
                window.force = force;
                window.force.init({
                    proxyURL: '<%=resource.getValueMap().get("proxyURL","https://ooproxy.herokuapp.com")%>',
                    appId:'<%=resource.getValueMap().get("appId","3MVG9sG9Z3Q1RlbdXNZWsFDsOiooeJIx9bOlD2XtDDPWtVFfTzmU6pyBKw58W_Xwo5nM7ph5b_Z1arxsEyzwA")%>'
                });
                window.force.login().then(function (oauth) {
                    debugger;
                    console.log("force login");
                    $scope.loggedin= true;
                });
            });
    </script>

    <div ng-app="miniApp" class='vlocity via-slds via-omni' xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <div id='VlocityBP'ng-controller="ContactListCtrl">
            <div ng-if="loggedin">
                <div ng-if='scriptNotFound1 || scriptNotFound2' ng-include="'vlcSldsScriptNotFound.html'"></div>
                <div class="mask vlc-slds-mask" ng-show="loading">
                    <div class="center-block spinner" vlc-slds-spinner="test"></div>
                </div>
                <ng-view id='VlocityBPView' autoscroll="true">               
                </ng-view>
                <div ng-show='loading' class='modal-backdrop fade in'></div>
            </div>
        </div>
	</div>
</body>


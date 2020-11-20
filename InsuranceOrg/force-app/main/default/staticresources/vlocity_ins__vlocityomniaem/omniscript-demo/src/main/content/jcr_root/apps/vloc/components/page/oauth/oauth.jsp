<%--

  Oauth Page Component component.

  Component for Oauth Validation

--%><%@include file="/libs/foundation/global.jsp"%><%
%><%@page session="false" contentType="text/html; charset=utf-8" %><%
%><!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<body>
<script>
    if (window.opener.force && window.opener.force.oauthCallback) {
        window.opener.force.oauthCallback(window.location.href);
    } else if (window.opener.oauthCallback) {
        window.opener.oauthCallback(window.location.href);
    }
    window.close();
</script>
</body>
</html>
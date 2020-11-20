<%@page session="false"
        import="org.apache.sling.api.resource.ModifiableValueMap,
                com.day.cq.wcm.foundation.External,
                com.day.cq.wcm.foundation.Placeholder,
                org.apache.sling.api.wrappers.ValueMapDecorator,
                java.util.*,java.util.Map" %>
<%@include file="/libs/foundation/global.jsp"%>
<% %><cq:defineObjects />
<%
    ValueMap props = resource.getValueMap();
    String osPagePath = props.get("osPageURL",props.get("osPage","/content/oout/omniUniversal.html"));
    String osPath     = props.get("osFullPath","");
    String target = (osPagePath+osPath).replaceAll(" ","%20").replaceAll(":","%3A").replaceAll("\\{.*?\\}","");

    External external = new External(resource, currentPage, "spool", "external", "CFC__target");
    external.setTarget(target);
    boolean forceLocalFlag = props.get("osForceLocal",false);
    boolean callUserInfo = props.get("osCallUserInfo",false);


    // draw placeholder for UI mode touch
    boolean isAuthoringUIModeTouch = Placeholder.isAuthoringUIModeTouch(slingRequest);

    if (isAuthoringUIModeTouch && (!external.hasContent() || osPath == "")) {
        %>
                <%= Placeholder.getDefaultPlaceholder(slingRequest, component, "") %>
        <%
    } else if(osPath != ""){
        external.draw(slingRequest, slingResponse);
        %>
            <script type="text/javascript"
                    src="/apps/vloc/clientlibs/iframeResizer/js/iframeResizer.js"></script>


            <script id="osFrameCliSup<%= resource.getName() %>">
                var frame = document.getElementById("osFrameCliSup<%= resource.getName()%>").parentElement.getElementsByTagName("iframe")[0];
                if (!window.VlocOmniOut)
                    window.VlocOmniOut = {};
                window.VlocOmniOut.forceLocalDef = <%= forceLocalFlag%>;
                window.VlocOmniOut.callUserInfo = <%= callUserInfo%>;
                frame.style.border="0";
                frame.style.minHeight="500px";
                iFrameResize(null,frame);
            </script>
        <%
    }
    else{
        %>
            <!--No Omniscript Specified-->
        <%
    }
%>

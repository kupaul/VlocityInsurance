/*! Built with http://stenciljs.com */
VlocityTemplateEditor.loadBundle("chunk-8aef71bd.js", ["exports"], function (e) { window.VlocityTemplateEditor.h; var t = function () { var e = document.getElementsByTagName("script"), t = (e[e.length - 1].src ? e[e.length - 1] : e[e.length - 2]).src; if ("" === t) {
    var e_1 = document.getElementById("templateEditorScript");
    t = e_1 && e_1.src;
} var n = t.split("/"), o = n[n.length - 1]; "" === o && (o = n[n.length - 2]), -1 != t.indexOf("__") && -1 == o.indexOf("__") && (o = n[5] && -1 != n[5].indexOf("__") ? n[5] : o); var r = -1 == o.indexOf("__") ? "" : o.substring(0, o.indexOf("__") + 2); if ("" !== (r = "" === r && localStorage.getItem("nsPrefix") ? localStorage.getItem("nsPrefix") : r) && (r = /__$/.test(r) ? r : r + "__"), 0 === r.length)
    return function () { return "" !== (r = window.nsPrefix ? window.nsPrefix : r) && (r = /__$/.test(r) ? r : r + "__"), r; }; var i = null; return function () { if (i)
    return i; try {
    var e, t = r.replace("__", ""), n = function (o, r) { if (o && o !== window && -1 == r.indexOf(o) && (r.push(o), Object.keys(o).forEach(function (i) { if ("ns" === i && "string" == typeof o[i] && o[i].toLowerCase() === t)
        return e = o[i] + "__", !1; if ("[object Array]" === Object.prototype.toString.call(o[i]))
        o[i].forEach(function (t) { var o = n(t, r); if (o)
            return e = o, !1; });
    else if ("object" == typeof o[i]) {
        var a = n(o[i], r);
        if (a)
            return e = a, !1;
    } return !e && void 0; }), e))
        return e; };
    return "undefined" == typeof Visualforce ? r : (n(Visualforce.remoting.Manager.providers, []), i = e || r);
}
catch (e) {
    return r;
} }; }(), n = function () { var e, t, n = {}; if (!(e = "undefined" != typeof Visualforce ? window.location.search.substring(1) : window.location.hash.split("?")[1]) && window.location.search && (e = window.location.search.substring(1)), e) {
    t = e.split("&");
    for (var o = 0; o < t.length; o++) {
        var r = t[o].split("=");
        if (void 0 === n[r[0]])
            n[r[0]] = decodeURIComponent(r[1].replace(/\+/g, " "));
        else if ("string" == typeof n[r[0]]) {
            var i = [n[r[0]], decodeURIComponent(r[1].replace(/\+/g, " "))];
            n[r[0]] = i;
        }
        else
            n[r[0]].push(decodeURIComponent(r[1].replace(/\+/g, " ")));
    }
} return n; }(); e.fileNsPrefix = t, e.params = n, e.vlocityOpenUrl = function (e, t, n) { var o = e; if (window.location.search.indexOf("sfdcIFrameOrigin") > 1) {
    var r = { componentDef: "one:alohaPage", attributes: { values: { address: e }, history: [] } }, i = JSON.stringify(r);
    o = "/one/one.app#" + window.btoa(i);
} if (!t || !t.ctrlKey && !t.metaKey && 2 !== t.button) {
    if ("undefined" != typeof sforce) {
        if (t && t.target && "A" === t.target.tagName) {
            var a = t.target.getAttribute("href");
            t.target.setAttribute("href", "#"), setTimeout(function () { t.target.setAttribute("href", a); }, 50);
        }
        if (sforce.console && sforce.console.isInConsole())
            return sforce.console.getEnclosingPrimaryTabId(function (t) { sforce.console.openSubtab(t.id, e, !0, null, null, function (t) { return !0 !== t.success && (sforce.one ? (sforce.one.navigateToURL(e), !1) : void (window.location = e)); }); }), t && (t.preventDefault(), t.stopImmediatePropagation()), !1;
        if (sforce.one && !n)
            return sforce.one.navigateToURL(e), t && (t.preventDefault(), t.stopImmediatePropagation()), !1;
    }
    n ? window.open(o, "_blank") : window.location = e;
} }; });

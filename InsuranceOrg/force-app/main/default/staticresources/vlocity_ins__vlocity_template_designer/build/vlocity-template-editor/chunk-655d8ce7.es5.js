/*! Built with http://stenciljs.com */
VlocityTemplateEditor.loadBundle("chunk-655d8ce7.js", ["exports"], function (t) { window.VlocityTemplateEditor.h; var e, n = (function (t) { !function (e, n, r) { if (e) {
    for (var o, i = { 8: "backspace", 9: "tab", 13: "enter", 16: "shift", 17: "ctrl", 18: "alt", 20: "capslock", 27: "esc", 32: "space", 33: "pageup", 34: "pagedown", 35: "end", 36: "home", 37: "left", 38: "up", 39: "right", 40: "down", 45: "ins", 46: "del", 91: "meta", 93: "meta", 224: "meta" }, a = { 106: "*", 107: "+", 109: "-", 110: ".", 111: "/", 186: ";", 187: "=", 188: ",", 189: "-", 190: ".", 191: "/", 192: "`", 219: "[", 220: "\\", 221: "]", 222: "'" }, c = { "~": "`", "!": "1", "@": "2", "#": "3", $: "4", "%": "5", "^": "6", "&": "7", "*": "8", "(": "9", ")": "0", _: "-", "+": "=", ":": ";", '"': "'", "<": ",", ">": ".", "?": "/", "|": "\\" }, l = { option: "alt", command: "meta", return: "enter", escape: "esc", plus: "+", mod: /Mac|iPod|iPhone|iPad/.test(navigator.platform) ? "meta" : "ctrl" }, s = 1; s < 20; ++s)
        i[111 + s] = "f" + s;
    for (s = 0; s <= 9; ++s)
        i[s + 96] = s.toString();
    d.prototype.bind = function (t, e, n) { return t = t instanceof Array ? t : [t], this._bindMultiple.call(this, t, e, n), this; }, d.prototype.unbind = function (t, e) { return this.bind.call(this, t, function () { }, e); }, d.prototype.trigger = function (t, e) { return this._directMap[t + ":" + e] && this._directMap[t + ":" + e]({}, t), this; }, d.prototype.reset = function () { return this._callbacks = {}, this._directMap = {}, this; }, d.prototype.stopCallback = function (t, e) { return !((" " + e.className + " ").indexOf(" mousetrap ") > -1) && !function t(e, r) { return null !== e && e !== n && (e === r || t(e.parentNode, r)); }(e, this.target) && ("INPUT" == e.tagName || "SELECT" == e.tagName || "TEXTAREA" == e.tagName || e.isContentEditable); }, d.prototype.handleKey = function () { return this._handleKey.apply(this, arguments); }, d.addKeycodes = function (t) { for (var e in t)
        t.hasOwnProperty(e) && (i[e] = t[e]); o = null; }, d.init = function () { var t = d(n); for (var e in t)
        "_" !== e.charAt(0) && (d[e] = function (e) { return function () { return t[e].apply(t, arguments); }; }(e)); }, d.init(), e.Mousetrap = d, t.exports && (t.exports = d);
} function u(t, e, n) { t.addEventListener ? t.addEventListener(e, n, !1) : t.attachEvent("on" + e, n); } function p(t) { if ("keypress" == t.type) {
    var e = String.fromCharCode(t.which);
    return t.shiftKey || (e = e.toLowerCase()), e;
} return i[t.which] ? i[t.which] : a[t.which] ? a[t.which] : String.fromCharCode(t.which).toLowerCase(); } function f(t) { return "shift" == t || "ctrl" == t || "alt" == t || "meta" == t; } function h(t, e) { var n, r, a, s = []; for (n = function (t) { return "+" === t ? ["+"] : (t = t.replace(/\+{2}/g, "+plus")).split("+"); }(t), a = 0; a < n.length; ++a)
    r = n[a], l[r] && (r = l[r]), e && "keypress" != e && c[r] && (r = c[r], s.push("shift")), f(r) && s.push(r); return { key: r, modifiers: s, action: e = function (t, e, n) { return n || (n = function () { if (!o)
        for (var t in o = {}, i)
            t > 95 && t < 112 || i.hasOwnProperty(t) && (o[i[t]] = t); return o; }()[t] ? "keydown" : "keypress"), "keypress" == n && e.length && (n = "keydown"), n; }(r, s, e) }; } function d(t) { var e = this; if (t = t || n, !(e instanceof d))
    return new d(t); e.target = t, e._callbacks = {}, e._directMap = {}; var r, o = {}, i = !1, a = !1, c = !1; function l(t) { t = t || {}; var e, n = !1; for (e in o)
    t[e] ? n = !0 : o[e] = 0; n || (c = !1); } function s(t, n, r, i, a, c) { var l, s, u, p, h = [], d = r.type; if (!e._callbacks[t])
    return []; for ("keyup" == d && f(t) && (n = [t]), l = 0; l < e._callbacks[t].length; ++l)
    if (s = e._callbacks[t][l], (i || !s.seq || o[s.seq] == s.level) && d == s.action && ("keypress" == d && !r.metaKey && !r.ctrlKey || (u = n, p = s.modifiers, u.sort().join(",") === p.sort().join(",")))) {
        var y = !i && s.combo == a, b = i && s.seq == i && s.level == c;
        (y || b) && e._callbacks[t].splice(l, 1), h.push(s);
    } return h; } function y(t, n, r, o) { e.stopCallback(n, n.target || n.srcElement, r, o) || !1 === t(n, r) && (function (t) { t.preventDefault ? t.preventDefault() : t.returnValue = !1; }(n), function (t) { t.stopPropagation ? t.stopPropagation() : t.cancelBubble = !0; }(n)); } function b(t) { "number" != typeof t.which && (t.which = t.keyCode); var n = p(t); n && ("keyup" != t.type || i !== n ? e.handleKey(n, function (t) { var e = []; return t.shiftKey && e.push("shift"), t.altKey && e.push("alt"), t.ctrlKey && e.push("ctrl"), t.metaKey && e.push("meta"), e; }(t), t) : i = !1); } function k(t, n, a, u, f) { e._directMap[t + ":" + a] = n; var d, b = (t = t.replace(/\s+/g, " ")).split(" "); b.length > 1 ? function (t, e, n, a) { function s(e) { return function () { c = e, ++o[t], clearTimeout(r), r = setTimeout(l, 1e3); }; } function u(e) { y(n, e, t), "keyup" !== a && (i = p(e)), setTimeout(l, 10); } o[t] = 0; for (var f = 0; f < e.length; ++f) {
    var d = f + 1 === e.length ? u : s(a || h(e[f + 1]).action);
    k(e[f], d, a, t, f);
} }(t, b, n, a) : (d = h(t, a), e._callbacks[d.key] = e._callbacks[d.key] || [], s(d.key, d.modifiers, { type: d.action }, u, t, f), e._callbacks[d.key][u ? "unshift" : "push"]({ callback: n, modifiers: d.modifiers, action: d.action, seq: u, level: f, combo: t })); } e._handleKey = function (t, e, n) { var r, o = s(t, e, n), i = {}, u = 0, p = !1; for (r = 0; r < o.length; ++r)
    o[r].seq && (u = Math.max(u, o[r].level)); for (r = 0; r < o.length; ++r)
    if (o[r].seq) {
        if (o[r].level != u)
            continue;
        p = !0, i[o[r].seq] = 1, y(o[r].callback, n, o[r].combo, o[r].seq);
    }
    else
        p || y(o[r].callback, n, o[r].combo); var h = "keypress" == n.type && a; n.type != c || f(t) || h || l(i), a = p && "keydown" == n.type; }, e._bindMultiple = function (t, e, n) { for (var r = 0; r < t.length; ++r)
    k(t[r], e, n); }, u(t, "keypress", b), u(t, "keydown", b), u(t, "keyup", b); } }("undefined" != typeof window ? window : null, "undefined" != typeof window ? document : null); }(e = { exports: {} }), e.exports); t.ShortcutKeys = /** @class */ (function () {
    function ShortcutKeys() {
        var t, e, r;
        e = {}, r = (t = n).prototype.stopCallback, t.prototype.stopCallback = function (t, n, o, i) { return !!this.paused || !e[o] && !e[i] && r.call(this, t, n, o); }, t.prototype.bindGlobal = function (t, n, r) { if (this.bind(t, n, r), t instanceof Array)
            for (var o = 0; o < t.length; o++)
                e[t[o]] = !0;
        else
            e[t] = !0; }, t.init();
    }
    ShortcutKeys.prototype.bindGlobal = function (t, e, r) {
        var o = [];
        for (var _i = 3; _i < arguments.length; _i++) {
            o[_i - 3] = arguments[_i];
        }
        n.bindGlobal(t, function () { return e.apply(r, o), !1; });
    };
    return ShortcutKeys;
}()); });

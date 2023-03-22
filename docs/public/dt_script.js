(function () {
  function Na() {
    document.cookie = "".concat("__dTCookie", "=").concat("1", ";SameSite=Lax");
    var ab = -1 !== document.cookie.indexOf("__dTCookie");
    document.cookie = ""
      .concat("__dTCookie", "=")
      .concat("1", "; expires=Thu, 01-Jan-1970 00:00:01 GMT");
    return ab;
  }
  function gb() {
    return void 0 === mb.dialogArguments
      ? navigator.cookieEnabled || Na()
      : Na();
  }
  function ib() {
    var ab;
    if (gb() && !window.dT_) {
      var fb =
        ((ab = {}),
        (ab.cfg =
          "app=3a0bc55c704c9d8f|cors=1|featureHash=A2NVfqru|vcv=2|reportUrl=https://bf33032bms.bf.dynatrace.com/bf|rdnt=1|uxrgce=1|bp=3|cuc=0my2gprh|mel=100000|dpvc=1|ssv=4|lastModification=1679499776454|dtVersion=10261230220152234|tp=500,50,0,1|featureHash=A2NVfqru|agentUri=https://js-cdn.dynatrace.com/jstag/16c6bc5bd3b/ruxitagent_A2NVfqru_10261230220152234.js|auto=|domain=|rid=RID_|rpid=|app=3a0bc55c704c9d8f"),
        (ab.iCE = gb),
        ab);
      window.dT_ = fb;
    }
  }
  "undefined" !== typeof window &&
    window.setTimeout &&
    (window.setTimeout = window.setTimeout);
  this.dT_ && dT_.prm && dT_.prm();
  var mb = "undefined" !== typeof window ? window : self,
    Ra;
  mb.dT_
    ? (null === (Ra = mb.console) || void 0 === Ra
        ? void 0
        : Ra.log(
            "Duplicate agent injection detected, turning off redundant initConfig."
          ),
      (mb.dT_.di = 1))
    : ib();
})();
(function () {
  function Na(e, n, O) {
    if (O || 2 === arguments.length)
      for (var P = 0, ya = n.length, hb; P < ya; P++)
        (!hb && P in n) ||
          (hb || (hb = Array.prototype.slice.call(n, 0, P)), (hb[P] = n[P]));
    return e.concat(hb || Array.prototype.slice.call(n));
  }
  function gb(e, n, O) {
    void 0 === O && (O = 0);
    var P = -1;
    n && (null === e || void 0 === e ? 0 : e.indexOf) && (P = e.indexOf(n, O));
    return P;
  }
  function ib() {
    var e;
    return !(null === (e = pb.console) || void 0 === e || !e.log);
  }
  function mb(e, n) {
    if (!n) return "";
    var O = e + "=";
    e = gb(n, O);
    if (0 > e) return "";
    for (; 0 <= e; ) {
      if (0 === e || " " === n.charAt(e - 1) || ";" === n.charAt(e - 1))
        return (
          (O = e + O.length),
          (e = gb(n, ";", e)),
          0 <= e ? n.substring(O, e) : n.substring(O)
        );
      e = gb(n, O, e + O.length);
    }
    return "";
  }
  function Ra(e) {
    return mb(e, document.cookie);
  }
  function ab() {}
  function fb() {
    var e = 0;
    try {
      e = Math.round(pb.performance.timeOrigin);
    } catch (n) {}
    if (0 >= e || isNaN(e) || !isFinite(e)) {
      va(Ae, {
        severity: "Warning",
        type: "ptoi",
        text: "performance.timeOrigin is invalid, with a value of [".concat(
          e,
          "]. Falling back to performance.timing.navigationStart"
        ),
      });
      e = 0;
      try {
        e = pb.performance.timing.navigationStart;
      } catch (n) {}
      e = 0 >= e || isNaN(e) || !isFinite(e) ? kf : e;
    }
    Df = e;
    oe = qa;
    return Df;
  }
  function qa() {
    return Df;
  }
  function Ta() {
    return oe();
  }
  function ta() {
    var e,
      n = 0;
    if (
      null === (e = null === pb || void 0 === pb ? void 0 : pb.performance) ||
      void 0 === e
        ? 0
        : e.now
    )
      try {
        n = Math.round(pb.performance.now());
      } catch (O) {}
    return 0 >= n || isNaN(n) || !isFinite(n) ? new Date().getTime() - oe() : n;
  }
  function ka(e, n) {
    void 0 === n && (n = document.cookie);
    return mb(e, n);
  }
  function Ha() {}
  function Ia(e, n) {
    return function () {
      e.apply(n, arguments);
    };
  }
  function za(e) {
    if (!(this instanceof za))
      throw new TypeError("Promises must be constructed via new");
    if ("function" !== typeof e) throw new TypeError("not a function");
    this.ma = 0;
    this.wc = !1;
    this.sa = void 0;
    this.La = [];
    S(e, this);
  }
  function Ua(e, n) {
    for (; 3 === e.ma; ) e = e.sa;
    0 === e.ma
      ? e.La.push(n)
      : ((e.wc = !0),
        za.Qb(function () {
          var O = 1 === e.ma ? n.Xe : n.Ye;
          if (null === O) (1 === e.ma ? Xa : x)(n.promise, e.sa);
          else {
            try {
              var P = O(e.sa);
            } catch (ya) {
              x(n.promise, ya);
              return;
            }
            Xa(n.promise, P);
          }
        }));
  }
  function Xa(e, n) {
    try {
      if (n === e)
        throw new TypeError("A promise cannot be resolved with itself.");
      if (n && ("object" === typeof n || "function" === typeof n)) {
        var O = n.then;
        if (n instanceof za) {
          e.ma = 3;
          e.sa = n;
          w(e);
          return;
        }
        if ("function" === typeof O) {
          S(Ia(O, n), e);
          return;
        }
      }
      e.ma = 1;
      e.sa = n;
      w(e);
    } catch (P) {
      x(e, P);
    }
  }
  function x(e, n) {
    e.ma = 2;
    e.sa = n;
    w(e);
  }
  function w(e) {
    2 === e.ma &&
      0 === e.La.length &&
      za.Qb(function () {
        e.wc || za.Dc(e.sa);
      });
    for (var n = 0, O = e.La.length; n < O; n++) Ua(e, e.La[n]);
    e.La = null;
  }
  function K(e, n, O) {
    this.Xe = "function" === typeof e ? e : null;
    this.Ye = "function" === typeof n ? n : null;
    this.promise = O;
  }
  function S(e, n) {
    var O = !1;
    try {
      e(
        function (P) {
          O || ((O = !0), Xa(n, P));
        },
        function (P) {
          O || ((O = !0), x(n, P));
        }
      );
    } catch (P) {
      O || ((O = !0), x(n, P));
    }
  }
  function ja() {
    u.Qb = function (e) {
      if ("string" === typeof e)
        throw Error("Promise polyfill called _immediateFn with string");
      e();
    };
    u.Dc = function () {};
    return u;
  }
  function W(e, n) {
    return parseInt(e, n || 10);
  }
  function I(e) {
    return document.getElementsByTagName(e);
  }
  function da(e) {
    var n = e.length;
    if ("number" === typeof n) e = n;
    else {
      n = 0;
      for (var O = 2048; e[O - 1]; ) (n = O), (O += O);
      for (var P = 7; 1 < O - n; )
        (P = (O + n) / 2), e[P - 1] ? (n = P) : (O = P);
      e = e[P] ? O : n;
    }
    return e;
  }
  function va(e) {
    for (var n = [], O = 1; O < arguments.length; O++) n[O - 1] = arguments[O];
    e.push.apply(e, n);
  }
  function ua(e) {
    e = encodeURIComponent(e);
    var n = [];
    if (e)
      for (var O = 0; O < e.length; O++) {
        var P = e.charAt(O);
        va(n, E[P] || P);
      }
    return n.join("");
  }
  function R(e) {
    -1 < gb(e, "^") &&
      ((e = e.split("^^").join("^")),
      (e = e.split("^dq").join('"')),
      (e = e.split("^rb").join(">")),
      (e = e.split("^lb").join("<")),
      (e = e.split("^p").join("|")),
      (e = e.split("^e").join("=")),
      (e = e.split("^s").join(";")),
      (e = e.split("^c").join(",")),
      (e = e.split("^bs").join("\\")));
    return e;
  }
  function T(e, n) {
    if (!e || !e.length) return -1;
    if (e.indexOf) return e.indexOf(n);
    for (var O = e.length; O--; ) if (e[O] === n) return O;
    return -1;
  }
  function H(e, n) {
    var O;
    void 0 === n && (n = []);
    if (!e || ("object" !== typeof e && "function" !== typeof e)) return !1;
    var P = "number" !== typeof n ? n : [],
      ya = null,
      hb = [];
    switch ("number" === typeof n ? n : 5) {
      case 0:
        ya = "Array";
        hb.push("push");
        break;
      case 1:
        ya = "Boolean";
        break;
      case 2:
        ya = "Number";
        break;
      case 3:
        ya = "String";
        break;
      case 4:
        ya = "Function";
        break;
      case 5:
        ya = "Object";
        break;
      case 6:
        ya = "Date";
        hb.push("getTime");
        break;
      case 7:
        ya = "Error";
        hb.push("name", "message");
        break;
      case 8:
        ya = "Element";
        break;
      case 9:
        ya = "HTMLElement";
        break;
      case 10:
        ya = "HTMLImageElement";
        hb.push("complete");
        break;
      case 11:
        ya = "PerformanceEntry";
        break;
      case 12:
        ya = "PerformanceTiming";
        break;
      case 13:
        ya = "PerformanceResourceTiming";
        break;
      case 14:
        ya = "PerformanceNavigationTiming";
        break;
      case 15:
        ya = "CSSRule";
        hb.push("cssText", "parentStyleSheet");
        break;
      case 16:
        ya = "CSSStyleSheet";
        hb.push("cssRules", "insertRule");
        break;
      case 17:
        ya = "Request";
        hb.push("url");
        break;
      case 18:
        ya = "Response";
        hb.push("ok", "status", "statusText");
        break;
      case 19:
        ya = "Set";
        hb.push("add", "entries", "forEach");
        break;
      case 20:
        ya = "Map";
        hb.push("set", "entries", "forEach");
        break;
      case 21:
        ya = "Worker";
        hb.push("addEventListener", "postMessage", "terminate");
        break;
      case 22:
        ya = "XMLHttpRequest";
        hb.push("open", "send", "setRequestHeader");
        break;
      case 23:
        ya = "SVGScriptElement";
        hb.push("ownerSVGElement", "type");
        break;
      case 24:
        ya = "HTMLMetaElement";
        hb.push("httpEquiv", "content", "name");
        break;
      case 25:
        ya = "HTMLHeadElement";
        break;
      case 26:
        ya = "ArrayBuffer";
        break;
      case 27:
        (ya = "ShadowRoot"), hb.push("host", "mode");
    }
    n = ya;
    if (!n) return !1;
    hb = hb.length ? hb : P;
    if (!P.length)
      try {
        if (
          (pb[n] && e instanceof pb[n]) ||
          Object.prototype.toString.call(e) === "[object " + n + "]"
        )
          return !0;
        if (e && e.nodeType && 1 === e.nodeType) {
          var Qb =
            null === (O = e.ownerDocument.defaultView) || void 0 === O
              ? void 0
              : O[n];
          if ("function" === typeof Qb && e instanceof Qb) return !0;
        }
      } catch (hc) {}
    for (O = 0; O < hb.length; O++)
      if (
        ((P = hb[O]),
        ("string" !== typeof P &&
          "number" !== typeof P &&
          "symbol" !== typeof P) ||
          !(P in e))
      )
        return !1;
    return !!hb.length;
  }
  function X(e, n, O, P) {
    "undefined" === typeof P && (P = la(n, !0));
    "boolean" === typeof P && (P = la(n, P));
    if (e === pb) Va ? Va(n, O, P) : Hb && Hb("on" + n, O);
    else if (Nb && H(e, 21)) lc.call(e, n, O, P);
    else if (e.addEventListener)
      if (e === pb.document || e === pb.document.documentElement)
        Db.call(e, n, O, P);
      else
        try {
          Va.call(e, n, O, P);
        } catch (Qb) {
          e.addEventListener(n, O, P);
        }
    else e.attachEvent && e.attachEvent("on" + n, O);
    P = !1;
    for (var ya = Bc.length; 0 <= --ya; ) {
      var hb = Bc[ya];
      if (hb.object === e && hb.event === n && hb.I === O) {
        P = !0;
        break;
      }
    }
    P || va(Bc, { object: e, event: n, I: O });
  }
  function ia(e, n, O, P) {
    for (var ya = Bc.length; 0 <= --ya; ) {
      var hb = Bc[ya];
      if (hb.object === e && hb.event === n && hb.I === O) {
        Bc.splice(ya, 1);
        break;
      }
    }
    "undefined" === typeof P && (P = la(n, !0));
    "boolean" === typeof P && (P = la(n, P));
    e === pb
      ? nb
        ? nb(n, O, P)
        : Hb && Hb("on" + n, O)
      : e.removeEventListener
      ? e === pb.document || e === pb.document.documentElement
        ? Fb.call(e, n, O, P)
        : nb.call(e, n, O, P)
      : e.detachEvent && e.detachEvent("on" + n, O);
  }
  function la(e, n) {
    var O = !1;
    try {
      if (Va && -1 < T(jd, e)) {
        var P = Object.defineProperty({}, "passive", {
          get: function () {
            O = !0;
          },
        });
        Va("test", ab, P);
      }
    } catch (ya) {}
    return O ? { passive: !0, capture: n } : n;
  }
  function Da() {
    for (var e = Bc, n = e.length; 0 <= --n; ) {
      var O = e[n];
      ia(O.object, O.event, O.I);
    }
    Bc = [];
  }
  function Ca(e) {
    return (
      "function" === typeof e &&
      /{\s+\[native code]/.test(Function.prototype.toString.call(e))
    );
  }
  function v(e, n) {
    for (var O, P = [], ya = 2; ya < arguments.length; ya++)
      P[ya - 2] = arguments[ya];
    return void 0 !== Function.prototype.bind && Ca(Function.prototype.bind)
      ? (O = Function.prototype.bind).call.apply(O, Na([e, n], P, !1))
      : function () {
          for (var hb = 0; hb < arguments.length; hb++);
          return e.apply(
            n,
            (P || []).concat(Array.prototype.slice.call(arguments) || [])
          );
        };
  }
  function Y() {
    if (Xc) {
      var e = new Xc();
      if (pe)
        for (var n = 0, O = xd; n < O.length; n++) {
          var P = O[n];
          void 0 !== pe[P] && (e[P] = v(pe[P], e));
        }
      return e;
    }
    return Ec
      ? new Ec("MSXML2.XMLHTTP.3.0")
      : pb.XMLHttpRequest
      ? new pb.XMLHttpRequest()
      : new pb.ActiveXObject("MSXML2.XMLHTTP.3.0");
  }
  function M() {
    document.cookie = "".concat("__dTCookie", "=").concat("1", ";SameSite=Lax");
    var e = -1 !== document.cookie.indexOf("__dTCookie");
    document.cookie = ""
      .concat("__dTCookie", "=")
      .concat("1", "; expires=Thu, 01-Jan-1970 00:00:01 GMT");
    return e;
  }
  function Oa() {
    return void 0 === pb.dialogArguments ? navigator.cookieEnabled || M() : M();
  }
  function oa() {
    return Rd;
  }
  function $a(e) {
    Rd = e;
  }
  function cb(e) {
    var n = A("rid"),
      O = A("rpid");
    n && (e.rid = n);
    O && (e.rpid = O);
  }
  function qb(e) {
    if ((e = e.xb)) {
      e = R(e);
      try {
        Rd = new RegExp(e, "i");
      } catch (n) {}
    } else Rd = void 0;
  }
  function lb(e) {
    return "n" === e || "s" === e || "l" === e
      ? ";SameSite=".concat(cd[e])
      : "";
  }
  function jb(e, n, O) {
    var P = 1,
      ya = 0;
    do
      (document.cookie =
        e +
        '=""' +
        (n ? ";domain=" + n : "") +
        ";path=" +
        O.substring(0, P) +
        "; expires=Thu, 01 Jan 1970 00:00:01 GMT;"),
        (P = O.indexOf("/", P)),
        ya++;
    while (-1 !== P && 5 > ya);
  }
  function Ib() {
    if (pb.MobileAgent || pb.dynatraceMobile) {
      var e = Ra("dtAdkSettings");
      return Je.dT_.p3SC(e).privacyState || null;
    }
    return null;
  }
  function yb() {
    var e = Ib();
    return 2 === e || 1 === e
      ? !1
      : !Je.dT_.bcv("coo") || Je.dT_.bcv("cooO") || Je.dT_.iSM();
  }
  function wa(e, n) {
    return !yb() || (pb.dT_.overloadPrevention && !ra())
      ? null
      : e.apply(this, n || []);
  }
  function Lb(e, n) {
    try {
      var O = Pc;
      O && O.setItem(e, n);
    } catch (P) {}
  }
  function Cb(e, n) {
    wa(Lb, [e, n]);
  }
  function L(e) {
    try {
      var n = Pc;
      if (n) return n.getItem(e);
    } catch (O) {}
    return null;
  }
  function Qa(e) {
    try {
      var n = Pc;
      n && n.removeItem(e);
    } catch (O) {}
  }
  function bb(e) {
    document.cookie =
      e +
      '="";path=/' +
      (A("domain") ? ";domain=" + A("domain") : "") +
      "; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
  }
  function N(e, n, O, P) {
    Xe = !0;
    n || 0 === n
      ? ((n = (n + "").replace(/[;\n\r]/g, "_")),
        (e =
          e +
          "=" +
          n +
          ";path=/" +
          (A("domain") ? ";domain=" + A("domain") : "")),
        O && (e += ";expires=" + O.toUTCString()),
        (e += lb(A("cssm"))),
        P && "https:" === location.protocol && (e += ";Secure"),
        (document.cookie = e))
      : bb(e);
    Xe = !1;
  }
  function Z(e, n, O, P) {
    wa(N, [e, n, O, P]);
  }
  function sa(e) {
    return -1 === gb(e, "v_4") ? !1 : !0;
  }
  function Ya(e) {
    e = ka("dtCookie", e);
    e || ((e = L("dtCookie")) && sa(e) ? rb(e) : (e = ""));
    return sa(e) ? e : "";
  }
  function rb(e) {
    Z("dtCookie", e, void 0, p("ssc"));
  }
  function Bb(e) {
    return (e = e || Ya())
      ? wb(e)
      : { sessionId: "", serverId: "", overloadState: 0, appState: {} };
  }
  function V(e) {
    return Bb(e).serverId;
  }
  function ma(e) {
    return Bb(e).sessionId;
  }
  function ra() {
    return 0 <= gb(navigator.userAgent, "RuxitSynthetic");
  }
  function U(e) {
    var n = {},
      O = 0;
    for (e = e.split("|"); O < e.length; O++) {
      var P = e[O].split("=");
      2 === P.length &&
        (n[P[0]] = decodeURIComponent(P[1].replace(/\+/g, " ")));
    }
    return n;
  }
  function ca() {
    var e = A("csu");
    return (
      (e.indexOf("dbg") === e.length - 3 ? e.substring(0, e.length - 3) : e) +
      "_" +
      A("app") +
      "_Store"
    );
  }
  function Pa(e, n, O) {
    void 0 === n && (n = {});
    var P = 0;
    for (e = e.split("|"); P < e.length; P++) {
      var ya = e[P],
        hb = ya,
        Qb = gb(ya, "=");
      -1 === Qb
        ? (n[hb] = "1")
        : ((hb = ya.substring(0, Qb)),
          (n[hb] = ya.substring(Qb + 1, ya.length)));
    }
    !O &&
      ((O = n), (P = O.spc)) &&
      ((e = document.createElement("textarea")),
      (e.innerHTML = P),
      (O.spc = e.value));
    return n;
  }
  function xa(e) {
    var n;
    return null !== (n = Xb[e]) && void 0 !== n ? n : Ud[e];
  }
  function p(e) {
    e = xa(e);
    return "false" === e || "0" === e ? !1 : !!e;
  }
  function J(e) {
    var n = xa(e);
    n = W(n);
    isNaN(n) && (n = Ud[e]);
    return n;
  }
  function A(e) {
    return (xa(e) || "") + "";
  }
  function G(e, n) {
    Xb[e] = n + "";
  }
  function na(e) {
    return (Xb = e);
  }
  function B(e) {
    Xb[e] = 0 > gb(Xb[e], "#" + e.toUpperCase()) ? Xb[e] : "";
  }
  function Ka(e) {
    var n = e.agentUri;
    n &&
      -1 < gb(n, "_") &&
      (n = /([a-zA-Z]*)[0-9]{0,4}_([a-zA-Z_0-9]*)_[0-9]+/g.exec(n)) &&
      n.length &&
      2 < n.length &&
      ((e.csu = n[1]), (e.featureHash = n[2]));
  }
  function fa(e) {
    var n = e.domain || "";
    var O =
      (O = location.hostname) && n
        ? O === n || -1 !== O.indexOf("." + n, O.length - ("." + n).length)
        : !0;
    if (!n || !O) {
      e.domainOverride ||
        ((e.domainOriginal = e.domain || ""),
        (e.domainOverride = "".concat(location.hostname, ",").concat(n)),
        delete e.domain);
      var P = A("cssm");
      var ya = document.domain || "";
      if (ya) {
        ya = ya.split(".").reverse();
        var hb = ya.length;
        if (1 >= hb) P = "";
        else {
          for (var Qb = ya[0], hc = "", xc = 1; xc <= hb; xc++)
            if (ka("dTValidationCookie")) {
              hc = Qb;
              break;
            } else {
              ya[xc] && (Qb = "".concat(ya[xc], ".").concat(Qb));
              var Dc = ""
                .concat(
                  "dTValidationCookie",
                  "=dTValidationCookieValue;path=/;domain="
                )
                .concat(Qb);
              Dc += lb(P);
              document.cookie = Dc;
            }
          jb("dTValidationCookie", hc, "/");
          P = hc;
        }
      } else P = "";
      P && (e.domain = P);
      O ||
        va(Ae, {
          type: "dpi",
          severity: "Warning",
          text: 'Configured domain "'
            .concat(n, '" is invalid for current location "')
            .concat(location.hostname, '". Agent will use "')
            .concat(e.domain, '" instead.'),
        });
    }
  }
  function Aa(e, n) {
    fa(e);
    var O = Xb.pVO;
    O && (e.pVO = O);
    n || ((n = e.bp || Ud.bp), e.bp2 && (n = 2), (e.bp = n + ""));
  }
  function Ga() {
    return Xb;
  }
  function db(e) {
    return Ud[e] === xa(e);
  }
  function wb(e) {
    var n,
      O = {},
      P = { sessionId: "", serverId: "", overloadState: 0, appState: O },
      ya = e.split("_");
    if (2 < ya.length && 0 === ya.length % 2) {
      e = +ya[1];
      if (isNaN(e) || 3 > e) return P;
      e = {};
      for (var hb = 2; hb < ya.length; hb++) {
        var Qb = ya[hb];
        0 === gb(Qb, Hd)
          ? (O[Qb.substring(6).toLowerCase()] = +ya[hb + 1])
          : (e[Qb] = ya[hb + 1]);
        hb++;
      }
      e.sn
        ? ((ya = e.sn), (ya = 32 === ya.length || 12 >= ya.length ? ya : ""))
        : (ya = "hybrid");
      P.sessionId = ya;
      if (e.srv) {
        a: {
          ya = e.srv.replace("-2D", "-");
          if (!isNaN(+ya) && ((hb = W(ya)), -99 <= hb && 99 >= hb)) break a;
          ya = "";
        }
        P.serverId = ya;
      }
      ya = +e.ol;
      1 === ya && Vb(ra());
      0 <= ya && 2 >= ya && (P.overloadState = ya);
      e = +e.prv;
      isNaN(e) || (P.privacyState = 1 > e || 4 < e ? 1 : e);
      e = null === (n = A("app")) || void 0 === n ? void 0 : n.toLowerCase();
      n = O[e];
      isNaN(n) || 0 !== n || Vb(ra());
    }
    return P;
  }
  function Vb(e) {
    var n = pb.dT_;
    e || ((n.disabled = !0), (n.overloadPrevention = !0));
  }
  function Rb() {
    return Qc();
  }
  function Sb(e, n) {
    function O() {
      delete lf[hb];
      e.apply(this, arguments);
    }
    for (var P = [], ya = 2; ya < arguments.length; ya++)
      P[ya - 2] = arguments[ya];
    if ("apply" in Be) {
      P.unshift(O, n);
      var hb = Be.apply(pb, P);
    } else hb = Be(O, n);
    lf[hb] = !0;
    return hb;
  }
  function mc(e) {
    delete lf[e];
    "apply" in Ke ? Ke.call(pb, e) : Ke(e);
  }
  function Hc(e) {
    va(ge, e);
  }
  function Tc(e) {
    for (var n = ge.length; n--; )
      if (ge[n] === e) {
        ge.splice(n, 1);
        break;
      }
  }
  function Zc() {
    return ge;
  }
  function tc(e, n) {
    return xh(e, n);
  }
  function ac(e) {
    Ce(e);
  }
  function Za(e, n) {
    if (!mf || !nf) return "";
    e = new mf([e], { type: n });
    return nf(e);
  }
  function rc(e, n) {
    return $d ? new $d(e, n) : void 0;
  }
  function D(e) {
    "function" === typeof e && va(Bg, e);
  }
  function ha() {
    return Bg;
  }
  function La() {
    return kf;
  }
  function Ma(e) {
    return function () {
      for (var n = [], O = 0; O < arguments.length; O++) n[O] = arguments[O];
      if ("number" !== typeof n[0] || !lf[n[0]])
        try {
          return e.apply(this, n);
        } catch (P) {
          return e(n[0]);
        }
    };
  }
  function sb() {
    return Ae;
  }
  function Ab() {
    oe = fb;
    pb.performance &&
      (Qc = function () {
        return Math.round(oe() + ta());
      });
    if (!Qc || isNaN(Qc()) || 0 >= Qc() || !isFinite(Qc()))
      Qc = function () {
        return new Date().getTime();
      };
  }
  function Eb() {
    of && ((pb.clearTimeout = Ke), (pb.clearInterval = Ce), (of = !1));
  }
  function Tb(e, n) {
    try {
      pb.localStorage && pb.localStorage.setItem(e, n);
    } catch (O) {}
  }
  function bc(e) {
    try {
      pb.localStorage && pb.localStorage.removeItem(e);
    } catch (n) {}
  }
  function Zb() {
    bc("rxec");
    bc("rxvisitid");
    bc("rxvt");
  }
  function Nc(e) {
    yb() ? e() : (Ye || (Ye = []), va(Ye, e));
  }
  function sd(e) {
    return wa(e);
  }
  function $b() {
    if (p("coo") && !yb()) {
      for (var e = 0, n = Ye; e < n.length; e++) Sb(n[e], 0);
      Ye = [];
      G("cooO", !0);
    }
  }
  function Rc() {
    if (p("coo") && yb()) {
      G("cooO", !1);
      bb("dtCookie");
      bb("dtPC");
      bb("dtLatC");
      bb("dtSa");
      bb("dtAdk");
      bb("rxVisitor");
      bb("rxvt");
      try {
        Qa("rxec");
        Qa("rxvisitid");
        Qa("rxvt");
        Zb();
        var e = Pc;
        e && (e.removeItem("rxVisitor"), e.removeItem("dtCookie"));
        if ((e = Ef)) e.removeItem(ca()), e.removeItem("dtAdk");
      } catch (n) {}
    }
  }
  function Fc(e, n) {
    void 0 === n && (n = document.cookie || "");
    return n.split(e + "=").length - 1;
  }
  function dc(e, n) {
    var O = Fc(e, n);
    if (1 < O) {
      n = A("domain") || pb.location.hostname;
      var P = pb.location.hostname,
        ya = pb.location.pathname,
        hb = 0,
        Qb = 0;
      Kd.push(e);
      do {
        var hc = P.substring(hb);
        if (hc !== n || "/" !== ya) {
          jb(e, hc === n ? "" : hc, ya);
          var xc = Fc(e);
          xc < O && (Kd.push(hc), (O = xc));
        }
        hb = P.indexOf(".", hb) + 1;
        Qb++;
      } while (0 !== hb && 10 > Qb && 1 < O);
      A("domain") && 1 < O && jb(e, "", ya);
    }
  }
  function zc() {
    var e = document.cookie;
    dc("dtPC", e);
    dc("dtCookie", e);
    dc("dtLatC", e);
    dc("rxvt", e);
    0 < Kd.length &&
      va(Ae, {
        severity: "Error",
        type: "dcn",
        text: "Duplicate cookie name"
          .concat(1 !== Kd.length ? "s" : "", " detected: ")
          .concat(Kd.join(", ")),
      });
    Hc(function (n, O, P, ya) {
      0 < Kd.length && !O && (n.av(ya, "dCN", Kd.join(",")), (Kd = []));
      0 < pf.length && !O && (n.av(ya, "eCC", pf.join(",")), (pf = []));
    });
  }
  function $c(e) {
    var n = e,
      O = Math.pow(2, 32);
    return function () {
      n = (1664525 * n + 1013904223) % O;
      return n / O;
    };
  }
  function Vc(e, n) {
    return isNaN(e) || isNaN(n)
      ? Math.floor(33 * Le())
      : Math.floor(Le() * (n - e + 1)) + e;
  }
  function ic(e) {
    if (!e) return "";
    var n = pb.crypto || pb.msCrypto;
    if (n && -1 === gb(navigator.userAgent, "Googlebot"))
      n = n.getRandomValues(new Uint8Array(e));
    else {
      n = [];
      for (var O = 0; O < e; O++) n.push(Vc(0, 32));
    }
    e = [];
    for (O = 0; O < n.length; O++) {
      var P = Math.abs(n[O] % 32);
      e.push(String.fromCharCode(P + (9 >= P ? 48 : 55)));
    }
    return e.join("");
  }
  function jc() {
    return Me;
  }
  function oc(e) {
    e &&
      (null === e || void 0 === e ? 0 : e.configurable) &&
      e.set &&
      e.get &&
      Object.defineProperty(document, "cookie", {
        get: function () {
          return e.get.call(document);
        },
        set: function (n) {
          var O = n.split("=")[0];
          e.set.call(document, n);
          Xe
            ? 1 < Fc(O) && Kd.push(O)
            : -1 < T(Cg, O) &&
              (pf.push(O),
              -1 === T(Ze, O) &&
                (va(Ze, O),
                va(Ae, {
                  severity: "Error",
                  type: "ecm",
                  text: "Invalid modification of agent cookie ".concat(
                    O,
                    " detected. Modifying Dynatrace cookies may result in missing or invalid data."
                  ),
                })));
        },
      });
  }
  function Pb(e) {
    void 0 === e && (e = !0);
    Ff = e;
  }
  function fc(e, n, O) {
    var P = J("pcl");
    P = e.length - P;
    0 < P && e.splice(0, P);
    P = V(ka("dtCookie", O));
    for (
      var ya = [], hb = P ? "".concat(P, "$") : "", Qb = 0;
      Qb < e.length;
      Qb++
    ) {
      var hc = e[Qb];
      "-" !== hc.B &&
        ya.push("".concat(hb).concat(hc.frameId, "h").concat(hc.B));
    }
    e = ya.join("p");
    e ||
      (Ff && (yd(!0, "a", O), Pb(!1)),
      (e += "".concat(P, "$").concat(Me, "h-")));
    e += "v".concat(n || Vd(O));
    Z("dtPC", e + "e0", void 0, p("ssc"));
  }
  function kd(e, n) {
    void 0 === n && (n = document.cookie);
    var O = ka("dtPC", n);
    n = [];
    if (O && "-" !== O) {
      var P = "";
      var ya = 0;
      for (O = O.split("p"); ya < O.length; ya++) {
        var hb = O[ya],
          Qb = P,
          hc = e;
        void 0 === Qb && (Qb = "");
        P = gb(hb, "$");
        var xc = gb(hb, "h");
        var Dc = gb(hb, "v"),
          dd = gb(hb, "e");
        P = hb.substring(P + 1, xc);
        xc = -1 !== Dc ? hb.substring(xc + 1, Dc) : hb.substring(xc + 1);
        Qb ||
          -1 === Dc ||
          (Qb = -1 !== dd ? hb.substring(Dc + 1, dd) : hb.substring(Dc + 1));
        hb = null;
        hc ||
          ((hc = W(P.split("_")[0])),
          (Dc = Qc() % fg),
          Dc < hc && (Dc += fg),
          (hc = hc + 9e5 > Dc));
        hc && (hb = { frameId: P, B: "-" === xc ? "-" : W(xc), visitId: "" });
        P = Qb;
        (xc = hb) && n.push(xc);
      }
      for (e = 0; e < n.length; e++) n[e].visitId = P;
    }
    return n;
  }
  function ae(e, n) {
    var O = document.cookie;
    n = kd(n, O);
    for (var P = !1, ya = 0; ya < n.length; ya++) {
      var hb = n[ya];
      hb.frameId === Me && ((hb.B = e), (P = !0));
    }
    P || va(n, { frameId: Me, B: e, visitId: "" });
    fc(n, void 0, O);
  }
  function Vd(e) {
    return Ld(e) || yd(!0, "c", e);
  }
  function Ld(e) {
    if (vb(e) <= Qc()) return yd(!0, "t", e);
    var n = td(e);
    if (!n) return yd(!0, "c", e);
    var O = Wd.exec(n);
    if (!O || 3 !== O.length || 32 !== O[1].length || isNaN(W(O[2])))
      return yd(!0, "i", e);
    Cb("rxvisitid", n);
    return n;
  }
  function he(e, n) {
    var O = Qc();
    n = eb(n).Tc;
    e && (n = O);
    ea(O + ie + "|" + n);
    F();
  }
  function je(e) {
    var n = "t" + (Qc() - vb(e)),
      O = td(e),
      P = hd();
    nd(P, e);
    r(P, n, O);
  }
  function td(e) {
    var n, O;
    return null !==
      (O = null === (n = kd(!0, e)[0]) || void 0 === n ? void 0 : n.visitId) &&
      void 0 !== O
      ? O
      : L("rxvisitid");
  }
  function hd() {
    var e = ic(32);
    try {
      e = e.replace(/[0-9]/g, function (n) {
        n = 0.1 * W(n);
        return String.fromCharCode(Math.floor(25 * n + 65));
      });
    } catch (n) {
      throw (H(n, 7), n);
    }
    return e + "-0";
  }
  function nd(e, n) {
    var O = kd(!1, n);
    fc(O, e, n);
    Cb("rxvisitid", e);
    he(!0);
  }
  function Ne(e, n, O) {
    return yd(e, n, O);
  }
  function yd(e, n, O) {
    e && ($e = !0);
    e = td(O);
    O = hd();
    nd(O);
    r(O, n, e);
    return O;
  }
  function r(e, n, O) {
    if (td(document.cookie))
      for (var P = 0, ya = De; P < ya.length; P++) (0, ya[P])(e, $e, n, O);
  }
  function y(e) {
    De.push(e);
  }
  function F(e) {
    be && mc(be);
    be = Sb(ba, vb(e) - Qc());
  }
  function ba() {
    var e = document.cookie;
    if (vb(e) <= Qc()) return wa(je, [e]), !0;
    Nc(F);
    return !1;
  }
  function ea(e) {
    Z("rxvt", e, void 0, p("ssc"));
    Cb("rxvt", e);
  }
  function Ea(e, n) {
    (n = ka(e, n)) || (n = L(e) || "");
    return n;
  }
  function Wa() {
    var e = Ld() || "";
    Cb("rxvisitid", e);
    e = Ea("rxvt");
    ea(e);
    Zb();
  }
  function eb(e) {
    var n = { he: 0, Tc: 0 };
    if ((e = Ea("rxvt", e)))
      try {
        var O = e.split("|");
        2 === O.length &&
          ((n.he = parseInt(O[0], 10)), (n.Tc = parseInt(O[1], 10)));
      } catch (P) {}
    return n;
  }
  function vb(e) {
    e = eb(e);
    return Math.min(e.he, e.Tc + qf);
  }
  function ob(e) {
    ie = e;
  }
  function Jb() {
    var e = $e;
    $e = !1;
    return e;
  }
  function Wb() {
    ba() || he(!1);
  }
  function Lc(e) {
    try {
      if (pb.localStorage) return pb.localStorage.getItem(e);
    } catch (n) {}
    return null;
  }
  function Cc() {
    var e = ka("rxVisitor");
    (e && 45 === (null === e || void 0 === e ? void 0 : e.length)) ||
      ((e = Lc("rxVisitor") || L("rxVisitor")),
      45 !== (null === e || void 0 === e ? void 0 : e.length) &&
        ((Dd = !0), (e = Qc() + ""), (e += ic(45 - e.length))));
    Oc(e);
    return e;
  }
  function Oc(e) {
    if (p("dpvc") || p("pVO")) Cb("rxVisitor", e);
    else {
      var n = new Date();
      var O = n.getMonth() + Math.min(24, Math.max(1, J("rvcl")));
      n.setMonth(O);
      wa(Tb, ["rxVisitor", e]);
    }
    Z("rxVisitor", e, n, p("ssc"));
  }
  function Ad() {
    return Dd;
  }
  function Sd(e) {
    var n = ka("rxVisitor");
    bb("rxVisitor");
    Qa("rxVisitor");
    bc("rxVisitor");
    G("pVO", !0);
    Oc(n);
    e && wa(Tb, ["dt-pVO", "1"]);
    Wa();
  }
  function Bd() {
    bc("dt-pVO");
    p("pVO") && (G("pVO", !1), Cc());
    Qa("rxVisitor");
    Wa();
  }
  function qd(e, n, O, P, ya) {
    var hb = document.createElement("script");
    hb.setAttribute("src", e);
    n && hb.setAttribute("defer", "defer");
    O && (hb.onload = O);
    P && (hb.onerror = P);
    ya && hb.setAttribute("id", ya);
    hb.setAttribute("crossorigin", "anonymous");
    e = document.getElementsByTagName("script")[0];
    e.parentElement.insertBefore(hb, e);
  }
  function af(e, n) {
    return (
      gg +
      "/" +
      (n || Ee) +
      "_" +
      e +
      "_" +
      (J("buildNumber") || pb.dT_.version) +
      ".js"
    );
  }
  function rf() {
    var e, n;
    try {
      null ===
        (n =
          null === (e = pb.MobileAgent) || void 0 === e
            ? void 0
            : e.incrementActionCount) || void 0 === n
        ? void 0
        : n.call(e);
    } catch (O) {}
  }
  function bf() {
    var e,
      n = pb.dT_;
    pb.dT_ =
      ((e = {}),
      (e.di = 0),
      (e.version = "10261230220152234"),
      (e.cfg = n ? n.cfg : ""),
      (e.iCE = n
        ? Oa
        : function () {
            return navigator.cookieEnabled;
          }),
      (e.ica = 1),
      (e.disabled = !1),
      (e.overloadPrevention = !1),
      (e.gAST = La),
      (e.ww = rc),
      (e.stu = Za),
      (e.nw = Rb),
      (e.apush = va),
      (e.st = Sb),
      (e.si = tc),
      (e.aBPSL = Hc),
      (e.rBPSL = Tc),
      (e.gBPSL = Zc),
      (e.aBPSCC = D),
      (e.gBPSCC = ha),
      (e.buildType = "dynatrace"),
      (e.gSSV = L),
      (e.sSSV = Cb),
      (e.rSSV = Qa),
      (e.rvl = bc),
      (e.pn = W),
      (e.iVSC = sa),
      (e.p3SC = wb),
      (e.io = gb),
      (e.dC = bb),
      (e.sC = Z),
      (e.esc = ua),
      (e.gSId = V),
      (e.gDtc = ma),
      (e.gSC = Ya),
      (e.sSC = rb),
      (e.gC = Ra),
      (e.cRN = Vc),
      (e.cRS = ic),
      (e.gEL = da),
      (e.gEBTN = I),
      (e.cfgO = Ga),
      (e.pCfg = U),
      (e.pCSAA = Pa),
      (e.cFHFAU = Ka),
      (e.sCD = Aa),
      (e.bcv = p),
      (e.ncv = J),
      (e.scv = A),
      (e.stcv = G),
      (e.rplC = na),
      (e.cLSCK = ca),
      (e.gFId = jc),
      (e.gBAU = af),
      (e.iS = qd),
      (e.eWE = Nc),
      (e.oEIE = sd),
      (e.oEIEWA = wa),
      (e.eA = $b),
      (e.dA = Rc),
      (e.iNV = Ad),
      (e.gVID = Cc),
      (e.dPV = Sd),
      (e.ePV = Bd),
      (e.sVIdUP = Pb),
      (e.sVTT = ob),
      (e.sVID = nd),
      (e.rVID = Ld),
      (e.gVI = Vd),
      (e.gNVIdN = Ne),
      (e.gARnVF = Jb),
      (e.cAUV = Wb),
      (e.uVT = he),
      (e.aNVL = y),
      (e.gPC = kd),
      (e.cPC = ae),
      (e.sPC = fc),
      (e.clB = Eb),
      (e.ct = mc),
      (e.aRI = cb),
      (e.iXB = qb),
      (e.gXBR = oa),
      (e.sXBR = $a),
      (e.de = R),
      (e.cCL = ib),
      (e.iEC = rf),
      (e.rnw = ta),
      (e.gto = Ta),
      (e.ael = X),
      (e.rel = ia),
      (e.sup = la),
      (e.cuel = Da),
      (e.iAEPOO = yb),
      (e.iSM = ra),
      (e.aIOf = T),
      (e.gxwp = Y),
      (e.iIO = H),
      (e.prm = ja),
      (e.cI = ac),
      (e.gidi = sb),
      (e.iDCV = db),
      (e.gCF = ka),
      (e.gPSMB = Ib),
      (e.lvl = Lc),
      e);
  }
  function Yg() {
    if (p("nsfnv")) {
      var e = ka("dtCookie");
      if (-1 === gb(e, "".concat(Nf, "-"))) {
        var n = wb(e).serverId;
        e = e.replace(
          "".concat(Nf).concat(n),
          "".concat(Nf).concat("".concat(-1 * Vc(2, 99)).replace("-", "-2D"))
        );
        rb(e);
      }
    }
  }
  function hg() {
    Nc(function () {
      if (!ma()) {
        var e = -1 * Vc(2, 99),
          n = ic(32);
        rb(
          "v_4"
            .concat(Nf)
            .concat("".concat(e).replace("-", "-2D"), "_sn_")
            .concat(n)
        );
      }
    });
    y(Yg);
  }
  "undefined" !== typeof window &&
    window.setTimeout &&
    (window.setTimeout = window.setTimeout);
  this.dT_ && dT_.prm && dT_.prm();
  var Je = "undefined" !== typeof window ? window : self,
    Zg;
  (function (e) {
    e[(e.ENABLED = 0)] = "ENABLED";
    e[(e.DISABLED = 1)] = "DISABLED";
    e[(e.DELAYED = 2)] = "DELAYED";
  })(Zg || (Zg = {}));
  var Oe;
  (function (e) {
    e[(e.BLOCKED_BY_PERCENTAGE = 0)] = "BLOCKED_BY_PERCENTAGE";
    e[(e.ENABLED = 1)] = "ENABLED";
    e[(e.BLOCKED = 2)] = "BLOCKED";
  })(Oe || (Oe = {}));
  var qe;
  (function (e) {
    e[(e.NONE = 1)] = "NONE";
    e[(e.OFF = 2)] = "OFF";
    e[(e.PERFORMANCE = 3)] = "PERFORMANCE";
    e[(e.BEHAVIOR = 4)] = "BEHAVIOR";
  })(qe || (qe = {}));
  var Fe;
  (function (e) {
    e.OVERLOAD_PREVENTION = "ol";
    e.PRIVACY_STATE = "prv";
    e.SERVER_ID = "srv";
    e.SESSION_ID = "sn";
  })(Fe || (Fe = {}));
  var re;
  (function (e) {
    e.DYNATRACE_MOBILE = "dynatraceMobile";
    e.MOBILE_AGENT = "MobileAgent";
  })(re || (re = {}));
  var Ed;
  (function (e) {
    e[(e.ARRAY = 0)] = "ARRAY";
    e[(e.BOOLEAN = 1)] = "BOOLEAN";
    e[(e.NUMBER = 2)] = "NUMBER";
    e[(e.STRING = 3)] = "STRING";
    e[(e.FUNCTION = 4)] = "FUNCTION";
    e[(e.OBJECT = 5)] = "OBJECT";
    e[(e.DATE = 6)] = "DATE";
    e[(e.ERROR = 7)] = "ERROR";
    e[(e.ELEMENT = 8)] = "ELEMENT";
    e[(e.HTML_ELEMENT = 9)] = "HTML_ELEMENT";
    e[(e.HTML_IMAGE_ELEMENT = 10)] = "HTML_IMAGE_ELEMENT";
    e[(e.PERFORMANCE_ENTRY = 11)] = "PERFORMANCE_ENTRY";
    e[(e.PERFORMANCE_TIMING = 12)] = "PERFORMANCE_TIMING";
    e[(e.PERFORMANCE_RESOURCE_TIMING = 13)] = "PERFORMANCE_RESOURCE_TIMING";
    e[(e.PERFORMANCE_NAVIGATION_TIMING = 14)] = "PERFORMANCE_NAVIGATION_TIMING";
    e[(e.CSS_RULE = 15)] = "CSS_RULE";
    e[(e.CSS_STYLE_SHEET = 16)] = "CSS_STYLE_SHEET";
    e[(e.REQUEST = 17)] = "REQUEST";
    e[(e.RESPONSE = 18)] = "RESPONSE";
    e[(e.SET = 19)] = "SET";
    e[(e.MAP = 20)] = "MAP";
    e[(e.WORKER = 21)] = "WORKER";
    e[(e.XML_HTTP_REQUEST = 22)] = "XML_HTTP_REQUEST";
    e[(e.SVG_SCRIPT_ELEMENT = 23)] = "SVG_SCRIPT_ELEMENT";
    e[(e.HTML_META_ELEMENT = 24)] = "HTML_META_ELEMENT";
    e[(e.HTML_HEAD_ELEMENT = 25)] = "HTML_HEAD_ELEMENT";
    e[(e.ARRAY_BUFFER = 26)] = "ARRAY_BUFFER";
    e[(e.SHADOW_ROOT = 27)] = "SHADOW_ROOT";
  })(Ed || (Ed = {}));
  var pb = "undefined" !== typeof window ? window : self,
    Df,
    oe,
    z = setTimeout;
  za.prototype["catch"] = function (e) {
    return this.then(null, e);
  };
  za.prototype.then = function (e, n) {
    var O = new this.constructor(Ha);
    Ua(this, new K(e, n, O));
    return O;
  };
  za.prototype["finally"] = function (e) {
    var n = this.constructor;
    return this.then(
      function (O) {
        return n.resolve(e()).then(function () {
          return O;
        });
      },
      function (O) {
        return n.resolve(e()).then(function () {
          return n.reject(O);
        });
      }
    );
  };
  za.all = function (e) {
    return new za(function (n, O) {
      function P(hc, xc) {
        try {
          if (xc && ("object" === typeof xc || "function" === typeof xc)) {
            var Dc = xc.then;
            if ("function" === typeof Dc) {
              Dc.call(
                xc,
                function (dd) {
                  P(hc, dd);
                },
                O
              );
              return;
            }
          }
          ya[hc] = xc;
          0 === --hb && n(ya);
        } catch (dd) {
          O(dd);
        }
      }
      if (!e || "undefined" === typeof e.length)
        return O(new TypeError("Promise.all accepts an array"));
      var ya = Array.prototype.slice.call(e);
      if (0 === ya.length) return n([]);
      for (var hb = ya.length, Qb = 0; Qb < ya.length; Qb++) P(Qb, ya[Qb]);
    });
  };
  za.allSettled = function (e) {
    return new this(function (n, O) {
      function P(Qb, hc) {
        if (hc && ("object" === typeof hc || "function" === typeof hc)) {
          var xc = hc.then;
          if ("function" === typeof xc) {
            xc.call(
              hc,
              function (Dc) {
                P(Qb, Dc);
              },
              function (Dc) {
                ya[Qb] = { status: "rejected", reason: Dc };
                0 === --hb && n(ya);
              }
            );
            return;
          }
        }
        ya[Qb] = { status: "fulfilled", value: hc };
        0 === --hb && n(ya);
      }
      if (!e || "undefined" === typeof e.length)
        return O(
          new TypeError(
            typeof e +
              " " +
              e +
              " is not iterable(cannot read property Symbol(Symbol.iterator))"
          )
        );
      var ya = Array.prototype.slice.call(e);
      if (0 === ya.length) return n([]);
      var hb = ya.length;
      for (O = 0; O < ya.length; O++) P(O, ya[O]);
    });
  };
  za.resolve = function (e) {
    return e && "object" === typeof e && e.constructor === za
      ? e
      : new za(function (n) {
          n(e);
        });
  };
  za.reject = function (e) {
    return new za(function (n, O) {
      O(e);
    });
  };
  za.race = function (e) {
    return new za(function (n, O) {
      if (!e || "undefined" === typeof e.length)
        return O(new TypeError("Promise.race accepts an array"));
      for (var P = 0, ya = e.length; P < ya; P++) za.resolve(e[P]).then(n, O);
    });
  };
  za.Qb =
    ("function" === typeof setImmediate &&
      function (e) {
        setImmediate(e);
      }) ||
    function (e) {
      z(e, 0);
    };
  za.Dc = function (e) {
    "undefined" !== typeof console &&
      console &&
      console.warn("Possible Unhandled Promise Rejection:", e);
  };
  var u = za,
    E = {
      "!": "%21",
      "~": "%7E",
      "*": "%2A",
      "(": "%28",
      ")": "%29",
      "'": "%27",
      $: "%24",
      ";": "%3B",
      ",": "%2C",
    },
    pa;
  (function (e) {
    e.ANCHOR = "A";
    e.BUTTON = "BUTTON";
    e.FORM = "FORM";
    e.I_FRAME = "IFRAME";
    e.IMAGE = "IMG";
    e.INPUT = "INPUT";
    e.LABEL = "LABEL";
    e.LINK = "LINK";
    e.OPTION = "OPTION";
    e.SCRIPT = "SCRIPT";
    e.SELECT = "SELECT";
    e.STYLE = "STYLE";
    e.TEXT_AREA = "TEXTAREA";
  })(pa || (pa = {}));
  var Va,
    nb,
    Db,
    Fb,
    Hb = pb.attachEvent,
    Nb = pb.Worker,
    lc = Nb && Nb.prototype.addEventListener,
    Bc = [],
    jd = ["touchstart", "touchend", "scroll"],
    Xc,
    Ec,
    xd =
      "abort getAllResponseHeaders getResponseHeader open overrideMimeType send setRequestHeader".split(
        " "
      ),
    pe,
    Rd,
    ld;
  (function (e) {
    e.LAX = "l";
    e.NONE = "n";
    e.NOT_SET = "0";
    e.STRICT = "s";
  })(ld || (ld = {}));
  var Ud,
    Cd,
    cd = ((Cd = {}), (Cd.l = "Lax"), (Cd.s = "Strict"), (Cd.n = "None"), Cd),
    Pc,
    Xe = !1,
    Xb = {},
    Hd = "app-3A",
    $d = pb.Worker,
    mf = pb.Blob,
    nf = pb.URL && pb.URL.createObjectURL,
    Ke,
    Ce,
    Be,
    xh,
    of = !1,
    ge,
    Bg = [],
    Ae = [],
    kf,
    Ef,
    lf = {},
    Qc,
    Ye = [],
    Kd = [],
    pf = [],
    Le,
    ig,
    Me,
    fg = 6e8,
    Cg = [],
    Ze = [],
    Ff = !1,
    Wd = /([A-Z]+)-([0-9]+)/,
    De = [],
    ie,
    qf,
    $e = !1,
    be,
    Dd = !1,
    Pe,
    gg,
    Ee,
    Nf = "".concat("_", "srv").concat("_");
  (function () {
    var e,
      n,
      O =
        0 >
        (null === (e = navigator.userAgent) || void 0 === e
          ? void 0
          : e.indexOf("RuxitSynthetic"));
    if (
      !pb.dT_ ||
      !pb.dT_.cfg ||
      "string" !== typeof pb.dT_.cfg ||
      ("initialized" in pb.dT_ && pb.dT_.initialized)
    )
      null === (n = pb.console) || void 0 === n
        ? void 0
        : n.log(
            "InitConfig not found or agent already initialized! This is an injection issue."
          ),
        pb.dT_ && (pb.dT_.di = 3);
    else if (O)
      try {
        bf();
        var P;
        Ud =
          ((P = {}),
          (P.ade = ""),
          (P.aew = !0),
          (P.apn = ""),
          (P.agentLocation = ""),
          (P.agentUri = ""),
          (P.app = ""),
          (P.async = !1),
          (P.ase = !1),
          (P.auto = !1),
          (P.bp1 = !1),
          (P.bp2 = !1),
          (P.bp = 1),
          (P.bisaoi = !1),
          (P.bisCmE = ""),
          (P.bs = !1),
          (P.buildNumber = 0),
          (P.csprv = !0),
          (P.cepl = 16e3),
          (P.cls = !0),
          (P.ccNcss = !1),
          (P.cg = !1),
          (P.coo = !1),
          (P.cooO = !1),
          (P.cssm = "0"),
          (P.cwt = ""),
          (P.cwtUrl = "27pd8x1igg"),
          (P.cors = !1),
          (P.csu = ""),
          (P.cuc = ""),
          (P.cce = !1),
          (P.cux = !1),
          (P.dataDtConfig = ""),
          (P.debugName = ""),
          (P.dvl = 500),
          (P.dASXH = !1),
          (P.disableCookieManager = !1),
          (P.disableLogging = !1),
          (P.dmo = !1),
          (P.doel = !1),
          (P.dpch = !1),
          (P.dpvc = !1),
          (P.disableXhrFailures = !1),
          (P.domain = ""),
          (P.domainOverride = ""),
          (P.domainOriginal = ""),
          (P.doNotDetect = ""),
          (P.ds = !0),
          (P.dsndb = !1),
          (P.dsa = !1),
          (P.dsss = !1),
          (P.dssv = !0),
          (P.earxa = !0),
          (P.exp = !1),
          (P.eni = !0),
          (P.erjdw = !0),
          (P.expw = !1),
          (P.instr = ""),
          (P.evl = ""),
          (P.extblacklist = ""),
          (P.euf = !1),
          (P.fau = !0),
          (P.fa = !1),
          (P.fvdi = !1),
          (P.featureHash = ""),
          (P.hvt = 216e5),
          (P.ffi = !1),
          (P.imm = !1),
          (P.ign = ""),
          (P.iub = ""),
          (P.iqvn = !1),
          (P.initializedModules = ""),
          (P.lastModification = 0),
          (P.lupr = !0),
          (P.lab = !1),
          (P.legacy = !1),
          (P.lt = !0),
          (P.mb = ""),
          (P.md = ""),
          (P.mdp = ""),
          (P.mdl = ""),
          (P.mcepsl = 100),
          (P.mdn = 5e3),
          (P.mhl = 4e3),
          (P.mpl = 1024),
          (P.mmds = 2e4),
          (P.msl = 3e4),
          (P.bismepl = 2e3),
          (P.mel = 200),
          (P.mepp = 10),
          (P.moa = 30),
          (P.mrt = 3),
          (P.ntd = !1),
          (P.nsfnv = !1),
          (P.ncw = !1),
          (P.oat = 180),
          (P.ote = !1),
          (P.owasp = !1),
          (P.pcl = 20),
          (P.pt = !0),
          (P.perfbv = 1),
          (P.prfSmpl = 0),
          (P.pVO = !1),
          (P.peti = !1),
          (P.raxeh = !0),
          (P.rdnt = 0),
          (P.nosr = !0),
          (P.reportUrl = "dynaTraceMonitor"),
          (P.rid = ""),
          (P.ridPath = ""),
          (P.rpid = ""),
          (P.rcdec = 12096e5),
          (P.rtl = 0),
          (P.rtp = 2),
          (P.rtt = 1e3),
          (P.rtu = 200),
          (P.restoreTimeline = !1),
          (P.rvcl = 24),
          (P.sl = 100),
          (P.ssc = !1),
          (P.svNB = !1),
          (P.srad = !0),
          (P.srbbv = 1),
          (P.srbw = !0),
          (P.srdinitrec = !0),
          (P.srmr = 100),
          (P.srms = "1,1,,,"),
          (P.srsr = 1e5),
          (P.srtbv = 3),
          (P.srtd = 1),
          (P.srtr = 500),
          (P.srvr = ""),
          (P.srvi = 0),
          (P.srwo = !1),
          (P.srre = ""),
          (P.srxcss = !0),
          (P.srxicss = !0),
          (P.srif = !1),
          (P.srmrc = !1),
          (P.srsdom = !0),
          (P.srcss = !0),
          (P.srmcrl = 1),
          (P.srmcrv = 10),
          (P.ssv = 4),
          (P.st = 3e3),
          (P.spc = ""),
          (P.syntheticConfig = !1),
          (P.tal = 0),
          (P.tp = "500,50,3"),
          (P.tt = 100),
          (P.tvc = 3e3),
          (P.exteventsoff = !1),
          (P.uxdce = !1),
          (P.uxdcw = 1500),
          (P.uxrgce = !0),
          (P.uxrgcm = "100,25,300,3;100,25,300,3"),
          (P.uam = !1),
          (P.uana = "data-dtname,data-dtName"),
          (P.uanpi = 0),
          (P.pui = !1),
          (P.usrvd = !0),
          (P.vrt = !1),
          (P.vcfi = !0),
          (P.vcit = 1e3),
          (P.vct = 50),
          (P.vcx = 50),
          (P.vscl = 0),
          (P.vncm = 1),
          (P.xb = ""),
          (P.chw = ""),
          (P.xt = 0),
          (P.xhb = ""),
          P);
        var ya;
        ja();
        var hb;
        Xc = pb.XMLHttpRequest;
        Ec = pb.ActiveXObject;
        var Qb =
          null === (hb = pb.XMLHttpRequest) || void 0 === hb
            ? void 0
            : hb.prototype;
        if (Qb)
          for (pe = {}, e = 0, n = xd; e < n.length; e++) {
            var hc = n[e];
            void 0 !== Qb[hc] && (pe[hc] = Qb[hc]);
          }
        Va = pb.addEventListener;
        nb = pb.removeEventListener;
        Db = pb.document.addEventListener;
        Fb = pb.document.removeEventListener;
        Be = pb.setTimeout;
        xh = pb.setInterval;
        of || ((Ke = pb.clearTimeout), (Ce = pb.clearInterval));
        var xc = Oa ? Oa() : navigator.cookieEnabled,
          Dc =
            1 ===
            wb(
              ka("dtAdkSettings") ||
                (null === (ya = Ef) || void 0 === ya
                  ? void 0
                  : ya.getItem("dtAdkSettings")) ||
                ""
            ).overloadState;
        ib();
        if (
          !(!xc || Dc
            ? 0
            : "complete" !== document.readyState ||
              (pb.performance && pb.performance.timing))
        )
          throw Error("Error during initCode initialization");
        try {
          Ef = pb.localStorage;
        } catch (jg) {}
        Ae = [];
        Ab();
        kf = Qc();
        ge = [];
        lf = {};
        if (!of) {
          pb.clearTimeout = Ma(Ke);
          pb.clearInterval = Ma(Ce);
          of = !0;
          try {
            Pc = pb.sessionStorage;
          } catch (jg) {}
        }
        var dd = Math.random(),
          Dg = Math.random();
        ig = 0 !== dd && 0 !== Dg && dd !== Dg;
        if (-1 !== gb(navigator.userAgent, "Googlebot")) {
          var Xd = performance.getEntriesByType("navigation")[0];
          ya = 1;
          if (Xd) {
            for (var sf in Xd) {
              var cf = Xd[sf];
              "number" === typeof cf && cf && (ya = 1 === ya ? cf : ya + cf);
            }
            var ud = Math.floor(1e4 * ya);
          } else ud = ya;
          Le = $c(ud);
        } else ig ? (Le = Math.random) : (Le = $c(Qc()));
        Me = (kf % fg) + "_" + W(Vc(0, 1e3) + "");
        a: {
          var Ge = pb.dT_.cfg;
          Xb = {
            reportUrl: "dynaTraceMonitor",
            initializedModules: "",
            csu: "dtagent",
            dataDtConfig: "string" === typeof Ge ? Ge : "",
          };
          pb.dT_.cfg = Xb;
          Xb.csu = "ruxitagentjs";
          var Md = Xb.dataDtConfig;
          Md &&
            -1 === gb(Md, "#CONFIGSTRING") &&
            (Pa(Md, Xb), B("domain"), B("auto"), B("app"), Ka(Xb));
          var se = I("script"),
            yh = da(se),
            Qe = -1 === gb(Xb.dataDtConfig || "", "#CONFIGSTRING") ? Xb : null;
          if (0 < yh)
            for (ud = 0; ud < yh; ud++)
              b: {
                Xd = void 0;
                var tf = se[ud];
                sf = Qe;
                if (tf.attributes) {
                  var $g = Xb.csu + "_bootstrap.js";
                  cf = /.*\/jstag\/.*\/.*\/(.*)_bs(_dbg)?.js$/;
                  Ge = sf;
                  var uf = tf.src,
                    zh = null === uf || void 0 === uf ? void 0 : uf.indexOf($g),
                    ah = tf.attributes.getNamedItem("data-dtconfig");
                  if (ah) {
                    Md = void 0;
                    ya = uf;
                    var bh = ah.value;
                    Qb = {};
                    Xb.legacy = "1";
                    hc = /([a-zA-Z]*)_([a-zA-Z_0-9]*)_([0-9]+)/g;
                    ya &&
                      ((Md = hc.exec(ya)),
                      null === Md || void 0 === Md ? 0 : Md.length) &&
                      ((Qb.csu = Md[1]),
                      (Qb.featureHash = Md[2]),
                      (Qb.agentLocation = ya.substring(0, gb(ya, Md[1]) - 1)),
                      (Qb.buildNumber = Md[3]));
                    if (bh) {
                      Pa(bh, Qb, !0);
                      var Nd = Qb.agentUri;
                      !ya &&
                        Nd &&
                        ((Md = hc.exec(Nd)),
                        null === Md || void 0 === Md ? 0 : Md.length) &&
                        (Qb.csu = Md[1]);
                    }
                    fa(Qb);
                    Xd = Qb;
                    if (!sf) Ge = Xd;
                    else if (!Xd.syntheticConfig) {
                      Qe = Xd;
                      break b;
                    }
                  }
                  Xd || (Xd = Xb);
                  if (0 < zh) {
                    var kg = zh + $g.length + 5;
                    Xd.app =
                      uf.length > kg
                        ? uf.substring(kg)
                        : "Default%20Application";
                  } else if (uf) {
                    var ch = cf.exec(uf);
                    ch && (Xd.app = ch[1]);
                  }
                  Qe = Ge;
                } else Qe = sf;
              }
          if (Qe)
            for (var lg in Qe)
              Object.prototype.hasOwnProperty.call(Qe, lg) &&
                ((se = lg), (Xb[se] = Qe[se]));
          var Of = ca();
          try {
            var te = (Qe = Ef) && Qe.getItem(Of);
            if (te) {
              var Pf = U(te),
                Td = Pa(Pf.config || ""),
                mg = Xb.lastModification || "0",
                df = W(
                  (Td.lastModification || Pf.lastModification || "0").substring(
                    0,
                    13
                  )
                ),
                ce = "string" === typeof mg ? W(mg.substring(0, 13)) : mg;
              if (!mg || df >= ce)
                if (
                  ((Td.csu = Pf.name || A("csu")),
                  (Td.featureHash = Pf.featureHash || A("featureHash")),
                  Td.agentUri && Ka(Td),
                  Aa(Td, !0),
                  qb(Td),
                  cb(Td),
                  df > (Xb.lastModification || 0))
                ) {
                  var Eg = p("auto"),
                    Fd = p("legacy");
                  Xb = na(Td);
                  Xb.auto = Eg ? "1" : "0";
                  Xb.legacy = Fd ? "1" : "0";
                }
            }
          } catch (jg) {}
          Aa(Xb);
          try {
            var He = Xb.ign;
            if (He && new RegExp(He).test(pb.location.href)) {
              document.dT_ = pb.dT_ = void 0;
              var ef = !1;
              break a;
            }
          } catch (jg) {}
          if (ra()) {
            var Qf = navigator.userAgent,
              vf = Qf.lastIndexOf("RuxitSynthetic");
            if (-1 === vf) var wf = {};
            else {
              var ff = Qf.substring(vf + 14);
              if (-1 === gb(ff, " c")) wf = {};
              else {
                Of = {};
                te = 0;
                for (var Fg = ff.split(" "); te < Fg.length; te++) {
                  var dh = Fg[te];
                  if ("c" === dh.charAt(0)) {
                    var eh = dh.substring(1),
                      Wh = eh.indexOf("="),
                      fh = eh.substring(0, Wh),
                      Ah = eh.substring(Wh + 1);
                    fh && Ah && (Of[fh] = Ah);
                  }
                }
                wf = Of;
              }
            }
            ff = void 0;
            for (ff in wf)
              Object.prototype.hasOwnProperty.call(wf, ff) &&
                wf[ff] &&
                (Xb[ff] = wf[ff]);
            na(Xb);
          }
          ef = !0;
        }
        if (!ef) throw Error("Error during config initialization");
        zc();
        Pe = pb.dT_.disabled;
        var Ie;
        if (!(Ie = A("agentLocation")))
          a: {
            var ng = A("agentUri");
            if (ng || document.currentScript) {
              var ke = ng || document.currentScript.src;
              if (ke) {
                ef = ke;
                var gh =
                    -1 === gb(ef, "_bs") &&
                    -1 === gb(ef, "_bootstrap") &&
                    -1 === gb(ef, "_complete")
                      ? 1
                      : 2,
                  Rf = ke.lastIndexOf("/");
                for (ef = 0; ef < gh && -1 !== Rf; ef++)
                  (ke = ke.substring(0, Rf)), (Rf = ke.lastIndexOf("/"));
                Ie = ke;
                break a;
              }
            }
            var Gg = location.pathname;
            Ie = Gg.substring(0, Gg.lastIndexOf("/"));
          }
        gg = Ie;
        Ee = A("csu") || "ruxitagentjs";
        "true" === ka("dtUseDebugAgent") &&
          0 > Ee.indexOf("dbg") &&
          (Ee = A("debugName") || Ee + "dbg");
        if (!p("auto") && !p("legacy") && !Pe) {
          var Hg = A("agentUri") || af(A("featureHash")),
            og;
          if (!(og = p("async") || "complete" === document.readyState)) {
            var Ig = pb.navigator.userAgent,
              Gf = Ig.indexOf("MSIE ");
            og =
              0 < Gf
                ? 9 >= parseInt(Ig.substring(Gf + 5, Ig.indexOf(".", Gf)), 10)
                : !1;
          }
          if (og) qd(Hg, p("async"), void 0, void 0, "dtjsagent");
          else {
            var Xh = "".concat("dtjsagent", "dw");
            document.write(
              '<script id="'
                .concat(Xh, '" type="text/javascript" src="')
                .concat(Hg, '">\x3c/script>')
            );
            document.getElementById(Xh) ||
              qd(Hg, p("async"), void 0, void 0, "dtjsagent");
          }
        }
        ka("dtCookie") && G("cooO", !0);
        hg();
        G("pVO", !!Lc("dt-pVO"));
        Nc(Cc);
        ie = 18e5;
        qf = J("hvt") || 216e5;
        wa(ae, [1]);
        Ze = [];
        Cg = "dtCookie dtLatC rxvt dtAdk dtAdkSettings dtPC".split(" ");
        if (p("cg"))
          try {
            oc(
              Object.getOwnPropertyDescriptor(Document.prototype, "cookie") ||
                Object.getOwnPropertyDescriptor(
                  HTMLDocument.prototype,
                  "cookie"
                )
            );
          } catch (jg) {}
      } catch (jg) {
        try {
          delete pb.dT_;
        } catch (Hj) {
          pb.dT_ = void 0;
        }
        ib() && pb.console.log("JsAgent initCode initialization failed!", jg);
      }
  })();
})();

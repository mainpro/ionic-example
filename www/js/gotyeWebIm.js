//--------------module:im.base-------------

var Tool = {compress: function (b, g, e, a) {
    var d = "image/jpeg";
    if (a != undefined && a == "png") {
        d = "image/png"
    }
    var c = document.createElement("canvas");
    var f = 1;
    if (b.naturalWidth > b.naturalHeight) {
        f = g / b.naturalWidth
    } else {
        f = g / b.naturalHeight
    }
    c.width = b.naturalWidth * f;
    c.height = b.naturalHeight * f;
    var h = c.getContext("2d");
    h.drawImage(b, 0, 0, c.width, c.height);
    var i = c.toDataURL(d, e || 0.5);
    return i
}, each: function (f, e, d) {
    if (f.length === void +0) {
        for (var c in f) {
            if (f.hasOwnProperty(c)) {
                e.call(d, f[c], c, f)
            }
        }
        return f
    }
    for (var b = 0, a = f.length; b < a; b++) {
        e.call(d, f[b], b, f)
    }
    return f
}, parseJSON: function (a) {
    if (typeof a != "string") {
        return a = a.replace(/^\s+|\s+$/g, "")
    }
    var b = /^[\],:{}\s]*$/.test(a.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g, ""));
    if (!b) {
        throw"Invalid JSON"
    }
    var c = window.JSON;
    return c && c.parse ? c.parse(a) : (new Function("return " + a))()
}, isArray: function (a) {
    return this.type(a) == "array"
}, isFun: function (a) {
    return this.type(a) == "function"
}, type: (function () {
    var b = {}, e = "Boolean Number String Function Array Date RegExp Null Undefined".split(" ");
    for (var c = 0, a = e.length; c < a; c++) {
        b["[object " + e[c] + "]"] = e[c].toLowerCase()
    }
    return function d(f) {
        return b[Object.prototype.toString.call(f)] || "object"
    }
})(), isObj: function (a) {
    return this.type(a) == "object"
}, jsonToParam: function (b) {
    var c = "";
    for (var a in b) {
        c += "&" + a + "=" + b[a]
    }
    if (c.length) {
        c = c.substr(1)
    }
    return c
}, stringify: function (a) {
    var b = window.JSON;
    if (b) {
        return b.stringify(a)
    }
    return Tool.jsonToParam(a)
}, log: function (a) {
    if (window.console && window.console.info) {
        window.console.info(a)
    }
}, toHttp: function (a) {
    if (!!a) {
        return a.replace("https", "http")
    }
}};
var Ajax = function () {
    function a() {
    }

    function c(d) {
        Tool.log("requset failure: status" + d.status)
    }

    function b(e, f) {
        var h = f.async !== false, d = f.method || "POST", i = f.data || null, l = f.success || a, g = f.failure || c, j = f.header || {}, d = d.toUpperCase();
        if (d == "GET" && i) {
            e += (e.indexOf("?") == -1 ? "?" : "&") + i;
            i = null
        } else {
            if (d == "POST" && i) {
                i = Tool.stringify(i)
            }
        }
        var m = new XMLHttpRequest();
        if ("withCredentials" in m) {
            m.open(d, e, h);
            if (d == "POST") {
                m.setRequestHeader("Accept", "application/json;");
                m.setRequestHeader("Content-type", "application/json;")
            }
            m.onreadystatechange = function () {
                if (m.readyState == 4) {
                    var n = m.status;
                    if (n == 200 || n == 304) {
                        l(Tool.parseJSON(m.responseText))
                    } else {
                        g(m)
                    }
                }
            }
        } else {
            if (typeof XDomainRequest != "undefined") {
                m = new XDomainRequest();
                m.open(d, e);
                if (d == "POST") {
                    m.setRequestHeader("Accept", "application/json;");
                    m.setRequestHeader("Content-type", "application/json;")
                }
                m.onload = function (n) {
                    l(Tool.parseJSON(m.responseText))
                };
                m.onerror = function () {
                    g(m)
                }
            } else {
                Tool.log("The browser does not support");
                return
            }
        }
        for (var k in j) {
            m.setRequestHeader(k, j[k])
        }
        m.timeout = 6000;
        m.ontimeout = function () {
            Tool.log("request timeout");
            g()
        };
        m.send(i);
        return m
    }

    return{request: b}
}();

//--------------module:im.status-------------

var IM_STATUS = {LOGIN: {APPKEY_ERROR: 311, PASSWORD_ERROR: 312, LOGIN_KEY_ERROR: 313, INSIDE_ERROR: 314, ACCOUNT_ERROR: 315, CREATE_ID_ERROR: 316, CREATE_ACCOUNT_ERROR: 317, LOGIN_TYPE_ERROR: 318, RE_LOGIN_ERROR: 319, REPEAT_OPER: 320, TIMEOUT: 321}, LOGOUT: {FAIL: 505, INVALID_USER: 507}, MSG: {RECEIVER_ERROR: 410, FAIL: 414, BROWER_NOT_SUPPORT: 415, IMG_TYPE_ERROR: 416}, GROUP: {NO_OPER_PERMISSION: 1001, USER_HAS_IN_GROUP: 1003, USER_NOT_FOUND_IN_GROUP: 1007, INVALID_USER_ACCOUNT: 1021, INVALID_GROUP_ID: 1025, DO_NOT_DEL_OWNER: 1029}, PARAM_IS_NULL: 300, NO_LOGIN: 301, SUCCESS: 200, FAIL: 300, SYS_EXCEPTION: 500};
var IM_CONSTANT = {MSG_TYPE: {TEXT: 0, IMG: 3, NOTIFY: 5, VOICE: 6, USER_DEFINED: 8}, CHAT_TYPE: {USER: 0, ROOM: 1, GROUP: 2}, NOTIFY: {GROUP: {LEAVE: "group.leave", ENTER: "group.enter", KICKOUT: "group.kickOut", DISMISS: "group.dismiss"}, ROOM: {LEAVE: "room.leave", ENTER: "room.enter", GET_USER_LIST: "room.user.list"}}};

//--------------module:base64-------------

function Base64() {
    _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    this.encode = function (c) {
        var a = "";
        var k, h, f, j, g, e, d;
        var b = 0;
        c = _utf8_encode(c);
        while (b < c.length) {
            k = c.charCodeAt(b++);
            h = c.charCodeAt(b++);
            f = c.charCodeAt(b++);
            j = k >> 2;
            g = ((k & 3) << 4) | (h >> 4);
            e = ((h & 15) << 2) | (f >> 6);
            d = f & 63;
            if (isNaN(h)) {
                e = d = 64
            } else {
                if (isNaN(f)) {
                    d = 64
                }
            }
            a = a + _keyStr.charAt(j) + _keyStr.charAt(g) + _keyStr.charAt(e) + _keyStr.charAt(d)
        }
        return a
    };
    this.decode = function (c) {
        var a = "";
        var k, h, f;
        var j, g, e, d;
        var b = 0;
        c = c.replace(/[^A-Za-z0-9\+\/\=]/g, "");
        while (b < c.length) {
            j = _keyStr.indexOf(c.charAt(b++));
            g = _keyStr.indexOf(c.charAt(b++));
            e = _keyStr.indexOf(c.charAt(b++));
            d = _keyStr.indexOf(c.charAt(b++));
            k = (j << 2) | (g >> 4);
            h = ((g & 15) << 4) | (e >> 2);
            f = ((e & 3) << 6) | d;
            a = a + String.fromCharCode(k);
            if (e != 64) {
                a = a + String.fromCharCode(h)
            }
            if (d != 64) {
                a = a + String.fromCharCode(f)
            }
        }
        a = _utf8_decode(a);
        return a
    };
    _utf8_encode = function (b) {
        b = b.replace(/\r\n/g, "\n");
        var a = "";
        for (var e = 0; e < b.length; e++) {
            var d = b.charCodeAt(e);
            if (d < 128) {
                a += String.fromCharCode(d)
            } else {
                if ((d > 127) && (d < 2048)) {
                    a += String.fromCharCode((d >> 6) | 192);
                    a += String.fromCharCode((d & 63) | 128)
                } else {
                    a += String.fromCharCode((d >> 12) | 224);
                    a += String.fromCharCode(((d >> 6) & 63) | 128);
                    a += String.fromCharCode((d & 63) | 128)
                }
            }
        }
        return a
    };
    _utf8_decode = function (a) {
        var b = "";
        var d = 0;
        var e = c1 = c2 = 0;
        while (d < a.length) {
            e = a.charCodeAt(d);
            if (e < 128) {
                b += String.fromCharCode(e);
                d++
            } else {
                if ((e > 191) && (e < 224)) {
                    c2 = a.charCodeAt(d + 1);
                    b += String.fromCharCode(((e & 31) << 6) | (c2 & 63));
                    d += 2
                } else {
                    c2 = a.charCodeAt(d + 1);
                    c3 = a.charCodeAt(d + 2);
                    b += String.fromCharCode(((e & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                    d += 3
                }
            }
        }
        return b
    }
};

//--------------module:socketio-------------

!function (a) {
    "object" == typeof exports ? module.exports = a() : "function" == typeof define && define.amd ? define(a) : "undefined" != typeof window ? window.io = a() : "undefined" != typeof global ? global.io = a() : "undefined" != typeof self && (self.io = a())
}(function () {
    var d, b, a;
    return(function c(f, k, h) {
        function g(n, l) {
            if (!k[n]) {
                if (!f[n]) {
                    var i = typeof require == "function" && require;
                    if (!l && i) {
                        return i(n, !0)
                    }
                    if (e) {
                        return e(n, !0)
                    }
                    throw new Error("Cannot find module '" + n + "'")
                }
                var m = k[n] = {exports: {}};
                f[n][0].call(m.exports, function (o) {
                    var p = f[n][1][o];
                    return g(p ? p : o)
                }, m, m.exports, c, f, k, h)
            }
            return k[n].exports
        }

        var e = typeof require == "function" && require;
        for (var j = 0; j < h.length; j++) {
            g(h[j])
        }
        return g
    })({1: [function (f, g, e) {
        g.exports = f("./lib/")
    }, {"./lib/": 2}], 2: [function (l, j, m) {
        var h = l("./url");
        var g = l("socket.io-parser");
        var e = l("./manager");
        var i = l("debug")("socket.io-client");
        j.exports = m = k;
        var f = m.managers = {};

        function k(p, o) {
            if (typeof p == "object") {
                o = p;
                p = undefined
            }
            o = o || {};
            var n = h(p);
            var q = n.source;
            var s = n.id;
            var r;
            if (o.forceNew || false === o.multiplex) {
                i("ignoring socket cache for %s", q);
                r = e(q, o)
            } else {
                if (!f[s]) {
                    i("new io instance for %s", q);
                    f[s] = e(q, o)
                }
                r = f[s]
            }
            return r.socket(n.path)
        }

        m.protocol = g.protocol;
        m.connect = k;
        m.Manager = l("./manager");
        m.Socket = l("./socket")
    }, {"./manager": 3, "./socket": 5, "./url": 6, debug: 8, "socket.io-parser": 39}], 3: [function (k, j, m) {
        var h = k("./url");
        var o = k("engine.io-client");
        var i = k("./socket");
        var q = k("emitter");
        var g = k("socket.io-parser");
        var n = k("./on");
        var p = k("bind");
        var l = k("object-component");
        var f = k("debug")("socket.io-client:manager");
        j.exports = e;
        function e(s, r) {
            if (!(this instanceof e)) {
                return new e(s, r)
            }
            if ("object" == typeof s) {
                r = s;
                s = undefined
            }
            r = r || {};
            r.path = r.path || "/socket.io";
            this.nsps = {};
            this.subs = [];
            this.opts = r;
            this.reconnection(r.reconnection !== false);
            this.reconnectionAttempts(r.reconnectionAttempts || Infinity);
            this.reconnectionDelay(r.reconnectionDelay || 1000);
            this.reconnectionDelayMax(r.reconnectionDelayMax || 5000);
            this.timeout(null == r.timeout ? 20000 : r.timeout);
            this.readyState = "closed";
            this.uri = s;
            this.connected = 0;
            this.attempts = 0;
            this.encoding = false;
            this.packetBuffer = [];
            this.encoder = new g.Encoder();
            this.decoder = new g.Decoder();
            this.open()
        }

        q(e.prototype);
        e.prototype.reconnection = function (r) {
            if (!arguments.length) {
                return this._reconnection
            }
            this._reconnection = !!r;
            return this
        };
        e.prototype.reconnectionAttempts = function (r) {
            if (!arguments.length) {
                return this._reconnectionAttempts
            }
            this._reconnectionAttempts = r;
            return this
        };
        e.prototype.reconnectionDelay = function (r) {
            if (!arguments.length) {
                return this._reconnectionDelay
            }
            this._reconnectionDelay = r;
            return this
        };
        e.prototype.reconnectionDelayMax = function (r) {
            if (!arguments.length) {
                return this._reconnectionDelayMax
            }
            this._reconnectionDelayMax = r;
            return this
        };
        e.prototype.timeout = function (r) {
            if (!arguments.length) {
                return this._timeout
            }
            this._timeout = r;
            return this
        };
        e.prototype.maybeReconnectOnOpen = function () {
            if (!this.openReconnect && !this.reconnecting && this._reconnection) {
                this.openReconnect = true;
                this.reconnect()
            }
        };
        e.prototype.open = e.prototype.connect = function (u) {
            f("readyState %s", this.readyState);
            if (~this.readyState.indexOf("open")) {
                return this
            }
            f("opening %s", this.uri);
            this.engine = o(this.uri, this.opts);
            var r = this.engine;
            var t = this;
            this.readyState = "opening";
            var w = n(r, "open", function () {
                t.onopen();
                u && u()
            });
            var s = n(r, "error", function (z) {
                f("connect_error");
                t.cleanup();
                t.readyState = "closed";
                t.emit("connect_error", z);
                if (u) {
                    var y = new Error("Connection error");
                    y.data = z;
                    u(y)
                }
                t.maybeReconnectOnOpen()
            });
            if (false !== this._timeout) {
                var v = this._timeout;
                f("connect attempt will timeout after %d", v);
                var x = setTimeout(function () {
                    f("connect attempt timed out after %d", v);
                    w.destroy();
                    r.close();
                    r.emit("error", "timeout");
                    t.emit("connect_timeout", v)
                }, v);
                this.subs.push({destroy: function () {
                    clearTimeout(x)
                }})
            }
            this.subs.push(w);
            this.subs.push(s);
            return this
        };
        e.prototype.onopen = function () {
            f("open");
            this.cleanup();
            this.readyState = "open";
            this.emit("open");
            var r = this.engine;
            this.subs.push(n(r, "data", p(this, "ondata")));
            this.subs.push(n(this.decoder, "decoded", p(this, "ondecoded")));
            this.subs.push(n(r, "error", p(this, "onerror")));
            this.subs.push(n(r, "close", p(this, "onclose")))
        };
        e.prototype.ondata = function (r) {
            this.decoder.add(r)
        };
        e.prototype.ondecoded = function (r) {
            this.emit("packet", r)
        };
        e.prototype.onerror = function (r) {
            f("error", r);
            this.emit("error", r)
        };
        e.prototype.socket = function (t) {
            var r = this.nsps[t];
            if (!r) {
                r = new i(this, t);
                this.nsps[t] = r;
                var s = this;
                r.on("connect", function () {
                    s.connected++
                })
            }
            return r
        };
        e.prototype.destroy = function (r) {
            --this.connected || this.close()
        };
        e.prototype.packet = function (s) {
            f("writing packet %j", s);
            var r = this;
            if (!r.encoding) {
                r.encoding = true;
                this.encoder.encode(s, function (u) {
                    for (var t = 0; t < u.length; t++) {
                        r.engine.write(u[t])
                    }
                    r.encoding = false;
                    r.processPacketQueue()
                })
            } else {
                r.packetBuffer.push(s)
            }
        };
        e.prototype.processPacketQueue = function () {
            if (this.packetBuffer.length > 0 && !this.encoding) {
                var r = this.packetBuffer.shift();
                this.packet(r)
            }
        };
        e.prototype.cleanup = function () {
            var r;
            while (r = this.subs.shift()) {
                r.destroy()
            }
            this.packetBuffer = [];
            this.encoding = false;
            this.decoder.destroy()
        };
        e.prototype.close = e.prototype.disconnect = function () {
            this.skipReconnect = true;
            this.engine.close()
        };
        e.prototype.onclose = function (r) {
            f("close");
            this.cleanup();
            this.readyState = "closed";
            this.emit("close", r);
            if (this._reconnection && !this.skipReconnect) {
                this.reconnect()
            }
        };
        e.prototype.reconnect = function () {
            if (this.reconnecting) {
                return this
            }
            var r = this;
            this.attempts++;
            if (this.attempts > this._reconnectionAttempts) {
                f("reconnect failed");
                this.emit("reconnect_failed");
                this.reconnecting = false
            } else {
                var s = this.attempts * this.reconnectionDelay();
                s = Math.min(s, this.reconnectionDelayMax());
                f("will wait %dms before reconnect attempt", s);
                this.reconnecting = true;
                var t = setTimeout(function () {
                    f("attempting reconnect");
                    r.emit("reconnect_attempt");
                    r.open(function (u) {
                        if (u) {
                            f("reconnect attempt error");
                            r.reconnecting = false;
                            r.reconnect();
                            r.emit("reconnect_error", u.data)
                        } else {
                            f("reconnect success");
                            r.onreconnect()
                        }
                    })
                }, s);
                this.subs.push({destroy: function () {
                    clearTimeout(t)
                }})
            }
        };
        e.prototype.onreconnect = function () {
            var r = this.attempts;
            this.attempts = 0;
            this.reconnecting = false;
            this.emit("reconnect", r)
        }
    }, {"./on": 4, "./socket": 5, "./url": 6, bind: 7, debug: 8, emitter: 9, "engine.io-client": 10, "object-component": 36, "socket.io-parser": 39}], 4: [function (g, h, f) {
        h.exports = e;
        function e(k, j, i) {
            k.on(j, i);
            return{destroy: function () {
                k.removeListener(j, i)
            }}
        }
    }, {}], 5: [function (i, h, k) {
        var f = i("socket.io-parser");
        var p = i("emitter");
        var j = i("to-array");
        var m = i("./on");
        var n = i("bind");
        var e = i("debug")("socket.io-client:socket");
        var l = i("has-binary-data");
        var o = i("indexof");
        h.exports = k = g;
        var r = {connect: 1, disconnect: 1, error: 1};
        var q = p.prototype.emit;

        function g(t, s) {
            this.io = t;
            this.nsp = s;
            this.json = this;
            this.ids = 0;
            this.acks = {};
            this.open();
            this.buffer = [];
            this.connected = false;
            this.disconnected = true
        }

        p(g.prototype);
        g.prototype.open = g.prototype.connect = function () {
            if (this.connected) {
                return this
            }
            var s = this.io;
            s.open();
            this.subs = [m(s, "open", n(this, "onopen")), m(s, "error", n(this, "onerror")), m(s, "packet", n(this, "onpacket")), m(s, "close", n(this, "onclose"))];
            if ("open" == this.io.readyState) {
                this.onopen()
            }
            return this
        };
        g.prototype.send = function () {
            var s = j(arguments);
            s.unshift("message");
            this.emit.apply(this, s);
            return this
        };
        g.prototype.emit = function (u) {
            if (r.hasOwnProperty(u)) {
                q.apply(this, arguments);
                return this
            }
            var t = j(arguments);
            var s = f.EVENT;
            if (l(t)) {
                s = f.BINARY_EVENT
            }
            var v = {type: s, data: t};
            if ("function" == typeof t[t.length - 1]) {
                e("emitting packet with ack id %d", this.ids);
                this.acks[this.ids] = t.pop();
                v.id = this.ids++
            }
            this.packet(v);
            return this
        };
        g.prototype.packet = function (s) {
            s.nsp = this.nsp;
            this.io.packet(s)
        };
        g.prototype.onerror = function (s) {
            this.emit("error", s)
        };
        g.prototype.onopen = function () {
            e("transport is open - connecting");
            if ("/" != this.nsp) {
                this.packet({type: f.CONNECT})
            }
        };
        g.prototype.onclose = function (s) {
            e("close (%s)", s);
            this.connected = false;
            this.disconnected = true;
            this.emit("disconnect", s)
        };
        g.prototype.onpacket = function (s) {
            if (s.nsp != this.nsp) {
                return
            }
            switch (s.type) {
                case f.CONNECT:
                    this.onconnect();
                    break;
                case f.EVENT:
                    this.onevent(s);
                    break;
                case f.BINARY_EVENT:
                    this.onevent(s);
                    break;
                case f.ACK:
                    this.onack(s);
                    break;
                case f.BINARY_ACK:
                    this.onack(s);
                    break;
                case f.DISCONNECT:
                    this.ondisconnect();
                    break;
                case f.ERROR:
                    this.emit("error", s.data);
                    break
            }
        };
        g.prototype.onevent = function (t) {
            var s = t.data || [];
            e("emitting event %j", s);
            if (null != t.id) {
                e("attaching ack callback to event");
                s.push(this.ack(t.id))
            }
            if (this.connected) {
                q.apply(this, s)
            } else {
                this.buffer.push(s)
            }
        };
        g.prototype.ack = function (u) {
            var s = this;
            var t = false;
            return function () {
                if (t) {
                    return
                }
                t = true;
                var v = j(arguments);
                e("sending ack %j", v);
                var w = l(v) ? f.BINARY_ACK : f.ACK;
                s.packet({type: w, id: u, data: v})
            }
        };
        g.prototype.onack = function (t) {
            e("calling ack %s with %j", t.id, t.data);
            var s = this.acks[t.id];
            s.apply(this, t.data);
            delete this.acks[t.id]
        };
        g.prototype.onconnect = function () {
            this.connected = true;
            this.disconnected = false;
            this.emit("connect");
            this.emitBuffered()
        };
        g.prototype.emitBuffered = function () {
            for (var s = 0; s < this.buffer.length; s++) {
                q.apply(this, this.buffer[s])
            }
            this.buffer = []
        };
        g.prototype.ondisconnect = function () {
            e("server disconnect (%s)", this.nsp);
            this.destroy();
            this.onclose("io server disconnect")
        };
        g.prototype.destroy = function () {
            for (var s = 0; s < this.subs.length; s++) {
                this.subs[s].destroy()
            }
            this.io.destroy(this)
        };
        g.prototype.close = g.prototype.disconnect = function () {
            if (!this.connected) {
                return this
            }
            e("performing disconnect (%s)", this.nsp);
            this.packet({type: f.DISCONNECT});
            this.destroy();
            this.onclose("io client disconnect");
            return this
        }
    }, {"./on": 4, bind: 7, debug: 8, emitter: 9, "has-binary-data": 31, indexof: 35, "socket.io-parser": 39, "to-array": 42}], 6: [function (h, i, f) {
        var j = typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {};
        var k = h("parseuri");
        var e = h("debug")("socket.io-client:url");
        i.exports = g;
        function g(l, n) {
            var m = l;
            var n = n || j.location;
            if (null == l) {
                l = n.protocol + "//" + n.hostname
            }
            if ("string" == typeof l) {
                if ("/" == l.charAt(0)) {
                    if ("undefined" != typeof n) {
                        l = n.hostname + l
                    }
                }
                if (!/^(https?|wss?):\/\//.test(l)) {
                    e("protocol-less url %s", l);
                    if ("undefined" != typeof n) {
                        l = n.protocol + "//" + l
                    } else {
                        l = "https://" + l
                    }
                }
                e("parse %s", l);
                m = k(l)
            }
            if ((/(http|ws)/.test(m.protocol) && 80 == m.port) || (/(http|ws)s/.test(m.protocol) && 443 == m.port)) {
                delete m.port
            }
            m.path = m.path || "/";
            m.id = m.protocol + m.host + (m.port ? (":" + m.port) : "");
            m.href = m.protocol + "://" + m.host + (m.port ? (":" + m.port) : "");
            return m
        }
    }, {debug: 8, parseuri: 37}], 7: [function (f, g, e) {
        var h = [].slice;
        g.exports = function (k, j) {
            if ("string" == typeof j) {
                j = k[j]
            }
            if ("function" != typeof j) {
                throw new Error("bind() requires a function")
            }
            var i = [].slice.call(arguments, 2);
            return function () {
                return j.apply(k, i.concat(h.call(arguments)))
            }
        }
    }, {}], 8: [function (h, i, g) {
        i.exports = f;
        function f(e) {
            if (!f.enabled(e)) {
                return function () {
                }
            }
            return function (l) {
                l = j(l);
                var n = new Date;
                var m = n - (f[e] || n);
                f[e] = n;
                l = e + " " + l + " +" + f.humanize(m);
                window.console && console.log && Function.prototype.apply.call(console.log, console, arguments)
            }
        }

        f.names = [];
        f.skips = [];
        f.enable = function (m) {
            try {
                localStorage.debug = m
            } catch (p) {
            }
            var o = (m || "").split(/[\s,]+/), l = o.length;
            for (var n = 0; n < l; n++) {
                m = o[n].replace("*", ".*?");
                if (m[0] === "-") {
                    f.skips.push(new RegExp("^" + m.substr(1) + "$"))
                } else {
                    f.names.push(new RegExp("^" + m + "$"))
                }
            }
        };
        f.disable = function () {
            f.enable("")
        };
        f.humanize = function (l) {
            var n = 1000, m = 60 * 1000, e = 60 * m;
            if (l >= e) {
                return(l / e).toFixed(1) + "h"
            }
            if (l >= m) {
                return(l / m).toFixed(1) + "m"
            }
            if (l >= n) {
                return(l / n | 0) + "s"
            }
            return l + "ms"
        };
        f.enabled = function (l) {
            for (var m = 0, e = f.skips.length; m < e; m++) {
                if (f.skips[m].test(l)) {
                    return false
                }
            }
            for (var m = 0, e = f.names.length; m < e; m++) {
                if (f.names[m].test(l)) {
                    return true
                }
            }
            return false
        };
        function j(e) {
            if (e instanceof Error) {
                return e.stack || e.message
            }
            return e
        }

        try {
            if (window.localStorage) {
                f.enable(localStorage.debug)
            }
        } catch (k) {
        }
    }, {}], 9: [function (h, i, f) {
        var g = h("indexof");
        i.exports = j;
        function j(k) {
            if (k) {
                return e(k)
            }
        }

        function e(l) {
            for (var k in j.prototype) {
                l[k] = j.prototype[k]
            }
            return l
        }

        j.prototype.on = function (l, k) {
            this._callbacks = this._callbacks || {};
            (this._callbacks[l] = this._callbacks[l] || []).push(k);
            return this
        };
        j.prototype.once = function (n, m) {
            var l = this;
            this._callbacks = this._callbacks || {};
            function k() {
                l.off(n, k);
                m.apply(this, arguments)
            }

            m._off = k;
            this.on(n, k);
            return this
        };
        j.prototype.off = j.prototype.removeListener = j.prototype.removeAllListeners = function (n, l) {
            this._callbacks = this._callbacks || {};
            if (0 == arguments.length) {
                this._callbacks = {};
                return this
            }
            var m = this._callbacks[n];
            if (!m) {
                return this
            }
            if (1 == arguments.length) {
                delete this._callbacks[n];
                return this
            }
            var k = g(m, l._off || l);
            if (~k) {
                m.splice(k, 1)
            }
            return this
        };
        j.prototype.emit = function (o) {
            this._callbacks = this._callbacks || {};
            var l = [].slice.call(arguments, 1), n = this._callbacks[o];
            if (n) {
                n = n.slice(0);
                for (var m = 0, k = n.length; m < k; ++m) {
                    n[m].apply(this, l)
                }
            }
            return this
        };
        j.prototype.listeners = function (k) {
            this._callbacks = this._callbacks || {};
            return this._callbacks[k] || []
        };
        j.prototype.hasListeners = function (k) {
            return !!this.listeners(k).length
        }
    }, {indexof: 35}], 10: [function (f, g, e) {
        g.exports = f("./lib/")
    }, {"./lib/": 11}], 11: [function (f, g, e) {
        g.exports = f("./socket");
        g.exports.parser = f("engine.io-parser")
    }, {"./socket": 12, "engine.io-parser": 20}], 12: [function (k, i, n) {
        var h = typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {};
        var m = k("./transports");
        var r = k("emitter");
        var f = k("debug")("engine.io-client:socket");
        var p = k("indexof");
        var e = k("engine.io-parser");
        var l = k("parseuri");
        var o = k("parsejson");
        var j = k("parseqs");
        i.exports = g;
        function s() {
        }

        function g(v, u) {
            if (!(this instanceof g)) {
                return new g(v, u)
            }
            u = u || {};
            if (v && "object" == typeof v) {
                u = v;
                v = null
            }
            if (v) {
                v = l(v);
                u.host = v.host;
                u.secure = v.protocol == "https" || v.protocol == "wss";
                u.port = v.port;
                if (v.query) {
                    u.query = v.query
                }
            }
            this.secure = null != u.secure ? u.secure : (h.location && "https:" == location.protocol);
            if (u.host) {
                var t = u.host.split(":");
                u.hostname = t.shift();
                if (t.length) {
                    u.port = t.pop()
                }
            }
            this.agent = u.agent || false;
            this.hostname = u.hostname || (h.location ? location.hostname : "localhost");
            this.port = u.port || (h.location && location.port ? location.port : (this.secure ? 443 : 80));
            this.query = u.query || {};
            if ("string" == typeof this.query) {
                this.query = j.decode(this.query)
            }
            this.upgrade = false !== u.upgrade;
            this.path = (u.path || "/engine.io").replace(/\/$/, "") + "/";
            this.forceJSONP = !!u.forceJSONP;
            this.forceBase64 = !!u.forceBase64;
            this.timestampParam = u.timestampParam || "t";
            this.timestampRequests = u.timestampRequests;
            this.transports = u.transports || ["polling", "websocket"];
            this.readyState = "";
            this.writeBuffer = [];
            this.callbackBuffer = [];
            this.policyPort = u.policyPort || 843;
            this.rememberUpgrade = u.rememberUpgrade || false;
            this.open();
            this.binaryType = null;
            this.onlyBinaryUpgrades = u.onlyBinaryUpgrades
        }

        g.priorWebsocketSuccess = false;
        r(g.prototype);
        g.protocol = e.protocol;
        g.Socket = g;
        g.Transport = k("./transport");
        g.transports = k("./transports");
        g.parser = k("engine.io-parser");
        g.prototype.createTransport = function (t) {
            f('creating transport "%s"', t);
            var u = q(this.query);
            u.EIO = e.protocol;
            u.transport = t;
            if (this.id) {
                u.sid = this.id
            }
            var v = new m[t]({agent: this.agent, hostname: this.hostname, port: this.port, secure: this.secure, path: this.path, query: u, forceJSONP: this.forceJSONP, forceBase64: this.forceBase64, timestampRequests: this.timestampRequests, timestampParam: this.timestampParam, policyPort: this.policyPort, socket: this});
            return v
        };
        function q(u) {
            var v = {};
            for (var t in u) {
                if (u.hasOwnProperty(t)) {
                    v[t] = u[t]
                }
            }
            return v
        }

        g.prototype.open = function () {
            var t;
            if (this.rememberUpgrade && g.priorWebsocketSuccess && this.transports.indexOf("websocket") != -1) {
                t = "websocket"
            } else {
                t = this.transports[0]
            }
            this.readyState = "opening";
            var t = this.createTransport(t);
            t.open();
            this.setTransport(t)
        };
        g.prototype.setTransport = function (u) {
            f("setting transport %s", u.name);
            var t = this;
            if (this.transport) {
                f("clearing existing transport %s", this.transport.name);
                this.transport.removeAllListeners()
            }
            this.transport = u;
            u.on("drain", function () {
                t.onDrain()
            }).on("packet", function (v) {
                t.onPacket(v)
            }).on("error", function (v) {
                t.onError(v)
            }).on("close", function () {
                t.onClose("transport close")
            })
        };
        g.prototype.probe = function (t) {
            f('probing transport "%s"', t);
            var w = this.createTransport(t, {probe: 1}), y = false, C = this;
            g.priorWebsocketSuccess = false;
            function x() {
                if (C.onlyBinaryUpgrades) {
                    var E = !this.supportsBinary && C.transport.supportsBinary;
                    y = y || E
                }
                if (y) {
                    return
                }
                f('probe transport "%s" opened', t);
                w.send([
                    {type: "ping", data: "probe"}
                ]);
                w.once("packet", function (G) {
                    if (y) {
                        return
                    }
                    if ("pong" == G.type && "probe" == G.data) {
                        f('probe transport "%s" pong', t);
                        C.upgrading = true;
                        C.emit("upgrading", w);
                        g.priorWebsocketSuccess = "websocket" == w.name;
                        f('pausing current transport "%s"', C.transport.name);
                        C.transport.pause(function () {
                            if (y) {
                                return
                            }
                            if ("closed" == C.readyState || "closing" == C.readyState) {
                                return
                            }
                            f("changing transport and sending upgrade packet");
                            u();
                            C.setTransport(w);
                            w.send([
                                {type: "upgrade"}
                            ]);
                            C.emit("upgrade", w);
                            w = null;
                            C.upgrading = false;
                            C.flush()
                        })
                    } else {
                        f('probe transport "%s" failed', t);
                        var F = new Error("probe error");
                        F.transport = w.name;
                        C.emit("upgradeError", F)
                    }
                })
            }

            function A() {
                if (y) {
                    return
                }
                y = true;
                u();
                w.close();
                w = null
            }

            function z(F) {
                var E = new Error("probe error: " + F);
                E.transport = w.name;
                A();
                f('probe transport "%s" failed because of error: %s', t, F);
                C.emit("upgradeError", E)
            }

            function D() {
                z("transport closed")
            }

            function B() {
                z("socket closed")
            }

            function v(E) {
                if (w && E.name != w.name) {
                    f('"%s" works - aborting "%s"', E.name, w.name);
                    A()
                }
            }

            function u() {
                w.removeListener("open", x);
                w.removeListener("error", z);
                w.removeListener("close", D);
                C.removeListener("close", B);
                C.removeListener("upgrading", v)
            }

            w.once("open", x);
            w.once("error", z);
            w.once("close", D);
            this.once("close", B);
            this.once("upgrading", v);
            w.open()
        };
        g.prototype.onOpen = function () {
            f("socket open");
            this.readyState = "open";
            g.priorWebsocketSuccess = "websocket" == this.transport.name;
            this.emit("open");
            this.flush();
            if ("open" == this.readyState && this.upgrade && this.transport.pause) {
                f("starting upgrade probes");
                for (var u = 0, t = this.upgrades.length; u < t; u++) {
                    this.probe(this.upgrades[u])
                }
            }
        };
        g.prototype.onPacket = function (u) {
            if ("opening" == this.readyState || "open" == this.readyState) {
                f('socket receive: type "%s", data "%s"', u.type, u.data);
                this.emit("packet", u);
                this.emit("heartbeat");
                switch (u.type) {
                    case"open":
                        this.onHandshake(o(u.data));
                        break;
                    case"pong":
                        this.setPing();
                        break;
                    case"error":
                        var t = new Error("server error");
                        t.code = u.data;
                        this.emit("error", t);
                        break;
                    case"message":
                        this.emit("data", u.data);
                        this.emit("message", u.data);
                        break
                }
            } else {
                f('packet received with socket readyState "%s"', this.readyState)
            }
        };
        g.prototype.onHandshake = function (t) {
            this.emit("handshake", t);
            this.id = t.sid;
            this.transport.query.sid = t.sid;
            this.upgrades = this.filterUpgrades(t.upgrades);
            this.pingInterval = t.pingInterval;
            this.pingTimeout = t.pingTimeout;
            this.onOpen();
            if ("closed" == this.readyState) {
                return
            }
            this.setPing();
            this.removeListener("heartbeat", this.onHeartbeat);
            this.on("heartbeat", this.onHeartbeat)
        };
        g.prototype.onHeartbeat = function (u) {
            clearTimeout(this.pingTimeoutTimer);
            var t = this;
            t.pingTimeoutTimer = setTimeout(function () {
                if ("closed" == t.readyState) {
                    return
                }
                t.onClose("ping timeout")
            }, u || (t.pingInterval + t.pingTimeout))
        };
        g.prototype.setPing = function () {
            var t = this;
            clearTimeout(t.pingIntervalTimer);
            t.pingIntervalTimer = setTimeout(function () {
                f("writing ping packet - expecting pong within %sms", t.pingTimeout);
                t.ping();
                t.onHeartbeat(t.pingTimeout)
            }, t.pingInterval)
        };
        g.prototype.ping = function () {
            this.sendPacket("ping")
        };
        g.prototype.onDrain = function () {
            for (var t = 0; t < this.prevBufferLen; t++) {
                if (this.callbackBuffer[t]) {
                    this.callbackBuffer[t]()
                }
            }
            this.writeBuffer.splice(0, this.prevBufferLen);
            this.callbackBuffer.splice(0, this.prevBufferLen);
            this.prevBufferLen = 0;
            if (this.writeBuffer.length == 0) {
                this.emit("drain")
            } else {
                this.flush()
            }
        };
        g.prototype.flush = function () {
            if ("closed" != this.readyState && this.transport.writable && !this.upgrading && this.writeBuffer.length) {
                f("flushing %d packets in socket", this.writeBuffer.length);
                this.transport.send(this.writeBuffer);
                this.prevBufferLen = this.writeBuffer.length;
                this.emit("flush")
            }
        };
        g.prototype.write = g.prototype.send = function (u, t) {
            this.sendPacket("message", u, t);
            return this
        };
        g.prototype.sendPacket = function (u, v, t) {
            var w = {type: u, data: v};
            this.emit("packetCreate", w);
            this.writeBuffer.push(w);
            this.callbackBuffer.push(t);
            this.flush()
        };
        g.prototype.close = function () {
            if ("opening" == this.readyState || "open" == this.readyState) {
                this.onClose("forced close");
                f("socket closing - telling transport to close");
                this.transport.close()
            }
            return this
        };
        g.prototype.onError = function (t) {
            f("socket error %j", t);
            g.priorWebsocketSuccess = false;
            this.emit("error", t);
            this.onClose("transport error", t)
        };
        g.prototype.onClose = function (u, v) {
            if ("opening" == this.readyState || "open" == this.readyState) {
                f('socket close with reason: "%s"', u);
                var t = this;
                clearTimeout(this.pingIntervalTimer);
                clearTimeout(this.pingTimeoutTimer);
                setTimeout(function () {
                    t.writeBuffer = [];
                    t.callbackBuffer = [];
                    t.prevBufferLen = 0
                }, 0);
                this.transport.removeAllListeners("close");
                this.transport.close();
                this.transport.removeAllListeners();
                this.readyState = "closed";
                this.id = null;
                this.emit("close", u, v)
            }
        };
        g.prototype.filterUpgrades = function (v) {
            var w = [];
            for (var u = 0, t = v.length; u < t; u++) {
                if (~p(this.transports, v[u])) {
                    w.push(v[u])
                }
            }
            return w
        }
    }, {"./transport": 13, "./transports": 14, debug: 8, emitter: 9, "engine.io-parser": 20, indexof: 35, parsejson: 28, parseqs: 29, parseuri: 37}], 13: [function (f, g, e) {
        var j = f("engine.io-parser");
        var h = f("emitter");
        g.exports = i;
        function i(k) {
            this.path = k.path;
            this.hostname = k.hostname;
            this.port = k.port;
            this.secure = k.secure;
            this.query = k.query;
            this.timestampParam = k.timestampParam;
            this.timestampRequests = k.timestampRequests;
            this.readyState = "";
            this.agent = k.agent || false;
            this.socket = k.socket
        }

        h(i.prototype);
        i.timestamps = 0;
        i.prototype.onError = function (m, l) {
            var k = new Error(m);
            k.type = "TransportError";
            k.description = l;
            this.emit("error", k);
            return this
        };
        i.prototype.open = function () {
            if ("closed" == this.readyState || "" == this.readyState) {
                this.readyState = "opening";
                this.doOpen()
            }
            return this
        };
        i.prototype.close = function () {
            if ("opening" == this.readyState || "open" == this.readyState) {
                this.doClose();
                this.onClose()
            }
            return this
        };
        i.prototype.send = function (k) {
            if ("open" == this.readyState) {
                this.write(k)
            } else {
                throw new Error("Transport not open")
            }
        };
        i.prototype.onOpen = function () {
            this.readyState = "open";
            this.writable = true;
            this.emit("open")
        };
        i.prototype.onData = function (k) {
            this.onPacket(j.decodePacket(k, this.socket.binaryType))
        };
        i.prototype.onPacket = function (k) {
            this.emit("packet", k)
        };
        i.prototype.onClose = function () {
            this.readyState = "closed";
            this.emit("close")
        }
    }, {emitter: 9, "engine.io-parser": 20}], 14: [function (h, f, j) {
        var e = typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {};
        var m = h("xmlhttprequest");
        var l = h("./polling-xhr");
        var k = h("./polling-jsonp");
        var i = h("./websocket");
        j.polling = g;
        j.websocket = i;
        function g(o) {
            var r;
            var p = false;
            if (e.location) {
                var q = "https:" == location.protocol;
                var n = location.port;
                if (!n) {
                    n = q ? 443 : 80
                }
                p = o.hostname != location.hostname || n != o.port
            }
            o.xdomain = p;
            r = new m(o);
            if ("open" in r && !o.forceJSONP) {
                return new l(o)
            } else {
                return new k(o)
            }
        }
    }, {"./polling-jsonp": 15, "./polling-xhr": 16, "./websocket": 18, xmlhttprequest: 19}], 15: [function (g, f, i) {
        var e = typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {};
        var p = g("./polling");
        var j = g("inherits");
        f.exports = l;
        var n = /\n/g;
        var h = /\\n/g;
        var o;
        var m = 0;

        function k() {
        }

        function l(r) {
            p.call(this, r);
            this.query = this.query || {};
            if (!o) {
                if (!e.___eio) {
                    e.___eio = []
                }
                o = e.___eio
            }
            this.index = o.length;
            var q = this;
            o.push(function (s) {
                q.onData(s)
            });
            this.query.j = this.index;
            if (e.document && e.addEventListener) {
                e.addEventListener("beforeunload", function () {
                    if (q.script) {
                        q.script.onerror = k
                    }
                })
            }
        }

        j(l, p);
        l.prototype.supportsBinary = false;
        l.prototype.doClose = function () {
            if (this.script) {
                this.script.parentNode.removeChild(this.script);
                this.script = null
            }
            if (this.form) {
                this.form.parentNode.removeChild(this.form);
                this.form = null
            }
            p.prototype.doClose.call(this)
        };
        l.prototype.doPoll = function () {
            var r = this;
            var q = document.createElement("script");
            if (this.script) {
                this.script.parentNode.removeChild(this.script);
                this.script = null
            }
            q.async = true;
            q.src = this.uri();
            q.onerror = function (u) {
                r.onError("jsonp poll error", u)
            };
            var t = document.getElementsByTagName("script")[0];
            t.parentNode.insertBefore(q, t);
            this.script = q;
            var s = "undefined" != typeof navigator && /gecko/i.test(navigator.userAgent);
            if (s) {
                setTimeout(function () {
                    var u = document.createElement("iframe");
                    document.body.appendChild(u);
                    document.body.removeChild(u)
                }, 100)
            }
        };
        l.prototype.doWrite = function (w, y) {
            var z = this;
            if (!this.form) {
                var r = document.createElement("form");
                var s = document.createElement("textarea");
                var q = this.iframeId = "eio_iframe_" + this.index;
                var v;
                r.className = "socketio";
                r.style.position = "absolute";
                r.style.top = "-1000px";
                r.style.left = "-1000px";
                r.target = q;
                r.method = "POST";
                r.setAttribute("accept-charset", "utf-8");
                s.name = "d";
                r.appendChild(s);
                document.body.appendChild(r);
                this.form = r;
                this.area = s
            }
            this.form.action = this.uri();
            function t() {
                u();
                y()
            }

            function u() {
                if (z.iframe) {
                    try {
                        z.form.removeChild(z.iframe)
                    } catch (B) {
                        z.onError("jsonp polling iframe removal error", B)
                    }
                }
                try {
                    var A = '<iframe src="javascript:0" name="' + z.iframeId + '">';
                    v = document.createElement(A)
                } catch (B) {
                    v = document.createElement("iframe");
                    v.name = z.iframeId;
                    v.src = "javascript:0"
                }
                v.id = z.iframeId;
                z.form.appendChild(v);
                z.iframe = v
            }

            u();
            w = w.replace(h, "\\\n");
            this.area.value = w.replace(n, "\\n");
            try {
                this.form.submit()
            } catch (x) {
            }
            if (this.iframe.attachEvent) {
                this.iframe.onreadystatechange = function () {
                    if (z.iframe.readyState == "complete") {
                        t()
                    }
                }
            } else {
                this.iframe.onload = t
            }
        }
    }, {"./polling": 17, inherits: 27}], 16: [function (i, h, j) {
        var g = typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {};
        var o = i("xmlhttprequest");
        var p = i("./polling");
        var n = i("emitter");
        var f = i("debug")("engine.io-client:polling-xhr");
        var k = i("inherits");
        h.exports = l;
        h.exports.Request = e;
        function m() {
        }

        function l(s) {
            p.call(this, s);
            if (g.location) {
                var t = "https:" == location.protocol;
                var r = location.port;
                if (!r) {
                    r = t ? 443 : 80
                }
                this.xd = s.hostname != g.location.hostname || r != s.port
            }
        }

        k(l, p);
        l.prototype.supportsBinary = true;
        l.prototype.request = function (r) {
            r = r || {};
            r.uri = this.uri();
            r.xd = this.xd;
            r.agent = this.agent || false;
            r.supportsBinary = this.supportsBinary;
            return new e(r)
        };
        l.prototype.doWrite = function (v, s) {
            var u = typeof v !== "string" && v !== undefined;
            var t = this.request({method: "POST", data: v, isBinary: u});
            var r = this;
            t.on("success", s);
            t.on("error", function (w) {
                r.onError("xhr post error", w)
            });
            this.sendXhr = t
        };
        l.prototype.doPoll = function () {
            f("xhr poll");
            var s = this.request();
            var r = this;
            s.on("data", function (t) {
                r.onData(t)
            });
            s.on("error", function (t) {
                r.onError("xhr poll error", t)
            });
            this.pollXhr = s
        };
        function e(r) {
            this.method = r.method || "GET";
            this.uri = r.uri;
            this.xd = !!r.xd;
            this.async = false !== r.async;
            this.data = undefined != r.data ? r.data : null;
            this.agent = r.agent;
            this.create(r.isBinary, r.supportsBinary)
        }

        n(e.prototype);
        e.prototype.create = function (s, v) {
            var u = this.xhr = new o({agent: this.agent, xdomain: this.xd});
            var r = this;
            try {
                f("xhr open %s: %s", this.method, this.uri);
                u.open(this.method, this.uri, this.async);
                if (v) {
                    u.responseType = "arraybuffer"
                }
                if ("POST" == this.method) {
                    try {
                        if (s) {
                            u.setRequestHeader("Content-type", "application/octet-stream")
                        } else {
                            u.setRequestHeader("Content-type", "text/plain;charset=UTF-8")
                        }
                    } catch (t) {
                    }
                }
                if ("withCredentials" in u) {
                    u.withCredentials = true
                }
                u.onreadystatechange = function () {
                    var w;
                    try {
                        if (4 != u.readyState) {
                            return
                        }
                        if (200 == u.status || 1223 == u.status) {
                            var y = u.getResponseHeader("Content-Type");
                            if (y === "application/octet-stream") {
                                w = u.response
                            } else {
                                if (!v) {
                                    w = u.responseText
                                } else {
                                    w = "ok"
                                }
                            }
                        } else {
                            setTimeout(function () {
                                r.onError(u.status)
                            }, 0)
                        }
                    } catch (x) {
                        r.onError(x)
                    }
                    if (null != w) {
                        r.onData(w)
                    }
                };
                f("xhr data %s", this.data);
                u.send(this.data)
            } catch (t) {
                setTimeout(function () {
                    r.onError(t)
                }, 0);
                return
            }
            if (g.document) {
                this.index = e.requestsCount++;
                e.requests[this.index] = this
            }
        };
        e.prototype.onSuccess = function () {
            this.emit("success");
            this.cleanup()
        };
        e.prototype.onData = function (r) {
            this.emit("data", r);
            this.onSuccess()
        };
        e.prototype.onError = function (r) {
            this.emit("error", r);
            this.cleanup()
        };
        e.prototype.cleanup = function () {
            if ("undefined" == typeof this.xhr || null === this.xhr) {
                return
            }
            this.xhr.onreadystatechange = m;
            try {
                this.xhr.abort()
            } catch (r) {
            }
            if (g.document) {
                delete e.requests[this.index]
            }
            this.xhr = null
        };
        e.prototype.abort = function () {
            this.cleanup()
        };
        if (g.document) {
            e.requestsCount = 0;
            e.requests = {};
            if (g.attachEvent) {
                g.attachEvent("onunload", q)
            } else {
                if (g.addEventListener) {
                    g.addEventListener("beforeunload", q)
                }
            }
        }
        function q() {
            for (var r in e.requests) {
                if (e.requests.hasOwnProperty(r)) {
                    e.requests[r].abort()
                }
            }
        }
    }, {"./polling": 17, debug: 8, emitter: 9, inherits: 27, xmlhttprequest: 19}], 17: [function (j, g, k) {
        var m = j("../transport");
        var i = j("parseqs");
        var e = j("engine.io-parser");
        var f = j("debug")("engine.io-client:polling");
        var l = j("inherits");
        g.exports = n;
        var h = (function () {
            var o = j("xmlhttprequest");
            var p = new o({agent: this.agent, xdomain: false});
            return null != p.responseType
        })();

        function n(p) {
            var o = (p && p.forceBase64);
            if (!h || o) {
                this.supportsBinary = false
            }
            m.call(this, p)
        }

        l(n, m);
        n.prototype.name = "polling";
        n.prototype.doOpen = function () {
            this.poll()
        };
        n.prototype.pause = function (o) {
            var s = 0;
            var p = this;
            this.readyState = "pausing";
            function r() {
                f("paused");
                p.readyState = "paused";
                o()
            }

            if (this.polling || !this.writable) {
                var q = 0;
                if (this.polling) {
                    f("we are currently polling - waiting to pause");
                    q++;
                    this.once("pollComplete", function () {
                        f("pre-pause polling complete");
                        --q || r()
                    })
                }
                if (!this.writable) {
                    f("we are currently writing - waiting to pause");
                    q++;
                    this.once("drain", function () {
                        f("pre-pause writing complete");
                        --q || r()
                    })
                }
            } else {
                r()
            }
        };
        n.prototype.poll = function () {
            f("polling");
            this.polling = true;
            this.doPoll();
            this.emit("poll")
        };
        n.prototype.onData = function (p) {
            var o = this;
            f("polling got data %s", p);
            var q = function (t, r, s) {
                if ("opening" == o.readyState) {
                    o.onOpen()
                }
                if ("close" == t.type) {
                    o.onClose();
                    return false
                }
                o.onPacket(t)
            };
            e.decodePayload(p, this.socket.binaryType, q);
            if ("closed" != this.readyState) {
                this.polling = false;
                this.emit("pollComplete");
                if ("open" == this.readyState) {
                    this.poll()
                } else {
                    f('ignoring poll - transport state "%s"', this.readyState)
                }
            }
        };
        n.prototype.doClose = function () {
            var o = this;

            function p() {
                f("writing close packet");
                o.write([
                    {type: "close"}
                ])
            }

            if ("open" == this.readyState) {
                f("transport open - closing");
                p()
            } else {
                f("transport not open - deferring close");
                this.once("open", p)
            }
        };
        n.prototype.write = function (q) {
            var p = this;
            this.writable = false;
            var o = function () {
                p.writable = true;
                p.emit("drain")
            };
            var p = this;
            e.encodePayload(q, this.supportsBinary, function (r) {
                p.doWrite(r, o)
            })
        };
        n.prototype.uri = function () {
            var q = this.query || {};
            var p = this.secure ? "https" : "http";
            var o = "";
            if (false !== this.timestampRequests) {
                q[this.timestampParam] = +new Date + "-" + m.timestamps++
            }
            if (!this.supportsBinary && !q.sid) {
                q.b64 = 1
            }
            q = i.encode(q);
            if (this.port && (("https" == p && this.port != 443) || ("http" == p && this.port != 80))) {
                o = ":" + this.port
            }
            if (q.length) {
                q = "?" + q
            }
            return p + "://" + this.hostname + o + this.path + q
        }
    }, {"../transport": 13, debug: 8, "engine.io-parser": 20, inherits: 27, parseqs: 29, xmlhttprequest: 19}], 18: [function (j, h, k) {
        var m = j("../transport");
        var e = j("engine.io-parser");
        var i = j("parseqs");
        var f = j("debug")("engine.io-client:websocket");
        var l = j("inherits");
        var n = j("ws");
        h.exports = g;
        function g(p) {
            var o = (p && p.forceBase64);
            if (o) {
                this.supportsBinary = false
            }
            m.call(this, p)
        }

        l(g, m);
        g.prototype.name = "websocket";
        g.prototype.supportsBinary = true;
        g.prototype.doOpen = function () {
            if (!this.check()) {
                return
            }
            var o = this;
            var r = this.uri();
            var q = void (0);
            var p = {agent: this.agent};
            this.ws = new n(r, q, p);
            if (this.ws.binaryType === undefined) {
                this.supportsBinary = false
            }
            this.ws.binaryType = "arraybuffer";
            this.addEventListeners()
        };
        g.prototype.addEventListeners = function () {
            var o = this;
            this.ws.onopen = function () {
                o.onOpen()
            };
            this.ws.onclose = function () {
                o.onClose()
            };
            this.ws.onmessage = function (p) {
                o.onData(p.data)
            };
            this.ws.onerror = function (p) {
                o.onError("websocket error", p)
            }
        };
        if ("undefined" != typeof navigator && /iPad|iPhone|iPod/i.test(navigator.userAgent)) {
            g.prototype.onData = function (p) {
                var o = this;
                setTimeout(function () {
                    m.prototype.onData.call(o, p)
                }, 0)
            }
        }
        g.prototype.write = function (r) {
            var p = this;
            this.writable = false;
            for (var q = 0, o = r.length; q < o; q++) {
                e.encodePacket(r[q], this.supportsBinary, function (t) {
                    try {
                        p.ws.send(t)
                    } catch (u) {
                        f("websocket closed before onclose event")
                    }
                })
            }
            function s() {
                p.writable = true;
                p.emit("drain")
            }

            setTimeout(s, 0)
        };
        g.prototype.onClose = function () {
            m.prototype.onClose.call(this)
        };
        g.prototype.doClose = function () {
            if (typeof this.ws !== "undefined") {
                this.ws.close()
            }
        };
        g.prototype.uri = function () {
            var q = this.query || {};
            var p = this.secure ? "wss" : "ws";
            var o = "";
            if (this.port && (("wss" == p && this.port != 443) || ("ws" == p && this.port != 80))) {
                o = ":" + this.port
            }
            if (this.timestampRequests) {
                q[this.timestampParam] = +new Date
            }
            if (!this.supportsBinary) {
                q.b64 = 1
            }
            q = i.encode(q);
            if (q.length) {
                q = "?" + q
            }
            return p + "://" + this.hostname + o + this.path + q
        };
        g.prototype.check = function () {
            return !!n && !("__initialize" in n && this.name === g.prototype.name)
        }
    }, {"../transport": 13, debug: 8, "engine.io-parser": 20, inherits: 27, parseqs: 29, ws: 30}], 19: [function (g, h, f) {
        var e = g("has-cors");
        h.exports = function (j) {
            var i = j.xdomain;
            try {
                if ("undefined" != typeof XMLHttpRequest && (!i || e)) {
                    return new XMLHttpRequest()
                }
            } catch (k) {
            }
            if (!i) {
                try {
                    return new ActiveXObject("Microsoft.XMLHTTP")
                } catch (k) {
                }
            }
        }
    }, {"has-cors": 33}], 20: [function (m, e, v) {
        var p = typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {};
        var n = m("./keys");
        var l = m("arraybuffer.slice");
        var q = m("base64-arraybuffer");
        var h = m("after");
        var f = m("utf8");
        var t = navigator.userAgent.match(/Android/i);
        v.protocol = 2;
        var o = v.packets = {open: 0, close: 1, ping: 2, pong: 3, message: 4, upgrade: 5, noop: 6};
        var i = n(o);
        var j = {type: "error", data: "parser error"};
        var k = m("blob");
        v.encodePacket = function (y, A, z) {
            if (typeof A == "function") {
                z = A;
                A = false
            }
            var w = (y.data === undefined) ? undefined : y.data.buffer || y.data;
            if (p.ArrayBuffer && w instanceof ArrayBuffer) {
                return g(y, A, z)
            } else {
                if (k && w instanceof p.Blob) {
                    return r(y, A, z)
                }
            }
            var x = o[y.type];
            if (undefined !== y.data) {
                x += f.encode(String(y.data))
            }
            return z("" + x)
        };
        function g(A, C, B) {
            if (!C) {
                return v.encodeBase64Packet(A, B)
            }
            var z = A.data;
            var y = new Uint8Array(z);
            var x = new Uint8Array(1 + z.byteLength);
            x[0] = o[A.type];
            for (var w = 0; w < y.length; w++) {
                x[w + 1] = y[w]
            }
            return B(x.buffer)
        }

        function s(x, z, y) {
            if (!z) {
                return v.encodeBase64Packet(x, y)
            }
            var w = new FileReader();
            w.onload = function () {
                x.data = w.result;
                v.encodePacket(x, z, y)
            };
            return w.readAsArrayBuffer(x.data)
        }

        function r(y, A, z) {
            if (!A) {
                return v.encodeBase64Packet(y, z)
            }
            if (t) {
                return s(y, A, z)
            }
            var x = new Uint8Array(1);
            x[0] = o[y.type];
            var w = new k([x.buffer, y.data]);
            return z(w)
        }

        v.encodeBase64Packet = function (w, D) {
            var E = "b" + v.packets[w.type];
            if (k && w.data instanceof k) {
                var A = new FileReader();
                A.onload = function () {
                    var F = A.result.split(",")[1];
                    D(E + F)
                };
                return A.readAsDataURL(w.data)
            }
            var C;
            try {
                C = String.fromCharCode.apply(null, new Uint8Array(w.data))
            } catch (B) {
                var x = new Uint8Array(w.data);
                var y = new Array(x.length);
                for (var z = 0; z < x.length; z++) {
                    y[z] = x[z]
                }
                C = String.fromCharCode.apply(null, y)
            }
            E += p.btoa(C);
            return D(E)
        };
        v.decodePacket = function (z, A) {
            if (typeof z == "string" || z === undefined) {
                if (z.charAt(0) == "b") {
                    return v.decodeBase64Packet(z.substr(1), A)
                }
                z = f.decode(z);
                var y = z.charAt(0);
                if (Number(y) != y || !i[y]) {
                    return j
                }
                if (z.length > 1) {
                    return{type: i[y], data: z.substring(1)}
                } else {
                    return{type: i[y]}
                }
            }
            var w = new Uint8Array(z);
            var y = w[0];
            var x = l(z, 1);
            if (k && A === "blob") {
                x = new k([x])
            }
            return{type: i[y], data: x}
        };
        v.decodeBase64Packet = function (y, z) {
            var w = i[y.charAt(0)];
            if (!p.ArrayBuffer) {
                return{type: w, data: {base64: true, data: y.substr(1)}}
            }
            var x = q.decode(y.substr(1));
            if (z === "blob" && k) {
                x = new k([x])
            }
            return{type: w, data: x}
        };
        v.encodePayload = function (y, A, z) {
            if (typeof A == "function") {
                z = A;
                A = null
            }
            if (A) {
                if (k && !t) {
                    return v.encodePayloadAsBlob(y, z)
                }
                return v.encodePayloadAsArrayBuffer(y, z)
            }
            if (!y.length) {
                return z("0:")
            }
            function w(B) {
                return B.length + ":" + B
            }

            function x(C, B) {
                v.encodePacket(C, A, function (D) {
                    B(null, w(D))
                })
            }

            u(y, x, function (C, B) {
                return z(B.join(""))
            })
        };
        function u(A, C, x) {
            var w = new Array(A.length);
            var B = h(A.length, x);
            var y = function (E, F, D) {
                C(F, function (G, H) {
                    w[E] = H;
                    D(G, w)
                })
            };
            for (var z = 0; z < A.length; z++) {
                y(z, A[z], B)
            }
        }

        v.decodePayload = function (D, w, G) {
            if (typeof D != "string") {
                return v.decodePayloadAsBinary(D, w, G)
            }
            if (typeof w === "function") {
                G = w;
                w = null
            }
            var x;
            if (D == "") {
                return G(j, 0, 1)
            }
            var y = "", z, A;
            for (var E = 0, B = D.length; E < B; E++) {
                var C = D.charAt(E);
                if (":" != C) {
                    y += C
                } else {
                    if ("" == y || (y != (z = Number(y)))) {
                        return G(j, 0, 1)
                    }
                    A = D.substr(E + 1, z);
                    if (y != A.length) {
                        return G(j, 0, 1)
                    }
                    if (A.length) {
                        x = v.decodePacket(A, w);
                        if (j.type == x.type && j.data == x.data) {
                            return G(j, 0, 1)
                        }
                        var F = G(x, E + z, B);
                        if (false === F) {
                            return
                        }
                    }
                    E += z;
                    y = ""
                }
            }
            if (y != "") {
                return G(j, 0, 1)
            }
        };
        v.encodePayloadAsArrayBuffer = function (x, y) {
            if (!x.length) {
                return y(new ArrayBuffer(0))
            }
            function w(A, z) {
                v.encodePacket(A, true, function (B) {
                    return z(null, B)
                })
            }

            u(x, w, function (A, C) {
                var D = C.reduce(function (F, G) {
                    var E;
                    if (typeof G === "string") {
                        E = G.length
                    } else {
                        E = G.byteLength
                    }
                    return F + E.toString().length + E + 2
                }, 0);
                var B = new Uint8Array(D);
                var z = 0;
                C.forEach(function (I) {
                    var E = typeof I === "string";
                    var H = I;
                    if (E) {
                        var F = new Uint8Array(I.length);
                        for (var G = 0; G < I.length; G++) {
                            F[G] = I.charCodeAt(G)
                        }
                        H = F.buffer
                    }
                    if (E) {
                        B[z++] = 0
                    } else {
                        B[z++] = 1
                    }
                    var J = H.byteLength.toString();
                    for (var G = 0; G < J.length; G++) {
                        B[z++] = parseInt(J[G])
                    }
                    B[z++] = 255;
                    var F = new Uint8Array(H);
                    for (var G = 0; G < F.length; G++) {
                        B[z++] = F[G]
                    }
                });
                return y(B.buffer)
            })
        };
        v.encodePayloadAsBlob = function (x, y) {
            function w(A, z) {
                v.encodePacket(A, true, function (H) {
                    var F = new Uint8Array(1);
                    F[0] = 1;
                    if (typeof H === "string") {
                        var C = new Uint8Array(H.length);
                        for (var E = 0; E < H.length; E++) {
                            C[E] = H.charCodeAt(E)
                        }
                        H = C.buffer;
                        F[0] = 0
                    }
                    var B = (H instanceof ArrayBuffer) ? H.byteLength : H.size;
                    var I = B.toString();
                    var G = new Uint8Array(I.length + 1);
                    for (var E = 0; E < I.length; E++) {
                        G[E] = parseInt(I[E])
                    }
                    G[I.length] = 255;
                    if (k) {
                        var D = new k([F.buffer, G.buffer, H]);
                        z(null, D)
                    }
                })
            }

            u(x, w, function (A, z) {
                return y(new k(z))
            })
        };
        v.decodePayloadAsBinary = function (C, w, H) {
            if (typeof w === "function") {
                H = w;
                w = null
            }
            var G = C;
            var I = [];
            while (G.byteLength > 0) {
                var x = new Uint8Array(G);
                var y = x[0] === 0;
                var F = "";
                for (var B = 1; ; B++) {
                    if (x[B] == 255) {
                        break
                    }
                    F += x[B]
                }
                G = l(G, 2 + F.length);
                F = parseInt(F);
                var A = l(G, 0, F);
                if (y) {
                    try {
                        A = String.fromCharCode.apply(null, new Uint8Array(A))
                    } catch (D) {
                        var z = new Uint8Array(A);
                        A = "";
                        for (var B = 0; B < z.length; B++) {
                            A += String.fromCharCode(z[B])
                        }
                    }
                }
                I.push(A);
                G = l(G, F)
            }
            var E = I.length;
            I.forEach(function (J, K) {
                H(v.decodePacket(J, w), K, E)
            })
        }
    }, {"./keys": 21, after: 22, "arraybuffer.slice": 23, "base64-arraybuffer": 24, blob: 25, utf8: 26}], 21: [function (f, g, e) {
        g.exports = Object.keys || function h(m) {
            var j = [];
            var k = Object.prototype.hasOwnProperty;
            for (var l in m) {
                if (k.call(m, l)) {
                    j.push(l)
                }
            }
            return j
        }
    }, {}], 22: [function (f, g, e) {
        g.exports = i;
        function i(m, n, l) {
            var j = false;
            l = l || h;
            k.count = m;
            return(m === 0) ? n() : k;
            function k(p, o) {
                if (k.count <= 0) {
                    throw new Error("after called too many times")
                }
                --k.count;
                if (p) {
                    j = true;
                    n(p);
                    n = l
                } else {
                    if (k.count === 0 && !j) {
                        n(null, o)
                    }
                }
            }
        }

        function h() {
        }
    }, {}], 23: [function (f, g, e) {
        g.exports = function (n, p, k) {
            var j = n.byteLength;
            p = p || 0;
            k = k || j;
            if (n.slice) {
                return n.slice(p, k)
            }
            if (p < 0) {
                p += j
            }
            if (k < 0) {
                k += j
            }
            if (k > j) {
                k = j
            }
            if (p >= j || p >= k || j === 0) {
                return new ArrayBuffer(0)
            }
            var o = new Uint8Array(n);
            var h = new Uint8Array(k - p);
            for (var l = p, m = 0; l < k; l++, m++) {
                h[m] = o[l]
            }
            return h.buffer
        }
    }, {}], 24: [function (f, g, e) {
        (function (h) {
            e.encode = function (n) {
                var l = new Uint8Array(n), m, j = l.length, k = "";
                for (m = 0; m < j; m += 3) {
                    k += h[l[m] >> 2];
                    k += h[((l[m] & 3) << 4) | (l[m + 1] >> 4)];
                    k += h[((l[m + 1] & 15) << 2) | (l[m + 2] >> 6)];
                    k += h[l[m + 2] & 63]
                }
                if ((j % 3) === 2) {
                    k = k.substring(0, k.length - 1) + "="
                } else {
                    if (j % 3 === 1) {
                        k = k.substring(0, k.length - 2) + "=="
                    }
                }
                return k
            };
            e.decode = function (r) {
                var k = r.length * 0.75, s = r.length, q, m = 0, n, l, j, u;
                if (r[r.length - 1] === "=") {
                    k--;
                    if (r[r.length - 2] === "=") {
                        k--
                    }
                }
                var o = new ArrayBuffer(k), t = new Uint8Array(o);
                for (q = 0; q < s; q += 4) {
                    n = h.indexOf(r[q]);
                    l = h.indexOf(r[q + 1]);
                    j = h.indexOf(r[q + 2]);
                    u = h.indexOf(r[q + 3]);
                    t[m++] = (n << 2) | (l >> 4);
                    t[m++] = ((l & 15) << 4) | (j >> 2);
                    t[m++] = ((j & 3) << 6) | (u & 63)
                }
                return o
            }
        })("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/")
    }, {}], 25: [function (f, i, e) {
        var l = typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {};
        var k = l.BlobBuilder || l.WebKitBlobBuilder || l.MSBlobBuilder || l.MozBlobBuilder;
        var h = (function () {
            try {
                var m = new Blob(["hi"]);
                return m.size == 2
            } catch (n) {
                return false
            }
        })();
        var j = k && k.prototype.append && k.prototype.getBlob;

        function g(o, m) {
            m = m || {};
            var p = new k();
            for (var n = 0; n < o.length; n++) {
                p.append(o[n])
            }
            return(m.type) ? p.getBlob(m.type) : p.getBlob()
        }

        i.exports = (function () {
            if (h) {
                return l.Blob
            } else {
                if (j) {
                    return g
                } else {
                    return undefined
                }
            }
        })()
    }, {}], 26: [function (f, g, e) {
        var h = typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {};
        /*! http://mths.be/utf8js v2.0.0 by @mathias */
        (function (v) {
            var o = typeof e == "object" && e;
            var B = typeof g == "object" && g && g.exports == o && g;
            var u = typeof h == "object" && h;
            if (u.global === u || u.window === u) {
                v = u
            }
            var t = String.fromCharCode;

            function n(F) {
                var E = [];
                var D = 0;
                var G = F.length;
                var H;
                var C;
                while (D < G) {
                    H = F.charCodeAt(D++);
                    if (H >= 55296 && H <= 56319 && D < G) {
                        C = F.charCodeAt(D++);
                        if ((C & 64512) == 56320) {
                            E.push(((H & 1023) << 10) + (C & 1023) + 65536)
                        } else {
                            E.push(H);
                            D--
                        }
                    } else {
                        E.push(H)
                    }
                }
                return E
            }

            function y(G) {
                var E = G.length;
                var D = -1;
                var F;
                var C = "";
                while (++D < E) {
                    F = G[D];
                    if (F > 65535) {
                        F -= 65536;
                        C += t(F >>> 10 & 1023 | 55296);
                        F = 56320 | F & 1023
                    }
                    C += t(F)
                }
                return C
            }

            function m(D, C) {
                return t(((D >> C) & 63) | 128)
            }

            function x(C) {
                if ((C & 4294967168) == 0) {
                    return t(C)
                }
                var D = "";
                if ((C & 4294965248) == 0) {
                    D = t(((C >> 6) & 31) | 192)
                } else {
                    if ((C & 4294901760) == 0) {
                        D = t(((C >> 12) & 15) | 224);
                        D += m(C, 6)
                    } else {
                        if ((C & 4292870144) == 0) {
                            D = t(((C >> 18) & 7) | 240);
                            D += m(C, 12);
                            D += m(C, 6)
                        }
                    }
                }
                D += t((C & 63) | 128);
                return D
            }

            function w(F) {
                var E = n(F);
                var G = E.length;
                var D = -1;
                var C;
                var H = "";
                while (++D < G) {
                    C = E[D];
                    H += x(C)
                }
                return H
            }

            function i() {
                if (r >= q) {
                    throw Error("Invalid byte index")
                }
                var C = s[r] & 255;
                r++;
                if ((C & 192) == 128) {
                    return C & 63
                }
                throw Error("Invalid continuation byte")
            }

            function k() {
                var D;
                var C;
                var G;
                var F;
                var E;
                if (r > q) {
                    throw Error("Invalid byte index")
                }
                if (r == q) {
                    return false
                }
                D = s[r] & 255;
                r++;
                if ((D & 128) == 0) {
                    return D
                }
                if ((D & 224) == 192) {
                    var C = i();
                    E = ((D & 31) << 6) | C;
                    if (E >= 128) {
                        return E
                    } else {
                        throw Error("Invalid continuation byte")
                    }
                }
                if ((D & 240) == 224) {
                    C = i();
                    G = i();
                    E = ((D & 15) << 12) | (C << 6) | G;
                    if (E >= 2048) {
                        return E
                    } else {
                        throw Error("Invalid continuation byte")
                    }
                }
                if ((D & 248) == 240) {
                    C = i();
                    G = i();
                    F = i();
                    E = ((D & 15) << 18) | (C << 12) | (G << 6) | F;
                    if (E >= 65536 && E <= 1114111) {
                        return E
                    }
                }
                throw Error("Invalid UTF-8 detected")
            }

            var s;
            var q;
            var r;

            function j(E) {
                s = n(E);
                q = s.length;
                r = 0;
                var C = [];
                var D;
                while ((D = k()) !== false) {
                    C.push(D)
                }
                return y(C)
            }

            var l = {version: "2.0.0", encode: w, decode: j};
            if (typeof d == "function" && typeof d.amd == "object" && d.amd) {
                d(function () {
                    return l
                })
            } else {
                if (o && !o.nodeType) {
                    if (B) {
                        B.exports = l
                    } else {
                        var z = {};
                        var p = z.hasOwnProperty;
                        for (var A in l) {
                            p.call(l, A) && (o[A] = l[A])
                        }
                    }
                } else {
                    v.utf8 = l
                }
            }
        }(this))
    }, {}], 27: [function (f, g, e) {
        if (typeof Object.create === "function") {
            g.exports = function h(j, i) {
                j.super_ = i;
                j.prototype = Object.create(i.prototype, {constructor: {value: j, enumerable: false, writable: true, configurable: true}})
            }
        } else {
            g.exports = function h(j, i) {
                j.super_ = i;
                var k = function () {
                };
                k.prototype = i.prototype;
                j.prototype = new k();
                j.prototype.constructor = j
            }
        }
    }, {}], 28: [function (g, f, i) {
        var e = typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {};
        var k = /^[\],:{}\s]*$/;
        var o = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g;
        var n = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g;
        var h = /(?:^|:|,)(?:\s*\[)+/g;
        var l = /^\s+/;
        var m = /\s+$/;
        f.exports = function j(p) {
            if ("string" != typeof p || !p) {
                return null
            }
            p = p.replace(l, "").replace(m, "");
            if (e.JSON && JSON.parse) {
                return JSON.parse(p)
            }
            if (k.test(p.replace(o, "@").replace(n, "]").replace(h, ""))) {
                return(new Function("return " + p))()
            }
        }
    }, {}], 29: [function (f, g, e) {
        e.encode = function (j) {
            var k = "";
            for (var h in j) {
                if (j.hasOwnProperty(h)) {
                    if (k.length) {
                        k += "&"
                    }
                    k += encodeURIComponent(h) + "=" + encodeURIComponent(j[h])
                }
            }
            return k
        };
        e.decode = function (h) {
            var m = {};
            var n = h.split("&");
            for (var k = 0, j = n.length; k < j; k++) {
                var o = n[k].split("=");
                m[decodeURIComponent(o[0])] = decodeURIComponent(o[1])
            }
            return m
        }
    }, {}], 30: [function (h, i, f) {
        var j = (function () {
            return this
        })();
        var g = j.WebSocket || j.MozWebSocket;
        i.exports = g ? e : null;
        function e(n, m, l) {
            var k;
            if (m) {
                k = new g(n, m)
            } else {
                k = new g(n)
            }
            return k
        }

        if (g) {
            e.prototype = g.prototype
        }
    }, {}], 31: [function (g, h, f) {
        var j = typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {};
        var e = g("isarray");
        h.exports = i;
        function i(l) {
            function k(o) {
                if (!o) {
                    return false
                }
                if ((j.Buffer && Buffer.isBuffer(o)) || (j.ArrayBuffer && o instanceof ArrayBuffer) || (j.Blob && o instanceof Blob) || (j.File && o instanceof File)) {
                    return true
                }
                if (e(o)) {
                    for (var n = 0; n < o.length; n++) {
                        if (k(o[n])) {
                            return true
                        }
                    }
                } else {
                    if (o && "object" == typeof o) {
                        if (o.toJSON) {
                            o = o.toJSON()
                        }
                        for (var m in o) {
                            if (k(o[m])) {
                                return true
                            }
                        }
                    }
                }
                return false
            }

            return k(l)
        }
    }, {isarray: 32}], 32: [function (f, g, e) {
        g.exports = Array.isArray || function (h) {
            return Object.prototype.toString.call(h) == "[object Array]"
        }
    }, {}], 33: [function (f, g, e) {
        var i = f("global");
        try {
            g.exports = "XMLHttpRequest" in i && "withCredentials" in new i.XMLHttpRequest()
        } catch (h) {
            g.exports = false
        }
    }, {global: 34}], 34: [function (f, g, e) {
        g.exports = (function () {
            return this
        })()
    }, {}], 35: [function (f, g, e) {
        var h = [].indexOf;
        g.exports = function (j, l) {
            if (h) {
                return j.indexOf(l)
            }
            for (var k = 0; k < j.length; ++k) {
                if (j[k] === l) {
                    return k
                }
            }
            return -1
        }
    }, {}], 36: [function (g, h, e) {
        var f = Object.prototype.hasOwnProperty;
        e.keys = Object.keys || function (k) {
            var j = [];
            for (var i in k) {
                if (f.call(k, i)) {
                    j.push(i)
                }
            }
            return j
        };
        e.values = function (k) {
            var j = [];
            for (var i in k) {
                if (f.call(k, i)) {
                    j.push(k[i])
                }
            }
            return j
        };
        e.merge = function (j, i) {
            for (var k in i) {
                if (f.call(i, k)) {
                    j[k] = i[k]
                }
            }
            return j
        };
        e.length = function (i) {
            return e.keys(i).length
        };
        e.isEmpty = function (i) {
            return 0 == e.length(i)
        }
    }, {}], 37: [function (f, g, e) {
        var h = /^(?:(?![^:@]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/;
        var j = ["source", "protocol", "authority", "userInfo", "user", "password", "host", "port", "relative", "path", "directory", "file", "query", "anchor"];
        g.exports = function i(o) {
            var k = h.exec(o || ""), n = {}, l = 14;
            while (l--) {
                n[j[l]] = k[l] || ""
            }
            return n
        }
    }, {}], 38: [function (g, h, f) {
        var i = typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {};
        var e = g("isarray");
        f.deconstructPacket = function (o) {
            var m = [];
            var l = o.data;

            function k(s) {
                if (!s) {
                    return s
                }
                if ((i.Buffer && Buffer.isBuffer(s)) || (i.ArrayBuffer && s instanceof ArrayBuffer)) {
                    var t = {_placeholder: true, num: m.length};
                    m.push(s);
                    return t
                } else {
                    if (e(s)) {
                        var r = new Array(s.length);
                        for (var q = 0; q < s.length; q++) {
                            r[q] = k(s[q])
                        }
                        return r
                    } else {
                        if ("object" == typeof s && !(s instanceof Date)) {
                            var r = {};
                            for (var p in s) {
                                r[p] = k(s[p])
                            }
                            return r
                        }
                    }
                }
                return s
            }

            var n = o;
            n.data = k(l);
            n.attachments = m.length;
            return{packet: n, buffers: m}
        };
        f.reconstructPacket = function (m, l) {
            var k = 0;

            function n(r) {
                if (r && r._placeholder) {
                    var o = l[r.num];
                    return o
                } else {
                    if (e(r)) {
                        for (var q = 0; q < r.length; q++) {
                            r[q] = n(r[q])
                        }
                        return r
                    } else {
                        if (r && "object" == typeof r) {
                            for (var p in r) {
                                r[p] = n(r[p])
                            }
                            return r
                        }
                    }
                }
                return r
            }

            m.data = n(m.data);
            m.attachments = undefined;
            return m
        };
        f.removeBlobs = function (n, o) {
            function k(t, u, q) {
                if (!t) {
                    return t
                }
                if ((i.Blob && t instanceof Blob) || (i.File && t instanceof File)) {
                    l++;
                    var p = new FileReader();
                    p.onload = function () {
                        if (q) {
                            q[u] = this.result
                        } else {
                            m = this.result
                        }
                        if (!--l) {
                            o(m)
                        }
                    };
                    p.readAsArrayBuffer(t)
                }
                if (e(t)) {
                    for (var s = 0; s < t.length; s++) {
                        k(t[s], s, t)
                    }
                } else {
                    if (t && "object" == typeof t && !j(t)) {
                        for (var r in t) {
                            k(t[r], r, t)
                        }
                    }
                }
            }

            var l = 0;
            var m = n;
            k(m);
            if (!l) {
                o(m)
            }
        };
        function j(k) {
            return(i.Buffer && Buffer.isBuffer(k)) || (i.ArrayBuffer && k instanceof ArrayBuffer)
        }
    }, {isarray: 40}], 39: [function (i, g, l) {
        var f = typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {};
        var e = i("debug")("socket.io-parser");
        var t = i("json3");
        var o = i("isarray");
        var q = i("emitter");
        var n = i("./binary");
        l.protocol = 3;
        l.types = ["CONNECT", "DISCONNECT", "EVENT", "BINARY_EVENT", "ACK", "BINARY_ACK", "ERROR"];
        l.CONNECT = 0;
        l.DISCONNECT = 1;
        l.EVENT = 2;
        l.ACK = 3;
        l.ERROR = 4;
        l.BINARY_EVENT = 5;
        l.BINARY_ACK = 6;
        l.Encoder = k;
        function k() {
        }

        k.prototype.encode = function (v, w) {
            e("encoding packet %j", v);
            if (l.BINARY_EVENT == v.type || l.BINARY_ACK == v.type) {
                h(v, w)
            } else {
                var u = j(v);
                w([u])
            }
        };
        function j(v) {
            var w = "";
            var u = false;
            w += v.type;
            if (l.BINARY_EVENT == v.type || l.BINARY_ACK == v.type) {
                w += v.attachments;
                w += "-"
            }
            if (v.nsp && "/" != v.nsp) {
                u = true;
                w += v.nsp
            }
            if (null != v.id) {
                if (u) {
                    w += ",";
                    u = false
                }
                w += v.id
            }
            if (null != v.data) {
                if (u) {
                    w += ","
                }
                w += t.stringify(v.data)
            }
            e("encoded %j as %s", v, w);
            return w
        }

        function h(v, w) {
            function u(A) {
                var y = n.deconstructPacket(A);
                var z = j(y.packet);
                var x = y.buffers;
                x.unshift(z);
                w(x)
            }

            n.removeBlobs(v, u)
        }

        l.Decoder = s;
        function s() {
            this.reconstructor = null
        }

        q(s.prototype);
        s.prototype.add = function (v) {
            var u;
            if ("string" == typeof v) {
                u = m(v);
                if (l.BINARY_EVENT == u.type || l.BINARY_ACK == u.type) {
                    this.reconstructor = new r(u);
                    if (this.reconstructor.reconPack.attachments == 0) {
                        this.emit("decoded", u)
                    }
                } else {
                    this.emit("decoded", u)
                }
            } else {
                if ((f.Buffer && Buffer.isBuffer(v)) || (f.ArrayBuffer && v instanceof ArrayBuffer) || v.base64) {
                    if (!this.reconstructor) {
                        throw new Error("got binary data when not reconstructing a packet")
                    } else {
                        u = this.reconstructor.takeBinaryData(v);
                        if (u) {
                            this.reconstructor = null;
                            this.emit("decoded", u)
                        }
                    }
                } else {
                    throw new Error("Unknown type: " + v)
                }
            }
        };
        function m(y) {
            var x = {};
            var u = 0;
            x.type = Number(y.charAt(0));
            if (null == l.types[x.type]) {
                return p()
            }
            if (l.BINARY_EVENT == x.type || l.BINARY_ACK == x.type) {
                x.attachments = "";
                while (y.charAt(++u) != "-") {
                    x.attachments += y.charAt(u)
                }
                x.attachments = Number(x.attachments)
            }
            if ("/" == y.charAt(u + 1)) {
                x.nsp = "";
                while (++u) {
                    var z = y.charAt(u);
                    if ("," == z) {
                        break
                    }
                    x.nsp += z;
                    if (u + 1 == y.length) {
                        break
                    }
                }
            } else {
                x.nsp = "/"
            }
            var v = y.charAt(u + 1);
            if ("" != v && Number(v) == v) {
                x.id = "";
                while (++u) {
                    var z = y.charAt(u);
                    if (null == z || Number(z) != z) {
                        --u;
                        break
                    }
                    x.id += y.charAt(u);
                    if (u + 1 == y.length) {
                        break
                    }
                }
                x.id = Number(x.id)
            }
            if (y.charAt(++u)) {
                try {
                    x.data = t.parse(y.substr(u))
                } catch (w) {
                    return p()
                }
            }
            e("decoded %s as %j", y, x);
            return x
        }

        s.prototype.destroy = function () {
            if (this.reconstructor) {
                this.reconstructor.finishedReconstruction()
            }
        };
        function r(u) {
            this.reconPack = u;
            this.buffers = []
        }

        r.prototype.takeBinaryData = function (u) {
            this.buffers.push(u);
            if (this.buffers.length == this.reconPack.attachments) {
                var v = n.reconstructPacket(this.reconPack, this.buffers);
                this.finishedReconstruction();
                return v
            }
            return null
        };
        r.prototype.finishedReconstruction = function () {
            this.reconPack = null;
            this.buffers = []
        };
        function p(u) {
            return{type: l.ERROR, data: "parser error"}
        }
    }, {"./binary": 38, debug: 8, emitter: 9, isarray: 40, json3: 41}], 40: [function (f, g, e) {
        g.exports = f(32)
    }, {}], 41: [function (f, g, e) {
        /*! JSON v3.2.6 | http://bestiejs.github.io/json3 | Copyright 2012-2013, Kit Cambridge | http://kit.mit-license.org */
        (function (M) {
            var q = {}.toString, m, h, F;
            var D = typeof d === "function" && d.amd;
            var R = typeof JSON == "object" && JSON;
            var L = typeof e == "object" && e && !e.nodeType && e;
            if (L && R) {
                L.stringify = R.stringify;
                L.parse = R.parse
            } else {
                L = M.JSON = R || {}
            }
            var w = new Date(-3509827334573292);
            try {
                w = w.getUTCFullYear() == -109252 && w.getUTCMonth() === 0 && w.getUTCDate() === 1 && w.getUTCHours() == 10 && w.getUTCMinutes() == 37 && w.getUTCSeconds() == 6 && w.getUTCMilliseconds() == 708
            } catch (r) {
            }
            function j(T) {
                if (j[T] !== F) {
                    return j[T]
                }
                var U;
                if (T == "bug-string-char-index") {
                    U = "a"[0] != "a"
                } else {
                    if (T == "json") {
                        U = j("json-stringify") && j("json-parse")
                    } else {
                        var ab, Y = '{"a":[1,true,false,null,"\\u0000\\b\\n\\f\\r\\t"]}';
                        if (T == "json-stringify") {
                            var Z = L.stringify, aa = typeof Z == "function" && w;
                            if (aa) {
                                (ab = function () {
                                    return 1
                                }).toJSON = ab;
                                try {
                                    aa = Z(0) === "0" && Z(new Number()) === "0" && Z(new String()) == '""' && Z(q) === F && Z(F) === F && Z() === F && Z(ab) === "1" && Z([ab]) == "[1]" && Z([F]) == "[null]" && Z(null) == "null" && Z([F, q, null]) == "[null,null,null]" && Z({a: [ab, true, false, null, "\x00\b\n\f\r\t"]}) == Y && Z(null, ab) === "1" && Z([1, 2], null, 1) == "[\n 1,\n 2\n]" && Z(new Date(-8640000000000000)) == '"-271821-04-20T00:00:00.000Z"' && Z(new Date(8640000000000000)) == '"+275760-09-13T00:00:00.000Z"' && Z(new Date(-62198755200000)) == '"-000001-01-01T00:00:00.000Z"' && Z(new Date(-1)) == '"1969-12-31T23:59:59.999Z"'
                                } catch (V) {
                                    aa = false
                                }
                            }
                            U = aa
                        }
                        if (T == "json-parse") {
                            var X = L.parse;
                            if (typeof X == "function") {
                                try {
                                    if (X("0") === 0 && !X(false)) {
                                        ab = X(Y);
                                        var W = ab.a.length == 5 && ab.a[0] === 1;
                                        if (W) {
                                            try {
                                                W = !X('"\t"')
                                            } catch (V) {
                                            }
                                            if (W) {
                                                try {
                                                    W = X("01") !== 1
                                                } catch (V) {
                                                }
                                            }
                                            if (W) {
                                                try {
                                                    W = X("1.") !== 1
                                                } catch (V) {
                                                }
                                            }
                                        }
                                    }
                                } catch (V) {
                                    W = false
                                }
                            }
                            U = W
                        }
                    }
                }
                return j[T] = !!U
            }

            if (!j("json")) {
                var N = "[object Function]";
                var K = "[object Date]";
                var H = "[object Number]";
                var I = "[object String]";
                var z = "[object Array]";
                var v = "[object Boolean]";
                var A = j("bug-string-char-index");
                if (!w) {
                    var n = Math.floor;
                    var S = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
                    var y = function (T, U) {
                        return S[U] + 365 * (T - 1970) + n((T - 1969 + (U = +(U > 1))) / 4) - n((T - 1901 + U) / 100) + n((T - 1601 + U) / 400)
                    }
                }
                if (!(m = {}.hasOwnProperty)) {
                    m = function (V) {
                        var T = {}, U;
                        if ((T.__proto__ = null, T.__proto__ = {toString: 1}, T).toString != q) {
                            m = function (Y) {
                                var X = this.__proto__, W = Y in (this.__proto__ = null, this);
                                this.__proto__ = X;
                                return W
                            }
                        } else {
                            U = T.constructor;
                            m = function (X) {
                                var W = (this.constructor || U).prototype;
                                return X in this && !(X in W && this[X] === W[X])
                            }
                        }
                        T = null;
                        return m.call(this, V)
                    }
                }
                var O = {"boolean": 1, number: 1, string: 1, "undefined": 1};
                var p = function (T, V) {
                    var U = typeof T[V];
                    return U == "object" ? !!T[V] : !O[U]
                };
                h = function (V, Y) {
                    var W = 0, T, U, X;
                    (T = function () {
                        this.valueOf = 0
                    }).prototype.valueOf = 0;
                    U = new T();
                    for (X in U) {
                        if (m.call(U, X)) {
                            W++
                        }
                    }
                    T = U = null;
                    if (!W) {
                        U = ["valueOf", "toString", "toLocaleString", "propertyIsEnumerable", "isPrototypeOf", "hasOwnProperty", "constructor"];
                        h = function (aa, ae) {
                            var ad = q.call(aa) == N, ac, ab;
                            var Z = !ad && typeof aa.constructor != "function" && p(aa, "hasOwnProperty") ? aa.hasOwnProperty : m;
                            for (ac in aa) {
                                if (!(ad && ac == "prototype") && Z.call(aa, ac)) {
                                    ae(ac)
                                }
                            }
                            for (ab = U.length; ac = U[--ab]; Z.call(aa, ac) && ae(ac)) {
                            }
                        }
                    } else {
                        if (W == 2) {
                            h = function (aa, ad) {
                                var Z = {}, ac = q.call(aa) == N, ab;
                                for (ab in aa) {
                                    if (!(ac && ab == "prototype") && !m.call(Z, ab) && (Z[ab] = 1) && m.call(aa, ab)) {
                                        ad(ab)
                                    }
                                }
                            }
                        } else {
                            h = function (aa, ad) {
                                var ac = q.call(aa) == N, ab, Z;
                                for (ab in aa) {
                                    if (!(ac && ab == "prototype") && m.call(aa, ab) && !(Z = ab === "constructor")) {
                                        ad(ab)
                                    }
                                }
                                if (Z || m.call(aa, (ab = "constructor"))) {
                                    ad(ab)
                                }
                            }
                        }
                    }
                    return h(V, Y)
                };
                if (!j("json-stringify")) {
                    var l = {92: "\\\\", 34: '\\"', 8: "\\b", 12: "\\f", 10: "\\n", 13: "\\r", 9: "\\t"};
                    var E = "000000";
                    var o = function (T, U) {
                        return(E + (U || 0)).slice(-T)
                    };
                    var t = "\\u00";
                    var x = function (Z) {
                        var T = '"', W = 0, X = Z.length, Y = X > 10 && A, V;
                        if (Y) {
                            V = Z.split("")
                        }
                        for (; W < X; W++) {
                            var U = Z.charCodeAt(W);
                            switch (U) {
                                case 8:
                                case 9:
                                case 10:
                                case 12:
                                case 13:
                                case 34:
                                case 92:
                                    T += l[U];
                                    break;
                                default:
                                    if (U < 32) {
                                        T += t + o(2, U.toString(16));
                                        break
                                    }
                                    T += Y ? V[W] : A ? Z.charAt(W) : Z[W]
                            }
                        }
                        return T + '"'
                    };
                    var k = function (Z, aq, X, ac, an, T, aa) {
                        var aj, V, ag, ap, ao, ab, am, ak, ah, ae, ai, U, Y, W, al, af;
                        try {
                            aj = aq[Z]
                        } catch (ad) {
                        }
                        if (typeof aj == "object" && aj) {
                            V = q.call(aj);
                            if (V == K && !m.call(aj, "toJSON")) {
                                if (aj > -1 / 0 && aj < 1 / 0) {
                                    if (y) {
                                        ao = n(aj / 86400000);
                                        for (ag = n(ao / 365.2425) + 1970 - 1; y(ag + 1, 0) <= ao; ag++) {
                                        }
                                        for (ap = n((ao - y(ag, 0)) / 30.42); y(ag, ap + 1) <= ao; ap++) {
                                        }
                                        ao = 1 + ao - y(ag, ap);
                                        ab = (aj % 86400000 + 86400000) % 86400000;
                                        am = n(ab / 3600000) % 24;
                                        ak = n(ab / 60000) % 60;
                                        ah = n(ab / 1000) % 60;
                                        ae = ab % 1000
                                    } else {
                                        ag = aj.getUTCFullYear();
                                        ap = aj.getUTCMonth();
                                        ao = aj.getUTCDate();
                                        am = aj.getUTCHours();
                                        ak = aj.getUTCMinutes();
                                        ah = aj.getUTCSeconds();
                                        ae = aj.getUTCMilliseconds()
                                    }
                                    aj = (ag <= 0 || ag >= 10000 ? (ag < 0 ? "-" : "+") + o(6, ag < 0 ? -ag : ag) : o(4, ag)) + "-" + o(2, ap + 1) + "-" + o(2, ao) + "T" + o(2, am) + ":" + o(2, ak) + ":" + o(2, ah) + "." + o(3, ae) + "Z"
                                } else {
                                    aj = null
                                }
                            } else {
                                if (typeof aj.toJSON == "function" && ((V != H && V != I && V != z) || m.call(aj, "toJSON"))) {
                                    aj = aj.toJSON(Z)
                                }
                            }
                        }
                        if (X) {
                            aj = X.call(aq, Z, aj)
                        }
                        if (aj === null) {
                            return"null"
                        }
                        V = q.call(aj);
                        if (V == v) {
                            return"" + aj
                        } else {
                            if (V == H) {
                                return aj > -1 / 0 && aj < 1 / 0 ? "" + aj : "null"
                            } else {
                                if (V == I) {
                                    return x("" + aj)
                                }
                            }
                        }
                        if (typeof aj == "object") {
                            for (W = aa.length; W--;) {
                                if (aa[W] === aj) {
                                    throw TypeError()
                                }
                            }
                            aa.push(aj);
                            ai = [];
                            al = T;
                            T += an;
                            if (V == z) {
                                for (Y = 0, W = aj.length; Y < W; Y++) {
                                    U = k(Y, aj, X, ac, an, T, aa);
                                    ai.push(U === F ? "null" : U)
                                }
                                af = ai.length ? (an ? "[\n" + T + ai.join(",\n" + T) + "\n" + al + "]" : ("[" + ai.join(",") + "]")) : "[]"
                            } else {
                                h(ac || aj, function (at) {
                                    var ar = k(at, aj, X, ac, an, T, aa);
                                    if (ar !== F) {
                                        ai.push(x(at) + ":" + (an ? " " : "") + ar)
                                    }
                                });
                                af = ai.length ? (an ? "{\n" + T + ai.join(",\n" + T) + "\n" + al + "}" : ("{" + ai.join(",") + "}")) : "{}"
                            }
                            aa.pop();
                            return af
                        }
                    };
                    L.stringify = function (T, V, W) {
                        var U, ac, aa, Z;
                        if (typeof V == "function" || typeof V == "object" && V) {
                            if ((Z = q.call(V)) == N) {
                                ac = V
                            } else {
                                if (Z == z) {
                                    aa = {};
                                    for (var Y = 0, X = V.length, ab; Y < X; ab = V[Y++], ((Z = q.call(ab)), Z == I || Z == H) && (aa[ab] = 1)) {
                                    }
                                }
                            }
                        }
                        if (W) {
                            if ((Z = q.call(W)) == H) {
                                if ((W -= W % 1) > 0) {
                                    for (U = "", W > 10 && (W = 10); U.length < W; U += " ") {
                                    }
                                }
                            } else {
                                if (Z == I) {
                                    U = W.length <= 10 ? W : W.slice(0, 10)
                                }
                            }
                        }
                        return k("", (ab = {}, ab[""] = T, ab), ac, aa, U, "", [])
                    }
                }
                if (!j("json-parse")) {
                    var G = String.fromCharCode;
                    var i = {92: "\\", 34: '"', 47: "/", 98: "\b", 116: "\t", 110: "\n", 102: "\f", 114: "\r"};
                    var B, Q;
                    var C = function () {
                        B = Q = null;
                        throw SyntaxError()
                    };
                    var u = function () {
                        var Y = Q, W = Y.length, X, V, T, Z, U;
                        while (B < W) {
                            U = Y.charCodeAt(B);
                            switch (U) {
                                case 9:
                                case 10:
                                case 13:
                                case 32:
                                    B++;
                                    break;
                                case 123:
                                case 125:
                                case 91:
                                case 93:
                                case 58:
                                case 44:
                                    X = A ? Y.charAt(B) : Y[B];
                                    B++;
                                    return X;
                                case 34:
                                    for (X = "@", B++; B < W;) {
                                        U = Y.charCodeAt(B);
                                        if (U < 32) {
                                            C()
                                        } else {
                                            if (U == 92) {
                                                U = Y.charCodeAt(++B);
                                                switch (U) {
                                                    case 92:
                                                    case 34:
                                                    case 47:
                                                    case 98:
                                                    case 116:
                                                    case 110:
                                                    case 102:
                                                    case 114:
                                                        X += i[U];
                                                        B++;
                                                        break;
                                                    case 117:
                                                        V = ++B;
                                                        for (T = B + 4; B < T; B++) {
                                                            U = Y.charCodeAt(B);
                                                            if (!(U >= 48 && U <= 57 || U >= 97 && U <= 102 || U >= 65 && U <= 70)) {
                                                                C()
                                                            }
                                                        }
                                                        X += G("0x" + Y.slice(V, B));
                                                        break;
                                                    default:
                                                        C()
                                                }
                                            } else {
                                                if (U == 34) {
                                                    break
                                                }
                                                U = Y.charCodeAt(B);
                                                V = B;
                                                while (U >= 32 && U != 92 && U != 34) {
                                                    U = Y.charCodeAt(++B)
                                                }
                                                X += Y.slice(V, B)
                                            }
                                        }
                                    }
                                    if (Y.charCodeAt(B) == 34) {
                                        B++;
                                        return X
                                    }
                                    C();
                                default:
                                    V = B;
                                    if (U == 45) {
                                        Z = true;
                                        U = Y.charCodeAt(++B)
                                    }
                                    if (U >= 48 && U <= 57) {
                                        if (U == 48 && ((U = Y.charCodeAt(B + 1)), U >= 48 && U <= 57)) {
                                            C()
                                        }
                                        Z = false;
                                        for (; B < W && ((U = Y.charCodeAt(B)), U >= 48 && U <= 57); B++) {
                                        }
                                        if (Y.charCodeAt(B) == 46) {
                                            T = ++B;
                                            for (; T < W && ((U = Y.charCodeAt(T)), U >= 48 && U <= 57); T++) {
                                            }
                                            if (T == B) {
                                                C()
                                            }
                                            B = T
                                        }
                                        U = Y.charCodeAt(B);
                                        if (U == 101 || U == 69) {
                                            U = Y.charCodeAt(++B);
                                            if (U == 43 || U == 45) {
                                                B++
                                            }
                                            for (T = B; T < W && ((U = Y.charCodeAt(T)), U >= 48 && U <= 57); T++) {
                                            }
                                            if (T == B) {
                                                C()
                                            }
                                            B = T
                                        }
                                        return +Y.slice(V, B)
                                    }
                                    if (Z) {
                                        C()
                                    }
                                    if (Y.slice(B, B + 4) == "true") {
                                        B += 4;
                                        return true
                                    } else {
                                        if (Y.slice(B, B + 5) == "false") {
                                            B += 5;
                                            return false
                                        } else {
                                            if (Y.slice(B, B + 4) == "null") {
                                                B += 4;
                                                return null
                                            }
                                        }
                                    }
                                    C()
                            }
                        }
                        return"$"
                    };
                    var P = function (U) {
                        var T, V;
                        if (U == "$") {
                            C()
                        }
                        if (typeof U == "string") {
                            if ((A ? U.charAt(0) : U[0]) == "@") {
                                return U.slice(1)
                            }
                            if (U == "[") {
                                T = [];
                                for (; ; V || (V = true)) {
                                    U = u();
                                    if (U == "]") {
                                        break
                                    }
                                    if (V) {
                                        if (U == ",") {
                                            U = u();
                                            if (U == "]") {
                                                C()
                                            }
                                        } else {
                                            C()
                                        }
                                    }
                                    if (U == ",") {
                                        C()
                                    }
                                    T.push(P(U))
                                }
                                return T
                            } else {
                                if (U == "{") {
                                    T = {};
                                    for (; ; V || (V = true)) {
                                        U = u();
                                        if (U == "}") {
                                            break
                                        }
                                        if (V) {
                                            if (U == ",") {
                                                U = u();
                                                if (U == "}") {
                                                    C()
                                                }
                                            } else {
                                                C()
                                            }
                                        }
                                        if (U == "," || typeof U != "string" || (A ? U.charAt(0) : U[0]) != "@" || u() != ":") {
                                            C()
                                        }
                                        T[U.slice(1)] = P(u())
                                    }
                                    return T
                                }
                            }
                            C()
                        }
                        return U
                    };
                    var J = function (V, U, W) {
                        var T = s(V, U, W);
                        if (T === F) {
                            delete V[U]
                        } else {
                            V[U] = T
                        }
                    };
                    var s = function (W, V, X) {
                        var U = W[V], T;
                        if (typeof U == "object" && U) {
                            if (q.call(U) == z) {
                                for (T = U.length; T--;) {
                                    J(U, T, X)
                                }
                            } else {
                                h(U, function (Y) {
                                    J(U, Y, X)
                                })
                            }
                        }
                        return X.call(W, V, U)
                    };
                    L.parse = function (V, W) {
                        var T, U;
                        B = 0;
                        Q = "" + V;
                        T = P(u());
                        if (u() != "$") {
                            C()
                        }
                        B = Q = null;
                        return W && q.call(W) == N ? s((U = {}, U[""] = T, U), "", W) : T
                    }
                }
            }
            if (D) {
                d(function () {
                    return L
                })
            }
        }(this))
    }, {}], 42: [function (f, h, e) {
        h.exports = g;
        function g(l, j) {
            var m = [];
            j = j || 0;
            for (var k = j || 0; k < l.length; k++) {
                m[k - j] = l[k]
            }
            return m
        }
    }, {}]}, {}, [1])(1)
});

//--------------module:im.core-------------

var IM = (function (f) {
    var h = "http://rest.gotye.com.cn/api";
    var a = "http://webim.gotye.com.cn:9092";
    var s;
    var d;
    var b = new Base64();
    var o = false;
    var e = false;
    var m = null;
    var k = /^(.*)\.(jpg|jpeg|png|bmp)$/;
    var i = 1024 * 300;
    var n = 1000;
    var r = 1024 * 5;
    var c = 200;
    var p = null;
    var j = {};
    var q;
    var g = function () {
    };

    function l() {
    }

    g.prototype = {bind: function (t) {
        if (!t) {
            Tool.log("appkey is null")
        } else {
            s = t
        }
        j.connectEvents = new Array();
        j.disconnectEvents = new Array();
        j.beKillEvents = new Array();
        j.connectTimeoutEvents = new Array();
        j.connectErrorEvents = new Array();
        var v = j.messageEvents = {};
        v[IM_CONSTANT.CHAT_TYPE.USER] = new Array();
        v[IM_CONSTANT.CHAT_TYPE.GROUP] = new Array();
        v[IM_CONSTANT.CHAT_TYPE.ROOM] = new Array();
        var u = j.notify = {};
        u[IM_CONSTANT.NOTIFY.GROUP.LEAVE] = new Array();
        u[IM_CONSTANT.NOTIFY.GROUP.ENTER] = new Array();
        u[IM_CONSTANT.NOTIFY.GROUP.KICKOUT] = new Array();
        u[IM_CONSTANT.NOTIFY.GROUP.DISMISS] = new Array()
    }, setAppkey: function (t) {
        if (!t) {
            Tool.log("appkey is null");
            return
        }
        s = t
    }, _connectToServer: function (u) {
        if (e) {
            return
        }
        if (!q) {
            var t = this;
			$.ajax({
					  type: "get",
					  url: h + "/GetWebImUrl",
					  data: "appkey=" + s,
					 
					  cache : 'false'
					}).done(function(v){
						if (v.status == IM_STATUS.SUCCESS) {
								q = io.connect(v.serverPath);
								t._bindEvents();
								t.onConnect.call(this, u)
							}
						 
					}).fail(function(){
						 q = io.connect(a);
						t._bindEvents();
						t.onConnect.call(this, u)
					});
			/**
            Ajax.request(h + "/GetWebImUrl", {data: "appkey=" + s, method: "GET", success: function (v) {
                if (v.status == IM_STATUS.SUCCESS) {
                    q = io.connect(v.serverPath);
                    t._bindEvents();
                    t.onConnect.call(this, u)
                }
            }, failure: function () {
                q = io.connect(a);
                t._bindEvents();
                t.onConnect.call(this, u)
            }})
			**/
        } else {
            this.connect()
        }
    }, _bindEvents: function () {
        var v = j.messageEvents;
        var u = j.notify;
        var t = this;
        q.on("connect", function () {
            Tool.log("Fired upon a successful connection!");
            e = true;
            for (var w = 0, x; x = j.connectEvents[w++];) {
                x.call(f)
            }
            if (!!m) {
                Tool.log("auto relogin");
                t.login(m.account, m.pwd)
            }
        });
        q.on("disconnect", function () {
            Tool.log("Fired upon a disconnection");
            e = false;
            o = false;
            for (var w = 0, x; x = j.disconnectEvents[w++];) {
                x.call(f)
            }
        });
        q.on("beKill", function () {
            o = false;
            Tool.log("onForceLogout");
            for (var w = 0, x; x = j.beKillEvents[w++];) {
                x.call(f)
            }
            t.disconnect()
        });
        q.on("leaveGroup", function (x) {
            Tool.log("leaveGroup notify");
            x.eventType = IM_CONSTANT.NOTIFY.GROUP.LEAVE;
            for (var w = 0, y; y = u[IM_CONSTANT.NOTIFY.GROUP.LEAVE][w++];) {
                y.call(f, x)
            }
        });
        q.on("enterGroup", function (x) {
            Tool.log("enterGroup notify");
            x.eventType = IM_CONSTANT.NOTIFY.GROUP.ENTER;
            for (var w = 0, y; y = u[IM_CONSTANT.NOTIFY.GROUP.ENTER][w++];) {
                y.call(f, x)
            }
        });
        q.on("kickOutGroup", function (x) {
            Tool.log("kickOutGroup notify");
            x.eventType = IM_CONSTANT.NOTIFY.GROUP.KICKOUT;
            for (var w = 0, y; y = u[IM_CONSTANT.NOTIFY.GROUP.KICKOUT][w++];) {
                y.call(f, x)
            }
        });
        q.on("dismissGroup", function (x) {
            Tool.log("dismissGroup notify");
            x.eventType = IM_CONSTANT.NOTIFY.GROUP.DISMISS;
            for (var w = 0, y; y = u[IM_CONSTANT.NOTIFY.GROUP.DISMISS][w++];) {
                y.call(f, x)
            }
        });
        q.on("enterRoom", function (x) {
            Tool.log("enterRoom notify");
            x.eventType = IM_CONSTANT.NOTIFY.ROOM.ENTER;
            for (var w = 0, y; y = u[IM_CONSTANT.NOTIFY.ROOM.ENTER][w++];) {
                y.call(f, x)
            }
        });
        q.on("leaveRoom", function (x) {
            Tool.log("leaveRoom notify");
            x.eventType = IM_CONSTANT.NOTIFY.ROOM.LEAVE;
            for (var w = 0, y; y = u[IM_CONSTANT.NOTIFY.ROOM.LEAVE][w++];) {
                y.call(f, x)
            }
        });
        q.on("message", function (x) {
            Tool.log("receiver msg");
            if (IM_CONSTANT.MSG_TYPE.TEXT === x.msgType || IM_CONSTANT.MSG_TYPE.USER_DEFINED === x.msgType) {
                x.content = b.decode(x.content || "");
                x.extraData = b.decode(x.extraData || "")
            } else {
                if (IM_CONSTANT.MSG_TYPE.SMALL_IMG === x.msgType) {
                    x.thumb = "data:image/jpeg;base64," + x.text || ""
                } else {
                    if (IM_CONSTANT.MSG_TYPE.IMG === x.msgType) {
                        if (x.url.indexOf("/") === 0) {
                            x.url = h + x.url
                        } else {
                            if (x.url.indexOf("GetFile") === 0) {
                                x.url = h + "/" + x.url
                            }
                        }
                        x.thumb = "data:image/jpeg;base64," + x.thumb
                    } else {
                        if (IM_CONSTANT.MSG_TYPE.VOICE === x.msgType) {
                            x.url = h + b.decode(x.url) + "&t=mp3&appkey=" + s
                        }
                    }
                }
            }
            if (x.text) {
                delete x.text
            }
            for (var w = 0, y; y = v[x.chatType][w++];) {
                y.call(f, x)
            }
        });
        q.on("connect_timeout", function () {
            Tool.log("Fired upon a connection timeout!");
            for (var w = 0, x; x = j.connectTimeoutEvents[w++];) {
                x.call(f)
            }
        });
        q.on("connect_error", function () {
            Tool.log("Fired upon a connection error!");
            for (var w = 0, x; x = j.connectErrorEvents[w++];) {
                x.call(f)
            }
        })
    }, sendAny: function (v, u, t) {
        if (!Tool.isObj(v)) {
            v = {receiverId: arguments[0], content: arguments[1]};
            u = arguments[2];
            t = arguments[3]
        }
        v.msgType = IM_CONSTANT.MSG_TYPE.USER_DEFINED;
        this.send(v, u, t)
    }, sendNotify: function (v, u, t) {
        v.msgType = IM_CONSTANT.MSG_TYPE.NOTIFY;
        this.send(v, u, t)
    }, sendText: function (v, u, t) {
        if (!Tool.isObj(v)) {
            v = {receiverId: arguments[0], content: arguments[1]};
            u = arguments[2];
            t = arguments[3]
        }
        v.msgType = IM_CONSTANT.MSG_TYPE.TEXT;
        this.send(v, u, t)
    }, sendImg: function (v, u, z) {
        var y = v.chatType;
        var w = v.fileId;
        if (y != 0 && y != 1 && y != 2) {
            Tool.log("invaild chatType");
            return
        }
        if (!v.receiverId) {
            Tool.log("receiverId is null");
            return
        }
        u = u || l;
        z = z || l;
        if (!window.FileReader) {
            z.call(f, IM_STATUS.MSG.BROWER_NOT_SUPPORT);
            return
        }
        var t = document.getElementById(w);
        var x = t.files[0];
        var A = new FileReader();
        var B = this;
        A.onloadend = function (F) {
            var D = new Image();
            D.src = F.target.result;
            var E = {type: 1};
            var C = "";
            if (F.total > i) {
                D.src = Tool.compress(D, n, 0.2 + i / F.total)
            }
            C = D.src;
            if (F.total < r) {
                C = D.src
            } else {
                C = Tool.compress(D, c, 0.2 + r / F.total)
            }
            E.file = D.src.substr(D.src.indexOf("base64,") + 7);
            Ajax.request(h + "/UploadFile", {data: E, header: {UKEY: d}, success: function (G) {
                if (G.status == IM_STATUS.SUCCESS) {
                    v.url = G.url;
                    v.thumb = C.substr(C.indexOf("base64,") + 7);
                    v.msgType = IM_CONSTANT.MSG_TYPE.IMG;
                    v.content = "";
                    B.send(v, function (H) {
                        u.call(f, v.url, C)
                    }, z)
                } else {
                    z.call(f, G.status)
                }
            }})
        };
        A.readAsDataURL(x)
    }, send: function (w, u, t) {
        if (!o) {
            Tool.log("No login");
            return
        }
        w.chatType = w.chatType || IM_CONSTANT.CHAT_TYPE.USER;
        if (!w.receiverId) {
            Tool.log("receiverId is null");
            return
        }
        var v = this;
        if (p == null || p == "") {
            this._getKeyword(function () {
                v._sendMsgDealKeyWords(w, u, t)
            })
        } else {
            v._sendMsgDealKeyWords(w, u, t)
        }
    }, _sendMsgDealKeyWords: function (z, y, v) {
        var u = z.content;
        if (p != null && p.length > 0) {
            var t = p.length;
            for (var w = 0; w < t; w++) {
                var x = new RegExp(p[w], "gi");
                u = u.replace(x, "**")
            }
        }
        z.content = u;
        z.receiverId = b.encode(z.receiverId);
        z.msgType = z.msgType || IM_CONSTANT.MSG_TYPE.TEXT;
        if (!z.content && z.msgType != IM_CONSTANT.MSG_TYPE.IMG) {
            Tool.log("content is null");
            return
        }
        z.content = b.encode(z.content);
        z.extraData = b.encode(z.extraData || "");
        y = y || l;
        v = v || l;
        q.emit("message", z, function (A) {
            if (IM_STATUS.SUCCESS == A) {
                y.call(f, A)
            } else {
                v.call(f, A)
            }
        })
    }, _getKeyword: function (t) {
        Ajax.request(h + "/GetKeyword", {method: "POST", header: {UKEY: d}, success: function (v) {
            if (v.status == IM_STATUS.SUCCESS) {
                var u = v.keyword;
                if (u != null && u.length > 0) {
                    p = u.split(",")
                }
            }
            t.call()
        }})
    }, onMsg: function (v, w) {
        if (arguments.length == 1 && Tool.isFun(arguments[0])) {
            if (!arguments[0]) {
                return
            }
            j.messageEvents[IM_CONSTANT.CHAT_TYPE.USER].push(arguments[0])
        } else {
            if (arguments.length == 2) {
                if (!w) {
                    return
                }
                if (Tool.isArray(v)) {
                    for (var u in v) {
                        var t = v[u];
                        if (!!j.messageEvents[t]) {
                            j.messageEvents[t].push(w)
                        }
                    }
                } else {
                    if (!!j.messageEvents[t]) {
                        j.messageEvents[t].push(w)
                    }
                }
            }
        }
    }, onNotify: function (t, u) {
        if (t == null || !j.notify[t]) {
            Tool.log("invail notifyType");
            return
        }
        j.notify[t].push(u)
    }, enterRoom: function (w, v, u, t) {
        if (!o) {
            Tool.log("NO logined");
            return
        }
        if (!s) {
            Tool.log("no bind appkey ");
            return
        }
        if (!w) {
            Tool.log("account is null");
            return
        }
        u = u || l;
        t = t || l;
        var x = {userAccount: w, roomId: v, appKey: s};
        q.emit("enterRoom", x, function (y) {
            Tool.log("request enter imRoom status:" + y);
            if (IM_STATUS.SUCCESS == y) {
                u.call(f, y)
            } else {
                t.call(f, y)
            }
        })
    }, leaveRoom: function (w, v, u, t) {
        if (!o) {
            Tool.log("NO logined");
            return
        }
        if (!s) {
            Tool.log("no bind appkey ");
            return
        }
        if (!w) {
            Tool.log("account is null");
            return
        }
        var x = {userAccount: w, roomId: v, appKey: s};
        u = u || l;
        t = t || l;
        q.emit("leaveRoom", x, function (y) {
            if (IM_STATUS.SUCCESS == y) {
                u.call(f, y)
            } else {
                t.call(f, y)
            }
        })
    }, getRoomUsers: function (x, v, w, u, t) {
        if (!o) {
            Tool.log("NO logined");
            return
        }
        if (!s) {
            Tool.log("no bind appkey ");
            return
        }
        if (!x) {
            Tool.log("account is null");
            return
        }
        if (w == null || w == undefined) {
            w = 0
        }
        var y = {userAccount: x, roomId: v, page: w, appKey: s};
        u = u || l;
        t = t || l;
        q.emit("getRoomUserList", y, function (z, A) {
            Tool.log("getRoomUserList resp code :" + z);
            if (IM_STATUS.SUCCESS == z) {
                u.call(f, A)
            } else {
                t.call(f, z)
            }
        })
    }, login: function (v, w, u, t) {
        if (o) {
            Tool.log("has logined");
            return
        }
        if (!s) {
            Tool.log("no bind appkey ");
            return
        }
        if (!v) {
            Tool.log("account is null");
            return
        }
        this._connectToServer(function () {
            var x = {appkey: s, account: b.encode(v), pwd: w};
            q.emit("login", x, function (z, A) {
                Tool.log("login resp status:" + z);
                if ((IM_STATUS.SUCCESS == z || IM_STATUS.LOGIN.RE_LOGIN_ERROR == z)) {
                    o = true;
                    d = A.key;
                    var y = (A.apiURL || "").replace(/ +/g, "");
                    if (!!y && y.indexOf("AppPortlet") == -1) {
                        h = y
                    }
                    m = {account: v, pwd: w};
                    if (u) {
                        u.call(f, z)
                    }
                } else {
                    if (t) {
                        t.call(f, z)
                    }
                }
            })
        })
    }, logout: function (u, t) {
        if (!o) {
            return
        }
        u = u || l;
        t = t || l;
        var v = this;
        q.emit("logout", function (w) {
            o = false;
            m = null;
            if (IM_STATUS.SUCCESS == w) {
                u.call(f, w)
            } else {
                t.call(f, w)
            }
            v.disconnect()
        })
    }, isLogined: function () {
        return o
    }, connect: function () {
        q.connect()
    }, disconnect: function () {
        q.disconnect()
    }, onForceLogout: function (t) {
        if (!t) {
            return
        }
        j.beKillEvents.push(t)
    }, onConnect: function (t) {
        if (!t) {
            return
        }
        j.connectEvents.push(t)
    }, onConnectError: function (t) {
        if (!t) {
            return
        }
        j.connectErrorEvents.push(t)
    }, onConnectTimeout: function (t) {
        if (!t) {
            return
        }
        j.connectTimeoutEvents.push(t)
    }, onDisconnect: function (t) {
        if (!t) {
            return
        }
        j.disconnectEvents.push(t)
    }};
    g.prototype.res = {getOfflineMsgs: function (v, u, t) {
        if (!o) {
            Tool.log("No login");
            t.call(f, IM_STATUS.NO_LOGIN);
            return
        }
        if (!Tool.isObj(v)) {
            v = {targetId: arguments[0], count: arguments[1]};
            u = arguments[2];
            t = arguments[3]
        }
        u = u || l;
        t = t || l;
        if (!v.targetId || !v.count) {
            Tool.log("param is null");
            t.call(f, IM_STATUS.PARAM_IS_NULL);
            return
        }
        v.version = "1.0";
        v.isAppReq = 0;
        v.chatType = v.chatType || IM_CONSTANT.CHAT_TYPE.USER;
        Ajax.request(h + "/GetOfflineMsgs", {data: v, header: {UKEY: d}, success: function (z) {
            if (z.status == IM_STATUS.SUCCESS) {
                var x = [];
                for (var y = z.msgList.length - 1; y >= 0; y--) {
                    var A = z.msgList[y];

                    if (A.extraData == undefined) {

                        A.extraData = "";
                    }

                    var w = {senderAccount: A.sendAccount, sendAccount: A.sendAccount, msgType: A.msgType, sendTimeMs: A.sendDate, sendTime: A.sendDate / 1000, content: b.decode(A.msgContent), extraData: b.decode(A.extraData), receiverType: A.receiverType, receiverId: A.receiverId}

                        ;
                    x.push(w)
                }
                u.call(f, x)
            } else {
                t.call(f, z.status)
            }
        }})
    }, getMsgs: function (v, u, t) {
        if (!Tool.isObj(v)) {
            v = {senderAccount: m.account, endTime: arguments[1], receiverType: IM_CONSTANT.CHAT_TYPE.USER, receiverId: arguments[0], index: arguments[2], count: arguments[3]};
            u = arguments[4];
            t = arguments[5]
        }
        u = u || l;
        t = t || l;
        if (!o) {
            Tool.log("No login");
            t.call(f, IM_STATUS.NO_LOGIN);
            return
        }
        v.version = "1.0";
        v.isAppReq = 0;
        Ajax.request(h + "/GetMsgs", {data: v, header: {UKEY: d}, success: function (A) {
            if (A.status == IM_STATUS.SUCCESS) {
                var y = [];
                var x = Tool.toHttp(h);
                for (var z = A.entities.length - 1; z >= 0; z--) {
                    var B = A.entities[z];
                    var w = {senderAccount: B.senderAccount, sendAccount: B.senderAccount, msgType: B.msgType, sendTimeMs: B.sendTime, sendTime: B.sendTime / 1000, content: b.decode(B.msgContent), extraData: b.decode(B.extraData), receiverType: B.receiverType, receiverId: B.receiverId};
                    if (B.msgType == IM_CONSTANT.MSG_TYPE.IMG) {
                        w.content = x + w.content
                    } else {
                        if (B.msgType == IM_CONSTANT.MSG_TYPE.VOICE) {
                            w.content = x + w.content + "&t=mp3&appkey=" + s;
                            Tool.log(B.msgContent);
                            Tool.log(b.decode(B.msgContent))
                        }
                    }
                    y.push(w)
                }
                if (u) {
                    u.call(f, y)
                }
            } else {
                if (t) {
                    t.call(f, A.status)
                }
            }
        }})
    }, getContacts: function (u, t) {
        return this.getChatSessions(function (y) {
            var w = new Array();
            for (var v = 0, x; x = y[v++];) {
                if (x.chatType == IM_CONSTANT.CHAT_TYPE.USER) {
                    w.push(x)
                }
            }
            u.call(f, w)
        }, t)
    }, getChatSessions: function (v, u, t) {
        if (arguments.length <= 2 && !Tool.isObj(v)) {
            u = arguments[0];
            t = arguments[1]
        }
        u = u || l;
        t = t || l;
        if (!o) {
            Tool.log("No login");
            t.call(f, IM_STATUS.NO_LOGIN);
            return
        }
        v.isAppReq = 0;
        Ajax.request(h + "/GetChatSessions", {data: v, header: {UKEY: d}, success: function (x) {
            if (x.status == IM_STATUS.SUCCESS) {
                if (u) {
                    for (var w = 0, y; y = x.entities[w++];) {
                        if (y.chatType == IM_CONSTANT.CHAT_TYPE.USER) {
                            y.account = y.targetId
                        } else {
                            if (y.chatType == IM_CONSTANT.CHAT_TYPE.GROUP) {
                                y.groupId = y.targetId
                            } else {
                                if (y.chatType == IM_CONSTANT.CHAT_TYPE.ROOM) {
                                    y.roomId = y.targetId
                                }
                            }
                        }
                    }
                    u.call(f, x.entities)
                }
            } else {
                if (t) {
                    t.call(f, x.status)
                }
            }
        }})
    }, delContacts: function (v, w, t) {
        if (!v) {
            Tool.log("param is null");
            t.call(f, IM_STATUS.PARAM_IS_NULL);
            return
        }
        var x = new Array();
        if (Tool.isArray(v)) {
            for (var u in v) {
                x.push({targetId: v[u], chatType: IM_CONSTANT.CHAT_TYPE.USER})
            }
        } else {
            x.push({targetId: v, chatType: IM_CONSTANT.CHAT_TYPE.USER})
        }
        return this.delChatSessions(v, w, t)
    }, delChatSessions: function (w, u, t) {
        u = u || l;
        t = t || l;
        if (!o) {
            Tool.log("No login");
            t.call(f, IM_STATUS.NO_LOGIN);
            return
        }
        if (!w) {
            Tool.log("param is null");
            t.call(f, IM_STATUS.PARAM_IS_NULL);
            return
        }
        var v = {chatSessions: w, isAppReq: 0};
        Ajax.request(h + "/DelChatSessions", {data: v, header: {UKEY: d}, success: function (x) {
            if (x.status == IM_STATUS.SUCCESS) {
                if (u) {
                    u.call(f)
                }
            } else {
                if (t) {
                    t.call(f, x.status)
                }
            }
        }})
    }, getGroups: function (u, t) {
        u = u || l;
        t = t || l;
        if (!o) {
            Tool.log("No login");
            t.call(f, IM_STATUS.NO_LOGIN);
            return
        }
        var v = {isAppReq: 0};
        Ajax.request(h + "/GetGroups", {data: v, header: {UKEY: d}, success: function (y) {
            if (y.status == IM_STATUS.SUCCESS) {
                var w = Tool.toHttp(h);
                for (var x = 0, z; z = y.entities[x++];) {
                    if (!!z.groupHead) {
                        z.groupHead = w + "/" + z.groupHead
                    }
                }
                u.call(f, y.entities)
            } else {
                t.call(f, y.status)
            }
        }})
    }, searchGroups: function (v, u, t) {
        u = u || l;
        t = t || l;
        if (!o) {
            Tool.log("No login");
            t.call(f, IM_STATUS.NO_LOGIN);
            return
        }
        v.isAppReq = 0;
        Ajax.request(h + "/SearchGroup", {data: v, header: {UKEY: d}, success: function (y) {
            if (y.status == IM_STATUS.SUCCESS) {
                var w = Tool.toHttp(h);
                for (var x = 0, z; z = y.entities[x++];) {
                    z.groupHead = w + "/" + z.groupHead
                }
                u.call(f, y.entities)
            } else {
                t.call(f, y.status)
            }
        }})
    }, getGroup: function (u, v, t) {
        v = v || l;
        t = t || l;
        if (!o) {
            Tool.log("No login");
            t.call(f, IM_STATUS.NO_LOGIN);
            return
        }
        var w = {groupId: u};
        w.isAppReq = 0;
        Ajax.request(h + "/GetGroup", {data: w, header: {UKEY: d}, success: function (x) {
            if (x.status == IM_STATUS.SUCCESS) {
                v.call(f, x.entity)
            } else {
                t.call(f, x.status)
            }
        }})
    }, getGroupMembers: function (u, v, t) {
        v = v || l;
        t = t || l;
        if (!o) {
            Tool.log("No login");
            t.call(f, IM_STATUS.NO_LOGIN);
            return
        }
        var w = {groupId: u};
        w.isAppReq = 0;
        Ajax.request(h + "/GetGroup", {data: w, header: {UKEY: d}, success: function (x) {
            if (x.status == IM_STATUS.SUCCESS) {
                v.call(f, x.entities)
            } else {
                t.call(f, x.status)
            }
        }})
    }, enterGroup: function (u, v, t) {
        v = v || l;
        t = t || l;
        if (!o) {
            Tool.log("No login");
            t.call(f, IM_STATUS.NO_LOGIN);
            return
        }
        var w = {groupId: u};
        w.isAppReq = 0;
        Ajax.request(h + "/EnterGroup", {data: w, header: {UKEY: d}, success: function (x) {
            if (x.status == IM_STATUS.SUCCESS) {
                v.call(f, x.affectedRows)
            } else {
                t.call(f, x.status)
            }
        }})
    }, leaveGroup: function (u, v, t) {
        v = v || l;
        t = t || l;
        if (!o) {
            Tool.log("No login");
            t.call(f, IM_STATUS.NO_LOGIN);
            return
        }
        var w = {groupId: u};
        w.isAppReq = 0;
        Ajax.request(h + "/LeaveGroup", {data: w, header: {UKEY: d}, success: function (x) {
            if (x.status == IM_STATUS.SUCCESS) {
                v.call(f, x.affectedRows)
            } else {
                t.call(f, x.status)
            }
        }})
    }, dismissGroup: function (u, v, t) {
        v = v || l;
        t = t || l;
        if (!o) {
            Tool.log("No login");
            t.call(f, IM_STATUS.NO_LOGIN);
            return
        }
        var w = {groupId: u};
        w.isAppReq = 0;
        Ajax.request(h + "/DismissGroup", {data: w, header: {UKEY: d}, success: function (x) {
            if (x.status == IM_STATUS.SUCCESS) {
                v.call(f, x.affectedRows)
            } else {
                t.call(f, x.status)
            }
        }})
    }, addGroupMember: function (v, u, w, t) {
        w = w || l;
        t = t || l;
        if (!o) {
            Tool.log("No login");
            t.call(f, IM_STATUS.NO_LOGIN);
            return
        }
        var x = {groupId: v, userAccount: u};
        x.isAppReq = 0;
        Ajax.request(h + "/AddGroupMember", {data: x, header: {UKEY: d}, success: function (y) {
            if (y.status == IM_STATUS.SUCCESS) {
                w.call(f, y.affectedRows)
            } else {
                t.call(f, y.status)
            }
        }})
    }, delGroupMember: function (v, u, w, t) {
        w = w || l;
        t = t || l;
        if (!o) {
            Tool.log("No login");
            t.call(f, IM_STATUS.NO_LOGIN);
            return
        }
        var x = {groupId: v, userAccount: u};
        x.isAppReq = 0;
        Ajax.request(h + "/DelGroupMember", {data: x, header: {UKEY: d}, success: function (y) {
            if (y.status == IM_STATUS.SUCCESS) {
                w.call(f, y.affectedRows)
            } else {
                t.call(f, y.status)
            }
        }})
    }, createGroup: function (v, u, t) {
        u = u || l;
        t = t || l;
        if (!o) {
            Tool.log("No login");
            t.call(f, IM_STATUS.NO_LOGIN);
            return
        }
        v.isAppReq = 0;
        Ajax.request(h + "/CreateGroup", {data: v, header: {UKEY: d}, success: function (w) {
            if (w.status == IM_STATUS.SUCCESS) {
                u.call(f, w.entity)
            } else {
                t.call(f, w.status)
            }
        }})
    }, getFriends: function (u, t) {
        u = u || l;
        t = t || l;
        if (!o) {
            Tool.log("No login");
            t.call(f, IM_STATUS.NO_LOGIN);
            return
        }
        var v = {};
        v.isAppReq = 0;
        Ajax.request(h + "/GetFriends", {data: v, header: {UKEY: d}, success: function (w) {
            if (w.status == IM_STATUS.SUCCESS) {
                u.call(f, w.entities)
            } else {
                t.call(f, w.status)
            }
        }})
    }, getBlacklists: function (u, t) {
        u = u || l;
        t = t || l;
        if (!o) {
            Tool.log("No login");
            t.call(f, IM_STATUS.NO_LOGIN);
            return
        }
        var v = {};
        v.isAppReq = 0;
        Ajax.request(h + "/GetBlacklists", {data: v, header: {UKEY: d}, success: function (w) {
            if (w.status == IM_STATUS.SUCCESS) {
                u.call(f, w.entities)
            } else {
                t.call(f, w.status)
            }
        }})
    }, createRoom: function (w, u, t) {
        if (!o) {
            Tool.log("No login");
            t.call(f, IM_STATUS.NO_LOGIN);
            return
        }
        u = u || l;
        t = t || l;
        var v = {roomName: w.roomName, head: w.head, roomType: w.roomType, scope: w.scope, maxUserNumber: w.maxUserNumber, appkey: s};
        Ajax.request(h + "/CreateIMRoom", {data: v, header: {UKEY: d}, success: function (x) {
            if (x.status == IM_STATUS.SUCCESS) {
                u.call(f, x.entity)
            } else {
                t.call(f, x.status)
            }
        }})
    }, getRooms: function (u, t) {
        if (!o) {
            Tool.log("No login");
            t.call(f, IM_STATUS.NO_LOGIN);
            return
        }
        u = u || l;
        t = t || l;
        var v = {};
        Ajax.request(h + "/GetIMRooms", {data: v, header: {UKEY: d}, success: function (w) {
            if (w.status == IM_STATUS.SUCCESS) {
                u.call(f, w.roomList)
            } else {
                t.call(f, w.status)
            }
        }})
    }, getRoom: function (w, u, t) {
        if (!o) {
            Tool.log("No login");
            t.call(f, IM_STATUS.NO_LOGIN);
            return
        }
        u = u || l;
        t = t || l;
        var v = {};
        v.roomId = w.roomId;
        Ajax.request(h + "/GetIMRoom", {data: v, header: {UKEY: d}, success: function (x) {
            if (x.status == IM_STATUS.SUCCESS) {
                u.call(f, x.entity)
            } else {
                t.call(f, x.status)
            }
        }})
    }, delRoom: function (w, u, t) {
        if (!o) {
            Tool.log("No login");
            t.call(f, IM_STATUS.NO_LOGIN);
            return
        }
        u = u || l;
        t = t || l;
        var v = {};
        v.roomId = w.roomId;
        v.appkey = s;
        Ajax.request(h + "/DelIMRoom", {data: v, header: {UKEY: d}, success: function (x) {
            if (x.status == IM_STATUS.SUCCESS) {
                u.call(f, x.affectedRows)
            } else {
                t.call(f, x.status)
            }
        }})
    }, modifyRoom: function (w, u, t) {
        if (!o) {
            Tool.log("No login");
            t.call(f, IM_STATUS.NO_LOGIN);
            return
        }
        u = u || l;
        t = t || l;
        var v = {};
        v.roomId = w.roomId;
        v.roomName = w.roomName;
        v.roomType = w.roomType;
        v.scope = w.scope;
        v.maxUserNumber = w.maxUserNumber;
        v.appkey = s;
        Ajax.request(h + "/ModifyIMRoom", {data: v, header: {UKEY: d}, success: function (x) {
            if (x.status == IM_STATUS.SUCCESS) {
                u.call(thisObject, status)
            } else {
                t.call(thisObject, status)
            }
        }})
    }, searchUsers: function (v, u, t) {
        u = u || l;
        t = t || l;
        if (!o) {
            Tool.log("No login");
            t.call(f, IM_STATUS.NO_LOGIN);
            return
        }
        v.isAppReq = 0;
        Ajax.request(h + "/SearchUser", {data: v, header: {UKEY: d}, success: function (w) {
            if (w.status == IM_STATUS.SUCCESS) {
                u.call(f, w.userList)
            } else {
                t.call(f, w.status)
            }
        }})
    }, addFriend: function (u, v, t) {
        v = v || l;
        t = t || l;
        if (!o) {
            Tool.log("No login");
            t.call(f, IM_STATUS.NO_LOGIN);
            return
        }
        var w = {friendAccount: u};
        w.isAppReq = 0;
        Ajax.request(h + "/AddFriend", {data: w, header: {UKEY: d}, success: function (x) {
            if (x.status == IM_STATUS.SUCCESS) {
                v.call(f, x.affectedRows)
            } else {
                t.call(f, x.status)
            }
        }})
    }, addBlacklist: function (u, v, t) {
        v = v || l;
        t = t || l;
        if (!o) {
            Tool.log("No login");
            t.call(f, IM_STATUS.NO_LOGIN);
            return
        }
        var w = {friendAccount: u};
        w.isAppReq = 0;
        Ajax.request(h + "/AddBlacklist", {data: w, header: {UKEY: d}, success: function (x) {
            if (x.status == IM_STATUS.SUCCESS) {
                v.call(f, x.affectedRows)
            } else {
                t.call(f, x.status)
            }
        }})
    }, getUsers: function (v, u, t) {
        u = u || l;
        t = t || l;
        if (!o) {
            Tool.log("No login");
            t.call(f, IM_STATUS.NO_LOGIN);
            return
        }
        if (v == null || v.size == 0) {
            t.call(f, IM_STATUS.PARAM_IS_NULL);
            return
        }
        var w = {accounts: v};
        w.isAppReq = 0;
        Ajax.request(h + "/GetUsers", {data: w, header: {UKEY: d}, success: function (z) {
            if (z.status == IM_STATUS.SUCCESS) {
                var x = Tool.toHttp(h);
                for (var y = 0, A; A = z.entities[y++];) {
                    if (!!A.headId) {
                        A.head = x + "/GetRes?ResID=" + A.headId + "&appkey=" + s
                    }
                }
                u.call(f, z.entities)
            } else {
                t.call(f, z.status)
            }
        }})
    }};
    return new g()
})(window);
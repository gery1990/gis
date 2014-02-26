EzServerClient.Util = {};
EzServerClient.Util.getElement = function() {
    var d = [];
    for (var c = 0, a = arguments.length; c < a; c++) {
        var b = arguments[c];
        if (typeof b == "string") {
            b = document.getElementById(b)
        }
        if (arguments.length == 1) {
            return b
        }
        d.push(b)
    }
    return d
};
EzServerClient.Util.isElement = function(a) {
    return !!(a && a.nodeType === 1)
};
if (typeof window.$ === "undefined") {
    window.$ = EzServerClient.Util.getElement
}
EzServerClient.Util.extend = function(a, e) {
    a = a || {};
    if (e) {
        for (var d in e) {
            var c = e[d];
            if (c !== undefined) {
                a[d] = c
            }
        }
        var b = typeof window.Event == "function" && e instanceof window.Event;
        if (!b && e.hasOwnProperty && e.hasOwnProperty("toString")) {
            a.toString = e.toString
        }
    }
    return a
};
EzServerClient.Util.removeItem = function(c, b) {
    for (var a = c.length - 1; a >= 0; a--) {
        if (c[a] == b) {
            c.splice(a, 1)
        }
    }
    return c
};
EzServerClient.Util.clearArray = function(a) {
    EzServerClient.Console.warn(EzServerClient.i18n("methodDeprecated", {newMethod: "array = []"}));
    a.length = 0
};
EzServerClient.Util.indexOf = function(d, c) {
    if (typeof d.indexOf == "function") {
        return d.indexOf(c)
    } else {
        for (var b = 0, a = d.length; b < a; b++) {
            if (d[b] == c) {
                return b
            }
        }
        return -1
    }
};
EzServerClient.Util.getParameters = function(b) {
    b = b || window.location.href;
    var a = "";
    if (EzServerClient.String.contains(b, "?")) {
        var c = b.indexOf("?") + 1;
        var e = EzServerClient.String.contains(b, "#") ? b.indexOf("#") : b.length;
        a = b.substring(c, e)
    }
    var l = {};
    var d = a.split(/[&;]/);
    for (var g = 0, h = d.length; g < h; ++g) {
        var f = d[g].split("=");
        if (f[0]) {
            var k = decodeURIComponent(f[0]);
            var j = f[1] || "";
            j = decodeURIComponent(j.replace(/\+/g, " ")).split(",");
            if (j.length == 1) {
                j = j[0]
            }
            l[k] = j
        }
    }
    return l
};
EzServerClient.Util.Try = function() {
    var d = null;
    for (var c = 0, a = arguments.length; c < a; c++) {
        var b = arguments[c];
        try {
            d = b();
            break
        } catch (f) {
        }
    }
    return d
};
EzServerClient.Util.getNodes = function(c, b) {
    var a = EzServerClient.Util.Try(function() {
        return EzServerClient.Util._getNodes(c.documentElement.childNodes, b)
    }, function() {
        return EzServerClient.Util._getNodes(c.childNodes, b)
    });
    return a
};
EzServerClient.Util._getNodes = function(c, e) {
    var b = [];
    for (var d = 0, a = c.length; d < a; d++) {
        if (c[d].nodeName == e) {
            b.push(c[d])
        }
    }
    return b
};
EzServerClient.Util.getTagText = function(c, d, b) {
    var a = EzServerClient.Util.getNodes(c, d);
    if (a && (a.length > 0)) {
        if (!b) {
            b = 0
        }
        if (a[b].childNodes.length > 1) {
            return a.childNodes[1].nodeValue
        } else {
            if (a[b].childNodes.length == 1) {
                return a[b].firstChild.nodeValue
            }
        }
    } else {
        return ""
    }
};
EzServerClient.Util.getXmlNodeValue = function(a) {
    var b = null;
    EzServerClient.Util.Try(function() {
        b = a.text;
        if (!b) {
            b = a.textContent
        }
        if (!b) {
            b = a.firstChild.nodeValue
        }
    }, function() {
        b = a.textContent
    });
    return b
};
EzServerClient.Util.detectBrowser = function() {
    var a = navigator.userAgent.toLowerCase();
    if (a.indexOf("msie") >= 0) {
        return "IE"
    } else {
        if (a.indexOf("firefox") >= 0) {
            return "FF"
        } else {
            if (a.indexOf("opera") >= 0) {
                return "OPERA"
            } else {
                if (a.indexOf("chrome") >= 0) {
                    return "CHROME"
                } else {
                    if (a.indexOf("safari") >= 0) {
                        return "SAFARI"
                    } else {
                        return "FF"
                    }
                }
            }
        }
    }
};
EzServerClient.Util.detectBrowser.isIE6 = function() {
    if (EzServerClient.Util.detectBrowser() === "IE") {
        var b = navigator.appVersion.split("MSIE");
        var a = parseFloat(b[1]);
        if ((a >= 5.5 && a < 7) && (document.body.filters)) {
            return true
        }
    }
    return false
};
var fetchedImage = [];
EzServerClient.Util.fetchImage = function(c, e) {
    var b = new Image;
    for (var d = 0, a = fetchedImage.length; d < a; ++d) {
        if (fetchedImage[d].url === c) {
            e(fetchedImage[d].width, fetchedImage[d].height, c);
            return
        }
    }
    b.onload = function() {
        fetchedImage.push({url: c,width: b.width,height: b.height});
        e(b.width, b.height, c)
    };
    b.onerror = function() {
        fetchedImage.push({url: c,width: b.width,height: b.height});
        e(0, 0, c)
    };
    b.src = c + "?" + new Date().getTime();
    return
};
EzServerClient.Util.getCssSpriteImage = function(d, c, b, a) {
    if (!b) {
        b = document.createElement("img");
        b.style.cssText = "position:absolute";
        if (!a) {
            b.style.cssText = "position:absolute;-moz-user-select:none;-khtml-user-select:none;";
            b.unselectable = "on";
            b.onselectstart = function() {
                return false
            };
            b.dragstart = function(e) {
                EzServerClient.Util.stopEvent(e);
                return false
            }
        }
        if (EzServerClient.Util.detectBrowser.isIE6() && d.toLowerCase().indexOf(".png") != -1) {
            b.className = "csssprite";
            b.src = EzServerClient.GlobeParams.EzServerClientURL + "/images/transparent.gif";
            EzServerClient.Util.fetchImage(d, function(f, e) {
                b.width = f;
                b.height = e;
                b.style.filter = 'progid:DXImageTransform.Microsoft.AlphaImageLoader(enabled=true, sizingMethod=scale, src="' + d + '")'
            })
        } else {
            b.src = d
        }
    }
    b.style.left = -c[0] + "px";
    b.style.top = -c[1] + "px";
    return b
};
EzServerClient.Util.setCssSprite = function(g, e, b, d) {
    if (EzServerClient.Util.detectBrowser.isIE6()) {
        g.style.background = "";
        g.style.overflow = "hidden";
        var h = g.getElementsByTagName("img");
        var c = null;
        for (var f = 0, a = h.length; f < a; ++f) {
            if (h[f].className == "csssprite") {
                c = h[f];
                break
            }
        }
        c = EzServerClient.Util.getCssSpriteImage(e, b, c, d);
        if (!c.parentNode) {
            g.insertBefore(c, g.firstChild)
        }
    } else {
        e && (g.style.backgroundImage = "url(" + e + ")");
        g.style.backgroundPosition = -b[0] + "px " + (-b[1]) + "px"
    }
};
EzServerClient.Util.stopEvent = function(a) {
    a = a || window.event;
    a.returnValue = false;
    if (a.preventDefault) {
        a.preventDefault()
    }
    a.cancelBubble = true;
    if (a.stopPropagation) {
        a.stopPropagation()
    }
};
EzServerClient.Util.eval = function(a) {
    (window.execScript || function(b) {
        window["eval"].call(window, b)
    })(a)
};
EzServerClient.Class = function() {
    var d = function() {
        if (arguments && arguments[0] != EzServerClient.Class.isPrototype) {
            this.initialize.apply(this, arguments)
        }
    };
    var c = {};
    var f, b;
    for (var e = 0, a = arguments.length; e < a; ++e) {
        if (typeof arguments[e] == "function") {
            if (e == 0 && a > 1) {
                b = arguments[e].prototype.initialize;
                arguments[e].prototype.initialize = function() {
                };
                c = new arguments[e];
                if (b === undefined) {
                    delete arguments[e].prototype.initialize
                } else {
                    arguments[e].prototype.initialize = b
                }
            }
            f = arguments[e].prototype
        } else {
            f = arguments[e]
        }
        EzServerClient.Util.extend(c, f)
    }
    d.prototype = c;
    return d
};
EzServerClient.Class.isPrototype = function() {
};
EzServerClient.Class.create = function() {
    return function() {
        if (arguments && arguments[0] != EzServerClient.Class.isPrototype) {
            this.initialize.apply(this, arguments)
        }
    }
};
EzServerClient.Class.inherit = function() {
    var d = arguments[0];
    var e = new d(EzServerClient.Class.isPrototype);
    for (var c = 1, a = arguments.length; c < a; c++) {
        if (typeof arguments[c] == "function") {
            var b = arguments[c];
            arguments[c] = new b(EzServerClient.Class.isPrototype)
        }
        EzServerClient.Util.extend(e, arguments[c])
    }
    return e
};
if (typeof EzServerClient.GlobeFunction == "undefined" || !EzServerClient.GlobeFunction) {
    EzServerClient.GlobeFunction = {}
}
var m_EzServer = EzServerClient.GlobeParams.EzServerClientURL;
var _MapService = EzServerClient.GlobeParams.EzServerClientURL;
var _ImageBaseUrl = EzServerClient.GlobeParams.EzServerClientURL + "/images/";
if (typeof (EzServerClient.GlobeParams.Copyright) != "undefined") {
    _mCopyright = EzServerClient.GlobeParams.Copyright
} else {
    _mCopyright = [""]
}
if (typeof (EzServerClient.GlobeParams.Version) != "undefined") {
    _Ver = EzServerClient.GlobeParams.Version
} else {
    _Ver = 0.3
}
if (!EzServerClient.GlobeParams.DynamicCopyright) {
    EzServerClient.GlobeParams.DynamicCopyright = []
}
_LineWidth = 1;
_LineColor = "Yellow";
if (typeof (EzServerClient.GlobeParams.MapFullExtent) != "undefined") {
    _FullExtentMBR = EzServerClient.GlobeParams.MapFullExtent
} else {
    _FullExtentMBR = [116, 39, 117, 40]
}
if (typeof (EzServerClient.GlobeParams.CenterPoint) == "undefined") {
    _MapCenter = [(_FullExtentMBR[2] + _FullExtentMBR[0]) / 2, (_FullExtentMBR[3] + _FullExtentMBR[1]) / 2]
} else {
    _MapCenter = EzServerClient.GlobeParams.CenterPoint
}
if (typeof (EzServerClient.GlobeParams.MapInitLevel) != "undefined") {
    _InitLevel = EzServerClient.GlobeParams.MapInitLevel
} else {
    _InitLevel = 9;
    EzServerClient.GlobeParams.MapInitLevel = 9
}
if (typeof (EzServerClient.GlobeParams.MapMaxLevel) != "undefined") {
    _MaxLevel = EzServerClient.GlobeParams.MapMaxLevel
} else {
    _MaxLevel = 12;
    EzServerClient.GlobeParams.MapMaxLevel = 12
}
if (typeof (EzServerClient.GlobeParams.ZoomOffset) != "undefined") {
    _ZoomOffset = EzServerClient.GlobeParams.ZoomOffset
} else {
    _ZoomOffset = 0;
    EzServerClient.GlobeParams.ZoomOffset = 0
}
if (typeof (EzServerClient.GlobeParams.MapConvertScale) != "undefined") {
    _convert_scale = EzServerClient.GlobeParams.MapConvertScale
} else {
    _convert_scale = 114699;
    EzServerClient.GlobeParams.MapConvertScale = 114699
}
if (typeof (EzServerClient.GlobeParams.MapConvertOffsetX) != "undefined") {
    _convert_ofsx = EzServerClient.GlobeParams.MapConvertOffsetX
} else {
    _convert_ofsx = 0;
    EzServerClient.GlobeParams.MapConvertOffsetX = 0
}
if (typeof (EzServerClient.GlobeParams.MapConvertOffsetY) != "undefined") {
    _convert_ofsy = EzServerClient.GlobeParams.MapConvertOffsetY
} else {
    _convert_ofsy = 0;
    EzServerClient.GlobeParams.MapConvertOffsetY = 0
}
_bIsWriteFile = true;
if (typeof (EzServerClient.GlobeParams.MapUnitPixels) != "undefined") {
    _MapUnitPixels = EzServerClient.GlobeParams.MapUnitPixels
} else {
    _MapUnitPixels = 256;
    EzServerClient.GlobeParams.MapUnitPixels = 256
}
if (typeof (EzServerClient.GlobeParams.MapCoordinateType) != "undefined") {
    _MapSpanScale = EzServerClient.GlobeParams.MapCoordinateType
} else {
    _MapSpanScale = 1;
    EzServerClient.GlobeParams.MapCoordinateType = 1
}
if (typeof (EzServerClient.GlobeParams.IsOverlay) != "undefined") {
    _bIsOverlay = EzServerClient.GlobeParams.IsOverlay
} else {
    _bIsOverlay = true;
    EzServerClient.GlobeParams.IsOverlay = true
}
if (typeof (EzServerClient.GlobeParams.MapProx) != "undefined") {
    _bMapProx = EzServerClient.GlobeParams.MapProx
} else {
    _bMapProx = false;
    EzServerClient.GlobeParams.MapProx = false
}
if (typeof EzServerClient.GlobeParams.ZoomLevelSequence == "undefined") {
    EzServerClient.GlobeParams.ZoomLevelSequence = 2
}
if (!EzServerClient.GlobeParams.TileAnchorPoint) {
    EzServerClient.GlobeParams.TileAnchorPoint = [0, 0]
}
if (typeof (EzServerClient.GlobeParams.EzMapServiceURL) != "undefined") {
    m_MapServer = EzServerClient.GlobeParams.EzMapServiceURL
} else {
    m_MapServer = "/EzMapService"
}
EzErrorFactory = {createError: function(a, b) {
        if (b) {
            return new Error(a + "\r\n由于:" + b.message)
        } else {
            return new Error(a)
        }
    }};
EzServerClient.GlobeFunction.isTypeRight = function(param1, type) {
    switch (type) {
        case "string":
            if (typeof param1 == "string") {
                return true
            } else {
                return false
            }
        case "int":
            if (typeof param1 == "number") {
                if (param1.toString().indexOf(".") == -1) {
                    return true
                } else {
                    return false
                }
            } else {
                return false
            }
        case "float":
            if (typeof param1 == "number") {
                return true
            } else {
                return false
            }
        case "number":
            if (typeof param1 == "number") {
                return true
            } else {
                return false
            }
        case "boolean":
            if (typeof param1 == "boolean") {
                return true
            } else {
                return false
            }
        case "function":
            if (typeof param1 == "function") {
                return true
            } else {
                return false
            }
        case "object":
            if (typeof param1 == "object") {
                return true
            } else {
                return false
            }
        case "undefined":
            if (typeof param1 == "undefined") {
                return true
            } else {
                return false
            }
        default:
            if (param1 instanceof eval(type)) {
                return true
            } else {
                return false
            }
    }
};
EzServerClient.GlobeFunction.getContextPath = function() {
    var a = document.location.toString();
    var c = "";
    if (a.indexOf("://") != -1) {
        c += a.substring(0, a.indexOf("//") + 2);
        a = a.substring(a.indexOf("//") + 2, a.length)
    }
    var b = a.indexOf("/");
    c += a.substring(0, b + 1);
    a = a.substring(b + 1);
    b = a.indexOf("/");
    c += a.substring(0, b + 1);
    return c
};
EzServerClient.GlobeFunction.EzEncoding = function(b) {
    var e = new String();
    for (var a = 0; a < b.length; a++) {
        var d = b.charAt(a);
        e += EzServerClient.GlobeFunction.EzEncodingChar(d)
    }
    return e
};
EzServerClient.GlobeFunction.EzEncodingChar = function(a) {
    switch (a.charCodeAt(0)) {
        case 60:
            return "&lt;";
        case 38:
            return "&amp;";
        case 62:
            return "&gt;";
        case 34:
            return "&quot;";
        default:
            return "" + a
    }
};
EzServerClient.GlobeFunction.getPathMBR = function(f) {
    var g = f.split("|");
    var a = g[0].split(";")[0];
    var e = EzServerClient.GlobeFunction.getPathMBRComma(a);
    for (var d = 0; d < g.length; d++) {
        var b = g[d].split(";");
        for (var c = 0; c < b.length; c++) {
            if (d == 0) {
                continue
            }
            e = MBR.union(e, EzServerClient.GlobeFunction.getPathMBRComma(b[c]))
        }
    }
    return e
};
EzServerClient.GlobeFunction.getPathMBRComma = function(f) {
    var h = f.split(",");
    var g = h.length;
    if (g == 2) {
        return new MBR(parseFloat(h[0]), parseFloat(h[1]), parseFloat(h[0]), parseFloat(h[1]))
    } else {
        if (g == 3) {
            return new MBR(parseFloat(h[0]) - parseFloat(h[2]), parseFloat(h[1]) - parseFloat(h[2]), parseFloat(h[0]) + parseFloat(h[2]), parseFloat(h[1]) + parseFloat(h[2]))
        } else {
            if (g == 4) {
                return new MBR(Math.min(h[0], h[2]), Math.min(h[1], h[3]), Math.max(h[0], h[2]), Math.max(h[1], h[3]))
            } else {
                var e = Math.min(h[0], h[2]), d = Math.min(h[1], h[3]), b = Math.max(h[0], h[2]), a = Math.max(h[1], h[3]);
                for (var c = 4; c < g; c = c + 2) {
                    if (e > h[c]) {
                        e = h[c]
                    } else {
                        if (b < h[c]) {
                            b = h[c]
                        }
                    }
                    if (d > h[c + 1]) {
                        d = h[c + 1]
                    } else {
                        if (a < h[c + 1]) {
                            a = h[c + 1]
                        }
                    }
                }
                return new MBR(e, d, b, a)
            }
        }
    }
};
EzServerClient.GlobeFunction.setDynamicCopyright = function(b, a) {
    EzServerClient.GlobeFunction.getCurrentSourceInfo_634 = function(c) {
        var e = "";
        if (c.map.baseLayer.hasOverTileLayer()) {
            e = c.map.baseLayer.url[1]
        } else {
            e = c.map.baseLayer.url[0]
        }
        var d = c.getZoomLevel() + EzServerClient.GlobeParams.ZoomOffset;
        var g = c.getCenterLatLng();
        var f = EzServerClient.GlobeParams.Copyright;
        return {source: e,zoom: d,cp: g,defaultCopyRight: f}
    };
    EzServerClient.GlobeFunction.setCopyRight = function(c, d) {
        c.map.copyRightLabel.innerHTML = d
    };
    EzServerClient.GlobeFunction.copyRightChangeDelegate = function(c, g) {
        var f = EzServerClient.GlobeFunction.getCurrentSourceInfo_634(c);
        var d = false;
        for (var e = 0; e < g.length; e++) {
            if (g[e].source != f.source) {
                continue
            }
            if (g[e].minzoom > f.zoom) {
                continue
            }
            if (g[e].maxzoom < f.zoom) {
                continue
            }
            if (g[e].region.containsPoint(f.cp)) {
                EzServerClient.GlobeFunction.setCopyRight(c, g[e].label);
                d = true;
                break
            }
        }
        if (!d) {
            EzServerClient.GlobeFunction.setCopyRight(c, f.defaultCopyRight)
        }
    };
    b.addMapChangeListener(function() {
        EzServerClient.GlobeFunction.copyRightChangeDelegate(b, a)
    })
};
if (typeof EzEventListener == "undefined" || !EzEventListener) {
    var EzEventListener = function(c, a, b) {
        this.source = c;
        this.eventType = a;
        this.handler = b
    };
    EzEventListener.prototype = {getTarget: function() {
            return this.source
        },getHandler: function() {
            return this.handler
        },getEventType: function() {
            return this.eventType
        }}
}
if (typeof EzEvent == "undefined" || !EzEvent) {
    var EzEvent = {MAP_READY: "mapready",MAP_ADDOVERLAY: "mapaddoverlay",MAP_REMOVEOVERLAY: "mapremoveoverlay",MAP_CLEAROVERLAYS: "mapclearoverlays",MAP_CLICK: "mapclick",MAP_DBLCLICK: "mapdblclick",MAP_ZOOMCHANGE: "mapzoomchange",MAP_ZOOMSTART: "mapzoomstart",MAP_ZOOMEND: "mapzoomend",MAP_PAN: "mappan",MAP_PANSTART: "mappanstart",MAP_PANEND: "mappanend",MAP_MOUSEDOWN: "mapmousedown",MAP_MOUSEMOVE: "mapmousemove",MAP_MOUSEOUT: "mapmouseout",MAP_MOUSEOVER: "mapmouseover",MAP_MOUSEUP: "mapmouseup",MAP_MOUSEWHEEL: "mapmousewheel",MAP_SWITCHMAPSERVER: "mapswitchmapserver",MAP_RESIZE: "mapresize",MAP_VIEWCHANGE: "mapviewchange",MAP_PANINFOWINDOW: "mappaninfowindow"}
}
EzEvent.ezEventListener = new EzEventListener();
EzEvent.map = null;
EzEvent.eventType = null;
EzEvent.overlay = null;
EzEvent.mapPoint = new Point(0, 0);
EzEvent.screenPoint = new Point(0, 0);
EzEvent.zoomLevelPrevious = null;
EzEvent.zoomLevel = null;
EzEvent.extentPrevious = new MBR(0, 0, 0, 0);
EzEvent.extent = new MBR(0, 0, 0, 0);
EzEvent.wheelDelta = null;
EzEvent.mapServerIndexPrevious = 0;
EzEvent.mapServerIndex = 0;
EzEvent.keypanleftOffset = 0;
EzEvent.keypantopOffset = 0;
EzEvent.panInfoleftOffset = 0;
EzEvent.panInfotopOffset = 0;
EzEvent.addEventListener = function(d, b, c) {
    d.addEventListener(b, c);
    var a = new EzEventListener(d, b, c);
    return a
};
EzEvent.removeEventListener = function(a, m) {
    if(typeof a === "string"){
        delete m["on" + a];
    }else{
        var d = a.getTarget();
        var c = a.getHandler();
        var b = a.getEventType();
        d.removeEventListener(b, c)
    }
};
EzEvent.trigger = function(a, b) {
    var d = a.getTarget();
    var c = a.getEventType();
    b.eventType = c;
    d.fireEvent(c, b)
};
EzEvent.clearInstanceEventListeners = function(b, a) {
    delete b["on" + a]
};
EzEvent.clearEventListeners = function(a) {
    delete a["on" + this.MAP_READY];
    delete a["on" + this.MAP_ADDOVERLAY];
    delete a["on" + this.MAP_REMOVEOVERLAY];
    delete a["on" + this.MAP_CLEAROVERLAYS];
    delete a["on" + this.MAP_CLICK];
    delete a["on" + this.MAP_DBLCLICK];
    delete a["on" + this.MAP_ZOOMSTART];
    delete a["on" + this.MAP_ZOOMEND];
    delete a["on" + this.MAP_ZOOMCHANGE];
    delete a["on" + this.MAP_PANSTART];
    delete a["on" + this.MAP_PANEND];
    delete a["on" + this.MAP_PAN];
    delete a["on" + this.MAP_MOUSEDOWN];
    delete a["on" + this.MAP_MOUSEMOVE];
    delete a["on" + this.MAP_MOUSEOUT];
    delete a["on" + this.MAP_MOUSEOVER];
    delete a["on" + this.MAP_MOUSEUP];
    delete a["on" + this.MAP_MOUSEWHEEL];
    delete a["on" + this.MAP_SWITCHMAPSERVER];
    delete a["on" + this.MAP_RESIZE];
    delete a["on" + this.MAP_VIEWCHANGE];
    delete a["on" + this.MAP_VIEW]
};
EzServerClient.GlobeFunction.IncludeScript = function(b) {
    var a = '<script type="text/javascript" src="scripts/' + b + '"><\/script>';
    document.writeln(a)
};
EzServerClient.GlobeFunction.IncludeStyle = function(b) {
    var a = '<link type="text/css" rel="stylesheet" href="styles/' + b + '" />';
    document.writeln(a)
};
EzServerClient.GlobeParams.BrowserDPI = (function() {
    if (window.screen.deviceXDPI != undefined) {
        return {x: window.screen.deviceXDPI,y: window.screen.deviceYDPI}
    } else {
        var b = document.createElement("DIV");
        b.style.cssText = "width:1in;height:1in;position:absolute;left:0px;top:0px;z-index:99;visibility:hidden";
        document.body.appendChild(b);
        var a = {x: parseInt(b.offsetWidth),y: parseInt(b.offsetHeight)};
        b.parentNode.removeChild(b);
        return a
    }
})();
EzServerClient.GlobeParams.Browser = (function() {
    var a = {};
    var b = navigator.userAgent.toLowerCase();
    var c;
    (c = b.match(/msie ([\d.]+)/)) ? a.ie = c[1] : (c = b.match(/firefox\/([\d.]+)/)) ? a.firefox = c[1] : (c = b.match(/chrome\/([\d.]+)/)) ? a.chrome = c[1] : (c = b.match(/opera.([\d.]+)/)) ? a.opera = c[1] : (c = b.match(/version\/([\d.]+).*safari/)) ? a.safari = c[1] : 0;
    if (a.ie) {
        return "IE"
    }
    if (a.firefox) {
        return "Firefox"
    }
    if (a.chrome) {
        return "Chrome"
    }
    if (a.opera) {
        return "Opera"
    }
    if (a.safari) {
        return "Safari"
    }
})();
EzServerClient.GlobeParams.BrowserTypeAndVersion = (function() {
    var a = {};
    var b = navigator.userAgent.toLowerCase();
    var c;
    (c = b.match(/msie ([\d.]+)/)) ? a.ie = c[1] : (c = b.match(/firefox\/([\d.]+)/)) ? a.firefox = c[1] : (c = b.match(/chrome\/([\d.]+)/)) ? a.chrome = c[1] : (c = b.match(/opera.([\d.]+)/)) ? a.opera = c[1] : (c = b.match(/version\/([\d.]+).*safari/)) ? a.safari = c[1] : 0;
    if (a.ie && parseInt(a.ie)<10) {
        return "IE" + a.ie
    }
    if (a.firefox) {
        return "Firefox" + a.firefox
    }
    if (a.chrome) {
        return "Chrome" + a.chrome
    }
    if (a.opera) {
        return "Opera" + a.opera
    }
    if (a.safari) {
        return "Safari" + a.safari
    }else{
        return "unknown"
    }
})();

var tempResolution = [2, 1, 0.5, 0.25, 0.125, 0.0625, 0.03125, 0.015625, 0.0078125, 0.00390625, 0.001953125, 0.0009765625, 0.00048828125, 0.000244140625, 0.0001220703125, 0.00006103515625, 0.000030517578125, 0.0000152587890625, 0.00000762939453125, 0.000003814697265625, 0.0000019073486328125, 9.5367431640625e-7, 4.76837158203125e-7];
var tempDisplayScale_dpi96 = [786432000, 393216000, 196608000, 98304000, 49152000, 24576000, 12288000, 6144000, 3072000, 1536000, 768000, 384000, 192000, 96000, 48000, 24000, 12000, 6000, 3000, 1500, 750, 375, 187];
var tempDisplayScale = [["8000公里", "83px"], ["4000公里", "53px"], ["2000公里", "53px"], ["1000公里", "46px"], ["1000公里", "78px"], ["500公里", "74px"], ["200公里", "64px"], ["100公里", "69px"], ["50公里", "72px"], ["20公里", "59px"], ["10公里", "60px"], ["5公里", "60px"], ["2公里", "49px"], ["1公里", "49px"], ["500米", "49px"], ["500米", "97px"], ["200米", "78px"], ["100米", "78px"], ["50米", "78px"], ["20米", "63px"], ["10米", "63px"], ["5米", "63px"], ["2米", "50px"]];

if(EzServerClient.GlobeParams.initResolution && EzServerClient.GlobeParams.initResolution.length > 0){
    EzServerClient.GlobeParams.Resolution = EzServerClient.GlobeParams.initResolution;
    EzServerClient.GlobeParams.DisplayScale_dpi96 = [];
    EzServerClient.GlobeParams.DisplayScale = [];

    //计算起始序号
    var startIndex = 0;
    for (var i = 0; i < tempResolution.length; i++) {
        if(EzServerClient.GlobeParams.Resolution[0]/tempResolution[i] >=1){
            startIndex = i;
            break;
        }
    }

    for (var i = startIndex; i < tempDisplayScale_dpi96.length; i++) {
        EzServerClient.GlobeParams.DisplayScale_dpi96.push(tempDisplayScale_dpi96[i]);
    }

    for (var i = startIndex; i < tempDisplayScale.length; i++) {
        EzServerClient.GlobeParams.DisplayScale.push(tempDisplayScale[i]);
    }
}
else
    EzServerClient.GlobeParams.Resolution = tempResolution;

if(!EzServerClient.GlobeParams.DisplayScale_dpi96)
    EzServerClient.GlobeParams.DisplayScale_dpi96 = tempDisplayScale_dpi96;

if(!EzServerClient.GlobeParams.DisplayScale)
    EzServerClient.GlobeParams.DisplayScale = tempDisplayScale;
function getOffsetLeft(b) {
    return b == document.body ? 0 : b.offsetLeft + getOffsetLeft(b.offsetParent)
}
function getOffsetTop(b) {
    return b == document.body ? 0 : b.offsetTop + getOffsetTop(b.offsetParent)
}
var colours = new Array("#FFFFFF", "#FFCCCC", "#FFCC99", "#FFFF99", "#FFFFCC", "#99FF99", "#99FFFF", "#CCFFFF", "#CCCCFF", "#FFCCFF", "#CCCCCC", "#FF6666", "#FF9966", "#FFFF66", "#FFFF33", "#66FF99", "#33FFFF", "#66FFFF", "#9999FF", "#FF99FF", "#C0C0C0", "#FF0000", "#FF9900", "#FFCC66", "#FFFF00", "#33FF33", "#66CCCC", "#33CCFF", "#6666CC", "#CC66CC", "#999999", "#CC0000", "#FF6600", "#FFCC33", "#FFCC00", "#33CC00", "#00CCCC", "#3366FF", "#6633FF", "#CC33CC", "#666666", "#990000", "#CC6600", "#CC9933", "#999900", "#009900", "#339999", "#3333FF", "#6600CC", "#993399", "#333333", "#660000", "#993300", "#996633", "#666600", "#006600", "#336666", "#000099", "#333399", "#663366", "#000000", "#330000", "#663300", "#663333", "#333300", "#003300", "#003333", "#000066", "#330099", "#330033");
var g_divPreview;
var g_ColorHex;
var g_color_palette = null;
function mouseOver(b, a) {
    if (g_divPreview) {
        g_divPreview.style.background = a
    }
    if (g_ColorHex) {
        g_ColorHex.value = a
    }
    b.style.borderColor = "#FFFFFF"
}
function mouseOut(a) {
    a.style.borderColor = "#666666"
}
function mouseDown(a) {
    if (g_ColorHex) {
        g_ColorHex.value = a
    }
    if (g_color_palette) {
        g_color_palette.style.display = "none"
    }
}
function EzColorPicker(b, a) {
    if (typeof b == "string") {
        g_divPreview = Obj(b)
    } else {
        g_divPreview = b
    }
    if (typeof a == "string") {
        g_ColorHex = Obj(a)
    } else {
        g_ColorHex = a
    }
    if (!g_color_palette) {
        g_color_palette = document.createElement("div");
        g_color_palette.style.width = "200px";
        g_color_palette.style.height = "150px";
        g_color_palette.style.position = "absolute";
        document.body.appendChild(g_color_palette);
        code = "<table class='tblPalette' cellpadding='0' cellspacing='1' border='2'>";
        for (i = 0; i < 70; i++) {
            if ((i) % 10 == 0) {
                code += "<tr>"
            }
            code += "<td id='el_" + i + "' bgcolor=" + colours[i] + " onMouseOver=\"mouseOver(this, '" + colours[i] + "');\" onMouseOut='mouseOut(this)' onclick=\"mouseDown('" + colours[i] + "');return false;\">&nbsp;</td>\n";
            if ((i + 1) % 10 == 0) {
                code += "</tr>\n"
            }
        }
        g_color_palette.innerHTML = code + "</table>"
    }
    g_color_palette.style.top = getOffsetTop(g_divPreview);
    g_color_palette.style.left = getOffsetLeft(g_divPreview) + 40;
    g_color_palette.style.display = ""
}
function Obj(a) {
    return document[a] || (document.all && document.all[a]) || (document.getElementById && document.getElementById(a))
}
EzColorPicker.close = function() {
    if (g_color_palette) {
        g_color_palette.style.display = "none"
    }
};
function IEBrowser(c, b, a) {
    this.type = c;
    this.version = b;
    this.os = a
}
Object.prototype.setTimeout = function(ie, Bi) {
    var ke = "tempVar" + _m_iSeq;
    _m_iSeq++;
    if (_m_iSeq == Number.MAX_VALUE - 1) {
        _m_iSeq = 0
    }
    eval(ke + " = this;");
    var Rh = ie.replace(/\\/g, "\\\\").replace(/\"/g, '\\"');
    return window.setTimeout(ke + '._setTimeoutDispatcher("' + Rh + '");', Bi)
};
Object.prototype.toStringSize = toStringSize;
Object.prototype._setTimeoutDispatcher = function(ie) {
    eval(ie)
};
Object.prototype.eventHandler = function(b) {
    var a = this;
    return function(c) {
        if (!c) {
            c = window.event
        }
        if (c && !c.target) {
            c.target = c.srcElement
        }
        a[b](c)
    }
};
Object.prototype.Clone = function() {
    try {
        var b = new this.constructor();
        for (var a in this) {
            if (b[a] != this[a]) {
                if (typeof (this[a]) == "object") {
                    b[a] = this[a].Clone()
                } else {
                    b[a] = this[a]
                }
            }
        }
        if (!b || ("" + b) == "") {
            return (new String(this) + b) ? this : b
        } else {
            b.toString = this.toString;
            return b
        }
    } catch (c) {
        alert("Clone出现错误:" + c.message)
    }
};
Function.prototype.method = function(a, c, b) {
    if (typeof b == "undefined" || b == true) {
        this.prototype[a] = c
    } else {
        this[a] = c
    }
    return this
};
Array.prototype.clear = function() {
    while (this.length > 0) {
        this.pop()
    }
};
Array.prototype.insert = function(b, e) {
    if (!(b >= 0)) {
        return
    }
    var d = this.slice();
    var c = this.length - b;
    var a = d.splice(b, c);
    d[d.length] = e;
    d = d.concat(a);
    return d
};
Array.prototype.indexOf = function(a) {
    for (var b = 0, c = this.length; b < c; b++) {
        if (this[b] == a) {
            return b
        }
    }
    return -1
};
EzServerClient.GlobeParams.InnerMaxZoomLevel = 22;
EzServerClient.GlobeParams.PerZoomLevelPixel = 12;
var iMaxLevel = EzServerClient.GlobeParams.InnerMaxZoomLevel + 1;
var iSliderH = 277;
var _overLayIndex = 100;
var iSpan = 0.03125;
_m_scale_meter = [2.5, 5, 10, 20, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000, 50000, 100000, 200000, 500000, 1000000, 2000000, 5000000, 10000000, 20000000, 50000000, 100000000, 200000000];
var _m_MapSpan = new Array();
var _m_dMapSpanScale = _MapUnitPixels / 128;
if (typeof _MapSpanScale == "undefined") {
    _MapSpanScale = 1
}
for (var i = EzServerClient.GlobeParams.InnerMaxZoomLevel; i >= 0; i--) {
    _m_MapSpan[i] = iSpan;
    iSpan = iSpan * 2
}
var _m_MapBottomSpan = _m_dMapSpanScale * 3.515625;
var _m_MapBottomScale = 3000;
var _m_MapApp = null;
var _m_result = null;
if (_ZoomOffset != 0 || _MapSpanScale != 1) {
    var dScale = Math.pow(2, _ZoomOffset) * _MapSpanScale;
    _m_MapBottomScale = _m_MapBottomScale * dScale;
    _m_MapBottomSpan = _m_MapBottomSpan * dScale;
    var ZoomLen = _m_MapSpan.length;
    for (var iIndex = 0; iIndex < ZoomLen; iIndex++) {
        _m_MapSpan[iIndex] = _m_MapSpan[iIndex] / dScale
    }
}
var _RefreshSpeed = 13000;
var _TrackSpeed = 1000;
var _Debug = false;
var _Embed = true;
var _VMLInMap = false;
var _bIsGPSMonitor = false;
var _bIsVideoMonitor = false;
var _bIsResultTable = false;
var _bIsShowMapControl = false;
var _FlashTimeValve = 600;
var _mapName = "地图";
var _u = navigator.userAgent.toLowerCase();
_mSiteName = "EasyMap";
_mEmailSubject = "EzService";
_mSearching = "查找...";
_mZoomIn = "放大";
_mZoomOut = "缩小";
_mZoomSet = "点击设置显示级别";
_mZoomDrag = "拖动缩放";
_mPanWest = "左移";
_mPanEast = "右移";
_mPanNorth = "上移";
_mPanSouth = "下移";
_mLastResult = "对中";
_mDataCopy = "地图数据 &copy;2005 山海经纬";
_mNormalMap = "Map";
_mNew = "New!";
_NoImage = new Image();
_NoImage.src = _ImageBaseUrl + "transparent.gif";
_TackImgURL = _ImageBaseUrl + "tack.gif";
_MapCenterPoint = new Point(_MapCenter[0], _MapCenter[1]);
var _TransparentImageUrl = _ImageBaseUrl + "transparent.png";
var _WaterImageUrl = _ImageBaseUrl + "water.gif";
var _MapCenterUrl = _ImageBaseUrl + "Mapcenter.gif";
var _MapDebugCenterUrl = _ImageBaseUrl + "Mapcenter_debug.gif";
var _MapBeingCenterUrl = _ImageBaseUrl + "car_flash1.gif";
var s = _ImageBaseUrl + "mobile.gif";
var _MobileFlashImgURL = _ImageBaseUrl + "mobile_flash.gif";
var _CloseImg = _ImageBaseUrl + "close.gif";
var Vi = _ImageBaseUrl + "markerTransparent.png";
var Ph = _ImageBaseUrl + "dd-start.png";
var lh = _ImageBaseUrl + "dd-end.png";
var hi = _ImageBaseUrl + "zoom-plus.gif";
var Zh = _ImageBaseUrl + "zoom-minus.gif";
var ei = _ImageBaseUrl + "sliderbar.gif";
EzServerClient.GlobeParams.ei_ascend = _ImageBaseUrl + "sliderbar_ascend.gif";
EzServerClient.GlobeParams.ei_descend22 = _ImageBaseUrl + "sliderbar_descend22.gif";
EzServerClient.GlobeParams.ei_ascend22 = _ImageBaseUrl + "sliderbar_ascend22.gif";
var Gh = _ImageBaseUrl + "slider.gif";
var kh = _ImageBaseUrl + "center.png";
var pi = _ImageBaseUrl + "east.png";
var Yh = _ImageBaseUrl + "west.png";
var jg = _ImageBaseUrl + "north.png";
var ni = _ImageBaseUrl + "south.png";
var Gi = _ImageBaseUrl + "panshadow.png";
var ch = _ImageBaseUrl + "slidershadow.png";
var fh = _ImageBaseUrl + "east-mini.png";
var Jh = _ImageBaseUrl + "west-mini.png";
var mh = _ImageBaseUrl + "north-mini.png";
var Oh = _ImageBaseUrl + "south-mini.png";
var Ch = _ImageBaseUrl + "zoom-plus-mini.png";
var sg = _ImageBaseUrl + "zoom-minus-mini.png";
var Fg = _ImageBaseUrl + "iws_nw.png";
var Oi = _ImageBaseUrl + "iws_n.png";
var ii = _ImageBaseUrl + "iws_ne.png";
var Og = _ImageBaseUrl + "iws_e.png";
var Gg = _ImageBaseUrl + "iws_c.png";
var Th = _ImageBaseUrl + "iws_w.png";
var Qg = _ImageBaseUrl + "iws_sw.png";
var qf = _ImageBaseUrl + "iws_s.png";
var Lg = _ImageBaseUrl + "iws_se.png";
var Eg = _ImageBaseUrl + "iws_tap.png";
var ti = _ImageBaseUrl + "iw_nw.png";
var Wh = _ImageBaseUrl + "iw_n.png";
var ji = _ImageBaseUrl + "iw_ne.png";
var Rg = _ImageBaseUrl + "iw_e.png";
var Wg = _ImageBaseUrl + "iw_c.png";
var bi = _ImageBaseUrl + "iw_w.png";
var vi = _ImageBaseUrl + "iw_sw.png";
var nf = _ImageBaseUrl + "iw_s.png";
var ng = _ImageBaseUrl + "iw_se.png";
var Hh = _ImageBaseUrl + "iw_tap.png";
var Di = _ImageBaseUrl + "close.gif";
var Gc = _ImageBaseUrl + "iw_tabstub.png";
var Fc = _ImageBaseUrl + "iw_tab.png";
var Ec = _ImageBaseUrl + "iw_tabback.png";
var _MonitorSelectID = "MonitorInfoPanel";
var _OverViewImg = "OverViewImg";
var _StartImgID = "RouteStart";
var _EndImgID = "RouteEnd";
var _pointImgURL = _MapDebugCenterUrl;
var _ZoomInURL = _ImageBaseUrl + "/zoomin.cur";
var _ZoomOutURL = _ImageBaseUrl + "/zoomout.cur";
function _UserAgent(a) {
    return _u.indexOf(a) != -1
}
function _uan(b) {
    if (!window.RegExp) {
        return 0
    }
    var d = new RegExp(b + "([0-9]*)");
    var c = d.exec(_u);
    var a = 0;
    if (c.length >= 2) {
        a = c[1]
    }
    return a
}
function _compatIE() {
    return ((_UserAgent("opera") && (_UserAgent("opera 7.5") || _UserAgent("opera/7.5") || _UserAgent("opera/8"))) || (_UserAgent("safari") && _uan("safari/") >= 125) || (_UserAgent("msie") && !_UserAgent("msie 4") && !_UserAgent("msie 5.0") && !_UserAgent("msie 5.1") && !_UserAgent("msie 3") && !_UserAgent("powerpc")) || (document.getElementById && window.XSLTProcessor && window.XMLHttpRequest && !_UserAgent("netscape6") && !_UserAgent("netscape/7.0")))
}
function _noActiveX() {
    if (!_UserAgent("msie") || !document.all || _UserAgent("opera")) {
        return false
    }
    var s = false;
    eval('try { new ActiveXObject("Microsoft.XMLDOM"); }catch (e) { s = true; }');
    return s
}
function getEleByID(a) {
    return document.getElementById(a)
}
var _nxsl = !_UserAgent("safari");
function _loadnxsl() {
    _nxsl = true;
    _checkLoad()
}
function _load(a, b) {
    if (!_c) {
        return
    }
    if (!getMapApp() || !_nxsl) {
        window._pending = a
    } else {
        getMapApp().loadXML(a, b)
    }
}
var _wStr = "the map area below";
function _print() {
    if (!_c || !getMapApp()) {
        return
    }
    getMapApp().print()
}
function _checkLoad() {
    if (window._pending) {
        var a = window._pending;
        window._pending = null;
        _load(a)
    }
}
_sf = "hl=en";
_tv = ".3";
_fc = false;
_c = _fc || _compatIE();
function _script(b) {
    var a = '<script src="' + b + '" type="text/javascript"><\/script>';
    document.write(a)
}
function _havexslt() {
    if (typeof GetObject != "undefined" || (typeof XMLHttpRequest != "undefined" && typeof DOMParser != "undefined" && typeof XSLTProcessor != "undefined")) {
        return true
    } else {
        return false
    }
}
if (_c) {
    if (_havexslt()) {
    } else {
        if (_UserAgent("safari")) {
            _script("mapfiles/maps.6.safari.js")
        } else {
            _script("mapfiles/maps.6.xslt.js")
        }
    }
}
var _IEBrowser = new IEBrowser(0, 0, null);
var Gb = navigator.userAgent.toLowerCase();
if (Gb.indexOf("opera") != -1) {
    _IEBrowser.type = 4
} else {
    if (Gb.indexOf("msie") != -1 && document.all) {
        _IEBrowser.type = 1;
        if (Gb.indexOf("msie 5")) {
            _IEBrowser.version = 5
        }
    } else {
        if (Gb.indexOf("safari") != -1) {
            _IEBrowser.type = 3;
            if (Gb.indexOf("safari/125") != -1) {
                _IEBrowser.version = 1
            }
        } else {
            if (Gb.indexOf("mozilla") != -1) {
                _IEBrowser.type = 2
            }
        }
    }
}
if (Gb.indexOf("x11;") != -1) {
    _IEBrowser.os = 1
}
var _MaxNumber = Number.MAX_VALUE;
var _m_iSeq = 0;
function StrLength(c) {
    var a = 0;
    if (c == "") {
        return 0
    }
    for (var b = 0; b < c.length; b++) {
        if (c.substr(b, 1).charCodeAt(0) > 255) {
            a = a + 2
        } else {
            a++
        }
    }
    return a
}
function toStringSize(a, b) {
    var c = a + "";
    while (c.length < b) {
        c = "0" + c
    }
    return c
}
function Fb(a) {
    return a.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
}
function Ec(a) {
    return Fb(a).replace(/\"/g, "&quot;").replace(/\'/g, "&apos;")
}
document.getElementsByClassName = function(d) {
    var e = document.all;
    if (!e) {
        e = document.getElementsByTagName("*")
    }
    var c = new Array();
    for (var b = 0; b < e.length; b++) {
        if (e[b].className == d) {
            c[c.length] = e[b]
        }
    }
    return c
};
function setCursor(e, c) {
    try {
        e.style.cursor = c
    } catch (a) {
        if (c == "pointer") {
            setCursor(e, "hand")
        }
    }
}
function RemoveImg(a) {
    if (a && a.parentNode) {
        a.parentNode.removeChild(a)
    }
}
function getTargetElement(a) {
    var b;
    if (a.target) {
        b = (a.target.nodeType == 3) ? a.target.parentNode : a.target
    } else {
        b = a.srcElement
    }
    return b
}
function S(a) {
    if (_IEBrowser.type == 1) {
        window.event.cancelBubble = true
    } else {
        a.cancelBubble = true;
        a.preventDefault();
        a.stopPropagation()
    }
}
function Bh(c, a) {
    var b = window.document.createElement("a");
    b.href = "PolylineDrawer";
    b.onclick = a;
    b.appendChild(window.document.createTextNode(c));
    return b
}
if (!Array.prototype.push) {
    Array.prototype.push = function(a) {
        this[this.length] = a
    }
}
function convert2Px(a) {
    return a + "px"
}
function setClass(b, a) {
    if (b.className) {
        b.className += " " + a
    } else {
        b.className = a
    }
}
function ObjectOffset(b) {
    var a = {x: 0,y: 0};
    while (b) {
        a.x += b.offsetLeft;
        a.y += b.offsetTop;
        b = b.offsetParent
    }
    return a
}
function Tg(b, c) {
    var a = {x: 0,y: 0};
    while (b && b != c) {
        a.x += b.offsetLeft;
        a.y += b.offsetTop;
        b = b.offsetParent
    }
    return a
}
function _NoAction() {
    return false
}
var md = new Array("q", "ll", "spn", "z", "t", "sll", "sspn", "vp", "f", "output", "file", "deb");
function ud(a) {
    if (a.toFixed) {
        return a.toFixed(6).toString()
    } else {
        return a.toString()
    }
}
var sb = new Object();
var ae = "mapsxmlhttpiframe";
function RemoveChildren(a) {
    if (typeof a == "undefined" || a == null) {
        return
    }
    while (a.hasChildNodes()) {
        a.removeChild(a.lastChild)
    }
}
function bindingDoc(d) {
    try {
        if (typeof ActiveXObject != "undefined" && typeof GetObject != "undefined") {
            var c = new ActiveXObject("Microsoft.XMLDOM");
            c.loadXML(d);
            return c
        } else {
            if (typeof DOMParser != "undefined") {
                return (new DOMParser()).parseFromString(d, "text/xml")
            } else {
                return voidFunc(d)
            }
        }
    } catch (a) {
        EzLog.incompatible("xmlparse")
    }
    try {
        return voidFunc(d)
    } catch (a) {
        EzLog.incompatible("xmlparse");
        return document.createElement("div")
    }
}
function uf(d) {
    var b = "";
    if (d.nodeName == "#text") {
        b += Fb(d.nodeValue)
    } else {
        b += "<" + d.nodeName;
        if (d.hasAttributes()) {
            for (var c = 0; c < d.attributes.length; ++c) {
                b += " " + d.attributes[c].nodeName + '="' + Ec(d.attributes[c].nodeValue) + '"'
            }
        }
        if (d.childNodes.length == 0) {
            b += "/>"
        } else {
            b += ">";
            for (var c = 0; c < d.childNodes.length; ++c) {
                b += uf(d.childNodes[c])
            }
            b += "</" + d.nodeName + ">"
        }
    }
    return b
}
function ug(d) {
    var b = "";
    if (d.nodeName == "#text") {
        b += Fb(d.nodeValue)
    } else {
        for (var c = 0; c < d.childNodes.length; ++c) {
            b += uf(d.childNodes[c])
        }
    }
    return b
}
function gg(a) {
    var b = window.document.createElement("iframe");
    b.style.width = convert2Px(100);
    b.style.height = convert2Px(50);
    b.style.position = "absolute";
    b.style.top = convert2Px(-110);
    b.style.left = convert2Px(-110);
    b.id = a;
    b.name = a;
    window.document.body.appendChild(b);
    return b
}
function local2LonLat(a) {
    if (!(a instanceof Point)) {
        throw new Error(100, "参数类型应为:Point")
    }
    var b = (a.y - _convert_ofsy) / _convert_scale;
    var c = (a.x - _convert_ofsx) / _convert_scale;
    return new Point(c, b)
}
function LonLat2Local(b) {
    if (!(b instanceof Point)) {
        throw new Error(100, "参数类型应为:Point")
    }
    var a = b.x * _convert_scale + _convert_ofsx;
    var c = b.y * _convert_scale + _convert_ofsy;
    return new Point(a, c)
}
function CalculateArea(b) {
    var a = b.Clone();
    var e = a.length;
    var d = 0;
    var f = a[0];
    f = CalculateCoordinate(f);
    for (var c = 1; c < e; c++) {
        pt1 = a[c];
        pt1 = CalculateCoordinate(pt1);
        d += (pt1.x - f.x) * (pt1.y + f.y) / 2;
        f = pt1
    }
    return Math.abs(d)
}
function CalculateLength(b) {
    var a = b.Clone();
    var e = a.length;
    var d = new Number(0);
    var f = a[0];
    for (var c = 1; c < e; c++) {
        pt1 = a[c];
        d += GetDistanceInLL(f, pt1);
        f = pt1
    }
    return Math.abs(Math.ceil(d))
}
_C_P = 0.017453292519943295;
function CalculateCoordinate(e) {
    if (_MapSpanScale != 1) {
        return e
    }
    var d;
    var b = e.y * _C_P;
    var f = Math.sin(b);
    var c = e.x * _C_P;
    var a = 0.081819190842622 * f;
    var d = (1 - 0.00669437999014138) * (f / (1 - a * a) - (1 / (2 * 0.081819190842622)) * Math.log((1 - a) / (1 + a)));
    e.x = 6378137 * d / 2;
    e.y = 6378137 * c;
    return e
}
function GetDistanceInLL(k, h) {
    var j = new Number(0);
    if (_MapSpanScale == 1) {
        var g = (h.x - k.x) * _C_P;
        var f = (h.y - k.y) * _C_P;
        var e = Math.sin(0.5 * f) * Math.sin(0.5 * f) + Math.cos(k.y * _C_P) * Math.cos(h.y * _C_P) * (Math.sin(0.5 * g) * Math.sin(0.5 * g));
        e = Math.abs(e);
        if (e > 1) {
            alert("不合法数据:a:" + e + ",P1:" + k.toString() + ",P2:" + h.toString())
        }
        var l = 2 * Math.atan2(Math.sqrt(e), Math.sqrt(1 - e));
        j = l * 6371008.77141506;
        if (Math.abs(h.x - k.x) > 180 || Math.abs(h.y - k.y) > 180) {
            j = 2 * Math.PI * 6371008.77141506 - j
        }
    } else {
        var b = (h.x - k.x) * (h.x - k.x) + (h.y - k.y) * (h.y - k.y);
        j = Math.sqrt(b)
    }
    j = Math.ceil(j);
    return j
}
function bRetComp(a, b) {
    return Math.round(a * 1000000) == Math.round(b * 1000000)
}
function vh(a, b) {
    if (!b) {
        b = new Array()
    }
    while (a >= 32) {
        b.push(String.fromCharCode((32 | a & 31) + 63));
        a >>= 5
    }
    b.push(String.fromCharCode(a + 63));
    return b
}
function bc(a, b) {
    return vh(a < 0 ? ~(a << 1) : a << 1, b)
}
function loadImgNoImage(a) {
    a.src = "images/NoImage.png"
}
function getInfo(a) {
    return a.style.left + ":" + a.style.top + ";" + a.offsetLeft + ":" + a.offsetTop + ";" + a.offsetWidth + ":" + a.offsetHeight
}
function getPathMBR(h) {
    strLonLatPath = h.split(",");
    var c, b, a, g;
    if (strLonLatPath.length == 3) {
        var e = parseFloat(strLonLatPath[2]);
        c = parseFloat(strLonLatPath[0]) - e;
        a = parseFloat(strLonLatPath[0]) + e;
        b = parseFloat(strLonLatPath[1]) - e;
        g = parseFloat(strLonLatPath[1]) + e
    } else {
        if (strLonLatPath.length == 4) {
            c = strLonLatPath[0];
            a = strLonLatPath[2];
            b = strLonLatPath[1];
            g = strLonLatPath[3]
        } else {
            if (strLonLatPath.length >= 6) {
                a = c = strLonLatPath[0];
                g = b = strLonLatPath[1];
                for (var d = 0; d < strLonLatPath.length / 2; d++) {
                    if (strLonLatPath[2 * d] > a) {
                        a = strLonLatPath[2 * d]
                    }
                    if (strLonLatPath[2 * d] < c) {
                        c = strLonLatPath[2 * d]
                    }
                    if (strLonLatPath[2 * d + 1] > g) {
                        g = strLonLatPath[2 * d + 1]
                    }
                    if (strLonLatPath[2 * d + 1] < b) {
                        b = strLonLatPath[2 * d + 1]
                    }
                }
            }
        }
    }
    var f = new MBR(c, b, a, g);
    return f
}
function createRadio(a, e, d, b) {
    var c = document.createElement("<input>");
    c.id = e;
    c.name = a;
    c.type = "radio";
    return c
}
function createTxt(a, c) {
    var b = null;
    b = document.createElement("div");
    b.style.position = "absolute";
    setCursor(b, "default");
    b.unselectable = "on";
    b.onselectstart = _NoAction;
    if (a) {
        b.innerHTML = a
    }
    b.style.fontSize = convert2Px(10);
    b.style.color = "red";
    b.style.fontFamily = "Arial, sans serif";
    b.style.MozUserSelect = "none";
    return b
}
var se = "centerlat";
var te = "centerlng";
function Xd(a, c, b) {
    this.id = a;
    this.description = c;
    this.pointIndex = b
}
function getDocNodeValue(b) {
    if (!b) {
        return ""
    }
    if (typeof b.text != "undefined") {
        return b.text
    }
    if (b.nodeType == 3 || b.nodeType == 4) {
        return b.nodeValue
    }
    var a = "";
    if (b.nodeType == 1) {
        for (var c = b.firstChild; c != null; c = c.nextSibling) {
            a += getDocNodeValue(c)
        }
    }
    return a
}
function WriteMsg(b) {
    if (typeof _bIsWriteFile == "undefined" || !_bIsWriteFile) {
        return
    }
    var h, g, c;
    var d = 2, a = 8;
    try {
        h = new ActiveXObject("Scripting.FileSystemObject");
        g = h.OpenTextFile("c:\\scriptlog.txt", a, true);
        g.WriteLine(b);
        g.Close();
        if (h != null) {
            delete h
        }
    } catch (j) {
    }
}
function createDivText(b, c) {
    var a = document.createElement("div");
    if (b) {
        a.id = b
    }
    a.style.fontSize = "smaller";
    a.appendChild(document.createTextNode(c));
    return a
}
function createDivImg(c, e, f, b) {
    var a = document.createElement("div");
    if (c) {
        a.id = c
    }
    var d = createImg(e, "图像");
    if (f) {
        d.style.width = f + "px"
    }
    if (b) {
        d.style.height = b + "px"
    }
    a.appendChild(d);
    return a
}
function createDiv(b) {
    var a = document.createElement("div");
    a.style.position = "absolute";
    if (b) {
        a.id = b
    }
    return a
}
function createImg(g, c, f, e, a, d) {
    var b = document.createElement("Img");
    b.galleryimg = "no";
    b.src = g;
    if (!d) {
        d = 16
    }
    b.style.height = convert2Px(d);
    b.style.width = convert2Px(d);
    b.alt = c;
    b.style.position = "absolute";
    if (f) {
        b.style.left = convert2Px(f)
    }
    if (e) {
        b.style.top = convert2Px(e)
    }
    if (a) {
        b.title = a
    }
    BindingEvent(b, "mouseover", function(h) {
        setCursor(b, "hand")
    });
    return b
}
function createAlignImg(b, d, e) {
    var a = document.createElement("P");
    a.align = b;
    var c = document.createElement("Img");
    c.id = d;
    c.src = e;
    c.style.height = "";
    c.style.width = "";
    a.appendChild(c);
    return a
}
window.showInfoFrame = function(b) {
    var a = getMap();
    b = (b) ? b : ((window.event) ? window.event : "");
    if (b) {
        var c = getTargetElement(b);
        if (c) {
            a.showInfoFrame(c)
        }
    }
};
window.hideInfoFrame = function() {
    getMap().hideInfoFrame()
};
function LTrim(a) {
    if (a == null) {
        return ""
    }
    return a.replace(/^[ \t\n\r]+/g, "")
}
function RTrim(a) {
    if (a == null) {
        return ""
    }
    return a.replace(/[ \t\n\r]+$/g, "")
}
function Trim(a) {
    if (a == null) {
        return ""
    }
    return RTrim(LTrim(a))
}
function BindingEvent(c, b, a) {
    EventManager.add(c, b, a)
}
function unbindingEvent(c, b, a) {
    EventManager.remove(c, b, a)
}
function cloneFunc(d, c) {
    window[d] = c;
    return window[d]
}
function cloneMethod(e, d, f) {
    e.prototype[d] = f
}
function EzSMethod(e, d, f) {
    e[d] = f
}
function EzNameSpace() {
    var a = cloneFunc("Map", testEzMap);
    a.method("showMap1", testEzMap.prototype.showMap);
    a.method("showName1", testEzMap.showName, true)
}
function testEzMap() {
    this.name = new Array("hello")
}
function testEzMap_showMap() {
    alert(this.name[0])
}
testEzMap.prototype.showMap = testEzMap_showMap;
function testEzMap_showName() {
    alert("showName")
}
testEzMap.prototype.showName = testEzMap_showName;
EzNameSpace();
g_current_editor = null;
function degToRad(a) {
    return (a / (360 / (2 * Math.PI)))
}
function radToDeg(a) {
    return (a * (360 / (2 * Math.PI)))
}
function trans2Points(c) {
    var g = c.split(",");
    var b = g.length / 2;
    var e = new Array();
    for (var d = 0; d < b; d++) {
        var f = new Point(g[2 * d], g[2 * d + 1]);
        e.push(f)
    }
    return e
}
g_update_point = null;
g_snap_hovering = false;
g_snap_index = 0;
function GetQuadtreeAddress(a, d, g) {
    var j = 3.1415926535897;
    var b = 18;
    var f = (180 + parseFloat(a)) / 360;
    var e = -parseFloat(d) * j / 180;
    e = 0.5 * Math.log((1 + Math.sin(e)) / (1 - Math.sin(e)));
    e *= 1 / (2 * j);
    e += 0.5;
    var h = "t";
    var c = "qrts";
    alert(f + ":" + e);
    while (b-- > g) {
        f -= Math.floor(f);
        e -= Math.floor(e);
        h = h + c.substr((f >= 0.5 ? 1 : 0) + (e >= 0.5 ? 2 : 0), 1);
        f *= 2;
        e *= 2
    }
    return h
}
function check_ip(d, c) {
    var h = true;
    var j = d.split(".");
    var a = c.split(".");
    for (var g = 0; g < 4; g++) {
        var c = a[g];
        if (j[g] == c) {
            continue
        } else {
            if (c.indexOf("*") != -1) {
                continue
            } else {
                var b = c.split("/");
                if (b.length > 1) {
                    var f = parseInt(b[0]);
                    var e = parseInt(b[1]);
                    var k = parseInt(j[g]);
                    if (k > Math.max(f, e) || k < Math.min(f, e)) {
                        h = false;
                        break
                    }
                } else {
                    h = false;
                    break
                }
            }
        }
    }
    return h
}
function Qh(a) {
    if (!a) {
        return
    }
    if (window.clipboardData) {
        a.onpaste = Ki;
        a.ondrop = ah
    }
    return true
}
function Ki(a) {
    var c = document.selection;
    if (c) {
        var d = c.createRange();
        if (d) {
            var e = window.clipboardData.getData("Text");
            if (e) {
                d.text = Ve(e, null);
                return false
            }
        }
    }
    return true
}
var Sc = null;
function ah(a) {
    if (!a) {
        a = window.event
    }
    if (a.dataTransfer) {
        Sc = Ve(a.dataTransfer.getData("Text"), null);
        setTimeout("_finishDrop()", 1)
    }
    return true
}
function _finishDrop() {
    if (!Sc) {
        return
    }
    var a = document.selection;
    if (a) {
        var b = a.createRange();
        if (b) {
            b.text = Sc;
            b.select()
        }
    }
    Sc = null
}
var _makePasteBox = Qh;
function Ve(c, a) {
    if (!a) {
        a = ", "
    }
    var b = c.replace(/^[ \r\n\t\v]+/g, "");
    b = b.replace(/[ \r\n\t\v]+$/g, "");
    b = b.replace(/[ \t\v]*\r?\n[\r\n]*[ \t\v]*/g, a);
    return b
}
function getOffsetLeft(b) {
    return b == document.body ? 0 : b.offsetLeft + getOffsetLeft(b.offsetParent)
}
function getOffsetTop(b) {
    return b == document.body ? 0 : b.offsetTop + getOffsetTop(b.offsetParent)
}
var colours = new Array("#FFFFFF", "#FFCCCC", "#FFCC99", "#FFFF99", "#FFFFCC", "#99FF99", "#99FFFF", "#CCFFFF", "#CCCCFF", "#FFCCFF", "#CCCCCC", "#FF6666", "#FF9966", "#FFFF66", "#FFFF33", "#66FF99", "#33FFFF", "#66FFFF", "#9999FF", "#FF99FF", "#C0C0C0", "#FF0000", "#FF9900", "#FFCC66", "#FFFF00", "#33FF33", "#66CCCC", "#33CCFF", "#6666CC", "#CC66CC", "#999999", "#CC0000", "#FF6600", "#FFCC33", "#FFCC00", "#33CC00", "#00CCCC", "#3366FF", "#6633FF", "#CC33CC", "#666666", "#990000", "#CC6600", "#CC9933", "#999900", "#009900", "#339999", "#3333FF", "#6600CC", "#993399", "#333333", "#660000", "#993300", "#996633", "#666600", "#006600", "#336666", "#000099", "#333399", "#663366", "#000000", "#330000", "#663300", "#663333", "#333300", "#003300", "#003333", "#000066", "#330099", "#330033");
var g_divPreview;
var g_ColorHex;
var g_color_palette = null;
function mouseOver(b, a) {
    if (g_divPreview) {
        g_divPreview.style.background = a
    }
    if (g_ColorHex) {
        g_ColorHex.value = a
    }
    b.style.borderColor = "#FFFFFF"
}
function mouseOut(a) {
    a.style.borderColor = "#666666"
}
function mouseDown(a) {
    if (g_ColorHex) {
        g_ColorHex.value = a
    }
    if (g_color_palette) {
        g_color_palette.style.display = "none"
    }
}
function EzColorPicker(b, a) {
    if (typeof b == "string") {
        g_divPreview = Obj(b)
    } else {
        g_divPreview = b
    }
    if (typeof a == "string") {
        g_ColorHex = Obj(a)
    } else {
        g_ColorHex = a
    }
    if (!g_color_palette) {
        g_color_palette = document.createElement("div");
        g_color_palette.style.width = "200px";
        g_color_palette.style.height = "150px";
        g_color_palette.style.position = "absolute";
        document.body.appendChild(g_color_palette);
        code = "<table class='tblPalette' cellpadding='0' cellspacing='1' border='2'>";
        for (i = 0; i < 70; i++) {
            if ((i) % 10 == 0) {
                code += "<tr>"
            }
            code += "<td id='el_" + i + "' bgcolor=" + colours[i] + " onMouseOver=\"mouseOver(this, '" + colours[i] + "');\" onMouseOut='mouseOut(this)' onclick=\"mouseDown('" + colours[i] + "');return false;\">&nbsp;</td>\n";
            if ((i + 1) % 10 == 0) {
                code += "</tr>\n"
            }
        }
        g_color_palette.innerHTML = code + "</table>"
    }
    g_color_palette.style.top = getOffsetTop(g_divPreview);
    g_color_palette.style.left = getOffsetLeft(g_divPreview) + 40;
    g_color_palette.style.display = ""
}
function Obj(a) {
    return document[a] || (document.all && document.all[a]) || (document.getElementById && document.getElementById(a))
}
var JSON;
if (!JSON) {
    JSON = {}
}
(function() {
    function f(n) {
        return n < 10 ? "0" + n : n
    }
    if (typeof Date.prototype.toJSON !== "function") {
        Date.prototype.toJSON = function(key) {
            return isFinite(this.valueOf()) ? this.getUTCFullYear() + "-" + f(this.getUTCMonth() + 1) + "-" + f(this.getUTCDate()) + "T" + f(this.getUTCHours()) + ":" + f(this.getUTCMinutes()) + ":" + f(this.getUTCSeconds()) + "Z" : null
        };
        String.prototype.toJSON = Number.prototype.toJSON = Boolean.prototype.toJSON = function(key) {
            return this.valueOf()
        }
    }
    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, gap, indent, meta = {"\b": "\\b","\t": "\\t","\n": "\\n","\f": "\\f","\r": "\\r",'"': '\\"',"\\": "\\\\"}, rep;
    function quote(string) {
        escapable.lastIndex = 0;
        return escapable.test(string) ? '"' + string.replace(escapable, function(a) {
            var c = meta[a];
            return typeof c === "string" ? c : "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4)
        }) + '"' : '"' + string + '"'
    }
    function str(key, holder) {
        var i, k, v, length, mind = gap, partial, value = holder[key];
        if (value && typeof value === "object" && typeof value.toJSON === "function") {
            value = value.toJSON(key)
        }
        if (typeof rep === "function") {
            value = rep.call(holder, key, value)
        }
        switch (typeof value) {
            case "string":
                return quote(value);
            case "number":
                return isFinite(value) ? String(value) : "null";
            case "boolean":
            case "null":
                return String(value);
            case "object":
                if (!value) {
                    return "null"
                }
                gap += indent;
                partial = [];
                if (Object.prototype.toString.apply(value) === "[object Array]") {
                    length = value.length;
                    for (i = 0; i < length; i += 1) {
                        partial[i] = str(i, value) || "null"
                    }
                    v = partial.length === 0 ? "[]" : gap ? "[\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "]" : "[" + partial.join(",") + "]";
                    gap = mind;
                    return v
                }
                if (rep && typeof rep === "object") {
                    length = rep.length;
                    for (i = 0; i < length; i += 1) {
                        if (typeof rep[i] === "string") {
                            k = rep[i];
                            v = str(k, value);
                            if (v) {
                                partial.push(quote(k) + (gap ? ": " : ":") + v)
                            }
                        }
                    }
                } else {
                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = str(k, value);
                            if (v) {
                                partial.push(quote(k) + (gap ? ": " : ":") + v)
                            }
                        }
                    }
                }
                v = partial.length === 0 ? "{}" : gap ? "{\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "}" : "{" + partial.join(",") + "}";
                gap = mind;
                return v
        }
    }
    if (typeof JSON.stringify !== "function") {
        JSON.stringify = function(value, replacer, space) {
            var i;
            gap = "";
            indent = "";
            if (typeof space === "number") {
                for (i = 0; i < space; i += 1) {
                    indent += " "
                }
            } else {
                if (typeof space === "string") {
                    indent = space
                }
            }
            rep = replacer;
            if (replacer && typeof replacer !== "function" && (typeof replacer !== "object" || typeof replacer.length !== "number")) {
                throw new Error("JSON.stringify")
            }
            return str("", {"": value})
        }
    }
    if (typeof JSON.parse !== "function") {
        JSON.parse = function(text, reviver) {
            var j;
            function walk(holder, key) {
                var k, v, value = holder[key];
                if (value && typeof value === "object") {
                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v
                            } else {
                                delete value[k]
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value)
            }
            text = String(text);
            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function(a) {
                    return "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4)
                })
            }
            if (/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g, ""))) {
                j = eval("(" + text + ")");
                return typeof reviver === "function" ? walk({"": j}, "") : j
            }
            throw new SyntaxError("JSON.parse")
        }
    }
}());
function Point(a, d) {
    if (arguments.length == 1 && typeof arguments[0] == "string") {
        var b = arguments[0];
        var c = b.split(",");
        this.x = parseFloat(c[0]);
        this.y = parseFloat(c[1])
    } else {
        if (typeof a == "string") {
            this.x = parseFloat(a)
        } else {
            this.x = a
        }
        if (typeof d == "string") {
            this.y = parseFloat(d)
        } else {
            this.y = d
        }
    }
    this.screenX;
    this.screenY;
    this.mileage = -1;
    this.coordSequence = this.x + "," + this.y
}
Point.prototype.countMileage = function(b) {
    var a = this.distanceFrom(b) + b.mileage;
    this.mileage = a
};
Point.prototype.toString = function() {
    return this.x + "," + this.y
};
Point.prototype.equals = function(b) {
    try {
        if (!(EzServerClient.GlobeFunction.isTypeRight(b, "Point"))) {
            throw EzErrorFactory.createError("Point::equals方法中arguments[0]类型不正确")
        }
        if (!b) {
            return false
        }
        return this.x == b.x && this.y == b.y
    } catch (a) {
        throw EzErrorFactory.createError("Point::equals方法中不正确", a)
    }
};
Point.prototype.distanceFrom = function(c) {
    var b = this.x - c.x;
    var a = this.y - c.y;
    return Math.sqrt(b * b + a * a)
};
Point.prototype.approxEquals = function(b) {
    try {
        if (!(EzServerClient.GlobeFunction.isTypeRight(b, "Point"))) {
            throw EzErrorFactory.createError("Point::approxEquals方法中arguments[0]类型不正确")
        }
        if (!b) {
            return false
        }
        return bRetComp(this.x, b.x) && bRetComp(this.y, b.y)
    } catch (a) {
        throw EzErrorFactory.createError("Point::approxEquals方法中不正确", a)
    }
};
Point.prototype.getCenter = function(a) {
    if (!a) {
        return this
    }
    return new Point((this.x + a.x) / 2, (this.y + a.y) / 2)
};
Point.prototype.getCoordSequence = function() {
    this.coordSequence = this.x + "," + this.y;
    return this.coordSequence
};
Point.prototype.getGeometryType = function() {
    return "point"
};
function MBR(d, b, c, a) {
    if (typeof d == "string") {
        d = parseFloat(d)
    }
    if (typeof b == "string") {
        b = parseFloat(b)
    }
    if (typeof c == "string") {
        c = parseFloat(c)
    }
    if (typeof a == "string") {
        a = parseFloat(a)
    }
    this.minX = d;
    this.minY = b;
    this.maxX = c;
    this.maxY = a
}
MBR.prototype.toString = function() {
    return this.minX + "," + this.minY + "," + this.maxX + "," + this.maxY
};
MBR.prototype.containsSegment = function(b, a) {
    if (this.minX > b.x && this.minX > a.x) {
        return false
    }
    if (this.maxX < b.x && this.maxX < a.x) {
        return false
    }
    if (this.minY > b.y && this.minY > a.y) {
        return false
    }
    if (this.maxY < b.y && this.maxY < a.y) {
        return false
    }
    return true
};
MBR.prototype.containsBounds = function(c) {
    try {
        if (!EzServerClient.GlobeFunction.isTypeRight(c, "MBR")) {
            throw EzErrorFactory.createError("MBR::containsBounds方法中arguments[0]参数类型不正确")
        }
        var a = this.minX <= c.minX && (this.maxX >= c.maxX && (this.minY <= c.minY && this.maxY >= c.maxY));
        return a
    } catch (b) {
        throw EzErrorFactory.createError("MBR::containsBounds方法执行不正确", b)
    }
};
MBR.prototype.containsPoint = function(b) {
    try {
        if (!EzServerClient.GlobeFunction.isTypeRight(b, "Point")) {
            throw EzErrorFactory.createError("MBR::containsPoint方法中arguments[0]参数类型不正确")
        }
        var a = this.containsSegment(b, b);
        return a
    } catch (c) {
        throw EzErrorFactory.createError("MBR::containsPoint方法执行不正确", c)
    }
};
MBR.prototype.extend = function(a) {
    try {
        if (a instanceof Point) {
            this.minX = Math.min(this.minX, a.x);
            this.maxX = Math.max(this.maxX, a.x);
            this.minY = Math.min(this.minY, a.y);
            this.maxY = Math.max(this.maxY, a.y)
        } else {
            if (a instanceof MBR) {
                this.minX = Math.min(this.minX, a.minX);
                this.maxX = Math.max(this.maxX, a.maxX);
                this.minY = Math.min(this.minY, a.minY);
                this.maxY = Math.max(this.maxY, a.maxY)
            }
        }
    } catch (b) {
        throw EzErrorFactory.createError("MBR::extend方法执行不正确", b)
    }
};
MBR.prototype.scale = function(c) {
    try {
        if (!EzServerClient.GlobeFunction.isTypeRight(c, "float")) {
            throw EzErrorFactory.createError("MBR::scale方法中arguments[0]参数类型不正确")
        }
        var a = c - 1;
        var d = this.getSpanX() / 2;
        var b = this.getSpanY() / 2;
        this.minX = this.minX - a * d;
        this.maxX = this.maxX + a * d;
        this.minY = this.minY - a * b;
        this.maxY = this.maxY + a * b
    } catch (c) {
        throw EzErrorFactory.createError("MBR::scale方法执行不正确", c)
    }
};
MBR.prototype.centerPoint = function() {
    var b = (parseFloat(this.minX) + parseFloat(this.maxX)) / 2;
    var a = (parseFloat(this.minY) + parseFloat(this.maxY)) / 2;
    var c = new Point(b, a);
    return c
};
MBR.prototype.getCenterPoint = function() {
    return this.centerPoint()
};
MBR.prototype.getSpanX = function() {
    return this.maxX - this.minX
};
MBR.prototype.getSpanY = function() {
    return this.maxY - this.minY
};
MBR.prototype.approxEquals = function(a) {
    if (!a) {
        return false
    }
    return bRetComp(this.minX, a.minX) && bRetComp(this.minY, a.minY) && bRetComp(this.maxX, a.maxX) && bRetComp(this.maxY, a.maxY)
};
MBR.prototype.equals = function(a) {
    if (!a) {
        return false
    }
    return (this.minX == a.minX) && (this.minY == a.minY) && (this.maxX == a.maxX) && (this.maxY == a.maxY)
};
EzServerClient.Layer = EzServerClient.Class({id: "",div: null,opacity: 1,visible: true,spatialReference: "EPSG:3785",hide: function() {
        this.visible = false
    },show: function() {
        this.visible = true
    },setOpacity: function(a) {
        this.opacity = a
    },CLASS_NAME: "EzServerClient.Layer"});
EzServerClient.GroupLayer = EzServerClient.Class({_name: "",_layers: [],initialize: function(a, b) {
        this._name = a;
        this._layers = b
    },getName: function() {
        return this._name
    },setName: function(a) {
        this._name = a
    },getLayers: function() {
        return this._layers
    },setLayers: function(a) {
        this._layers = a
    },hasOverLayers: function() {
        if (this._layers.length > 1) {
            return true
        } else {
            return false
        }
    },getHotspotLayer: function() {
        for (var b = 0, a = this._layers.length; b < a; b++) {
            if (this._layers[b] instanceof EzServerClient.Layer.HotSpotTileLayer) {
                return this._layers[b]
            }
        }
        return null
    },shift: function() {
        if (this._layers.length < 1) {
            return null
        }
        return this._layers.shift()
    },unshift: function(a) {
        this._layers.unshift(a);
        return this._layers
    },CLASS_NAME: "EzServerClient.GroupLayer"});
EzServerClient.Tile = {};
EzServerClient.Tile.LevelDetail = EzServerClient.Class({initialize: function(c, a, b) {
        this.level = c;
        this.resolution = a;
        this.scale = b
    },CLASS_NAME: "EzServerClient.Tile.LevelDetail"});
EzServerClient.Tile.TileInfo = EzServerClient.Class({initialize: function(e, g, b, c, f, a, d) {
        this.dpi = e || 96;
        this.width = g || 256;
        this.height = b || 256;
        this.origin = c || [0, 0];
        this.spatialReference = f || "EPSG:3785";
        this.levelDetails = a || [];
        this.flatMatrix = d || [1, 0, 0, 0, 1, 0]
    },CLASS_NAME: "EzServerClient.Tile.TileInfo"});
EzServerClient.MapPositionZ = EzServerClient.Class({initialize: function(a, c, b) {
        this.x = a;
        this.y = c;
        this.level = b
    },CLASS_NAME: "EzServerClient.MapPositionZ"});
EzServerClient.TilePositionZ = EzServerClient.Class({initialize: function(a, b, c) {
        this.col = a;
        this.row = b;
        this.level = c
    },CLASS_NAME: "EzServerClient.TilePositionZ"});
EzServerClient.MapRegionZ = EzServerClient.Class({initialize: function(b, a, d, c, e) {
        this.minx = b;
        this.miny = a;
        this.maxx = d;
        this.maxy = c;
        this.level = e
    },toString: function() {
        return this.minx + "," + this.miny + "," + this.maxx + "," + this.maxy
    },CLASS_NAME: "EzServerClient.MapRegionZ"});
EzServerClient.Layer.TileLayer = EzServerClient.Class(EzServerClient.Layer, {div: null,opacity: 1,name: "",tileInfo: null,url: "",zoomOffset: 0,proxyUrl: "",initialize: function(c, b, a) {
        this.name = c;
        this.url = b;
        this.tileInfo = a;
        this.div = this.createLayerContainer()
    },createLayerContainer: function() {
        var a = document.createElement("div");
        a.name = this.name;
        a.style.position = "absolute";
        return a
    },getTileUrl: function(b, c, d, e, a) {
    },toTileCoords: function(b) {
        var e = this.convertMap2Bitmap(b.x, b.y, b.level);
        var a = Math.floor(e.x / this.tileInfo.width);
        var d = Math.floor(e.y / this.tileInfo.height);
        return new EzServerClient.TilePositionZ(a, d, b.level)
    },toMapCoords: function(b) {
        var a = b.col;
        var c = b.row;
        return new EzServerClient.MapRegionZ(a * this.tileInfo.levelDetails[b.level].resolution * this.tileInfo.width, c * this.tileInfo.levelDetails[b.level].resolution * this.tileInfo.height, (a + 1) * this.tileInfo.levelDetails[b.level].resolution * this.tileInfo.width, (c + 1) * this.tileInfo.levelDetails[b.level].resolution * this.tileInfo.height, b.level)
    },toMapCoords2: function(b) {
        var a = b.col * this.tileInfo.width;
        var c = b.row * this.tileInfo.height;
        return new EzServerClient.MapRegionZ(a * this.tileInfo.levelDetails[b.level].resolution, c * this.tileInfo.levelDetails[b.level].resolution, (a + 1) * this.tileInfo.levelDetails[b.level].resolution, (c + 1) * this.tileInfo.levelDetails[b.level].resolution, b.level)
    },setTileProxy: function(a) {
        this.proxyUrl = a
    },convertPosByFlatMatrix: function(a, c, b) {
        if (!b) {
            var b = new Point(0, 0)
        }
        b.x = this.tileInfo.flatMatrix[0] * a + this.tileInfo.flatMatrix[1] * c + this.tileInfo.flatMatrix[2];
        b.y = this.tileInfo.flatMatrix[3] * a + this.tileInfo.flatMatrix[4] * c + this.tileInfo.flatMatrix[5];
        return b
    },convertPosByFlatMatrixInverse: function(a, c, b) {
        if (!b) {
            var b = new Point(0, 0)
        }
        b.x = (this.tileInfo.flatMatrix[2] * this.tileInfo.flatMatrix[4] - this.tileInfo.flatMatrix[1] * this.tileInfo.flatMatrix[5] - this.tileInfo.flatMatrix[4] * a + this.tileInfo.flatMatrix[1] * c) / (this.tileInfo.flatMatrix[1] * this.tileInfo.flatMatrix[3] - this.tileInfo.flatMatrix[0] * this.tileInfo.flatMatrix[4]);
        b.y = (this.tileInfo.flatMatrix[2] * this.tileInfo.flatMatrix[3] - this.tileInfo.flatMatrix[0] * this.tileInfo.flatMatrix[5] - this.tileInfo.flatMatrix[3] * a + this.tileInfo.flatMatrix[0] * c) / (this.tileInfo.flatMatrix[0] * this.tileInfo.flatMatrix[4] - this.tileInfo.flatMatrix[1] * this.tileInfo.flatMatrix[3]);
        return b
    },convertMap2Bitmap: function(d, c, g, b) {
        if (!b) {
            var b = new Point(0, 0)
        }
        var a = d - this.tileInfo.origin[0];
        var f = c - this.tileInfo.origin[1];
        b = this.convertPosByFlatMatrix(a, f, b);
        b.x = Math.round(b.x / this.tileInfo.levelDetails[g].resolution);
        b.y = Math.round(b.y / this.tileInfo.levelDetails[g].resolution);
        return b
    },convertBitmap2Map: function(a, d, c, b) {
        if (!b) {
            var b = new Point(0, 0)
        }
        a *= this.tileInfo.levelDetails[c].resolution;
        d *= this.tileInfo.levelDetails[c].resolution;
        a += this.tileInfo.origin[0];
        d += this.tileInfo.origin[1];
        b = this.convertPosByFlatMatrixInverse(a, d, b);
        return b
    },show: function() {
        this.div.style.display = ""
    },hide: function() {
        this.div.style.display = "none"
    },getZIndex: function() {
        return this.div.style.zIndex
    },setZIndex: function(a) {
        this.div.style.zIndex = a
    },CLASS_NAME: "EzServerClient.Layer.TileLayer"});
EzServerClient.Layer.EzMapTileLayer2005 = EzServerClient.Class(EzServerClient.Layer.TileLayer, {maxZoomLevel: 18,version: 0.3,initResolution: 2,initialize: function(e, d, c) {
        if (!c) {
            c = {}
        }
        var a = new EzServerClient.Tile.TileInfo();
        a.origin = c.originAnchor || [0, 0];
        a.width = c.tileWidth || 256;
        a.height = c.tileHeight || 256;
        _MapUnitPixels = a.width;
        EzServerClient.GlobeParams.MapUnitPixels = a.width;
        this.setCompatibleParm(c);
        if (this.mapCoordinateType != 1) {
            this.initResolution = this.initResolution * this.mapConvertScale
        }
        var b = this.initResolution;
        var g = 786432000;
        for (var f = 0; f <= this.maxZoomLevel; f++) {
            a.levelDetails.unshift(new EzServerClient.Tile.LevelDetail(f, b, g));
            b /= 2;
            g /= 2
        }
        a.levelDetails[-1] = new EzServerClient.Tile.LevelDetail(-1, b, g);
        b /= 2;
        g /= 2;
        a.levelDetails[-2] = new EzServerClient.Tile.LevelDetail(-2, b, g);
        b /= 2;
        g /= 2;
        a.levelDetails[-3] = new EzServerClient.Tile.LevelDetail(-3, b, g);
        b /= 2;
        g /= 2;
        a.levelDetails[-4] = new EzServerClient.Tile.LevelDetail(-4, b, g);
        if (c.flatMatrix) {
            a.flatMatrix = c.flatMatrix
        } else {
            a.flatMatrix = [1, 0, 0, 0, 1, 0]
        }
        EzServerClient.Layer.TileLayer.prototype.initialize.apply(this, [e, d, a])
    },setCompatibleParm: function(a) {
        if (a.mapConvertScale) {
            this.mapConvertScale = a.mapConvertScale;
            _convert_scale = this.mapConvertScale;
            EzServerClient.GlobeParams.MapConvertScale = this.mapConvertScale
        } else {
            this.mapConvertScale = 114699;
            _convert_scale = 114699;
            EzServerClient.GlobeParams.MapConvertScale = 114699
        }
        if (a.mapConvertOffsetX) {
            this.mapConvertOffsetX = a.mapConvertOffsetX;
            _convert_ofsx = this.mapConvertOffsetX;
            EzServerClient.GlobeParams.MapConvertOffsetX = this.mapConvertOffsetX
        }
        if (a.mapConvertOffsetY) {
            this.mapConvertOffsetY = a.mapConvertOffsetY;
            _convert_ofsy = this.mapConvertOffsetY;
            EzServerClient.GlobeParams.MapConvertOffsetY = this.mapConvertOffsetY
        }
        if (a.mapCoordinateType) {
            this.mapCoordinateType = a.mapCoordinateType;
            _MapSpanScale = this.mapCoordinateType;
            EzServerClient.GlobeParams.MapCoordinateType = this.mapCoordinateType
        } else {
            this.mapCoordinateType = 1;
            _MapSpanScale = 1;
            EzServerClient.GlobeParams.MapCoordinateType = 1
        }
        if (a.zoomLevelSequence) {
            this.zoomLevelSequence = a.zoomLevelSequence;
            EzServerClient.GlobeParams.ZoomLevelSequence = this.zoomLevelSequence
        } else {
            EzServerClient.GlobeParams.ZoomLevelSequence = 0
        }
    },setOffset: function(b) {
        var c = Math.pow(2, b);
        for (var a = 0; a <= this.maxZoomLevel; a++) {
            this.tileInfo.levelDetails[a].resolution *= c;
            this.tileInfo.levelDetails[a].scale *= c
        }
        this.tileInfo.levelDetails[-1].resolution *= c;
        this.tileInfo.levelDetails[-1].scale *= c;
        this.tileInfo.levelDetails[-2].resolution *= c;
        this.tileInfo.levelDetails[-2].scale *= c;
        this.tileInfo.levelDetails[-3].resolution *= c;
        this.tileInfo.levelDetails[-3].scale *= c;
        this.tileInfo.levelDetails[-4].resolution *= c;
        this.tileInfo.levelDetails[-4].scale *= c
    },getTileUrl: function(a, d, j, b, h) {
        if (a == null) {
            var d = d;
            var j = j
        } else {
            var d = a.x + d;
            var j = a.y - j - 1
        }
        var e = this.url.split(",");
        var f = (d + j) % e.length;
        var c = e[f];
        var g = c + "/EzMap?Service=getImage&Type=RGB&ZoomOffset=" + h + "&Col=" + d + "&Row=" + j + "&Zoom=" + b + "&V=" + this.version;
        if (this.proxyUrl) {
            g = this.proxyUrl + "?request=gotourl&url=" + encodeURIComponent(g)
        }
        return g
    },CLASS_NAME: "EzServerClient.Layer.TileLayer.EzMapTileLayer2005"});
EzServerClient.Layer.EzMapTileLayer2010 = EzServerClient.Class(EzServerClient.Layer.TileLayer, {maxZoomLevel: 22,version: 0.3,initResolution: 2,initialize: function(e, d, c) {
        if (!c) {
            c = {}
        }

        var a = new EzServerClient.Tile.TileInfo();
        a.origin = c.originAnchor || [0, 0];
        a.width = c.tileWidth || 256;
        a.height = c.tileHeight || 256;
        _MapUnitPixels = a.width;
        EzServerClient.GlobeParams.MapUnitPixels = a.width;
        this.setCompatibleParm(c);
        if (this.mapCoordinateType != 1) {
            this.initResolution = this.initResolution * this.mapConvertScale
        }
        var b = this.initResolution;
        var g = 786432000;
        for (var f = 0; f <= this.maxZoomLevel; f++) {
            a.levelDetails.push(new EzServerClient.Tile.LevelDetail(f, b, g));
            b /= 2;
            g /= 2
        }
        if (c.flatMatrix) {
            a.flatMatrix = c.flatMatrix
        } else {
            a.flatMatrix = [1, 0, 0, 0, 1, 0]
        }
        EzServerClient.Layer.TileLayer.prototype.initialize.apply(this, [e, d, a])
    },setCompatibleParm: function(a) {
        if (a.mapConvertScale) {
            this.mapConvertScale = a.mapConvertScale;
            _convert_scale = this.mapConvertScale;
            EzServerClient.GlobeParams.MapConvertScale = this.mapConvertScale
        } else {
            this.mapConvertScale = 114699;
            _convert_scale = 114699;
            EzServerClient.GlobeParams.MapConvertScale = 114699
        }
        if (a.mapConvertOffsetX) {
            this.mapConvertOffsetX = a.mapConvertOffsetX;
            _convert_ofsx = this.mapConvertOffsetX;
            EzServerClient.GlobeParams.MapConvertOffsetX = this.mapConvertOffsetX
        }
        if (a.mapConvertOffsetY) {
            this.mapConvertOffsetY = a.mapConvertOffsetY;
            _convert_ofsy = this.mapConvertOffsetY;
            EzServerClient.GlobeParams.MapConvertOffsetY = this.mapConvertOffsetY
        }
        if (a.mapCoordinateType) {
            this.mapCoordinateType = a.mapCoordinateType;
            _MapSpanScale = this.mapCoordinateType;
            EzServerClient.GlobeParams.MapCoordinateType = this.mapCoordinateType
        } else {
            this.mapCoordinateType = 1;
            _MapSpanScale = 1;
            EzServerClient.GlobeParams.MapCoordinateType = 1
        }
        if (a.zoomLevelSequence) {
            this.zoomLevelSequence = a.zoomLevelSequence;
            EzServerClient.GlobeParams.ZoomLevelSequence = this.zoomLevelSequence
        } else {
            EzServerClient.GlobeParams.ZoomLevelSequence = 2
        }
    },setOffset: function(b) {
        var c = Math.pow(2, b);
        for (var a = 0; a <= this.maxZoomLevel; a++) {
            if(!this.tileInfo.levelDetails[a] || !this.tileInfo.levelDetails[a].resolution)
                continue;
            this.tileInfo.levelDetails[a].resolution /= c;
            this.tileInfo.levelDetails[a].scale /= c
        }
    },getTileUrl: function(a, d, j, b, h) {
        if (a == null) {
            var d = d;
            var j = j
        } else {
            var d = a.x + d;
            var j = a.y - j - 1
        }
        var e = this.url.split(",");
        var f = (d + j) % e.length;
        var c = e[f];
        var g = '';
        if(EzServerClient.GlobeParams.IsLocal){
            var arr = c.split('/');
            //var type = arr[arr.length-1];
            if(EzServerClient.GlobeParams.IsDownMap){
                try{
                    g = window.external.OnGetOffLineTileMapCallBack(type, b, d, j);
                    if(g === ''){
                        g = c + "/EzMap?Service=getImage&Type=RGB&ZoomOffset=" + h + "&Col=" + d + "&Row=" + j + "&Zoom=" + b + "&V=" + this.version;
                        window.external.OnDownloadOffLineMapCallBack(g, type, b, d, j);
                    }
                }catch(e){

                }
            }else{
                g = c + b + '/' + d + '_' + j + EzServerClient.GlobeParams.TileImageFormat;
            }
        }
        else{
            g = c + "/EzMap?Service=getImage&Type=RGB&ZoomOffset=" + h + "&Col=" + d + "&Row=" + j + "&Zoom=" + b + "&V=" + this.version;
        }
        
        if (this.proxyUrl) {
            g = this.proxyUrl + "?request=gotourl&url=" + encodeURIComponent(g)
        }
        return g
    },CLASS_NAME: "EzServerClient.Layer.TileLayer.EzMapTileLayer2010"});
EzServerClient.Layer.WMSTileLayer2010 = EzServerClient.Class(EzServerClient.Layer.TileLayer, {maxZoomLevel: 22,version: 0.3,initResolution: 2,layers: 0,transparent: true,initialize: function(e, d, c) {
        if (!c) {
            c = {}
        }
        if (c.layers != null) {
            this.layers = c.layers
        }
        if (c.transparent != null) {
            this.transparent = c.transparent
        }
        var a = new EzServerClient.Tile.TileInfo();
        a.origin = c.originAnchor || [0, 0];
        a.width = c.tileWidth || 256;
        a.height = c.tileHeight || 256;
        _MapUnitPixels = a.width;
        EzServerClient.GlobeParams.MapUnitPixels = a.width;
        this.setCompatibleParm(c);
        if (this.mapCoordinateType != 1) {
            this.initResolution = this.initResolution * this.mapConvertScale
        }
        var b = this.initResolution;
        var g = 786432000;
        for (var f = 0; f <= this.maxZoomLevel; f++) {
            a.levelDetails.push(new EzServerClient.Tile.LevelDetail(f, b, g));
            b /= 2;
            g /= 2
        }
        if (c.flatMatrix) {
            a.flatMatrix = c.flatMatrix
        } else {
            a.flatMatrix = [1, 0, 0, 0, 1, 0]
        }
        EzServerClient.Layer.TileLayer.prototype.initialize.apply(this, [e, d, a])
    },setCompatibleParm: function(a) {
        if (a.mapConvertScale) {
            this.mapConvertScale = a.mapConvertScale;
            _convert_scale = this.mapConvertScale;
            EzServerClient.GlobeParams.MapConvertScale = this.mapConvertScale
        } else {
            this.mapConvertScale = 114699;
            _convert_scale = 114699;
            EzServerClient.GlobeParams.MapConvertScale = 114699
        }
        if (a.mapConvertOffsetX) {
            this.mapConvertOffsetX = a.mapConvertOffsetX;
            _convert_ofsx = this.mapConvertOffsetX;
            EzServerClient.GlobeParams.MapConvertOffsetX = this.mapConvertOffsetX
        }
        if (a.mapConvertOffsetY) {
            this.mapConvertOffsetY = a.mapConvertOffsetY;
            _convert_ofsy = this.mapConvertOffsetY;
            EzServerClient.GlobeParams.MapConvertOffsetY = this.mapConvertOffsetY
        }
        if (a.mapCoordinateType) {
            this.mapCoordinateType = a.mapCoordinateType;
            _MapSpanScale = this.mapCoordinateType;
            EzServerClient.GlobeParams.MapCoordinateType = this.mapCoordinateType
        } else {
            this.mapCoordinateType = 1;
            _MapSpanScale = 1;
            EzServerClient.GlobeParams.MapCoordinateType = 1
        }
        if (a.zoomLevelSequence) {
            this.zoomLevelSequence = a.zoomLevelSequence;
            EzServerClient.GlobeParams.ZoomLevelSequence = this.zoomLevelSequence
        } else {
            EzServerClient.GlobeParams.ZoomLevelSequence = 2
        }
    },setOffset: function(b) {
        var c = Math.pow(2, b);
        for (var a = 0; a <= this.maxZoomLevel; a++) {
            this.tileInfo.levelDetails[a].resolution /= c;
            this.tileInfo.levelDetails[a].scale /= c
        }
    },getTileUrl: function(a, d, m, b, j) {
        var d = a.x + d;
        var m = a.y - m - 1;
        var e = this.url.split(",");
        var f = (d + m) % e.length;
        var c = e[f];
        var l = new EzServerClient.TilePositionZ(d, m, b);
        var h = this.toMapCoords(l);
        var k = h.toString();
        var g = c + "?version=1.1.0&request=GetMap&layers=" + this.layers + "&styles=&bbox=" + k + "&width=256&height=256&srs=EPSG:3785&format=image/png&TRANSPARENT=true";
        if (this.proxyUrl) {
            g = this.proxyUrl + "?request=gotourl&url=" + encodeURIComponent(g)
        }
        return g
    },CLASS_NAME: "EzServerClient.Layer.TileLayer.WMSTileLayer2010"});
EzServerClient.Layer.WMSTileLayer2005 = EzServerClient.Class(EzServerClient.Layer.TileLayer, {maxZoomLevel: 18,version: 0.3,initResolution: 2,layers: 0,transparent: true,initialize: function(e, d, c) {
        if (!c) {
            c = {}
        }
        if (c.layers != null) {
            this.layers = c.layers
        }
        if (c.transparent != null) {
            this.transparent = c.transparent
        }
        var a = new EzServerClient.Tile.TileInfo();
        a.origin = c.originAnchor || [0, 0];
        a.width = c.tileWidth || 256;
        a.height = c.tileHeight || 256;
        _MapUnitPixels = a.width;
        EzServerClient.GlobeParams.MapUnitPixels = a.width;
        this.setCompatibleParm(c);
        if (this.mapCoordinateType != 1) {
            this.initResolution = this.initResolution * this.mapConvertScale
        }
        var b = this.initResolution;
        var g = 786432000;
        for (var f = 0; f <= this.maxZoomLevel; f++) {
            a.levelDetails.unshift(new EzServerClient.Tile.LevelDetail(f, b, g));
            b /= 2;
            g /= 2
        }
        a.levelDetails[-1] = new EzServerClient.Tile.LevelDetail(-1, b, g);
        b /= 2;
        g /= 2;
        a.levelDetails[-2] = new EzServerClient.Tile.LevelDetail(-2, b, g);
        b /= 2;
        g /= 2;
        a.levelDetails[-3] = new EzServerClient.Tile.LevelDetail(-3, b, g);
        b /= 2;
        g /= 2;
        a.levelDetails[-4] = new EzServerClient.Tile.LevelDetail(-4, b, g);
        if (c.flatMatrix) {
            a.flatMatrix = c.flatMatrix
        } else {
            a.flatMatrix = [1, 0, 0, 0, 1, 0]
        }
        EzServerClient.Layer.TileLayer.prototype.initialize.apply(this, [e, d, a])
    },setCompatibleParm: function(a) {
        if (a.mapConvertScale) {
            this.mapConvertScale = a.mapConvertScale;
            _convert_scale = this.mapConvertScale;
            EzServerClient.GlobeParams.MapConvertScale = this.mapConvertScale
        } else {
            this.mapConvertScale = 114699;
            _convert_scale = 114699;
            EzServerClient.GlobeParams.MapConvertScale = 114699
        }
        if (a.mapConvertOffsetX) {
            this.mapConvertOffsetX = a.mapConvertOffsetX;
            _convert_ofsx = this.mapConvertOffsetX;
            EzServerClient.GlobeParams.MapConvertOffsetX = this.mapConvertOffsetX
        }
        if (a.mapConvertOffsetY) {
            this.mapConvertOffsetY = a.mapConvertOffsetY;
            _convert_ofsy = this.mapConvertOffsetY;
            EzServerClient.GlobeParams.MapConvertOffsetY = this.mapConvertOffsetY
        }
        if (a.mapCoordinateType) {
            this.mapCoordinateType = a.mapCoordinateType;
            _MapSpanScale = this.mapCoordinateType;
            EzServerClient.GlobeParams.MapCoordinateType = this.mapCoordinateType
        } else {
            this.mapCoordinateType = 1;
            _MapSpanScale = 1;
            EzServerClient.GlobeParams.MapCoordinateType = 1
        }
        if (a.zoomLevelSequence) {
            this.zoomLevelSequence = a.zoomLevelSequence;
            EzServerClient.GlobeParams.ZoomLevelSequence = this.zoomLevelSequence
        } else {
            EzServerClient.GlobeParams.ZoomLevelSequence = 0
        }
    },setOffset: function(b) {
        var c = Math.pow(2, b);
        for (var a = 0; a <= this.maxZoomLevel; a++) {
            this.tileInfo.levelDetails[a].resolution *= c;
            this.tileInfo.levelDetails[a].scale *= c
        }
        this.tileInfo.levelDetails[-1].resolution *= c;
        this.tileInfo.levelDetails[-1].scale *= c;
        this.tileInfo.levelDetails[-2].resolution *= c;
        this.tileInfo.levelDetails[-2].scale *= c;
        this.tileInfo.levelDetails[-3].resolution *= c;
        this.tileInfo.levelDetails[-3].scale *= c;
        this.tileInfo.levelDetails[-4].resolution *= c;
        this.tileInfo.levelDetails[-4].scale *= c
    },getTileUrl: function(a, d, m, b, j) {
        var d = a.x + d;
        var m = a.y - m - 1;
        var e = this.url.split(",");
        var f = (d + m) % e.length;
        var c = e[f];
        var l = new EzServerClient.TilePositionZ(d, m, b);
        var h = this.toMapCoords(l);
        var k = h.toString();
        var g = c + "?version=1.1.0&request=GetMap&layers=" + this.layers + "&styles=&bbox=" + k + "&width=256&height=256&srs=EPSG:3785&format=image/png&TRANSPARENT=true";
        if (this.proxyUrl) {
            g = this.proxyUrl + "?request=gotourl&url=" + encodeURIComponent(g)
        }
        return g
    },CLASS_NAME: "EzServerClient.Layer.TileLayer.WMSTileLayer2005"});
EzServerClient.Layer.GeoServerTileLayer = EzServerClient.Class(
	EzServerClient.Layer.TileLayer, 
	{maxZoomLevel: EzServerClient.GlobeParams.MapMaxLevel,
	version: EzServerClient.GlobeParams.Version,
	initResolution: EzServerClient.GlobeParams.InitResolution,
	layers: EzServerClient.GlobeParams.Layers,
	transparent: true,
	srs:EzServerClient.GlobeParams.Srs,
	mapUnitPixels:EzServerClient.GlobeParams.MapUnitPixels,
	initialize: function(e, d, c) {
        if (!c) {
            c = {}
        }
        if (c.layers != null) {
            this.layers = c.layers
        }
        if (c.transparent != null) {
            this.transparent = c.transparent
        }
        var a = new EzServerClient.Tile.TileInfo();
        a.origin = c.originAnchor || [0, 0];
        a.width = c.tileWidth || this.mapUnitPixels;
        a.height = c.tileHeight || this.mapUnitPixels;
        _MapUnitPixels = a.width;
        EzServerClient.GlobeParams.MapUnitPixels = a.width;
        this.setCompatibleParm(c);
        if (this.mapCoordinateType != 1) {
            this.initResolution = this.initResolution * this.mapConvertScale
        }
        var b = this.initResolution;
        var g = 786432000;
        for (var f = 0; f <= this.maxZoomLevel; f++) {
            a.levelDetails.push(new EzServerClient.Tile.LevelDetail(f, b, g));
            b /= 2;
            g /= 2
        }
        if (c.flatMatrix) {
            a.flatMatrix = c.flatMatrix
        } else {
            a.flatMatrix = [1, 0, 0, 0, 1, 0]
        }
        EzServerClient.Layer.TileLayer.prototype.initialize.apply(this, [e, d, a])
    },setCompatibleParm: function(a) {
        if (a.mapConvertScale) {
            this.mapConvertScale = a.mapConvertScale;
            _convert_scale = this.mapConvertScale;
            EzServerClient.GlobeParams.MapConvertScale = this.mapConvertScale
        } else {
            this.mapConvertScale = 114699;
            _convert_scale = 114699;
            EzServerClient.GlobeParams.MapConvertScale = 114699
        }
        if (a.mapConvertOffsetX) {
            this.mapConvertOffsetX = a.mapConvertOffsetX;
            _convert_ofsx = this.mapConvertOffsetX;
            EzServerClient.GlobeParams.MapConvertOffsetX = this.mapConvertOffsetX
        }
        if (a.mapConvertOffsetY) {
            this.mapConvertOffsetY = a.mapConvertOffsetY;
            _convert_ofsy = this.mapConvertOffsetY;
            EzServerClient.GlobeParams.MapConvertOffsetY = this.mapConvertOffsetY
        }
        if (a.mapCoordinateType) {
            this.mapCoordinateType = a.mapCoordinateType;
            _MapSpanScale = this.mapCoordinateType;
            EzServerClient.GlobeParams.MapCoordinateType = this.mapCoordinateType
        } else {
            this.mapCoordinateType = 1;
            _MapSpanScale = 1;
            EzServerClient.GlobeParams.MapCoordinateType = 1
        }
        if (a.zoomLevelSequence) {
            this.zoomLevelSequence = a.zoomLevelSequence;
            EzServerClient.GlobeParams.ZoomLevelSequence = this.zoomLevelSequence
        } else {
            EzServerClient.GlobeParams.ZoomLevelSequence = 2
        }
    },setOffset: function(b) {
        var c = Math.pow(2, b);
        for (var a = 0; a <= this.maxZoomLevel; a++) {
            this.tileInfo.levelDetails[a].resolution /= c;
            this.tileInfo.levelDetails[a].scale /= c
        }
    },getTileUrl: function(a, d, m, b, j) {
        var d = a.x + d;
        var m = a.y - m - 1;
        var e = this.url.split(",");
        var f = (d + m) % e.length;
        var c = e[f];
        var l = new EzServerClient.TilePositionZ(d, m, b);
        var h = this.toMapCoords(l);
        var k = h.toString();
        //var g = c + "?version=1.1.0&request=GetMap&layers=" + this.layers + "&styles=&bbox=" + k + "&width="+this.mapUnitPixels+"&height="+this.mapUnitPixels+"&srs=EPSG:3785&format=image/png&TRANSPARENT=true";
        var g = c + "?version="+this.version+"&request=GetMap&layers=" + this.layers + "&styles=&bbox=" + k + "&width="+this.mapUnitPixels+"&height="+this.mapUnitPixels+"&srs="+this.srs+"&format=image/png&TRANSPARENT=true";
        if (this.proxyUrl) {
            g = this.proxyUrl + "?request=gotourl&url=" + encodeURIComponent(g)
        }
        return g
    },CLASS_NAME: "EzServerClient.Layer.TileLayer.GeoServerTileLayer"});    
  
EzServerClient.Layer.JiAoTileLayer = EzServerClient.Class(EzServerClient.Layer.TileLayer, {maxZoomLevel: 18,version: "1.0.0",originAnchor: [-180, 90],width: 256,height: 256,initResolution: 1.4062500262315805,initialize: function(d, c, b) {
        var a = new EzServerClient.Tile.TileInfo();
        a.width = this.width;
        a.height = this.height;
        a.origin = this.originAnchor;
        var f = this.initResolution;
        for (var e = 0; e <= this.maxZoomLevel; e++) {
            a.levelDetails.push(new EzServerClient.Tile.LevelDetail(e, f));
            f /= 2
        }
        EzServerClient.GlobeParams.ZoomLevelSequence = 2;
        EzServerClient.Layer.TileLayer.prototype.initialize.apply(this, [d, c, a])
    },getTileUrl: function(a, d, j, b, h) {
        var d = a.x + d;
        var j = j - a.y;
        var e = this.url.split(",");
        var f = (d + j) % e.length;
        var c = e[f];
        var g = c + "/" + (b) + "/" + j + "/" + d + ".jpg";
        if (this.proxyUrl) {
            g = this.proxyUrl + "?request=gotourl&url=" + encodeURIComponent(g)
        }
        return g
    },setOffset: function(b) {
        var c = Math.pow(2, b);
        for (var a = 0; a <= this.maxZoomLevel; a++) {
            this.tileInfo.levelDetails[a].resolution /= c;
            this.tileInfo.levelDetails[a].scale /= c
        }
    },CLASS_NAME: "EzServerClient.Layer.JiAoTileLayer"});
EzServerClient.Layer.TiledMapServiceLayer = EzServerClient.Class(EzServerClient.Layer.TileLayer, {maxZoomLevel: 18,version: "1.0.0",tiledMapService: null,layers: "",styles: "",transparent: 0,mime: "",time: "",metaProxyUrl: null,parseXml: function(b) {
        b += "?VERSION=" + this.version + "&SERVICE=TMS&REQUEST=GetMetadata";
        var a = window.ActiveXObject ? new ActiveXObject("Microsoft.XMLHTTP") : new XMLHttpRequest();
        if (this.metaProxyUrl) {
            a.open("GET", this.metaProxyUrl + "?request=gotourl&url=" + encodeURIComponent(b), false)
        } else {
            a.open("GET", b, false)
        }
        a.setRequestHeader("Content-Type", "text/xml");
        a.send();
        return EzServerClient.TMSXmlParse.EzFactory.FromXml(a.responseText)
    },setMetaDateProxy: function(a) {
        this.metaProxyUrl = a
    },initialize: function(b, c, l, o, g, q) {
        if (!q) {
            q = {}
        }
        this.layers = l;
        this.styles = o;
        this.metaProxyUrl = q.metaProxyUrl;
        this.time = g;
        this.transparent = q.transparent ? q.transparent : 0;
        this.mime = q.mime ? q.mime : "image/png";
        this.tiledMapService = this.parseXml(c.split(",")[0]);
        this.version = this.tiledMapService.getVersion() || this.version;
        var e = new EzServerClient.Tile.TileInfo();
        var d = this.tiledMapService.getTiledLayers();
        var f = d.get(0);
        var a = f.getTiledFormats();
        var n = a.get(0);
        e.width = parseInt(n.getWidth());
        e.height = parseInt(n.getHeight());
        var m = f.getTiledOrigin();
        e.origin = [parseInt(m.getX()), parseInt(m.getY())];
        var h = f.getTiledSets();
        this.maxZoomLevel = h.size();
        for (var k = 0; k < h.size(); k++) {
            var p = h.get(k);
            e.levelDetails.push(new EzServerClient.Tile.LevelDetail(parseInt(p.getLevel()), parseFloat(p.getUnitsPerPixel())))
        }
        EzServerClient.GlobeParams.ZoomLevelSequence = 2;
        EzServerClient.Layer.TileLayer.prototype.initialize.apply(this, [b, c, e])
    },setOffset: function(b) {
        var c = Math.pow(2, b);
        for (var a = 0; a < this.maxZoomLevel; a++) {
            this.tileInfo.levelDetails[a].resolution /= c;
            this.tileInfo.levelDetails[a].scale /= c
        }
    },getTileUrl: function(a, d, k, b, h) {
        var d = a.x + d;
        var k = a.y - k - 1;
        var e = this.url.split(",");
        var f = (d + k) % e.length;
        var c = e[f];
        var j = b + h;
        var g = c + "?SERVICE=TMS&VERSION=" + this.version + "&REQUEST=GetImage&LAYERS=" + this.layers + "&STYLES=" + this.styles + "&TRANSPARENT=" + this.transparent + "&MIME=" + this.mime + "&LEVEL=" + j + "&ROW=" + k + "&COL=" + d + "&TIME=" + this.time;
        if (this.proxyUrl) {
            g = this.proxyUrl + "?request=gotourl&url=" + encodeURIComponent(g)
        }
        return g
    },CLASS_NAME: "EzServerClient.Layer.TiledMapServiceLayer"});
EzServerClient.Layer.TianDiTuTileLayer = EzServerClient.Class(EzServerClient.Layer.TileLayer, {maxZoomLevel: 18,version: "1.0.0",origin: [-180, 90],width: 256,height: 256,initResolution: 1.40625,initialize: function(c, b) {
        var a = new EzServerClient.Tile.TileInfo();
        a.width = this.width;
        a.height = this.height;
        a.origin = this.origin;
        var e = this.initResolution;
        for (var d = 0; d <= this.maxZoomLevel; d++) {
            a.levelDetails.push(new EzServerClient.Tile.LevelDetail(d, e));
            e /= 2
        }
        EzServerClient.GlobeParams.ZoomLevelSequence = 2;
        EzServerClient.Layer.TileLayer.prototype.initialize.apply(this, [c, b, a])
    },getTileUrl: function(a, d, j, b, h) {
        var d = a.x + d;
        var j = j - a.y;
        var e = this.url.split(",");
        var f = (d + j) % e.length;
        var c = e[f];
        var g = c + "&X=" + d + "&Y=" + j + "&L=" + (b + h);
        if (this.proxyUrl) {
            g = this.proxyUrl + "?request=gotourl&url=" + encodeURIComponent(g)
        }
        return g
    },setOffset: function(b) {
        var c = Math.pow(2, b);
        for (var a = 0; a <= this.maxZoomLevel; a++) {
            this.tileInfo.levelDetails[a].resolution /= c;
            this.tileInfo.levelDetails[a].scale /= c
        }
    },CLASS_NAME: "EzServerClient.Layer.TianDiTuTileLayer"});
EzServerClient.Layer.GoogleTileLayer = EzServerClient.Class(EzServerClient.Layer.TileLayer, {maxZoomLevel: 18,version: "1.0.0",origin: [0, 20037508.342789248],width: 256,height: 256,initResolution: 156543.033928041,initialize: function(c, b) {
        var a = new EzServerClient.Tile.TileInfo();
        a.width = this.width;
        a.height = this.height;
        a.origin = this.origin;
        var e = this.initResolution;
        for (var d = 0; d <= this.maxZoomLevel; d++) {
            a.levelDetails.push(new EzServerClient.Tile.LevelDetail(d, e));
            e /= 2
        }
        //EzServerClient.GlobeParams.ZoomLevelSequence = 2;
        EzServerClient.Layer.TileLayer.prototype.initialize.apply(this, [c, b, a])
    },getTileUrl: function(a, d, j, b, h) {
        var d = a.x + d;
        var j = j - a.y;
        var e = this.url.split(",");
        var f = (d + j) % e.length;
        var c = e[f];
        var g = '';
		var z = b + h;
        if(EzServerClient.GlobeParams.IsLocal){
            var arr = c.split('/');
            //var type = arr[arr.length-2];
			var m = c.substring(c.indexOf('=') + 1,c.indexOf('@'));
            g = c + z + '/' + 'm' + '_' + z + '_' + d + '_' + j + EzServerClient.GlobeParams.TileImageFormat;
        }else{
            if(EzServerClient.GlobeParams.IsDownMap){
                try{
                    g = window.external.GetGoogleOffLineTileMap(type, z, m, z, d, j);
                    if(g === ''){
                      g = c + "&hl=zh-CN&gl=CN&src=app&x=" + d + "&y=" + j + "&z=" + z;
                      switch (f) {
                        case 0:
                            g += "&s=Galile";
                            break;
                        case 1:
                            g += "&s=Gal";
                            break;
                        case 2:
                            g += "&s=Galileo";
                            break;
                        }
                      window.external.GoogleDownloadOffLineMap(g, type, z, m, z, d, j);
                    }           
                }catch(e){

                }
            }else{
                g = c + "&hl=zh-CN&gl=CN&src=app&x=" + d + "&y=" + j + "&z=" + z;
                switch (f) {
                    case 0:
                        g += "&s=Galile";
                        break;
                    case 1:
                        g += "&s=Gal";
                        break;
                    case 2:
                        g += "&s=Galileo";
                        break;
                }
            }
        }
                
        if (this.proxyUrl) {
            g = this.proxyUrl + "?request=gotourl&url=" + encodeURIComponent(g)
        }
        return g
    },setOffset: function(b) {
        var c = Math.pow(2, b);
        for (var a = 0; a <= this.maxZoomLevel; a++) {
            this.tileInfo.levelDetails[a].resolution /= c;
            this.tileInfo.levelDetails[a].scale /= c
        }
    },CLASS_NAME: "EzServerClient.Layer.GoogleTileLayer"});
EzServerClient.Layer.ArcGISTileLayer = EzServerClient.Class(EzServerClient.Layer.TileLayer, {maxZoomLevel: 20,version: "1.0.0",origin: [-20037508.342789248, 20037508.342789248],width: 256,height: 256,initResolution: 156543.033928041,initialize: function(c, b) {
        var a = new EzServerClient.Tile.TileInfo();
        a.width = this.width;
        a.height = this.height;
        a.origin = this.origin;
        var e = this.initResolution;
        for (var d = 0; d <= this.maxZoomLevel; d++) {
            a.levelDetails.push(new EzServerClient.Tile.LevelDetail(d, e));
            e /= 2
        }
        //EzServerClient.GlobeParams.ZoomLevelSequence = 2;
        EzServerClient.Layer.TileLayer.prototype.initialize.apply(this, [c, b, a])
    },getTileUrl: function(a, d, j, b, h) {
        var d = a.x + d;
        var j = j - a.y;
        var e = this.url.split(",");
        var f = (d + j) % e.length;
        var c = e[f];
        var g = c + "/tile/" + (b + h) + "/" + j + "/" + d;
        if (this.proxyUrl) {
            g = this.proxyUrl + "?request=gotourl&url=" + encodeURIComponent(g)
        }
        return g
    },setOffset: function(b) {
        var c = Math.pow(2, b);
        for (var a = 0; a <= this.maxZoomLevel; a++) {
            this.tileInfo.levelDetails[a].resolution /= c;
            this.tileInfo.levelDetails[a].scale /= c
        }
    },CLASS_NAME: "EzServerClient.Layer.ArcGISTileLayer"});
EzServerClient.Layer.HotSpotTileLayer = EzServerClient.Class(EzServerClient.Layer.TileLayer, {sourceType: "webcontainer",crsType: "Geog(256)",filter: null,label: null,initialize: function(c, b, a) {
        this.crsType = (this.mapCoordinateType == 1) ? ("Geog(" + a.width + ")") : ("Proj(" + a.width + ")");
        EzServerClient.Layer.TileLayer.prototype.initialize.apply(this, ["hotspotLyr", b, a])
    },makeJsonStr: function(b, a) {
        if (b == null) {
            return ""
        }
        var c = '{"spatialfilters":';
        c += '[{"relation":"' + (b.relation || "overlap") + '"';
        c += ',"buffersize":"' + (b.buffersize || "0") + '"';
        c += ',"bufferunit":"' + (b.bufferunit || "degree") + '"';
        c += ',"shape":[{';
        c += '"geotype":"' + (b.geotype || "polygon") + '"';
        c += ',"coords":"' + (b.coords || a) + '"';
        c += "}]}]}";
        return "&spatialfilters=" + c
    },getTileUrl: function(a, d, o, b, l) {
        var d = a.x + d;
        var o = a.y - o - 1;
        var e = this.url.split(",");
        var g = (d + o) % e.length;
        var c = e[g];
        var n = b + l;
        var f = n;
        if (this.zoomLevelSequence == 2) {
            f = 18 - n
        }
        var m = new EzServerClient.TilePositionZ(d, o, b);
        var j = this.toMapCoords(m);
        var k = [j.minx, j.miny, j.maxx, j.miny, j.maxx, j.maxy, j.minx, j.maxy].join(",");
        var h = c + (this.sourceType.toLocaleLowerCase() == "ezserver" ? "/EzMap?Service=getHotspot&ZoomOffset=" + l + "&Col=" + d + "&Row=" + o + "&Zoom=" + b : this.sourceType.toLocaleLowerCase() == "ezmapservice" ? "&col=" + d + "&row=" + o + "&zoom=" + f + "&crs=" + this.crsType + this.makeJsonStr(this.filter, k) : "/z" + n + "/x" + d + "/z" + n + "_x" + d + "_y" + o);
        if (this.proxyUrl) {
            h = this.proxyUrl + "?request=gotourl&url=" + encodeURIComponent(h)
        }
        return h + "&timestamp=" + new Date().getTime().valueOf()
    },createLayerContainer: function() {
        var a = document.createElement("map");
        a.style.position = "absolute";
        a.id = this.name;
        return a
    },setAreaPorp: function(vLyr, vEvent, vFunc, vHotSpot, vMap, vArea) {
        eval("vArea." + vEvent + "=function(){vFunc(vHotSpot)}");
        vArea.ondblclick = function() {
            window.event.cancelBubble = true
        };
        vArea.onmouseover = function() {
            vMap.hotspotImg.style.cursor = "pointer";
            if (vLyr.isDisplayProfile && !vMap.bIsPaning) {
                __show(vArea, vMap)
            }
        };
        vArea.onmouseout = function() {
            vMap.hotspotImg.style.cursor = "";
            if (vLyr.isDisplayProfile && !vMap.bIsPaning) {
                __hide()
            }
        };
        return vArea
    },CLASS_NAME: "EzServerClient.Layer.HotSpotTileLayer"});
EzServerClient.Layer.HotSpotTileLayer2005 = EzServerClient.Class(EzServerClient.Layer.HotSpotTileLayer, {maxZoomLevel: 18,version: 0.3,initResolution: 2,eventName: "",callback: null,isDisplayProfile: false,hotspot2d: false,levelLimit: [],hotspotIconUrl: "",initialize: function(a, h, g, j, b, k) {
        if (!k) {
            k = {}
        }
        this.eventName = g;
        this.callback = j;
        this.isDisplayProfile = h;
        var d = new EzServerClient.Tile.TileInfo();
        d.origin = k.originAnchor || [0, 0];
        d.width = k.tileWidth || 256;
        d.height = k.tileHeight || 256;
        if (k.flatMatrix) {
            d.flatMatrix = k.flatMatrix
        } else {
            d.flatMatrix = [1, 0, 0, 0, 1, 0]
        }
        this.hotspot2d = k.hotspot2d || false;
        this.levelLimit = k.levelLimit || [];
        this.hotspotIconUrl = k.hotspotIconUrl || "";
        this.sourceType = k.sourceType || "webcontainer";
        this.filter = k.filter || null;
        this.label = k.label || "";
        _MapUnitPixels = d.width;
        EzServerClient.GlobeParams.MapUnitPixels = d.width;
        this.setCompatibleParm(k);
        if (this.mapCoordinateType != 1) {
            this.initResolution = this.initResolution * this.mapConvertScale
        }
        var c = this.initResolution;
        var e = 786432000;
        for (var f = 0; f <= this.maxZoomLevel; f++) {
            d.levelDetails.unshift(new EzServerClient.Tile.LevelDetail(f, c, e));
            c /= 2;
            e /= 2
        }
        d.levelDetails[-1] = new EzServerClient.Tile.LevelDetail(-1, c, e);
        c /= 2;
        e /= 2;
        d.levelDetails[-2] = new EzServerClient.Tile.LevelDetail(-2, c, e);
        c /= 2;
        e /= 2;
        d.levelDetails[-3] = new EzServerClient.Tile.LevelDetail(-3, c, e);
        c /= 2;
        e /= 2;
        d.levelDetails[-4] = new EzServerClient.Tile.LevelDetail(-4, c, e);
        EzServerClient.Layer.HotSpotTileLayer.prototype.initialize.apply(this, [a, b, d])
    },setCompatibleParm: function(a) {
        if (a.mapConvertScale) {
            this.mapConvertScale = a.mapConvertScale;
            _convert_scale = this.mapConvertScale;
            EzServerClient.GlobeParams.MapConvertScale = this.mapConvertScale
        } else {
            this.mapConvertScale = 114699;
            _convert_scale = 114699;
            EzServerClient.GlobeParams.MapConvertScale = 114699
        }
        if (a.mapConvertOffsetX) {
            this.mapConvertOffsetX = a.mapConvertOffsetX;
            _convert_ofsx = this.mapConvertOffsetX;
            EzServerClient.GlobeParams.MapConvertOffsetX = this.mapConvertOffsetX
        }
        if (a.mapConvertOffsetY) {
            this.mapConvertOffsetY = a.mapConvertOffsetY;
            _convert_ofsy = this.mapConvertOffsetY;
            EzServerClient.GlobeParams.MapConvertOffsetY = this.mapConvertOffsetY
        }
        if (a.mapCoordinateType) {
            this.mapCoordinateType = a.mapCoordinateType;
            _MapSpanScale = this.mapCoordinateType;
            EzServerClient.GlobeParams.MapCoordinateType = this.mapCoordinateType
        } else {
            this.mapCoordinateType = 1;
            _MapSpanScale = 1;
            EzServerClient.GlobeParams.MapCoordinateType = 1
        }
        if (a.zoomLevelSequence) {
            this.zoomLevelSequence = a.zoomLevelSequence;
            EzServerClient.GlobeParams.ZoomLevelSequence = this.zoomLevelSequence
        } else {
            EzServerClient.GlobeParams.ZoomLevelSequence = 0
        }
    },setOffset: function(b) {
        var c = Math.pow(2, b);
        for (var a = 0; a <= this.maxZoomLevel; a++) {
            this.tileInfo.levelDetails[a].resolution *= c;
            this.tileInfo.levelDetails[a].scale *= c
        }
        this.tileInfo.levelDetails[-1].resolution *= c;
        this.tileInfo.levelDetails[-1].scale *= c;
        this.tileInfo.levelDetails[-2].resolution *= c;
        this.tileInfo.levelDetails[-2].scale *= c;
        this.tileInfo.levelDetails[-3].resolution *= c;
        this.tileInfo.levelDetails[-3].scale *= c;
        this.tileInfo.levelDetails[-4].resolution *= c;
        this.tileInfo.levelDetails[-4].scale *= c
    },CLASS_NAME: "EzServerClient.Layer.HotSpotTileLayer2005"});
EzServerClient.Layer.HotSpotTileLayer2010 = EzServerClient.Class(EzServerClient.Layer.HotSpotTileLayer, {maxZoomLevel: 20,version: 0.3,initResolution: 2,eventName: "",callback: null,isDisplayProfile: false,hotspot2d: false,levelLimit: [],hotspotIconUrl: "",initialize: function(a, h, g, j, b, k) {
        if (!k) {
            k = {}
        }
        this.eventName = g;
        this.callback = j;
        this.isDisplayProfile = h;
        var d = new EzServerClient.Tile.TileInfo();
        d.origin = k.originAnchor || [0, 0];
        d.width = k.tileWidth || 256;
        d.height = k.tileHeight || 256;
        if (k.flatMatrix) {
            d.flatMatrix = k.flatMatrix
        } else {
            d.flatMatrix = [1, 0, 0, 0, 1, 0]
        }
        this.hotspot2d = k.hotspot2d || false;
        this.levelLimit = k.levelLimit || [];
        this.hotspotIconUrl = k.hotspotIconUrl || "";
        this.sourceType = k.sourceType || "webcontainer";
        this.filter = k.filter || null;
        this.label = k.label || "";
        _MapUnitPixels = d.width;
        EzServerClient.GlobeParams.MapUnitPixels = d.width;
        this.setCompatibleParm(k);
        if (this.mapCoordinateType != 1) {
            this.initResolution = this.initResolution * this.mapConvertScale
        }
        var c = this.initResolution;
        var e = 786432000;
        for (var f = 0; f <= this.maxZoomLevel; f++) {
            d.levelDetails.push(new EzServerClient.Tile.LevelDetail(f, c, e));
            c /= 2;
            e /= 2
        }
        EzServerClient.Layer.HotSpotTileLayer.prototype.initialize.apply(this, [a, b, d])
    },setCompatibleParm: function(a) {
        if (a.mapConvertScale) {
            this.mapConvertScale = a.mapConvertScale;
            _convert_scale = this.mapConvertScale;
            EzServerClient.GlobeParams.MapConvertScale = this.mapConvertScale
        } else {
            this.mapConvertScale = 114699;
            _convert_scale = 114699;
            EzServerClient.GlobeParams.MapConvertScale = 114699
        }
        if (a.mapConvertOffsetX) {
            this.mapConvertOffsetX = a.mapConvertOffsetX;
            _convert_ofsx = this.mapConvertOffsetX;
            EzServerClient.GlobeParams.MapConvertOffsetX = this.mapConvertOffsetX
        }
        if (a.mapConvertOffsetY) {
            this.mapConvertOffsetY = a.mapConvertOffsetY;
            _convert_ofsy = this.mapConvertOffsetY;
            EzServerClient.GlobeParams.MapConvertOffsetY = this.mapConvertOffsetY
        }
        if (a.mapCoordinateType) {
            this.mapCoordinateType = a.mapCoordinateType;
            _MapSpanScale = this.mapCoordinateType;
            EzServerClient.GlobeParams.MapCoordinateType = this.mapCoordinateType
        } else {
            this.mapCoordinateType = 1;
            _MapSpanScale = 1;
            EzServerClient.GlobeParams.MapCoordinateType = 1
        }
        if (a.zoomLevelSequence) {
            this.zoomLevelSequence = a.zoomLevelSequence;
            EzServerClient.GlobeParams.ZoomLevelSequence = this.zoomLevelSequence
        } else {
            EzServerClient.GlobeParams.ZoomLevelSequence = 2
        }
    },setOffset: function(b) {
        var c = Math.pow(2, b);
        for (var a = 0; a <= this.maxZoomLevel; a++) {
            this.tileInfo.levelDetails[a].resolution /= c;
            this.tileInfo.levelDetails[a].scale /= c
        }
    },CLASS_NAME: "EzServerClient.Layer.HotSpotTileLayer2010"});
EzServerClient.SynAddScript = function(b, a) {
    var c = XMLHttp.create();
    c.OnReadyStateChange = function() {
        if (c.readyState == 4) {
            if (c.status == 200 || c.status == 304) {
                EzServerClient.IncludeJS(b, a, c.responseText)
            } else {
                alert("XML request error: " + c.statusText + " (" + c.status + ")")
            }
        }
    };
    c.open("GET", a, true);
    c.send(null)
};
EzServerClient.IncludeJS = function(b, a, e) {
    if ((e != null) && (!document.getElementById(b))) {
        var d = document.getElementsByTagName("HEAD").item(0);
        var c = document.createElement("script");
        c.language = "javascript";
        c.type = "text/javascript";
        c.id = b;
        c.defer = true;
        c.text = e;
        d.appendChild(c)
    }
};
EzServerClient.AsynAddScript = function(b, d, c) {
    var a = document.createElement("script");
    a.src = d;
    a.type = "text/javascript";
    a.language = "javascript";
    a.id = b;
    document.getElementsByTagName("head")[0].appendChild(a);
    a.onreadystatechange = c
};
EzServerClient.AsynAddScriptByAjax = function(c, b, a) {
    var d = window.ActiveXObject ? new ActiveXObject("Microsoft.XMLHTTP") : new XMLHttpRequest();
    d.onreadystatechange = function() {
        if (d.readyState == 4) {
            if (d.status == 200 || d.status == 304) {
                b(d.responseText)
            } else {
                a()
            }
        }
    };
    d.open("GET", c, true);
    d.send(null)
};

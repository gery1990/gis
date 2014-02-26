var _Point = Point;
var _Map = MainFrame;
var _IconClass = Icon;
var _XMLHttp = XMLHttp;
var _MapsApplication = MapsApp;
var EzMap = MapsApp;
var _Timer = Timer;
var _Log = EzLog;
MutiMaps = MultiMaps;
Point.getDistPoint = function(h, d, b) {
    var g = new Point();
    var f = h.distanceFrom(d);
    if (b > f || f == 0) {
        return d
    }
    var c = h.x + b * (d.x - h.x) / f;
    var a = h.y + b * (d.y - h.y) / f;
    if (isNaN(c) || isNaN(a)) {
        alert("坐标计算有问题,x:" + c + ",:" + a);
        throw new Error(101, "startPoint:" + h.toString() + ",endPoint:" + d.toString() + ",len:" + f)
    }
    g.x = c;
    g.y = a;
    return g
};
MBR.intersection = function(a, c) {
    try {
        if (!EzServerClient.GlobeFunction.isTypeRight(a, "MBR")) {
            throw EzErrorFactory.createError("MBR.intersection方法中arguments[0]参数类型不正确")
        }
        if (!EzServerClient.GlobeFunction.isTypeRight(c, "MBR")) {
            throw EzErrorFactory.createError("MBR.intersection方法中arguments[1]参数类型不正确")
        }
        if (a.maxX < c.minX || a.maxY < c.minY || c.maxX < a.minX || c.maxY < a.minY) {
            throw EzErrorFactory.createError("arguments[0]和arguments[1]两个MBR之间没有交集")
        } else {
            return new MBR(Math.max(a.minX, c.minX), Math.max(a.minY, c.minY), Math.min(a.maxX, c.maxX), Math.min(a.maxY, c.maxY))
        }
    } catch (b) {
        throw EzErrorFactory.createError("MBR.intersection方法执行不正确", b)
    }
};
MBR.union = function(a, c) {
    try {
        if (!EzServerClient.GlobeFunction.isTypeRight(a, "MBR")) {
            throw EzErrorFactory.createError("MBR.union方法中arguments[0]参数类型不正确")
        }
        if (!EzServerClient.GlobeFunction.isTypeRight(c, "MBR")) {
            throw EzErrorFactory.createError("MBR.union方法中arguments[1]参数类型不正确")
        }
        return new MBR(Math.min(a.minX, c.minX), Math.min(a.minY, c.minY), Math.max(a.maxX, c.maxX), Math.max(a.maxY, c.maxY))
    } catch (b) {
        throw EzErrorFactory.createError("MBR.union方法执行不正确", b)
    }
};
MainFrame.sortByPriority = function(f, d) {
    var g = d.priority - f.priority;
    return g
};
MainFrame.orderLocations = function(b, a) {
    if (b.point.y > a.point.y) {
        return -1
    }
    if (b.point.y < a.point.y) {
        return 1
    }
    return 0
};
Icon.classes = {};
Icon.classNames = [];
Icon.getPadding = function() {
    var b = {top: 0,left: 0,bottom: 0,right: 0};
    for (var c = 0; c < this.classNames.length; ++c) {
        var d = this.classes[this.classNames[c]];
        b.top = Math.max(b.top, d.pointCoord.y);
        b.bottom = Math.max(b.bottom, d.height - d.pointCoord.y);
        b.left = Math.max(b.left, d.pointCoord.x);
        b.right = Math.max(b.right, d.width - d.pointCoord.x)
    }
    return b
};
Icon.load = function(a) {
    Icon.classes[a.name] = a;
    Icon.classNames.push(a.name)
};
Icon.get = function(a) {
    return Icon.classes[a]
};
var xh = [9, 0, 6, 1, 4, 2, 2, 4, 0, 8, 0, 12, 1, 14, 2, 16, 5, 19, 7, 23, 8, 26, 9, 30, 9, 34, 11, 34, 11, 30, 12, 26, 13, 24, 14, 21, 16, 18, 18, 16, 20, 12, 20, 8, 18, 4, 16, 2, 15, 1, 13, 0];
Icon.load(new Icon("local", 20, 34, new Point(9, 34), new Point(9, 2), new Point(17, 23), _ImageBaseUrl + "shadow50.png", 37, xh));
Icon.load(new Icon("noicon", 0, 0, new Point(0, 0), new Point(0, 0), new Point(0, 0), null, 0, null));
EzLog.bLog = true;
EzLog.write = function() {
};
EzLog.writeRaw = function(a) {
};
EzLog.writeXML = function(a) {
};
EzLog.dump = function(a) {
};
EzLog.incompatible = function() {
};
EzLog.clear = function() {
};
_debugWin = null;
EzLog.print = function(b) {
    if (_debugWin == null) {
        var a = "width=200,height=400";
        a = a + ",menubar=yes,scrollbars=yes,resizable=no,location=no, status=no";
        _debugWin = window.open("", "default", a);
        _debugWin.document.writeln("<html><head><title>地图打印</title><script>function unload(){opener._debugWin=null;}<\/script></head><body onbeforeunload='unload()'></body></html>")
    }
    _debugWin.document.body.innerHTML += "<br>" + b
};
Timer.start = function() {
};
Timer.end = function() {
};
Timer.addTime = function(a) {
};
Function.method("inherits", function(b) {
    var f = 0, c = (this.prototype = new b());
    this.method("uber", function a(g) {
        var j, i, h = f, d = b.prototype;
        if (h) {
            while (h) {
                d = d.constructor.prototype;
                h -= 1
            }
            j = d[g]
        } else {
            j = c[g];
            if (j == this[g]) {
                j = d[g]
            }
        }
        f += 1;
        i = j.apply(this, Array.prototype.slice.apply(arguments, [1]));
        f -= 1;
        return i
    });
    return this
});
Function.method("swiss", function(c) {
    for (var b = 1; b < arguments.length; b += 1) {
        var a = arguments[b];
        this.prototype[a] = c.prototype[a]
    }
    return this
});
EzManager.valid = function(c, d, f) {
    window.status = "进行验证....";
    var a = new Date();
    var b = m_strBasePath + "/js/EzMap_allow.jsp?UserName=" + c + "&Password=" + d + "&IP=" + f + "&time=" + a.getTime();
    getDataFromServer("log", b, function() {
        window.status = "验证....完成"
    })
};
iOverLay.closeInfo = function() {
    if (this.timeout) {
        clearTimeout(this.timeout)
    }
    this.timeout = this.setTimeout("this.closeInfoWait(false)", 0)
};
iOverLay.closeInfoWait = function(b) {
    if (!b && this.bOutOfInfo == false) {
        return
    }
    var a = document.getElementById("InfoDiv");
    if (a) {
        a.style.display = "none"
    }
};
MapsApp.getMeter = function(d, c) {
    var a = new Point(d.x + c, d.y);
    var b = GetDistanceInLL(d, a);
    return b
};
MapsApp.getDegree = function(f, c) {
    var b = 1;
    var a = new Point(f.x + b, f.y);
    var g = GetDistanceInLL(f, a);
    var d = b * c / g;
    return d
};
MultiMaps.curMap = null;
EzServerClient.GlobeParams.VersionArr = [];
EzServerClient.GlobeParams.VersionInfo = [];
EzServerClient.GlobeParams.VersionInfo.push("defaultMapVersion");
MainFrame.addVersion = function(a, b) {
    if (b && b instanceof MapServer) {
        EzServerClient.GlobeParams.VersionArr[a] = b;
        EzServerClient.GlobeParams.VersionInfo.push(a)
    } else {
        if (b && b instanceof EzServerClient.GroupLayer) {
            EzServerClient.GlobeParams.VersionArr[a] = b;
            EzServerClient.GlobeParams.VersionInfo.push(a)
        } else {
            alert("pMapServer为空或不是MapServer类型！")
        }
    }
};
MainFrame.getVersionInfo = function() {
    return EzServerClient.GlobeParams.VersionInfo.join(",")
};
MapsApp.getVersionInfo = function() {
    return EzServerClient.GlobeParams.VersionInfo.join(",")
};
MapsApp.addVersion = function(a, b) {
    try {
        if (!EzServerClient.GlobeFunction.isTypeRight(a, "string")) {
            throw EzErrorFactory.createError("EzMap.addVersion方法中arguments[0]类型不正确")
        }
        if ((!EzServerClient.GlobeFunction.isTypeRight(b, "MapServer")) && (!EzServerClient.GlobeFunction.isTypeRight(b, "EzServerClient.GroupLayer"))) {
            throw EzErrorFactory.createError("EzMap.addVersion方法中arguments[1]类型不正确")
        }
        MainFrame.addVersion(a, b)
    } catch (c) {
        throw EzErrorFactory.createError("EzMap.addVersion方法执行不正确", c)
    }
};
EzColorPicker.close = function() {
    if (g_color_palette) {
        g_color_palette.style.display = "none"
    }
};
divCreator.count = 0;
divCreator.createElement = function(h, b, g) {
    if (typeof arguments.callee.hasFilters == "undefined") {
        var a = document.createElement("DIV");
        arguments.callee.hasFilters = typeof a.style.filter != "undefined"
    }
    var c;
    if (arguments.callee.hasFilters) {
        if (!g) {
            g = document
        }
        var d = g.PNG_cache;
        if (d && d.childNodes.length > 0) {
            c = d.removeChild(d.lastChild)
        } else {
            c = g.createElement("DIV");
            divCreator.destroyBeforeUnload(c)
        }
        if (!c.loader) {
            c.loader = g.createElement("img");
            c.loader.style.visibility = "hidden";
            c.loader.onload = function() {
                if (!c.cleared) {
                    c.style.filter = divCreator.alphaImageLoader(this.src, true)
                }
            }
        }
    } else {
        c = document.createElement("img")
    }
    divCreator.setImage(c, h, b);
    return c
};
divCreator.create = function(i, b, h, d, c, a, g, f) {
    return Shaderer.create(i, b, h, d, c, a, g, f, divCreator.createElement)
};
divCreator.alphaImageLoader = function(g, f) {
    var i = "DXImageTransform.Microsoft.AlphaImageLoader";
    var h = ",sizingMethod=" + (f ? "crop" : "scale");
    return "progid:" + i + '(src="' + g + '"' + h + ")"
};
divCreator.remove = function(d, c) {
    if (d.nodeName == "DIV") {
        if (!c.PNG_cache) {
            c.PNG_cache = c.createElement("div");
            c.PNG_cache.style.display = "none";
            c.body.appendChild(c.PNG_cache)
        }
        c.PNG_cache.appendChild(d);
        divCreator.clearImage(d)
    } else {
        RemoveImg(d)
    }
};
Shaderer.create = function(b, c, a, g, l, j, h, k, d) {
    var i;
    if (!d) {
        i = document.createElement("IMG");
        if (b) {
            i.src = b
        }
    } else {
        i = d(b, h, k)
    }
    if (c && a) {
        i.style.width = convert2Px(c);
        i.style.height = convert2Px(a);
        i.width = c;
        i.height = a
    }
    if (l || (g || (l == 0 || g == 0))) {
        i.style.position = "absolute";
        i.style.left = convert2Px(g);
        i.style.top = convert2Px(l)
    }
    if (_IEBrowser.type == 1) {
        i.unselectable = "on";
        i.onselectstart = _NoAction
    } else {
        i.style.MozUserSelect = "none"
    }
    i.style.border = "0";
    i.oncontextmenu = _NoAction;
    return i
};
xa.create = function(a) {
    if (!a) {
        a = "_dtc"
    }
    if (!sb[a]) {
        sb[a] = 1
    } else {
        sb[a]++
    }
    return new xa(sb[a], a)
};
xa.invalidateAll = function() {
    for (var d in sb) {
        try {
            sb[d]++
        } catch (c) {
        }
    }
};
xa.invalidate = function(a) {
    sb[a]++
};
XMLHttp.create = function() {
    if (typeof ActiveXObject != "undefined") {
        return new ActiveXObject("Microsoft.XMLHTTP")
    } else {
        if (typeof XMLHttpRequest != "undefined") {
            return new XMLHttpRequest()
        } else {
            return null
        }
    }
};
V.cache_ = new Object();
V.create = function(a) {
    return new V(a)
};
V.getCached = function(a) {
    return V.cache_[a]
};
V.cache = function(b, a) {
    V.cache_[b] = a
};
V.asynchronousTransform = function(c, h, b, f, g) {
    var a = V.getCached(b);
    var d = bindingDoc("");
    var a = V.create(d);
    a.transformToHTML(c, h);
    V.cache(b, a);
    if (f) {
        f()
    } else {
        alert("no function")
    }
    return
};
delete Object.prototype.setTimeout;
delete Object.prototype.toStringSize;
delete Object.prototype._setTimeoutDispatcher;
delete Object.prototype.eventHandler;
delete Object.prototype.Clone;
if (typeof EzObject == "undefined" || !EzObject) {
    var EzObject = function() {
        this.setTimeout = function(ie, Bi) {
            var ke = "tempVar" + _m_iSeq;
            _m_iSeq++;
            if (_m_iSeq == Number.MAX_VALUE - 1) {
                _m_iSeq = 0
            }
            eval(ke + " = this;");
            if (typeof (ie.replace) != "function") {
                return window.setTimeout(";", Bi)
            } else {
                var Rh = ie.replace(/\\/g, "\\\\").replace(/\"/g, '\\"');
                return window.setTimeout(ke + '._setTimeoutDispatcher("' + Rh + '");', Bi)
            }
        };
        this.toStringSize = function(intTmp, size) {
            var str = intTmp + "";
            while (str.length < size) {
                str = "0" + str
            }
            return str
        };
        this._setTimeoutDispatcher = function(ie) {
            eval(ie)
        };
        this.eventHandler = function(tg) {
            var g = this;
            return function(b) {
                if (!b) {
                    b = window.event
                }
                if (b && !b.target) {
                    b.target = b.srcElement
                }
                g[tg](b)
            }
        };
        this.Clone = function() {
            if (!this.constructor) {
                return this
            }
            var objClone = new this.constructor();
            for (var key in this) {
                if (typeof (this[key]) == "object") {
                    if (this[key] != null && typeof (this[key]["Clone"]) == "function") {
                        objClone[key] = this[key].Clone()
                    } else {
                        objClone[key] = this[key]
                    }
                } else {
                    objClone[key] = this[key]
                }
            }
            if (!objClone || ("" + objClone) == "") {
                return (new String(this) + objClone) ? this : objClone
            } else {
                objClone.toString = this.toString;
                return objClone
            }
        };
        this.dispatchEvent = function(eventType, eventArgs) {
            eventArgs = eventArgs || {};
            var events = this["on" + eventType];
            var called = 0;
            if (events && typeof (events) == "function") {
                events = [events]
            }
            if (!eventArgs.type) {
                eventArgs.type = eventType
            }
            eventArgs.preventDefault = function() {
                eventArgs.defaultOp = null
            };
            eventArgs.stopPropagation = function() {
                eventArgs.cancelBubble = true
            };
            var $pointer = this;
            if (events) {
                for (var i = 0; i < events.length; i++) {
                    (function(i) {
                        var evt = events[i];
                        var len = events.length;
                        var capturer = events.capturer;
                        var capturerName = events.capturerName;
                        return function() {
                            called++;
                            var ret = evt.call($pointer, eventArgs);
                            if (!eventArgs.cancelBubble && called == len && capturer && capturerName && capturer[capturerName]) {
                                capturer[capturerName](eventArgs)
                            }
                            if (called == len && eventArgs.defaultOp) {
                                eventArgs.defaultOp.call($pointer, eventArgs)
                            }
                            return ret
                        }
                    })(i)()
                }
            } else {
                if (eventArgs.defaultOp) {
                    eventArgs.defaultOp.call($pointer, eventArgs)
                }
            }
        };
        this.fireEvent = this.dispatchEvent;
        this.captureEvents = function(target, eventType, capturerName, closure) {
            if (capturerName instanceof Function) {
                closure = capturerName;
                capturerName = null
            }
            capturerName = capturerName || "on" + eventType;
            target["on" + eventType] = target["on" + eventType] || [function() {
                }];
            var events = target["on" + eventType];
            if (typeof (events) == "function") {
                target["on" + eventType] = [events]
            }
            target["on" + eventType].capturer = this;
            target["on" + eventType].capturerName = capturerName;
            if (closure) {
                this[capturerName] = closure
            }
        };
        this.addEventListener = function(eventType, closure) {
            if (this["on" + eventType] == null) {
                this["on" + eventType] = []
            }
            var events = this["on" + eventType];
            if (events && typeof (events) == "function") {
                this["on" + eventType] = [events];
                events = this["on" + eventType]
            }
            events.push(closure);
            return closure
        };
        this.removeEventListener = function(eventType, closure) {
            var events = this["on" + eventType];
            if (events && typeof (events) == "function") {
                events = [events]
            }
            for (var i = 0; i < events.length; i++) {
                if (events[i] == closure) {
                    events.splice(i, 1)
                }
            }
            return closure
        }
    }
}
EzServerClient.GlobeParams.RootObj = new EzObject();
EzServerClient.GlobeFunction.copyProtoFunction = function(a, b) {
    for (pFunc in b) {
        a.prototype[pFunc] = b[pFunc]
    }
};
try {
    EzServerClient.GlobeFunction.copyProtoFunction(IEBrowser, EzServerClient.GlobeParams.RootObj)
} catch (e) {
}
try {
    EzServerClient.GlobeFunction.copyProtoFunction(divCreator, EzServerClient.GlobeParams.RootObj)
} catch (e) {
}
try {
    EzServerClient.GlobeFunction.copyProtoFunction(Shaderer, EzServerClient.GlobeParams.RootObj)
} catch (e) {
}
try {
    EzServerClient.GlobeFunction.copyProtoFunction(Ic, EzServerClient.GlobeParams.RootObj)
} catch (e) {
}
try {
    EzServerClient.GlobeFunction.copyProtoFunction(xa, EzServerClient.GlobeParams.RootObj)
} catch (e) {
}
try {
    EzServerClient.GlobeFunction.copyProtoFunction(XMLHttp, EzServerClient.GlobeParams.RootObj)
} catch (e) {
}
try {
    EzServerClient.GlobeFunction.copyProtoFunction(Point, EzServerClient.GlobeParams.RootObj)
} catch (e) {
}
try {
    EzServerClient.GlobeFunction.copyProtoFunction(Rect, EzServerClient.GlobeParams.RootObj)
} catch (e) {
}
try {
    EzServerClient.GlobeFunction.copyProtoFunction(MBR, EzServerClient.GlobeParams.RootObj)
} catch (e) {
}
try {
    EzServerClient.GlobeFunction.copyProtoFunction(OverView, EzServerClient.GlobeParams.RootObj)
} catch (e) {
}
try {
    EzServerClient.GlobeFunction.copyProtoFunction(nc, EzServerClient.GlobeParams.RootObj)
} catch (e) {
}
try {
    EzServerClient.GlobeFunction.copyProtoFunction(TrackMonitor, EzServerClient.GlobeParams.RootObj)
} catch (e) {
}
try {
    EzServerClient.GlobeFunction.copyProtoFunction(MainFrame, EzServerClient.GlobeParams.RootObj)
} catch (e) {
}
try {
    EzServerClient.GlobeFunction.copyProtoFunction(OverlayStatus, EzServerClient.GlobeParams.RootObj)
} catch (e) {
}
try {
    EzServerClient.GlobeFunction.copyProtoFunction(MapServerControl, EzServerClient.GlobeParams.RootObj)
} catch (e) {
}
try {
    EzServerClient.GlobeFunction.copyProtoFunction(MapStatusControl, EzServerClient.GlobeParams.RootObj)
} catch (e) {
}
try {
    EzServerClient.GlobeFunction.copyProtoFunction(DragEvent, EzServerClient.GlobeParams.RootObj)
} catch (e) {
}
try {
    EzServerClient.GlobeFunction.copyProtoFunction(InfoObj, EzServerClient.GlobeParams.RootObj)
} catch (e) {
}
try {
    EzServerClient.GlobeFunction.copyProtoFunction(IconInfo, EzServerClient.GlobeParams.RootObj)
} catch (e) {
}
try {
    EzServerClient.GlobeFunction.copyProtoFunction(Xd, EzServerClient.GlobeParams.RootObj)
} catch (e) {
}
try {
    EzServerClient.GlobeFunction.copyProtoFunction(Icon, EzServerClient.GlobeParams.RootObj)
} catch (e) {
}
try {
    EzServerClient.GlobeFunction.copyProtoFunction(InfoWind, EzServerClient.GlobeParams.RootObj)
} catch (e) {
}
try {
    EzServerClient.GlobeFunction.copyProtoFunction(MapUnit, EzServerClient.GlobeParams.RootObj)
} catch (e) {
}
try {
    EzServerClient.GlobeFunction.copyProtoFunction(EzLog, EzServerClient.GlobeParams.RootObj)
} catch (e) {
}
try {
    EzServerClient.GlobeFunction.copyProtoFunction(MapsApp, EzServerClient.GlobeParams.RootObj)
} catch (e) {
}
try {
    EzServerClient.GlobeFunction.copyProtoFunction(EzPointStr, EzServerClient.GlobeParams.RootObj)
} catch (e) {
}
try {
    EzServerClient.GlobeFunction.copyProtoFunction(EzManager, EzServerClient.GlobeParams.RootObj)
} catch (e) {
}
try {
    EzServerClient.GlobeFunction.copyProtoFunction(iOverLay, EzServerClient.GlobeParams.RootObj)
} catch (e) {
}
try {
    EzServerClient.GlobeFunction.copyProtoFunction(Polyline, EzServerClient.GlobeParams.RootObj)
} catch (e) {
}
try {
    EzServerClient.GlobeFunction.copyProtoFunction(Polygon, EzServerClient.GlobeParams.RootObj)
} catch (e) {
}
try {
    EzServerClient.GlobeFunction.copyProtoFunction(Rectangle, EzServerClient.GlobeParams.RootObj)
} catch (e) {
}
try {
    EzServerClient.GlobeFunction.copyProtoFunction(Circle, EzServerClient.GlobeParams.RootObj)
} catch (e) {
}
try {
    EzServerClient.GlobeFunction.copyProtoFunction(Marker, EzServerClient.GlobeParams.RootObj)
} catch (e) {
}
try {
    EzServerClient.GlobeFunction.copyProtoFunction(Title, EzServerClient.GlobeParams.RootObj)
} catch (e) {
}
try {
    EzServerClient.GlobeFunction.copyProtoFunction(LegendFunc, EzServerClient.GlobeParams.RootObj)
} catch (e) {
}
try {
    EzServerClient.GlobeFunction.copyProtoFunction(TMLegend, EzServerClient.GlobeParams.RootObj)
} catch (e) {
}
try {
    EzServerClient.GlobeFunction.copyProtoFunction(MultiFeat, EzServerClient.GlobeParams.RootObj)
} catch (e) {
}
try {
    EzServerClient.GlobeFunction.copyProtoFunction(MapControl, EzServerClient.GlobeParams.RootObj)
} catch (e) {
}
try {
    EzServerClient.GlobeFunction.copyProtoFunction(MapStandControl, EzServerClient.GlobeParams.RootObj)
} catch (e) {
}
try {
    EzServerClient.GlobeFunction.copyProtoFunction(MapSmallControl, EzServerClient.GlobeParams.RootObj)
} catch (e) {
}
try {
    EzServerClient.GlobeFunction.copyProtoFunction(MultiMaps, EzServerClient.GlobeParams.RootObj)
} catch (e) {
}
try {
    EzServerClient.GlobeFunction.copyProtoFunction(MapServer, EzServerClient.GlobeParams.RootObj)
} catch (e) {
}
try {
    EzServerClient.GlobeFunction.copyProtoFunction(MenuObject, EzServerClient.GlobeParams.RootObj)
} catch (e) {
}
try {
    EzServerClient.GlobeFunction.copyProtoFunction(EzColorPicker, EzServerClient.GlobeParams.RootObj)
} catch (e) {
}
try {
    EzServerClient.GlobeFunction.copyProtoFunction(DocParser, EzServerClient.GlobeParams.RootObj)
} catch (e) {
}
try {
    EzServerClient.GlobeFunction.copyProtoFunction(EzLayer, EzServerClient.GlobeParams.RootObj)
} catch (e) {
}
try {
    EzServerClient.GlobeFunction.copyProtoFunction(QueryObject, EzServerClient.GlobeParams.RootObj)
} catch (e) {
}
try {
    EzServerClient.GlobeFunction.copyProtoFunction(EditObject, EzServerClient.GlobeParams.RootObj)
} catch (e) {
}
try {
    EzServerClient.GlobeFunction.copyProtoFunction(FeatureObject, EzServerClient.GlobeParams.RootObj)
} catch (e) {
}
try {
    EzServerClient.GlobeFunction.copyProtoFunction(DWREngine, EzServerClient.GlobeParams.RootObj)
} catch (e) {
}
try {
    EzServerClient.GlobeFunction.copyProtoFunction(Array, EzServerClient.GlobeParams.RootObj)
} catch (e) {
}
var __EzPoly = null;
var __EzHandle1 = null;
var __EzHandle2 = null;
var __EzHandle3 = null;
MainFrame.prototype.addHotspotContainer = function(g, i, a) {
    var d = this;
    this.hotspotImg = document.createElement("img");
    this.hotspotImg.src = EzServerClient.GlobeParams.EzServerClientURL + "/images/transparent.gif";
    this.hotspotImg.style.position = "absolute";
    this.hotspotImg.style.width = this.tableSize.width * this.baseLayer.tileInfo.width;
    this.hotspotImg.style.height = this.tableSize.height * this.baseLayer.tileInfo.height;
    this.hotspotImg.useMap = "#hotspotLyr";
    this.hotspotDiv = document.createElement("div");
    this.hotspotDiv.style.zIndex = 11;
    this.hotspotDiv.style.position = "absolute";
    var c = this.currentPanOffset.width * g.tileInfo.width;
    var k = this.currentPanOffset.height * g.tileInfo.height;
    var b = c - this.tilePaddingOffset.width;
    var h = k - this.tilePaddingOffset.height;
    this.hotspotDiv.style.left = b;
    this.hotspotDiv.style.top = h;
    this.hotspotDiv.id = "hotspotMaplayer";
    if (g.isDisplayProfile) {
        __createHotSpotPolyline(this.hotspotDiv)
    }
    this.hotspotDiv.appendChild(this.hotspotImg);
    this.div.appendChild(this.hotspotDiv);
    var f = this.getTileNum(g);
    var j = null;
    if (!this._hotIcon) {
        this._hotIcon = document.createElement("div");
        this._hotIcon.style.cssText = "position:absolute;z-index:5001;display:none;font-size:0;line-height:0;";
        this._hotIcon.id = "hoticon";
        this._hotIcon.title = "点击查看详细信息"
    }
    this.container.appendChild(this._hotIcon);
    __EzHandle1 = EzEvent.addEventListener(this, EzEvent.MAP_PANEND, function(u) {
        if (d.hotspotDiv) {
            if (d.hotspotDiv.style.left != d.groupTileImages[0][0][0].style.left || d.hotspotDiv.style.top != d.groupTileImages[0][0][0].style.top) {
                d.hotspotDiv.style.left = d.groupTileImages[0][0][0].style.left;
                d.hotspotDiv.style.top = d.groupTileImages[0][0][0].style.top;
                for (var s = 0; s < f.width; s++) {
                    for (var r = 0; r < f.height; r++) {
                        var q = (d.groupTileImages[i] && d.groupTileImages[i][s] && d.groupTileImages[i][s][r]) ? d.groupTileImages[i][s][r] : null;
                        var p = (q && q.childNodes) ? q.childNodes : [];
                        for (var o = 0; o < p.length; o++) {
                            __EzRefreshAreaHandler(p[o], d, d.groupTileImages[0][0][0].offsetLeft, d.groupTileImages[0][0][0].offsetTop)
                        }
                    }
                }
                if (!g.hotspot2d) {
                    var t = document.getElementById("hotspotLyr");
                    for (var s = 0; s < t.childNodes.length; s++) {
                        var v = t.childNodes[s];
                        for (var r = 0; r < v.childNodes.length; r++) {
                            __EzRefreshAreaHandler(v.childNodes[r], this, this.groupTileImages[0][0][0].offsetLeft, this.groupTileImages[0][0][0].offsetTop)
                        }
                    }
                }
                if (g.isDisplayProfile) {
                    __hide()
                }
            }
        }
    });
    __EzHandle2 = EzEvent.addEventListener(this, EzEvent.MAP_ZOOMSTART, function(r) {
        for (var p = 0; p < f.width; p++) {
            for (var o = 0; o < f.height; o++) {
                var m = (d.groupTileImages[i] && d.groupTileImages[i][p] && d.groupTileImages[i][p][o]) ? d.groupTileImages[i][p][o] : null;
                if (m) {
                    m.innerHTML = ""
                }
            }
        }
        if (!g.hotspot2d) {
            var q = document.getElementById("hotspotLyr");
            if (q) {
                for (var p = 0; p < q.childNodes.length; p++) {
                    var s = q.childNodes[p];
                    s.innerHTML = ""
                }
            }
        }
        if (d.hotspotDiv) {
            d.hotspotDiv.style.left = "0px";
            d.hotspotDiv.style.top = "0px"
        }
        if (g.isDisplayProfile) {
            __hide()
        }
    });
    __EzHandle3 = EzEvent.addEventListener(this, EzEvent.MAP_MOUSEMOVE, function(o) {
        if (o.eventType == EzEvent.MAP_MOUSEDOWN || o.eventType == EzEvent.MAP_MOUSEWHEEL || o.eventType == EzEvent.MAP_ZOOMEND || o.eventType == EzEvent.MAP_SWITCHMAPSERVER) {
            m._hotIcon.style.display = "none";
            return
        }
        var m = this;
        var n = 0.0001;
        var p = o.mapPoint;
        var l = o;
        if (!j) {
            j = setTimeout(function() {
                j = null;
                for (var v = 0; v < f.width; v++) {
                    for (var u = 0; u < f.height; u++) {
                        var t = (m.groupTileImages[i] && m.groupTileImages[i][v] && m.groupTileImages[i][v][u]) ? m.groupTileImages[i][v][u] : null;
                        var y = (t && t.childNodes) ? t.childNodes : [];
                        for (var s = 0; s < y.length; s++) {
                            if (p.x != l.mapPoint.x || p.y != l.mapPoint.y) {
                                return
                            }
                            if (y[s]._bound == "") {
                                var w = y[s]._center.split(",");
                                var x = new MBR(w[0] - n, w[1] - n, w[0] + n, w[1] + n);
                                if (x.containsPoint(p)) {
                                    var r = y[s]._iconUrl;
                                    var q = m.mapCoord2container(new Point(w[0], w[1]));
                                    if (q && q.x && q.y) {
                                        EzServerClient.Util.fetchImage(r, function(B, z, A) {
                                            if (B != 0 && z != 0) {
                                                m._hotIcon.style.display = "";
                                                m._hotIcon.style.left = (q.x - B / 2 - 1) + "px";
                                                m._hotIcon.style.top = (q.y - z / 2) + "px";
                                                m._hotIcon.style.width = B + "px";
                                                m._hotIcon.style.height = z + "px";
                                                EzServerClient.Util.setCssSprite(m._hotIcon, A, [0, 0]);
                                                __setDivEvent(m._hotIcon, g.eventName, g.callback, y[s], m)
                                            }
                                        })
                                    }
                                    return
                                }
                                w = null;
                                x = null
                            } else {
                                if (y[s]._bound) {
                                }
                            }
                        }
                        t = null;
                        y = null
                    }
                    m._hotIcon.style.display = "none"
                }
                m._hotIcon.style.display = "none"
            }, 0)
        }
    })
};
function __setDivEvent(div, vEvent, vFunc, vArea, vMap) {
    eval("div." + vEvent + "=function(){vFunc(vArea._hotspot)}");
    div.ondblclick = function() {
        window.event.cancelBubble = true
    };
    div.onmouseover = function() {
        vMap.hotspotImg.style.cursor = "pointer"
    };
    div.onmouseout = function() {
        vMap.hotspotImg.style.cursor = ""
    }
}
function __PointInBounds(a, b) {
}
function __EzRefreshAreaHandler(d, f, a, g) {
    if (!d._p || !f.baseGroupLayer.getHotspotLayer()) {
        return
    }
    var k = [];
    var h = d._p.split(",");
    var c = f.getDivCoord2(h[0], h[1], __EzP);
    var m = c.x - a;
    var l = c.y - g;
    k.push(m);
    k.push(l);
    for (var i = 2; i < h.length; i = i + 2) {
        var j = f.getDivCoord2(h[i], h[i + 1], __EzP);
        k.push(j.x - a);
        k.push(j.y - g)
    }
    k.push(m);
    k.push(l);
    k.push(m);
    k.push(l);
    d.coords = k.join(",")
}
function __createHotSpotPolyline(a) {
    __EzPoly = document.createElement("v:polyline");
    __EzPoly.style.position = "absolute";
    __EzPoly.style.display = "none";
    __EzPoly.style.cursor = "pointer";
    __EzPoly.closed = "true";
    __EzPoly.filled = "t";
    __EzPoly.fillcolor = (EzServerClient.GlobeParams.HotspotStyle && EzServerClient.GlobeParams.HotspotStyle.fillColor) ? EzServerClient.GlobeParams.HotspotStyle.fillColor : "white";
    __EzPoly.stroked = "t";
    __EzPoly.strokecolor = (EzServerClient.GlobeParams.HotspotStyle && EzServerClient.GlobeParams.HotspotStyle.borderColor) ? EzServerClient.GlobeParams.HotspotStyle.borderColor : "yellow";
    __EzPoly.strokeweight = (EzServerClient.GlobeParams.HotspotStyle && EzServerClient.GlobeParams.HotspotStyle.borderWeight) ? EzServerClient.GlobeParams.HotspotStyle.borderWeight : "1.2pt";
    var b = document.createElement("v:fill");
    __EzPoly.appendChild(b);
    b.opacity = (EzServerClient.GlobeParams.HotspotStyle && EzServerClient.GlobeParams.HotspotStyle.opacity) ? EzServerClient.GlobeParams.HotspotStyle.opacity : "19660f";
    a.insertAdjacentElement("beforeEnd", __EzPoly)
}
function __show(b, a) {
    __EzPoly.points.value = b.coords;
    __EzPoly.style.display = "block";
    __EzPoly.areaid = b.id
}
function __hide() {
    __EzPoly.style.display = "none"
}
function __setAreaOffset(f, a, d) {
    var c = d.split(",");
    for (var b = 0; b < c.length; b = b + 2) {
        c[b] -= f;
        c[b + 1] -= a
    }
    c.push(c[0]);
    c.push(c[1]);
    return c.join(",")
}
function ImageObj() {
    this.URL;
    this.width;
    this.alt
}
function MonitorTitleInfo() {
    this.title = "警力信息";
    this.name = "警力名称";
    this.callNo = "呼    号";
    this.uim = "UIM 卡号";
    this.time = "时    间";
    this.speed = "速   度";
    this.carNo = "车 牌 号";
    this.carType = "车    型";
    this.addr = "地   址";
    this.belongorg = "所属单位";
    this.patrolArea = "巡逻区域";
    this.patrolType = "巡逻类型";
    this.policeName = "警员名称";
    this.policeID = "警员编号";
    this.ruleComm = "辖区名称";
    this.pdaNo = "PDA 号码";
    this.memo = "备    注"
}
function MonitorFindInfo() {
    this.title = "警力信息";
    this.name = "警力名称";
    this.callNo = "呼    号";
    this.uim = "UIM 卡号";
    this.status = "状    态";
    this.carNo = "车 牌 号";
    this.carType = "车    型";
    this.addr = "地   址";
    this.belongorg = "所属单位";
    this.patrolArea = "巡逻区域";
    this.patrolType = "巡逻类型";
    this.policeName = "警员名称";
    this.policeID = "警员编号";
    this.ruleComm = "辖区名称";
    this.pdaNo = "PDA 号码";
    this.memo = "备    注"
}
function VideoTableInfo() {
    this.title = "摄像头信息";
    this.id = "编&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;号:";
    this.name = "名&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;称:";
    this.status = "状&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;态:";
    this.lon = "经&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;度:";
    this.lat = "纬&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;度:";
    this.addr = "位&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;置:";
    this.belongorg = "所属单位:";
    this.coveredAvenue = "监控范围:";
    this.url = "链&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;接:";
    this.memo = "备&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;注:"
}
function VideoTitleInfo() {
    this.title = "摄像头信息";
    this.id = "编    号";
    this.name = "名    称";
    this.status = "状    态";
    this.addr = "位    置";
    this.belongorg = "所属单位";
    this.coveredAvenue = "监控范围";
    this.memo = "备    注"
}
function Monitor(f, a, d, c, b) {
    this.base = iOverLay;
    this.base();
    this.id = f;
    this.name = a;
    this.lon = d;
    this.lat = c;
    this.time = b;
    this.addr;
    this.belongorg;
    this.callNo;
    this.memo;
    this.carNo;
    this.carType;
    this.url;
    this.speed;
    this.dir;
    this.polType;
    this.powerType;
    this.picType;
    this.patrolArea;
    this.policeName;
    this.policeID;
    this.pdaNo;
    this.ruleComm;
    this.patrolType;
    this.uim;
    this.coveredAvenue;
    this.fromtime;
    this.totime;
    this.status;
    this.videoStatus;
    this.userID;
    this.border;
    this.strPath;
    this.bIsShowBorder = false;
    this.bIsAlarm = false;
    this.bIsMonitor = false;
    this.bIsMainMonitor = false;
    this.bIsVideo = true;
    this.bIsDisplay = false;
    this.div = null;
    this.titleDiv;
    this.titleText;
    this.imgContainer;
    this.trackPointArray;
    this.trackimgArray;
    this.trackVMLArray;
    this.imgSize;
    this.topOffset = 0;
    this.container;
    this.map;
    this.imgScale = 1;
    this.imgSrc = null
}
Monitor.prototype = new iOverLay();
Monitor.prototype.toDate = function() {
    var b = this.time;
    var c = null;
    if (b) {
        c = new Date();
        var i = parseInt(b.substring(0, 4), 10);
        c.setYear(i);
        var h = parseInt(b.substring(5, 7), 10) - 1;
        c.setMonth(h);
        var f = parseInt(b.substring(8, 10), 10);
        c.setDate(f);
        var d = parseInt(b.substring(11, 13), 10);
        c.setHours(d);
        var g = parseInt(b.substring(14, 16), 10);
        c.setMinutes(g);
        var a = parseInt(b.substring(17, 19), 10);
        c.setSeconds(a);
        delete c
    }
    return c
};
Monitor.prototype.toLocalTime = function() {
    var a = null;
    var b = this.time;
    if (b) {
        a = this.time
    }
    return a
};
Monitor.prototype.getNodeInfo = function() {
    var a = "";
    a = "经度:" + this.lon;
    a = a + "<br>纬度:" + this.lat;
    a = a + "<br>时间:" + this.time;
    return a
};
Monitor.prototype.getEclipseTime = function(a) {
    var b = this.toDate();
    var c = 9999999;
    if (!b) {
        return c
    }
    if (!a) {
        a = new Date()
    }
    c = (a.getTime() - b.getTime()) / 1000;
    delete a;
    return c
};
Monitor.prototype.convertBorder2Path = function(b) {
    if (!b) {
        b = this.border
    }
    var a = b.split(",");
    this.strPath = a;
    return a
};
Monitor.prototype.bIsOutOfBorder = function() {
    var c = new TopoCheck();
    var a = new Point(this.lon, this.lat);
    var b = c.bIsInBorder(a, this.border);
    b = !b;
    delete a;
    delete c;
    return b
};
Monitor.prototype.getStatus = function() {
    var b = this.getEclipseTime();
    var a = "";
    if (b > 86400) {
        a = "3";
        this.status = "备用"
    } else {
        if (b < this.statusValve) {
            a = "1";
            this.status = "正常状态"
        } else {
            a = "2";
            this.status = "设备未开"
        }
    }
    return a
};
Monitor.prototype.showTitle = function() {
    if (this.titleDiv && this.div.style.display == "") {
        this.titleDiv.style.display = ""
    }
};
Monitor.prototype.hideTitle = function() {
    if (this.titleDiv) {
        this.titleDiv.style.display = "none"
    }
};
Monitor.prototype.hide = function() {
    this.div.style.display = "none";
    this.clearTrack();
    this.titleDiv.style.display = "none"
};
Monitor.prototype.toString = function() {
    var c = "";
    for (var a in this) {
        if (this[a] != null && this[a] != "" && this[a] != "null") {
            var b = this[a];
            if (typeof b != "function") {
                c = c + this[a] + "\n"
            }
        }
    }
    return c
};
Monitor.prototype.toHTML = function() {
    var b = this.getTitle().replace(/\n/g, "<br>");
    var a = /\s/g;
    b = b.replace(a, "&nbsp;");
    return b
};
Monitor.prototype.getTextOfDir = function() {
    var a;
    if (this.dir > 22.5 && this.dir <= 67.5) {
        a = "↗"
    } else {
        if (this.dir > 67.5 && this.dir <= 112.5) {
            a = "→"
        } else {
            if (this.dir > 112.5 && this.dir <= 157.5) {
                a = "↘"
            } else {
                if (this.dir > 157.5 && this.dir <= 202.5) {
                    a = "↓"
                } else {
                    if (this.dir > 202.5 && this.dir <= 247.5) {
                        a = "↙"
                    } else {
                        if (this.dir > 247.5 && this.dir <= 292.5) {
                            a = "←"
                        } else {
                            if (this.dir > 292.5 && this.dir < 337.5) {
                                a = "↖"
                            } else {
                                a = "↑"
                            }
                        }
                    }
                }
            }
        }
    }
    return a
};
Monitor.prototype.getTitle = function() {
    var f = "";
    var c;
    if (this instanceof Video) {
        c = new VideoTitleInfo()
    } else {
        c = new MonitorTitleInfo()
    }
    for (var a in c) {
        if (this[a] != null && this[a] != "" && this[a] != "null") {
            var b = c[a];
            var d;
            if (a == "dir") {
                if (this.polType == 1 || this.polType == 2) {
                    d = this.getTextOfDir() + "(" + this[a] + "度)"
                }
            } else {
                if (a == "speed") {
                    if (this.polType == 1 || this.polType == 2) {
                        d = this[a] + "公里/小时"
                    }
                } else {
                    d = this[a]
                }
            }
            if (typeof b != "function") {
                if (f == "") {
                    f = c[a] + ":" + d
                } else {
                    f = f + "\n" + c[a] + ":" + d
                }
            }
        }
    }
    delete c;
    return f
};
Monitor.prototype.toTable = function() {
    var d = "";
    var c;
    if (this instanceof Video) {
        c = new VideoTitleInfo()
    } else {
        c = new MonitorTitleInfo()
    }
    for (var a in c) {
        if (this[a] != null && this[a] != "" && this[a] != "null") {
            var b = c[a];
            if (typeof b != "function") {
                d = d + c[a] + this[a] + "\n"
            }
        }
    }
    delete c;
    return d
};
Monitor.prototype.createMonitorTitleDiv = function() {
    var a;
    if (typeof this.callNo != "undefined" && this.callNo != null) {
        a = this.callNo
    } else {
        a = this.name
    }
    this.titleText = a;
    if (typeof this.titleText != "string") {
        this.titleText = this.titleText + ""
    }
    var b = createTxt(a);
    this.titleDiv = b;
    b.style.zIndex = 1200;
    b.style.fontSize = convert2Px(12);
    b.style.fontFamily = "宋体";
    b.style.color = "WHITE";
    b.style.backgroundColor = "#004C78";
    b.style.width = "auto";
    b.style.height = "auto";
    b.noWrap = true;
    return this.titleDiv
};
Monitor.prototype.setZIndex = function(a) {
    if (this.div != null) {
        this.div.style.zIndex = a
    }
    if (this.titleDiv != null) {
        this.titleDiv.style.zIndex = a
    }
};
Monitor.prototype.createDiv = function(b) {
    this.map = b;
    this.container = b.div;
    this.initMonitorImage();
    var a = document.createElement("img");
    this.div = a;
    a.id = this.id;
    a.style.position = "absolute";
    a.style.zIndex = 800;
    a.unselectable = "on";
    a.lon = this.lon;
    a.lat = this.lat;
    a.src = this.getMonitorImage();
    this.container.appendChild(a);
    var c = this.createMonitorTitleDiv();
    this.container.appendChild(c);
    a.title = this.getTitle();
    setCursor(a, "hand");
    a.monitor = this;
    this.redraw();
    return a
};
Monitor.prototype.createMonitorTrackImg = function() {
    var a = document.createElement("img");
    a.style.position = "absolute";
    a.style.zIndex = 600;
    a.unselectable = "on";
    this.imgContainer.appendChild(a);
    return a
};
Monitor.prototype.clearTrack = function() {
    this.clearPointArray();
    this.clearTrackImg();
    this.clearTrackVML()
};
Monitor.prototype.removeFromDiv = function() {
    this.container.removeChild(this.div);
    this.container.removeChild(this.titleDiv);
    this.clearTrack()
};
Monitor.prototype.clearPointArray = function() {
    if (this.trackPointArray == null) {
        return
    }
    while (this.trackPointArray.length > 0) {
        var a = this.trackPointArray.pop();
        delete a
    }
};
Monitor.prototype.clearTrackImg = function() {
    if (this.trackimgArray == null) {
        return
    }
    while (this.trackimgArray.length > 0) {
        var a = this.trackimgArray.pop();
        this.imgContainer.removeChild(a)
    }
};
Monitor.prototype.clearTrackVML = function() {
    if (this.trackVMLArray == null) {
        return
    }
    var b = getTrackVMLContainer();
    while (this.trackVMLArray.length > 0) {
        var a = this.trackVMLArray.pop();
        b.groupObj.removeChild(a)
    }
};
Monitor.prototype.setImgPos = function(f, d, b, a) {
    var c = this.div;
    if (c != null) {
        c.style.top = convert2Px(d);
        c.style.left = convert2Px(f);
        c.style.width = convert2Px(b);
        c.style.height = convert2Px(a)
    }
    return c
};
Monitor.prototype.refreshGPSTracks = function() {
    if (this.trackPointArray == null || this.trackPointArray.length == 0) {
        return
    }
    var b = thid.imgScale;
    var g = getZoomLevel();
    var a = this.trackPointArray.length;
    for (var c = 0; c < a; c++) {
        var f = this.trackPointArray[c];
        var d = this.map.convert2WPoint(f.x, f.y);
        this.trackPointArray[c].screenX = d.x;
        this.trackPointArray[c].screenY = d.y;
        delete d
    }
    this.refreshTrackPoints();
    this.refreshTrackLines()
};
Monitor.prototype.refreshTrackLines = function() {
    var b = getSetupInfo().bIsShowGPSLine;
    if (!b) {
        return
    }
    if (this.trackVMLArray == null) {
        this.trackVMLArray = new Array()
    }
    var i = getTrackVMLContainer();
    i.groupObj.style.left = 0;
    i.groupObj.style.top = 0;
    while (this.trackVMLArray.length < this.trackPointArray.length - 1) {
        var f = i.drawLine(0, 0, 0, 0);
        f.firstChild.endArrow = "classic";
        f.firstChild.endArrowWidth = "medium";
        f.firstChild.color = "red";
        f.firstChild.startArrow = "oval";
        f.firstChild.startArrowWidth = "medium";
        this.trackVMLArray.push(f)
    }
    var d = 0;
    var a = this.trackVMLArray.length;
    var g = new Point();
    for (d = 0; d < a; d++) {
        var f = this.trackVMLArray[d];
        var c = "" + this.trackPointArray[d].screenX + "," + this.trackPointArray[d].screenY + "";
        var h = "" + this.trackPointArray[d + 1].screenX + "," + this.trackPointArray[d + 1].screenY + "";
        f.from.value = c;
        f.to.value = h
    }
    delete g
};
Monitor.prototype.refreshTrackPoints = function() {
    var b = getSetupInfo().bIsShowGPSPoint;
    if (!b) {
        return
    }
    if (this.trackPointArray == null) {
        this.trackPointArray = new Array()
    }
    while (this.trackimgArray.length < this.trackPointArray.length) {
        var f = this.createMonitorTrackImg();
        this.trackimgArray.push(f)
    }
    var c = 0;
    var a = this.trackimgArray.length;
    var d = new Point();
    for (c = 0; c < a; c++) {
        d.x = this.trackPointArray[c].screenX;
        d.y = this.trackPointArray[c].screenY;
        var g = this.setTrackPoint(this.trackimgArray[c], d);
        g.src = "images/point_" + (a - c) + ".gif"
    }
    delete d
};
Monitor.prototype.setTrackPoint = function(d, c) {
    if (d == null) {
        return
    }
    var a = this.imgScale;
    var b = this.div.size / 4;
    var f = b * a;
    if (f <= 2) {
        f = 2
    }
    d.style.left = convert2Px(c.x - f / 2);
    d.style.top = convert2Px(c.y - f / 2);
    d.style.width = convert2Px(f);
    d.style.height = convert2Px(f);
    return d
};
Monitor.prototype.onChange = function() {
    if (this.titleDiv != null) {
        var a = 12;
        var b = 0;
        a = a * this.imgScale;
        if (a != 0) {
            b = a * StrLength(this.titleText) / 2
        }
        this.titleDiv.style.left = convert2Px(this.div.x - b / 2);
        var c = parseInt(this.div.style.top) - a;
        this.titleDiv.style.top = convert2Px(c);
        this.titleDiv.style.fontSize = convert2Px(a)
    }
    this.refreshGPSTracks()
};
function Monitors(b, c) {
    this.container = b;
    this.xml = null;
    this.monitorArray = null;
    this.monitorDiv = null;
    this.bMonitor = true;
    this.speed = _RefreshSpeed;
    this.infoDiv = c;
    this.bIsLoaded = false;
    if (this.container) {
        this.monitorDiv = document.createElement("div");
        this.monitorDiv.style.position = "absolute";
        this.monitorDiv.style.zIndex = 1000;
        this.monitorDiv.unselectable = "on";
        this.monitorDiv.onselectstart = _NoAction;
        this.container.appendChild(this.monitorDiv)
    }
    var a = this;
    window.getMonContainer = function() {
        return a.monitorDiv
    };
    window.hideMonitorByID = function(d) {
        pMon = a.getMonObjectByID(d);
        pMon.hide();
        refreshStatusTimeout()
    };
    window.refreshStatusTimeout = function() {
        if (typeof a.statusTimeout != "undefined" && a.statusTimeout != null) {
            clearTimeout(a.statusTimeout)
        }
        a.statusTimeout = a.setTimeout("refreshStatus()", 4000)
    };
    window.refreshStatus = function() {
        if (parent.LocFrame.CheckResult) {
            parent.LocFrame.CheckResult()
        }
    }
}
Monitors.prototype.getMonObjectByID = function(c) {
    var b = null;
    for (var a = 0; a < this.monitorArray.length; a++) {
        var b = this.monitorArray[a];
        if (b.id == c) {
            return b
        }
    }
    return null
};
Monitors.prototype.clearMonitorStatus = function() {
    var b = null;
    for (var a = 0; a < this.monitorArray.length; a++) {
        var b = this.monitorArray[a];
        b.bIsMonitor = false;
        b.bIsMainMonitor = false
    }
};
Monitors.prototype.clearMonitorTimeout = function() {
    var b = null;
    for (var a = 0; a < this.monitorArray.length; a++) {
        var b = this.monitorArray[a];
        if (typeof this.refreshTimeout != "undefined" && this.refreshTimeout != null) {
            clearTimeout(this.refreshTimeout);
            this.refreshTimeout = null
        }
    }
};
Monitors.prototype.sortById = function() {
    if (this.monitorArray != null) {
        this.monitorArray = this.monitorArray.sort(function(d, c) {
            if (d.id < c.id) {
                return -1
            }
            if (d.id > c.id) {
                return 1
            }
            return 0
        })
    }
};
Monitors.prototype.sortByTag = function(a) {
    var b = null;
    if (this.monitorArray != null) {
        b = this.monitorArray.sort(function(d, c) {
            if (d[a] < c[a]) {
                return -1
            }
            if (d[a] > c[a]) {
                return 1
            }
            return 0
        })
    }
    return b
};
Monitors.prototype.show = function(a) {
    this.bMonitor = true;
    this.monitorDiv.style.display = ""
};
Monitors.prototype.hide = function() {
    this.bMonitor = false;
    this.monitorDiv.style.display = "none"
};
Monitors.prototype.clearDiv = function() {
    if (!this.monitorDiv) {
        return
    }
    var a = this.monitorDiv;
    while (a.hasChildNodes()) {
        a.removeChild(a.lastChild)
    }
};
Monitor.prototype.getImageObj = function(c) {
    var b = new ImageObj();
    var a = this.getStatus();
    b.URL = this.getMonitorImage(c);
    b.alt = this.status;
    b.width = this.imgSize;
    return b
};
Monitor.prototype.refreshMonImg = function(a) {
    if (typeof a == "undefined") {
        a = false
    }
    var b = this.getMonitorImage(a);
    if (this.div.src != b) {
        this.div.src = b
    }
};
Monitor.prototype.scaleImg = function(c) {
    this.imgScale = c;
    var b = this.div;
    try {
        var d = this.imgSize * c;
        if (d <= 0) {
            d = 2
        }
        var a = b.x;
        var g = b.y;
        this.setImgPos(a - d / 2, g - d / 2, d, d);
        this.onChange()
    } catch (f) {
        alert(f.message)
    }
    return b
};
Monitor.prototype.getMonitorImage = function(c) {
    var b = this.getStatus();
    var a = "";
    if (b == "1") {
        a = this.imgSrc.replace(".gif", "_on.gif")
    } else {
        a = this.imgSrc.replace(".gif", "_off.gif")
    }
    if (c) {
        a = this.imgSrc.replace(".gif", "_active.gif")
    }
    return a
};
Monitor.prototype.initMonitorImage = function() {
    var a = "";
    var b = "images/gpsstatus/";
    if (this.picType != null && this.picType.indexOf("依维柯") != -1) {
        a = "vehicle_ywk.gif";
        this.imgSize = 42;
        this.polType = 1;
        this.topOffset = -2
    } else {
        if (this.picType != null && this.picType.indexOf("切诺基") != -1) {
            a = "vehicle_qnj.gif";
            this.imgSize = 48;
            this.polType = 1;
            this.topOffset = 5
        } else {
            if (this.picType != null && (this.picType.indexOf("索那塔") != -1 || this.picType.indexOf("桑塔那") != -1)) {
                a = "vehicle_snt.gif";
                this.imgSize = 48;
                this.polType = 1;
                this.topOffset = 10
            } else {
                if (this.picType != null && this.picType.indexOf("摩托车") != -1) {
                    a = "vehicle_motor.gif";
                    this.imgSize = 40;
                    this.polType = 2;
                    this.topOffset = 10
                } else {
                    if (this.picType != null && this.picType.indexOf("自行车") != -1) {
                        a = "bike.gif";
                        this.imgSize = 32;
                        this.polType = 3;
                        this.topOffset = 0
                    } else {
                        if (this.picType != null && this.picType.indexOf("步巡") != -1) {
                            a = "pol.gif";
                            this.imgSize = 28;
                            this.polType = 3;
                            this.topOffset = 0
                        } else {
                            if (this.picType != null && this.picType.indexOf("社区民警") != -1) {
                                a = "com_pol.gif";
                                this.imgSize = 24;
                                this.polType = 4;
                                this.topOffset = 0
                            } else {
                                a = "vehicle_ywk.gif";
                                this.imgSize = 42;
                                this.polType = 1;
                                this.topOffset = 0
                            }
                        }
                    }
                }
            }
        }
    }
    if (this.polType == 1 || this.polType == 2) {
        this.statusValve = 180
    } else {
        if (this.polType == 3) {
            this.statusValve = 600
        } else {
            if (this.polType == 4) {
                this.statusValve = 300
            }
        }
    }
    this.imgSrc = b + a
};
Monitor.prototype.getPolType = function(a) {
    return this.polType
};
Monitor.prototype.redraw = function(d) {
    var g = null;
    var f = this.map.convert2WPoint(this.lon, this.lat);
    var c = f.x;
    var i = f.y;
    var b = "";
    var a = null;
    if (this.div) {
        g = this.div
    } else {
        g = getEleByID(this.id)
    }
    if (g) {
        g.x = c;
        g.y = i;
        g.lon = this.lon;
        g.lat = this.lat;
        var h = this.imgSize * this.imgScale;
        this.setImgPos(c - h / 2, i - h / 2, h, h);
        if (!(this instanceof Video)) {
            a = this.getImageObj();
            b = a.URL;
            strAlt = a.alt;
            if (g.src != b) {
                g.src = b
            }
            if (g.alt != strAlt) {
                g.alt = strAlt
            }
        }
    }
    this.onChange();
    delete f;
    delete a;
    return g
};
Monitor.prototype.bIsVisable = function() {
    var a = true;
    return a;
    if (this.div == null) {
        this.createDiv()
    }
    var b = this.getStatus();
    if (b == "1") {
        if (this.div.style.display == "none") {
            this.div.style.display = "";
            refreshStatusTimeout()
        }
        if (this.titleDiv) {
            this.titleDiv.style.display = ""
        }
    } else {
        if (this.div.style.display == "") {
            this.div.style.display = "none";
            refreshStatusTimeout()
        }
        this.clearTrack();
        if (this.titleDiv) {
            this.titleDiv.style.display = "none"
        }
        a = false
    }
    if (typeof this.refreshTimeout != "undefined" && this.refreshTimeout != null) {
        clearTimeout(this.refreshTimeout);
        this.refreshTimeout = null
    }
    var c = "hideMonitorByID('" + this.id + "')";
    this.refreshTimeout = this.setTimeout(c, this.statusValve * 1000);
    return a
};
Monitor.prototype.addListener = function(b, a) {
    BindingEvent(this.div, b, a)
};
Monitor.prototype.openInfoWindowHtml = function(a) {
    this.map.blowupOverlay(this);
    if (typeof a == "undefined" || a == null) {
        this.map.openInfoWindow(this.lon, this.lat, this)
    } else {
        this.map.openInfoWindow(this.lon, this.lat, a)
    }
};
function Video(f, a, d, c, b) {
    this.base = Monitor;
    this.base(f, a, d, c, b);
    this.imgSrc = "video1.gif"
}
Video.prototype = new Monitor;
Video.prototype.getMonitorImage = function(c) {
    var a = "";
    var b = "images/videostatus/";
    var d = "";
    if (this.videoStatus == 1) {
        d = "_1.gif"
    } else {
        if (this.videoStatus == 2) {
            d = "_2.gif"
        } else {
            if (this.videoStatus == 3) {
                d = "_3.gif"
            } else {
                d = "_4.gif"
            }
        }
    }
    a = this.imgSrc.replace(".gif", d);
    a = b + a;
    return a
};
Video.prototype.initMonitorImage = function() {
    this.imgSize = 24;
    this.topOffset = 0
};
Video.prototype.getImageObj = function(b) {
    var a = new ImageObj();
    a.URL = this.getMonitorImage();
    a.width = 16;
    a.alt = "";
    return a
};
MainFrame.prototype.flashMonitorByID = function(h, c) {
    var b, d, a;
    var f = null;
    b = this.video;
    if (!b) {
        return f
    }
    var g = b.getMonObjectByID(h);
    if (!g) {
        return f
    }
    var f = new Point(g.lon, g.lat);
    if (g.div) {
        g.div.src = g.getMonitorImage(true)
    }
    return f
};
Video.prototype.bIsVisable = function() {
    var a = false;
    if (this.div == null) {
        this.createDiv()
    }
    if (this.bIsDisplay) {
        if (this.div.style.display == "none") {
            this.div.style.display = ""
        }
        a = false
    } else {
        if (this.div.style.display == "") {
            this.div.style.display = "none"
        }
    }
    return a
};
Video.prototype.setImg = function(a) {
    this.imgSrc = a;
    this.refreshMonImg()
};
if (typeof ezserverclient == "undefined" || ezserverclient) {
    var ezserverclient = {};
    ezserverclient.easyxmlparse = {}
}
ezserverclient.easyxmlparse.E_Element = function() {
};
ezserverclient.easyxmlparse.E_Collection = function() {
};
ezserverclient.easyxmlparse.E_Collection.prototype.add = function() {
};
ezserverclient.easyxmlparse.E_Collection.prototype.clear = function() {
};
ezserverclient.easyxmlparse.E_Collection.prototype.get = function(a) {
};
ezserverclient.easyxmlparse.E_Collection.prototype.isEmpty = function() {
};
ezserverclient.easyxmlparse.E_Collection.prototype.remove = function() {
};
ezserverclient.easyxmlparse.E_Collection.prototype.size = function() {
};
ezserverclient.easyxmlparse.E_ColumnsClause = function(a) {
    ezserverclient.easyxmlparse.E_Element.call(this);
    if (a) {
        this.setContent(a)
    } else {
        this.content = "*"
    }
};
ezserverclient.easyxmlparse.E_ColumnsClause.prototype = new ezserverclient.easyxmlparse.E_Element;
ezserverclient.easyxmlparse.E_ColumnsClause.prototype.fromElement = function(b) {
    if (b == null) {
        return null
    }
    var a = ezserverclient.easyxmlparse.EzXmlDomUtil.getContext(b);
    this.setContent(a);
    return this
};
ezserverclient.easyxmlparse.E_ColumnsClause.prototype.getContent = function() {
    return this.content
};
ezserverclient.easyxmlparse.E_ColumnsClause.prototype.getElementName = function() {
    return "COLUMNSCLAUSE"
};
ezserverclient.easyxmlparse.E_ColumnsClause.prototype.setContent = function(b) {
    var a = ezserverclient.easyxmlparse.string_trim(ezserverclient.easyxmlparse.EzXmlTypeUtil.toStringValue(b, "*"));
    if (a.length == 0) {
        this.content = "*"
    } else {
        this.content = a
    }
};
ezserverclient.easyxmlparse.E_ColumnsClause.prototype.toElement = function(b) {
    var a = ezserverclient.easyxmlparse.EzXmlDomUtil.createElementNS(b, this.getElementName());
    ezserverclient.easyxmlparse.EzXmlDomUtil.setContext(a, this.getContent());
    return a
};
ezserverclient.easyxmlparse.E_DML = function() {
    ezserverclient.easyxmlparse.E_Element.call(this);
    this.getDMLType = function() {
    }
};
ezserverclient.easyxmlparse.E_DML.prototype = new ezserverclient.easyxmlparse.E_Element;
function E_DMLType(a) {
    this.name = a;
    this.getName = function() {
        return this.name
    }
}
E_DMLType.INSERT = new E_DMLType("INSERT");
E_DMLType.UPDATE = new E_DMLType("UPDATE");
E_DMLType.DELETE = new E_DMLType("DELETE");
E_DMLType.SELECT = new E_DMLType("SELECT");
ezserverclient.easyxmlparse.I_SizeSensate = function() {
    this.getContentSize = function() {
    }
};
ezserverclient.easyxmlparse.E_Delete = function() {
    ezserverclient.easyxmlparse.E_DML.call(this);
    this.whereClause = new ezserverclient.easyxmlparse.E_WhereClause();
    this.objectName = null
};
ezserverclient.easyxmlparse.E_Delete.prototype = new ezserverclient.easyxmlparse.E_DML;
ezserverclient.easyxmlparse.E_Delete.prototype.fromElement = function(a) {
    if (a == null) {
        return null
    }
    var b = new ezserverclient.easyxmlparse.E_WhereClause();
    b = b.fromElement(ezserverclient.easyxmlparse.EzXmlDomUtil.getChildElement(a, b.getElementName()));
    this.setWhereClause(b);
    this.setObjectName(ezserverclient.easyxmlparse.EzXmlDomUtil.getAttribute(a, "objectname"));
    return this
};
ezserverclient.easyxmlparse.E_Delete.prototype.getElementName = function() {
    return "DELETE"
};
ezserverclient.easyxmlparse.E_Delete.prototype.getObjectName = function() {
    return this.objectName
};
ezserverclient.easyxmlparse.E_Delete.prototype.getWhereClause = function() {
    return this.whereClause
};
ezserverclient.easyxmlparse.E_Delete.prototype.setObjectName = function(a) {
    this.objectName = ezserverclient.easyxmlparse.EzXmlTypeUtil.toStringValue(a, "")
};
ezserverclient.easyxmlparse.E_Delete.prototype.setWhereClause = function(a) {
    if (a == null) {
        this.whereClause = new ezserverclient.easyxmlparse.E_WhereClause()
    } else {
        this.whereClause = a
    }
};
ezserverclient.easyxmlparse.E_Delete.prototype.toElement = function(b) {
    var a = ezserverclient.easyxmlparse.EzXmlDomUtil.createElementNS(b, this.getElementName());
    ezserverclient.easyxmlparse.EzXmlDomUtil.addChildElement(a, this.getWhereClause());
    ezserverclient.easyxmlparse.EzXmlDomUtil.setAttribute(a, "objectname", this.getObjectName());
    return a
};
ezserverclient.easyxmlparse.E_Delete.prototype.getDMLType = function() {
    return E_DMLType.DELETE.name
};
ezserverclient.easyxmlparse.E_EasyXml = function() {
    ezserverclient.easyxmlparse.E_Element.call(this);
    this.version = "1.1";
    this.request = null;
    this.response = null
};
ezserverclient.easyxmlparse.E_EasyXml.prototype = new ezserverclient.easyxmlparse.E_Element;
ezserverclient.easyxmlparse.E_EasyXml.prototype.fromElement = function(a) {
    if (a == null) {
        return null
    }
    var c = new ezserverclient.easyxmlparse.E_Request();
    c = c.fromElement(ezserverclient.easyxmlparse.EzXmlDomUtil.getChildElement(a, c.getElementName()));
    this.setRequest(c);
    var b = new ezserverclient.easyxmlparse.E_Response();
    b = b.fromElement(ezserverclient.easyxmlparse.EzXmlDomUtil.getChildElement(a, b.getElementName()));
    this.setResponse(b);
    this.setVersion(ezserverclient.easyxmlparse.EzXmlDomUtil.getAttribute(a, "version"));
    return this
};
ezserverclient.easyxmlparse.E_EasyXml.prototype.getElementName = function() {
    return "EASYXML"
};
ezserverclient.easyxmlparse.E_EasyXml.prototype.getRequest = function() {
    return this.request
};
ezserverclient.easyxmlparse.E_EasyXml.prototype.getResponse = function() {
    return this.response
};
ezserverclient.easyxmlparse.E_EasyXml.prototype.getVersion = function() {
    return this.version
};
ezserverclient.easyxmlparse.E_EasyXml.prototype.makeMutexEmpty = function() {
    this.request = null;
    this.response = null
};
ezserverclient.easyxmlparse.E_EasyXml.prototype.setRequest = function(a) {
    if (a != null) {
        this.makeMutexEmpty()
    }
    this.request = a
};
ezserverclient.easyxmlparse.E_EasyXml.prototype.setResponse = function(a) {
    if (a != null) {
        this.makeMutexEmpty()
    }
    this.response = a
};
ezserverclient.easyxmlparse.E_EasyXml.prototype.setVersion = function(a) {
    ezserverclient.easyxmlparse.E_EasyXml.version = ezserverclient.easyxmlparse.EzXmlTypeUtil.toStringValue(a, "1.1");
    if (ezserverclient.easyxmlparse.E_EasyXml.version != "1.1") {
        throw new Error("设置的版本号不是EasyXML1.1")
    }
};
ezserverclient.easyxmlparse.E_EasyXml.prototype.toElement = function(b) {
    var a = ezserverclient.easyxmlparse.EzXmlDomUtil.createElementNS(b, this.getElementName());
    ezserverclient.easyxmlparse.EzXmlDomUtil.addChildElement(a, this.getRequest());
    ezserverclient.easyxmlparse.EzXmlDomUtil.addChildElement(a, this.getResponse());
    ezserverclient.easyxmlparse.EzXmlDomUtil.setAttribute(a, "xmlns", ezserverclient.easyxmlparse.EzXmlDomUtil.getEzXMLNamespace());
    ezserverclient.easyxmlparse.EzXmlDomUtil.setAttribute(a, "version", this.getVersion());
    return a
};
ezserverclient.easyxmlparse.E_Error = function() {
    ezserverclient.easyxmlparse.E_Element.call(this);
    this.message = ""
};
ezserverclient.easyxmlparse.E_Error.prototype = new ezserverclient.easyxmlparse.E_Element;
ezserverclient.easyxmlparse.E_Error.prototype.fromElement = function(a) {
    if (a == null) {
        return null
    }
    this.setMessage(ezserverclient.easyxmlparse.EzXmlDomUtil.getAttribute(a, "message"));
    return this
};
ezserverclient.easyxmlparse.E_Error.prototype.getElementName = function() {
    return "ERROR"
};
ezserverclient.easyxmlparse.E_Error.prototype.getMessage = function() {
    return this.message
};
ezserverclient.easyxmlparse.E_Error.prototype.setMessage = function(a) {
    if (a == null) {
        this.message = "服务器将这个错误消息内容，错误地清空了"
    } else {
        this.message = a
    }
};
ezserverclient.easyxmlparse.E_Error.prototype.toElement = function(b) {
    var a = ezserverclient.easyxmlparse.EzXmlDomUtil.createElementNS(b, this.getElementName());
    ezserverclient.easyxmlparse.EzXmlDomUtil.setAttribute(a, "message", this.getMessage());
    return a
};
ezserverclient.easyxmlparse.E_Execute = function() {
    ezserverclient.easyxmlparse.E_Element.call(this);
    this.dmlQuery = new Array()
};
ezserverclient.easyxmlparse.E_Execute.prototype = new ezserverclient.easyxmlparse.E_Element;
ezserverclient.easyxmlparse.E_Execute.prototype.fromElement = function(k) {
    if (k == null) {
        return null
    }
    var b = new ezserverclient.easyxmlparse.E_Insert();
    var j = new ezserverclient.easyxmlparse.E_Update();
    var m = new ezserverclient.easyxmlparse.E_Select();
    var c = new ezserverclient.easyxmlparse.E_Delete();
    var a = ezserverclient.easyxmlparse.EzXmlDomUtil.getChildElements(k);
    for (var f = 0; f < a.length; f++) {
        var n = a[f].nodeName;
        if (n == b.getElementName()) {
            var g = new ezserverclient.easyxmlparse.E_Insert();
            this.addQuery(g.fromElement(a[f]))
        } else {
            if (n == j.getElementName()) {
                var l = new ezserverclient.easyxmlparse.E_Update();
                this.addQuery(l.fromElement(a[f]))
            } else {
                if (n == m.getElementName()) {
                    var d = new ezserverclient.easyxmlparse.E_Select();
                    this.addQuery(d.fromElement(a[f]))
                } else {
                    if (n == c.getElementName()) {
                        var h = new ezserverclient.easyxmlparse.E_Delete();
                        this.addQuery(h.fromElement(a[f]))
                    }
                }
            }
        }
    }
    return this
};
ezserverclient.easyxmlparse.E_Execute.prototype.getDeleteQuery = function() {
    if (this.dmlQuery.length == 0) {
        return null
    }
    if (this.dmlQuery[0] instanceof ezserverclient.easyxmlparse.E_Delete) {
        return this.dmlQuery[0]
    }
    return null
};
ezserverclient.easyxmlparse.E_Execute.prototype.getElementName = function() {
    return "EXECUTE"
};
ezserverclient.easyxmlparse.E_Execute.prototype.getInsertQuery = function() {
    if (this.dmlQuery.length == 0) {
        return null
    }
    if (this.dmlQuery[0] instanceof ezserverclient.easyxmlparse.E_Insert) {
        return this.dmlQuery[0]
    }
    return null
};
ezserverclient.easyxmlparse.E_Execute.prototype.getSelectQuery = function() {
    if (this.dmlQuery.length == 0) {
        return null
    }
    if (this.dmlQuery[0] instanceof ezserverclient.easyxmlparse.E_Select) {
        return this.dmlQuery[0]
    }
    return null
};
ezserverclient.easyxmlparse.E_Execute.prototype.getUpdateQuery = function() {
    if (this.dmlQuery.length == 0) {
        return null
    }
    if (this.dmlQuery[0] instanceof ezserverclient.easyxmlparse.E_Update) {
        return this.dmlQuery[0]
    }
    return null
};
ezserverclient.easyxmlparse.E_Execute.prototype.setDeleteQuery = function(a) {
    this.dmlQuery.splice(0, this.dmlQuery.length - 1);
    this.dmlQuery.push(a)
};
ezserverclient.easyxmlparse.E_Execute.prototype.setInsertQuery = function(a) {
    this.dmlQuery.splice(0, this.dmlQuery.length - 1);
    this.dmlQuery.push(a)
};
ezserverclient.easyxmlparse.E_Execute.prototype.setSelectQuery = function(a) {
    this.dmlQuery.splice(0, this.dmlQuery.length - 1);
    this.dmlQuery.push(a)
};
ezserverclient.easyxmlparse.E_Execute.prototype.setUpdateQuery = function(a) {
    this.dmlQuery.splice(0, this.dmlQuery.length - 1);
    this.dmlQuery.push(a)
};
ezserverclient.easyxmlparse.E_Execute.prototype.addQuery = function(a) {
    this.dmlQuery.push(a)
};
ezserverclient.easyxmlparse.E_Execute.prototype.getQueryCount = function() {
    return this.dmlQuery.length
};
ezserverclient.easyxmlparse.E_Execute.prototype.getQuery = function(a) {
    return this.dmlQuery[a - 1]
};
ezserverclient.easyxmlparse.E_Execute.prototype.toElement = function(c) {
    var a = ezserverclient.easyxmlparse.EzXmlDomUtil.createElementNS(c, this.getElementName());
    for (var b = 0; b < this.dmlQuery.length; b++) {
        ezserverclient.easyxmlparse.EzXmlDomUtil.addChildElement(a, this.dmlQuery[b])
    }
    return a
};
ezserverclient.easyxmlparse.E_FeatureExtension = function() {
    ezserverclient.easyxmlparse.E_Element.call(this);
    this.objectID = -1;
    this.displayName = null;
    this.centerX = NaN;
    this.centerY = NaN
};
ezserverclient.easyxmlparse.E_FeatureExtension.prototype = new ezserverclient.easyxmlparse.E_Element;
ezserverclient.easyxmlparse.E_FeatureExtension.prototype.fromElement = function(a) {
    if (a == null) {
        return null
    }
    this.setCenterX(ezserverclient.easyxmlparse.EzXmlTypeUtil.toDoubleValue(ezserverclient.easyxmlparse.EzXmlDomUtil.getAttribute(a, "centerx"), NaN));
    this.setCenterY(ezserverclient.easyxmlparse.EzXmlTypeUtil.toDoubleValue(ezserverclient.easyxmlparse.EzXmlDomUtil.getAttribute(a, "centery"), NaN));
    this.setDisplayName(ezserverclient.easyxmlparse.EzXmlTypeUtil.toStringValue(ezserverclient.easyxmlparse.EzXmlDomUtil.getAttribute(a, "displayname"), null));
    this.setObjectID(ezserverclient.easyxmlparse.EzXmlTypeUtil.toLongValue(ezserverclient.easyxmlparse.EzXmlDomUtil.getAttribute(a, "objectid")));
    return this
};
ezserverclient.easyxmlparse.E_FeatureExtension.prototype.getCenterX = function() {
    return this.centerX
};
ezserverclient.easyxmlparse.E_FeatureExtension.prototype.getCenterY = function() {
    return this.centerY
};
ezserverclient.easyxmlparse.E_FeatureExtension.prototype.getDisplayName = function() {
    return this.displayName
};
ezserverclient.easyxmlparse.E_FeatureExtension.prototype.getElementName = function() {
    return "FEATUREEXTENSION"
};
ezserverclient.easyxmlparse.E_FeatureExtension.prototype.getObjectID = function() {
    return this.objectID
};
ezserverclient.easyxmlparse.E_FeatureExtension.prototype.setCenterX = function(a) {
    this.centerX = a
};
ezserverclient.easyxmlparse.E_FeatureExtension.prototype.setCenterY = function(a) {
    this.centerY = a
};
ezserverclient.easyxmlparse.E_FeatureExtension.prototype.setDisplayName = function(a) {
    this.displayName = a
};
ezserverclient.easyxmlparse.E_FeatureExtension.prototype.setObjectID = function(a) {
    this.objectID = a
};
ezserverclient.easyxmlparse.E_FeatureExtension.prototype.toElement = function(b) {
    var a = ezserverclient.easyxmlparse.EzXmlDomUtil.createElementNS(b, this.getElementName());
    ezserverclient.easyxmlparse.EzXmlDomUtil.setAttribute(a, "centerx", this.getCenterX());
    ezserverclient.easyxmlparse.EzXmlDomUtil.setAttribute(a, "centery", this.getCenterY());
    ezserverclient.easyxmlparse.EzXmlDomUtil.setAttribute(a, "displayname", this.getDisplayName());
    ezserverclient.easyxmlparse.EzXmlDomUtil.setAttribute(a, "objectid", this.getObjectID());
    return a
};
ezserverclient.easyxmlparse.E_Field = function() {
    ezserverclient.easyxmlparse.E_Element.call(this);
    ezserverclient.easyxmlparse.I_SizeSensate.call(this);
    this.disyplayName = null;
    this.name = null;
    this.valuw = null;
    this.type = null
};
ezserverclient.easyxmlparse.E_Field.prototype = new ezserverclient.easyxmlparse.E_Element;
ezserverclient.easyxmlparse.E_Field.prototype = new ezserverclient.easyxmlparse.I_SizeSensate;
ezserverclient.easyxmlparse.E_Field.prototype.fromElement = function(a) {
    if (a == null) {
        return null
    }
    this.setName(ezserverclient.easyxmlparse.EzXmlDomUtil.getAttribute(a, "name"));
    this.setDisplayName(ezserverclient.easyxmlparse.EzXmlDomUtil.getAttribute(a, "displayname"));
    this.setValue(ezserverclient.easyxmlparse.EzXmlDomUtil.getAttribute(a, "value"));
    this.setType(ezserverclient.easyxmlparse.P_FieldType.getFieldType(ezserverclient.easyxmlparse.EzXmlDomUtil.getAttribute(a, "type")));
    return this
};
ezserverclient.easyxmlparse.E_Field.prototype.getDisplayName = function() {
    return this.displayName
};
ezserverclient.easyxmlparse.E_Field.prototype.getElementName = function() {
    return "FIELD"
};
ezserverclient.easyxmlparse.E_Field.prototype.getName = function() {
    return this.name
};
ezserverclient.easyxmlparse.E_Field.prototype.getValue = function() {
    return this.value
};
ezserverclient.easyxmlparse.E_Field.prototype.getType = function() {
    return this.type
};
ezserverclient.easyxmlparse.E_Field.prototype.setDisplayName = function(a) {
    this.displayName = a
};
ezserverclient.easyxmlparse.E_Field.prototype.setName = function(a) {
    this.name = a
};
ezserverclient.easyxmlparse.E_Field.prototype.setValue = function(a) {
    this.value = a
};
ezserverclient.easyxmlparse.E_Field.prototype.setType = function(a) {
    this.type = a
};
ezserverclient.easyxmlparse.E_Field.prototype.toElement = function(b) {
    var a = ezserverclient.easyxmlparse.EzXmlDomUtil.createElementNS(b, this.getElementName());
    ezserverclient.easyxmlparse.EzXmlDomUtil.setAttribute(a, "name", this.getName());
    ezserverclient.easyxmlparse.EzXmlDomUtil.setAttribute(a, "displayname", this.getDisplayName());
    ezserverclient.easyxmlparse.EzXmlDomUtil.setAttribute(a, "value", this.getValue());
    ezserverclient.easyxmlparse.EzXmlDomUtil.setAttribute(a, "type", this.getType());
    return a
};
ezserverclient.easyxmlparse.E_Field.prototype.getContentSize = function() {
    var a = 0;
    if (this.name != null) {
        a += (this.name.length << 2)
    }
    if (this.displayName != null) {
        a += (this.displayName.length << 2)
    }
    if (this.value != null) {
        a += (this.value.length << 2)
    }
    return a
};
ezserverclient.easyxmlparse.E_Fields = function() {
    ezserverclient.easyxmlparse.E_Element.call(this);
    ezserverclient.easyxmlparse.E_Collection.call(this);
    ezserverclient.easyxmlparse.I_SizeSensate.call(this);
    this.fieldContainer = new Array()
};
ezserverclient.easyxmlparse.E_Fields.prototype = new ezserverclient.easyxmlparse.E_Element;
ezserverclient.easyxmlparse.E_Fields.prototype = new ezserverclient.easyxmlparse.E_Collection;
ezserverclient.easyxmlparse.E_Fields.prototype = new ezserverclient.easyxmlparse.I_SizeSensate;
ezserverclient.easyxmlparse.E_Fields.prototype.add = function(a) {
    return this.fieldContainer.push(a)
};
ezserverclient.easyxmlparse.E_Fields.prototype.add2 = function(a) {
    return this.fieldContainer.push(a)
};
ezserverclient.easyxmlparse.E_Fields.prototype.clear = function() {
    this.fieldContainer.splice(0, this.fieldContainer.length - 1)
};
ezserverclient.easyxmlparse.E_Fields.prototype.fromElement = function(d) {
    if (d == null) {
        return null
    }
    var f = new ezserverclient.easyxmlparse.E_Field();
    tmpFdList = ezserverclient.easyxmlparse.EzXmlDomUtil.getChildElements(d, f.getElementName());
    var c = new Array();
    for (var b = 0; b < tmpFdList.length; b++) {
        var a = new ezserverclient.easyxmlparse.E_Field();
        a = a.fromElement(tmpFdList[b]);
        c.push(a)
    }
    this.fieldContainer = c;
    return this
};
ezserverclient.easyxmlparse.E_Fields.prototype.get = function(a) {
    return this.fieldContainer[a]
};
ezserverclient.easyxmlparse.E_Fields.prototype.get2 = function(a) {
    return this.fieldContainer[a]
};
ezserverclient.easyxmlparse.E_Fields.prototype.getElementName = function() {
    return "FIELDS"
};
ezserverclient.easyxmlparse.E_Fields.prototype.isEmpty = function() {
    if (this.fieldContainer.length == 0) {
        return true
    }
};
ezserverclient.easyxmlparse.E_Fields.prototype.remove = function(a) {
    return this.fieldContainer.splice(a, a)
};
ezserverclient.easyxmlparse.E_Fields.prototype.remove2 = function(a) {
    return this.fieldContainer.splice(a, a)
};
ezserverclient.easyxmlparse.E_Fields.prototype.size = function() {
    return this.fieldContainer.length
};
ezserverclient.easyxmlparse.E_Fields.prototype.toElement = function(c) {
    var a = ezserverclient.easyxmlparse.EzXmlDomUtil.createElementNS(c, this.getElementName());
    for (var b = 0; b < this.fieldContainer.length; b++) {
        ezserverclient.easyxmlparse.EzXmlDomUtil.addChildElement(a, this.fieldContainer[b])
    }
    return a
};
ezserverclient.easyxmlparse.E_Fields.prototype.getContentSize = function() {
    var b = 0;
    for (var a = 0; a < this.fieldContainer.length; a++) {
        b += this.fieldContainer[a].getContentSize()
    }
    return b
};
ezserverclient.easyxmlparse.E_FieldMeta = function() {
    ezserverclient.easyxmlparse.E_Element.call(this);
    this.name = null;
    this.displayName = null;
    this.type = null
};
ezserverclient.easyxmlparse.E_FieldMeta.prototype = new ezserverclient.easyxmlparse.E_Element;
ezserverclient.easyxmlparse.E_FieldMeta.prototype.fromElement = function(a) {
    if (a == null) {
        return null
    }
    this.setName(ezserverclient.easyxmlparse.EzXmlDomUtil.getAttribute(a, "name"));
    this.setDisplayName(ezserverclient.easyxmlparse.EzXmlDomUtil.getAttribute(a, "displayname"));
    this.setType(ezserverclient.easyxmlparse.P_FieldType.getFieldType(ezserverclient.easyxmlparse.EzXmlDomUtil.getAttribute(a, "type")));
    return this
};
ezserverclient.easyxmlparse.E_FieldMeta.prototype.getDisplayName = function() {
    return this.displayName
};
ezserverclient.easyxmlparse.E_FieldMeta.prototype.getElementName = function() {
    return "FIELDMETA"
};
ezserverclient.easyxmlparse.E_FieldMeta.prototype.getName = function() {
    return this.name
};
ezserverclient.easyxmlparse.E_FieldMeta.prototype.getType = function() {
    return this.type
};
ezserverclient.easyxmlparse.E_FieldMeta.prototype.setDisplayName = function(a) {
    this.displayName = a
};
ezserverclient.easyxmlparse.E_FieldMeta.prototype.setName = function(a) {
    this.name = a
};
ezserverclient.easyxmlparse.E_FieldMeta.prototype.setType = function(a) {
    this.type = a
};
ezserverclient.easyxmlparse.E_FieldMeta.prototype.toElement = function(b) {
    var a = ezserverclient.easyxmlparse.EzXmlDomUtil.createElementNS(b, this.getElementName());
    ezserverclient.easyxmlparse.EzXmlDomUtil.setAttribute(a, "displayname", this.getDisplayName());
    ezserverclient.easyxmlparse.EzXmlDomUtil.setAttribute(a, "name", this.getName());
    ezserverclient.easyxmlparse.EzXmlDomUtil.setAttribute(a, "type", this.getType());
    return a
};
ezserverclient.easyxmlparse.E_GetMetadata = function() {
    ezserverclient.easyxmlparse.E_Element.call(this);
    this.objectName = null
};
ezserverclient.easyxmlparse.E_GetMetadata.prototype = new ezserverclient.easyxmlparse.E_Element;
ezserverclient.easyxmlparse.E_GetMetadata.prototype.fromElement = function(a) {
    if (a == null) {
        return null
    }
    this.setObjectName(ezserverclient.easyxmlparse.EzXmlDomUtil.getAttribute(a, "objectname"));
    return this
};
ezserverclient.easyxmlparse.E_GetMetadata.prototype.getObjectName = function() {
    return this.objectName
};
ezserverclient.easyxmlparse.E_GetMetadata.prototype.setObjectName = function(a) {
    this.objectName = ezserverclient.easyxmlparse.EzXmlTypeUtil.toStringValue(a, null)
};
ezserverclient.easyxmlparse.E_GetMetadata.prototype.getElementName = function() {
    return "GETMETADATA"
};
ezserverclient.easyxmlparse.E_GetMetadata.prototype.toElement = function(b) {
    var a = ezserverclient.easyxmlparse.EzXmlDomUtil.createElementNS(b, this.getElementName());
    ezserverclient.easyxmlparse.EzXmlDomUtil.setAttribute(a, "objectname", this.getObjectName());
    return a
};
ezserverclient.easyxmlparse.E_Insert = function() {
    ezserverclient.easyxmlparse.E_DML.call(this);
    this.fields = new ezserverclient.easyxmlparse.E_Fields();
    this.objectName = null
};
ezserverclient.easyxmlparse.E_Insert.prototype = new ezserverclient.easyxmlparse.E_DML;
ezserverclient.easyxmlparse.E_Insert.prototype.fromElement = function(b) {
    if (b == null) {
        return null
    }
    var a = new ezserverclient.easyxmlparse.E_Fields();
    a = a.fromElement(ezserverclient.easyxmlparse.EzXmlDomUtil.getChildElement(b, a.getElementName()));
    this.setFields(a);
    this.setObjectName(ezserverclient.easyxmlparse.EzXmlDomUtil.getAttribute(b, "objectname"));
    return this
};
ezserverclient.easyxmlparse.E_Insert.prototype.getElementName = function() {
    return "INSERT"
};
ezserverclient.easyxmlparse.E_Insert.prototype.getFields = function() {
    return this.fields
};
ezserverclient.easyxmlparse.E_Insert.prototype.getObjectName = function() {
    return this.objectName
};
ezserverclient.easyxmlparse.E_Insert.prototype.setFields = function(a) {
    if (a == null) {
        this.fields = new ezserverclient.easyxmlparse.E_Fields()
    } else {
        this.fields = a
    }
};
ezserverclient.easyxmlparse.E_Insert.prototype.setObjectName = function(a) {
    this.objectName = ezserverclient.easyxmlparse.EzXmlTypeUtil.toStringValue(a, "")
};
ezserverclient.easyxmlparse.E_Insert.prototype.toElement = function(b) {
    var a = ezserverclient.easyxmlparse.EzXmlDomUtil.createElementNS(b, this.getElementName());
    ezserverclient.easyxmlparse.EzXmlDomUtil.addChildElement(a, this.getFields());
    ezserverclient.easyxmlparse.EzXmlDomUtil.setAttribute(a, "objectname", this.getObjectName());
    return a
};
ezserverclient.easyxmlparse.E_Insert.getDMLType = function() {
    return E_DMLType.INSERT.name
};
ezserverclient.easyxmlparse.E_LayerExtension = function() {
    ezserverclient.easyxmlparse.E_Element.call(this);
    this.fullExtent = null;
    this.spatialColumn = null;
    this.crs = null;
    this.geoType = new ezserverclient.easyxmlparse.P_GeometryType()
};
ezserverclient.easyxmlparse.E_LayerExtension.prototype = new ezserverclient.easyxmlparse.E_Element;
ezserverclient.easyxmlparse.E_LayerExtension.prototype.fromElement = function(a) {
    if (a == null) {
        return null
    }
    this.setFullExtent(ezserverclient.easyxmlparse.EzXmlDomUtil.getAttribute(a, "fullextent"));
    this.setSpatialColumn(ezserverclient.easyxmlparse.EzXmlDomUtil.getAttribute(a, "spatialcolumn"));
    this.setCrs(ezserverclient.easyxmlparse.EzXmlDomUtil.getAttribute(a, "crs"));
    this.setGeoType(ezserverclient.easyxmlparse.P_GeometryType.getGeometryType(ezserverclient.easyxmlparse.EzXmlDomUtil.getAttribute(a, "geotype")));
    return this
};
ezserverclient.easyxmlparse.E_LayerExtension.prototype.getElementName = function() {
    return "LAYEREXTENSION"
};
ezserverclient.easyxmlparse.E_LayerExtension.prototype.getCrs = function() {
    return this.crs
};
ezserverclient.easyxmlparse.E_LayerExtension.prototype.setCrs = function(a) {
    this.crs = a
};
ezserverclient.easyxmlparse.E_LayerExtension.prototype.getFullExtent = function() {
    return this.fullExtent
};
ezserverclient.easyxmlparse.E_LayerExtension.prototype.getGeoType = function() {
    return this.geoType
};
ezserverclient.easyxmlparse.E_LayerExtension.prototype.getSpatialColumn = function() {
    return this.spatialColumn
};
ezserverclient.easyxmlparse.E_LayerExtension.prototype.setFullExtent = function(a) {
    this.fullExtent = a
};
ezserverclient.easyxmlparse.E_LayerExtension.prototype.setGeoType = function(a) {
    this.geoType = a
};
ezserverclient.easyxmlparse.E_LayerExtension.prototype.setSpatialColumn = function(a) {
    this.spatialColumn = a
};
ezserverclient.easyxmlparse.E_LayerExtension.prototype.toElement = function(b) {
    var a = ezserverclient.easyxmlparse.EzXmlDomUtil.createElementNS(b, this.getElementName());
    ezserverclient.easyxmlparse.EzXmlDomUtil.setAttribute(a, "crs", this.getCrs());
    ezserverclient.easyxmlparse.EzXmlDomUtil.setAttribute(a, "fullextent", this.getFullExtent());
    ezserverclient.easyxmlparse.EzXmlDomUtil.setAttribute(a, "geotype", this.getGeoType());
    ezserverclient.easyxmlparse.EzXmlDomUtil.setAttribute(a, "spatialcolumn", this.getSpatialColumn());
    return a
};
ezserverclient.easyxmlparse.E_LinkTable = function() {
    ezserverclient.easyxmlparse.E_Element.call(this);
    this.objectName = null;
    this.where = null
};
ezserverclient.easyxmlparse.E_LinkTable.prototype = new ezserverclient.easyxmlparse.E_Element;
ezserverclient.easyxmlparse.E_LinkTable.prototype.fromElement = function(a) {
    if (a == null) {
        return null
    }
    var b = new ezserverclient.easyxmlparse.E_WhereClause();
    b = b.fromElement(ezserverclient.easyxmlparse.EzXmlDomUtil.getChildElement(a, b.getElementName()));
    this.setWhere(b);
    this.setObjectName(ezserverclient.easyxmlparse.EzXmlDomUtil.getAttribute(a, "objectname"));
    return this
};
ezserverclient.easyxmlparse.E_LinkTable.prototype.getObjectName = function() {
    return this.objectName
};
ezserverclient.easyxmlparse.E_LinkTable.prototype.setObjectName = function(a) {
    this.objectName = ezserverclient.easyxmlparse.EzXmlTypeUtil.toStringValue(a, "")
};
ezserverclient.easyxmlparse.E_LinkTable.prototype.setWhere = function(a) {
    if (a == null) {
        this.where = null
    } else {
        this.where = a
    }
};
ezserverclient.easyxmlparse.E_LinkTable.prototype.getWhere = function() {
    return this.where
};
ezserverclient.easyxmlparse.E_LinkTable.prototype.getElementName = function() {
    return "LINKTABLE"
};
ezserverclient.easyxmlparse.E_LinkTable.prototype.toElement = function(b) {
    var a = ezserverclient.easyxmlparse.EzXmlDomUtil.createElementNS(b, this.getElementName());
    ezserverclient.easyxmlparse.EzXmlDomUtil.addChildElement(a, this.getWhere());
    ezserverclient.easyxmlparse.EzXmlDomUtil.setAttribute(a, "objectname", this.getObjectName());
    return a
};
ezserverclient.easyxmlparse.E_Metadata = function() {
    ezserverclient.easyxmlparse.E_Element.call(this);
    this.tablesMeta = new ezserverclient.easyxmlparse.E_TablesMeta()
};
ezserverclient.easyxmlparse.E_Metadata.prototype = new ezserverclient.easyxmlparse.E_Element;
ezserverclient.easyxmlparse.E_Metadata.prototype.fromElement = function(a) {
    if (a == null) {
        return null
    }
    var b = new ezserverclient.easyxmlparse.E_TablesMeta();
    b = b.fromElement(ezserverclient.easyxmlparse.EzXmlDomUtil.getChildElement(a, b.getElementName()));
    this.setTablesMeta(b);
    return this
};
ezserverclient.easyxmlparse.E_Metadata.prototype.getElementName = function() {
    return "METADATA"
};
ezserverclient.easyxmlparse.E_Metadata.prototype.getTablesMeta = function() {
    return this.tablesMeta
};
ezserverclient.easyxmlparse.E_Metadata.prototype.setTablesMeta = function(a) {
    if (a == null) {
        this.tablesMeta = new ezserverclient.easyxmlparse.E_TablesMeta()
    } else {
        this.tablesMeta = a
    }
};
ezserverclient.easyxmlparse.E_Metadata.prototype.toElement = function(b) {
    var a = ezserverclient.easyxmlparse.EzXmlDomUtil.createElementNS(b, this.getElementName());
    ezserverclient.easyxmlparse.EzXmlDomUtil.addChildElement(a, this.getTablesMeta());
    return a
};
ezserverclient.easyxmlparse.E_OrderByClause = function(a) {
    ezserverclient.easyxmlparse.E_Element.call(this);
    if (a) {
        this.setContent(a)
    } else {
        this.content = ""
    }
};
ezserverclient.easyxmlparse.E_OrderByClause.prototype = new ezserverclient.easyxmlparse.E_Element;
ezserverclient.easyxmlparse.E_OrderByClause.prototype.fromElement = function(b) {
    if (b == null) {
        return null
    }
    var a = ezserverclient.easyxmlparse.EzXmlDomUtil.getContext(b);
    this.setContent(a);
    return this
};
ezserverclient.easyxmlparse.E_OrderByClause.prototype.getContent = function() {
    return this.content
};
ezserverclient.easyxmlparse.E_OrderByClause.prototype.getElementName = function() {
    return "ORDERBYCLAUSE"
};
ezserverclient.easyxmlparse.E_OrderByClause.prototype.setContent = function(b) {
    var a = ezserverclient.easyxmlparse.string_trim(ezserverclient.easyxmlparse.EzXmlTypeUtil.toStringValue(b, ""));
    if (a.length == 0) {
        this.content = ""
    } else {
        this.content = a
    }
};
ezserverclient.easyxmlparse.E_OrderByClause.prototype.toElement = function(b) {
    var a = ezserverclient.easyxmlparse.EzXmlDomUtil.createElementNS(b, this.getElementName());
    ezserverclient.easyxmlparse.EzXmlDomUtil.setContext(a, this.getContent());
    return a
};
ezserverclient.easyxmlparse.E_Record = function() {
    ezserverclient.easyxmlparse.E_Element.call(this);
    ezserverclient.easyxmlparse.I_SizeSensate.call(this);
    this.featureExtension = new ezserverclient.easyxmlparse.E_FeatureExtension();
    this.fields = new ezserverclient.easyxmlparse.E_Fields();
    this.objectID = -1
};
ezserverclient.easyxmlparse.E_Record.prototype = new ezserverclient.easyxmlparse.E_Element;
ezserverclient.easyxmlparse.E_Record.prototype = new ezserverclient.easyxmlparse.I_SizeSensate;
ezserverclient.easyxmlparse.E_Record.prototype.fromElement = function(b) {
    if (b == null) {
        return null
    }
    var a = new ezserverclient.easyxmlparse.E_FeatureExtension();
    a = a.fromElement(ezserverclient.easyxmlparse.EzXmlDomUtil.getChildElement(b, a.getElementName()));
    this.setFeatureExtension(a);
    var c = new ezserverclient.easyxmlparse.E_Fields();
    c = c.fromElement(ezserverclient.easyxmlparse.EzXmlDomUtil.getChildElement(b, c.getElementName()));
    this.setFields(c);
    this.setObjectID(ezserverclient.easyxmlparse.EzXmlTypeUtil.toLongValue(ezserverclient.easyxmlparse.EzXmlDomUtil.getAttribute(b, "objectid")));
    return this
};
ezserverclient.easyxmlparse.E_Record.prototype.getElementName = function() {
    return "RECORD"
};
ezserverclient.easyxmlparse.E_Record.prototype.getFeatureExtension = function() {
    return this.featureExtension
};
ezserverclient.easyxmlparse.E_Record.prototype.getFields = function() {
    return this.fields
};
ezserverclient.easyxmlparse.E_Record.prototype.getObjectID = function() {
    return this.objectID
};
ezserverclient.easyxmlparse.E_Record.prototype.setFeatureExtension = function(a) {
    this.featureExtension = a
};
ezserverclient.easyxmlparse.E_Record.prototype.setFields = function(a) {
    if (a == null) {
        this.fields = new ezserverclient.easyxmlparse.E_Fields()
    } else {
        this.fields = a
    }
};
ezserverclient.easyxmlparse.E_Record.prototype.setObjectID = function(a) {
    this.objectID = a
};
ezserverclient.easyxmlparse.E_Record.prototype.toElement = function(b) {
    var a = ezserverclient.easyxmlparse.EzXmlDomUtil.createElementNS(b, this.getElementName());
    ezserverclient.easyxmlparse.EzXmlDomUtil.addChildElement(a, this.getFeatureExtension());
    ezserverclient.easyxmlparse.EzXmlDomUtil.addChildElement(a, this.getFields());
    ezserverclient.easyxmlparse.EzXmlDomUtil.setAttribute(a, "objectid", this.getObjectID());
    return a
};
ezserverclient.easyxmlparse.E_Record.prototype.getContentSize = function() {
    if (this.getFields() == null) {
        return 0
    } else {
        return this.getFields().getContentSize()
    }
};
ezserverclient.easyxmlparse.E_Records = function() {
    ezserverclient.easyxmlparse.E_Element.call(this);
    ezserverclient.easyxmlparse.E_Collection.call(this);
    ezserverclient.easyxmlparse.I_SizeSensate.call(this);
    this.recordContainer = new Array();
    this.recordCount = -1
};
ezserverclient.easyxmlparse.E_Records.prototype = new ezserverclient.easyxmlparse.E_Element;
ezserverclient.easyxmlparse.E_Records.prototype = new ezserverclient.easyxmlparse.E_Collection;
ezserverclient.easyxmlparse.E_Records.prototype = new ezserverclient.easyxmlparse.I_SizeSensate;
ezserverclient.easyxmlparse.E_Records.prototype.add = function(a) {
    return this.recordContainer.push(a)
};
ezserverclient.easyxmlparse.E_Records.prototype.add2 = function(a) {
    return this.recordContainer.push(a)
};
ezserverclient.easyxmlparse.E_Records.prototype.clear = function() {
    this.recordContainer.splice(0, this.recordContainer.length - 1)
};
ezserverclient.easyxmlparse.E_Records.prototype.fromElement = function(f) {
    if (f == null) {
        return null
    }
    var d = new ezserverclient.easyxmlparse.E_Record();
    var c = ezserverclient.easyxmlparse.EzXmlDomUtil.getChildElements(f, d.getElementName());
    var g = new Array();
    for (var b = 0; b < c.length; b++) {
        var a = new ezserverclient.easyxmlparse.E_Record();
        a = a.fromElement(c[b]);
        g.push(a)
    }
    this.recordContainer = g;
    this.setRecordCount(ezserverclient.easyxmlparse.EzXmlTypeUtil.toLongValue(ezserverclient.easyxmlparse.EzXmlDomUtil.getAttribute(f, "recordcount"), -1));
    return this
};
ezserverclient.easyxmlparse.E_Records.prototype.get = function(a) {
    return this.recordContainer[a]
};
ezserverclient.easyxmlparse.E_Records.prototype.get2 = function(a) {
    return this.recordContainer[a]
};
ezserverclient.easyxmlparse.E_Records.prototype.getElementName = function() {
    return "RECORDS"
};
ezserverclient.easyxmlparse.E_Records.prototype.getFeatureCount = function() {
    return this.recordContainer.length
};
ezserverclient.easyxmlparse.E_Records.prototype.getRecordCount = function() {
    if (this.recordCount != -1) {
        return this.recordCount
    } else {
        return this.getFeatureCount()
    }
};
ezserverclient.easyxmlparse.E_Records.prototype.isEmpty = function() {
    if (this.recordContainer.length == 0) {
        return true
    }
};
ezserverclient.easyxmlparse.E_Records.prototype.remove = function(a) {
    return this.splice(a, a)
};
ezserverclient.easyxmlparse.E_Records.prototype.remove2 = function(a) {
    return this.recordContainer.splice(a, a)
};
ezserverclient.easyxmlparse.E_Records.prototype.setRecordCount = function(a) {
    this.recordCount = a
};
ezserverclient.easyxmlparse.E_Records.prototype.size = function() {
    return this.recordContainer.length
};
ezserverclient.easyxmlparse.E_Records.prototype.toElement = function(c) {
    var a = ezserverclient.easyxmlparse.EzXmlDomUtil.createElementNS(c, this.getElementName());
    for (var b = 0; b < this.recordContainer.length; b++) {
        ezserverclient.easyxmlparse.EzXmlDomUtil.addChildElement(a, this.recordContainer[b])
    }
    ezserverclient.easyxmlparse.EzXmlDomUtil.setAttribute(a, "recordcount", ezserverclient.easyxmlparse.EzXmlTypeUtil.toStringValue(this.getRecordCount()));
    return a
};
ezserverclient.easyxmlparse.E_Records.prototype.getContentSize = function() {
    var b = 0;
    for (var a = 0; a < this.recordContainer.length; a++) {
        b += this.recordContainer[a].getContentSize()
    }
    return b
};
ezserverclient.easyxmlparse.E_Request = function() {
    ezserverclient.easyxmlparse.E_Element.call(this);
    this.execute = new ezserverclient.easyxmlparse.E_Execute();
    this.funcMetaData = new ezserverclient.easyxmlparse.E_GetMetadata();
    this.freeText = null
};
ezserverclient.easyxmlparse.E_Request.prototype = new ezserverclient.easyxmlparse.E_Element;
ezserverclient.easyxmlparse.E_Request.prototype.fromElement = function(b) {
    if (b == null) {
        return null
    }
    var a = new ezserverclient.easyxmlparse.E_Execute();
    var a = a.fromElement(ezserverclient.easyxmlparse.EzXmlDomUtil.getChildElement(b, a.getElementName()));
    this.setExecute(a);
    var c = new ezserverclient.easyxmlparse.E_GetMetadata();
    var c = c.fromElement(ezserverclient.easyxmlparse.EzXmlDomUtil.getChildElement(b, c.getElementName()));
    this.setFuncMetadata(c);
    this.setFreeText(ezserverclient.easyxmlparse.EzXmlDomUtil.getAttribute(b, "freetext"));
    return this
};
ezserverclient.easyxmlparse.E_Request.prototype.getElementName = function() {
    return "REQUEST"
};
ezserverclient.easyxmlparse.E_Request.prototype.getExecute = function() {
    return this.execute
};
ezserverclient.easyxmlparse.E_Request.prototype.getFreeText = function() {
    return this.freeText
};
ezserverclient.easyxmlparse.E_Request.prototype.getFuncMetadata = function() {
    return this.funcMetadata
};
ezserverclient.easyxmlparse.E_Request.prototype.makeMutexEmpty = function() {
    this.execute = null;
    this.funcMetadata = null
};
ezserverclient.easyxmlparse.E_Request.prototype.setExecute = function(a) {
    if (a != null) {
        this.makeMutexEmpty()
    }
    this.execute = a
};
ezserverclient.easyxmlparse.E_Request.prototype.setFreeText = function(a) {
    this.freeText = a
};
ezserverclient.easyxmlparse.E_Request.prototype.setFuncMetadata = function(a) {
    if (a != null) {
        this.makeMutexEmpty()
    }
    this.funcMetadata = a
};
ezserverclient.easyxmlparse.E_Request.prototype.toElement = function(b) {
    var a = ezserverclient.easyxmlparse.EzXmlDomUtil.createElementNS(b, this.getElementName());
    ezserverclient.easyxmlparse.EzXmlDomUtil.addChildElement(a, this.getExecute());
    ezserverclient.easyxmlparse.EzXmlDomUtil.addChildElement(a, this.getFuncMetadata());
    ezserverclient.easyxmlparse.EzXmlDomUtil.setAttribute(a, "freetext", this.getFreeText());
    return a
};
ezserverclient.easyxmlparse.E_Response = function() {
    ezserverclient.easyxmlparse.E_Element.call(this);
    this.error = new ezserverclient.easyxmlparse.E_Error();
    this.success = new ezserverclient.easyxmlparse.E_Success();
    this.metadata = new ezserverclient.easyxmlparse.E_Metadata();
    this.resultSet = new ezserverclient.easyxmlparse.E_ResultSet()
};
ezserverclient.easyxmlparse.E_Response.prototype = new ezserverclient.easyxmlparse.E_Element;
ezserverclient.easyxmlparse.E_Response.prototype.fromElement = function(b) {
    if (b == null) {
        return null
    }
    var d = new ezserverclient.easyxmlparse.E_Error();
    d = d.fromElement(ezserverclient.easyxmlparse.EzXmlDomUtil.getChildElement(b, d.getElementName()));
    this.setError(d);
    var f = new ezserverclient.easyxmlparse.E_Success();
    f = f.fromElement(ezserverclient.easyxmlparse.EzXmlDomUtil.getChildElement(b, f.getElementName()));
    this.setSuccess(f);
    var c = new ezserverclient.easyxmlparse.E_Metadata();
    c = c.fromElement(ezserverclient.easyxmlparse.EzXmlDomUtil.getChildElement(b, c.getElementName()));
    this.setMetadata(c);
    var a = new ezserverclient.easyxmlparse.E_ResultSet();
    a = a.fromElement(ezserverclient.easyxmlparse.EzXmlDomUtil.getChildElement(b, a.getElementName()));
    this.setResultSet(a);
    this.setFreeText(ezserverclient.easyxmlparse.EzXmlDomUtil.getAttribute(b, "freetext"));
    return this
};
ezserverclient.easyxmlparse.E_Response.prototype.getElementName = function() {
    return "RESPONSE"
};
ezserverclient.easyxmlparse.E_Response.prototype.getError = function() {
    return this.error
};
ezserverclient.easyxmlparse.E_Response.prototype.getFreeText = function() {
    return this.freeText
};
ezserverclient.easyxmlparse.E_Response.prototype.getMetadata = function() {
    return this.metadata
};
ezserverclient.easyxmlparse.E_Response.prototype.getResultSet = function() {
    return this.resultSet
};
ezserverclient.easyxmlparse.E_Response.prototype.getSuccess = function() {
    return this.success
};
ezserverclient.easyxmlparse.E_Response.prototype.makeMutexEmpty = function() {
    this.error = null;
    this.success = null;
    this.metadata = null;
    this.resultSet = null
};
ezserverclient.easyxmlparse.E_Response.prototype.setError = function(a) {
    if (a != null) {
        this.makeMutexEmpty()
    }
    this.error = a
};
ezserverclient.easyxmlparse.E_Response.prototype.setFreeText = function(a) {
    this.freeText = a
};
ezserverclient.easyxmlparse.E_Response.prototype.setMetadata = function(a) {
    if (a != null) {
        this.makeMutexEmpty()
    }
    this.metadata = a
};
ezserverclient.easyxmlparse.E_Response.prototype.setResultSet = function(a) {
    if (a != null) {
        this.makeMutexEmpty()
    }
    this.resultSet = a
};
ezserverclient.easyxmlparse.E_Response.prototype.setSuccess = function(a) {
    if (a != null) {
        this.makeMutexEmpty()
    }
    this.success = a
};
ezserverclient.easyxmlparse.E_Response.prototype.toElement = function(b) {
    var a = ezserverclient.easyxmlparse.EzXmlDomUtil.createElementNS(b, this.getElementName());
    ezserverclient.easyxmlparse.EzXmlDomUtil.addChildElement(a, this.getError());
    ezserverclient.easyxmlparse.EzXmlDomUtil.addChildElement(a, this.getSuccess());
    ezserverclient.easyxmlparse.EzXmlDomUtil.addChildElement(a, this.getMetadata());
    ezserverclient.easyxmlparse.EzXmlDomUtil.addChildElement(a, this.getResultSet());
    ezserverclient.easyxmlparse.EzXmlDomUtil.setAttribute(a, "freetext", this.getFreeText());
    return a
};
ezserverclient.easyxmlparse.E_ResultSet = function() {
    ezserverclient.easyxmlparse.E_Element.call(this);
    ezserverclient.easyxmlparse.I_SizeSensate.call(this);
    this.layerExtension = new ezserverclient.easyxmlparse.E_LayerExtension();
    this.objectIdColumn = null;
    this.objectName = null;
    this.records = new ezserverclient.easyxmlparse.E_Records();
    this.spatialFilterObjects = new ezserverclient.easyxmlparse.E_SpatialFilterObjects()
};
ezserverclient.easyxmlparse.E_ResultSet.prototype = new ezserverclient.easyxmlparse.E_Element;
ezserverclient.easyxmlparse.E_ResultSet.prototype = new ezserverclient.easyxmlparse.I_SizeSensate;
ezserverclient.easyxmlparse.E_ResultSet.prototype.fromElement = function(b) {
    if (b == null) {
        return null
    }
    var a = new ezserverclient.easyxmlparse.E_LayerExtension();
    a = a.fromElement(ezserverclient.easyxmlparse.EzXmlDomUtil.getChildElement(b, a.getElementName()));
    this.setLayerExtension(a);
    var d = new ezserverclient.easyxmlparse.E_SpatialFilterObjects();
    d = d.fromElement(ezserverclient.easyxmlparse.EzXmlDomUtil.getChildElement(b, d.getElementName()));
    this.setSpatialFilterObjects(d);
    var c = new ezserverclient.easyxmlparse.E_Records();
    c = c.fromElement(ezserverclient.easyxmlparse.EzXmlDomUtil.getChildElement(b, c.getElementName()));
    this.setRecords(c);
    this.setObjectName(ezserverclient.easyxmlparse.EzXmlDomUtil.getAttribute(b, "objectname"));
    this.setObjectIdColumn(ezserverclient.easyxmlparse.EzXmlDomUtil.getAttribute(b, "objectidcolumn"));
    return this
};
ezserverclient.easyxmlparse.E_ResultSet.prototype.getElementName = function() {
    return "RESULTSET"
};
ezserverclient.easyxmlparse.E_ResultSet.prototype.getLayerExtension = function() {
    return this.layerExtension
};
ezserverclient.easyxmlparse.E_ResultSet.prototype.getObjectIdColumn = function() {
    return this.objectIdColumn
};
ezserverclient.easyxmlparse.E_ResultSet.prototype.getObjectName = function() {
    return this.objectName
};
ezserverclient.easyxmlparse.E_ResultSet.prototype.getRecords = function() {
    return this.records
};
ezserverclient.easyxmlparse.E_ResultSet.prototype.getSpatialFilterObjects = function() {
    return this.spatialFilterObjects
};
ezserverclient.easyxmlparse.E_ResultSet.prototype.setLayerExtension = function(a) {
    this.layerExtension = a
};
ezserverclient.easyxmlparse.E_ResultSet.prototype.setObjectIdColumn = function(a) {
    this.objectIdColumn = a
};
ezserverclient.easyxmlparse.E_ResultSet.prototype.setObjectName = function(a) {
    this.objectName = ezserverclient.easyxmlparse.EzXmlTypeUtil.toStringValue(a, "")
};
ezserverclient.easyxmlparse.E_ResultSet.prototype.setRecords = function(a) {
    if (a == null) {
        this.records = new ezserverclient.easyxmlparse.E_Records()
    } else {
        this.records = a
    }
};
ezserverclient.easyxmlparse.E_ResultSet.prototype.setSpatialFilterObjects = function(a) {
    this.spatialFilterObjects = a
};
ezserverclient.easyxmlparse.E_ResultSet.prototype.toElement = function(b) {
    var a = ezserverclient.easyxmlparse.EzXmlDomUtil.createElementNS(b, this.getElementName());
    ezserverclient.easyxmlparse.EzXmlDomUtil.addChildElement(a, this.getLayerExtension());
    ezserverclient.easyxmlparse.EzXmlDomUtil.addChildElement(a, this.getSpatialFilterObjects());
    ezserverclient.easyxmlparse.EzXmlDomUtil.addChildElement(a, this.getRecords());
    ezserverclient.easyxmlparse.EzXmlDomUtil.setAttribute(a, "objectname", this.getObjectName());
    ezserverclient.easyxmlparse.EzXmlDomUtil.setAttribute(a, "objectidcolumn", this.getObjectIdColumn());
    return a
};
ezserverclient.easyxmlparse.E_ResultSet.prototype.getContentSize = function() {
    if (this.records == null) {
        return 0
    } else {
        return this.records.getContentSize()
    }
};
ezserverclient.easyxmlparse.E_Select = function() {
    ezserverclient.easyxmlparse.E_DML.call(this);
    this.beginRecord = 0;
    this.objectName = null;
    this.featureLimit = 1000000;
    this.columns = new ezserverclient.easyxmlparse.E_ColumnsClause();
    this.spatialFilters = new ezserverclient.easyxmlparse.E_SpatialFilters();
    this.where = new ezserverclient.easyxmlparse.E_WhereClause();
    this.linkTable = null;
    this.orderBy = null;
    this.alwaysReturnShape = 0;
    this.precision = null;
    this.distanceTolerance = null;
    this.solverecordcount = true
};
ezserverclient.easyxmlparse.E_Select.prototype = new ezserverclient.easyxmlparse.E_DML;
ezserverclient.easyxmlparse.E_Select.prototype.fromElement = function(b) {
    if (b == null) {
        return null
    }
    var f = new ezserverclient.easyxmlparse.E_ColumnsClause();
    f = f.fromElement(ezserverclient.easyxmlparse.EzXmlDomUtil.getChildElement(b, f.getElementName()));
    this.setColumns(f);
    var g = new ezserverclient.easyxmlparse.E_LinkTable();
    g = g.fromElement(ezserverclient.easyxmlparse.EzXmlDomUtil.getChildElement(b, g.getElementName()));
    this.setLinkTable(g);
    var c = new ezserverclient.easyxmlparse.E_WhereClauseSelect();
    c = c.fromElement(ezserverclient.easyxmlparse.EzXmlDomUtil.getChildElement(b, c.getElementName()));
    this.setWhere(c);
    var d = new ezserverclient.easyxmlparse.E_SpatialFilters();
    d = d.fromElement(ezserverclient.easyxmlparse.EzXmlDomUtil.getChildElement(b, d.getElementName()));
    this.setSpatialFilters(d);
    var a = new ezserverclient.easyxmlparse.E_OrderByClause();
    a = a.fromElement(ezserverclient.easyxmlparse.EzXmlDomUtil.getChildElement(b, a.getElementName()));
    this.setOrderBy(a);
    this.setBeginRecord(ezserverclient.easyxmlparse.EzXmlTypeUtil.toLongValue(ezserverclient.easyxmlparse.EzXmlDomUtil.getAttribute(b, "beginrecord"), 0));
    this.setSolveRecordcount(ezserverclient.easyxmlparse.EzXmlTypeUtil.toBooleanValue(ezserverclient.easyxmlparse.EzXmlDomUtil.getAttribute(b, "solverecordcount"), true));
    this.setFeatureLimit(ezserverclient.easyxmlparse.EzXmlTypeUtil.toLongValue(ezserverclient.easyxmlparse.EzXmlDomUtil.getAttribute(b, "featurelimit"), 1000000));
    this.setObjectName(ezserverclient.easyxmlparse.EzXmlDomUtil.getAttribute(b, "objectname"));
    this.setAlwaysReturnShape(ezserverclient.easyxmlparse.EzXmlTypeUtil.toBooleanValue(ezserverclient.easyxmlparse.EzXmlDomUtil.getAttribute(b, "alwaysreturnshape"), false));
    this.setPrecision(ezserverclient.easyxmlparse.EzXmlTypeUtil.toIntegerValue(ezserverclient.easyxmlparse.EzXmlDomUtil.getAttribute(b, "precision"), 12));
    this.setDistanceTolerance(ezserverclient.easyxmlparse.EzXmlTypeUtil.toDoubleValue(ezserverclient.easyxmlparse.EzXmlDomUtil.getAttribute(b, "distancetolerance"), 0));
    return this
};
ezserverclient.easyxmlparse.E_Select.prototype.getOrderBy = function() {
    return this.orderBy
};
ezserverclient.easyxmlparse.E_Select.prototype.setOrderBy = function(a) {
    this.orderBy = a
};
ezserverclient.easyxmlparse.E_Select.prototype.getSolveRecordcount = function() {
    return this.solverecordcount
};
ezserverclient.easyxmlparse.E_Select.prototype.setSolveRecordcount = function(a) {
    this.solverecordcount = a
};
ezserverclient.easyxmlparse.E_Select.prototype.getBeginRecord = function() {
    return this.beginRecord
};
ezserverclient.easyxmlparse.E_Select.prototype.getColumns = function() {
    return this.columns
};
ezserverclient.easyxmlparse.E_Select.prototype.getDistanceTolerance = function() {
    return this.distanceTolerance
};
ezserverclient.easyxmlparse.E_Select.prototype.getElementName = function() {
    return "SELECT"
};
ezserverclient.easyxmlparse.E_Select.prototype.getFeatureLimit = function() {
    return this.featureLimit
};
ezserverclient.easyxmlparse.E_Select.prototype.getLinkTable = function() {
    return this.linkTable
};
ezserverclient.easyxmlparse.E_Select.prototype.getObjectName = function() {
    return this.objectName
};
ezserverclient.easyxmlparse.E_Select.prototype.getPrecision = function() {
    return this.precision
};
ezserverclient.easyxmlparse.E_Select.prototype.getSpatialFilters = function() {
    return this.spatialFilters
};
ezserverclient.easyxmlparse.E_Select.prototype.getWhere = function() {
    return this.where
};
ezserverclient.easyxmlparse.E_Select.prototype.isAlwaysReturnShape = function() {
    return this.alwaysReturnShape
};
ezserverclient.easyxmlparse.E_Select.prototype.setAlwaysReturnShape = function(a) {
    this.alwaysReturnShape = a
};
ezserverclient.easyxmlparse.E_Select.prototype.setBeginRecord = function(a) {
    if (a < 0) {
        this.beginRecord = 0
    } else {
        this.beginRecord = a
    }
};
ezserverclient.easyxmlparse.E_Select.prototype.setColumns = function(a) {
    if (this.columns == null) {
        this.columns = new ezserverclient.easyxmlparse.E_ColumnsClause()
    } else {
        this.columns = a
    }
};
ezserverclient.easyxmlparse.E_Select.prototype.setDistanceTolerance = function(a) {
    this.distanceTolerance = a
};
ezserverclient.easyxmlparse.E_Select.prototype.setFeatureLimit = function(a) {
    if (a < 0) {
        this.featureLimit = 0
    } else {
        this.featureLimit = a
    }
};
ezserverclient.easyxmlparse.E_Select.prototype.setLinkTable = function(a) {
    this.linkTable = a
};
ezserverclient.easyxmlparse.E_Select.prototype.setObjectName = function(a) {
    this.objectName = ezserverclient.easyxmlparse.EzXmlTypeUtil.toStringValue(a, "")
};
ezserverclient.easyxmlparse.E_Select.prototype.setPrecision = function(a) {
    this.precision = a
};
ezserverclient.easyxmlparse.E_Select.prototype.setSpatialFilters = function(a) {
    this.spatialFilters = a
};
ezserverclient.easyxmlparse.E_Select.prototype.setWhere = function(a) {
    this.where = a
};
ezserverclient.easyxmlparse.E_Select.prototype.toElement = function(b) {
    var a = ezserverclient.easyxmlparse.EzXmlDomUtil.createElementNS(b, this.getElementName());
    ezserverclient.easyxmlparse.EzXmlDomUtil.addChildElement(a, this.getColumns());
    ezserverclient.easyxmlparse.EzXmlDomUtil.addChildElement(a, this.getLinkTable());
    ezserverclient.easyxmlparse.EzXmlDomUtil.addChildElement(a, this.getWhere());
    ezserverclient.easyxmlparse.EzXmlDomUtil.addChildElement(a, this.getSpatialFilters());
    ezserverclient.easyxmlparse.EzXmlDomUtil.addChildElement(a, this.getOrderBy());
    ezserverclient.easyxmlparse.EzXmlDomUtil.setAttribute(a, "beginrecord", ezserverclient.easyxmlparse.EzXmlTypeUtil.toStringValue(this.getBeginRecord()));
    ezserverclient.easyxmlparse.EzXmlDomUtil.setAttribute(a, "solverecordcount", ezserverclient.easyxmlparse.EzXmlTypeUtil.toStringValue(this.getSolveRecordcount()));
    ezserverclient.easyxmlparse.EzXmlDomUtil.setAttribute(a, "featurelimit", ezserverclient.easyxmlparse.EzXmlTypeUtil.toStringValue(this.getFeatureLimit()));
    ezserverclient.easyxmlparse.EzXmlDomUtil.setAttribute(a, "objectname", this.getObjectName());
    ezserverclient.easyxmlparse.EzXmlDomUtil.setAttribute(a, "alwaysreturnshape", ezserverclient.easyxmlparse.EzXmlTypeUtil.toStringValue(this.isAlwaysReturnShape()));
    ezserverclient.easyxmlparse.EzXmlDomUtil.setAttribute(a, "precision", ezserverclient.easyxmlparse.EzXmlTypeUtil.toStringValue(this.getPrecision()));
    ezserverclient.easyxmlparse.EzXmlDomUtil.setAttribute(a, "distancetolerance", ezserverclient.easyxmlparse.EzXmlTypeUtil.toStringValue(this.getDistanceTolerance()));
    return a
};
ezserverclient.easyxmlparse.E_Select.prototype.getDMLType = function() {
    return E_DMLType.SELECT.name
};
ezserverclient.easyxmlparse.E_Shape = function() {
    ezserverclient.easyxmlparse.E_Element.call(this);
    this.content = "";
    this.geoType = null
};
ezserverclient.easyxmlparse.E_Shape.prototype = new ezserverclient.easyxmlparse.E_Element;
ezserverclient.easyxmlparse.E_Shape.prototype.fromElement = function(b) {
    if (b == null) {
        return null
    }
    var a = ezserverclient.easyxmlparse.EzXmlDomUtil.getContext(b);
    this.setContent(a);
    this.setGeoType(ezserverclient.easyxmlparse.P_GeometryType.getGeometryType(ezserverclient.easyxmlparse.EzXmlDomUtil.getAttribute(b, "geotype")));
    return this
};
ezserverclient.easyxmlparse.E_Shape.prototype.getContent = function() {
    return this.content
};
ezserverclient.easyxmlparse.E_Shape.prototype.getElementName = function() {
    return "SHAPE"
};
ezserverclient.easyxmlparse.E_Shape.prototype.getGeoType = function() {
    return this.geoType
};
ezserverclient.easyxmlparse.E_Shape.prototype.setContent = function(a) {
    this.content = ezserverclient.easyxmlparse.string_trim(ezserverclient.easyxmlparse.EzXmlTypeUtil.toStringValue(a, ""))
};
ezserverclient.easyxmlparse.E_Shape.prototype.setGeoType = function(a) {
    if (a == null) {
        this.geoType = ezserverclient.easyxmlparse.P_GeometryType.NilType
    } else {
        this.geoType = a
    }
};
ezserverclient.easyxmlparse.E_Shape.prototype.toElement = function(b) {
    var a = ezserverclient.easyxmlparse.EzXmlDomUtil.createElementNS(b, this.getElementName());
    ezserverclient.easyxmlparse.EzXmlDomUtil.setContext(a, this.getContent());
    ezserverclient.easyxmlparse.EzXmlDomUtil.setAttribute(a, "geotype", this.getGeoType());
    return a
};
ezserverclient.easyxmlparse.E_SpatialFilter = function() {
    ezserverclient.easyxmlparse.E_Element.call(this);
    this.bufferUnit = null;
    this.bufferSize = null;
    this.relation = ezserverclient.easyxmlparse.P_SpatialRelation.NilType;
    this.shape = new ezserverclient.easyxmlparse.E_Shape()
};
ezserverclient.easyxmlparse.E_SpatialFilter.prototype = new ezserverclient.easyxmlparse.E_Element;
ezserverclient.easyxmlparse.E_SpatialFilter.prototype.fromElement = function(b) {
    if (b == null) {
        return null
    }
    var a = new ezserverclient.easyxmlparse.E_Shape();
    a = a.fromElement(ezserverclient.easyxmlparse.EzXmlDomUtil.getChildElement(b, a.getElementName()));
    this.setShape(a);
    this.setRelation(ezserverclient.easyxmlparse.P_SpatialRelation.getRelationType(ezserverclient.easyxmlparse.EzXmlDomUtil.getAttribute(b, "relation")));
    this.setBufferSize(ezserverclient.easyxmlparse.EzXmlTypeUtil.toDoubleValue(ezserverclient.easyxmlparse.EzXmlDomUtil.getAttribute(b, "buffersize"), 0));
    this.setBufferUnit(ezserverclient.easyxmlparse.P_BufferUnit.getUnitType(ezserverclient.easyxmlparse.EzXmlDomUtil.getAttribute(b, "bufferunit")));
    return this
};
ezserverclient.easyxmlparse.E_SpatialFilter.prototype.getBufferSize = function() {
    return this.bufferSize
};
ezserverclient.easyxmlparse.E_SpatialFilter.prototype.getBufferUnit = function() {
    return this.bufferUnit
};
ezserverclient.easyxmlparse.E_SpatialFilter.prototype.getElementName = function() {
    return "SPATIALFILTER"
};
ezserverclient.easyxmlparse.E_SpatialFilter.prototype.getRelation = function() {
    return this.relation
};
ezserverclient.easyxmlparse.E_SpatialFilter.prototype.getShape = function() {
    return this.shape
};
ezserverclient.easyxmlparse.E_SpatialFilter.prototype.setBufferSize = function(a) {
    if (a < 0) {
        this.bufferSize = 0
    } else {
        this.bufferSize = a
    }
};
ezserverclient.easyxmlparse.E_SpatialFilter.prototype.setBufferUnit = function(a) {
    if (a == null) {
        this.bufferUnit = null
    } else {
        this.bufferUnit = a
    }
};
ezserverclient.easyxmlparse.E_SpatialFilter.prototype.setRelation = function(a) {
    if (a == null) {
        this.relation = ezserverclient.easyxmlparse.P_SpatialRelation.NilType
    } else {
        this.relation = a
    }
};
ezserverclient.easyxmlparse.E_SpatialFilter.prototype.setShape = function(a) {
    if (a == null) {
        this.shape = new ezserverclient.easyxmlparse.E_Shape()
    } else {
        this.shape = a
    }
};
ezserverclient.easyxmlparse.E_SpatialFilter.prototype.toElement = function(b) {
    var a = ezserverclient.easyxmlparse.EzXmlDomUtil.createElementNS(b, this.getElementName());
    ezserverclient.easyxmlparse.EzXmlDomUtil.addChildElement(a, this.getShape());
    ezserverclient.easyxmlparse.EzXmlDomUtil.setAttribute(a, "relation", this.getRelation());
    ezserverclient.easyxmlparse.EzXmlDomUtil.setAttribute(a, "buffersize", ezserverclient.easyxmlparse.EzXmlTypeUtil.toStringValue(this.getBufferSize()));
    ezserverclient.easyxmlparse.EzXmlDomUtil.setAttribute(a, "bufferunit", this.getBufferUnit());
    return a
};
ezserverclient.easyxmlparse.E_SpatialFilterLayer = function() {
    ezserverclient.easyxmlparse.E_Element.call(this);
    this.objectName = "";
    this.where = new ezserverclient.easyxmlparse.E_WhereClause();
    this.relation = ezserverclient.easyxmlparse.P_SpatialRelation.NilType
};
ezserverclient.easyxmlparse.E_SpatialFilterLayer.prototype = new ezserverclient.easyxmlparse.E_Element;
ezserverclient.easyxmlparse.E_SpatialFilterLayer.prototype.fromElement = function(a) {
    if (a == null) {
        return null
    }
    var b = new ezserverclient.easyxmlparse.E_WhereClause();
    b = b.fromElement(ezserverclient.easyxmlparse.EzXmlDomUtil.getChildElement(a, b.getElementName()));
    this.setWhere(b);
    this.setObjectName(ezserverclient.easyxmlparse.EzXmlDomUtil.getAttribute(a, "objectname"));
    this.setRelation(ezserverclient.easyxmlparse.P_SpatialRelation.getRelationType(ezserverclient.easyxmlparse.EzXmlDomUtil.getAttribute(a, "relation")));
    return this
};
ezserverclient.easyxmlparse.E_SpatialFilterLayer.prototype.getElementName = function() {
    return "SPATIALFILTERLAYER"
};
ezserverclient.easyxmlparse.E_SpatialFilterLayer.prototype.getObjectName = function() {
    return this.objectName
};
ezserverclient.easyxmlparse.E_SpatialFilterLayer.prototype.getRelation = function() {
    return this.relation
};
ezserverclient.easyxmlparse.E_SpatialFilterLayer.prototype.getWhere = function() {
    return this.where
};
ezserverclient.easyxmlparse.E_SpatialFilterLayer.prototype.setObjectName = function(a) {
    this.objectName = ezserverclient.easyxmlparse.EzXmlTypeUtil.toStringValue(a, "")
};
ezserverclient.easyxmlparse.E_SpatialFilterLayer.prototype.setRelation = function(a) {
    if (a == null) {
        this.relation = ezserverclient.easyxmlparse.P_SpatialRelation.NilType
    } else {
        this.relation = a
    }
};
ezserverclient.easyxmlparse.E_SpatialFilterLayer.prototype.setWhere = function(a) {
    if (a == null) {
        this.where = new ezserverclient.easyxmlparse.E_WhereClause()
    } else {
        this.where = a
    }
};
ezserverclient.easyxmlparse.E_SpatialFilterLayer.prototype.toElement = function(b) {
    var a = ezserverclient.easyxmlparse.EzXmlDomUtil.createElementNS(b, this.getElementName());
    ezserverclient.easyxmlparse.EzXmlDomUtil.addChildElement(a, this.getWhere());
    ezserverclient.easyxmlparse.EzXmlDomUtil.setAttribute(a, "objectname", this.getObjectName());
    ezserverclient.easyxmlparse.EzXmlDomUtil.setAttribute(a, "relation", this.getRelation());
    return a
};
ezserverclient.easyxmlparse.E_SpatialFilterObjects = function() {
    ezserverclient.easyxmlparse.E_Element.call(this);
    ezserverclient.easyxmlparse.E_Collection.call(this);
    this.shapeContainer = new Array()
};
ezserverclient.easyxmlparse.E_SpatialFilterObjects.prototype = new ezserverclient.easyxmlparse.E_Element;
ezserverclient.easyxmlparse.E_SpatialFilterObjects.prototype = new ezserverclient.easyxmlparse.E_Collection;
ezserverclient.easyxmlparse.E_SpatialFilterObjects.prototype.add = function(a) {
    return this.shapeContainer.push(a)
};
ezserverclient.easyxmlparse.E_SpatialFilterObjects.prototype.add2 = function(a) {
    return push(a)
};
ezserverclient.easyxmlparse.E_SpatialFilterObjects.prototype.clear = function() {
    this.shapeContainer.splice(0, shapeContainer.length - 1)
};
ezserverclient.easyxmlparse.E_SpatialFilterObjects.prototype.fromElement = function(d) {
    if (d == null) {
        return null
    }
    var c = new ezserverclient.easyxmlparse.E_Shape();
    var f = ezserverclient.easyxmlparse.EzXmlDomUtil.getChildElements(d, c.getElementName());
    var g = new Array();
    for (var b = 0; b < f.length; b++) {
        var a = new ezserverclient.easyxmlparse.E_Shape();
        a = a.fromElement(f[b]);
        g.push(a)
    }
    this.shapeContainer = g;
    return this
};
ezserverclient.easyxmlparse.E_SpatialFilterObjects.prototype.get = function(a) {
    return this.shapeContainer[a]
};
ezserverclient.easyxmlparse.E_SpatialFilterObjects.prototype.get2 = function(a) {
    return this.get(a)
};
ezserverclient.easyxmlparse.E_SpatialFilterObjects.prototype.getElementName = function() {
    return "SPATIALFILTEROBJECTS"
};
ezserverclient.easyxmlparse.E_SpatialFilterObjects.prototype.isEmpty = function() {
    if (this.shapeContainer.length == 0) {
        return true
    }
};
ezserverclient.easyxmlparse.E_SpatialFilterObjects.prototype.remove = function(a) {
    return this.shapeContainer.splice(a, a)
};
ezserverclient.easyxmlparse.E_SpatialFilterObjects.prototype.remove2 = function(a) {
    return this.shapeContainer.splice(a, a)
};
ezserverclient.easyxmlparse.E_SpatialFilterObjects.prototype.size = function() {
    return this.shapeContainer.length
};
ezserverclient.easyxmlparse.E_SpatialFilterObjects.prototype.toElement = function(c) {
    var a = ezserverclient.easyxmlparse.EzXmlDomUtil.createElementNS(c, this.getElementName());
    for (var b = 0; b < this.shapeContainer.length; b++) {
        ezserverclient.easyxmlparse.EzXmlDomUtil.addChildElement(a, this.shapeContainer[b])
    }
    return a
};
ezserverclient.easyxmlparse.E_SpatialFilters = function() {
    ezserverclient.easyxmlparse.E_Element.call(this);
    ezserverclient.easyxmlparse.E_Collection.call(this);
    this.filterContainer = new Array();
    this.filterLayer = null
};
ezserverclient.easyxmlparse.E_SpatialFilters.prototype = new ezserverclient.easyxmlparse.E_Element;
ezserverclient.easyxmlparse.E_SpatialFilters.prototype = new ezserverclient.easyxmlparse.E_Collection;
ezserverclient.easyxmlparse.E_SpatialFilters.prototype.add = function(a) {
    if (this.filterContainer.length < 5) {
        this.filterLayer = null;
        return this.filterContainer.push(a)
    } else {
        return false
    }
};
ezserverclient.easyxmlparse.E_SpatialFilters.prototype.add2 = function(a) {
    return this.add(a)
};
ezserverclient.easyxmlparse.E_SpatialFilters.prototype.clear = function() {
    this.filterContainer.splice(0, this.filterContainer.length - 1)
};
ezserverclient.easyxmlparse.E_SpatialFilters.prototype.fromElement = function(g) {
    if (g == null) {
        return null
    }
    var c = new ezserverclient.easyxmlparse.E_SpatialFilter();
    var a = ezserverclient.easyxmlparse.EzXmlDomUtil.getChildElements(g, c.getElementName());
    var h = new Array();
    for (var f = 0; f < a.length; f++) {
        var d = new ezserverclient.easyxmlparse.E_SpatialFilter();
        d.fromElement(a[f]);
        h.push(d)
    }
    this.filterContainer = h;
    var b = new ezserverclient.easyxmlparse.E_SpatialFilterLayer();
    b = b.fromElement(ezserverclient.easyxmlparse.EzXmlDomUtil.getChildElement(g, b.getElementName()));
    this.setFilterLayer(b);
    return this
};
ezserverclient.easyxmlparse.E_SpatialFilters.prototype.get = function(a) {
    return this.filterContainer[a]
};
ezserverclient.easyxmlparse.E_SpatialFilters.prototype.get2 = function(a) {
    return this.filterContainer[a]
};
ezserverclient.easyxmlparse.E_SpatialFilters.prototype.getElementName = function() {
    return "SPATIALFILTERS"
};
ezserverclient.easyxmlparse.E_SpatialFilters.prototype.getFilterLayer = function() {
    return this.filterLayer
};
ezserverclient.easyxmlparse.E_SpatialFilters.prototype.isEmpty = function() {
    if (this.filterContainer.length == 0) {
        return true
    }
};
ezserverclient.easyxmlparse.E_SpatialFilters.prototype.remove = function(a) {
    return this.filterContainer.splice(a, a)
};
ezserverclient.easyxmlparse.E_SpatialFilters.prototype.remove2 = function(a) {
    return this.filterContainer.splice(a, a)
};
ezserverclient.easyxmlparse.E_SpatialFilters.prototype.setFilterLayer = function(a) {
    if (a != null) {
        this.filterLayer = a;
        this.filterContainer.splice(0)
    } else {
        this.filterLayer = null
    }
};
ezserverclient.easyxmlparse.E_SpatialFilters.prototype.size = function() {
    return this.filterContainer.length
};
ezserverclient.easyxmlparse.E_SpatialFilters.prototype.toElement = function(c) {
    var a = ezserverclient.easyxmlparse.EzXmlDomUtil.createElementNS(c, this.getElementName());
    for (var b = 0; b < this.filterContainer.length; b++) {
        ezserverclient.easyxmlparse.EzXmlDomUtil.addChildElement(a, this.filterContainer[b])
    }
    ezserverclient.easyxmlparse.EzXmlDomUtil.addChildElement(a, this.getFilterLayer());
    return a
};
ezserverclient.easyxmlparse.E_Success = function() {
    ezserverclient.easyxmlparse.E_Element.call(this)
};
ezserverclient.easyxmlparse.E_Success.prototype = new ezserverclient.easyxmlparse.E_Element;
ezserverclient.easyxmlparse.E_Success.prototype.fromElement = function(a) {
    if (a == null) {
        return null
    }
    return this
};
ezserverclient.easyxmlparse.E_Success.prototype.getElementName = function() {
    return "SUCCESS"
};
ezserverclient.easyxmlparse.E_Success.prototype.toElement = function(b) {
    var a = ezserverclient.easyxmlparse.EzXmlDomUtil.createElementNS(b, this.getElementName());
    return a
};
ezserverclient.easyxmlparse.E_TableMeta = function() {
    ezserverclient.easyxmlparse.E_Element.call(this);
    this.name = null;
    this.displayName = null;
    this.fieldsMeta = new ezserverclient.easyxmlparse.E_FieldsMeta();
    this.objectIdColumn = null;
    this.layerExtension = new ezserverclient.easyxmlparse.E_LayerExtension()
};
ezserverclient.easyxmlparse.E_TableMeta.prototype = new ezserverclient.easyxmlparse.E_Element;
ezserverclient.easyxmlparse.E_TableMeta.prototype.fromElement = function(b) {
    if (b == null) {
        return null
    }
    var a = new ezserverclient.easyxmlparse.E_LayerExtension();
    a = a.fromElement(ezserverclient.easyxmlparse.EzXmlDomUtil.getChildElement(b, a.getElementName()));
    this.setLayerExtension(a);
    var c = new ezserverclient.easyxmlparse.E_FieldsMeta();
    c = c.fromElement(ezserverclient.easyxmlparse.EzXmlDomUtil.getChildElement(b, c.getElementName()));
    this.setFieldsMeta(c);
    this.setDisplayName(ezserverclient.easyxmlparse.EzXmlDomUtil.getAttribute(b, "displayname"));
    this.setName(ezserverclient.easyxmlparse.EzXmlDomUtil.getAttribute(b, "name"));
    this.setObjectIdColumn(ezserverclient.easyxmlparse.EzXmlDomUtil.getAttribute(b, "objectidcolumn"));
    return this
};
ezserverclient.easyxmlparse.E_TableMeta.prototype.getDisplayName = function() {
    return this.displayName
};
ezserverclient.easyxmlparse.E_TableMeta.prototype.getElementName = function() {
    return "TABLEMETA"
};
ezserverclient.easyxmlparse.E_TableMeta.prototype.getFieldsMeta = function() {
    return this.fieldsMeta
};
ezserverclient.easyxmlparse.E_TableMeta.prototype.getLayerExtension = function() {
    return this.layerExtension
};
ezserverclient.easyxmlparse.E_TableMeta.prototype.getName = function() {
    return this.name
};
ezserverclient.easyxmlparse.E_TableMeta.prototype.getObjectIdColumn = function() {
    return this.objectIdColumn
};
ezserverclient.easyxmlparse.E_TableMeta.prototype.setDisplayName = function(a) {
    this.displayName = a
};
ezserverclient.easyxmlparse.E_TableMeta.prototype.setFieldsMeta = function(a) {
    if (a == null) {
        this.fieldsMeta = new ezserverclient.easyxmlparse.E_FieldsMeta()
    } else {
        this.fieldsMeta = a
    }
};
ezserverclient.easyxmlparse.E_TableMeta.prototype.setLayerExtension = function(a) {
    this.layerExtension = a
};
ezserverclient.easyxmlparse.E_TableMeta.prototype.setName = function(a) {
    this.name = a
};
ezserverclient.easyxmlparse.E_TableMeta.prototype.setObjectIdColumn = function(a) {
    this.objectIdColumn = a
};
ezserverclient.easyxmlparse.E_TableMeta.prototype.toElement = function(b) {
    var a = ezserverclient.easyxmlparse.EzXmlDomUtil.createElementNS(b, this.getElementName());
    ezserverclient.easyxmlparse.EzXmlDomUtil.addChildElement(a, this.getLayerExtension());
    ezserverclient.easyxmlparse.EzXmlDomUtil.addChildElement(a, this.getFieldsMeta());
    ezserverclient.easyxmlparse.EzXmlDomUtil.setAttribute(a, "displayname", this.getDisplayName());
    ezserverclient.easyxmlparse.EzXmlDomUtil.setAttribute(a, "name", this.getName());
    ezserverclient.easyxmlparse.EzXmlDomUtil.setAttribute(a, "objectidcolumn", this.getObjectIdColumn());
    return a
};
ezserverclient.easyxmlparse.E_FieldsMeta = function() {
    ezserverclient.easyxmlparse.E_Element.call(this);
    ezserverclient.easyxmlparse.E_Collection.call(this);
    this.fieldMetaContainer = new Array()
};
ezserverclient.easyxmlparse.E_FieldsMeta.prototype = new ezserverclient.easyxmlparse.E_Element;
ezserverclient.easyxmlparse.E_FieldsMeta.prototype = new ezserverclient.easyxmlparse.E_Collection;
ezserverclient.easyxmlparse.E_FieldsMeta.prototype.add = function(a) {
    return this.fieldMetaContainer.push(a)
};
ezserverclient.easyxmlparse.E_FieldsMeta.prototype.add2 = function(a) {
    return this.fieldMetaContainer.push(a)
};
ezserverclient.easyxmlparse.E_FieldsMeta.prototype.clear = function() {
    this.fieldMetaContainer.splice(0, this.fieldMetaContainer.length - 1)
};
ezserverclient.easyxmlparse.E_FieldsMeta.prototype.fromElement = function(d) {
    if (d == null) {
        return null
    }
    var g = new ezserverclient.easyxmlparse.E_FieldMeta();
    var f = ezserverclient.easyxmlparse.EzXmlDomUtil.getChildElements(d, g.getElementName());
    var c = new Array();
    for (var b = 0; b < f.length; b++) {
        var a = new ezserverclient.easyxmlparse.E_FieldMeta();
        a = a.fromElement(f[b]);
        c.push(a)
    }
    this.fieldMetaContainer = c;
    return this
};
ezserverclient.easyxmlparse.E_FieldsMeta.prototype.get2 = function(a) {
    return this.fieldMetaContainer[a]
};
ezserverclient.easyxmlparse.E_FieldsMeta.prototype.getElementName = function() {
    return "FIELDSMETA"
};
ezserverclient.easyxmlparse.E_FieldsMeta.prototype.isEmpty = function() {
    if (this.fieldMetaContainer.length == 0) {
        return true
    }
};
ezserverclient.easyxmlparse.E_FieldsMeta.prototype.remove = function(a) {
    return this.fieldMetaContainer.splice(a, a)
};
ezserverclient.easyxmlparse.E_FieldsMeta.prototype.remove2 = function(a) {
    return this.fieldMetaContainer.splice(a, a)
};
ezserverclient.easyxmlparse.E_FieldsMeta.prototype.size = function() {
    return this.fieldMetaContainer.length
};
ezserverclient.easyxmlparse.E_FieldsMeta.prototype.toElement = function(c) {
    var a = ezserverclient.easyxmlparse.EzXmlDomUtil.createElementNS(c, this.getElementName());
    for (var b = 0; b < this.fieldMetaContainer.length; b++) {
        ezserverclient.easyxmlparse.EzXmlDomUtil.addChildElement(a, this.fieldMetaContainer[b])
    }
    return a
};
ezserverclient.easyxmlparse.E_TablesMeta = function() {
    ezserverclient.easyxmlparse.E_Element.call(this);
    ezserverclient.easyxmlparse.E_Collection.call(this);
    this.tableMetaContainer = new Array()
};
ezserverclient.easyxmlparse.E_TablesMeta.prototype = new ezserverclient.easyxmlparse.E_Element;
ezserverclient.easyxmlparse.E_TablesMeta.prototype = new ezserverclient.easyxmlparse.E_Collection;
ezserverclient.easyxmlparse.E_TablesMeta.add = function(a) {
    return this.tableMetaContainer.push(a)
};
ezserverclient.easyxmlparse.E_TablesMeta.prototype.add2 = function(a) {
    return this.tableMetaContainer.push(a)
};
ezserverclient.easyxmlparse.E_TablesMeta.prototype.clear = function() {
    this.tableMetaContainer.splice(0, this.tableMetaContainer.length - 1)
};
ezserverclient.easyxmlparse.E_TablesMeta.prototype.fromElement = function(f) {
    if (f == null) {
        return null
    }
    var c = new ezserverclient.easyxmlparse.E_TableMeta();
    tmpTableList = ezserverclient.easyxmlparse.EzXmlDomUtil.getChildElements(f, c.getElementName());
    var b = new Array();
    for (var d = 0; d < tmpTableList.length; d++) {
        var g = new ezserverclient.easyxmlparse.E_TableMeta();
        var a = g.fromElement(tmpTableList[d]);
        b.push(a)
    }
    this.tableMetaContainer = b;
    return this
};
ezserverclient.easyxmlparse.E_TablesMeta.prototype.get = function(a) {
    return this.tableMetaContainer[a]
};
ezserverclient.easyxmlparse.E_TablesMeta.prototype.get2 = function(a) {
    return this.tableMetaContainer[a]
};
ezserverclient.easyxmlparse.E_TablesMeta.prototype.getElementName = function() {
    return "TABLESMETA"
};
ezserverclient.easyxmlparse.E_TablesMeta.prototype.isEmpty = function() {
    if (this.tableMetaContainer.length == 0) {
        return true
    }
};
ezserverclient.easyxmlparse.E_TablesMeta.prototype.remove = function(a) {
    return this.tableMetaContainer.splice(a, a)
};
ezserverclient.easyxmlparse.E_TablesMeta.prototype.remove2 = function(a) {
    return this.tableMetaContainer.splice(a, a)
};
ezserverclient.easyxmlparse.E_TablesMeta.prototype.size = function() {
    return this.tableMetaContainer.length
};
ezserverclient.easyxmlparse.E_TablesMeta.prototype.toElement = function(c) {
    var a = ezserverclient.easyxmlparse.EzXmlDomUtil.createElementNS(c, this.getElementName());
    for (var b = 0; b < this.tableMetaContainer.length; b++) {
        ezserverclient.easyxmlparse.EzXmlDomUtil.addChildElement(a, this.tableMetaContainer[b])
    }
    return a
};
ezserverclient.easyxmlparse.E_Update = function() {
    ezserverclient.easyxmlparse.E_DML.call(this);
    this.fields = new ezserverclient.easyxmlparse.E_Fields();
    this.objectName = null;
    this.whereClause = new ezserverclient.easyxmlparse.E_WhereClause()
};
ezserverclient.easyxmlparse.E_Update.prototype = new ezserverclient.easyxmlparse.E_DML;
ezserverclient.easyxmlparse.E_Update.prototype.fromElement = function(b) {
    if (b == null) {
        return null
    }
    var a = new ezserverclient.easyxmlparse.E_Fields();
    a = a.fromElement(ezserverclient.easyxmlparse.EzXmlDomUtil.getChildElement(b, a.getElementName()));
    this.setFields(a);
    var c = new ezserverclient.easyxmlparse.E_WhereClause();
    c = c.fromElement(ezserverclient.easyxmlparse.EzXmlDomUtil.getChildElement(b, c.getElementName()));
    this.setWhereClause(c);
    this.setObjectName(ezserverclient.easyxmlparse.EzXmlDomUtil.getAttribute(b, "objectname"));
    return this
};
ezserverclient.easyxmlparse.E_Update.prototype.getElementName = function() {
    return "UPDATE"
};
ezserverclient.easyxmlparse.E_Update.prototype.getFields = function() {
    return this.fields
};
ezserverclient.easyxmlparse.E_Update.prototype.getObjectName = function() {
    return this.objectName
};
ezserverclient.easyxmlparse.E_Update.prototype.getWhereClause = function() {
    return this.whereClause
};
ezserverclient.easyxmlparse.E_Update.prototype.setFields = function(a) {
    if (a == null) {
        this.fields = new ezserverclient.easyxmlparse.E_Fields()
    } else {
        this.fields = a
    }
};
ezserverclient.easyxmlparse.E_Update.prototype.setObjectName = function(a) {
    this.objectName = ezserverclient.easyxmlparse.EzXmlTypeUtil.toStringValue(a, "")
};
ezserverclient.easyxmlparse.E_Update.prototype.setWhereClause = function(a) {
    if (a == null) {
        this.whereClause = new ezserverclient.easyxmlparse.E_WhereClause()
    } else {
        this.whereClause = a
    }
};
ezserverclient.easyxmlparse.E_Update.prototype.toElement = function(a) {
    tmpThis = ezserverclient.easyxmlparse.EzXmlDomUtil.createElementNS(a, this.getElementName());
    ezserverclient.easyxmlparse.EzXmlDomUtil.addChildElement(tmpThis, this.getFields());
    ezserverclient.easyxmlparse.EzXmlDomUtil.addChildElement(tmpThis, this.getWhereClause());
    ezserverclient.easyxmlparse.EzXmlDomUtil.setAttribute(tmpThis, "objectname", this.getObjectName());
    return tmpThis
};
ezserverclient.easyxmlparse.E_Update.prototype.getDMLType = function() {
    return _DMLType.UPDATE.name
};
ezserverclient.easyxmlparse.E_WhereClause = function() {
    ezserverclient.easyxmlparse.E_Element.call(this);
    this.content = "(1=2)"
};
ezserverclient.easyxmlparse.E_WhereClause.prototpye = new ezserverclient.easyxmlparse.E_Element;
ezserverclient.easyxmlparse.E_WhereClause.prototype.fromElement = function(b) {
    if (b == null) {
        return null
    }
    var a = ezserverclient.easyxmlparse.EzXmlDomUtil.getContext(b);
    this.setContent(a);
    return this
};
ezserverclient.easyxmlparse.E_WhereClause.prototype.getContent = function() {
    return this.content
};
ezserverclient.easyxmlparse.E_WhereClause.prototype.getElementName = function() {
    return "WHERECLAUSE"
};
ezserverclient.easyxmlparse.E_WhereClause.prototype.setContent = function(a) {
    var b = ezserverclient.easyxmlparse.string_trim(ezserverclient.easyxmlparse.EzXmlTypeUtil.toStringValue(a, "(1=2)"));
    if (b.length == 0) {
        this.content = "(1=2)"
    } else {
        this.content = b
    }
};
ezserverclient.easyxmlparse.E_WhereClause.prototype.toElement = function(b) {
    var a = ezserverclient.easyxmlparse.EzXmlDomUtil.createElementNS(b, this.getElementName());
    ezserverclient.easyxmlparse.EzXmlDomUtil.setContext(a, this.getContent());
    return a
};
ezserverclient.easyxmlparse.E_WhereClauseSelect = function() {
    ezserverclient.easyxmlparse.E_WhereClause.call(this);
    this.content = "(1=1)";
    this.setContent = function(a) {
        var b = ezserverclient.easyxmlparse.string_trim(ezserverclient.easyxmlparse.EzXmlTypeUtil.toStringValue(a, "(1=1)"));
        if (b.length == 0) {
            this.content = "(1=1)"
        } else {
            this.content = b
        }
    }
};
ezserverclient.easyxmlparse.E_WhereClauseSelect.prototype = new ezserverclient.easyxmlparse.E_WhereClause;
ezserverclient.easyxmlparse.EzXmlDomUtil = function() {
};
ezserverclient.easyxmlparse.EzXmlDomUtil.addChildElement = function(a, b) {
    if (b == null) {
        return
    } else {
        a.appendChild(b.toElement(a.ownerDocument))
    }
};
ezserverclient.easyxmlparse.EzXmlDomUtil.createElement = function(a, b) {
    return a.createElement(b)
};
ezserverclient.easyxmlparse.EzXmlDomUtil.createElementNS = function(b, c) {
    var a = b.createElement(c);
    return a
};
ezserverclient.easyxmlparse.EzXmlDomUtil.equal = function(c, b, a) {
    if (c == null && b == null) {
        return true
    }
    if (c != null && b != null) {
        if (a) {
            if (c.compareTo(b) == 0) {
                return true
            }
        } else {
            if (c.compareToIgnoreCase(b) == 0) {
                return true
            }
        }
    }
    return false
};
ezserverclient.easyxmlparse.EzXmlDomUtil.getAttribute = function(c, a) {
    if (c.nodeName == "#comment") {
        return null
    }
    var b = c.getAttribute(a);
    return b
};
ezserverclient.easyxmlparse.EzXmlDomUtil.getChildElement = function(f, a) {
    if (f.nodeName == "#comment") {
        return null
    }
    var d = f.getElementsByTagName(a);
    if (d.length == 0) {
        return null
    } else {
        for (var b = 0; b < d.length; b++) {
            var c = d.item(b);
            if (c.parentNode.nodeName == f.nodeName) {
                return c
            }
        }
        return null
    }
};
ezserverclient.easyxmlparse.EzXmlDomUtil.getChildElements = function(d, c) {
    this.tmpList = d.getElementsByTagName(c);
    if (tmpList.length == 0) {
        return new Array()
    } else {
        var b = new Array[tmpList.length];
        for (var a = 0; a < b.length; a++) {
            b[a] = tmpList.item(a)
        }
        return b
    }
};
ezserverclient.easyxmlparse.EzXmlDomUtil.getChildElements = function(d) {
    var c = d.childNodes;
    if (c.length == 0) {
        return new Array()
    } else {
        var b = new Array();
        for (var a = 0; a < c.length; a++) {
            var f = c.item(a);
            if (typeof (f) == "object") {
                b.push(f)
            }
        }
        return b.slice(0)
    }
};
ezserverclient.easyxmlparse.EzXmlDomUtil.getContext = function(d) {
    var f = new Array();
    var c = d.childNodes;
    for (var a = 0; a < c.length; a++) {
        var b = c.item(a);
        if (typeof (b) == "object") {
            f.push(b.nodeValue)
        }
    }
    return f.toString()
};
ezserverclient.easyxmlparse.EzXmlDomUtil.getEzXMLNamespace = function() {
    return "http://mapservice.easymap.com"
};
ezserverclient.easyxmlparse.EzXmlDomUtil.setAttribute = function(c, a, b) {
    if (b == null) {
    } else {
        c.setAttribute(a, b)
    }
};
ezserverclient.easyxmlparse.EzXmlDomUtil.setContext = function(f, a) {
    if (a != null) {
        var g = f.ownerDocument.createTextNode(a);
        var d = f.childNodes;
        for (var b = d.length - 1; b >= 0; b--) {
            var c = d.item(b);
            if (c instanceof String) {
                f.removeChild(c)
            }
        }
        f.insertBefore(g, f.firstChild)
    }
};
ezserverclient.easyxmlparse.EzXmlException = function() {
    this.ezserverclient.easyxmlparse.EzXmlException = function(a) {
    }
};
ezserverclient.easyxmlparse.EzXmlException.serialVersionUID = 5134137959227322000;
ezserverclient.easyxmlparse.EzXmlTypeUtil = {};
ezserverclient.easyxmlparse.EzXmlTypeUtil.toBooleanValue = function(c, b) {
    var a = ezserverclient.easyxmlparse.string_trim(this.toStringValue(c, ""));
    if (arguments.length == 1) {
        if (a.length == 0) {
            return false
        } else {
            try {
                if (a && a == "true") {
                    return true
                } else {
                    return false
                }
            } catch (d) {
                return false
            }
        }
    } else {
        if (arguments.length == 2) {
            if (a.length == 0) {
                return b
            } else {
                try {
                    if (a && a == "true") {
                        return true
                    } else {
                        return false
                    }
                } catch (d) {
                    return b
                }
            }
        }
    }
};
ezserverclient.easyxmlparse.EzXmlTypeUtil.toDoubleValue = function(c, b) {
    var a = ezserverclient.easyxmlparse.string_trim(this.toStringValue(c, ""));
    if (arguments.length == 1) {
        if (a.length == 0) {
            return Number.NaN
        } else {
            try {
                return parseFloat(a)
            } catch (d) {
                return Number.NaN
            }
        }
    } else {
        if (arguments.length == 2) {
            if (a.length == 0) {
                return b
            } else {
                try {
                    return parseFloat(a)
                } catch (d) {
                    return b
                }
            }
        }
    }
};
ezserverclient.easyxmlparse.EzXmlTypeUtil.toIntegerValue = function(c, b) {
    var a = ezserverclient.easyxmlparse.string_trim(this.toStringValue(c, ""));
    if (arguments.length == 1) {
        if (a.length == 0) {
            return 0
        } else {
            try {
                return parseInt(a)
            } catch (d) {
                return 0
            }
        }
    } else {
        if (arguments.length == 2) {
            if (a.length == 0) {
                return b
            } else {
                try {
                    return parseInt(a)
                } catch (d) {
                    return b
                }
            }
        }
    }
};
ezserverclient.easyxmlparse.EzXmlTypeUtil.toLongValue = function(c, b) {
    var a = ezserverclient.easyxmlparse.string_trim(this.toStringValue(c, ""));
    if (arguments.length == 1) {
        if (a.length == 0) {
            return 0
        } else {
            try {
                return parseInt(a)
            } catch (d) {
                return 0
            }
        }
    } else {
        if (arguments.length == 2) {
            if (a.length == 0) {
                return b
            } else {
                try {
                    return parseInt(a)
                } catch (d) {
                    return b
                }
            }
        }
    }
};
ezserverclient.easyxmlparse.EzXmlTypeUtil.toStringValue = function(a, b) {
    if (arguments.length == 1) {
        if (a == null) {
            return ""
        } else {
            return a.toString()
        }
    } else {
        if (arguments.length == 2) {
            if (a == null) {
                return b
            } else {
                return a.toString()
            }
        }
    }
};
ezserverclient.easyxmlparse.P_BufferUnit = function(a) {
    this.unitTypeName = a
};
ezserverclient.easyxmlparse.P_BufferUnit.DegreeType = new ezserverclient.easyxmlparse.P_BufferUnit("degree");
ezserverclient.easyxmlparse.P_BufferUnit.MeterType = new ezserverclient.easyxmlparse.P_BufferUnit("meter");
ezserverclient.easyxmlparse.P_BufferUnit.NilType = new ezserverclient.easyxmlparse.P_BufferUnit("nil");
ezserverclient.easyxmlparse.P_BufferUnit.prototype = new ezserverclient.easyxmlparse.E_Element;
ezserverclient.easyxmlparse.P_BufferUnit.getUnitType = function(a) {
    if (a == null || a.length == 0) {
        return ezserverclient.easyxmlparse.P_BufferUnit.NilType.unitTypeName
    }
    if (ezserverclient.easyxmlparse.P_BufferUnit.DegreeType.unitTypeName == a) {
        return ezserverclient.easyxmlparse.P_BufferUnit.DegreeType.unitTypeName
    }
    if (ezserverclient.easyxmlparse.P_BufferUnit.MeterType.unitTypeName == a) {
        return ezserverclient.easyxmlparse.P_BufferUnit.MeterType.unitTypeName
    }
    return ezserverclient.easyxmlparse.P_BufferUnit.NilType.unitTypeName
};
ezserverclient.easyxmlparse.P_BufferUnit.prototype.fromElement = function(a) {
    throw new Error("功能没有实现")
};
ezserverclient.easyxmlparse.P_BufferUnit.prototype.getElementName = function() {
    return "bufferunit"
};
ezserverclient.easyxmlparse.P_BufferUnit.prototype.toElement = function(a) {
    throw new Error("功能没有实现")
};
ezserverclient.easyxmlparse.P_BufferUnit.prototype.toString = function() {
    return this.unitTypeName
};
ezserverclient.easyxmlparse.P_FieldType = function(a) {
    ezserverclient.easyxmlparse.E_Element.call(this);
    this.fieldTypeName = a
};
ezserverclient.easyxmlparse.P_FieldType.DateType = new ezserverclient.easyxmlparse.P_FieldType("Date");
ezserverclient.easyxmlparse.P_FieldType.Int16Type = new ezserverclient.easyxmlparse.P_FieldType("Int16");
ezserverclient.easyxmlparse.P_FieldType.Int32Type = new ezserverclient.easyxmlparse.P_FieldType("Int32");
ezserverclient.easyxmlparse.P_FieldType.Int64Type = new ezserverclient.easyxmlparse.P_FieldType("Int64");
ezserverclient.easyxmlparse.P_FieldType.FloatType = new ezserverclient.easyxmlparse.P_FieldType("Float");
ezserverclient.easyxmlparse.P_FieldType.DoubleType = new ezserverclient.easyxmlparse.P_FieldType("Double");
ezserverclient.easyxmlparse.P_FieldType.StringType = new ezserverclient.easyxmlparse.P_FieldType("String");
ezserverclient.easyxmlparse.P_FieldType.BinaryType = new ezserverclient.easyxmlparse.P_FieldType("Binary");
ezserverclient.easyxmlparse.P_FieldType.GeometryType = new ezserverclient.easyxmlparse.P_FieldType("Geometry");
ezserverclient.easyxmlparse.P_FieldType.OtherType = new ezserverclient.easyxmlparse.P_FieldType("Other");
ezserverclient.easyxmlparse.P_FieldType.prototype = new ezserverclient.easyxmlparse.E_Element;
ezserverclient.easyxmlparse.P_FieldType.getFieldType = function(a) {
    if (a == null || a.length == 0) {
        return ezserverclient.easyxmlparse.P_FieldType.OtherType.fieldTypeName
    }
    if (ezserverclient.easyxmlparse.P_FieldType.DateType.fieldTypeName == a) {
        return ezserverclient.easyxmlparse.P_FieldType.DateType.fieldTypeName
    }
    if (ezserverclient.easyxmlparse.P_FieldType.Int16Type.fieldTypeName == a) {
        return ezserverclient.easyxmlparse.P_FieldType.Int16Type.fieldTypeName
    }
    if (ezserverclient.easyxmlparse.P_FieldType.Int32Type.fieldTypeName == a) {
        return ezserverclient.easyxmlparse.P_FieldType.Int32Type.fieldTypeName
    }
    if (ezserverclient.easyxmlparse.P_FieldType.Int64Type.fieldTypeName == a) {
        return ezserverclient.easyxmlparse.P_FieldType.Int64Type.fieldTypeName
    }
    if (ezserverclient.easyxmlparse.P_FieldType.FloatType.fieldTypeName == a) {
        return ezserverclient.easyxmlparse.P_FieldType.FloatType.fieldTypeName
    }
    if (ezserverclient.easyxmlparse.P_FieldType.DoubleType.fieldTypeName == a) {
        return ezserverclient.easyxmlparse.P_FieldType.DoubleType.fieldTypeName
    }
    if (ezserverclient.easyxmlparse.P_FieldType.StringType.fieldTypeName == a) {
        return ezserverclient.easyxmlparse.P_FieldType.StringType.fieldTypeName
    }
    if (ezserverclient.easyxmlparse.P_FieldType.BinaryType.fieldTypeName == a) {
        return ezserverclient.easyxmlparse.P_FieldType.BinaryType.fieldTypeName
    }
    if (ezserverclient.easyxmlparse.P_FieldType.GeometryType.fieldTypeName == a) {
        return ezserverclient.easyxmlparse.P_FieldType.GeometryType.fieldTypeName
    }
    return ezserverclient.easyxmlparse.P_FieldType.OtherType.fieldTypeName
};
ezserverclient.easyxmlparse.P_FieldType.prototype.fromElement = function(a) {
    throw new Error("功能没有实现")
};
ezserverclient.easyxmlparse.P_FieldType.prototype.getElementName = function() {
    return "type"
};
ezserverclient.easyxmlparse.P_FieldType.prototype.toElement = function(a) {
    throw new Error("功能没有实现")
};
ezserverclient.easyxmlparse.P_FieldType.prototype.toString = function() {
    return this.fieldTypeName
};
ezserverclient.easyxmlparse.P_GeometryType = function(a) {
    ezserverclient.easyxmlparse.E_Element.call(this);
    this.geoTypeName = a;
    return this.geoTypeName
};
ezserverclient.easyxmlparse.P_GeometryType.CircleType = new ezserverclient.easyxmlparse.P_GeometryType("circle");
ezserverclient.easyxmlparse.P_GeometryType.NilType = new ezserverclient.easyxmlparse.P_GeometryType("nil");
ezserverclient.easyxmlparse.P_GeometryType.PointType = new ezserverclient.easyxmlparse.P_GeometryType("point");
ezserverclient.easyxmlparse.P_GeometryType.PolygonType = new ezserverclient.easyxmlparse.P_GeometryType("polygon");
ezserverclient.easyxmlparse.P_GeometryType.PolylineType = new ezserverclient.easyxmlparse.P_GeometryType("polyline");
ezserverclient.easyxmlparse.P_GeometryType.MultiPointType = new ezserverclient.easyxmlparse.P_GeometryType("multipoint");
ezserverclient.easyxmlparse.P_GeometryType.MultiPolygonType = new ezserverclient.easyxmlparse.P_GeometryType("multipolygon");
ezserverclient.easyxmlparse.P_GeometryType.MultiPolylineType = new ezserverclient.easyxmlparse.P_GeometryType("multipolyline");
ezserverclient.easyxmlparse.P_GeometryType.RectangleType = new ezserverclient.easyxmlparse.P_GeometryType("rectangle");
ezserverclient.easyxmlparse.P_GeometryType.geoTypeName = null;
ezserverclient.easyxmlparse.P_GeometryType.prototype = new ezserverclient.easyxmlparse.E_Element;
ezserverclient.easyxmlparse.P_GeometryType.getGeometryType = function(a) {
    if (ezserverclient.easyxmlparse.P_GeometryType.CircleType.geoTypeName == a) {
        return ezserverclient.easyxmlparse.P_GeometryType.CircleType.geoTypeName
    }
    if (ezserverclient.easyxmlparse.P_GeometryType.RectangleType.geoTypeName == a) {
        return ezserverclient.easyxmlparse.P_GeometryType.RectangleType.geoTypeName
    }
    if (ezserverclient.easyxmlparse.P_GeometryType.PointType.geoTypeName == a) {
        return ezserverclient.easyxmlparse.P_GeometryType.PointType.geoTypeName
    }
    if (ezserverclient.easyxmlparse.P_GeometryType.PolygonType.geoTypeName == a) {
        return ezserverclient.easyxmlparse.P_GeometryType.PolygonType.geoTypeName
    }
    if (ezserverclient.easyxmlparse.P_GeometryType.PolylineType.geoTypeName == a) {
        return ezserverclient.easyxmlparse.P_GeometryType.PolylineType.geoTypeName
    }
    if (ezserverclient.easyxmlparse.P_GeometryType.MultiPointType.geoTypeName == a) {
        return ezserverclient.easyxmlparse.P_GeometryType.MultiPointType.geoTypeName
    }
    if (ezserverclient.easyxmlparse.P_GeometryType.MultiPolygonType.geoTypeName == a) {
        return ezserverclient.easyxmlparse.P_GeometryType.MultiPolygonType.geoTypeName
    }
    if (ezserverclient.easyxmlparse.P_GeometryType.MultiPolylineType.geoTypeName == a) {
        return ezserverclient.easyxmlparse.P_GeometryType.MultiPolylineType.geoTypeName
    }
    return ezserverclient.easyxmlparse.P_GeometryType.NilType.geoTypeName
};
ezserverclient.easyxmlparse.P_GeometryType.prototype.fromElement = function(a) {
    throw new Error("功能没有实现")
};
ezserverclient.easyxmlparse.P_GeometryType.prototype.getElementName = function() {
    return "geoType"
};
ezserverclient.easyxmlparse.P_GeometryType.prototype.toElement = function(a) {
    throw new Error("功能没有实现")
};
ezserverclient.easyxmlparse.P_GeometryType.prototype.toString = function() {
    return this.geoTypeName
};
ezserverclient.easyxmlparse.P_SpatialRelation = function(a) {
    ezserverclient.easyxmlparse.E_Element.call(this);
    this.relationTypeName = a;
    return this.relationTypeName
};
ezserverclient.easyxmlparse.P_SpatialRelation.ContainType = new ezserverclient.easyxmlparse.P_SpatialRelation("contain");
ezserverclient.easyxmlparse.P_SpatialRelation.DisjointType = new ezserverclient.easyxmlparse.P_SpatialRelation("disjoint");
ezserverclient.easyxmlparse.P_SpatialRelation.NilType = new ezserverclient.easyxmlparse.P_SpatialRelation("nil");
ezserverclient.easyxmlparse.P_SpatialRelation.OverlapType = new ezserverclient.easyxmlparse.P_SpatialRelation("overlap");
ezserverclient.easyxmlparse.P_SpatialRelation.prototype = new ezserverclient.easyxmlparse.E_Element;
ezserverclient.easyxmlparse.P_SpatialRelation.getRelationType = function(a) {
    if (a == null || a.length == 0) {
        return ezserverclient.easyxmlparse.P_SpatialRelation.OverlapType.relationTypeName
    }
    if (ezserverclient.easyxmlparse.P_SpatialRelation.ContainType.relationTypeName == a) {
        return ezserverclient.easyxmlparse.P_SpatialRelation.ContainType.relationTypeName
    }
    if (ezserverclient.easyxmlparse.P_SpatialRelation.DisjointType.relationTypeName == a) {
        return ezserverclient.easyxmlparse.P_SpatialRelation.DisjointType.relationTypeName
    }
    if (ezserverclient.easyxmlparse.P_SpatialRelation.OverlapType.relationTypeName == a) {
        return ezserverclient.easyxmlparse.P_SpatialRelation.OverlapType.relationTypeName
    }
    return ezserverclient.easyxmlparse.P_SpatialRelation.NilType.relationTypeName
};
ezserverclient.easyxmlparse.P_SpatialRelation.prototype.fromElement = function(a) {
    throw new Error("功能没有实现")
};
ezserverclient.easyxmlparse.P_SpatialRelation.prototype.getElementName = function() {
    return "relation"
};
ezserverclient.easyxmlparse.P_SpatialRelation.prototype.toElement = function(a) {
    throw new Error("功能没有实现")
};
ezserverclient.easyxmlparse.P_SpatialRelation.prototype.toString = function() {
    return this.relationTypeName
};
ezserverclient.easyxmlparse.string_trim = function(c) {
    var b = c;
    if (b == null) {
        return null
    } else {
        b = b.replace(/^(\s)*/, "");
        b = b.replace(/(\s)*$/, "");
        return b
    }
};
ezserverclient.easyxmlparse.EzFactory = function() {
};
ezserverclient.easyxmlparse.EzFactory.FromXml = function(f) {
    var c = null;
    try {
        var c = new ActiveXObject("Microsoft.XMLDOM");
        c.async = false;
        if (f != null) {
            c.loadXML(f)
        } else {
            return
        }
    } catch (b) {
        try {
            parser = new DOMParser();
            if (f != null) {
                c = parser.parseFromString(f, "text/xml")
            } else {
                return
            }
        } catch (b) {
            alert(b.message)
        }
    }
    var d = c.documentElement;
    var a = new ezserverclient.easyxmlparse.E_EasyXml().fromElement(d);
    return a
};
ezserverclient.easyxmlparse.EzFactory.ToXml = function(d) {
    if (window.ActiveXObject) {
        try {
            var c = new ActiveXObject("MSXML2.DOMDocument.3.0");
            c.async = false;
            c.appendChild(d.toElement(c));
            return c.xml
        } catch (f) {
        }
        throw new Error("MSXML is not installed on your system.")
    } else {
        if (document.implementation && document.implementation.createDocument) {
            var a = document.implementation.createDocument("", "", null);
            a.async = false;
            var b = d.toElement(a);
            a.appendChild(b);
            return new XMLSerializer().serializeToString(a)
        } else {
            throw new Error("Your browser doesn't support an XML DOM object.")
        }
    }
};
ezserverclient.easyxmlparse.EzMapserviceQuery = function() {
    this.queryItem = new Array();
    this.timeOut = null;
    this.tryTime = "";
    this.failureOnError = false;
    this.itemCount = null;
    this.itemCurrentCount = null;
    this.queryFlag = 0
};
ezserverclient.easyxmlparse.EzMapserviceQuery.queryState = false;
ezserverclient.easyxmlparse.EzMapserviceQuery.NextOrder = 0;
ezserverclient.easyxmlparse.EzMapserviceQuery.prototype.addQueryItem = function(a) {
    a.mapServiceQuery = this;
    this.queryItem.push(a);
    this.itemCount++
};
ezserverclient.easyxmlparse.EzMapserviceQuery.prototype.getTimeout = function() {
    return this.timeOut
};
ezserverclient.easyxmlparse.EzMapserviceQuery.prototype.setTimeout = function(a) {
    this.timeOut = a
};
ezserverclient.easyxmlparse.EzMapserviceQuery.prototype.getTryTime = function() {
    return this.tryTime
};
ezserverclient.easyxmlparse.EzMapserviceQuery.prototype.setTryTime = function(a) {
    this.tryTime = a
};
ezserverclient.easyxmlparse.EzMapserviceQuery.prototype.getFailureOnError = function() {
    return this.failureOnError
};
ezserverclient.easyxmlparse.EzMapserviceQuery.prototype.setFailureOnError = function(a) {
    this.failureOnError = a
};
ezserverclient.easyxmlparse.EzMapserviceQuery.prototype.onFinished = function() {
};
ezserverclient.easyxmlparse.EzMapserviceQuery.prototype.doQuery = function() {
    if (ezserverclient.easyxmlparse.EzMapserviceQuery.queryState == false) {
        ezserverclient.easyxmlparse.EzMapserviceQuery.QueryState = true
    } else {
        throw new Error("ezserverclient.easyxmlparse.EzMapserviceQuery::doQuery查询还没有查询结束，不能进行下次查询")
    }
    this.itemCurrentCount = this.itemCount;
    for (var a = 0; a < this.queryItem.length; a++) {
        var b = this.queryItem[a];
        b.setTimeOut(this.timeOut);
        b.setTryTime(this.tryTime);
        b.setFailureOnError(this.failureOnError);
        b.doQuery()
    }
};
ezserverclient.easyxmlparse.EzMapserviceQuery.prototype.getQueryItemCount = function() {
    return this.itemCount
};
ezserverclient.easyxmlparse.EzMapserviceQuery.prototype.getQueryItem = function(a) {
    return this.queryItem[a]
};
ezserverclient.easyxmlparse.QueryItem = function(a, b) {
    this.timeOut = null;
    this.tryTime = null;
    this.state = State.SUCCESS;
    this.url = a;
    this.failureOnError = false;
    this.xmlDoc = b;
    this.responseXml = null
};
ezserverclient.easyxmlparse.QueryItem.prototype.currentTryTime = 0;
ezserverclient.easyxmlparse.QueryItem.prototype.reSendId = 0;
ezserverclient.easyxmlparse.QueryItem.prototype.getTimeOut = function() {
    return this.timeOut
};
ezserverclient.easyxmlparse.QueryItem.prototype.setTimeOut = function(a) {
    this.timeOut = a
};
ezserverclient.easyxmlparse.QueryItem.prototype.getTryTime = function() {
    return this.tryTime
};
ezserverclient.easyxmlparse.QueryItem.prototype.setTryTime = function(a) {
    this.tryTime = a
};
ezserverclient.easyxmlparse.QueryItem.prototype.getQueryXml = function() {
    return this.xmlDoc
};
ezserverclient.easyxmlparse.QueryItem.prototype.setQueryXml = function(a) {
    this.xmlDoc = a
};
ezserverclient.easyxmlparse.QueryItem.prototype.getResponseXml = function() {
    return this.responseXml
};
ezserverclient.easyxmlparse.QueryItem.prototype.setResponseXml = function(a) {
    this.responseXml = a
};
ezserverclient.easyxmlparse.QueryItem.prototype.getResultState = function() {
    return this.state
};
ezserverclient.easyxmlparse.QueryItem.prototype.setResultState = function(a) {
    this.state = a
};
ezserverclient.easyxmlparse.QueryItem.prototype.getFailureOnError = function() {
    return this.failureOnError
};
ezserverclient.easyxmlparse.QueryItem.prototype.setFailureOnError = function(a) {
    this.failureOnError = a
};
ezserverclient.easyxmlparse.QueryItem.prototype.doQuery = function() {
    var b = this.url;
    var h = this.xmlDoc;
    var f = this.tryTime;
    var a = this;
    var d = this.xmlDoc;
    this.itemId = null;
    var c = window.ActiveXObject ? new ActiveXObject("Microsoft.XMLHTTP") : new XMLHttpRequest();
    c.open("POST", this.url, true);
    c.setRequestHeader("Content-Type", "text/xml");
    c.onreadystatechange = g;
    if (a.currentTryTime == 0) {
        RequestMapObject.add(c, new RequestMapItemBinding(ezserverclient.easyxmlparse.EzMapserviceQuery.NextOrder, d))
    } else {
        RequestMapObject.add(c, new RequestMapItemBinding(a.reSendId, d))
    }
    c.send(d);
    if (a.currentTryTime == 0) {
        ezserverclient.easyxmlparse.EzMapserviceQuery.NextOrder++
    }
    function g() {
        if (c.readyState == 4) {
            if (c.status == 200) {
                var k = null;
                try {
                    k = new ActiveXObject("Microsoft.XMLDOM");
                    k.async = false;
                    if (c.responseText != null) {
                        k.loadXML(c.responseText)
                    } else {
                        return
                    }
                } catch (i) {
                    try {
                        parser = new DOMParser();
                        if (c.responseText != null) {
                            k = parser.parseFromString(c.responseText, "text/xml")
                        } else {
                            return
                        }
                    } catch (i) {
                        alert(i.message)
                    }
                }
                if ((k.getElementsByTagName("ERROR").length == 0)) {
                    var j = RequestMapObject.getValue(c);
                    RequestMapObject.remove(c);
                    a.setResponseXml(c.responseText);
                    a.setQueryXml(RequestMapObject.getValue(c).text);
                    a.itemId = RequestMapObject.getValue(c).num;
                    if (--a.mapServiceQuery.itemCurrentCount == 0) {
                        ezserverclient.easyxmlparse.EzMapserviceQuery.QueryState = false;
                        a.mapServiceQuery.onFinished()
                    }
                } else {
                    if (++a.currentTryTime > a.getTryTime()) {
                        a.setResultState(State.ERROR);
                        a.mapServiceQuery.queryFlag++;
                        --a.mapServiceQuery.itemCurrentCount;
                        if (a.mapServiceQuery.failureOnError && a.mapServiceQuery.queryFlag == 1) {
                            ezserverclient.easyxmlparse.EzMapserviceQuery.QueryState = false;
                            throw new Error("由于第" + RequestMapObject.getValue(c).num + "个子查询出错，该查询事务终止")
                        }
                        a.setResponseXml(c.responseText);
                        if (a.mapServiceQuery.itemCurrentCount == 0) {
                            ezserverclient.easyxmlparse.EzMapserviceQuery.QueryState = false;
                            a.mapServiceQuery.onFinished()
                        }
                        return
                    }
                    a.doQuery()
                }
            } else {
                if (++a.currentTryTime > a.getTryTime()) {
                    a.setResultState(State.ERROR);
                    a.mapServiceQuery.queryFlag++;
                    --a.mapServiceQuery.itemCurrentCount;
                    if (a.mapServiceQuery.failureOnError && a.mapServiceQuery.queryFlag == 1) {
                        ezserverclient.easyxmlparse.EzMapserviceQuery.QueryState = false;
                        throw new Error("由于第" + RequestMapObject.getValue(c).num + "个子查询出错，该查询事务终止")
                    }
                    if (a.mapServiceQuery.itemCurrentCount == 0) {
                        ezserverclient.easyxmlparse.EzMapserviceQuery.QueryState = false;
                        a.mapServiceQuery.onFinished()
                    }
                    return
                }
                a.doQuery()
            }
        }
    }
};
function RequestMapItemBinding(a, b) {
    this.num = a;
    this.text = b;
    this.toString = function() {
        return "[" + this.num + "] == [" + this.text + "]"
    }
}
function RequestMap() {
    this.map = new Array();
    this.getValue = function(b) {
        for (var a = 0; a < this.map.length; a++) {
            if (this.map[a].request == b) {
                return this.map[a].binding
            }
        }
        return null
    };
    this.add = function(a, b) {
        this.map[this.map.length] = new RequestMapItem(a, b)
    };
    this.remove = function(b) {
        for (var a = 0; a < this.map.length; a++) {
            if (this.map[a].request == b) {
                this.map[a] == null;
                return
            }
        }
    }
}
RequestMapObject = new RequestMap();
function RequestMapItem(a, b) {
    this.request = a;
    this.binding = b
}
function State(a) {
    this.state = a
}
State.ERROR = false;
State.SUCCESS = true;

function MapServer(d, c, b) {
    this.setMapDispName = function(g, f) {
        try {
            if (!EzServerClient.GlobeFunction.isTypeRight(g, "int")) {
                throw EzErrorFactory.createError("MapServer::setMapDispName方法中arguments[0]类型不正确")
            }
            if (!EzServerClient.GlobeFunction.isTypeRight(f, "string")) {
                throw EzErrorFactory.createError("MapServer::setMapDispName方法中arguments[1]类型不正确")
            }
            this.mMapServerURLArr[g].mapServerName = f
        } catch (h) {
            throw EzErrorFactory.createError("MapServer::setMapDispName方法执行不正确", h)
        }
    };
    this.getMapDispName = function(f) {
        try {
            if (!EzServerClient.GlobeFunction.isTypeRight(f, "int")) {
                throw EzErrorFactory.createError("MapServer::getMapDispName方法中arguments[0]类型不正确")
            }
            return this.mMapServerURLArr[f].mapServerName
        } catch (g) {
            throw EzErrorFactory.createError("MapServer::getMapDispName方法执行不正确", g)
        }
    };
    this.getDefaultMapDispName = function(f) {
        try {
            if (!EzServerClient.GlobeFunction.isTypeRight(f, "int")) {
                throw EzErrorFactory.createError("MapServer::getDefaultMapDispName方法中arguments[0]类型不正确")
            }
            var h = EzServerClient.GlobeParams.MapSrcURL.length;
            if (f >= h) {
                return "地图" + (f - h)
            } else {
                return EzServerClient.GlobeParams.MapSrcURL[f][0]
            }
        } catch (g) {
            throw EzErrorFactory.createError("MapServer::getDefaultMapDispName方法执行不正确", g)
        }
    };
    this.getMapServerURL = function(f) {
        try {
            if (!EzServerClient.GlobeFunction.isTypeRight(f, "int")) {
                throw EzErrorFactory.createError("MapServer::getMapServerURL方法中arguments[0]类型不正确")
            }
            return this.mMapServerURLArr[f]
        } catch (g) {
            throw EzErrorFactory.createError("MapServer::getMapServerURL方法执行不正确", g)
        }
    };
    this.setMapServerURL = function(g, f) {
        try {
            if (!EzServerClient.GlobeFunction.isTypeRight(g, "int")) {
                throw EzErrorFactory.createError("MapServer::setMapServerURL方法中arguments[0]类型不正确")
            }
            if (!EzServerClient.GlobeFunction.isTypeRight(f, "string") && !EzServerClient.GlobeFunction.isTypeRight(f, "Array")) {
                throw EzErrorFactory.createError("MapServer::setMapServerURL方法中arguments[1]类型不正确")
            }
            this.mMapServerURLArr[g] = f
        } catch (h) {
            throw EzErrorFactory.createError("MapServer::setMapServerURL方法执行不正确", h)
        }
    };
    this.getMapServerURLCount = function() {
        try {
            return this.mMapServerURLArr.length
        } catch (f) {
            throw EzErrorFactory.createError("MapServer::getMapServerURLCount方法执行不正确", f)
        }
    };
    this.mMapServerURLArr = [];
    for (var a = 0; a < arguments.length; a++) {
        if (typeof arguments[a] == "string") {
            this.mMapServerURLArr.push([arguments[a]])
        } else {
            if (arguments[a] instanceof Array) {
                this.mMapServerURLArr.push(arguments[a])
            } else {
                throw new Error("MapServer对象构造方法参数有误")
            }
        }
        this.mMapServerURLArr[a].mapServerName = this.getDefaultMapDispName(a)
    }
}
function MapServerControl(a) {
    var c = document.createElement("div");
    c.onselectstart = _NoAction;
    c.style.cssText = "BORDER-RIGHT: #015190 1px solid;	BORDER-TOP: #015190 1px solid;	BORDER-LEFT: #015190 1px solid;	BORDER-BOTTOM: #015190 1px solid;	RIGHT: 12em;	WIDTH: 65px;	HEIGHT: 12px;	CURSOR: pointer;	POSITION: absolute;	BACKGROUND-COLOR: #FFFFCC";
    var b = document.createElement("div");
    b.style.cssText = "TEXT-ALIGN: center;	VERTICAL-ALIGN:middle;	FONT-SIZE: 12px;	FONT-FAMILY:宋体;	color:#015190";
    b.innerHTML = a;
    b.noWrap = true;
    c.appendChild(b);
    return c
}
MapServerControl.prototype = new MapControl();
MapServerControl.prototype.init = function(a) {
    if (a instanceof MainFrame) {
        a.createSmallPanningControls(this.div);
        a.createSmallZoomControls(this.div)
    }
};
function MapSmallControl() {
    this.base = MapControl;
    this.base()
}
MapSmallControl.prototype = new MapControl();
MapSmallControl.prototype.init = function(a) {
    if (a instanceof MainFrame) {
        a.createSmallPanningControls(this.div);
        a.createSmallZoomControls(this.div)
    }
};
function MapStandControl() {
    this.base = MapControl;
    this.base()
}
MapStandControl.prototype = new MapControl();
MapStandControl.prototype.init = function(a) {
    if (a instanceof MainFrame) {
        a.createPanningControls(this.div);
        a.createZoomControls(this.div);
        a.createZoomSlider(this.div)
    }
};
function MapStatusControl(a) {
    this.anchorLevel = null;
    this.anchor = new Point(0, 0);
    this.spec = null;
    this.span = new Rect(_MaxNumber, _MaxNumber);
    this.points = null;
    this.map = a;
    this.map.addStateListener(this.eventHandler("onMapStateChanged"));
    this.map.onresize = this.eventHandler("onMapResize")
}
MapStatusControl.prototype.onMapStateChanged = function() {
    if (this.anchorLevel != this.map.realZoomLevel || this.spec != this.map.spec) {
        this.reset();
        this.addPoint(0, 0, true);
        return
    }
    var b = this.map.getCenterLatLng();
    var a = Math.round((b.x - this.anchor.x) / this.span.width);
    var c = Math.round((b.y - this.anchor.y) / this.span.height);
    this.addPoint(a, c, true)
};
MapStatusControl.prototype.onMapResize = function() {
    this.reset();
    this.addPoint(0, 0, false)
};
MapStatusControl.prototype.reset = function() {
    this.map.getCenterLatLng(this.anchor);
    this.map.getSpanLatLng(this.span);
    this.spec = this.map.spec;
    this.anchorLevel = this.map.realZoomLevel;
    this.points = new Object()
};
MapStatusControl.prototype.addPoint = function(b, c, a) {
    var d = b + "," + c;
    if (this.points[d]) {
        return
    }
    this.points[d] = 1;
    if (a) {
    }
};
function MultiMaps() {
    this.maps = new Array()
}
MultiMaps.prototype.openMap = function(d, a) {
    try {
        if (!EzServerClient.GlobeFunction.isTypeRight(d, "string") && !EzServerClient.GlobeFunction.isTypeRight(d, "object")) {
            throw EzErrorFactory.createError("MultiMaps::openMap方法中arguments[0]参数类型不正确")
        }
        if (!EzServerClient.GlobeFunction.isTypeRight(a, "string")) {
            throw EzErrorFactory.createError("MultiMaps::openMap方法中arguments[1]参数类型不正确")
        }
        var b = null;
        if (typeof d == "string") {
            b = new EzMap(document.getElementById(d))
        } else {
            b = new EzMap(d)
        }
        b.showMapServer();
        b.showSmallMapControl();
        if (a) {
            b.showVersion(a)
        }
        b.addMapChangeListener(this.eventHandler("refreshAllMap"));
        this.maps.push(b);
        return b
    } catch (c) {
        throw EzErrorFactory.createError("MultiMaps::openMap方法执行不正确", c)
    }
};
MultiMaps.prototype.refreshAllMap = function() {
    if (_bIsLocked) {
        return
    }
    _bIsLocked = true;
    for (var a = 0; a < this.maps.length; a++) {
        var b = this.maps[a];
        if (b.getZoomLevel() != _curentLevel) {
            b.centerAndZoom(_curentPoint, _curentLevel)
        } else {
            if (!b.getCenterLatLng().approxEquals(_curentPoint)) {
                b.recenterOrPanToLatLng(_curentPoint)
            }
        }
    }
    window.setTimeout("_bIsLocked=false;", 300)
};
MultiMaps.prototype.refreshAllMap_ = function() {
    _bIsLocked = true;
    for (var a = 0; a < this.maps.length; a++) {
        var b = this.maps[a];
        b.map.clearStateChanged()
    }
    for (var a = 0; a < this.maps.length; a++) {
        var b = this.maps[a];
        if (b.getZoomLevel() != _curentLevel) {
            b.centerAndZoom(_curentPoint, _curentLevel)
        } else {
            b.recenterOrPanToLatLng(_curentPoint)
        }
    }
    this.setTimeout("this.addMapList()", 200)
};
MultiMaps.prototype.addMapList = function() {
    for (var a = 0; a < this.maps.length; a++) {
        var b = this.maps[a];
        b.addMapChangeListener(this.eventHandler("refreshAllMap"))
    }
    _bIsLocked = false
};
MultiMaps.prototype.zoomInExt = function() {
    for (var a = 0; a < this.maps.length; a++) {
        var b = this.maps[a];
        b.zoomInExt()
    }
};
MultiMaps.prototype.zoomOutExt = function() {
    for (var a = 0; a < this.maps.length; a++) {
        var b = this.maps[a];
        b.zoomOutExt()
    }
};
MultiMaps.prototype.pan = function() {
    for (var a = 0; a < this.maps.length; a++) {
        var b = this.maps[a];
        b.pan()
    }
};
function nc(a) {
    this.ticks = a;
    this.tick = 0
}
nc.prototype.reset = function() {
    this.tick = 0
};
nc.prototype.next = function() {
    this.tick++;
    var a = Math.PI * (this.tick / this.ticks - 0.5);
    return (Math.sin(a) + 1) / 2
};
nc.prototype.more = function() {
    return this.tick < this.ticks
};
function nc1(a) {
    this.ticks = a;
    this.tick = 0
}
nc1.prototype.reset = function() {
    this.tick = 0
};
nc1.changeArr = [0.3, 0.55, 0.7, 0.79, 0.85, 0.89, 0.94, 0.97, 0.99, 1];
nc1.prototype.next = function() {
    this.tick++;
    if (this.tick >= 10) {
        return 1
    } else {
        return nc1.changeArr[this.tick - 1]
    }
};
nc1.prototype.more = function() {
    return this.tick < this.ticks
};
function OverlayStatus(a, b, c) {
    this.startSeq = a;
    this.endSeq = b;
    this.iStatus = c
}
OverlayStatus.prototype.toString = function() {
    return "开始周期" + this.startSeq + ",结束周期:" + this.endSeq + "显示状态:" + this.iStatus
};
OverlayStatus.prototype.bIsConflict = function(b) {
    var a = false;
    a = (this.startSeq >= b.startSeq && this.endSeq <= b.endSeq) || (this.endSeq >= b.startSeq && this.endSeq <= b.endSeq);
    if (a) {
        alert("设置时间有冲突，已经存在该范围的时间设置:(" + this.startSeq + "," + this.endSeq + ")")
    }
    return a
};
function OverView(e, c, b, a, d) {
    this.url = e;
    this.MBR = new MBR(c, b, a, d);
    this.imgWidth = 200;
    this.imgHeight = 240;
    this.width = 200;
    this.height = 150;
    this.closeImgURL = _CloseImg;
    this.minLevel = 0;
    this.maxLevel = _MaxLevel
}
function Shaderer() {
}
function Timer() {
}
function TrackMonitor(a) {
    this.routeArray = a;
    this.length = a.length;
    this.index = 0;
    this.interval = 1
}
TrackMonitor.prototype.reset = function() {
    this.index = 0
};
TrackMonitor.prototype.next = function() {
    if (this.interval != 1) {
        if ((this.index + this.interval) < this.length) {
            this.index += this.interval
        } else {
            this.index = this.length
        }
    } else {
        this.index++
    }
    return this.routeArray[this.index - 1]
};
TrackMonitor.prototype.prev = function() {
    this.index--;
    return this.routeArray[this.index - 1]
};
function V(a) {
    this.stylesheet = a
}
V.prototype.transformToHTML = function(a, b) {
    var c = "";
    b.className = "InfoClass";
    if (typeof Monitor != "undefined" && a instanceof Monitor) {
        c = a.toHTML();
        b.innerHTML = c
    } else {
        if (typeof a == "string") {
            c = a;
            b.innerHTML = c
        } else {
            if (typeof a == "object") {
                RemoveChildren(b);
                b.appendChild(a)
            } else {
                alert("不知类型")
            }
        }
    }
};
function voidFunc(a) {
    return null
}
function xa(a, b) {
    this.id = a;
    this.ticketClass = b
}
xa.prototype.isValid = function() {
    return sb[this.ticketClass] == this.id
};
function XMLHttp() {
}
XMLHttp.createXMLHttp = function() {
    if (typeof XMLHttpRequest != "undefined") {
        return new XMLHttpRequest()
    } else {
        if (window.ActiveXObject) {
            var a = ["MSXML2.XMLHttp.5.0", "MSXML2.XMLHttp.4.0", "MSXML2.XMLHttp.3.0", "MSXML2.XMLHttp", "Microsoft.XMLHttp"];
            for (var b = 0; b < a.length; b++) {
                try {
                    var d = new ActiveXObject(a[b]);
                    return d
                } catch (c) {
                }
            }
        }
    }
};

var g_next_id = 0;
_printWin = null;
_curMap = null;
g_menu = new Array();
g_menu.push(new MenuObject("属性", "g_current_editor.showEdit()"));
g_menu.push(new MenuObject("删除", "getMapApp().removeOverlay(g_current_editor)"));
g_menu.push(null);
g_menu.push(new MenuObject("放大", "getMapApp().zoomIn()"));
g_menu.push(new MenuObject("缩小", "getMapApp().zoomOut()"));
g_menu.push(new MenuObject("在此居中地图", "getMapApp().centerAtMouse()"));
EzServerClient.GlobeParams.OverViewFlag = 0;
EzServerClient.GlobeParams.SlipOutImg = _ImageBaseUrl + "overview/OverViewSlipOut.png";
EzServerClient.GlobeParams.SlipInImg = _ImageBaseUrl + "overview/OverViewSlipIn.png";
EzServerClient.GlobeFunction.SlipOut = function(c, a, b) {
    a.style.right = convert2Px((EzServerClient.GlobeParams.OverViewFlag - b) * (a.offsetWidth - 16) / b);
    a.style.bottom = convert2Px((EzServerClient.GlobeParams.OverViewFlag - b) * (a.offsetHeight - 16) / b);
    c.map.mapScale[0].style.right = convert2Px(parseInt(a.offsetWidth - 16) / b * EzServerClient.GlobeParams.OverViewFlag + 50);
    c.map.mapScale[1].style.right = convert2Px(parseInt(a.offsetWidth - 16) / b * EzServerClient.GlobeParams.OverViewFlag + 50);
    if (++EzServerClient.GlobeParams.OverViewFlag > b) {
        return
    }
    setTimeout(function() {
        EzServerClient.GlobeFunction.SlipOut(c, a, b)
    }, b)
};
EzServerClient.GlobeFunction.SlipIn = function(e, c, d, b, a) {
    c.style.right = convert2Px(parseInt(c.style.right) - (c.offsetWidth - 16) / d);
    c.style.bottom = convert2Px(parseInt(c.style.bottom) - (c.offsetHeight - 16) / d);
    e.map.mapScale[0].style.right = convert2Px(parseInt(parseInt(c.offsetWidth - 16) / d * (d - EzServerClient.GlobeParams.OverViewFlag) + 50));
    e.map.mapScale[1].style.right = convert2Px(parseInt(parseInt(c.offsetWidth - 16) / d * (d - EzServerClient.GlobeParams.OverViewFlag) + 50));
    if (++EzServerClient.GlobeParams.OverViewFlag > d) {
        c.style.right = convert2Px(b);
        c.style.bottom = convert2Px(a);
        return
    }
    setTimeout(function() {
        EzServerClient.GlobeFunction.SlipIn(e, c, d, b, a)
    }, d)
};
function MapsApp(g, e, b, d, f, c) {
    if (!EzServerClient.GlobeFunction.isTypeRight(g, "object")) {
        throw EzErrorFactory.createError("EzMap构造方法中arguments[0]类型不正确")
    }
    this.baseGroupLayer = null;
    this.groupLayers = [];
    this.version = 0.3;
    this.mapCenter = new Point(116, 39);
    this.mapFullExtent = new MBR(0, 0, 100, 100);
    this.mapInitLevel = 9;
    this.mapMaxLevel = 15;
    this.zoomOffset = 0;
    this.copyRight = "&copy; easymap";
    if (e) {
        this.mapOptions = e
    } else {
        this.mapOptions = this.setCompatibility()
    }
    this.setMapOptions(this.mapOptions);
    this.queryResults2 = [];
    this.ezMapServiceTryTimes = 1;
    this.map = null;
    this.mapContainer = g;
    this.mapContainer.className = "map";
    this.panel = b;
    this.metaPanel = d;
    this.permalink = f;
    this.specToggleArea = c;
    this.overViewID = "OverViewMap" + g_next_id;
    g_next_id++;
    this.overViewPanelID = "OverViewMapPanel";
    BindingEvent(this.mapContainer, "resize", this.eventHandler("resizeMapView"));
    BindingEvent(window, "beforeprint", this.eventHandler("beforePrint"));
    BindingEvent(window, "afterprint", this.eventHandler("afterPrint"));
    if (_IEBrowser.type == 4) {
        document.body.style.overflow = "hidden";
        this.panel.style.overflow = "auto"
    }
    this.queryNum = 0;
    this.mapContainer.style.overflow = "hidden";
    this.initializeCompat(!e);
    var a = this;
    window.getMap = function() {
        return a.map
    };
    window.getMapApp = function() {
        return a
    }
}
MapsApp.prototype.initializeCompat = function(d) {
    if (d) {
        for (var f = 0; f < EzServerClient.GlobeParams.MapSrcURL.length; f++) {
            var c = EzServerClient.GlobeParams.MapSrcURL[f][0];
            var h = null;
            var g = [];
            for (var e = 1; e < EzServerClient.GlobeParams.MapSrcURL[f].length; e++) {
                var k = null;
                var b = f + e;
                var a = EzServerClient.GlobeParams.MapSrcURL[f][e].join(",");
                switch (EzServerClient.GlobeParams.ZoomLevelSequence) {
                    case 0:
                    case 1:
                        k = new EzServerClient.Layer.EzMapTileLayer2005(b, a, {tileWidth: EzServerClient.GlobeParams.MapUnitPixels,tileHeight: EzServerClient.GlobeParams.MapUnitPixels,originAnchor: EzServerClient.GlobeParams.TileAnchorPoint,zoomLevelSequence: EzServerClient.GlobeParams.ZoomLevelSequence,mapCoordinateType: EzServerClient.GlobeParams.MapCoordinateType,mapConvertScale: EzServerClient.GlobeParams.MapConvertScale});
                        break;
                    case 2:
                    case 3:
                    case 4:
                        if(EzServerClient.GlobeParams.MyMapType === NPMapLib.MAP_LAYER_TYPE_GOOGLE_OFFLINE || 
                           EzServerClient.GlobeParams.MyMapType === NPMapLib.MAP_LAYER_TYPE_GOOGLE_TILE){
                            k = new EzServerClient.Layer.GoogleTileLayer(b,a);
                        }
                        else if(EzServerClient.GlobeParams.MyMapType === NPMapLib.MAP_LAYER_TYPE_ARCGIS_OFFLINE || 
                           EzServerClient.GlobeParams.MyMapType === NPMapLib.MAP_LAYER_TYPE_ARCGIS_TILE){
                            k = new EzServerClient.Layer.ArcGISTileLayer(b,a);
                        }
                        else if(EzServerClient.GlobeParams.MyMapType === NPMapLib.MAP_LAYER_TYPE_WMS){
                            k = new EzServerClient.Layer.GeoServerTileLayer(b,a);
                        }
                        else{
                            k = new EzServerClient.Layer.EzMapTileLayer2010(b, a, {
                                tileWidth: EzServerClient.GlobeParams.MapUnitPixels,
                                tileHeight: EzServerClient.GlobeParams.MapUnitPixels,
                                originAnchor: EzServerClient.GlobeParams.TileAnchorPoint,
                                zoomLevelSequence: EzServerClient.GlobeParams.ZoomLevelSequence,
                                mapCoordinateType: EzServerClient.GlobeParams.MapCoordinateType,
                                mapConvertScale: EzServerClient.GlobeParams.MapConvertScale
                            });
                        }
                        break;
                    default:
                        k = new EzServerClient.Layer.EzMapTileLayer2010(b, a, {tileWidth: EzServerClient.GlobeParams.MapUnitPixels,tileHeight: EzServerClient.GlobeParams.MapUnitPixels,originAnchor: EzServerClient.GlobeParams.TileAnchorPoint,zoomLevelSequence: EzServerClient.GlobeParams.ZoomLevelSequence,mapCoordinateType: EzServerClient.GlobeParams.MapCoordinateType,mapConvertScale: EzServerClient.GlobeParams.MapConvertScale});
                        break
                }
                g.push(k)
            }
            h = new EzServerClient.GroupLayer(c, g);
            this.addGroupLayer(h)
        }
    }
};
MapsApp.prototype.beforePrint = function() {
    var d = this.mapContainer.offsetWidth / window.screen.logicalXDPI;
    var c = 7;
    var g = this.mapContainer.offsetHeight / window.screen.logicalYDPI;
    var f = 8;
    if (this.vpage) {
        f = 7;
        if (this.vpage.directions) {
            f = 3.5
        } else {
            if (this.vpage.overlays.length > 0 && this.vpage.overlays[0].locations.length > 1) {
                f = 4.5
            }
        }
    }
    var e = c / d;
    if (g * e > f) {
        e = f / g
    }
    var b = d * e;
    if (b < c) {
        var a = Math.floor(b / c * 100);
        this.mapContainer.style.width = a + "%"
    } else {
        this.mapContainer.style.width = "100%"
    }
    this.mapContainer.style.zoom = e;
    if (document.body.style.overflow == "hidden") {
    }
};

MapsApp.prototype.getMapUnit = function(){
    if(EzServerClient.GlobeParams.MapCoordinateType === 1){
        return "degree";
    }
    else{
        return "meter";
    }
};

MapsApp.prototype.afterPrint = function() {
    this.mapContainer.style.zoom = 1;
    this.mapContainer.style.width = "auto";
    this.resizeMapView()
};
MapsApp.prototype.centerAndZoom = function(b, a) {
    try {
        if (!EzServerClient.GlobeFunction.isTypeRight(b, "Point")) {
            throw EzErrorFactory.createError("EzMap::centerAndZoom方法中arguments[0]类型不正确")
        }
        a = parseInt(a);
        this.map.centerAndZoom(b, a)
    } catch (c) {
        throw EzErrorFactory.createError("EzMap::centerAndZoom方法执行不正确", c)
    }
};
MapsApp.prototype.isLoaded = function() {
    return this.map.isLoaded()
};
MapsApp.prototype.zoomTo = function(a) {
    try {
        if (!EzServerClient.GlobeFunction.isTypeRight(a, "int")) {
            throw EzErrorFactory.createError("EzMap::zoomTo方法中arguments[0]参数类型不正确")
        }
        this.map.zoomTo(a)
    } catch (b) {
        throw EzErrorFactory.createError("EzMap::zoomTo方法执行不正确", b)
    }
};
MapsApp.prototype.initialize = function() {
    if (!this.baseGroupLayer.getLayers()[0]) {
        throw EzErrorFactory.createError("没有加入图层组或者图层组中没有图层，需要调用addGroupLayer方法加入图层组")
    }
    this.map = new MainFrame(this.mapContainer, null, null, null, false, false, null, null, this, {baseGroupLayer: this.baseGroupLayer,groupLayers: this.groupLayers,mapCenter: this.mapCenter,mapInitLevel: this.mapInitLevel,zoomOffset: this.zoomOffset,mapMaxLevel: this.mapMaxLevel});
    this.map.showCopyright();
    this.map.showMapScale();
    this.map.showMapServerControl();
    this.map.enableDblClick();
    this.map.enableMouseScroll();
    
    if (EzServerClient.GlobeParams.DynamicCopyright.length > 0) {
        EzServerClient.GlobeFunction.setDynamicCopyright(this, EzServerClient.GlobeParams.DynamicCopyright)
    }
    this.map.container.focus();
    var a = this;
    BindingEvent(this.map.container, "mousemove", this.map.eventHandler("displayCoord"));
    this.map.registerKeyHandlers(this.map.container);
    if (!this.map.initDisplay) {
        this.map.container.style.display = "none"
    }
};
MapsApp.prototype.loadMap = MapsApp.prototype.initialize;
MapsApp.prototype.onMapStateChanged = function() {
    try {
        if (this.vpageDoc) {
            var d = this.map.getCenterLatLng();
            this.vpageDoc.getElementById(se).value = d.y;
            this.vpageDoc.getElementById(te).value = d.x;
            this.vpageDoc.getElementById("zoom").value = this.map.realZoomLevel
        }
        var c = this.getPageURL();
        this.permalink.href = c
    } catch (a) {
        EzLog.dump(a)
    }
};
MapsApp.prototype.resizeMapView = function() {
    var f = this.getWindowSize();
    var c = ObjectOffset(this.mapContainer);
    var d = f.height - c.y - 10;
    var b = ObjectOffset(this.panel);
    var a = d - (b.y - c.y);
    if (typeof _ResizeMap != "undefined" && _ResizeMap == true) {
        this.mapContainer.style.height = convert2Px(d);
        alert("height...")
    }
    if (document.body.style.overflow == "hidden") {
    }
    if (this.map) {
        var e = this.getBoundsLatLng();
        this.map.onResize();
        this.map.containOffset = c;
        EzEvent.ezEventListener.source = this.map;
        EzEvent.ezEventListener.eventType = EzEvent.MAP_RESIZE;
        EzEvent.extentPrevious = e;
        EzEvent.extent = this.getBoundsLatLng();
        EzEvent.trigger(EzEvent.ezEventListener, EzEvent)
    }
};

MapsApp.prototype.enableMouseScroll = function(){
    this.map.enableMouseScroll();
};

MapsApp.prototype.disableMouseScroll = function(){
    this.map.disableMouseScroll();
};

MapsApp.prototype.enableKeyboard = function(){
    this.map.enableKeyboard();
};

MapsApp.prototype.disableKeyboard = function(){
    this.map.disableKeyboard();
};

MapsApp.prototype.fullExtent = function() {
    this.map.fullExtent()
};
MapsApp.prototype.centerAtMBR = function(g, d, b, a) {
    try {
        if (arguments.length == 1) {
            if (!EzServerClient.GlobeFunction.isTypeRight(g, "MBR")) {
                throw EzErrorFactory.createError("EzMap::centerAtMBR方法中arguments[0]类型不正确")
            }
        } else {
            g = parseFloat(g);
            d = parseFloat(d);
            b = parseFloat(b);
            a = parseFloat(a)
        }
        if (arguments.length == 1 && g instanceof MBR) {
            var f = g;
            this.map.centerAtMBR(f.minX, f.minY, f.maxX, f.maxY)
        } else {
            if (arguments.length == 4) {
                this.map.centerAtMBR(g, d, b, a)
            } else {
                alert("参数无效")
            }
        }
    } catch (c) {
        throw EzErrorFactory.createError("EzMap::centerAtMBR方法执行不正确", c)
    }
};
MapsApp.prototype.getDragMode = function() {
    if (typeof this.map.drawMode == "undefined" || this.map.drawMode == null) {
        this.map.drawMode = "pan"
    }
    return this.map.drawMode
};
MapsApp.prototype.changeDragMode = function(d, a, c, f) {
    try {
        if (!EzServerClient.GlobeFunction.isTypeRight(d, "string")) {
            throw EzErrorFactory.createError("EzMap::changeDragMode方法中arguments[0]类型不正确")
        }
        if (a && !EzServerClient.GlobeFunction.isTypeRight(a, "object")) {
            throw EzErrorFactory.createError("EzMap::changeDragMode方法中arguments[1]类型不正确")
        }
        if (c && !EzServerClient.GlobeFunction.isTypeRight(c, "object")) {
            throw EzErrorFactory.createError("EzMap::changeDragMode方法中arguments[2]类型不正确")
        }
        if (f && !EzServerClient.GlobeFunction.isTypeRight(f, "function")) {
            throw EzErrorFactory.createError("EzMap::changeDragMode方法中arguments[3]类型不正确")
        }
        this.map.changeDragMode(d, a, c, f)
    } catch (b) {
        throw EzErrorFactory.createError("EzMap::changeDragMode方法执行不正确", b)
    }
};
MapsApp.prototype.zoomIn = function() {
    switch (EzServerClient.GlobeParams.ZoomLevelSequence) {
        case 0:
        case 3:
            this.zoomTo(this.getZoomLevel() - 1);
            break;
        case 1:
        case 2:
        case 4:
            this.zoomTo(this.getZoomLevel() + 1);
            break
    }
};
MapsApp.prototype.zoomOut = function() {
    switch (EzServerClient.GlobeParams.ZoomLevelSequence) {
        case 0:
        case 3:
            this.zoomTo(this.getZoomLevel() + 1);
            break;
        case 1:
        case 2:
        case 4:
            this.zoomTo(this.getZoomLevel() - 1);
            break
    }
};
MapsApp.prototype.zoomInExt = function() {
    this.map.container.style.cursor = _ZoomInURL;
    this.changeDragMode("zoomInExt", null, null, this.eventHandler("zoomInMBR"))
    this.map.isZoomInExt = true;
};
MapsApp.prototype.zoomOutExt = function() {
    this.map.container.style.cursor = _ZoomOutURL;
    this.changeDragMode("zoomOutExt", null, null, this.eventHandler("zoomOutMBR"))
    this.map.isZoomInExt = false;
};
MapsApp.prototype.zoomInMBR = function() {
    if (!this.map.vmlDraw) {
        return
    }
    var d = this.map.vmlDraw.getMBR();
    d = MBR.intersection(d, this.getBoundsLatLng());
    var c = this.map.getPixelSpan();
    if (d.getSpanX() < 2 * c || d.getSpanY() < 2 * c) {
        var b = d.getCenterPoint();
        switch (EzServerClient.GlobeParams.ZoomLevelSequence) {
            case 1:
            case 2:
                var a = Math.max(0, this.getZoomLevel() + 1);
                break;
            case 0:
            case 3:
                var a = Math.max(0, this.getZoomLevel() - 1);
                break
        }
        this.centerAndZoom(b, a);
        this.removeOverlay(this.map.vmlDraw);
        this.map.vmlDraw = null;
        return
    }
    this.centerAtMBR(d);
    this.removeOverlay(this.map.vmlDraw);
    this.map.vmlDraw = null
};
MapsApp.prototype.zoomOutMBR = function() {
    if (!this.map.vmlDraw) {
        return
    }
    var h = this.map.vmlDraw.getMBR();
    var g = this.getBoundsLatLng();
    var f = this.map.getPixelSpan();
    if (h.getSpanX() < 2 * f || h.getSpanY() < 2 * f) {
        var e = h.getCenterPoint();
        switch (EzServerClient.GlobeParams.ZoomLevelSequence) {
            case 1:
            case 2:
                var d = Math.max(0, this.getZoomLevel() - 1);
                break;
            case 0:
            case 3:
                var d = Math.max(0, this.getZoomLevel() + 1);
                break
        }
        this.centerAndZoom(e, d);
        this.removeOverlay(this.map.vmlDraw);
        this.map.vmlDraw = null;
        return
    }
    h = MBR.intersection(h, g);
    var b = g.getSpanX() / h.getSpanX();
    var a = g.getSpanY() / h.getSpanY();
    var c = Math.max(a, b);
    h.scale(c * c);
    this.centerAtMBR(h);
    this.removeOverlay(this.map.vmlDraw);
    this.map.vmlDraw = null
};
MapsApp.prototype.pan = function(a, c) {
    try {
        if (a && !EzServerClient.GlobeFunction.isTypeRight(a, "float")) {
            throw EzErrorFactory.createError("EzMap::pan方法中arguments[0]类型不正确")
        }
        if (c && !EzServerClient.GlobeFunction.isTypeRight(c, "float")) {
            throw EzErrorFactory.createError("EzMap::pan方法中arguments[1]类型不正确")
        }
        if (arguments.length == 0) {
            this.changeDragMode("pan")
        } else {
            if (arguments.length == 2) {
                this.map.pan(a, c)
            }
        }
    } catch (b) {
        throw EzErrorFactory.createError("EzMap::pan方法执行不正确", b)
    }
};
MapsApp.prototype.getSpanLatLng = function() {
    return this.map.getSpanLatLng()
};
MapsApp.prototype.showMapControl = function(a) {
    this.map.showMapControl(a)
};
MapsApp.prototype.hideMapControl = function() {
    this.map.hideMapControl()
};
MapsApp.prototype.measureLength = function(b) {
    try {
        if (b && !EzServerClient.GlobeFunction.isTypeRight(b, "function")) {
            throw EzErrorFactory.createError("EzMap::measureLength方法中arguments[0]类型不是Function类型")
        }
        this.map.measureLength(b)
    } catch (a) {
        throw EzErrorFactory.createError("EzMap::measureLength方法执行不正确", a)
    }
};
MapsApp.prototype.measureArea = function(b) {
    try {
        if (b && !EzServerClient.GlobeFunction.isTypeRight(b, "function")) {
            throw EzErrorFactory.createError("EzMap::measureArea方法中arguments[0]类型不是Function类型")
        }
        this.map.measureArea(b)
    } catch (a) {
        throw EzErrorFactory.createError("EzMap::measureArea方法执行不正确", a)
    }
};
MapsApp.prototype.centerAtPoint = function(a) {
    this.map.centerAtLatLng(a)
};
MapsApp.prototype.centerAtLatLng = function(a, d) {
    try {
        if (!EzServerClient.GlobeFunction.isTypeRight(a, "float") && !EzServerClient.GlobeFunction.isTypeRight(a, "Point")) {
            throw EzErrorFactory.createError("EzMap::centerAtLatLng方法中arguments[0]类型不正确")
        }
        if (d && !EzServerClient.GlobeFunction.isTypeRight(d, "float")) {
            throw EzErrorFactory.createError("EzMap::centerAtLatLng方法中arguments[1]类型不正确")
        }
        var b = null;
        if (a instanceof Point) {
            b = a
        } else {
            b = new Point(a, d)
        }
        this.map.centerAtLatLng(b);
        b = null
    } catch (c) {
        throw EzErrorFactory.createError("EzMap::centerAtLatLng方法执行不正确", c)
    }
};
MapsApp.prototype.getLevelOfMBR = function(f, d, b, a) {
    try {
        if (!EzServerClient.GlobeFunction.isTypeRight(f, "float")) {
            throw EzErrorFactory.createError("EzMap::getLevelOfMBR方法中arguments[0]类型不正确")
        }
        if (!EzServerClient.GlobeFunction.isTypeRight(d, "float")) {
            throw EzErrorFactory.createError("EzMap::getLevelOfMBR方法中arguments[1]类型不正确")
        }
        if (!EzServerClient.GlobeFunction.isTypeRight(b, "float")) {
            throw EzErrorFactory.createError("EzMap::getLevelOfMBR方法中arguments[2]类型不正确")
        }
        if (!EzServerClient.GlobeFunction.isTypeRight(a, "float")) {
            throw EzErrorFactory.createError("EzMap::getLevelOfMBR方法中arguments[3]类型不正确")
        }
        return this.map.getLevelOfMBR(f, d, b, a)
    } catch (c) {
        throw EzErrorFactory.createError("EzMap::getLevelOfMBR方法执行不正确", c)
    }
};
MapsApp.prototype.clearVMLContainer = function() {
    var a = this.map;
    a.clearVMLContainer()
};
MapsApp.prototype.debug = function() {
    var b = this.map.vmlContainer;
    var a = getEleByID("resultDiv");
    if (b && a) {
        a.innerText = this.map.vmlContainer.groupObj.outerHTML
    }
};
MapsApp.prototype.getWindowSize = function(a) {
    if (!a) {
        a = new Rect(0, 0)
    }
    if (window.self && self.innerWidth) {
        a.width = self.innerWidth;
        a.height = self.innerHeight;
        return a
    }
    if (document.documentElement && document.documentElement.clientHeight) {
        a.width = document.documentElement.clientWidth;
        a.height = document.documentElement.clientHeight;
        return a
    }
    a.width = document.body.clientWidth;
    a.height = document.body.clientHeight;
    return a
};
MapsApp.prototype.addOverlay = function(a, c) {
    try {
        if (!EzServerClient.GlobeFunction.isTypeRight(a, "iOverLay")) {
            throw EzErrorFactory.createError("EzMap::addOverlay方法中arguments[0]类型不正确")
        }
        if (c && !EzServerClient.GlobeFunction.isTypeRight(c, "boolean")) {
            throw EzErrorFactory.createError("EzMap::addOverlay方法中arguments[1]类型不正确")
        }
        this.map.addOverlay(a, c);
        EzEvent.ezEventListener.source = this.map;
        EzEvent.ezEventListener.eventType = EzEvent.MAP_ADDOVERLAY;
        EzEvent.overlay = a;
        EzEvent.trigger(EzEvent.ezEventListener, EzEvent)
    } catch (b) {
        throw EzErrorFactory.createError("EzMap::addOverlay方法执行不正确", b)
    }
};
MapsApp.prototype.removeOverlay = function(b, a) {
    try {
        if (!EzServerClient.GlobeFunction.isTypeRight(b, "iOverLay")) {
            throw EzErrorFactory.createError("EzMap::removeOverlay方法中arguments[0]类型不正确")
        }
        this.map.removeOverlay(b, a);
        EzEvent.ezEventListener.source = this.map;
        EzEvent.ezEventListener.eventType = EzEvent.MAP_REMOVEOVERLAY;
        EzEvent.trigger(EzEvent.ezEventListener, EzEvent)
    } catch (c) {
        throw EzErrorFactory.createError("EzMap::removeOverlay方法执行不正确", c)
    }
};
MapsApp.prototype.clearOverlays = function(a) {
    this.map.clearOverlays(a);
    EzEvent.ezEventListener.source = this.map;
    EzEvent.ezEventListener.eventType = EzEvent.MAP_CLEAROVERLAYS;
    EzEvent.trigger(EzEvent.ezEventListener, EzEvent)
};
MapsApp.prototype.clear = function(a) {
    this.clearOverlays(a);
    this.clearVMLContainer()
};
MapsApp.prototype.getOverlays = function() {
    return this.map.overlays
};
MapsApp.prototype.openInfoWindow = function(b, a, d) {
    try {
        if (!EzServerClient.GlobeFunction.isTypeRight(b, "Point")) {
            throw EzErrorFactory.createError("EzMap::openInfoWindow方法中arguments[0]类型不正确")
        }
        if (d && !EzServerClient.GlobeFunction.isTypeRight(d, "boolean")) {
            throw EzErrorFactory.createError("EzMap::openInfoWindow方法中arguments[2]类型不正确")
        }
        this.map.openInfoWindow(b.x, b.y, a, d)
    } catch (c) {
        throw EzErrorFactory.createError("EzMap::openInfoWindow方法执行不正确", c)
    }
};
MapsApp.prototype.getCenterLatLng = function() {
    var a = this.map.getCenterLatLng();
    return a
};
MapsApp.prototype.getZoomLevel = function() {
    return this.map.getZoomLevel()
};
MapsApp.prototype.getMaxLevel = function() {
    return _MaxLevel
};
MapsApp.prototype.centerAndZoomToBorder = function(a) {
    this.map.centerAndZoomToBorder(a)
};
MapsApp.prototype.printMap = function(m, j, n) {
    if (_printWin != null) {
        try {
            _printWin.close()
        } catch (h) {
            throw h
        }
    }
    var a = this.map.viewSize.height;
    var b = this.map.viewSize.width;
    var c = "width=" + b + "px,height=" + a + "px";
    c = c + ",menubar=yes,scrollbars=yes,resizable=no,location=no, status=no";
    _printWin = window.open("", "default", c);
    if (!j) {
        j = "地图页眉"
    }
    if (!n) {
        n = "地图页脚"
    }
    if (_printWin != null) {
        _printWin.document.writeln("<html xmlns:v = 'urn:schemeas-microsoft-com:vml'><head>");
        _printWin.document.writeln('<meta http-equiv="content-type" content="text/html; charset=GBK"/>');
        _printWin.document.writeln("<title>地图打印</title>");
        _printWin.document.writeln("<script>window.onbeforeunload=function(){opener._printWin=null;	}<\/script>");
        _printWin.document.writeln('<style type="text/css">');
        _printWin.document.writeln("body {margin: 0px}.noprint{	display:none;}v\\:* {BEHAVIOR: url(#default#VML)}");
        _printWin.document.writeln("</style>");
        _printWin.document.writeln('<LINK rel=stylesheet type=text/css href="' + EzServerClient.GlobeParams.EzServerClientURL + '/css/print.css"');
        _printWin.document.writeln("</head>");
        _printWin.document.writeln('<body style="width:' + b + "px;height:" + a + 'px">');
        if (m) {
            _printWin.document.writeln('<input class=printtitle name="printtitle" id="printtitle" type="text" value="' + j + '">')
        }
        _printWin.document.writeln('<div id="EzMaps_Container"  class="printmap" style="overflow:hidden;width:' + b + "px;height:" + a + 'px;">');
        _printWin.document.writeln(this.map.container.innerHTML);
        if (arguments[3]) {
            _printWin.document.writeln(arguments[3])
        }
        _printWin.document.writeln("</div>");
        if (m) {
            _printWin.document.writeln('<input class=printbottom name="printbottom" id="printbottom" type="text" value="' + n + '">')
        }
        _printWin.document.writeln("</body>");
        _printWin.document.writeln("</html>");
        if (m) {
            _printWin.document.charset = "GB2312";
            _printWin.document.createStyleSheet(m)
        }
        for (var g = 0; g < _printWin.document.images.length; g++) {
            var f = _printWin.document.images[g];
            var l = f.width;
            var d = f.height;
            var k = f.src.toUpperCase();
            if (k.substring(k.length - 3, k.length) == "PNG") {
                f.style.filter += "progid:DXImageTransform.Microsoft.AlphaImageLoader(src=" + f.src + ", sizingmethod=scale);";
                f.src = "images/transparent.gif";
                f.width = l;
                f.height = d
            }
        }
        _printWin.document.execCommand("Refresh");
        _printWin.focus()
    }
};
MapsApp.prototype.printMapBaseExtent = function(f, e, x, i, l) {
    var r = f.minX;
    var q = f.minY;
    var B = f.maxX;
    var A = f.maxY;
    var t = this.map.realZoomLevel + this.map.zoomOffset;
    var y = this.map.baseLayer.toTileCoords(new EzServerClient.MapPositionZ(r, q, t));
    var j = this.map.baseLayer.toTileCoords(new EzServerClient.MapPositionZ(B, A, t));
    var n = this.map.baseLayer.convertMap2Bitmap(r, q, t);
    var h = this.map.baseLayer.convertMap2Bitmap(B, A, t);
    var d = Math.round(h.x - n.x);
    var c = Math.round(h.y - n.y);
    var a = this.map.baseLayer.toMapCoords2(new EzServerClient.TilePositionZ(y.col, j.row, t));
    var k = this.map.baseLayer.convertMap2Bitmap(a.minx, a.maxy, t);
    var p = Math.round(k.x - n.x);
    var o = Math.round(h.y - k.y - this.map.baseLayer.tileInfo.height);
    var k = this.map.baseLayer.convertMap2Bitmap(a.minx, a.maxy, t);
    var w = this.map.baseLayer.tileInfo.width * (this.map.topLeftTile.x - y.col) + p - this.map.groupTileImages[0][0][0].offsetLeft;
    var u = this.map.baseLayer.tileInfo.height * (j.row - this.map.topLeftTile.y + 1) + o - this.map.groupTileImages[0][0][0].offsetTop;
    var v = d;
    var z = c + 60;
    var m = "width=" + (v + 18) + "px,height=" + (z + 32) + "px,menubar=yes,scrollbars=yes,resizable=no,location=no, status=no";
    var b = window.open("", "default", m);
    if (!e) {
        e = ""
    }
    if (!x) {
        x = ""
    }
    if (b != null) {
        b.document.writeln("<html xmlns:v = 'urn:schemeas-microsoft-com:vml'><head>");
        b.document.writeln('<meta http-equiv="content-type" content="text/html; charset=GBK"/>');
        b.document.writeln("<title></title>");
        b.document.writeln("<script>window.onbeforeunload=function(){opener.printWin=null;	}<\/script>");
        b.document.writeln('<style type="text/css">');
        b.document.writeln("body {margin: 0px}.noprint{	display:none;}v\\:* {BEHAVIOR: url(#default#VML)}");
        b.document.writeln("</style>");
        b.document.writeln('<link rel=stylesheet type=text/css href="' + EzServerClient.GlobeParams.EzServerClientURL + '/css/print.css"/>');
        b.document.writeln("<script type=text/javascript>");
        b.document.writeln("var isIE = (document.all) ? true : false;");
        b.document.writeln("");
        b.document.writeln("var $ = function (id) {");
        b.document.writeln('	return "string" == typeof id ? document.getElementById(id) : id;');
        b.document.writeln("};");
        b.document.writeln("");
        b.document.writeln("var Class = {");
        b.document.writeln("	create: function() {");
        b.document.writeln("		return function() { this.initialize.apply(this, arguments); }");
        b.document.writeln("	}");
        b.document.writeln("}");
        b.document.writeln("");
        b.document.writeln("var Extend = function(destination, source) {");
        b.document.writeln("	for (var property in source) {");
        b.document.writeln("		destination[property] = source[property];");
        b.document.writeln("	}");
        b.document.writeln("}");
        b.document.writeln("");
        b.document.writeln("var Bind = function(object, fun) {");
        b.document.writeln("	return function() {");
        b.document.writeln("		return fun.apply(object, arguments);");
        b.document.writeln("	}");
        b.document.writeln("}");
        b.document.writeln("");
        b.document.writeln("var BindAsEventListener = function(object, fun) {");
        b.document.writeln("	return function(event) {");
        b.document.writeln("		return fun.call(object, (event || window.event));");
        b.document.writeln("	}");
        b.document.writeln("}");
        b.document.writeln("");
        b.document.writeln("function addEventHandler(oTarget, sEventType, fnHandler) {");
        b.document.writeln("	if (oTarget.addEventListener) {");
        b.document.writeln("		oTarget.addEventListener(sEventType, fnHandler, false);");
        b.document.writeln("	} else if (oTarget.attachEvent) {");
        b.document.writeln('		oTarget.attachEvent("on" + sEventType, fnHandler);');
        b.document.writeln("	} else {");
        b.document.writeln('		oTarget["on" + sEventType] = fnHandler;');
        b.document.writeln("	}");
        b.document.writeln("};");
        b.document.writeln("");
        b.document.writeln("function removeEventHandler(oTarget, sEventType, fnHandler) {");
        b.document.writeln("    if (oTarget.removeEventListener) {");
        b.document.writeln("        oTarget.removeEventListener(sEventType, fnHandler, false);");
        b.document.writeln("    } else if (oTarget.detachEvent) {");
        b.document.writeln('        oTarget.detachEvent("on" + sEventType, fnHandler);');
        b.document.writeln("    } else { ");
        b.document.writeln('        oTarget["on" + sEventType] = null;');
        b.document.writeln("    }");
        b.document.writeln("};");
        b.document.writeln("");
        b.document.writeln("//拖放程序");
        b.document.writeln("var SimpleDrag = Class.create();");
        b.document.writeln("SimpleDrag.prototype = {");
        b.document.writeln("  //拖放对象,触发对象");
        b.document.writeln("  initialize: function(drag) {");
        b.document.writeln("	this.Drag = $(drag);");
        b.document.writeln("	this._x = this._y = 0;");
        b.document.writeln("	this._fM = BindAsEventListener(this, this.Move);");
        b.document.writeln("	this._fS = Bind(this, this.Stop);");
        b.document.writeln("	this._fStart = BindAsEventListener(this, this.Start);");
        b.document.writeln('	this.Drag.style.position = "absolute";');
        b.document.writeln('	addEventHandler(this.Drag, "mousedown", this._fStart);');
        b.document.writeln("  },");
        b.document.writeln("  //准备拖动");
        b.document.writeln("  Start: function(oEvent) {");
        b.document.writeln("	this._x = oEvent.clientX - this.Drag.offsetLeft;");
        b.document.writeln("	this._y = oEvent.clientY - this.Drag.offsetTop;");
        b.document.writeln('	addEventHandler(document, "mousemove", this._fM);');
        b.document.writeln('	addEventHandler(document, "mouseup", this._fS);');
        b.document.writeln("  },");
        b.document.writeln("  //拖动");
        b.document.writeln("  Move: function(oEvent) {");
        b.document.writeln('	this.Drag.style.left = oEvent.clientX - this._x + "px";');
        b.document.writeln('	this.Drag.style.top = oEvent.clientY - this._y + "px";');
        b.document.writeln("  },");
        b.document.writeln("  //停止拖动");
        b.document.writeln("  Stop: function() {");
        b.document.writeln('	removeEventHandler(document, "mousemove", this._fM);');
        b.document.writeln('	removeEventHandler(document, "mouseup", this._fS);');
        b.document.writeln("  }");
        b.document.writeln("};");
        b.document.writeln('function load(){new SimpleDrag("title");new SimpleDrag("printmap");new SimpleDrag("bottom");if(document.getElementById("legend")){new SimpleDrag("legend");};if(document.getElementById("compass")){new SimpleDrag("compass");}}<\/script>');
        b.document.writeln("<\/script>");
        b.document.writeln("</head>");
        b.document.writeln('<body onload="load()">');
        b.document.writeln('<div id="title" style="width:100%;z-index:1"><input class=printtitle name="printtitle" id="printtitle" type="text" value="' + e + '"/></div>');
        b.document.writeln('<div id="prmap" style="z-index:0;width:' + v + "px;height:" + z + 'px;">');
        b.document.writeln('<div id="printmap" class="printmap" style="position:absolute;top:50px;overflow:hidden;width:' + d + "px;height:" + c + 'px;">');
        b.document.writeln('<div style="position:absolute;left:' + p + ";top:" + o + 'px;">');
        b.document.writeln(this.getImgsContent(this.map.baseGroupLayer, this.map.realZoomLevel, this.map.zoomOffset, y.col, y.row, j.col, j.row));
        b.document.writeln("</div>");
        b.document.writeln('<div style="position:absolute;left:' + w + ";top:" + u + 'px;">');
        b.document.writeln(this.map.divPaint.innerHTML);
        b.document.writeln("</div>");
        b.document.writeln("</div>");
        b.document.writeln("</div>");
        if (i) {
            b.document.writeln('<div id="legend" style="position:absolute;left:10px;z-index:1;bottom:80px;"><img class="printlegend" src="' + i + '"/></div>')
        }
        if (l) {
            b.document.writeln('<div id="compass" style="position:absolute;left:10px;z-index:1;bottom:200px;"><img class="printcompass" src="' + l + '"/></div>')
        }
        b.document.writeln('<div id="bottom" style="position:absolute;width:30%;z-index:1;right:10px"><input class=printbottom name="printbottom" id="printbottom" type="text" value="' + x + '"></div>');
        b.document.writeln("</body>");
        b.document.writeln("</html>");
        var g = b.document.getElementById("printmap").offsetWidth;
        var s = b.document.getElementById("printmap").offsetHeight;
        b.document.execCommand("Refresh");
        b.focus();
        return MapsApp.getMinPaperDescription(g, s)
    }
    return {error: "未知纸张或者纸张类型出错"}
};
MapsApp.prototype.getImgsContent = function(p, h, r, c, b, e, d) {
    var s = "";
    var a = null;
    var o = p.getLayers();
    for (var g = 0; g < o.length; g++) {
        var q = 0;
        var f = 0;
        var n = o[g];
        for (var l = c; l <= e; l++) {
            for (var k = d; k >= b; k--) {
                s += "<img style='position:absolute;left:" + f + "px;top:" + q + "px' src='" + n.getTileUrl(a, l, k, h, r) + "'/>";
                q += 256
            }
            f += 256;
            q = 0;
            s += "</br>"
        }
    }
    return s
};
MapsApp.getMinPaperDescription = function(d, b) {
    var a = {crosswise: {},lengthways: {}};
    d = d / window.screen.deviceXDPI * 25.4;
    b = b / window.screen.deviceYDPI * 25.4;
    for (var c = 0; c < MapsApp.paperSize.length; c++) {
        var e = MapsApp.paperSize[c];
        if (e.width > d && e.height > b) {
            a.lengthways = e;
            break
        }
    }
    for (var c = 0; c < MapsApp.paperSize.length; c++) {
        var e = MapsApp.paperSize[c];
        if (e.width > b && e.height > d) {
            a.crosswise = e;
            break
        }
    }
    return a
};
MapsApp.paperSize = [{height: 144,width: 105,paperStandardName: "A6"}, {height: 210,width: 148,paperStandardName: "A5"}, {height: 297,width: 210,paperStandardName: "A4"}, {height: 420,width: 297,paperStandardName: "A3"}, {height: 594,width: 420,paperStandardName: "A2"}, {height: 841,width: 594,paperStandardName: "A1"}, {height: 1189,width: 841,paperStandardName: "A0"}];
MapsApp.prototype.print = MapsApp.prototype.printMap;
MapsApp.prototype.printMapExt = function() {
    if (_printWin != null) {
        try {
            _printWin.close()
        } catch (b) {
        }
    }
    var a = "width=" + this.map.viewSize.width + ",height=" + this.map.viewSize.height;
    a = a + ",menubar=yes,scrollbars=no,resizable=no,location=no, status=no";
    _printWin = window.open("printMap.htm", "placeholder", a);
    _printWin.focus()
};
MapsApp.prototype.saveMap = function() {
    if (_printWin != null) {
        try {
            _printWin.close()
        } catch (f) {
        }
    }
    var c = "width=" + this.map.viewSize.width + ",height=" + this.map.viewSize.height;
    c = c + ",menubar=yes,scrollbars=no,resizable=no,location=no, status=no";
    _printWin = window.open("", "placeholder", c);
    var g = this.getBoundsLatLng();
    var a = this.getZoomLevel() + _ZoomOffset;
    var d = _VectorMapService[1][0] + "/EzMap?Service=getRectImg&minx=" + g.minX + "&miny=" + g.minY + "&maxx=" + g.maxX + "&maxy=" + g.maxY + "&zoom=" + a;
    var b = "<html><head><title>保存地图</title></head><body><img src='" + d + "' style='width:100%;height:100%'></body></html>";
    _printWin.document.write(b);
    _printWin.focus()
};
MapsApp.prototype.downloadMap = function(j, i, f, d, a, g) {
    try {
        if (!EzServerClient.GlobeFunction.isTypeRight(j, "float")) {
            throw EzErrorFactory.createError("EzMap::downloadMap方法中arguments[0]类型不正确")
        }
        if (!EzServerClient.GlobeFunction.isTypeRight(i, "float")) {
            throw EzErrorFactory.createError("EzMap::downloadMap方法中arguments[1]类型不正确")
        }
        if (!EzServerClient.GlobeFunction.isTypeRight(f, "float")) {
            throw EzErrorFactory.createError("EzMap::downloadMap方法中arguments[2]类型不正确")
        }
        if (!EzServerClient.GlobeFunction.isTypeRight(d, "float")) {
            throw EzErrorFactory.createError("EzMap::downloadMap方法中arguments[3]类型不正确")
        }
        if (_printWin != null) {
            _printWin.close()
        }
        var l = this.getBoundsLatLng();
        if (!j) {
            j = l.minX
        }
        if (!i) {
            i = l.minY
        }
        if (!f) {
            f = l.maxX
        }
        if (!d) {
            d = l.maxY
        }
        g = g || "image";
        var h = this.map.baseLayer.url;
        if (typeof a == "undefined") {
            var a = this.getZoomLevel()
        }
        switch (EzServerClient.GlobeParams.ZoomLevelSequence) {
            case 0:
            case 2:
                a = a + _ZoomOffset;
                break;
            case 1:
            case 3:
                a = EzServerClient.GlobeParams.MapMaxLevel - a + _ZoomOffset;
                break
        }
        var b = "width=" + this.map.viewSize.width + ",height=" + this.map.viewSize.height;
        b = b + ",menubar=yes,scrollbars=no,resizable=no,location=no, status=no";
        var k = h + "/EzMap?Service=getRectImg&result=" + g + "&minx=" + j + "&miny=" + i + "&maxx=" + f + "&maxy=" + d + "&zoom=" + a;
        //window.open(k)
        window.external.OnDownloadMapCallBack(k);

    } catch (c) {
        throw EzErrorFactory.createError("EzMap::downloadMap方法执行不正确", c)
    }
};
MapsApp.prototype.gotoCenter = function() {
    this.map.gotoCenter()
};
MapsApp.prototype.recenterOrPanToLatLng = function(a) {
    try {
        if (!EzServerClient.GlobeFunction.isTypeRight(a, "Point")) {
            throw EzErrorFactory.createError("EzMap::recenterOrPanToLatLng方法中argumnets[0]参数类型不是Point")
        }
        this.map.recenterOrPanToLatLng(a)
    } catch (b) {
        throw EzErrorFactory.createError("EzMap::recenterOrPanToLatLng方法执行不正确", b)
    }
};
MapsApp.prototype.getBoundsLatLng = function(a) {
    return this.map.getBoundsLatLng()
};
MapsApp.prototype.addMapChangeListener = function(a) {
    try {
        if (!EzServerClient.GlobeFunction.isTypeRight(a, "function")) {
            throw EzErrorFactory.createError("EzMap::addMapChangeListener方法中arguments[0]类型不正确")
        }
        this.map.addStateListener(a)
    } catch (b) {
        throw EzErrorFactory.createError("EzMap::addMapChangeListener方法执行不正确", b)
    }
};
MapsApp.prototype.removeMapChangeListener = function(d) {
    try {
        if (!EzServerClient.GlobeFunction.isTypeRight(d, "function")) {
            throw EzErrorFactory.createError("EzMap::removeMapChangeListener方法中arguments[0]类型不正确")
        }
        var g = this.map.stateListeners;
        if (g) {
            var a = [];
            for (var h = 0; h < g.length; h++) {
                if (g[h] != d) {
                    a.push(g[h])
                }
            }
            if (g.length != a.length) {
                this.map.stateListeners = a
            }
        }
    } catch (f) {
        throw EzErrorFactory.createError("EzMap::removeMapChangeListener方法执行不正确", f)
    }
};
MapsApp.prototype.addOverViewPanel = function(a) {
    var g = document.createElement("div");
    g.id = this.overViewPanelID;
    g.className = "noprint";
    g.style.backgroundColor = "white";
    g.style.borderTop = "  #979797 1px solid";
    g.style.borderLeft = "  #979797 1px solid";
    var c = 250;
    var f = 200;
    if (a) {
        c = a.width;
        f = a.height
    }
    g.style.height = convert2Px(f);
    g.style.width = convert2Px(c);
    g.style.right = convert2Px(16 - c);
    g.style.bottom = convert2Px(16 - f);
    g.style.zIndex = 10000;
    g.style.position = "absolute";
    this.overviewPanel = g;
    var d = document.createElement("div");
    d.id = this.overViewID;
    d.style.display = "";
    d.style.borderTop = "  #979797 1px solid";
    d.style.borderLeft = "  #979797 1px solid";
    d.style.position = "absolute";
    d.style.right = convert2Px(-1);
    d.style.bottom = convert2Px(-1);
    d.style.height = convert2Px(f - 5);
    d.style.width = convert2Px(c - 5);
    d.style.cursor = "default";
    g.appendChild(d);
    var b = document.createElement("img");
    b.src = EzServerClient.GlobeParams.SlipInImg;
    b.style.position = "absolute";
    b.style.left = convert2Px(0);
    b.style.top = convert2Px(0);
    var e = this;
    b.onclick = function() {
        var arr1 = b.src.split('/');
        var arr2 = EzServerClient.GlobeParams.SlipInImg.split('/');
        if (arr1[arr1.length -1] === arr2[arr2.length -1]) {
            b.src = EzServerClient.GlobeParams.SlipOutImg;
            EzServerClient.GlobeParams.OverViewFlag = 0;
            EzServerClient.GlobeFunction.SlipOut(e, g, 15);
            g.overViewIsOpen = true
        } else {
            b.src = EzServerClient.GlobeParams.SlipInImg;
            EzServerClient.GlobeParams.OverViewFlag = 1;
            EzServerClient.GlobeFunction.SlipIn(e, g, 15, 16 - c, 16 - f);
            g.overViewIsOpen = false
        }
    };
    g.appendChild(b);
    this.overviewPanel.slipImg = b;
    this.mapContainer.appendChild(g);
    return d
};
MapsApp.prototype.addOverView = function(b) {
    try {
        if (!EzServerClient.GlobeFunction.isTypeRight(b, "OverView")) {
            throw EzErrorFactory.createError("EzMap::addOverView方法中参数arguments[0]的类型不是OverView类")
        }
        this.overViewConf = b;
        var f = document.getElementById(this.overViewID);
        if (f) {
            return
        } else {
            f = this.addOverViewPanel(this.overViewConf)
        }
        this.overViewMap = new MainFrame(f, null, null, null, false, false, null, null, this, {baseGroupLayer: this.baseGroupLayer,groupLayers: this.groupLayers,mapCenter: this.mapCenter,mapInitLevel: this.mapInitLevel,zoomOffset: this.zoomOffset,mapMaxLevel: this.mapMaxLevel,isOverView: true});
        this.map.name = _mapName;
        this.overViewMap.name = "鹰眼";
        var a = this;
        var c = EzEvent.addEventListener(this.map, EzEvent.MAP_SWITCHMAPSERVER, function(g) {
            a.overViewMap.baseGroupLayer = a.groupLayers[g.mapServerIndex];
            a.overViewMap.setMapSource(a.overViewMap.baseGroupLayer)
        });
        window.updateOverview = function() {
            var i = a.getZoomLevel();
            switch (EzServerClient.GlobeParams.ZoomLevelSequence) {
                case 0:
                case 3:
                    i = Math.min(i + 4, _MaxLevel, a.overViewConf.maxLevel);
                    i = Math.max(a.overViewConf.minLevel, i);
                    break;
                case 1:
                case 2:
                    i = Math.max(i - 4, a.overViewConf.minLevel);
                    i = Math.min(a.overViewConf.maxLevel, i);
                    break
            }
            a.overViewMap.zoomTo(i);
            var h = a.map.getCenterLatLng();
            a.overViewMap.recenterOrPanToLatLng(h);
            a.overViewMap.clearOverlays();
            var m = a.map.getBoundsLatLng();
            var g = a.overViewMap.getBoundsLatLng();
            if (!m.containsBounds(g)) {
                var e = m.toString();
                if (a.overViewMap.pRectangle) {
                    delete a.overViewMap.pRectangle;
                    delete a.OverviewDragObject
                }
                var l = new Rectangle(e, "#ff0000", 2, 0.3, "#0000ff");
                a.overViewMap.addOverlay(l);
                var k = parseInt(l.div.style.left);
                var j = parseInt(l.div.style.top);
                a.OverviewRect = l;
                a.OverviewDragObject = new DragEvent(l.div, k, j, a.overViewMap.container);
                a.OverviewDragObject.ondragend = function() {
                    var r = parseInt(a.OverviewRect.div.style.left);
                    var q = parseInt(a.OverviewRect.div.style.top);
                    var p = parseInt(a.OverviewRect.div.style.width);
                    var s = parseInt(a.OverviewRect.div.style.height);
                    var n = r + p / 2;
                    var t = q + s / 2;
                    var o = a.overViewMap.convert2LonLat(n, t);
                    a.map.recenterOrPanToLatLng(o)
                };
                a.overViewMap.pRectangle = l
            }
        };
        this.overViewMap.onDragEnd = function() {
            var e = a.overViewMap.getCenterLatLng();
            a.map.recenterOrPanToLatLng(e)
        };
        this.map.addStateListener(updateOverview);
        updateOverview()
    } catch (d) {
        throw EzErrorFactory.createError("EzMap::addOverView方法执行不正确", d)
    }
};

MapsApp.prototype.removeOverview = function(){
    if(this.overviewPanel)
        this.mapContainer.removeChild(this.overviewPanel);
};

MapsApp.prototype.setCopyright = function(info) {
    this.map.setCopyright(info)
};

MapsApp.prototype.hideCopyright = function() {
    this.map.hideCopyright()
};
MapsApp.prototype.showCopyright = function() {
    this.map.showCopyright()
};
MapsApp.prototype.hideMapServer = function() {
    this.map.hideMapServer()
};
MapsApp.prototype.showMapServer = function() {
    this.map.showMapServer()
};
MapsApp.prototype.hideMapScale = function() {
    this.map.hideMapScale()
};
MapsApp.prototype.showMapScale = function() {
    this.map.showMapScale()
};
MapsApp.prototype.showOverView = function() {
    if (!this.overviewPanel.overViewIsOpen) {
        this.overviewPanel.slipImg.click()
    }
};
MapsApp.prototype.hideOverView = function() {
    if (this.overviewPanel.overViewIsOpen) {
        this.overviewPanel.slipImg.click()
    }
};
MapsApp.prototype.reverseOverView = function() {
    this.overviewPanel.slipImg.click()
};
MapsApp.prototype.about = function() {
    this.map.about()
};
MapsApp.prototype.getMeter = function(a, c) {
    try {
        if (!EzServerClient.GlobeFunction.isTypeRight(a, "Point")) {
            throw EzErrorFactory.createError("EzMap::getMeter方法中arguments[0]类型不正确")
        }
        if (!EzServerClient.GlobeFunction.isTypeRight(c, "float")) {
            throw EzErrorFactory.createError("EzMap::getMeter方法中arguments[1]类型不正确")
        }
        return MapsApp.getMeter(a, c)
    } catch (b) {
        throw EzErrorFactory.createError("EzMap::getMeter方法执行不正确", b)
    }
};
MapsApp.prototype.getDegree = function(a, b) {
    try {
        if (!EzServerClient.GlobeFunction.isTypeRight(a, "Point")) {
            throw EzErrorFactory.createError("EzMap::getDegree方法中arguments[0]类型不正确")
        }
        if (!EzServerClient.GlobeFunction.isTypeRight(b, "float") && !EzServerClient.GlobeFunction.isTypeRight(b, "string")) {
            throw EzErrorFactory.createError("EzMap::getDegree方法中arguments[1]类型不正确")
        }
        return MapsApp.getDegree(a, b)
    } catch (c) {
        throw EzErrorFactory.createError("EzMap::getDegree方法执行不正确", c)
    }
};
MapsApp.prototype.switchMapServer = function(a) {
    try {
        if (!EzServerClient.GlobeFunction.isTypeRight(a, "int")) {
            throw EzErrorFactory.createError("EzMap::switchMapServer方法中arguments[0]类型不正确")
        }

        if (a < this.map.mapServer.length) {
            this.map.mapServer[this.map.mapServer.length - a - 1].click()
        }
    } catch (b) {
        throw EzErrorFactory.createError("EzMap::switchMapServer方法执行不正确", b)
    }
};
MapsApp.prototype.showStandMapControl = function() {
    this.map.showStandMapControl()
};
MapsApp.prototype.showSmallMapControl = function() {
    this.map.showSmallMapControl()
};
MapsApp.prototype.addControl = function(a) {
    this.map.addControl(a)
};
MapsApp.prototype.getVersionInfo = function() {
    return EzServerClient.GlobeParams.VersionInfo.join(",")
};
MapsApp.prototype.showVersion = function(a) {
    try {
        if (!EzServerClient.GlobeFunction.isTypeRight(a, "string")) {
            throw EzErrorFactory.createError("EzMap::showVersion方法中arguments[0]类型不正确")
        }
        this.map.showVersion(a)
    } catch (b) {
        throw EzErrorFactory.createError("EzMap::showVersion方法执行不正确", b)
    }
};
MapsApp.prototype.editOverlay = function() {
    this.initMenu()
};
MapsApp.prototype.initMenu = function() {
    if (!this.menuContainer) {
        this.menuContainer = createDiv("");
        this.menuContainer.className = "contextmenu";
        this.map.container.appendChild(this.menuContainer);
        BindingEvent(this.map.container, "click", this.eventHandler("hideMenu"))
    }
};
MapsApp.prototype.centerAtMouse = function() {
    if (typeof this.mousePoint != "undefined") {
        this.map.centerAtLatLng(this.mousePoint)
    }
};
MapsApp.prototype.showMenu = function() {
    this.mousePoint = new Point(this.map.mouseLng, this.map.mouseLat);
    this.initMenu();
    this.menuContainer.innerHTML = "";
    var mHeight = 20, mWidth = 100;
    var nlens = 0;
    for (var i = 0; i < g_menu.length; i++) {
        var pDiv = document.createElement("div");
        this.menuContainer.appendChild(pDiv);
        var pObj = g_menu[i];
        if (pObj == null) {
            pDiv.className = "divider";
            continue
        }
        pDiv.style.width = mWidth + "px";
        pDiv.innerHTML = pObj.name;
        pDiv.className = "menuitem";
        pDiv.func = pObj.func;
        pDiv.onmouseover = function() {
            this.className = "menuitem selectedmenuitem"
        };
        pDiv.onmouseout = function() {
            this.className = "menuitem"
        };
        pDiv.onclick = function() {
            eval(this.func)
        }
    }
    this.menuContainer.style.display = "";
    var uPoint = this.mapCoord2container(new Point(this.getMouseMapX(), this.getMouseMapY()));
    this.menuContainer.style.pixelTop = uPoint.y;
    this.menuContainer.style.pixelLeft = uPoint.x;
    return false
};
MapsApp.prototype.getCurrentEditor = function() {
    return g_current_editor
};
MapsApp.prototype.hideMenu = function() {
    this.menuContainer.style.display = "none";
    var a = ObjectOffset(this.map.container);
    this.menuContainer.style.pixelTop = event.clientY - a.y;
    this.menuContainer.style.pixelLeft = event.clientX - a.x;
    return false
};
MapsApp.prototype.getMouseMapX = function() {
    return this.map.getMouseMapX()
};
MapsApp.prototype.getMouseMapY = function() {
    return this.map.getMouseMapY()
};
MapsApp.prototype.containerCoord2Map = function(a) {
    try {
        if (!EzServerClient.GlobeFunction.isTypeRight(a, "Point")) {
            throw EzErrorFactory.createError("EzMap::containerCoord2Map方法中arguments[0]类型不正确")
        }
        return this.map.containerCoord2Map(a)
    } catch (b) {
        throw EzErrorFactory.createError("EzMap::containerCoord2Map方法执行不正确", b)
    }
};
MapsApp.prototype.mapCoord2Container = function(a) {
    try {
        if (!EzServerClient.GlobeFunction.isTypeRight(a, "Point")) {
            throw EzErrorFactory.createError("EzMap::mapCoord2container方法中arguments[0]类型不正确")
        }
        return this.map.mapCoord2container(a)
    } catch (b) {
        throw EzErrorFactory.createError("EzMap::mapCoord2container方法执行不正确", b)
    }
};
MapsApp.prototype.mapCoord2container = MapsApp.prototype.mapCoord2Container;
MapsApp.prototype.getMapContainer = function() {
    return this.mapContainer
};
MapsApp.prototype.getCurrentMapScale = function() {
    return this.map.currentMapScale
};
MapsApp.prototype.closeInfoWindow = function() {
    this.map.closeInfoWindow()
};
MapsApp.prototype.clearMapChangeListener = function() {
    this.map.clearStateChanged()
};
MapsApp.prototype.printGPS = function(a) {
    this.beforePrintMap(a)
};
MapsApp.prototype.addMapEventListener = function(a, b) {
    return EzEvent.addEventListener(this.map, a, b)
};
MapsApp.prototype.removeMapEventListener = function(a) {
    if(typeof a === "string"){
        EzEvent.removeEventListener(a, this.map)
    }else{
        EzEvent.removeEventListener(a)
    }
};
MapsApp.prototype.clearMapInstanceEventListeners = function(a) {
    EzEvent.clearInstanceEventListeners(this.map, a)
};
MapsApp.prototype.clearMapEventListeners = function() {
    EzEvent.clearEventListeners(this.map)
};
MapsApp.prototype.getQueryResults2 = function() {
    return this.queryResults2
};
MapsApp.prototype.enableDblClick = function() {
    this.enableDblClick()
};
MapsApp.prototype.disableDblClick = function() {
    this.disableDblClick()
};

MapsApp.prototype.enableDblClickZoom = function(){
     this.map.enableDblClickZoom();
};

MapsApp.prototype.disableDblClickZoom = function(){
    this.map.disableDblClickZoom();
};

MapsApp.prototype.setCompatibility = function() {
    if (EzServerClient.GlobeParams.MapSrcURL) {
        return {mapCenter: _MapCenter,mapFullExtent: EzServerClient.GlobeParams.MapFullExtent,mapInitLevel: EzServerClient.GlobeParams.MapInitLevel,mapMaxLevel: EzServerClient.GlobeParams.MapMaxLevel,zoomOffset: EzServerClient.GlobeParams.ZoomOffset,copyRight: EzServerClient.GlobeParams.Copyright,dynamicCopyright: EzServerClient.GlobeParams.DynamicCopyright}
    }
};
MapsApp.prototype.addGroupLayer = function(b) {
    var c = b.getLayers();
    for (var a = 0; a < c.length; a++) {
        if (this.zoomOffset) {
            c[a].setOffset(this.zoomOffset)
        }
    }
    this.groupLayers.push(b);
    if (!this.baseGroupLayer) {
        this.baseGroupLayer = b
    }
    if (this.map) {
        this.map.showMapServerControl()
    }
};
MapsApp.prototype.removeGroupLayer = function(a) {
    this.groupLayers.splice(a, 1)
};
MapsApp.prototype.addGroupLayers = function(a) {
    for (var b = 0; b < a.length; b++) {
        this.addGroupLayer(a[b])
    }
};
MapsApp.prototype.addOverLayer = function(a) {
};
MapsApp.prototype.setMapOptions = function(a) {
    if (a.copyRight) {
        this.copyRight = a.copyRight;
        EzServerClient.GlobeParams.Copyright = this.copyRight;
        _mCopyright = this.copyRight
    }
    if (a.dynamicCopyright) {
        this.dynamicCopyright = a.dynamicCopyright;
        EzServerClient.GlobeParams.DynamicCopyright = this.dynamicCopyright
    }
    if (a.mapCenter) {
        this.mapCenter.x = a.mapCenter[0];
        this.mapCenter.y = a.mapCenter[1];
        _MapCenterPoint = this.mapCenter;
        _MapCenter = a.mapCenter
    }
    if (a.mapFullExtent) {
        this.mapFullExtent.minX = a.mapFullExtent[0];
        this.mapFullExtent.minY = a.mapFullExtent[1];
        this.mapFullExtent.maxX = a.mapFullExtent[2];
        this.mapFullExtent.maxY = a.mapFullExtent[3];
        EzServerClient.GlobeParams.MapFullExtent = a.mapFullExtent;
        _FullExtentMBR = a.mapFullExtent
    }
    if (a.mapInitLevel == 0 || a.mapInitLevel) {
        this.mapInitLevel = a.mapInitLevel;
        EzServerClient.GlobeParams.MapInitLevel = this.mapInitLevel;
        _InitLevel = this.mapInitLevel
    }
    if (a.mapMaxLevel) {
        this.mapMaxLevel = a.mapMaxLevel;
        _MaxLevel = this.mapMaxLevel;
        EzServerClient.GlobeParams.MapMaxLevel = this.mapMaxLevel
    }
    if (a.zoomOffset) {
        this.zoomOffset = a.zoomOffset;
        _ZoomOffset = this.zoomOffset;
        EzServerClient.GlobeParams.ZoomOffset = this.zoomOffset
    }
    if (a.ezMapServiceURL) {
        this.ezMapServiceURL = a.ezMapServiceURL;
        EzServerClient.GlobeParams.EzMapServiceURL = this.ezMapServiceURL;
        m_MapServer = this.ezMapServiceURL
    }
    if (a.ezGeoPSURL) {
        this.ezGeoPSURL = a.ezGeoPSURL;
        if (!EzServerClient.GlobeParams.EzGeoPSURL) {
            EzServerClient.GlobeParams.EzGeoPSURL = this.ezGeoPSURL;
            document.writeln("<script type='text/javascript' charset='GB2312' src='" + EzServerClient.GlobeParams.EzGeoPSURL + "/ezgeops_js/EzGeoPS.js'><\/script>")
        }
    }
};
MapsApp.prototype.setMapCenter = function(a) {
    this.mapCenter = a
};
MapsApp.prototype.setFullExtent = function(a) {
    this.mapFullExtent = a
};
MapsApp.prototype.setInitZoomLevel = function(a) {
    this.mapInitLevel = a
};
MapsApp.prototype.setMaxLevel = function(a) {
    this.mapMaxLevel = a
};
MapsApp.prototype.setZoomOffset = function(a) {
    this.zoomOffset = a
};
MapsApp.prototype.setEzMapServiceURL = function(a) {
    if (a) {
        this.ezMapServiceURL = mapOptions.ezMapServiceURL;
        EzServerClient.GlobeParams.EzMapServiceURL = this.ezMapServiceURL;
        m_MapServer = this.ezMapServiceURL
    }
};
MapsApp.prototype.setProxyOfEzMapService = function(a) {
    if (a) {
        g_prox_calss = a;
        MapsApp.proxyURL2EzMapService = a
    }
};
MapsApp.prototype.setEzGeoPSURL = function(a) {
    if (a) {
        this.ezMapServiceURL = mapOptions.ezMapServiceURL;
        EzServerClient.GlobeParams.EzMapServiceURL = this.ezMapServiceURL;
        m_MapServer = this.ezMapServiceURL
    }
};
MapsApp.prototype.addHotspotContainer = function(a, c, d, b, e) {
    this.map.addHotspotContainer(a, c, d, b, e)
};
MapsApp.prototype.enableSlipPan = function (a) {
    this.map._slip = true;
    if (a) {
        this.map._coefficient = a;
    }
};
MapsApp.prototype.disableSlipPan = function () {
    this.map._slip = false;
};
MapsApp.prototype.slipPan = function(a, c) {
    try {
        if (a && !EzServerClient.GlobeFunction.isTypeRight(a, "float")) {
            throw EzErrorFactory.createError("EzMap::slipPan方法中arguments[0]类型不正确")
        }
        if (c && !EzServerClient.GlobeFunction.isTypeRight(c, "float")) {
            throw EzErrorFactory.createError("EzMap::slipPan方法中arguments[1]类型不正确")
        }
        if (arguments.length == 0) {
            this.changeDragMode("pan")
        } else {
            if (arguments.length == 2) {
                this.map.slipPan(a, c)
            }
        }
    } catch (b) {
        throw EzErrorFactory.createError("EzMap::slipPan方法执行不正确", b)
    }
};
MapsApp.prototype.enableMouseZoom = function() {
    this.map._mouseZoom = true
};
MapsApp.prototype.disableMouseZoom = function() {
    this.map._mouseZoom = false
};
MapsApp.prototype.zoomAtPoint = function(b, a) {
    this.map.zoomAtPoint(b, a)
};
MapsApp.prototype.refresh = function() {
    this.map.initializeMap()
};

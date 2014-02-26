// 地图SVG
var qg = new Rect(0, 0);
var Ri = new Rect(0, 0);
var _TmrModeFlatZoom = null;
var gi = new Point(0, 0);
var we = new Point(0, 0);
var Jg = false;
var Pe = 0;
var __EzP = new Point(0, 0);
function MainFrame(b, g, d, c, j, f, h, i, e, l) {
    this.mapPeer = e;
    this.groupLayers = l.groupLayers;
    this.groupTileImages = [];
    this.baseGroupLayer = l.baseGroupLayer;
    this.layersContainer = [];
    this.baseLayer = this.baseGroupLayer.getLayers()[0];
    this.mapCenter = l.mapCenter;
    if (EzServerClient.GlobeParams.ZoomLevelSequence == 1 || EzServerClient.GlobeParams.ZoomLevelSequence == 3) {
        this.mapInitLevel = l.mapMaxLevel - l.mapInitLevel
    } else {
        this.mapInitLevel = l.mapInitLevel
    }
    this.mapMaxLevel = l.mapMaxLevel;
    this.zoomOffset = l.zoomOffset;
    this.realZoomLevel = this.mapInitLevel;
    this.zoomLevel = this.mapInitLevel;
    this.mouseZoomLevel = this.realZoomLevel;
    this.ascendZoomLevel = EzServerClient.GlobeParams.MapMaxLevel - this.realZoomLevel;
    if (l.isOverView) {
        this.isOverView = true
    } else {
        this.isOverView = false
    }
    this.addtionalTileNum = 0;
    this.bInfoHasOpen = false;
    this.bInfoHasCloseClick = false;
    this.currentMapScale = "";
    this.bThematicOverlay = false;
    this.bThematicOverlayCP03 = false;
    this.curThematicURL = "";
    this.curThematicURLCP03 = "";
    this.strThematicXML = "";
    this.strThematicProxyURL = "";
    this.bIsStreamOrText = false;
    this.currentMapServerIndex = 0;
    this._slip = false;
    this._coefficient = 3;
    this._x = this._y = 0;
    this._start_x = this._start_y = 0;
    this._speed_x = this._speed_y = 0;
    this._start_t = 0;
    this._mouseZoom = false;
    this._mouseScroll = false;
    if (!b) {
        return
    }
    this.ownerDocument = b.ownerDocument || document;
    this.container = b;
    this.containOffset = ObjectOffset(this.container);
    this.container.style.backgroundColor = "white";
    this.container.unselectable = "on";
    this.container.style.overflow = "hidden";
    if (this.container.style.position != "absolute") {
        this.container.style.position = "relative"
    }
    if (!d || !c) {
        d = this.container.offsetWidth;
        c = this.container.offsetHeight
    }
    this.viewSize = new Rect(d, c);
    this.div = this.createMapDiv();
    if (EzServerClient.GlobeParams.VML) {
        document.namespaces.add("v", "urn:schemas-microsoft-com:vml");
        this.divPaint = document.createElement("div");
        this.div.appendChild(this.divPaint);
    } else {
        var svgContainer = document.createElement("div");
        svgContainer.style.position = 'absolute';
        svgContainer.style.zIndex = '80';
        svgContainer.style.width = '100%';
        svgContainer.style.height = '100%';
        this.div.appendChild(svgContainer);
        var mapSVGTag = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        mapSVGTag.setAttribute('id', 'mapSVGTag');
        mapSVGTag.setAttribute('width', d + "px");
        mapSVGTag.setAttribute('height', c + "px");
        mapSVGTag.setAttribute('vesion', '1.1');
        mapSVGTag.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        mapSVGTag.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
        mapSVGTag.setAttribute('xml:space', 'preserve');
        mapSVGTag.style.zIndex = "80";
        mapSVGTag.setAttribute("viewBox", "0,0," + d + "," + c);
        svgContainer.appendChild(mapSVGTag);

        //g 用以兼容谷歌、火狐等浏览器
        var g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        g.style.display = "block";
        mapSVGTag.appendChild(g);
        var g1 = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        g.appendChild(g1);
        this.divPaint = g1;
    }

    this.divPaint.style.zIndex = "80";

    this.container.appendChild(this.div);
    if (this.container.style.display == "" || this.container.style.display == "block") {
        this.initDisplay = true
    } else {
        this.container.style.display = "";
        this.initDisplay = false
    }

    this.bKeyboard = true;
    this.bDblClickZoom = false;

    this.bIsPaning = false;
    this.bIsMoving = false;
    this.bIsZooming = false;
    this.bIsDraging = false;
    this.bIsPlayRoute = false;
    this.bIsLog = false;
    this.disablePopups = j;
    this.disableDragging = f;
    this.mouseLng = 0;
    this.mouseLat = 0;
    this.iBorderWidth = 0;
    this.iBorderHeight = 0;
    this.currentPanOffset = new Rect(0, 0);
    this.tilePaddingOffset = new Rect(0, 0);
    this.tableSize = new Rect(0, 0);
    this.overlays = [];
    this.locations = [];
    this.curOverlay = null;
    this.monitorArray = [];
    this.mainMonitor = null;
    this.panDistance = new Rect(0, 0);
    this.panKeys = new Ic();
    this.stateMonitor = null;
    BindingEvent(window, "blur", this.eventHandler("onWindowBlur"));
    BindingEvent(this.container, "contextmenu", _NoAction);
    BindingEvent(document.body, "select", _NoAction);
    BindingEvent(this.div, "mousedown", this.eventHandler("onMapMouseDown"));
    BindingEvent(this.div, "mousemove", this.eventHandler("onMapMouseMove"));
    BindingEvent(this.div, "mouseover", this.eventHandler("onMapMouseOver"));
    BindingEvent(this.div, "mouseout", this.eventHandler("onMapMouseOut"));
    BindingEvent(this.div, "mouseup", this.eventHandler("onMapMouseUp"));
    if (!this.disablePopups) {
        this.infoWindow = new InfoWind(this.eventHandler("onInfoCloseClick"), this.div, 5000, 2000)
    }
    this.directionsDiv = document.createElement("div");
    this.directionsDiv.directionsBounds = new MBR(-_MaxNumber, -_MaxNumber, _MaxNumber, _MaxNumber);
    this.div.appendChild(this.directionsDiv);
    this.dragObject = new DragEvent(this.div, 0, 0);
    this.dragObject.ondrag = this.eventHandler("onDrag");
    this.dragObject.ondragstart = this.eventHandler("onDragStart");
    this.dragObject.ondragend = this.eventHandler("onDragEnd");
    this.dragObject.onclick = this.eventHandler("onClick");
    if (f) {
        this.dragObject.disable()
    }
    this.init(this.mapCenter.x, this.mapCenter.y, this.mapInitLevel);
    this.initializeMap();
    this.onzoom = null;
    this.onpan = null;
    this.onmousedown = null;
    this.onspecificationchange = null;
    this.oninfowindowclose = null;
    this.onresize = null;
    this.stateListeners = null;
    this.useRawVml = false;
    this.buttonTip = null;
    this.isZoomInExt = false;
    this.createMapCenter(this.container);
    this.createDrawPoint(this.container);
    if (!this.isOverView) {
        EzServerClient.GlobeParams.MapLoadCheckHandle = window.setInterval(EzServerClient.GlobeFunction.mapImgLoadEventFunc(this), 10);
        this.addEventDiv();
        this.displayCoord(window.event);
        EzEvent.mapPoint.x = this.mouseLng;
        EzEvent.mapPoint.y = this.mouseLat;
        EzEvent.screenPoint = this.mapCoord2container(EzEvent.mapPoint)
    }
}
MainFrame.prototype.enableDblClick = function () {
    BindingEvent(this.div, "dblclick", this.eventHandler("onDoubleClick"))
};
MainFrame.prototype.disableDblClick = function () {
    unbindingEvent(this.div, "dblclick", this.eventHandler("onDoubleClick"))
};
MainFrame.prototype.enableMouseScroll = function () {
    if (this._mouseScroll === true)
        return;

    BindingEvent(this.div, "mousewheel", this.eventHandler("_mousewheelHandle"));
    BindingEvent(this.div, "DOMMouseScroll", this.eventHandler("_DOMMouseScrollHandle"));
    this._mouseScroll = true;
};

MainFrame.prototype._mousewheelHandle = function (c) {
    if (this._mouseScroll === false)
        return;

    this.onMouseScroll(c);
    return false
};

MainFrame.prototype._DOMMouseScrollHandle = function (c) {
    if (this._mouseScroll === false)
        return;

    this.onMouseScroll(c);
    return false
};

MainFrame.prototype.disableMouseScroll = function () {
    if (this._mouseScroll === false)
        return;

    unbindingEvent(this.div, "mousewheel", this.eventHandler("_mousewheelHandle"));
    unbindingEvent(this.div, "DOMMouseScroll", this.eventHandler("_DOMMouseScrollHandle"));
    this._mouseScroll = false;
};

MainFrame.prototype.enableDblClickZoom = function () {
    this.bDblClickZoom = true;
};

MainFrame.prototype.disableDblClickZoom = function () {
    this.bDblClickZoom = false;
};

MainFrame.prototype.enableKeyboard = function () {
    this.bKeyboard = true;
};

MainFrame.prototype.disableKeyboard = function () {
    this.bKeyboard = false;
};

MainFrame.prototype.gotoCenter = function () {
    var b = _MapCenterPoint;
    this.centerAtLatLng(b)
};
MainFrame.prototype.fullExtent = function () {

    if (EzServerClient.GlobeParams.CenterPoint) {
        var pt = new Point(EzServerClient.GlobeParams.CenterPoint[0], EzServerClient.GlobeParams.CenterPoint[1]);
        this.centerAndZoom(pt, EzServerClient.GlobeParams.MapInitLevel);
    } else {
        this.centerAtMBR(_FullExtentMBR[0], _FullExtentMBR[1], _FullExtentMBR[2], _FullExtentMBR[3])
    }
};
MainFrame.prototype.init = function (b, j, c) {
    this.calculateTileMeasurements();
    this.centerLatLng = new Point(b, j);
    var i = new Point(0, 0);
    var m = b - this.baseLayer.tileInfo.origin[0];
    var l = j - this.baseLayer.tileInfo.origin[1];
    var d = this.baseLayer.convertPosByFlatMatrix(m, l);
    m = d.x;
    l = d.y;
    i.x = Math.floor(m / this.baseLayer.tileInfo.levelDetails[c].resolution);
    i.y = Math.floor(l / this.baseLayer.tileInfo.levelDetails[c].resolution);
    this.centerBitmap = new Point(i.x, i.y);
    var f = i.x - Math.floor(this.container.offsetWidth / 2) - this.tilePaddingOffset.width;
    var k = i.y + Math.floor(this.container.offsetHeight / 2) + this.tilePaddingOffset.height;
    var g = Math.floor(f / this.baseLayer.tileInfo.width);
    var h = Math.floor(k / this.baseLayer.tileInfo.height);
    var o = g * this.baseLayer.tileInfo.width - f;
    var n = h * this.baseLayer.tileInfo.height - k;
    if (o < -this.baseLayer.tileInfo.width) {
        g++;
        o += this.baseLayer.tileInfo.width
    } else {
        if (o > 0) {
            g--;
            o -= this.baseLayer.tileInfo.width
        }
    }
    n = -n;
    if (n < -this.baseLayer.tileInfo.height) {
        h--;
        n += this.baseLayer.tileInfo.height
    } else {
        if (n > 0) {
            h++;
            n -= this.baseLayer.tileInfo.height
        }
    }
    this.topLeftTile = new Point(g, h);
    this.dragObject.moveTo(o, n)
};
MainFrame.prototype.createMapCenter = function (b) {
    if (typeof _bIsMapCenter == "undefined" || _bIsMapCenter == false) {
        return
    }
    this.mapCenterDiv = document.createElement("img");
    b.appendChild(this.mapCenterDiv);
    this.mapCenterDiv.style.position = "absolute";
    this.mapCenterDiv.src = _MapCenterUrl;
    this.mapCenterDiv.style.left = convert2Px(this.viewSize.width / 2 - 8);
    this.mapCenterDiv.style.top = convert2Px(this.viewSize.height / 2 - 8);
    this.mapCenterDiv.style.zIndex = 850
};
MainFrame.prototype.displayCoord = function (f) {
    if (!f) {
        return
    }
    try {
        if (document.layers) {
            xCoord = f.x;
            yCoord = f.y
        } else {
            if (document.all) {
                xCoord = event.clientX;
                yCoord = event.clientY
            } else {
                if (document.getElementById) {
                    xCoord = f.clientX;
                    yCoord = f.clientY
                }
            }
        }
        xCoord = xCoord + window.document.body.scrollLeft - 1;
        yCoord = yCoord + window.document.body.scrollTop - 3;
        xCoord -= this.iBorderWidth;
        yCoord -= this.iBorderHeight;
        if (this.buttonTip != null) {
            this.buttonTip.style.top = yCoord + 10 + "px";
            this.buttonTip.style.left = xCoord + 10 + "px"
        }
        if (this.containOffset) {
            xCoord = xCoord - this.containOffset.x;
            yCoord = yCoord - this.containOffset.y
        }
        var d = this.getCenterLatLng();
        if (isNaN(this.realZoomLevel)) {
            return
        }
        var c = this.baseLayer.convertPosByFlatMatrix(d.x, d.y);
        d.x = c.x;
        d.y = c.y;
        this.mouseLng = d.x + (xCoord - this.viewSize.width / 2) * this.baseLayer.tileInfo.levelDetails[this.realZoomLevel].resolution;
        this.mouseLat = d.y - (yCoord - this.viewSize.height / 2) * this.baseLayer.tileInfo.levelDetails[this.realZoomLevel].resolution;
        var b = this.baseLayer.convertPosByFlatMatrixInverse(this.mouseLng, this.mouseLat);
        this.mouseLng = b.x;
        this.mouseLat = b.y;
        this.mouseLng = Math.floor(this.mouseLng * 100000) / 100000;
        this.mouseLat = Math.floor(this.mouseLat * 100000) / 100000;
        if (_VMLInMap) {
            this.mouseX = Math.floor(this.mouseLng * 100000);
            this.mouseY = Math.floor(this.mouseLat * 100000)
        } else {
            this.mouseX = xCoord;
            this.mouseY = yCoord
        }
        return d;
    } catch (f) {
        alert("错误信息:" + f.message)
    }
};
MainFrame.prototype.centerAtMouse = function () {
    this.centerAtLatLng(new Point(this.mouseLng, this.mouseLat))
};
MainFrame.prototype.initDebug = function () {
    if (!_Debug) {
        return
    }
    this.centerNaiv = document.createElement("img");
    this.container.appendChild(this.centerNaiv);
    this.centerNaiv.style.position = "absolute";
    this.centerNaiv.src = _MapDebugCenterUrl;
    this.centerNaiv.alt = "Center";
    this.mapBejingCenter = document.createElement("img");
    this.container.appendChild(this.mapBejingCenter);
    this.mapBejingCenter.style.position = "absolute";
    this.mapBejingCenter.src = _MapBeingCenterUrl;
    this.mapBejingCenter.style.width = 16;
    this.mapBejingCenter.style.height = 16
};
MainFrame.prototype.createMapDiv = function () {
    var b = document.createElement("div");
    b.style.position = "absolute";
    b.style.top = convert2Px(0);
    b.style.left = convert2Px(0);
    b.style.zIndex = 0;
    b.style.backgroundColor = "#f2efe9";
    b.style.zoom = 1;
    return b
};
MainFrame.prototype.loadTileImages = function () {
    var e = this.baseGroupLayer.getLayers();
    this.groupTileImages.clear();
    this.layersContainer.clear();
    var c = document.getElementById("hotspotLyr");
    if (c) {
        for (var b = 0; b < c.childNodes.length; b++) {
            var f = c.childNodes[b];
            f.innerHTML = ""
        }
    }
    for (var b = 0; b < e.length; b++) {
        if (e[b] instanceof EzServerClient.Layer.HotSpotTileLayer) {
            if (this.isOverView) {
                continue
            }
            var d = this.addLayerContainer(e[b], b);
            this.groupTileImages.push([[]]);
            this.addHotspotContainer(e[b], b);
            this.loadTileHotImagesLayer(this.groupTileImages[b], e[b], b, d)
        } else {
            var d = this.addLayerContainer(e[b], b);
            this.groupTileImages.push([[]]);
            this.loadTileImagesLayer(this.groupTileImages[b], e[b], b, d)
        }
    }
};
MainFrame.prototype.checkLevel = function (c, b) {
    if (b) {
        if ((typeof b == "object") && (b.constructor == Array) && (b.length > 1)) {
            if (c < Math.min(b[0], b[1]) || c > Math.max(b[0], b[1])) {
                return false
            }
        }
    }
    return true
};
MainFrame.prototype.getTileNum = function (b) {
    return { width: Math.ceil(this.viewSize.width / b.tileInfo.width) + 1 + this.addtionalTileNum, height: Math.ceil(this.viewSize.height / b.tileInfo.height) + 1 + this.addtionalTileNum }
};
MainFrame.prototype.loadTileImagesLayer = function (c, j, h, o) {
    var l = this.getTileNum(j);
    while (c.length > l.width) {
        var e = c.pop();
        for (var k = 0; k < e.length; k++) {
            this.removeTileImage(e[k])
        }
    }
    for (var k = c.length; k < l.width; k++) {
        c.push([])
    }
    for (var d = 0; d < c.length; d++) {
        while (c[d].length > l.height) {
            var i = c[d].pop();
            this.removeTileImage(i)
        }
        for (var b = c[d].length; b < l.height; b++) {
            var g = this.createTileMatrixCell(j, h > 0);
            c[d].push(g);
            o.appendChild(g);
            this.configureImage2(g, d, b, j)
        }
    }
};
MainFrame.prototype.loadTileHotImagesLayer = function (c, j, h, o) {
    var l = this.getTileNum(j);
    if (!this._tilePOIs) {
        this._tilePOIs = []
    }
    while (c.length > l.width) {
        var e = c.pop();
        for (var k = 0; k < e.length; k++) {
            this.removeTileImage(e[k])
        }
    }
    for (var k = c.length; k < l.width; k++) {
        c.push([])
    }
    for (var d = 0; d < c.length; d++) {
        while (c[d].length > l.height) {
            var i = c[d].pop();
            this.removeTileImage(i)
        }
        for (var b = c[d].length; b < l.height; b++) {
            var g = this.createTileMatrixCell2(j);
            c[d].push(g);
            if (j.hotspot2d) {
            } else {
                o.appendChild(g)
            }
            this.configureImage3(g, d, b, j)
        }
    }
};
MainFrame.prototype.addLayerContainer = function (d, b) {
    if (this.isOverView) {
        var c = document.createElement("div");
        c.style.position = "absolute";
        c.id = d.name;
        c.name = "overviewTilelayer";
        c.style.zIndex = b;
        this.div.appendChild(c);
        this.layersContainer.push(c);
        return c
    } else {
        d.div.style.zIndex = b;
        this.div.appendChild(d.div);
        this.layersContainer.push(d.div);
        return d.div
    }
};
MainFrame.prototype.configureImage2 = function (e, k, j, h) {
    var g = this;
    var d = (this.currentPanOffset.width + k) * h.tileInfo.width;
    var l = (this.currentPanOffset.height + j) * h.tileInfo.height;
    var c = -this.tilePaddingOffset.width + d;
    var i = -this.tilePaddingOffset.height + l;
    if (e.tileLeft != c || e.tileTop != i) {
        e.style.left = convert2Px(c);
        e.style.top = convert2Px(i);
        e.tileLeft = c;
        e.tileTop = i
    }
    if (!this.isLoaded()) {
        e.src = this.baseLayer.emptyTileUrl
    } else {
        var b = h.getTileUrl(this.topLeftTile, k, j, this.realZoomLevel, this.zoomOffset);
        if (e.src != b) {
            divCreator.setImage(e, b)
        }
    }
    if (typeof (e.galleryimg) == "undefined" || e.galleryimg != "no") {
        e.galleryimg = "no"
    }
};
MainFrame.prototype.configureImage3 = function (f, x, y, vLyr) {
    if (!this.checkLevel(this.realZoomLevel, vLyr.levelLimit)) {
        return
    }
    var peer = this;
    var strURL = vLyr.getTileUrl(this.topLeftTile, x, y, this.realZoomLevel, this.zoomOffset);
    EzServerClient.AsynAddScriptByAjax(strURL, function (e) {
        e = e.replace(/((\r\n)+)$/, "").replace(/\r\n/g, ",").replace(/(.\d+)$/, "");
        if (e == null || e == "") {
            return
        }
        eval("var hotspots=[" + e + "]");
        if (f.childNodes.length > hotspots.length) {
            for (var i = hotspots.length; i < f.childNodes.length; i++) {
                f.removeChild(f.childNodes[i])
            }
        } else {
            for (var i = f.childNodes.length; i < hotspots.length; i++) {
                var temp = document.createElement("area");
                temp.shape = "poly";
                temp.coords = "";
                temp.id = hotspots[i].ID;
                f.appendChild(temp)
            }
        }
        for (var i = 0; i < hotspots.length; i++) {
            var area = vLyr.hotspot2d ? f.childNodes[i] : vLyr.setAreaPorp(vLyr, vLyr.eventName, vLyr.callback, hotspots[i], peer, f.childNodes[i]);
            area._p = hotspots[i].GEOMETRY;
            area.coords = "";
            if (!area._p) {
                continue
            }
            var labelStr = vLyr.label;
            if (labelStr) {
                labelStr = labelStr.toUpperCase();
                var labels = [labelStr];
                var altStr = "";
                if (labelStr.indexOf(",") > 0) {
                    labels = labelStr.split(",")
                }
                for (var k = 0, j = labels.length; k < j; k++) {
                    altStr += hotspots[i][labels[k]]
                }
                if (altStr != "") {
                    area.alt = altStr
                }
            }
            area._center = hotspots[i].X + "," + hotspots[i].Y;
            if (vLyr.hotspot2d) {
                area._bound = hotspots[i].BOUND ? hotspots[i].BOUND : "";
                area._iconUrl = vLyr.hotspotIconUrl ? vLyr.hotspotIconUrl : EzServerClient.GlobeParams.EzServerClientURL + "/images/hotspot/hotspot.png";
                area._hotspot = hotspots[i]
            }
            __EzRefreshAreaHandler(area, peer, peer.groupTileImages[0][0][0].offsetLeft, peer.groupTileImages[0][0][0].offsetTop)
        }
        hotspots = null;
        delete hotspots
    }, function () {
        f.innerHTML = ""
    })
};
MainFrame.prototype.createTileMatrixCell = function (d, b) {
    var c = null;
    if (d instanceof EzServerClient.Layer.HotSpotTileLayer) {
        c = divCreator.create(null, d.tileInfo.width, d.tileInfo.height, 0, 0, 0, false);
        return c
    }
    if (b) {
        if (EzServerClient.GlobeParams.BrowserTypeAndVersion == "IE6.0" || EzServerClient.GlobeParams.BrowserTypeAndVersion == "IE5.5") {
            c = divCreator.create(null, d.tileInfo.width, d.tileInfo.height, null, null, 1, null, this.ownerDocument);
            c.id = "ezmap_overlay_div"
        } else {
            c = Shaderer.create(null, d.tileInfo.width, d.tileInfo.height, null, null, 1, null, this.ownerDocument)
        }
    } else {
        c = Shaderer.create(null, d.tileInfo.width, d.tileInfo.height, null, null, 0, null, this.ownerDocument)
    }
    c.onerror = function () {
        this.src = _NoImage.src
    };
    c.style.position = "absolute";
    return c
};
MainFrame.prototype.createTileMatrixCell2 = function (b) {
    return document.createElement("li")
};
MainFrame.prototype.deleteTiles = function () {
    this.removeTilesFromDiv(this.groupTileImages);
    this.groupTileImages = null;
    if (this.overlayImages) {
        this.removeTilesFromDiv(this.overlayImages);
        this.overlayImages = null
    }
};
MainFrame.prototype.deleteGroupTiles = function () {
    for (var b = 0; b < this.layersContainer.length; b++) {
        this.removeTilesFromDiv(this.groupTileImages[b]);
        this.div.removeChild(this.layersContainer[b])
    }
    if (this.hotspotDiv) {
        this.div.removeChild(this.hotspotDiv);
        this.hotspotDiv = null;
        if (__EzHandle1) {
            EzEvent.removeEventListener(__EzHandle1)
        }
        if (__EzHandle2) {
            EzEvent.removeEventListener(__EzHandle2)
        }
        if (__EzHandle3) {
            EzEvent.removeEventListener(__EzHandle3)
        }
    }
    this.groupTileImages.clear();
    this.layersContainer.clear()
};
MainFrame.prototype.removeTilesFromDiv = function (e) {
    if (e) {
        for (var d = 0; d < e.length; d++) {
            if (e[d]) {
                for (var f = 0; f < e[d].length; f++) {
                    this.removeTileImage(e[d][f])
                }
            }
        }
    }
};
MainFrame.prototype.removeTileImage = function (b) {
    divCreator.remove(b, this.ownerDocument);
    if (b.errorTile) {
        p.remove(b.errorTile, this.ownerDocument);
        b.errorTile = null
    }
    b.onerror = null
};
MainFrame.prototype.initializeMap = function () {
    this.deleteGroupTiles();
    this.centerAtLatLng(this.centerLatLng);
    this.loadTileImages()
};
MainFrame.prototype.getSpanLatLng = function (c) {
    if (!c) {
        c = new Rect(0, 0)
    }
    var b = this.baseLayer.convertBitmap2Map(this.centerBitmap.x - this.viewSize.width / 2, this.centerBitmap.y - this.viewSize.height / 2, this.realZoomLevel);
    var d = this.baseLayer.convertBitmap2Map(this.centerBitmap.x + this.viewSize.width / 2, this.centerBitmap.y + this.viewSize.height / 2, this.realZoomLevel);
    c.width = Math.abs(d.x - b.x);
    c.height = Math.abs(d.y - b.y);
    return c
};
MainFrame.prototype.getBoundsBitmap = function (b) {
    if (!b) {
        b = new MBR(0, 0, 0, 0)
    }
    b.minX = this.centerBitmap.x - this.viewSize.width / 2;
    b.minY = this.centerBitmap.y - this.viewSize.height / 2;
    b.maxX = this.centerBitmap.x + this.viewSize.width / 2;
    b.maxY = this.centerBitmap.y + this.viewSize.height / 2;
    return b
};
MainFrame.prototype.getBoundsLatLng = function (c) {
    c = this.getBoundsBitmap(c);
    var b = this.baseLayer.convertBitmap2Map(c.minX, c.minY, this.realZoomLevel);
    var d = this.baseLayer.convertBitmap2Map(c.maxX, c.maxY, this.realZoomLevel);
    c.minX = b.x;
    c.maxX = d.x;
    c.minY = Math.min(d.y, b.y);
    c.maxY = Math.max(d.y, b.y);
    return c
};
MainFrame.prototype.getPixelSpan = function () {
    var c = this.getBoundsLatLng();
    var b = c.getSpanX() / this.viewSize.width;
    return b
};
MainFrame.prototype.calculateTileMeasurements = function () {
    var c = Math.ceil(this.viewSize.width / this.baseLayer.tileInfo.width) + 1 + this.addtionalTileNum;
    var b = Math.ceil(this.viewSize.height / this.baseLayer.tileInfo.height) + 1 + this.addtionalTileNum;
    this.tableSize.width = c;
    this.tableSize.height = b
};
MainFrame.prototype.isLoaded = function () {
    return this.topLeftTile != null
};
MainFrame.prototype.onDrag = function () {
    this.bIsDraging = true;
    if (!this.topLeftTile) {
        return
    }
    this.onMove();
    this.rotateTiles();
    this.bIsDraging = false;
    EzEvent.ezEventListener.source = this;
    EzEvent.ezEventListener.eventType = EzEvent.MAP_PAN;
    EzEvent.trigger(EzEvent.ezEventListener, EzEvent);
    if (this._slip) {
        var c = this._start_x - EzEvent.screenPoint.x;
        var b = this._start_y - EzEvent.screenPoint.y;
        this._start_x = EzEvent.screenPoint.x;
        this._start_y = EzEvent.screenPoint.y;
        var e = new Date().getTime();
        var d = e - this._start_t;
        if (d > 0) {
            this._speed_x = (this._speed_x + (c * 1000) / d) / 2;
            this._speed_y = (this._speed_y + (b * 1000) / d) / 2
        }
        this._start_t = e
    }
};
MainFrame.prototype.bIsMapMoving = function () {
    return this.bIsPaning || this.bIsMoving || this.bIsDraging || this.dragObject.bIsMouseDown
};
MainFrame.prototype.rotateTiles = function () {
    var b = this.getCurrentOffset(Ri);
    if (Math.abs(this.dragObject.left) > 10000000 || Math.abs(this.dragObject.top) > 10000000) {
        this.cancelPan();
        this.centerAtBitmap(this.centerBitmap);
        return
    }
    while (b.width < -this.baseLayer.tileInfo.width) {
        this.currentPanOffset.width++;
        this.topLeftTile.x++;
        for (var c = 0; c < this.groupTileImages.length; c++) {
            this.rotateRight2(this.groupTileImages[c], this.baseGroupLayer.getLayers()[c])
        }
        this.getCurrentOffset(b)
    }
    while (b.width > 0) {
        this.currentPanOffset.width--;
        this.topLeftTile.x--;
        for (var c = 0; c < this.groupTileImages.length; c++) {
            this.rotateLeft2(this.groupTileImages[c], this.baseGroupLayer.getLayers()[c])
        }
        this.getCurrentOffset(b)
    }
    while (b.height < -this.baseLayer.tileInfo.height) {
        this.currentPanOffset.height++;
        this.topLeftTile.y--;
        for (var c = 0; c < this.groupTileImages.length; c++) {
            this.rotateDown2(this.groupTileImages[c], this.baseGroupLayer.getLayers()[c])
        }
        this.getCurrentOffset(b)
    }
    while (b.height > 0) {
        this.currentPanOffset.height--;
        this.topLeftTile.y++;
        for (var c = 0; c < this.groupTileImages.length; c++) {
            this.rotateUp2(this.groupTileImages[c], this.baseGroupLayer.getLayers()[c])
        }
        this.getCurrentOffset(b)
    }
};
MainFrame.prototype.rotateLeft2 = function (b, e) {
    var g = b.pop();
    b.unshift(g);
    if (e instanceof EzServerClient.Layer.HotSpotTileLayer) {
        for (var f = 0; f < g.length; f++) {
            this.configureImage3(g[f], 0, f, e)
        }
    } else {
        for (var f = 0; f < g.length; f++) {
            this.configureImage2(g[f], 0, f, e)
        }
    }
};
MainFrame.prototype.rotateRight2 = function (b, g) {
    var i = b.shift();
    b.push(i);
    var h = b.length - 1;
    if (g instanceof EzServerClient.Layer.HotSpotTileLayer) {
        for (var f = 0; f < i.length; f++) {
            this.configureImage3(i[f], h, f, g)
        }
    } else {
        for (var f = 0; f < i.length; f++) {
            this.configureImage2(i[f], h, f, g)
        }
    }
};
MainFrame.prototype.rotateUp2 = function (b, e) {
    if (e instanceof EzServerClient.Layer.HotSpotTileLayer) {
        for (var g = 0; g < b.length; g++) {
            var f = b[g].pop();
            b[g].unshift(f);
            this.configureImage3(f, g, 0, e)
        }
    } else {
        for (var g = 0; g < b.length; g++) {
            var f = b[g].pop();
            b[g].unshift(f);
            this.configureImage2(f, g, 0, e)
        }
    }
};
MainFrame.prototype.rotateDown2 = function (b, g) {
    var i = b[0].length - 1;
    if (g instanceof EzServerClient.Layer.HotSpotTileLayer) {
        for (var h = 0; h < b.length; h++) {
            var f = b[h].shift();
            b[h].push(f);
            this.configureImage3(f, h, i, g)
        }
    } else {
        for (var h = 0; h < b.length; h++) {
            var f = b[h].shift();
            b[h].push(f);
            this.configureImage2(f, h, i, g)
        }
    }
};
MainFrame.prototype.onDragStart = function (c) {
    //    if (!this._slip) {
    //        return;
    //    }
    this.saveStartPoint = this.getCenterLatLng();
    if (this.onmousedown) {
        this.onmousedown(c)
    }
    EzEvent.ezEventListener.source = this;
    EzEvent.ezEventListener.eventType = EzEvent.MAP_PANSTART;
    EzEvent.trigger(EzEvent.ezEventListener, EzEvent);
    if (this._slip) {
        this._start_x = EzEvent.screenPoint.x;
        this._start_y = EzEvent.screenPoint.y;
        this._speed_x = 0;
        this._speed_y = 0;
        this._start_t = new Date().getTime()
    }
};
MainFrame.prototype.draw = function (c) {
    alert("start..")
};
MainFrame.prototype.drawMouseDown = function (event) {
    var d = new Point(this.mouseLng, this.mouseLat);
    if (EzServerClient.GlobeParams.VML) {
    } else {
        if (event.button == 0) {
            if (this.drawMode == "drawPoint") {
                if (this.outputPanel2) {
                    if (this.outputPanel && typeof this.outputPanel.value != "undefined") {
                        this.outputPanel.value = this.mouseLng
                    }
                    if (typeof this.outputPanel2.value != "undefined") {
                        this.outputPanel2.value = this.mouseLat
                    }
                } else {
                    if (this.outputPanel && typeof this.outputPanel.value != "undefined") {
                        this.outputPanel.value = this.mouseLng + "," + this.mouseLat
                    }
                }
                var e = this.getDivCoord(this.mouseLng, this.mouseLat);
                this.pointImg.lon = this.mouseLng;
                this.pointImg.lat = this.mouseLat;
                this.pointImg.style.left = convert2Px(e.x - 8);
                this.pointImg.style.top = convert2Px(e.y - 8);
                this.changeDragMode("pan");
                if (_callback != null) {
                    _callback(this.mouseLng + "," + this.mouseLat)
                }
                return
            }
            if (this.vmlDraw == null) {
                this.pathPoint = new Array();
                this.drawStart();
                this.bEndDraw = false
            }
            if (this.vmlDraw && (this.drawMode == "measure" || this.drawMode == "drawPolyline")) {
                this.pathPoint.push(d);
                this.vmlDraw.points.push(d);
                this.vmlDraw.redraw();
                if (this.outputPanel && typeof this.outputPanel.value != "undefined") {
                    if (this.pathPoint.length < 2) {
                        this.outputPanel.value = this.pathPoint.toString() + "," + this.pathPoint.toString()
                    } else {
                        this.outputPanel.value = this.pathPoint.toString()
                    }
                }
            } else {
                if (this.vmlDraw && this.drawMode == "drawPolygon") {
                    var e = this.vmlDraw.points.pop();
                    this.vmlDraw.points.push(d);
                    this.pathPoint.push(d);
                    this.vmlDraw.points.push(e);
                    this.vmlDraw.redraw();
                    if (this.outputPanel && typeof this.outputPanel.value != "undefined") {
                        if (this.pathPoint.length == 1) {
                            this.outputPanel.value = this.pathPoint.toString() + "," + this.pathPoint.toString() + "," + this.pathPoint.toString()
                        } else {
                            this.outputPanel.value = this.pathPoint.toString() + "," + this.pathPoint[0].toString()
                        }
                    }
                }
            }
        }
    }
    if (event.button == 1) {
        if (this.drawMode == "drawPoint") {
            if (this.outputPanel2) {
                if (this.outputPanel && typeof this.outputPanel.value != "undefined") {
                    this.outputPanel.value = this.mouseLng
                }
                if (typeof this.outputPanel2.value != "undefined") {
                    this.outputPanel2.value = this.mouseLat
                }
            } else {
                if (this.outputPanel && typeof this.outputPanel.value != "undefined") {
                    this.outputPanel.value = this.mouseLng + "," + this.mouseLat
                }
            }
            var e = this.getDivCoord(this.mouseLng, this.mouseLat);
            this.pointImg.lon = this.mouseLng;
            this.pointImg.lat = this.mouseLat;
            this.pointImg.style.left = convert2Px(e.x - 8);
            this.pointImg.style.top = convert2Px(e.y - 8);
            this.changeDragMode("pan");
            if (_callback != null) {
                _callback(this.mouseLng + "," + this.mouseLat)
            }
            return
        }
        if (this.vmlDraw == null) {
            this.pathPoint = new Array();
            this.drawStart();
            this.bEndDraw = false
        }
        if (this.vmlDraw && (this.drawMode == "measure" || this.drawMode == "drawPolyline")) {
            this.pathPoint.push(d);
            this.vmlDraw.points.push(d);
            this.vmlDraw.redraw();
            if (this.outputPanel && typeof this.outputPanel.value != "undefined") {
                if (this.pathPoint.length < 2) {
                    this.outputPanel.value = this.pathPoint.toString() + "," + this.pathPoint.toString()
                } else {
                    this.outputPanel.value = this.pathPoint.toString()
                }
            }
        } else {
            if (this.vmlDraw && this.drawMode == "drawPolygon") {
                var e = this.vmlDraw.points.pop();
                this.vmlDraw.points.push(d);
                this.pathPoint.push(d);
                this.vmlDraw.points.push(e);
                this.vmlDraw.redraw();
                if (this.outputPanel && typeof this.outputPanel.value != "undefined") {
                    if (this.pathPoint.length == 1) {
                        this.outputPanel.value = this.pathPoint.toString() + "," + this.pathPoint.toString() + "," + this.pathPoint.toString()
                    } else {
                        this.outputPanel.value = this.pathPoint.toString() + "," + this.pathPoint[0].toString()
                    }
                }
            }
        }
    } else {
        if (event.button == 2) {
            this.bEndDraw = true;
            if (this.drawMode == "drawPolyline" || this.drawMode == "drawPolygon") {
                var f = "";
                if (this.outputPanel && typeof this.outputPanel.value != "undefined") {
                    f = this.outputPanel.value
                }
                this.changeDragMode("pan");
                if (_callback != null) {
                    _callback(f)
                }
                if (this.vmlDashline != null) {
                    this.removeOverlay(this.vmlDashline);
                    this.vmlDashline = null
                }
            }
        }
    }
};
MainFrame.prototype.drawMouseUp = function (c) {
    alert("up")
};
g_LineColor = "#157CC4";
g_FillColor = "#94DBFF";
MainFrame.prototype.drawStart = function (c) {
    this.startPointLng = this.mouseLng;
    this.startPointLat = this.mouseLat;
    this.bDrawEnd = false;
    this.startPointX = this.mouseX;
    this.startPointY = this.mouseY;
    var f = 1;
    var e = 0.5;
    if (this.vmlDraw && this.vmlDraw != null) {
        this.removeOverlay(this.vmlDraw);
        this.vmlDraw = null
    }
    var g = null;
    var d = "";
    d = this.startPointLng + "," + this.startPointLat;
    if (this.drawMode == "drawRect") {
        g = Rectangle;
        d += "," + d
    } else {
        if (this.drawMode == "drawCircle") {
            g = Circle;
            d = d + ",0"
        } else {
            if (this.drawMode == "drawPolyline" || this.drawMode == "measure") {
                f = 4;
                if (this.buttonTip != null && this.buttonTip.style.display != "") {
                    this.buttonTip.style.display = ""
                }
                g = Polyline;
                d += "," + d
            } else {
                if (this.drawMode == "drawPolygon") {
                    f = 4;
                    if (this.buttonTip != null && this.buttonTip.style.display != "") {
                        this.buttonTip.style.display = ""
                    }
                    g = Polygon;
                    d += "," + d + "," + d
                } else {
                    if (this.drawMode == "drawPoint") {
                    }
                }
            }
        }
    }
    this.vmlDraw = new g(d, g_LineColor, f, e, g_FillColor);
    this.addOverlay(this.vmlDraw)
};
MainFrame.prototype.drawMove = function (c) {
    if (this.bDrawEnd) {
        return
    }
    if (!this.vmlDraw) {
        return
    }
    if (this.drawMode == "drawRect") {
        this.vmlDraw.points[1].x = this.mouseLng;
        this.vmlDraw.points[1].y = this.mouseLat
    } else {
        if (this.drawMode == "drawCircle") {
            this.mouseLng + "," + this.mouseLat;
            var e = (this.mouseLng - this.startPointLng) * (this.mouseLng - this.startPointLng) + (this.mouseLat - this.startPointLat) * (this.mouseLat - this.startPointLat);
            this.vmlDraw.radius = Math.sqrt(e)
        } else {
            if (this.drawMode == "drawPolyline") {
                var d = this.vmlDraw.points[this.vmlDraw.points.length - 1].toString() + "," + this.mouseLng + "," + this.mouseLat;
                if (typeof this.vmlDashline == "undefined" || this.vmlDashline == null) {
                    var f = new Polyline(d, "#157CC4", 4, 0.5, "#94DBFF", "#157CC4", true);
                    f.setColor(g_LineColor);
                    f.setDashStyle("shortdot");
                    this.addOverlay(f);
                    this.vmlDashline = f
                } else {
                    this.vmlDashline.points.clear();
                    this.vmlDashline.points.push(this.vmlDraw.points[this.vmlDraw.points.length - 1]);
                    this.vmlDashline.points.push(new Point(this.mouseLng, this.mouseLat));
                    this.vmlDashline.redraw()
                }
            } else {
                if (this.drawMode == "drawPolygon") {
                    var d = this.vmlDraw.points[0].toString() + "," + this.mouseLng + "," + this.mouseLat + "," + this.vmlDraw.points[this.vmlDraw.points.length - 2].toString() + "," + this.vmlDraw.points[0].toString();
                    if (typeof this.vmlDashline == "undefined" || this.vmlDashline == null) {
                        var f = new Polygon(d, "#157CC4", 4, 0.5, "#94DBFF", "#157CC4", true);
                        f.setOpacity(0.2);
                        f.setColor(g_LineColor);
                        f.setFillColor(g_FillColor);
                        f.setDashStyle("shortdot");
                        this.addOverlay(f);
                        this.vmlDashline = f
                    } else {
                        this.vmlDashline.points.clear();
                        this.vmlDashline.points.push(this.vmlDraw.points[0]);
                        this.vmlDashline.points.push(new Point(this.mouseLng, this.mouseLat));
                        this.vmlDashline.points.push(this.vmlDraw.points[this.vmlDraw.points.length - 2]);
                        this.vmlDashline.points.push(this.vmlDraw.points[0]);
                        this.vmlDashline.redraw()
                    }
                }
            }
        }
    }
    this.vmlDraw.redraw()
};
MainFrame.prototype.drawEnd = function (d) {
    if (this.outputPanel) {
        if (this.drawMode == "drawRect") {
            var f = Math.min(this.startPointLng, this.mouseLng);
            var c = Math.max(this.startPointLng, this.mouseLng);
            var e = Math.min(this.startPointLat, this.mouseLat);
            var i = Math.max(this.startPointLat, this.mouseLat);
            var g = f + "," + e + "," + c + "," + i;
            if (typeof this.outputPanel.value != "undefined") {
                this.outputPanel.value = g
            }
        } else {
            if (this.drawMode == "drawCircle") {
                var h = Math.sqrt((this.startPointLng - this.mouseLng) * (this.startPointLng - this.mouseLng) + (this.startPointLat - this.mouseLat) * (this.startPointLat - this.mouseLat));
                var g = this.startPointLng + "," + this.startPointLat + "," + h;
                if (typeof this.outputPanel.value != "undefined") {
                    this.outputPanel.value = g
                }
            }
        }
    }
    this.bDrawEnd = true;
    if ((this.drawMode == "drawRect" || this.drawMode == "drawCircle")) {
        if (_callback) {
            _callback(this.outputPanel.value)
        }
        if (this.bIsPan) {
            this.changeDragMode("pan")
        }
    }
};
MainFrame.prototype.onDragEnd = function (c) {
    if (this.bIsOutOfBorder() == true) {
        this.centerAtLatLng(this.saveStartPoint)
    }
    if (this.saveStartPoint == this.getCenterLatLng()) {
        return
    }
    this.onStateChanged("onDragEnd");
    if (this._slip) {
        var e = (EzEvent.screenPoint.x - this._start_x) * this._coefficient;
        var d = (this._start_y - EzEvent.screenPoint.y) * this._coefficient;
        this.slipPan(e, d)
    }
    EzEvent.ezEventListener.source = this;
    EzEvent.ezEventListener.eventType = EzEvent.MAP_PANEND;
    EzEvent.trigger(EzEvent.ezEventListener, EzEvent)
};
MainFrame.prototype.onDoubleClick = function (c) {
    EzEvent.ezEventListener.source = this;
    EzEvent.ezEventListener.eventType = EzEvent.MAP_DBLCLICK;
    EzEvent.trigger(EzEvent.ezEventListener, EzEvent);
    // if (this.disableDragging) {
    //    return
    // }
    // var e = this.getRelativeClickPoint(c, this.container);
    // var d = Math.floor(this.viewSize.width / 2) - e.x;
    // var f = -(Math.floor(this.viewSize.height / 2) - e.y);
    // this.pan(d, f);

    if (this.bDblClickZoom === true) {
        this.zoomTo(this.getZoomLevel() + 1);
    }
};
MainFrame.prototype.onClick = function (c) {
    /*document.focus();*/
    EzEvent.ezEventListener.source = this;
    EzEvent.ezEventListener.eventType = EzEvent.MAP_CLICK;
    EzEvent.trigger(EzEvent.ezEventListener, EzEvent)
};
MainFrame.prototype.getRelativeClickPoint = function (c, i, g) {
    if (!g) {
        g = new Point()
    }
    if (typeof c.offsetX != "undefined") {
        var h = c.target || c.srcElement;
        var f = Tg(h, i);
        g.x = c.offsetX + f.x;
        g.y = c.offsetY + f.y
    } else {
        if (typeof c.pageX != "undefined") {
            var d = ObjectOffset(i);
            g.x = c.pageX - d.x;
            g.y = c.pageY - d.y
        } else {
            EzLog.incompatible("dblclick")
        }
    }
    return g
};
MainFrame.prototype.sortImagesFromCenter = function (i) {
    var h = [];
    for (var n = 0; n < i.length; n++) {
        for (var m = 0; m < i[n].length; m++) {
            var l = i[n][m];
            l.coordX = n;
            l.coordY = m;
            var k = Math.min(n, i.length - n - 1);
            var j = Math.min(m, i[n].length - m - 1);
            if (k == 0 || j == 0) {
                l.priority = 0
            } else {
                l.priority = k + j
            }
            h.push(l)
        }
    }
    h.sort(MainFrame.sortByPriority);
    return h
};
MainFrame.prototype.reconfigureImage = function (b, c) {
    this.configureImage2(b, b.coordX, b.coordY, c)
};
MainFrame.prototype.reconfigureImage3 = function (b, c) {
    this.configureImage3(b, b.coordX, b.coordY, c)
};
MainFrame.prototype.reconfigureAllImages = function () {
    var c = this.baseGroupLayer.getLayers();
    for (var e = 0; e < this.groupTileImages.length; e++) {
        if (this.groupTileImages[e].length == 0) {
            return
        }
        var b = this.sortImagesFromCenter(this.groupTileImages[e]);
        if (c[e] instanceof EzServerClient.Layer.HotSpotTileLayer) {
            for (var f = 0; f < b.length; f++) {
                if (f < b.length) {
                    this.reconfigureImage3(b[f], c[e])
                }
            }
        } else {
            for (var f = 0; f < b.length; f++) {
                if (f < b.length) {
                    this.reconfigureImage(b[f], c[e])
                }
            }
        }
    }
};
MainFrame.prototype.pan = function (d, b) {
    this.bIsPaning = true;
    if (!this.topLeftTile) {
        return
    }
    var c = Math.sqrt(d * d + b * b);
    var e = Math.max(10, Math.floor(c / 20));
    this.panSiner = new nc(e);
    this.panSiner.reset();
    this.panDistance.width = d;
    this.panDistance.height = b;
    this.panStart = new Point(this.dragObject.left, this.dragObject.top);
    this.doPan();
    this.bIsPaning = false
};
MainFrame.prototype.doPan = function () {
    var e = this.panSiner.next();
    if (this.bIsOutOfBorder()) {
        this.centerAtLatLng(this.saveStartPoint);
        return
    }
    this.dragObject.moveTo(this.panStart.x + this.panDistance.width * e, this.panStart.y - this.panDistance.height * e);
    this.onMove();
    if (this.panSiner.more()) {
        this.panTimeout = this.setTimeout("this.doPan()", 10);
        this.rotateTiles()
    } else {
        this.panTimeout = null;
        this.onStateChanged("doPan");
        if (this.hotspotDiv) {
            if (this.hotspotDiv.style.left != this.groupTileImages[0][0][0].style.left || this.hotspotDiv.style.top != this.groupTileImages[0][0][0].style.top) {
                this.hotspotDiv.style.left = this.groupTileImages[0][0][0].style.left;
                this.hotspotDiv.style.top = this.groupTileImages[0][0][0].style.top;
                var b = document.getElementById("hotspotLyr");
                for (var d = 0; d < b.childNodes.length; d++) {
                    var f = b.childNodes[d];
                    for (var c = 0; c < f.childNodes.length; c++) {
                        __EzRefreshAreaHandler(f.childNodes[c], this, this.groupTileImages[0][0][0].offsetLeft, this.groupTileImages[0][0][0].offsetTop)
                    }
                }
                if (__EzPoly) {
                    __hide()
                }
            }
        }
    }
};
MainFrame.prototype.slipPan = function (d, b) {
    this.bIsPaning = true;
    if (!this.topLeftTile) {
        return
    }
    var c = Math.sqrt(d * d + b * b);
    var e = Math.max(10, Math.floor(c / 20));
    this.panSiner1 = new nc1(e);
    this.panSiner1.reset();
    this.panDistance.width = d;
    this.panDistance.height = b;
    this.panStart = new Point(this.dragObject.left, this.dragObject.top);
    this.doPan1();
};
MainFrame.prototype.doPan1 = function () {
    var e = this.panSiner1.next();
    if (this.bIsOutOfBorder()) {
        this.centerAtLatLng(this.saveStartPoint);
        return
    }
    this.dragObject.moveTo(this.panStart.x + this.panDistance.width * e, this.panStart.y - this.panDistance.height * e);
    this.onMove();
    if (this.panSiner1.more()) {
        this.panTimeout = this.setTimeout("this.doPan1()", 10);
        this.rotateTiles()
    } else {
        this.panTimeout = null;
        this.onStateChanged("doPan1");
        this.bIsPaning = false;
        if (this.hotspotDiv) {
            if (this.hotspotDiv.style.left != this.groupTileImages[0][0][0].style.left || this.hotspotDiv.style.top != this.groupTileImages[0][0][0].style.top) {
                this.hotspotDiv.style.left = this.groupTileImages[0][0][0].style.left;
                this.hotspotDiv.style.top = this.groupTileImages[0][0][0].style.top;
                var b = document.getElementById("hotspotLyr");
                for (var d = 0; d < b.childNodes.length; d++) {
                    var f = b.childNodes[d];
                    for (var c = 0; c < f.childNodes.length; c++) {
                        __EzRefreshAreaHandler(f.childNodes[c], this, this.groupTileImages[0][0][0].offsetLeft, this.groupTileImages[0][0][0].offsetTop)
                    }
                }
                if (__EzPoly) {
                    __hide()
                }
            }
        }
    }
};
MainFrame.prototype.bIsOutOfBorder = function (d) {
    var e = false;
    if (typeof _BorderArray == "undefined" || typeof MapBorder == "undefined") {
        return e
    }
    if (typeof this.centerLatLng == "undefined" || this.centerLatLng == null) {
        return e
    }
    var b = this.centerLatLng.x;
    var g = this.centerLatLng.y;
    var c = null;
    if (typeof d != "undefined") {
        c = d
    } else {
        c = this.realZoomLevel
    }
    var f = _BorderArray[c];
    if (!f) {
        return e
    }
    if (b < f.minx || b > f.maxx || g < f.miny || g > f.maxy) {
        alert("对不起,超出视野范围!");
        e = true
    } else {
        this.saveStartPoint = this.getCenterLatLng()
    }
    return e
};
MainFrame.prototype.getMinLevelBorder = function (b) {
    return this.realZoomLevel
};
MainFrame.prototype.cancelPan = function () {
    if (this.panTimeout) {
        clearTimeout(this.panTimeout)
    }
};
MainFrame.prototype.recenterOrPanToLatLng = function (b) {
    if (!this.topLeftTile) {
        return
    }
    if (this.centerLatLng) {
        this.centerLatLng.x = b.x;
        this.centerLatLng.y = b.y
    } else {
        this.centerLatLng = new Point(b.x, b.y)
    }
    this.lastLatLng = this.centerLatLng;
    var b = this.baseLayer.convertMap2Bitmap(this.centerLatLng.x, this.centerLatLng.y, this.realZoomLevel);
    this.recenterOrPanToBitmap(b)
};
MainFrame.prototype.recenterOrPanToBitmap = function (c) {
    if (!this.topLeftTile) {
        return
    }
    var b = this.centerBitmap.x - c.x;
    var d = this.centerBitmap.y - c.y;
    if (b == 0 && d == 0) {
        return
    }
    if (Math.abs(b) < this.viewSize.width && Math.abs(d) < this.viewSize.height) {
        this.pan(b, d);
        return
    }
    this.centerAtBitmap(c)
};
MainFrame.prototype.addStateListener = function (b) {
    if (!this.stateListeners) {
        this.stateListeners = new Array()
    }
    this.stateListeners.push(b)
};
MainFrame.prototype.getZoomLevel = function () {
    if (EzServerClient.GlobeParams.ZoomLevelSequence == 1 || EzServerClient.GlobeParams.ZoomLevelSequence == 3) {
        return this.ascendZoomLevel
    } else {
        return this.realZoomLevel
    }
};
MainFrame.prototype.centerAndZoom = function (h, b) {
    if (b > EzServerClient.GlobeParams.MapMaxLevel) {
        return
    }
    var e = b;
    if (EzServerClient.GlobeParams.ZoomLevelSequence == 1 || EzServerClient.GlobeParams.ZoomLevelSequence == 3) {
        b = EzServerClient.GlobeParams.MapMaxLevel - e
    }
    var c = this.getZoomLevel();
    var i = c;
    var d = this.getBoundsLatLng();
    EzEvent.zoomLevel = c;
    EzEvent.extent = d;
    EzEvent.ezEventListener.source = this;
    EzEvent.ezEventListener.eventType = EzEvent.MAP_ZOOMSTART;
    EzEvent.trigger(EzEvent.ezEventListener, EzEvent);
    var g = false;
    if (b != this.realZoomLevel) {
        var f = this.realZoomLevel;
        this.realZoomLevel = b;
        this.mouseZoomLevel = this.realZoomLevel;
        this.ascendZoomLevel = e;
        this.zoomLevel = e;
        g = true
    }
    this.centerAtLatLng(h);
    if (g && this.onzoom) {
        this.onzoom(f, this.realZoomLevel);
        d = this.getBoundsLatLng();
        i = this.getZoomLevel();
        EzEvent.zoomLevelPrevious = c;
        EzEvent.zoomLevel = i;
        EzEvent.extent = d;
        EzEvent.ezEventListener.source = this;
        EzEvent.ezEventListener.eventType = EzEvent.MAP_ZOOMCHANGE;
        EzEvent.trigger(EzEvent.ezEventListener, EzEvent)
    }
    EzEvent.zoomLevel = i;
    EzEvent.extent = d;
    EzEvent.ezEventListener.source = this;
    EzEvent.ezEventListener.eventType = EzEvent.MAP_ZOOMEND;
    EzEvent.trigger(EzEvent.ezEventListener, EzEvent)
};
MainFrame.prototype.centerAtMBR = function (h, g, d, c) {
    for (var e = 0; e < arguments.length; e++) {
        if (typeof arguments[e] == "string") {
            arguments[e] = parseFloat(arguments[e])
        }
    }
    if (!h || !d || !g || !c) {
        return
    }
    var l = Math.min(h, d);
    var i = Math.max(h, d);
    var j = Math.min(g, c);
    var f = Math.max(g, c);
    var b;
    var k = new Point();
    if (l == i && j == f) {
        k.x = i;
        k.y = f;
        this.recenterOrPanToLatLng(k);
        return
    }
    k.x = (i + l) / 2;
    k.y = (f + j) / 2;
    b = this.getLevelOfMBR(h, g, d, c);
    if (b != this.getZoomLevel()) {
        this.centerAndZoom(k, b)
    } else {
        EzEvent.zoomLevel = b;
        EzEvent.extent = this.getBoundsLatLng();
        EzEvent.ezEventListener.source = this;
        EzEvent.ezEventListener.eventType = EzEvent.MAP_ZOOMSTART;
        EzEvent.trigger(EzEvent.ezEventListener, EzEvent);
        this.recenterOrPanToLatLng(k);
        EzEvent.zoomLevel = b;
        EzEvent.extent = this.getBoundsLatLng();
        EzEvent.ezEventListener.source = this;
        EzEvent.ezEventListener.eventType = EzEvent.MAP_ZOOMEND;
        EzEvent.trigger(EzEvent.ezEventListener, EzEvent)
    }
    delete k
};
MainFrame.prototype.getLevelOfMBR = function (k, i, e, d) {
    for (var f = 0; f < arguments.length; f++) {
        if (typeof arguments[f] == "string") {
            arguments[f] = parseFloat(arguments[f])
        }
    }
    if (!k || !e || !i || !d) {
        return
    }
    var n = Math.min(k, e);
    var l = Math.max(k, e);
    var m = Math.min(i, d);
    var h = Math.max(i, d);
    // var j = (l - n) / ((_m_MapBottomSpan / 3600) * (this.tableSize.width - 2));
    // var g = (h - m) / ((_m_MapBottomSpan / 3600) * (this.tableSize.height - 2));
    // var b = Math.max(j, g);
    // var c = Math.round(Math.log(b) / Math.log(2));
    // switch (EzServerClient.GlobeParams.ZoomLevelSequence) {
    //     case 0:
    //         break;
    //     case 1:
    //         c = EzServerClient.GlobeParams.MapMaxLevel - c;
    //         break;
    //     case 2:
    //         c = 18 - c - 2 * EzServerClient.GlobeParams.ZoomOffset;
    //         break;
    //     case 3:
    //         c = EzServerClient.GlobeParams.MapMaxLevel - 18 + c + 2 * EzServerClient.GlobeParams.ZoomOffset;
    //         break
    //     case 4:
    //         c = EzServerClient.GlobeParams.MapMaxLevel + EzServerClient.GlobeParams.ZoomOffset - c;
    //         break;
    // }

    var extent = this.getBoundsLatLng();
    var flag = (extent.maxX - extent.minX >= extent.maxY - extent.minY);
    if (flag)
        c = (extent.maxX - extent.minX) / Math.min(extent.maxX - extent.minX, l - n);
    else
        c = (extent.maxY - extent.minY) / Math.min(extent.maxY - extent.minY, h - m);

    if (this.isZoomInExt === true)
        c = this.getZoomLevel() + Math.round(c);
    else
        c = this.getZoomLevel() - Math.round(c);

    if (n == l || l == h) {
        c = this.realZoomLevel
    } else {
        if (c < 0) {
            c = 0
        }
    }
    if (c > this.baseLayer.maxZoomLevel) {
        c = this.baseLayer.maxZoomLevel
    }
    return c
};
MainFrame.prototype.centerAtLatLng = function (b) {
    this.centerLatLng = new Point(b.x, b.y);
    this.lastLatLng = this.centerLatLng;
    var b = this.baseLayer.convertMap2Bitmap(this.centerLatLng.x, this.centerLatLng.y, this.realZoomLevel);
    if (this.midPointDiv) {
        RemoveChildren(this.midPointDiv);
        this.midPointDiv = null
    }
    this.centerAtBitmap(b)
};
MainFrame.prototype.centerAtBitmap = function (d) {
    this.centerBitmap.x = d.x;
    this.centerBitmap.y = d.y;
    var f = d.x - Math.floor(this.viewSize.width / 2) - this.tilePaddingOffset.width;
    var e = d.y + Math.floor(this.viewSize.height / 2) + this.tilePaddingOffset.height;
    var g = Math.ceil(f / this.baseLayer.tileInfo.width);
    var h = Math.ceil(e / this.baseLayer.tileInfo.height);
    var c = g * this.baseLayer.tileInfo.width - f;
    var b = h * this.baseLayer.tileInfo.height - e;
    if (c < -this.baseLayer.tileInfo.width) {
        g++;
        c += this.baseLayer.tileInfo.width
    } else {
        if (c > 0) {
            g--;
            c -= this.baseLayer.tileInfo.width
        }
    }
    b = -b;
    if (b < -this.baseLayer.tileInfo.height) {
        h--;
        b += this.baseLayer.tileInfo.height
    } else {
        if (b > 0) {
            h++;
            b -= this.baseLayer.tileInfo.height
        }
    }
    if (!this.topLeftTile) {
        this.topLeftTile = new Point(g, h);
        if (!this.stateMonitor) {
            this.stateMonitor = new MapStatusControl(this)
        }
    } else {
        this.topLeftTile.x = g;
        this.topLeftTile.y = h
    }
    if (!this.stateMonitor) {
        this.stateMonitor = new MapStatusControl(this)
    }
    this.currentPanOffset.width = 0;
    this.currentPanOffset.height = 0;
    this.reconfigureAllImages();
    this.repositionOverlays();
    this.dragObject.moveTo(c, b);
    this.onStateChanged("centerAtBitmap");
    this.onLevelChanged()
};
MainFrame.prototype.setCenter = function (e) {
    if (!e) {
        e = this.getCenterLatLng()
    }
    var d = this.getBoundsLatLng();
    var c = (e.x - d.minX) / d.getSpanX() * this.viewSize.width;
    var b = (e.y - d.minY) / d.getSpanY() * this.viewSize.height;
    this.dragObject.moveTo(c, b);
    this.rotateTiles()
};
MainFrame.prototype.getDivCoord = function (b, e) {
    var d = this.baseLayer.convertMap2Bitmap(b, e, this.realZoomLevel, we);
    var c = this.getDivCoordinate(d.x, d.y, we);
    delete d;
    return c
};
MainFrame.prototype.getDivCoord2 = function (b, h, d) {
    if (!d) {
        var d = new Point(0, 0)
    }
    var g = this.baseGroupLayer.getLayers()[1].convertMap2Bitmap(b, h, this.realZoomLevel, d);
    var f = (this.topLeftTile.x - this.currentPanOffset.width) * this.baseLayer.tileInfo.width + this.tilePaddingOffset.width;
    d.x = g.x - f;
    var c = (this.topLeftTile.y + this.currentPanOffset.height) * this.baseLayer.tileInfo.height - this.tilePaddingOffset.height;
    d.y = c - g.y;
    return d
};
MainFrame.prototype.getDivCoordinate = function (c, j, g) {
    if (!g) {
        g = new Point(0, 0)
    }
    var f = this.getCurrentOffset(qg);
    var h = this.topLeftTile.x * this.baseLayer.tileInfo.width + this.tilePaddingOffset.width - f.width;
    var b = c - h;
    var d = this.topLeftTile.y * this.baseLayer.tileInfo.height - this.tilePaddingOffset.height + f.height;
    var i = d - j;
    g.x = b;
    g.y = i;
    delete f;
    return g
};
MainFrame.prototype.getCenterLatLng = function (f) {
    if (!f) {
        f = new Point(0, 0)
    }
    if (this.centerLatLng) {
        f.x = this.centerLatLng.x;
        f.y = this.centerLatLng.y;
        return f
    }
    if (this.lastLatLng) {
        var g = this.baseLayer.convertMap2Bitmap(this.lastLatLng.x, this.lastLatLng.y, this.realZoomLevel);
        if (g.equals(this.centerBitmap)) {
            f.x = this.lastLatLng.x;
            f.y = this.lastLatLng.y;
            return f
        }
    }
    var b = this.mapCenter.x - this.baseLayer.tileInfo.origin[0];
    var h = this.mapCenter.y - this.baseLayer.tileInfo.origin[1];
    var d = this.baseLayer.convertPosByFlatMatrix(b, h);
    f.x = Math.floor(d.x / this.baseLayer.tileInfo.levelDetails[this.realZoomLevel].resolution);
    f.y = Math.floor(d.y / this.baseLayer.tileInfo.levelDetails[this.realZoomLevel].resolution);
    this.centerBitmap = new Point(f.x, f.y);
    var c = this.baseLayer.convertBitmap2Map(this.centerBitmap.x, this.centerBitmap.y, this.realZoomLevel);
    f.x = c.x;
    f.y = c.y;
    return f
};
MainFrame.prototype.onMove = function () {
    this.bIsMoving = true;
    this.centerLatLng = null;
    var c = this.getCurrentOffset(qg);
    var b = this.topLeftTile.x * this.baseLayer.tileInfo.width + Math.floor(this.viewSize.width / 2) + this.tilePaddingOffset.width - c.width;
    var d = (this.topLeftTile.y) * this.baseLayer.tileInfo.height - Math.floor(this.viewSize.height / 2) - this.tilePaddingOffset.height + c.height;
    this.centerBitmap.x = b;
    this.centerBitmap.y = d;
    this.centerLatLng = this.baseLayer.convertBitmap2Map(this.centerBitmap.x, this.centerBitmap.y, this.realZoomLevel);
    if (this.onpan) {
        this.onpan(b, d)
    }
    this.bIsMoving = false
};
MainFrame.prototype.debug = function (h) {
    if (true || !_Debug) {
        return
    }
    getEleByID("LonLatSpan").value = "LonLatSpan:" + this.span;
    getEleByID("EzServerClient.GlobeParams.TileAnchorPoint").value = "EzServerClient.GlobeParams.TileAnchorPoint:" + EzServerClient.GlobeParams.TileAnchorPoint[0] + "," + EzServerClient.GlobeParams.TileAnchorPoint[1];
    getEleByID("TileLonLat").value = "topLeftTile(x,y):" + this.topLeftTile.x + "," + this.topLeftTile.y;
    getEleByID("tilePaddingOffset").value = "tilePaddingOffset(width,height):" + this.tilePaddingOffset.width + "," + this.tilePaddingOffset.height;
    getEleByID("CurPanOffset").value = "currentPanOffset(width,height):" + this.currentPanOffset.width + "," + this.currentPanOffset.height;
    var b = this.getCurrentOffset(qg);
    getEleByID("divOffset").value = "divOffset(width,height):" + b.width + "," + b.height;
    var g = this.getSpanLatLng();
    getEleByID("LonLatSpan").value = "LonLatSpan(width,height):" + g.width + "," + g.height;
    var c = _PixelsPerDegree[this.realZoomLevel];
    getEleByID("UnitSpan").value = "UnitSpan(width,height):" + c.x + "," + c.y;
    var k = this.centerBitmap;
    if (k) {
        getEleByID("centerBitmap").value = "centerBitmap:(" + k.x + "," + k.y + ")"
    }
    var f = this.centerLatLng;
    if (f) {
        getEleByID("LonLatCenter").value = "Center at(Lon,Lat):" + f.x + "," + f.y;
        var d = "Col:" + Math.ceil(f.x / (3.515625 / 3600 * Math.pow(2, this.realZoomLevel))) + ",Row:" + Math.ceil(f.y / (3.515625 / 3600 * Math.pow(2, this.realZoomLevel)));
        getEleByID("centerUnit").value = "centerUnit:" + d;
        var i = this.centerBitmap;
        var l = this.getDivCoordinate(i.x, i.y, we);
        window.status = l.x + "," + l.y + ":" + this.div.style.left + "," + this.div.style.top;
        this.centerNaiv.style.left = convert2Px(l.x - 8);
        this.centerNaiv.style.top = convert2Px(l.y - 8);
        this.centerNaiv.title = "left,top:" + l.x + "," + l.y + "(" + (l.y - this.viewSize.height / 2) + "),Bit:" + i.x + "," + i.y;
        i = this.baseLayer.convertMap2Bitmap(116.4612375, 40.249454099999994, this.realZoomLevel);
        l = this.getDivCoordinate(i.x, i.y, we);
        this.mapBejingCenter.style.left = convert2Px(l.x - 8);
        this.mapBejingCenter.style.top = convert2Px(l.y - 8)
    }
};
MainFrame.prototype.clearStateChanged = function (b) {
    this.stateListeners.clear()
};
_curentPoint = null;
_curentLevel = null;
_bIsLocked = false;
MainFrame.prototype.onStateChanged = function (f) {
    if (!this.topLeftTile) {
        return
    }
    if (!_bIsLocked) {
        _curentPoint = this.getCenterLatLng();
        _curentLevel = this.realZoomLevel
    }
    if (this.stateListeners) {
        for (var d = 0; d < this.stateListeners.length; d++) {
            try {
                this.stateListeners[d](this)
            } catch (c) {
            }
        }
    }
    this.debug("onStateChanged");
    var g = this.getBoundsLatLng();
    var e = "BOX:[" + g.toString() + "]";
    if (typeof g_user == "undefined") {
        g_user = "unkown user"
    }
    if (typeof g_IP == "undefined") {
        g_IP = document.location.hostname
    }
    if (this.bIsLog) {
        EzLog.write(e, g_user, g_IP)
    }
};
MainFrame.prototype.refreshInfoWindow = function () {
    if (this.infoWindow.isVisible()) {
        this.bIsInScreen = false;
        this.showInfoWindow(this.pWinInfo, true)
    }
};
MainFrame.prototype.hideInfoWind = function () {
    if (this.infoWindow.isVisible()) {
        this.infoWindow.hide()
    }
};
MainFrame.prototype.showInfoWind = function () {
    if (!this.infoWindow.isVisible()) {
        this.infoWindow.show()
    }
};
MainFrame.prototype.resizePointImg = function () {
    if (typeof this.pointImg == "undefined" || this.pointImg == null || true) {
        return
    }
    var b = this.getDivCoord(this.pointImg.lon, this.pointImg.lat);
    this.pointImg.style.left = convert2Px(b.x - 8);
    this.pointImg.style.top = convert2Px(b.y - 8)
};
MainFrame.prototype.createDrawPoint = function (b) {
    if (!b) {
        return
    }
    this.pointImg = document.createElement("img");
    this.pointImg.src = _pointImgURL;
    this.pointImg.style.height = convert2Px(16);
    this.pointImg.style.width = convert2Px(16);
    this.pointImg.style.display = "none";
    this.pointImg.style.position = "absolute";
    this.pointImg.style.zIndex = 1001;
    b.appendChild(this.pointImg)
};
MainFrame.prototype.showPointImg = function (b) {
    if (typeof b == "undefined" || b == true) {
        this.pointImg.style.display = ""
    } else {
        this.pointImg.style.display = "none"
    }
};
MainFrame.prototype.getPxOfDist = function (c) {
    var g = this.getBoundsLatLng();
    var d = new Point(g.minX, g.minY);
    var b = new Point(g.maxX, g.minY);
    var f = GetDistanceInLL(d, b);
    var e = c / f * this.viewSize.width;
    return e
};
MainFrame.prototype.refreshMapScale = function () {
    if (!this.scaleTxt) {
        return
    }
    var e = this.getBoundsLatLng();
    var j = new Point(e.minX, e.minY);
    var i = new Point(e.maxX, e.minY);
    var d = GetDistanceInLL(j, i);
    var b = this.realZoomLevel + 2;
    var c = Math.ceil((this.viewSize.width * _m_scale_meter[b]) / d);
    var g = 0;
    if (EzServerClient.GlobeParams.ZoomLevelSequence == 0 || EzServerClient.GlobeParams.ZoomLevelSequence == 1) {
        while (c < 40 || c > 100) {
            if (c < 40) {
                b++
            } else {
                b--
            }
            c = Math.ceil((this.viewSize.width * _m_scale_meter[b]) / d);
            if (g > 3) {
                break
            }
            g++
        }
        this.scaleTxt.style.width = c ? c : 40 + "px";
        this.currentMapScale = "1:" + 96 / EzServerClient.GlobeParams.BrowserDPI.x * EzServerClient.GlobeParams.DisplayScale_dpi96[18 - this.realZoomLevel - EzServerClient.GlobeParams.ZoomOffset];
        var f = _m_scale_meter[b];
        if (f >= 1000) {
            f = Math.floor(f / 100);
            f = f / 10;
            f = f + "公里"
        } else {
            f = f + "米"
        }
        this.scaleRightTxt.innerHTML = f
    } else {
        var h = this.realZoomLevel + EzServerClient.GlobeParams.ZoomOffset;
        if (h >= EzServerClient.GlobeParams.DisplayScale_dpi96.length) {
            var k = h - EzServerClient.GlobeParams.DisplayScale_dpi96.length;
            this.currentMapScale = "1:" + 96 / EzServerClient.GlobeParams.BrowserDPI.x * (EzServerClient.GlobeParams.DisplayScale_dpi96[EzServerClient.GlobeParams.DisplayScale_dpi96.length - 1] / Math.pow(2, k + 1));
            this.scaleTxt.style.width = EzServerClient.GlobeParams.DisplayScale[EzServerClient.GlobeParams.DisplayScale.length - 1][1];
            this.scaleRightTxt.innerHTML = parseFloat(EzServerClient.GlobeParams.DisplayScale[EzServerClient.GlobeParams.DisplayScale.length - 1][0]) / Math.pow(2, k + 1) + "米"
        } else {
            if (h < 0) {
                var k = -h;
                this.currentMapScale = "1:" + 96 / EzServerClient.GlobeParams.BrowserDPI.x * (EzServerClient.GlobeParams.DisplayScale_dpi96[0] * Math.pow(2, k));
                this.scaleTxt.style.width = EzServerClient.GlobeParams.DisplayScale[0][1];
                this.scaleRightTxt.innerHTML = parseFloat(EzServerClient.GlobeParams.DisplayScale[0][0]) * Math.pow(2, k) + "公里"
            } else {
                this.currentMapScale = "1:" + 96 / EzServerClient.GlobeParams.BrowserDPI.x * (EzServerClient.GlobeParams.DisplayScale_dpi96[h]);
                this.scaleTxt.style.width = EzServerClient.GlobeParams.DisplayScale[this.realZoomLevel + EzServerClient.GlobeParams.ZoomOffset][1];
                this.scaleRightTxt.innerHTML = EzServerClient.GlobeParams.DisplayScale[this.realZoomLevel + EzServerClient.GlobeParams.ZoomOffset][0]
            }
        }
    }
};
MainFrame.prototype.onLevelChanged = function () {
    this.refreshMapScale();
    this.resizePointImg();
    this.refreshInfoWindow()
};
MainFrame.prototype.onLevelChanged_old = function () {
    this.clearVMLContainer();
    var b = _m_MapBottomScale * Math.pow(2, this.realZoomLevel);
    this.scaleTxt.innerHTML = "1:" + b;
    var c = 2 * b / 100;
    if (c > 10000) {
        c = Math.floor(c / 100);
        c = c / 10;
        c = c + "km"
    } else {
        c = c + "m"
    }
    this.scaleRightTxt.innerHTML = c;
    this.resizePointImg();
    this.refreshInfoWindow()
};
MainFrame.prototype.onResize = function (c) {
    if (this.viewSize.width != this.container.offsetWidth || this.viewSize.height != this.container.offsetHeight) {
        this.viewSize.width = this.container.offsetWidth;
        this.viewSize.height = this.container.offsetHeight;
        this.calculateTileMeasurements();
        if (this.hotspotDiv) {
            this.div.removeChild(this.hotspotDiv);
            this.hotspotDiv = null
        }
        this.loadTileImages();
        this.centerAtBitmap(this.centerBitmap);
        if (this.onresize) {
            this.onresize()
        }
        if (this.mapCenterDiv) {
            this.mapCenterDiv.style.left = convert2Px(this.viewSize.width / 2 - 8);
            this.mapCenterDiv.style.top = convert2Px(this.viewSize.height / 2 - 8)
        }
        var e = this.viewSize.width - 23;
        var g = this.viewSize.height;
        var f = parseInt(this.container.style.borderLeftWidth);
        var d = parseInt(this.container.style.borderTopWidth);
        if (!isNaN(f)) {
            this.iBorderWidth = f
        }
        if (!isNaN(d)) {
            this.iBorderHeight = d
        }
    }
    this.debug("onResize")
};
MainFrame.prototype.getCurrentOffset = function (b) {
    b.width = this.dragObject.left + this.currentPanOffset.width * this.baseLayer.tileInfo.width;
    b.height = this.dragObject.top + this.currentPanOffset.height * this.baseLayer.tileInfo.height;
    return b
};
MainFrame.prototype.switchSpecification = function (c) {
    if (this.spec == c) {
        return
    }
    var b = this.spec;
    var d = this.getCenterLatLng();
    this.setSpecification(c);
    this.div.style.backgroundColor = this.spec.backgroundColor;
    if (b.tileSize != c.tileSize) {
        this.topLeftTile = null;
        this.initializeMap()
    }
    this.centerAtLatLng(d);
    if (this.onspecificationchange) {
        this.onspecificationchange(b, c)
    }
};
MainFrame.prototype.setSpecification = function (b) {
    this.spec = b;
    if (!b.emptyTilePreload) {
        var c = document.createElement("IMG");
        c.style.position = "absolute";
        c.style.visibility = "hidden";
        c.style.top = convert2Px(-200);
        c.style.left = convert2Px(-200);
        document.body.appendChild(c);
        b.emptyTilePreload = c
    }
    this.spec.emptyTilePreload.src = this.spec.emptyTileURL;
    if (_VectorMapService.length > 2) {
        this.spec.bIsOverlay = true
    }
};
MainFrame.prototype.zoomTo = function (b) {
    this.div.style.zoom = 1;
    if (typeof b == "string") {
        b = parseInt(b)
    }
    if (EzServerClient.GlobeParams.ZoomLevelSequence == 1 || EzServerClient.GlobeParams.ZoomLevelSequence == 3) {
        var c = this.ascendZoomLevel
    } else {
        if (EzServerClient.GlobeParams.ZoomLevelSequence == 0 || EzServerClient.GlobeParams.ZoomLevelSequence == 2 || EzServerClient.GlobeParams.ZoomLevelSequence == 4) {
            var c = this.realZoomLevel
        }
    }
    if (c == b) {
        return
    }
    if (this.bIsOutOfBorder(b)) {
        this.onzoom();
        return
    }
    if (!this.topLeftTile) {
        return
    }
    if (b >= this.baseLayer.maxZoomLevel + 1) {
        b = this.baseLayer.maxZoomLevel
    } else {
        if (b < 0) {
            b = 0
        }
    }
    var d = this.getCenterLatLng();
    this.bIsZooming = true;
    this.centerAndZoom(d, b);
    this.bIsZooming = false;
    this.debug("zoomTo");
    this.refreshVMLGraphics()
};
MainFrame.prototype.zoomAtPoint = function (f, c) {
    this.div.style.zoom = 1;
    if (typeof c == "string") {
        c = parseInt(c)
    }
    var d;
    if (EzServerClient.GlobeParams.ZoomLevelSequence == 1 || EzServerClient.GlobeParams.ZoomLevelSequence == 3) {
        d = this.ascendZoomLevel
    } else {
        if (EzServerClient.GlobeParams.ZoomLevelSequence == 0 || EzServerClient.GlobeParams.ZoomLevelSequence == 2 || EzServerClient.GlobeParams.ZoomLevelSequence == 4) {
            d = this.realZoomLevel
        }
    }
    if (d == c) {
        return
    }
    if (this.bIsOutOfBorder(c)) {
        this.onzoom();
        return
    }
    if (!this.topLeftTile) {
        return
    }
    if (c >= this.baseLayer.maxZoomLevel + 1) {
        c = this.baseLayer.maxZoomLevel
    } else {
        if (c < 0) {
            c = 0
        }
    }
    var e = this.getCenterLatLng();
    var b, g;
    switch (EzServerClient.GlobeParams.ZoomLevelSequence) {
        case 0:
        case 3:
            if (d > c) {
                b = (f.x + e.x) / 2;
                g = (f.y + e.y) / 2
            } else {
                b = 2 * e.x - f.x;
                g = 2 * e.y - f.y
            }
            break;
        case 1:
        case 2:
            if (d < c) {
                b = (f.x + e.x) / 2;
                g = (f.y + e.y) / 2
            } else {
                b = 2 * e.x - f.x;
                g = 2 * e.y - f.y
            }
            break
    }
    this.centerLatLng = new Point(b, g);
    this.bIsZooming = true;
    this.centerAndZoom(this.centerLatLng, c);
    this.bIsZooming = false;
    this.refreshVMLGraphics()
};
MainFrame.prototype.toggleTileBorders = function () {
    if (this.groupTileImages) {
        for (var b = 0; b < this.groupTileImages.length; b++) {
            if (this.groupTileImages[b]) {
                for (var d = 0; d < this.groupTileImages[b].length; d++) {
                    var c = this.groupTileImages[b][d];
                    if (c.hasBorder) {
                        c.style.border = "0";
                        c.hasBorder = false
                    } else {
                        c.style.border = "1px solid black";
                        c.hasBorder = true
                    }
                }
            }
        }
    }
};
MainFrame.prototype.createLocalMarker = function (c) {
    var b = this.createLocationMarker(c.icon.image, c.icon.iconClass);
    var e = this;
    var d = c;
    b.mouseTarget.onmousedown = function (f) {
        return e.onIconMouseDown(d, f)
    };
    return b
};
MainFrame.prototype.createLocationMarker = function (i, b) {
    var h = divCreator.create(i, b.width, b.height, 0, 0, 10, false, "noprint");
    var c = divCreator.create(Vi, b.width, b.height, 0, 0, 3000, false, "noprint");
    var l = divCreator.create(b.shadowURL, b.shadowWidth, b.height, 0, 0, 3, false, "noprint");
    var j = _IEBrowser.type == 2 ? "ff" : "ie";
    var o = Shaderer.create(i.replace(/\.png$/, j + ".gif"), b.width, b.height, 0, 0, 10, false, "noscreen");
    var e = b.shadowURL.replace(/[^\/]*$/, "dithshadow.gif");
    var g = Shaderer.create(e, b.shadowWidth, b.height, 0, 0, 3, false, "noscreen");
    var m = null;
    var f = c;
    if (_IEBrowser.type == 2) {
        var k = "map" + Pe;
        Pe++;
        m = document.createElement("map");
        m.setAttribute("name", k);
        var n = document.createElement("area");
        n.setAttribute("shape", "poly");
        n.setAttribute("alt", "");
        n.setAttribute("coords", b.imageMapArray.join(","));
        n.setAttribute("href", "PolylineDrawer");
        f = n;
        m.appendChild(n);
        c.setAttribute("usemap", "#" + k)
    } else {
        setCursor(f, "pointer")
    }
    var d = new Marker(h, c, l, m, f);
    d.addLayer(o);
    if (_IEBrowser.type != 2) {
        d.addLayer(g)
    }
    d.appendTo(this.div);
    return d
};
MainFrame.prototype.clearOverlays = function (c) {
    if (typeof c == "undefined") {
        c = false
    }
    var e = new Array();
    this.lastPageCenter = this.getCenterLatLng();
    this.lastPageZoom = this.realZoomLevel;
    for (var b = 0; b < this.overlays.length; b++) {
        var d = this.overlays[b];
        if (!c && d.bDisRemovable) {
            e.push(d)
        } else {
            d.removeFromDiv();
            delete d
        }
    }
    this.closeInfoWindow();
    this.overlays.clear();
    this.overlays = e
};
MainFrame.prototype.removeOverlaysOutOfMBR = function (f) {
    var d = [];
    for (var e = 0; e < this.overlays.length; e++) {
        if (!f.containsPoint(this.overlays.point)) {
            a.removeFromDiv()
        } else {
            d.push(this.overlays[e])
        }
    }
    if (this.overlays.length != d.length) {
        this.overlays = d
    }
    if (this.infoWindow.isVisible()) {
        this.closeInfoWindow()
    }
};
MainFrame.prototype.removeOverlaysOfMBR = function (f) {
    var d = [];
    for (var e = 0; e < this.overlays.length; e++) {
        if (f.containsPoint(this.overlays.point)) {
            a.removeFromDiv()
        } else {
            d.push(this.overlays[e])
        }
    }
    if (this.overlays.length != d.length) {
        this.overlays = d
    }
    if (this.infoWindow.isVisible()) {
        this.closeInfoWindow()
    }
};
MainFrame.prototype.removeOverlay = function (f, e) {
    if (!f) {
        return
    }
    if (typeof e == "undefined") {
        e = false
    }
    if (!e && f.bDisRemovable) {
        return
    }
    var d = [];
    for (var g = 0; g < this.overlays.length; g++) {
        if (this.overlays[g] == f) {
            f.removeFromDiv()
        } else {
            d.push(this.overlays[g])
        }
    }
    if (this.overlays.length != d.length) {
        this.overlays = d
    }
};
MainFrame.prototype.addOverlay = function (b, c) {
    if (!b) {
        return
    }
    if (c) {
        b.bDisRemovable = c
    } else {
        b.bDisRemovable = false
    }
    this.overlays.push(b);
    if (b instanceof iOverLay) {
        b.createDiv(this);
    } else {
        if (typeof Monitor != "undefined" && b instanceof Monitor) {
            b.createDiv(this)
        }
    }
};
MainFrame.prototype.addOverlayOutOfMBR = function (c, b) {
    if (!b.containsPoint(c.point)) {
        this.addOverlay(c)
    }
};
MainFrame.prototype.repositionOverlays = function () {
    for (var b = 0; b < this.overlays.length; b++) {
        var c = this.overlays[b];
        if (c instanceof iOverLay) {
            c.redraw()
        } else {
            if (typeof Monitor != "undefined" && c instanceof Monitor) {
                c.redraw()
            }
        }
    }
};
MainFrame.prototype.blowupOverlay = function (d) {
    for (var b = 0; b < this.overlays.length; b++) {
        var c = this.overlays[b];
        if (c instanceof Title || c instanceof Marker || c instanceof Polyline || c instanceof Polygon || (typeof Monitor != "undefined" && c instanceof Monitor)) {
            c.setZIndex(c.iZIndex)
        }
    }
    d.setZIndex(d.iZIndex + 1)
};
MainFrame.prototype.asyncLoadVPageFromURL = function (h, d) {
    var f = xa.create("vpage");
    try {
        var e = XMLHttp.create();
        e.open("GET", h, true);
        var i = this;
        e.onreadystatechange = function () {
            if (e.readyState == 4) {
                if (f.isValid()) {
                    try {
                        alert("XML1:" + e.responseText);
                        i.loadVPageStr(e.responseText)
                    } catch (g) {
                        if (d) {
                            d(g)
                        }
                    }
                }
            }
        };
        e.send(null)
    } catch (c) {
        if (d) {
            d(c)
        }
    }
};
MainFrame.prototype.registerKeyHandlers = function (b) {
    BindingEvent(b, "keydown", this.eventHandler("onKeyPress"));
    BindingEvent(b, "keyup", this.eventHandler("onKeyUp"))
};
MainFrame.prototype.unregisterKeyHandlers = function (b) {
    unbindingEvent(this.container, "keydown", this.eventHandler("onKeyPress"));
    unbindingEvent(this.container, "keyup", this.eventHandler("onKeyUp"))
};
MainFrame.prototype.onMouseScroll = function (c) {
    if (!c) {
        c = window.event
    }
    if (!this.bIsZooming) {
        var d = this.getZoomLevel();
        if (c.wheelDelta > 0 || c.detail < 0) {
            if (EzServerClient.GlobeParams.ZoomLevelSequence == 1 || EzServerClient.GlobeParams.ZoomLevelSequence == 2 || EzServerClient.GlobeParams.ZoomLevelSequence == 4) {
                d++
            } else {
                if (EzServerClient.GlobeParams.ZoomLevelSequence == 0 || EzServerClient.GlobeParams.ZoomLevelSequence == 3) {
                    d--
                }
            }
        } else {
            if (EzServerClient.GlobeParams.ZoomLevelSequence == 1 || EzServerClient.GlobeParams.ZoomLevelSequence == 2 || EzServerClient.GlobeParams.ZoomLevelSequence == 4) {
                d--
            } else {
                if (EzServerClient.GlobeParams.ZoomLevelSequence == 0 || EzServerClient.GlobeParams.ZoomLevelSequence == 3) {
                    d++
                }
            }
        }
        this.flatZoom(d);
        if (_IEBrowser.type == 1) {
            var b = c.wheelDelta
        } else {
            var b = c.detail
        }
        EzEvent.wheelDelta = b;
        EzEvent.ezEventListener.source = this;
        EzEvent.ezEventListener.eventType = EzEvent.MAP_MOUSEWHEEL;
        EzEvent.trigger(EzEvent.ezEventListener, EzEvent)
    }
};
MainFrame.prototype.styleZoom = function (g, b, c) {
    if (b) {
        this.div.style.zoom = 1;
        this.div.style.left = convert2Px(this.iOldLeft);
        this.div.style.top = convert2Px(this.iOldTop)
    } else {
        switch (EzServerClient.GlobeParams.Browser) {
            case "IE":
                if (!g)
                    break;
                this.div.style.zoom = g;
                var f = g - 1;
                if (c && this._mouseZoom) {
                    var e = this.iOldLeft + (this.iOldLeft - (c.x - this.container.offsetLeft)) * f;
                    var d = this.iOldTop + (this.iOldTop - (c.y - this.container.offsetTop)) * f
                } else {
                    var e = this.iOldLeft + (this.iOldLeft - this.viewSize.width / 2) * f;
                    var d = this.iOldTop + (this.iOldTop - this.viewSize.height / 2) * f
                }
                d = Math.ceil(d);
                d = Math.ceil(d);
                this.div.style.left = convert2Px(e);
                this.div.style.top = convert2Px(d);
                break;
            case "Firefox":
                break;
            case "Chrome":
                break;
            case "Safari":
                break;
            case "Opera":
                break;
            default:
                break
        }
    }
};
MainFrame.prototype.flatZoom = function (h) {
    if (h < 0 || h > _MaxLevel) {
        return false
    }
    if (this.bIsZooming) {
        return false
    }
    this.bIsZooming = true;
    var d = 5;
    var g = 0;
    if (EzServerClient.GlobeParams.ZoomLevelSequence == 0 || EzServerClient.GlobeParams.ZoomLevelSequence == 3) {
        var e = _m_MapSpan[h] / _m_MapSpan[this.getZoomLevel()];
        var j = (e - 1) / d
    } else {
        var e = _m_MapSpan[h] / _m_MapSpan[this.getZoomLevel()];
        if (e > 1) {
            var j = (1 - e) / d / 2
        } else {
            var j = (1 - e) / d * 2
        }
    }
    this.iOldLeft = parseInt(this.div.style.left);
    this.iOldTop = parseInt(this.div.style.top);
    if (typeof ezmap_overlay_div != "undefined") {
        for (var f = 0; f < ezmap_overlay_div.length; f++) {
            ezmap_overlay_div[f].style.filter = ""
        }
    }
    if (this.infoWindow.isVisible()) {
        this.hideInfoWind();
        this.bInfoHasOpen = true
    } else {
        this.bInfoHasOpen = false
    }
    var c = this;
    var k = EzEvent.screenPoint;
    var b = EzEvent.mapPoint;
    _TmrModeFlatZoom = setInterval(function () {
        g++;
        if (g < (d + 1)) {
            if (c._mouseZoom) {
                c.styleZoom(1 + j * g, false, k)
            } else {
                c.styleZoom(1 + j * g, false)
            }
        } else {
            window.clearInterval(_TmrModeFlatZoom);
            _TmrModeFlatZoom = null;
            c.styleZoom(h, true);
            if (c._mouseZoom) {
                c.zoomAtPoint(b, h)
            } else {
                c.zoomTo(h)
            }
            if (c.bInfoHasOpen && !c.bInfoHasCloseClick) {
                c.showInfoWindow(c.pWinInfo, true)
            }
        }
    }, 10);
    return true
};
MainFrame.prototype.onKeyPress = function (c) {
    if (!this.bKeyboard)
        return true;

    if (this.ignoreKeyEvent(c)) {
        return true
    }
    switch (c.keyCode) {
        case 38:
        case 40:
        case 37:
        case 39:
            this.panKeys.add(c.keyCode);
            this.startContinuousPan();
            return false;
        case 34:
            this.pan(0, -Math.floor(this.viewSize.height * 0.75));
            return false;
        case 33:
            this.pan(0, Math.floor(this.viewSize.height * 0.75));
            return false;
        case 36:
            this.pan(Math.floor(this.viewSize.width * 0.75), 0);
            return false;
        case 35:
            this.pan(-Math.floor(this.viewSize.width * 0.75), 0);
            return false;
        case 187:
        case 107:
            this.zoomTo(this.realZoomLevel - 1);
            return false;
        case 189:
        case 109:
            this.zoomTo(this.realZoomLevel + 1);
            return false
    }
    switch (c.which) {
        case 61:
        case 43:
            this.zoomTo(this.realZoomLevel - 1);
            return false;
        case 45:
        case 95:
            this.zoomTo(this.realZoomLevel + 1);
            return false
    }
    return true
};
MainFrame.prototype.onKeyUp = function (c) {
    switch (c.keyCode) {
        case 38:
        case 40:
        case 37:
        case 39:
            this.panKeys.remove(c.keyCode);
            return false
    }
};
MainFrame.prototype.ignoreKeyEvent = function (c) {
    if (c.ctrlKey || (c.altKey || c.metaKey)) {
        return true
    }
    if (c.target && (c.target.nodeName == "INPUT" && c.target.getAttribute("type").toLowerCase() == "text" || c.target.nodeName == "TEXTAREA")) {
        return true
    }
    return false
};
MainFrame.prototype.startContinuousPan = function () {
    if (!this.topLeftTile) {
        return
    }
    this.cancelPan();
    if (!this.continuousPanTimeout) {
        this.panSiner = new nc(100);
        this.continuousPanTimeout = this.setTimeout("this.doContinuousPan()", 5)
    }
    this.keypan = {};
    this.keypan.startLeft = this.divEvent.style.left;
    this.keypan.startTop = this.divEvent.style.top
};
MainFrame.prototype.doContinuousPan = function () {
    if (this.panKeys.size > 0) {
        var f = (this.panKeys.contains(37) ? 1 : 0) + (this.panKeys.contains(39) ? -1 : 0);
        var e = (this.panKeys.contains(38) ? 1 : 0) + (this.panKeys.contains(40) ? -1 : 0);
        var d = 1;
        if (this.panSiner.more()) {
            d = this.panSiner.next()
        }
        var g = f > 0 ? Math.floor : Math.ceil;
        var c = g(7 * d * f + 5 * f);
        g = e > 0 ? Math.floor : Math.ceil;
        var b = g(7 * d * e + 5 * e);
        this.dragObject.moveTo(this.dragObject.left + c, this.dragObject.top + b);
        this.onMove();
        this.rotateTiles();
        this.continuousPanTimeout = this.setTimeout("this.doContinuousPan()", 10)
    } else {
        this.continuousPanTimeout = null;
        this.onStateChanged("doContinuousPan");
        EzEvent.ezEventListener.source = this;
        EzEvent.ezEventListener.eventType = EzEvent.MAP_VIEWCHANGE;
        EzEvent.keypanleftOffset = parseInt(this.divEvent.style.left) - parseInt(this.keypan.startLeft);
        EzEvent.keypantopOffset = parseInt(this.divEvent.style.top) - parseInt(this.keypan.startTop);
        EzEvent.trigger(EzEvent.ezEventListener, EzEvent)
    }
};
MainFrame.prototype.onWindowBlur = function (c) {
    if (this.panKeys.size > 0) {
        this.panKeys = new Ic()
    }
};
MainFrame.prototype.onIconMouseDown = function (d, c) {
    S(c);
    if (this.onmousedown) {
        this.onmousedown()
    }
    this.clearInfoWindowArgs(d.xml);
    this.showInfoWindow(d)
};
MainFrame.prototype.clearInfoWindowArgs = function (b) {
    b.setAttribute("arg0", "");
    b.setAttribute("arg1", "");
    b.setAttribute("arg2", "")
};
MainFrame.prototype.infoWindowNavigate = function (d, c, b, e) {
    if (!this.openLocation || this.disablePopups) {
        return
    }
    if (c) {
        this.openLocation.xml.setAttribute("arg0", c)
    }
    if (b) {
        this.openLocation.xml.setAttribute("arg1", b)
    }
    if (e) {
        this.openLocation.xml.setAttribute("arg2", e)
    }
    this.onInfoWindowLoad = d;
    this.showInfoWindow(this.openLocation)
};
MainFrame.prototype.showInfoWindow = function (c, f) {
    if (this.disablePopups || c == null) {
        return
    }
    if (!c.infoStyle) {
        return
    }
    this.openLocation = c;
    var b = this.convert2WPoint(c.point.x, c.point.y);
    this.infoWindow.point = c.point;
    this.infoWindow.iconClass = c.icon.iconClass;
    if (f) {
        this.infoWindow.positionAt(b.x, b.y, c.icon.iconClass);
        this.infoWindow.show();
        return
    } else {
        var d = this;
        var e = function () {
            d.showSizedInfoWindow(b.x, b.y, c.icon.iconClass)
        };
        V.asynchronousTransform(c.xml, this.infoWindow.offscreenArea, c.infoStyle, e, null)
    }
};
MainFrame.prototype.addMarkersToInfoWindowMask = function () {
    if (this.disablePopups || (!this.infoWindow.isVisible() || !this.infoWindow.point)) {
        return
    }
    this.infoWindow.clearMaskMap();
    var e = new Point(this.infoWindow.getOffsetLeft(), this.infoWindow.getOffsetTop());
    var d = new Point(e.x + this.infoWindow.getTotalWidth(), e.y + this.infoWindow.getTotalHeight());
    for (var b = 0; b < this.locations.length; b++) {
        var c = this.locations[b].marker;
        if (c.icon.offsetTop > d.y) {
            break
        }
        this.addMarkerToInfoWindowMask(e, d, c)
    }
    if (this.directionsMarkersAreVisible()) {
        this.addMarkerToInfoWindowMask(e, d, this.directionsStart);
        this.addMarkerToInfoWindowMask(e, d, this.directionsEnd)
    }
};
MainFrame.prototype.addMarkerToInfoWindowMask = function (f, e, d) {
    var c = d.icon;
    if (c.offsetLeft + c.width >= f.x && (c.offsetLeft <= e.x && (c.offsetTop + c.height >= f.y && c.offsetTop <= e.y))) {
        var b = M.get("local").translateImageMapArray(c.offsetLeft - f.x, c.offsetTop - f.y);
        this.infoWindow.addAreaToMaskMap(b, d.mouseTarget.onmousedown)
    }
};
MainFrame.prototype.showSizedInfoWindow = function (g, f, e) {
    xa.invalidate("infoWindowOffscreen");
    var d = xa.create("infoWindowOffscreen");
    this.infoWindow.prepareOffscreen();
    var c = this;
    var b = function () {
        if (d.isValid()) {
            c.infoWindow.flipOffscreenAndSize();
            c.infoWindow.positionAt(g, f, e);
            if (_IEBrowser.type != 1 && c.infoWindow.hasMask()) {
                c.addMarkersToInfoWindowMask()
            }
            c.infoWindow.show();
            if (typeof c.bIsInScreen == "undefined" || c.bIsInScreen) {
                c.panToInfoWindow()
            }
            if (c.onInfoWindowLoad) {
                c.onInfoWindowLoad();
                c.onInfoWindowLoad = null
            }
        }
    };
    window.setTimeout(b, 0)
};
MainFrame.prototype.createSpecChangeLink = function (c) {
    var d = this;
    var b = function () {
        d.switchSpecification(c)
    };
    return Bh(c.getLinkText(), b)
};
MainFrame.prototype.onInfoCloseClick = function (c) {
    this.closeInfoWindow();
    this.bInfoHasCloseClick = true
};
MainFrame.prototype.closeInfoWindow = function () {
    if (!this.disablePopups) {
        this.infoWindow.hide();
        if (this.oninfowindowclose) {
            this.oninfowindowclose()
        }
    }
    if (typeof clearImgTimeout != "undefined" && clearImgTimeout != null) {
        clearImgTimeout()
    }
    if (EzColorPicker.close) {
        EzColorPicker.close()
    }
};
MainFrame.prototype.panToInfoWindow = function () {
    if (this.pWinInfo.bIsVisable == false) {
        return
    }
    if (this.disablePopups) {
        return
    }
    var d = this.getMinLevelBorder(this.infoWindow.point);
    if (d != this.realZoomLevel) {
        this.zoomTo(d)
    }
    var i = this.baseLayer.convertMap2Bitmap(this.infoWindow.point.x, this.infoWindow.point.y, this.realZoomLevel);
    var b = this.getDivCoordinate(i.x, i.y, we);
    var f = new Point(this.centerBitmap.x, this.centerBitmap.y);
    var j = i.x - (this.viewSize.width / 2 - this.infoWindow.getTotalWidth());
    var g = i.x + (this.viewSize.width / 2 - this.infoWindow.getTotalWidth());
    var h = i.y - (this.viewSize.height / 2 - this.infoWindow.getTotalHeight()) + 10;
    var e = i.y + this.viewSize.height / 2 - 50;
    if (f.x > g || f.x < j) {
        f.x = Math.min(f.x, g);
        f.x = Math.max(f.x, j)
    }
    if (f.y > e || f.y < h) {
        f.y = Math.min(f.y, e);
        f.y = Math.max(f.y, h)
    }
    this.centerLatLng = null;
    var c = this.centerBitmap;
    if (c.x != f.x || c.y != f.y) {
        EzEvent.ezEventListener.source = this;
        EzEvent.ezEventListener.eventType = EzEvent.MAP_PANINFOWINDOW;
        EzEvent.panInfoleftOffset = Math.round(f.x - c.x);
        EzEvent.panInfotopOffset = Math.round(c.y - f.y);
        EzEvent.trigger(EzEvent.ezEventListener, EzEvent);
        this.recenterOrPanToBitmap(f)
    }
    this.bIsInScreen = false
};
MainFrame.prototype.repositionInfoWindow = function () {
    if (this.disablePopups || (!this.infoWindow.isVisible() || !this.infoWindow.point)) {
        return
    }
    var c = this.infoWindow.point;
    var d = this.baseLayer.convertMap2Bitmap(c.x, c.y, this.realZoomLevel);
    var b = this.getDivCoordinate(d.x, d.y, we);
    this.infoWindow.positionAt(b.x, b.y, this.infoWindow.iconClass)
};
MainFrame.prototype.getVMLPathString = function (f) {
    Timer.start("Map", "getVMLPathString");
    var c = new Array();
    c.push("m");
    c.push(f.polyline.points[0]);
    c.push(f.polyline.points[1]);
    c.push("l");
    c = c.concat(f.polyline.points);
    for (var b = 0; b < f.segments.length; b++) {
        var e = f.segments[b].pointIndex << 1;
        var h = e + 4;
        var i = c[h];
        var d = c[h + 1];
        c[h] = i + " " + d + " e m";
        c[h + 1] = i + " " + d + " l"
    }
    c.push("e");
    var g = c.join(" ");
    Timer.end("Map", "getVMLPathString");
    return g
};
MainFrame.prototype.createTrackVML = function (h, c, g) {
    Timer.start("Map", "createTrackVML");
    var e = "polylineVML";
    var f = getEleByID(e);
    if (!f) {
        f = document.createElement("v:polyline");
        f.id = "polylineVML";
        f.points = h;
        f.style.position = "absolute";
        f.style.zIndex = 1088;
        f.filled = false;
        f.strokeColor = _LineColor;
        f.strokeWeight = _LineWidth + "pt";
        var b = document.createElement("v:stroke");
        b.opacity = 1;
        b.startarrowwidth = "wide";
        b.endarrowwidth = "wide";
        b.startarrowlength = "long";
        b.endarrowlength = "long";
        b.startarrow = "oval";
        b.endarrow = "classic";
        f.appendChild(b)
    } else {
        var d = f;
        c.removeChild(d);
        f = d;
        f.strokeColor = _LineColor;
        f.strokeWeight = _LineWidth + "pt"
    }
    f.points = h;
    c.appendChild(f);
    Timer.end("Map", "createTrackVML");
    return g
};
MainFrame.prototype.getPathCenter = function (c) {
    var b = this.getPathMBR(c);
    return b.centerPoint()
};
MainFrame.prototype.getPathMBR = EzServerClient.GlobeFunction.getPathMBR;
MainFrame.prototype.centerAndZoomToBorder = function (b) {
    if (typeof b == "undefined" || b == null || b == "") {
        return
    }
    b = Trim(b);
    var g = b.split(";");
    var j = null;
    if (this.borderVML && this.borderVML != null) {
        for (var d = 0; d < this.borderVML.length; d++) {
            var c = this.borderVML[d];
            this.removeOverlay(c)
        }
        this.borderVML.clear()
    } else {
        this.borderVML = new Array()
    }
    for (var e = 0; e < g.length; e++) {
        var h = g[e];
        if (h == "") {
            continue
        }
        if (e == 0) {
            j = this.getPathMBR(h)
        } else {
            var f = this.getPathMBR(h);
            j.extend(f)
        }
        var c = this.createBorder(h, false);
        if (c != null) {
            this.borderVML.push(c)
        }
    }
    this.centerAtMBR(j.minX, j.minY, j.maxX, j.maxY);
    for (var d = 0; d < this.borderVML.length; d++) {
        var c = this.borderVML[d];
        c.flash(false)
    }
};
MainFrame.prototype.createBorder = function (f, b) {
    var d = f.split(",");
    var c;
    var e = null;
    if (d.length == 3) {
        e = Circle
    } else {
        if (d.length == 4) {
            e = Rectangle
        } else {
            if (d.length >= 6) {
                e = Polygon
            }
        }
    }
    c = new e(f, "red", 4, 0.5, "blue");
    this.addOverlay(c);
    if (b) {
        c.flash(false)
    }
    return c
};
MainFrame.prototype.convert2Div = function (g) {
    var c = this;
    var b = g.length;
    var f = new Array();
    for (var d = 0; d < b / 2; d++) {
        var e = c.getDivCoord(g[2 * d], g[2 * d + 1]);
        f.push(e.x);
        f.push(e.y);
        delete e
    }
    return f
};
MainFrame.prototype.drawOval = function (g) {
    var j = this;
    var e = j.getVMLContainer();
    var m = j.getDivCoord(g[0], g[1]);
    var c = parseFloat(g[0]) + parseFloat(g[2]);
    var i = j.getDivCoord(c, g[1]);
    var k = Math.abs(i.x - m.x);
    var h = m.x - k;
    var f = m.y - k;
    var d = 2 * k;
    var b = 2 * k;
    var l = e.drawOval(h, f, d, b);
    return l
};
MainFrame.prototype.drawPolygon = function (f) {
    var b = this;
    var e = b.getVMLContainer();
    var c = e.drawPolygon();
    var d = this.convert2Div(f);
    c.points.value = d;
    delete d;
    return c
};
MainFrame.prototype.drawPolyline = function (e) {
    var b = this;
    var d = b.getVMLContainer();
    var c = d.drawPolyline();
    c.points.value = this.convert2Div(e);
    return c
};
MainFrame.prototype.drawRect = function (g) {
    var i = this;
    var d = i.getVMLContainer();
    var k = i.getDivCoord(g[0], g[1]);
    var j = i.getDivCoord(g[2], g[3]);
    var h = Math.min(k.x, j.x);
    var f = Math.min(k.y, j.y);
    var c = Math.abs(k.x - j.x);
    var b = Math.abs(k.y - j.y);
    var e = d.drawRect(h, f, c, b);
    return e
};
MainFrame.prototype.getVMLContainer = function () {
    if (!this.vmlContainer) {
        this.vmlContainer = this.createVMLContainer(this.div)
    }
    this.refreshVMLGraphics();
    return this.vmlContainer
};
MainFrame.prototype.getTrackVMLContainer = function () {
    if (!this.trackVmlContainer) {
        this.trackVmlContainer = this.createVMLContainer(this.div)
    }
    this.trackVmlContainer.groupObj.style.filter = "";
    return this.trackVmlContainer
};
MainFrame.prototype.createVMLContainer = function (b) {
    var c = this.viewSize.width;
    var g = this.viewSize.height;
    var f;
    try {
        if (_VMLInMap) {
            f = new vmlGraphics(0, 0, c, g, b);
            f.setScale(1);
            f.groupObj.style.filter = "alpha(opacity=50,style=0)"
        } else {
            f = new vmlGraphics(0, 0, c, g, b);
            f.groupObj.style.filter = "alpha(opacity=50,style=0)"
        }
    } catch (d) {
        alert("创建VML出现错误!")
    } finally {
        f.groupObj.style.zIndex = _overLayIndex - 10;
        f.groupObj.unselectable = "on";
        f.setFillColor("blue");
        f.setStroke("red", 2)
    }
    return f
};
MainFrame.prototype.clearVMLContainer = function () {
    if (this.vmlContainer && this.vmlContainer.groupObj) {
        RemoveChildren(this.vmlContainer.groupObj)
    }
};
MainFrame.prototype.refreshVMLGraphics = function () {
    Timer.start("Map", "refreshVMLGraphics");
    var l = this.centerBitmap;
    var j = this.getDivCoordinate(l.x, l.y, we);
    var g = 100;
    var e = 100;
    var n = this.getCenterLatLng();
    var f = this.baseLayer.tileInfo.levelDetails[this.realZoomLevel].resolution;
    var d = this.vmlContainer;
    if (!d) {
        return
    }
    if (_VMLInMap) {
        var i = parseInt(this.div.style.left);
        var h = parseInt(this.div.style.top);
        var c = this.viewSize.width;
        var b = this.viewSize.height;
        d.groupObj.style.left = convert2Px(-i + c / 2);
        d.groupObj.style.top = convert2Px(h + b / 2);
        d.groupObj.style.width = convert2Px(c);
        d.groupObj.style.height = convert2Px(b);
        d.setOrigin(n.x * 100000, n.y * 100000);
        d.setOriginSize(100000 * c * f.x, 100000 * b * f.y)
    } else {
        var i = parseInt(this.div.style.left);
        var h = parseInt(this.div.style.top);
        d.groupObj.style.left = convert2Px(-i);
        d.groupObj.style.top = convert2Px(-h);
        var c = this.viewSize.width;
        var b = this.viewSize.height;
        d.groupObj.style.width = convert2Px(c);
        d.groupObj.style.height = convert2Px(b);
        d.setOrigin(0, 0);
        d.setOriginSize(c, b)
    }
    Timer.end("Map", "refreshVMLGraphics")
};
MainFrame.prototype.showMapControl = function (b) {
    if (!this.mapControl) {
        var c = this.createMapControl();
        c.style.position = "absolute";
        setClass(c, "noprint");
        this.container.appendChild(c);
        this.mapControl = c
    } else {
        this.container.removeChild(this.mapControl);
        var c = this.createMapControl();
        c.style.position = "absolute";
        setClass(c, "noprint");
        this.container.appendChild(c);
        this.mapControl = c
    }
    if (b == "right") {
        this.mapControl.style.right = convert2Px(58);
        this.mapControl.style.top = convert2Px(8)
    } else {
        this.mapControl.style.left = convert2Px(8);
        this.mapControl.style.top = convert2Px(8)
    }
};
MainFrame.prototype.hideMapControl = function () {
    if (this.mapControl) {
        this.mapControl.style.display = "none"
    }
};
MainFrame.prototype.hideMapScale = function () {
    var c = this.mapScale;
    if (c) {
        for (var b = 0; b < c.length; b++) {
            c[b].style.display = "none"
        }
    }
};
MainFrame.prototype.showMapScale = function () {
    var c = this.mapScale;
    if (c) {
        for (var b = 0; b < c.length; b++) {
            c[b].style.display = ""
        }
    } else {
        this.createMapScale()
    }
};
MainFrame.prototype.createMapControl = function () {
    var b = document.createElement("div");
    if (typeof _bIsShowMapControl != "undefined" && _bIsShowMapControl == true) {
        this.createPanningControls(b)
    }
    this.createZoomControls(b);
    this.createZoomSlider(b);
    return b
};
MainFrame.prototype.showSmallMapControl = function (b) {
    if (!this.mapControl) {
        var c = this.createSmallMapControl();
        c.style.position = "absolute";
        setClass(c, "noprint");
        this.container.appendChild(c);
        this.mapControl = c
    } else {
        this.container.removeChild(this.mapControl);
        var c = this.createSmallMapControl();
        c.style.position = "absolute";
        setClass(c, "noprint");
        this.container.appendChild(c);
        this.mapControl = c
    }
    if (b == "right") {
        this.mapControl.style.right = convert2Px(58);
        this.mapControl.style.top = convert2Px(8)
    } else {
        this.mapControl.style.left = convert2Px(8);
        this.mapControl.style.top = convert2Px(8)
    }
};
MainFrame.prototype.showStandMapControl = function (b) {
    if (!this.mapControl) {
        var c = this.createStandMapControl();
        c.style.position = "absolute";
        setClass(c, "noprint");
        this.container.appendChild(c);
        this.mapControl = c
    } else {
        this.container.removeChild(this.mapControl);
        var c = this.createStandMapControl();
        c.style.position = "absolute";
        setClass(c, "noprint");
        this.container.appendChild(c);
        this.mapControl = c
    }
    if (b == "right") {
        this.mapControl.style.right = convert2Px(58);
        this.mapControl.style.top = convert2Px(8)
    } else {
        this.mapControl.style.left = convert2Px(8);
        this.mapControl.style.top = convert2Px(8)
    }
};
MainFrame.prototype.createSmallMapControl = function () {
    var b = document.createElement("div");
    this.createSmallPanningControls(b);
    this.createSmallZoomControls(b);
    return b
};
MainFrame.prototype.createStandMapControl = function () {
    var b = document.createElement("div");
    var c = document.createElement("div");
    c.style.position = "absolute";
    setClass(c, "NPMap-standPan");
    b.appendChild(c);
    this.createPanningControls(c);
    this.createZoomControls(b);
    this.createZoomSlider(b);
    return b
};
MainFrame.prototype.createZoomControls = function (e) {
    var b = this;
    /*var c = divCreator.create(hi, 15, 15, 20, 70, 1, false);*///zoom-plus
    var c = document.createElement("div");
    c.style.position = "absolute";
    setClass(c, "NPMap-panZoomplus");
    c.setAttribute("title", "放大一级");
    setCursor(c, "pointer");
    BindingEvent(c, "click", function (g) {
        if (EzServerClient.GlobeParams.ZoomLevelSequence == 0 || EzServerClient.GlobeParams.ZoomLevelSequence == 3) {
            b.zoomTo(b.getZoomLevel() - 1)
        } else {
            if (EzServerClient.GlobeParams.ZoomLevelSequence == 1 || EzServerClient.GlobeParams.ZoomLevelSequence == 2 || EzServerClient.GlobeParams.ZoomLevelSequence == 4) {
                b.zoomTo(b.getZoomLevel() + 1)
            }
        }
        S(g)
    });
    c.title = _mZoomIn;
    e.appendChild(c);
    var d = 100 + (iSliderH) * ((_MaxLevel + 1) / iMaxLevel);
    /*var f = divCreator.create(Zh, 15, 15, 20, d, 1, false);*///zoom-minus
    var f = document.createElement("div");
    f.style.position = "absolute";
    f.style.top = convert2Px(d - 20 - 11);
    setClass(f, "NPMap-panZoomminus");
    f.setAttribute("title", "缩小一级");
    setCursor(f, "pointer");
    BindingEvent(f, "click", function (g) {
        if (EzServerClient.GlobeParams.ZoomLevelSequence == 0 || EzServerClient.GlobeParams.ZoomLevelSequence == 3) {
            b.zoomTo(b.getZoomLevel() + 1)
        } else {
            if (EzServerClient.GlobeParams.ZoomLevelSequence == 1 || EzServerClient.GlobeParams.ZoomLevelSequence == 2 || EzServerClient.GlobeParams.ZoomLevelSequence == 4) {
                b.zoomTo(b.getZoomLevel() - 1)
            }
        }
        S(g)
    });
    f.title = _mZoomOut;
    e.appendChild(f)
};
MainFrame.prototype.createPanningControls = function (i) {
    var f = this;
    var j = divCreator.create(Gi, 59, 64, 0, 0, 0, false);
    /*var b = divCreator.create(jg, 17, 17, 20, 0, 1, false);*///north
    var b = document.createElement('div');
    setClass(b, "NPMap-button NPMap-panN");
    b.setAttribute("title", "向上移动");
    setCursor(b, "pointer");
    BindingEvent(b, "mouseover", function (g) {
        i.style.backgroundPosition = "0px -44px";
    });
    BindingEvent(b, "mouseout", function (g) {
        i.style.backgroundPosition = "0px 0px";
    });
    BindingEvent(b, "click", function (g) {
        f.pan(0, -Math.floor(f.viewSize.height * 0.5));
        S(g)
    });
    b.title = _mPanNorth;
    i.appendChild(b);
    /*var e = divCreator.create(pi, 17, 17, 40, 20, 1, false);*///east
    var e = document.createElement('div');
    setClass(e, "NPMap-button NPMap-panE");
    e.setAttribute("title", "向右移动");
    setCursor(e, "pointer");
    BindingEvent(e, "mouseover", function (g) {
        i.style.backgroundPosition = "0px -88px";
    });
    BindingEvent(e, "mouseout", function (g) {
        i.style.backgroundPosition = "0px 0px";
    });
    BindingEvent(e, "click", function (g) {
        f.pan(-Math.floor(f.viewSize.width * 0.5), 0);
        S(g)
    });
    e.title = _mPanEast;
    i.appendChild(e);
    /*var h = divCreator.create(ni, 17, 17, 20, 40, 1, false);*///south
    var h = document.createElement('div');
    setClass(h, "NPMap-button NPMap-panS");
    h.setAttribute("title", "向南移动");
    setCursor(h, "pointer");
    BindingEvent(h, "mouseover", function (g) {
        this.parentNode.style.backgroundPosition = "0px -132px";
    });
    BindingEvent(h, "mouseout", function (g) {
        i.style.backgroundPosition = "0px 0px";
    });
    BindingEvent(h, "click", function (g) {
        f.pan(0, Math.floor(f.viewSize.height * 0.5));
        S(g)
    });
    h.title = _mPanSouth;
    i.appendChild(h);
    /*var d = divCreator.create(Yh, 17, 17, 0, 20, 1, false);*///west
    var d = document.createElement('div');
    setClass(d, "NPMap-button NPMap-panW");
    d.setAttribute("title", "向左移动");
    setCursor(d, "pointer");
    BindingEvent(d, "mouseover", function (g) {
        i.style.backgroundPosition = "0px -176px";
    });
    BindingEvent(d, "mouseout", function (g) {
        i.style.backgroundPosition = "0px 0px";
    });
    BindingEvent(d, "click", function (g) {
        f.pan(Math.floor(f.viewSize.width * 0.5), 0);
        S(g)
    });
    d.title = _mPanWest;
    i.appendChild(d);
    /*var c = divCreator.create(kh, 17, 17, 20, 20, 1, false);*///center
    var c = document.createElement('div');
    setClass(c, "NPMap-button NPMap-panC");
    setCursor(c, "pointer");
    BindingEvent(c, "mouseover", function (g) {
        i.style.backgroundPosition = "0px 0px";
    });
    BindingEvent(c, "mouseout", function (g) {
        i.style.backgroundPosition = "0px 0px";
    });
    BindingEvent(c, "click", function (g) {
        var k = _MapCenterPoint;
        f.centerAndZoom(k, f.getZoomLevel());
        S(g)
    });
    c.title = _mLastResult;
    i.appendChild(c)
};
MainFrame.prototype.createZoomSlider = function (c) {
    var a = this;
    var e = EzServerClient.GlobeParams.MapMaxLevel - EzServerClient.GlobeParams.MapInitLevel;
    var d = EzServerClient.GlobeParams.InnerMaxZoomLevel - EzServerClient.GlobeParams.MapMaxLevel;
    var f = document.createElement("div");
    /*f.style.position = "absolute";
    f.style.flowposition = "absolute";
    f.style.left = convert2Px(9);
    f.style.top = convert2Px(90);
    f.style.width = convert2Px(37);*/
    setClass(f, "NPMap-zoomslider");
    iHeight = iSliderH * ((_MaxLevel + 1) / iMaxLevel) + 1;
    f.style.height = convert2Px(iHeight);
    f.style.overflow = "hidden";
    var j = 0;
    var h = this;
    var k = new MBR(j, 0, j + 37, iSliderH * ((_MaxLevel + 1) / iMaxLevel) + 3);
    /*var l = divCreator.create(Gh, 37, 14, j, 10, 2, false)*/;
    var l = document.createElement("div");
    setClass(l, "NPMap-sliderbar");
    l.title = _mZoomDrag;
    switch (EzServerClient.GlobeParams.ZoomLevelSequence) {
        case 0:
        case 3:
            var i = divCreator.create(EzServerClient.GlobeParams.ei_descend22, 15, iSliderH, 11, 1, 1, false);
            break;
        case 1:
        case 2:
            /*var i = divCreator.create(EzServerClient.GlobeParams.ei_ascend22, 15, iSliderH, 11, 0, 1, false);*/
            var i = document.createElement("div");
            setClass(i, "NPMap-slidermask");
            i.style.height = convert2Px(iSliderH);
            i.style.top = convert2Px(0);
            i.style.top = parseInt(i.style.top) - d * 12;
            i.style.clip = "rect(" + (12 * d) + "px 50px 277px 0px)";
            BindingEvent(i, "click", function (g) {
                var toZoom = a.getZoomFromRelativeCoord(parseInt(this.parentNode.style.height) - g.offsetY);
                a.zoomTo(toZoom);
            });
            break
    }
    setCursor(i, "pointer");
    i.title = _mZoomSet;
    f.appendChild(i);
    f.appendChild(l);
    c.appendChild(f);
    var b = new DragEvent(l, j, EzServerClient.GlobeFunction.zoomLevel2sliderPixelPosition(this.getZoomLevel(), EzServerClient.GlobeParams.PerZoomLevelPixel, EzServerClient.GlobeParams.MapMaxLevel, EzServerClient.GlobeParams.ZoomLevelSequence), k);
    this.onzoom = function () {
        b.moveTo(j, EzServerClient.GlobeFunction.zoomLevel2sliderPixelPosition(this.getZoomLevel(), EzServerClient.GlobeParams.PerZoomLevelPixel, EzServerClient.GlobeParams.MapMaxLevel, EzServerClient.GlobeParams.ZoomLevelSequence))
    };
    b.ondragend = function () {
        var m = b.top + 5;
        var g = EzServerClient.GlobeFunction.sliderPixelPosition2ZoomLevel(m, EzServerClient.GlobeParams.PerZoomLevelPixel, EzServerClient.GlobeParams.MapMaxLevel, EzServerClient.GlobeParams.ZoomLevelSequence);
        h.zoomTo(g)
    };
    BindingEvent(i, "click", function (g) {
        var n;
        if (window.event) {
            n = window.event.offsetY
        } else {
            var m = ObjectOffset(f);
            n = g.pageY - m.y - 2
        }
        S(g);
        var q = EzServerClient.GlobeFunction.sliderPixelPosition2ZoomLevel(n, EzServerClient.GlobeParams.PerZoomLevelPixel, EzServerClient.GlobeParams.InnerMaxZoomLevel, EzServerClient.GlobeParams.ZoomLevelSequence);
        h.zoomTo(q)
    })
};
MainFrame.prototype.getRelativeZoomSliderPos = function (b) {
    var c;
    if (typeof b != "undefined") {
        c = b * 12
    } else {
        c = this.realZoomLevel * 12
    }
    return c
};
MainFrame.prototype.getZoomFromRelativeCoord = function (c) {
    var b = Math.floor((c - 1) / 12);
    return Math.max(0, Math.min(this.baseLayer.maxZoomLevel + 1, b))
};
MainFrame.prototype.getRoutePath = function () {
    if (!this.routeArray) {
        return null
    }
    var c = this.routeArray.length;
    var f, i, h;
    var e = this.div.style.left;
    var d = this.div.style.top;
    var b = new Date();
    for (var g = 0; g < c; g++) {
        pMonitorInfo = this.routeArray[g];
        pPoint = this.getDivCoord(pMonitorInfo.lon, pMonitorInfo.lat);
        i = pPoint.x - parseInt(e);
        h = pPoint.y - parseInt(d);
        if (!f) {
            f = i + "," + h
        } else {
            f = f + "," + i + "," + h
        }
    }
    var j = new Date();
    return f
};
MainFrame.prototype.showMapServerControl = function () {
    var h = [];
    var d = this;
    var f = 10;
    var g = 70;
    var c = 10;
    var b = null;
    for (var e = this.groupLayers.length - 1; e >= 0; e--) {
        b = new MapServerControl(this.groupLayers[e].getName());
        b.style.top = convert2Px(3);
        b.style.right = convert2Px(f);
        setClass(b, "noprint");
        EzServerClient.GlobeFunction.addMapServer(d, b, this.groupLayers[e]);
        h.push(b);
        this.container.appendChild(b);
        g = b.offsetWidth;
        f = f + g + c
    }
    b.children[0].style.fontWeight = "bolder";
    this.mapServer = h
};
MainFrame.prototype.setMapSource = function (b) {
    this.baseGroupLayer = b;
    this.baseLayer = b.getLayers()[0];
    this.initializeMap()
};
MainFrame.prototype.createServerControl = function (b) {
    var d = document.createElement("div");
    d.onselectstart = _NoAction;
    d.className = "mapServerControl";
    var c = document.createElement("div");
    c.className = "mapServerControlShadow";
    c.innerHTML = b;
    c.noWrap = true;
    d.appendChild(c);
    return d
};
MainFrame.prototype.showButtonTip = function () {
    var b = this.createDiv("点击右键结束");
    b.style.backgroundColor = "#004C78";
    b.style.border = "1px solid red";
    b.noWrap = true;
    b.style.zIndex = 10000;
    b.style.display = "none";
    this.container.appendChild(b);
    this.buttonTip = b
};
MainFrame.prototype.showCopyright = function () {
    if (!this.copyRightLabel) {
        var b = this.createDiv(_mCopyright);
        b.style.left = convert2Px(3);
        b.style.bottom = convert2Px(3);
        this.container.appendChild(b);
        this.copyRightLabel = b;
        setClass(this.copyRightLabel, "noprint")
    }
    this.copyRightLabel.style.display = ""
};
MainFrame.prototype.createMapScale = function () {
    if (this.mapScale != null) {
        return
    }
    var c = new Array();
    var b = "1:" + _m_MapBottomScale * Math.pow(2, this.realZoomLevel);
    this.scaleTxt = document.createElement("div");
    this.scaleTxt.style.border = "1px solid #000";
    this.scaleTxt.style.fontSize = "2px";
    this.scaleTxt.style.position = "absolute";
    this.scaleTxt.style.backgroundColor = "black";
    this.scaleTxt.style.right = convert2Px(50);
    this.scaleTxt.style.bottom = convert2Px(13);
    this.scaleTxt.style.width = "100px";
    this.scaleTxt.style.height = "2px";
    setClass(this.scaleTxt, "noprint");
    this.container.appendChild(this.scaleTxt);
    c.push(this.scaleTxt);
    this.scaleRightTxt = createTxt("");
    this.scaleRightTxt.style.right = convert2Px(50);
    this.scaleRightTxt.style.bottom = convert2Px(23);
    this.container.appendChild(this.scaleRightTxt);
    setClass(this.scaleRightTxt, "noprint");
    c.push(this.scaleRightTxt);
    this.mapScale = c;
    this.refreshMapScale();
    if (typeof bIsFloatFuncLoaded != "undefined" && bIsFloatFuncLoaded && typeof _bIsResultTable != "undefined" && _bIsResultTable) {
        this.floatResultDiv = initFloatDiv(240, 300, document.body)
    }
};
MainFrame.prototype.showInfoFrame = function (d, c) {
    var b = d.monitor;
    if (this.pWinInfo) {
        delete this.pWinInfo;
        this.pWinInfo = null
    }
    this.openInfoWindow(b.lon, b.lat, b, c)
};
MainFrame.prototype.openInfoWindow = function (g, f, c, e) {
    var b = new Icon("eleInfo", 150, 150, new Point(10, 10), new Point(10, 10), new Point(10, 10), "ffff", 30, null);
    var d = new IconInfo("", b);
    this.pWinInfo = new InfoObj("wowo", new Point(g, f), d, "size=44", c);
    this.pWinInfo.bIsVisable = true;
    this.bInfoHasCloseClick = false;
    this.bIsInScreen = e;
    this.showInfoWindow(this.pWinInfo)
};
MainFrame.prototype.hideInfoFrame = function () {
    this.infoResultDiv.style.display = "none"
};
MainFrame.prototype.createDiv = function (b) {
    var c = document.createElement("div");
    c.style.position = "absolute";
    setCursor(c, "default");
    c.unselectable = "on";
    c.onselectstart = _NoAction;
    c.innerHTML = b;
    c.style.fontSize = convert2Px(11);
    c.style.fontFamily = "Arial, sans serif";
    c.style.MozUserSelect = "none";
    c.style.color = "red";
    return c
};

MainFrame.prototype.setCopyright = function (info) {
    this.copyRightLabel.innerHTML = info;
};

MainFrame.prototype.hideCopyright = function () {
    if (this.copyRightLabel) {
        this.copyRightLabel.style.display = "none"
    }
};
MainFrame.prototype.hideMapServer = function () {
    var c = this.mapServer;
    if (c) {
        for (var b = 0; b < c.length; b++) {
            c[b].style.display = "none"
        }
    }
};
MainFrame.prototype.showMapServer = function () {
    var c = this.mapServer;
    if (c) {
        for (var b = 0; b < c.length; b++) {
            c[b].style.display = ""
        }
    }
};
MainFrame.prototype.createScaleImg = function (b) {
    var d = document.createElement("div");
    d.style.position = "absolute";
    setCursor(d, "default");
    d.unselectable = "on";
    d.onselectstart = _NoAction;
    var c = document.createElement("img");
    c.src = b;
    d.appendChild(c);
    return d
};
MainFrame.prototype.createSmallPanningControls = function (b) {
    return this.createPanningControls(b)
};
MainFrame.prototype.createSmallZoomControls = function (e) {
    var b = this;
    var c = divCreator.create(hi, 15, 15, 20, 70, 1, false);
    setCursor(c, "pointer");
    BindingEvent(c, "click", function (g) {
        if (EzServerClient.GlobeParams.ZoomLevelSequence == 0 || EzServerClient.GlobeParams.ZoomLevelSequence == 3) {
            b.zoomTo(b.getZoomLevel() - 1)
        } else {
            if (EzServerClient.GlobeParams.ZoomLevelSequence == 1 || EzServerClient.GlobeParams.ZoomLevelSequence == 2 || EzServerClient.GlobeParams.ZoomLevelSequence == 4) {
                b.zoomTo(b.getZoomLevel() + 1)
            }
        }
        S(g)
    });
    c.title = _mZoomIn;
    e.appendChild(c);
    var d = 100;
    var f = divCreator.create(Zh, 15, 15, 20, d, 1, false);
    setCursor(f, "pointer");
    BindingEvent(f, "click", function (g) {
        if (EzServerClient.GlobeParams.ZoomLevelSequence == 0 || EzServerClient.GlobeParams.ZoomLevelSequence == 3) {
            b.zoomTo(b.getZoomLevel() + 1)
        } else {
            if (EzServerClient.GlobeParams.ZoomLevelSequence == 1 || EzServerClient.GlobeParams.ZoomLevelSequence == 2 || EzServerClient.GlobeParams.ZoomLevelSequence == 4) {
                b.zoomTo(b.getZoomLevel() - 1)
            }
        }
        S(g)
    });
    f.title = _mZoomOut;
    e.appendChild(f)
};
MainFrame.prototype.changeDragMode = function (f, b, d, g) {
    var e = this;
    e.bIsPan = true;
    if (b) {
        e.outputPanel = b
    } else {
        e.outputPanel = new EzPointStr()
    }
    if (e.buttonTip != null) {
        e.buttonTip.style.display = "none";
    }
    var c = null;
    if (d) {
        e.outputPanel2 = d
    } else {
        e.outputPanel2 = null
    }
    if (e.vmlDraw != null && f != "pan") {
        this.removeOverlay(e.vmlDraw);
        e.vmlDraw = null
    }
    if (f == "measure") {
        this.measureLength(g);
        return
    } else {
        if (f == "pan") {
            e.container.style.cursor = "move";
            e.dragObject.ondrag = e.eventHandler("onDrag");
            e.dragObject.ondragstart = e.eventHandler("onDragStart");
            e.dragObject.ondragend = e.eventHandler("onDragEnd");
            c = e.dragObject.eventHandler("onMouseDown");
            if (e.dragObject.mouseMoveHandler) {
                unbindingEvent(e.dragObject.src, "mousemove", e.dragObject.mouseMoveHandler)
            }
            e.dragObject.mouseMoveHandler = e.dragObject.eventHandler("onMouseMove")
        } else {
            if (f == "drawRect" || f == "drawCircle" || f == "zoomInExt" || f == "zoomOutExt") {
                if (f == "drawRect" || f == "drawCircle") {
                    e.container.style.cursor = "crosshair"
                } else {
                    f = "drawRect";
                    e.bIsPan = false
                }
                e.dragObject.ondragstart = e.eventHandler("drawStart");
                e.dragObject.ondragend = e.eventHandler("drawEnd");
                if (e.dragObject.mouseMoveHandler) {
                    unbindingEvent(e.dragObject.src, "mousemove", e.dragObject.mouseMoveHandler)
                }
                e.dragObject.mouseMoveHandler = e.eventHandler("drawMove");
                BindingEvent(e.dragObject.src, "mousemove", e.dragObject.mouseMoveHandler);
                c = e.dragObject.eventHandler("onMouseDown")
            } else {
                if (f == "drawPolyline" || f == "drawPolygon") {
                    e.container.style.cursor = "crosshair";
                    e.dragObject.ondragstart = null;
                    e.dragObject.ondragend = null;
                    e.dragObject.mouseMoveHandler = null;
                    c = e.eventHandler("drawMouseDown");
                    if (e.dragObject.mouseMoveHandler) {
                        unbindingEvent(e.dragObject.src, "mousemove", e.dragObject.mouseMoveHandler)
                    }
                    e.dragObject.mouseMoveHandler = e.eventHandler("drawMove");
                    BindingEvent(e.dragObject.src, "mousemove", e.dragObject.mouseMoveHandler)
                } else {
                    if (f == "drawPoint") {
                        e.container.style.cursor = "crosshair";
                        e.dragObject.ondragstart = null;
                        e.dragObject.ondragend = null;
                        e.dragObject.mouseMoveHandler = null;
                        c = e.eventHandler("drawMouseDown")
                    }
                }
            }
        }
    }
    if (e.dragObject.mouseDownHandler) {
        unbindingEvent(e.dragObject.src, "mousedown", e.dragObject.mouseDownHandler)
    }
    e.dragObject.mouseDownHandler = c;
    BindingEvent(e.dragObject.src, "mousedown", e.dragObject.mouseDownHandler);
    e.drawMode = f;
    if (f != "pan") {
        _callback = g;
        e.dragObject.bIsPan = false
    } else {
        e.dragObject.bIsPan = true
    }
    this.setTimeout("this.container.focus()", 100)
};
MainFrame.prototype.measureLength = function (d) {
    this.container.style.cursor = "crosshair";
    var b = this;
    function c() {
        if (!b.vmlDraw) {
            return
        }
        iLength = b.vmlDraw.getLength();
        iLength = Math.ceil(iLength);
        var e = "";
        if (iLength > 1000) {
            iLength = iLength / 1000;
            e = iLength + "公里"
        } else {
            e = iLength + "米"
        }
        if (typeof d == "function") {
            d(e)
        } else {
            alert("距离总长:" + e)
        }
    }
    this.changeDragMode("drawPolyline", null, null, c)
};
MainFrame.prototype.measureArea = function (d) {
    this.container.style.cursor = "crosshair";
    var b = this;
    function c() {
        if (!b.vmlDraw) {
            return
        }
        var f = b.vmlDraw.getArea();
        f = Math.ceil(f);
        var e = "";
        if (f > 1000000) {
            f = f / 1000000;
            e = f + "平方公里"
        } else {
            e = f + "平方米"
        }
        if (typeof d == "function") {
            d(e)
        } else {
            alert("总面积为:" + e)
        }
    }
    this.changeDragMode("drawPolygon", null, null, c)
};
MainFrame.prototype.cancelTrackMonitorStepByStep = function () {
    if (this.trackTimeOut) {
        clearTimeout(this.trackTimeOut)
    }
};
MainFrame.prototype.convert2WPoint = function (b, d) {
    var c = this.getDivCoord(b, d);
    var b = c.x - parseInt(this.div.style.left);
    var d = c.y - parseInt(this.div.style.top);
    b = Math.round(b);
    d = Math.round(d);
    delete c;
    return new Point(b, d)
};
MainFrame.prototype.convert2LonLat = function (d, h) {
    var g = parseInt(this.div.style.left);
    var f = parseInt(this.div.style.top);
    var j = this.getBoundsLatLng();
    var e = this.baseLayer.convertPosByFlatMatrix(j.minX, j.minY);
    j.minX = e.x;
    j.minY = e.y;
    var c = this.baseLayer.convertPosByFlatMatrix(j.maxX, j.maxY);
    j.maxX = c.x;
    j.maxY = c.y;
    var k = j.minX + (d + g) / this.viewSize.width * j.getSpanX();
    var i = j.maxY - (h + f) / this.viewSize.height * j.getSpanY();
    var b = this.baseLayer.convertPosByFlatMatrixInverse(k, i);
    k = b.x;
    i = b.y;
    return new Point(k, i)
};
MainFrame.prototype.about = function () {
    var b = "版权所有(2002-2010) 北京山海经纬信息技术有限公司 www.easymap.com.cn.";
    alert(b)
};
MainFrame.prototype.addControl = function (b) {
    this.container.appendChild(b.div);
    if (b.init) {
        b.init(this)
    } else {
        b.init(this)
    }
};
MainFrame.prototype.showVersion = function (c) {
    var f = EzServerClient.GlobeParams.VersionArr[c];
    if (f != null) {
        if (f instanceof MapServer) {
            var e = EzServerClient.GlobeParams.MapSrcURL.length;
            var b = f.getMapServerURLCount();
            if (e > b) {
                EzServerClient.GlobeParams.MapSrcURL.splice(b, e - b)
            } else {
                if (e < b) {
                    for (var d = 0; d < b - e; d++) {
                        EzServerClient.GlobeParams.MapSrcURL.push([])
                    }
                }
            }
            for (var d = 0; d < b; d++) {
                EzServerClient.GlobeParams.MapSrcURL[d][0] = f.getMapDispName(d);
                EzServerClient.GlobeParams.MapSrcURL[d][1] = f.getMapServerURL(d)
            }
            _VectorMapService = EzServerClient.GlobeParams.MapSrcURL[0];
            this.hideMapServer();
            this.showMapServerControl();
            this.setMapSource(EzServerClient.GlobeParams.MapSrcURL[0])
        } else {
            if (f instanceof EzServerClient.GroupLayer) {
                var e = EzServerClient.GlobeParams.MapSrcURL.length;
                var b = f.getLayers().length;
                if (e > b) {
                    EzServerClient.GlobeParams.MapSrcURL.splice(b, e - b)
                } else {
                    if (e < b) {
                        for (var d = 0; d < b - e; d++) {
                            EzServerClient.GlobeParams.MapSrcURL.push([])
                        }
                    }
                }
                this.hideMapServer();
                this.showMapServerControl();
                this.setMapSource(f)
            } else {
                alert("没有[" + c + "]版本的数据！")
            }
        }
    } else {
        alert("没有版本数据！")
    }
};
MainFrame.prototype.containerCoord2Map = function (c) {
    try {
        return this.displayCoord(c)
    } catch (b) {
        throw b
    }
};
MainFrame.prototype.mapCoord2container = function (f) {
    var c = this.baseLayer.convertMap2Bitmap(f.x, f.y, this.realZoomLevel);
    var e = this.getBoundsBitmap();
    var d = c.x - e.minX;
    var b = e.maxY - c.y;
    return new Point(d / (e.maxX - e.minX) * this.viewSize.width, b / (e.maxY - e.minY) * this.viewSize.height)
};
MainFrame.prototype.getMouseMapX = function () {
    return this.mouseLng
};
MainFrame.prototype.getMouseMapY = function () {
    return this.mouseLat
};
EzServerClient.GlobeParams.MapLoadCheckHandle = null;
EzServerClient.GlobeFunction.mapImgLoadEventFunc = function (b) {
    return function () {
        var d = document.getElementsByName("ezmap_tilepicture_img");
        for (var c = 0; c < d.length; c++) {
            if (d[c].readyState == "loading") {
                return
            }
            if (d[c].readyState == "complete") {
                continue
            }
        }
        window.clearInterval(EzServerClient.GlobeParams.MapLoadCheckHandle);
        EzEvent.map = b.mapPeer;
        EzEvent.ezEventListener.source = b;
        EzEvent.ezEventListener.eventType = EzEvent.MAP_READY;
        EzEvent.trigger(EzEvent.ezEventListener, EzEvent)
    }
};
EzServerClient.GlobeFunction.addMapServer = function (d, c, b) {
    BindingEvent(c, "click", function (e) {
        d.setMapSource(b);
        var h = null;
        for (var f = 0; f < d.mapServer.length; f++) {
            h = d.mapServer[f];
            if (h == c) {
                h.children[0].style.fontWeight = "bolder";
                var g = d.currentMapServerIndex;
                d.currentMapServerIndex = d.mapServer.length - f - 1;
                EzEvent.mapServerIndexPrevious = g;
                EzEvent.mapServerIndex = d.currentMapServerIndex;
                EzEvent.ezEventListener.source = d;
                EzEvent.ezEventListener.eventType = EzEvent.MAP_SWITCHMAPSERVER;
                EzEvent.trigger(EzEvent.ezEventListener, EzEvent)
            } else {
                h.children[0].style.fontWeight = ""
            }
        }
    })
};
EzServerClient.GlobeFunction.sliderPixelPosition2ZoomLevel = function (c, b, d, e) {
    switch (e) {
        case 0:
        case 3:
            return Math.floor(c / b);
        case 1:
        case 2:
            return d - Math.floor(c / b)
    }
};
EzServerClient.GlobeFunction.zoomLevel2sliderPixelPosition = function (d, b, c, e) {
    switch (e) {
        case 0:
        case 3:
            return b * d;
        case 1:
        case 2:
            return (c - d) * b
    }
};
MainFrame.prototype.onMapMouseDown = function (b) {

    EzEvent.ezEventListener.source = this;
    EzEvent.ezEventListener.eventType = EzEvent.MAP_MOUSEDOWN;
    EzEvent.trigger(EzEvent.ezEventListener, EzEvent)
};
MainFrame.prototype.onMapMouseMove = function (b) {
    var c = new Point(this.getMouseMapX(), this.getMouseMapY());
    EzEvent.ezEventListener.source = this;
    EzEvent.mapPoint = c;
    EzEvent.screenPoint = this.mapCoord2container(c);
    EzEvent.ezEventListener.eventType = EzEvent.MAP_MOUSEMOVE;
    EzEvent.trigger(EzEvent.ezEventListener, EzEvent)
};
MainFrame.prototype.onMapMouseOver = function (b) {
    EzEvent.ezEventListener.source = this;
    EzEvent.ezEventListener.eventType = EzEvent.MAP_MOUSEOVER;
    EzEvent.trigger(EzEvent.ezEventListener, EzEvent)
};
MainFrame.prototype.onMapMouseOut = function (b) {
    EzEvent.ezEventListener.source = this;
    EzEvent.ezEventListener.eventType = EzEvent.MAP_MOUSEOUT;
    EzEvent.trigger(EzEvent.ezEventListener, EzEvent)
};
MainFrame.prototype.onMapMouseUp = function (b) {
    EzEvent.ezEventListener.source = this;
    EzEvent.ezEventListener.eventType = EzEvent.MAP_MOUSEUP;
    EzEvent.trigger(EzEvent.ezEventListener, EzEvent)
};
MainFrame.prototype.addEventDiv = function () {
    var b = this;
    this.divEvent = document.createElement("div");
    this.divEvent.style.position = "absolute";
    this.divEvent.style.zIndex = 10;
    if (EzServerClient.GlobeParams.BrowserTypeAndVersion.indexOf("IE") != -1) {
        this.divEvent.style.filter = "alpha(opacity=0)";
        this.divEvent.style.backgroundColor = "transparent";
    }
    this.divEvent.tlOffset = 400;
    this.divEvent.style.width = this.viewSize.width + this.divEvent.tlOffset + "px";
    this.divEvent.style.height = this.viewSize.height + this.divEvent.tlOffset + "px";
    var c = b.getCenterLatLng();
    var d = b.convert2WPoint(c.x, c.y);
    this.divEvent.style.left = (d.x - this.viewSize.width / 2) - this.divEvent.tlOffset + "px";
    this.divEvent.style.top = (d.y - this.viewSize.height / 2) - this.divEvent.tlOffset + "px";
    this.div.appendChild(this.divEvent);
    this.addStateListener(function () {
        var e = b.getCenterLatLng();
        var f = b.convert2WPoint(e.x, e.y);
        b.divEvent.style.left = (f.x - b.viewSize.width / 2) - b.divEvent.tlOffset + "px";
        b.divEvent.style.top = (f.y - b.viewSize.height / 2) - b.divEvent.tlOffset + "px"
    })
};

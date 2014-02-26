// 覆盖物的Html生成
_CurentOverLay = null;
function iOverLay() {
    this.id;
    this.paths = null;
    this.points = new Array();
    this.point = null;
    this.iLen = null;
    this.iPause = null;
    this.timeInterval = 1000;
    this.bIsRepeat = false;
    this.bIsPlay = false;
    this.iZIndex = _overLayIndex;
    this.dispStatus = 1;
    this.startSeq = 0;
    this.endSeq = 0;
    this.dScale = 1;
    this.startScaleSeq = 0;
    this.endScaleSeq = 0;
    this.statusSet = new Array();
    this.dragObject = null;
    this.bIsSyRedraw = true;
    this.map = null;
    this.angle = 0;
    this.color = "red";
    this.opacity = 1;
    this.editable = false;
    this.bIsCenter = false
}
iOverLay.prototype.showPropertyEdit = function () {
    g_current_editor = this;
    if (this.editable == false) {
        return
    }
    getMapApp().showMenu();
    return false
};
iOverLay.prototype.setDivId = function (id) {
    if (this.div != null) {
        this.div.id = id;
    }
};
iOverLay.prototype.getZIndex = function () {
    return this.div.style.zIndex
};
iOverLay.prototype.setZIndex = function (a) {
    if (this.div != null) {
        this.div.style.zIndex = a
    }
};
iOverLay.prototype.synCreateDiv = function (a) {
    this.map = a;
    if (this.bIsSyRedraw == true) {
        this.setTimeout("this.createDiv()", 10)
    } else {
        this.createDiv()
    }
};
iOverLay.prototype.createDiv = function () {
};
iOverLay.prototype.synRedraw = function () {
    if (this.bIsSyRedraw == true) {
        this.setTimeout("this.synRedraw()", 10)
    } else {
        this.redraw()
    }
};
iOverLay.prototype.redraw = function () {
};
iOverLay.prototype.removeFromDiv = function () {
    if (this.pause) {
        this.pause()
    }
    if (this.map) {
        this.map.divPaint.removeChild(this.div);
        EventManager.removeNode(this.div);
        if (this.titleDiv != null) {
            this.map.divPaint.removeChild(this.titleDiv);
            EventManager.removeNode(this.titleDiv)
        }
    }
};
iOverLay.prototype.hide = function () {
    if (this.div != null) {
        this.div.style.display = "none"
    }
    if (this.titleDiv != null) {
        this.titleDiv.style.display = "none"
    }
};
iOverLay.prototype.show = function () {
    if (this.div != null) {
        this.div.style.display = ""
    }
    if (this.titleDiv != null) {
        this.titleDiv.style.display = ""
    }
};
iOverLay.prototype.isVisible = function () {
    return this.div.style.display != "none"
};
iOverLay.prototype.onclick = function () {
    this.div.fireEvent("onclick")
};
iOverLay.prototype.addListener = function (b, a) {
    if (this.div != null) {
        BindingEvent(this.div, b, a);
        this.div.style.cursor = "hand"
    }
    if (this.titleDiv) {
        BindingEvent(this.titleDiv, b, a);
        this.titleDiv.style.cursor = "hand"
    }
};
iOverLay.prototype.removeListener = function (b, a) {
    unbindingEvent(this.div, b, a);
    if (this.titleDiv) {
        unbindingEvent(this.titleDiv, b, a);
        this.titleDiv.style.cursor = ""
    }
};
iOverLay.prototype.removeAllListener = function () {
    EventManager.removeNode(this.div);
    if (this.titleDiv) {
        EventManager.removeNode(this.titleDiv);
        this.titleDiv.style.cursor = ""
    }
};
iOverLay.prototype.openInfoWindowHtml = function (a) {
    this.map.blowupOverlay(this);
    var b = new Point(getMap().mouseLng, getMap().mouseLat);
    this.map.openInfoWindow(b.x, b.y, a, true)
};
iOverLay.prototype.initPath = function (d) {
    if (typeof d != "undefined" && d != null) {
        this.points = trans2Points(d)
    }
    var a = this.points;
    for (var b = 0; b < a.length; b++) {
        var c = a[b];
        if (b == 0) {
            c.mileage = 0
        } else {
            c.countMileage(a[b - 1])
        }
    }
};
iOverLay.prototype.play = function (a) {
    if (a) {
        this.bIsCenter = a
    }
    this.drawInterval()
};
iOverLay.prototype.replay = function () {
    this.iPause = 0;
    this.drawInterval()
};
iOverLay.prototype.stop = function () {
    this.pause();
    this.dScale = 1;
    this.iPause = 0;
    this.redraw()
};
iOverLay.prototype.pause = function () {
    if (this.timeOut) {
        clearTimeout(this.timeOut);
        this.timeOut = null
    }
};
iOverLay.prototype.setInterval = function (a) {
    this.timeInterval = a
};
iOverLay.prototype.setRepeat = function (a) {
    this.bIsRepeat = a
};
iOverLay.prototype.drawInterval = function () {
    this.bIsPlay = true;
    if (this.iPause < this.endSeq) {
        this.iPause++
    } else {
        this.iPause = this.startSeq;
        if (!this.bIsRepeat) {
            return
        }
    }
    this.showStatus(this.iPause);
    if (typeof this.bIsCenter != "undefined" && this.bIsCenter) {
        if (this instanceof Marker || this instanceof Title) {
            this.map.recenterOrPanToLatLng(this.point)
        }
    }
    this.timeOut = this.setTimeout("this.drawInterval()", this.timeInterval)
};
iOverLay.prototype.getSPoints = function (j) {
    var h = this.points;
    var a = new Array();
    var b = h.length;
    var c = h[b - 1].mileage;
    var d = (j - this.startPath) / (this.endPath - this.startPath) * c;
    for (var g = 0; g < b - 1; g++) {
        if (h[g].mileage <= d) {
            a.push(h[g])
        }
        if (h[g + 1].mileage >= d) {
            var e = d - h[g].mileage;
            var f = Point.getDistPoint(h[g], h[g + 1], e);
            a.push(f);
            break
        }
    }
    return a
};
iOverLay.prototype.flash = function (a) {
    this.flashTimes = 0;
    this.bIsFilled = a;
    this.flashInterval(a)
};
iOverLay.prototype.flash2 = function (c, a) {
    try {
        this.flashTimes = 0;
        if (EzServerClient.GlobeFunction.isTypeRight(c, "int")) {
            this.flashEndtimes = c;
            this.flashInterval2(a)
        } else {
            if (EzServerClient.GlobeFunction.isTypeRight(c, "undefined")) {
                this.flashEndtimes = 3;
                this.flashInterval2(a)
            } else {
                throw EzErrorFactory.createError("iOverLay::flash方法中arguments[0]类型不正确")
            }
        }
    } catch (b) {
        throw EzErrorFactory.createError("iOverLay::flash方法中不正确", b)
    }
};
iOverLay.prototype.flashInterval2 = function (b) {
    var a = this.div;
    if (a == null) {
        return
    }
    if (this.flashTimes < this.flashEndtimes * 2) {
        this.flashTimes++;
        if (this.div.style.display == "") {
            this.div.style.display = "none"
        } else {
            this.div.style.display = ""
        }
    } else {
        this.div.style.display = "";
        if (typeof (b) != "undefined") {
            this.div.filled = b
        }
        return
    }
    this.setTimeout("this.flashInterval2(" + b + ")", 400)
};
iOverLay.prototype.refreshStatus = function () {
    if (this.dispStatus == 1) {
        if (this.div != null) {
            this.div.style.display = ""
        }
        if (this.titleDiv != null) {
            this.titleDiv.style.display = ""
        }
    } else {
        if (this.dispStatus == 2) {
            if (this.div != null) {
                this.div.style.display = "none"
            }
            if (this.titleDiv != null) {
                this.titleDiv.style.display = "none"
            }
        } else {
            if (this.dispStatus == 3) {
                this.flash()
            }
        }
    }
};
iOverLay.prototype.flashInterval = function (b) {
    var a = this.div;
    if (a == null) {
        return
    }
    if (this.flashTimes < 6) {
        this.flashTimes++;
        if (this.div.style.display == "") {
            this.div.style.display = "none"
        } else {
            this.div.style.display = ""
        }
    } else {
        this.div.style.display = "";
        if (typeof (this.bIsFilled) != "undefined") {
            this.div.filled = this.bIsFilled
        }
        return
    }
    this.flashTimeOut = this.setTimeout("this.flashInterval()", 400)
};
iOverLay.prototype.resetIcon = function (icon) {
    var a = this.div;
    if (a == null) {
        return
    }
    this.div.childNodes[0].src = icon;
};
iOverLay.prototype.scale = function (a) {
    if (typeof a == "string") {
        a = parseFloat(a)
    }
    this.dScale = a;
    this.redraw()
};
iOverLay.prototype.rotate = function rotate(c, b) {
    var a = degToRad(c);
    costheta = Math.cos(a);
    sintheta = Math.sin(a);
    if (!b) {
        b = this.div
    }
    if (b) {
        b.style.filter = "progid:DXImageTransform.Microsoft.Matrix()";
        b.filters.item("DXImageTransform.Microsoft.Matrix").SizingMethod = "auto expand";
        b.filters.item("DXImageTransform.Microsoft.Matrix").FilterType = "bilinear";
        b.filters.item("DXImageTransform.Microsoft.Matrix").M11 = costheta;
        b.filters.item("DXImageTransform.Microsoft.Matrix").M12 = -sintheta;
        b.filters.item("DXImageTransform.Microsoft.Matrix").M21 = sintheta;
        b.filters.item("DXImageTransform.Microsoft.Matrix").M22 = costheta
    }
};
iOverLay.prototype.doRotate = function () {
    if (this.angle > 360) {
        this.angle -= 360
    }
    this.angle += 15;
    this.rotate(this.angle);
    this.setTimeout("this.doRotate()", 200)
};
iOverLay.prototype.showStatus = function (b) {
    if (isNaN(b)) {
        alert("传入的参数有误，不是数值");
        return
    }
    if (typeof b == "string") {
        b = parseInt(b)
    }
    if (b < this.startSeq) {
        b = this.startSeq
    }
    if (b > this.endSeq) {
        b = this.endSeq
    }
    if (this.startScale && (this instanceof Marker || this instanceof Circle || this instanceof Rectangle || this instanceof Polyline)) {
        if (b <= this.startScaleSeq) {
            this.dScale = this.startScale
        } else {
            if (b >= this.endScaleSeq) {
                this.dScale = this.endScale
            } else {
                this.dScale = this.startScale + (b - this.startScaleSeq) / (this.endScaleSeq - this.startScaleSeq) * (this.endScale - this.startScale)
            }
        }
    }
    if (this instanceof Marker || this instanceof Polyline || this instanceof Title) {
        if (this.points.length > 0) {
            var a = b;
            if (a < this.startPath) {
                a = this.startPath
            }
            if (a > this.endPath) {
                a = this.endPath
            }
            this.pPoints = this.getSPoints(a);
            if (this.pPoints.length > 0) {
                this.point = this.pPoints[this.pPoints.length - 1]
            } else {
            }
            if (this.point == null) {
                throw Error(103, "点为空:" + this.pPoints.toString() + ":" + this.pPoints.length)
            }
        }
    }
    this.dispStatus = 1;
    for (var c = 0; c < this.statusSet.length; c++) {
        var d = this.statusSet[c];
        if (b >= d.startSeq && b <= d.endSeq) {
            this.dispStatus = d.iStatus;
            break
        }
    }
    this.redraw();
    this.refreshStatus()
};
iOverLay.prototype.addDispStatus = function (c, a, g) {
    for (var b = 0; b < arguments.length; b++) {
        if (isNaN(arguments[b])) {
            alert("传入的参数有误，不是数值");
            return
        }
        if (typeof arguments[b] == "string") {
            arguments[b] = parseInt(arguments[b])
        }
    }
    if (g < 1 || g > 3) {
        alert("状态设置错误，应为(1:显示;2:隐藏;3:闪烁)");
        return
    }
    var d = new OverlayStatus(c, a, g);
    for (var b = 0; b < this.statusSet.length; b++) {
        var f = this.statusSet[b];
        var e = f.bIsConflict(d);
        if (e) {
            d = null;
            return
        }
    }
    this.startSeq = Math.min(this.startSeq, c);
    this.endSeq = Math.max(this.endSeq, a);
    this.statusSet.push(d)
};
iOverLay.prototype.setExtendStatus = function (c, a, d, e) {
    for (var b = 0; b < arguments.length; b++) {
        if (isNaN(arguments[b])) {
            alert("传入的参数有误，不是数值");
            return
        }
    }
    if (typeof c == "string") {
        c = parseInt(c)
    }
    if (typeof a == "string") {
        a = parseInt(a)
    }
    if (typeof d == "string") {
        d = parseFloat(d)
    }
    if (typeof e == "string") {
        e = parseFloat(e)
    }
    this.startSeq = Math.min(this.startSeq, c);
    this.endSeq = Math.max(this.endSeq, a);
    this.startScale = d;
    this.endScale = e;
    this.startScaleSeq = c;
    this.endScaleSeq = a
};
iOverLay.prototype.setPath = function (c, a, d) {
    for (var b = 0; b < 2; b++) {
        if (isNaN(arguments[b])) {
            alert("传入的参数有误，不是数值");
            return
        }
    }
    if (typeof c == "string") {
        c = parseInt(c)
    }
    if (typeof a == "string") {
        a = parseInt(a)
    }
    this.startSeq = Math.min(this.startSeq, c);
    this.endSeq = Math.max(this.endSeq, a);
    this.startPath = c;
    this.endPath = a;
    this.initPath(d)
};
iOverLay.prototype.toString = function () {
    var a = "";
    if (this instanceof Circle) {
        a = this.point.toString() + "," + this.radius
    } else {
        if (this instanceof Rectangle || this instanceof Polygon || this instanceof Polyline) {
            a = this.points.join(",")
        } else {
            if (this instanceof Title || this instanceof Marker) {
                a = this.point.toString()
            }
        }
    }
    return a
};
iOverLay.prototype.setNode = function (a) {
    if (a) {
        this.bIsNode = a;
        if (this.div.style.border != "") {
            this.div.style.border = "1px solid #000000";
            this.div.style.backgroundColor = "#b3b3b3";
            this.div.style.filter = "alpha(opacity=70)"
        }
    } else {
        this.bIsNode = a;
        if (this.div.style.border != "") {
            this.div.style.border = "1px solid #000000";
            this.div.style.backgroundColor = "#b3b3b3";
            this.div.style.filter = "alpha(opacity=50)"
        }
    }
};
iOverLay.prototype.getLocalUnit = function () {
    var a = "degree";
    if (_MapSpanScale != 1) {
        a = "meter"
    }
    return a
};
iOverLay.prototype.toLocalUnit = function (b) {
    var a = b;
    if (typeof b == "string") {
        if (_MapSpanScale == 1 && (b.indexOf("meter") != -1)) {
            a = parseFloat(b) * (0.03 / 3600)
        }
    }
    return a
};
iOverLay.prototype.updatePoint = function () {
    this.point = new Point(this.map.mouseLng, this.map.mouseLat);
    if (this._point) {
        var a = this.point.x - this._point.x;
        var b = this.point.y - this._point.y;
        if (this instanceof Circle) {
            this.points[0] = this.points[0];
            this.points[1] = this.points[1]
        }
        if (this.center != null) {
            this.center.x = this.point.x;
            this.center.y = this.point.y
        }
        this._point = this.point
    }
    this.setNode(true);
    this.redraw();
    _CurentOverLay = this
};
iOverLay.prototype.ondragstart = function () {
    this._point = this.point
};
iOverLay.prototype.enableContextMenu = function () {
    BindingEvent(this.div, "contextmenu", this.eventHandler("showPropertyEdit"));
    if (this.titleDiv) {
        BindingEvent(this.titleDiv, "contextmenu", this.eventHandler("showPropertyEdit"))
    }
};
iOverLay.prototype.disableContextMenu = function () {
    unbindingEvent(this.div, "contextmenu", this.eventHandler("showPropertyEdit"));
    if (this.titleDiv) {
        unbindingEvent(this.titleDiv, "contextmenu", this.eventHandler("showPropertyEdit"))
    }
};
iOverLay.prototype.startMove = function (a) {
    var c = parseInt(this.div.style.left);
    var b = parseInt(this.div.style.top);
    this.bIsSyRedraw = false;
    if (!this.dragObject) {
        this.dragObject = new DragEvent(this.div, c, b, this.map.container)
    } else {
        this.dragObject.enable()
    }
    this._point = this.point;
    this.dragObject.ondrag = this.eventHandler("updatePoint");
    this.dragObject.onmove = a
};
iOverLay.prototype.stopMove = function (a) {
    this.dragObject.disable();
    this.dragObject.ondragend = null
};
iOverLay.prototype.showInfo = function (k, g, f, h) {
    if (!h) {
        h = ""
    }
    var c = document.getElementById("InfoDiv");
    if (c == null) {
        c = document.createElement("div");
        c.id = "InfoDiv";
        c.style.zIndex = "12000";
        c.style.position = "absolute";
        this.map.divPaint.appendChild(c);
        BindingEvent(c, "mouseover", function () {
            iOverLay.bOutOfInfo = false
        });
        BindingEvent(c, "mouseout", function () {
            iOverLay.bOutOfInfo = true;
            iOverLay.closeInfo()
        })
    }
    var d = "";
    d = '<TABLE id="InfoTable_2"  >';
    d = d + "<TBODY>";
    d = d + "<TR>";
    d = d + '<TD class="InfoTitle">';
    d = d + '<TABLE class="InfoWord" cellSpacing=0 cellPadding=0 width="100%" align=center border=0>';
    d = d + "<TBODY>";
    d = d + "<TR>";
    d = d + '<TD id=head_txt><IMG src="/EzServer/css/infolittle.gif"><span id="info_title">' + h + "</span></TD>";
    d = d + "<TD width=30>　</TD>";
    d = d + '<TD vAlign=center align=middle width=20><A class="InfoClose"  onclick="iOverLay.closeInfoWait(true);" href="javascript:void(0)">×</A>';
    d = d + "</TD>";
    d = d + "</TR>";
    d = d + "</TBODY>";
    d = d + "</TABLE>";
    d = d + "</TD>";
    d = d + "</TR>";
    d = d + "<TR>";
    d = d + '<TD vAlign=top bgColor=#ffffff id="info_desc">';
    d = d + f;
    d = d + "</TD>";
    d = d + "</TR>";
    d = d + "</TBODY>";
    d = d + "</TABLE>";
    c.innerHTML = d;
    var n = document.createElement("div");
    n.innerHTML = d;
    this.map.divPaint.appendChild(n);
    var l = n.offsetWidth;
    var j = n.offsetHeight;
    this.map.divPaint.removeChild(n);
    var b = document.getElementById("InfoTable_2");
    var e = parseInt(this.div.offsetWidth);
    var a = parseInt(this.div.offsetHeight);
    var m = this.map.convert2WPoint(k, g);
    var o = this.map.getCenterLatLng();
    if (this.point.x > o.x) {
        c.style.left = convert2Px(m.x - l + e)
    } else {
        c.style.left = convert2Px(m.x)
    }
    if (this.point.y > o.y) {
        c.style.top = convert2Px(m.y + a - 1)
    } else {
        c.style.top = convert2Px(m.y - j)
    }
    c.style.display = ""
};
iOverLay.prototype.setPoint = function (a) {
    this.point = a;
    if (this.div != null && this.map != null) {
        this.redraw()
    }
};
iOverLay.prototype.getPoint = function () {
    if (this.point) {
        return this.point
    } else {
        return null
    }
};
iOverLay.prototype.toHTML = function () {
    var a = document.createElement("table");
    a.border = 0;
    a.id = "InfoTable";
    a.align = "center";
    a.cellspacing = 0;
    a.cellpadding = 0;
    a.onclick = "";
    var b = 0;
    if (g_current_editor.getLineStyle) {
        var e = a.insertRow(b);
        e.height = 10;
        var d = e.insertCell(0);
        d.innerHTML = "线的样式";
        d.className = "leftBorder";
        var c = e.insertCell(1);
        c.className = "rightBorder";
        c.appendChild(this.createSelect(g_current_editor.getLineStyle()));
        b++
    }
    if (g_current_editor.getColor) {
        var e = a.insertRow(b);
        e.height = 10;
        var d = e.insertCell(0);
        d.innerHTML = this.colorName;
        d.className = "leftBorder";
        var c = e.insertCell(1);
        c.className = "rightBorder";
        c.innerHTML = "<input size=10  style='BACKGROUND:" + g_current_editor.getColor() + "' value='" + g_current_editor.getColor() + "' onpropertychange='g_current_editor.setColor(this.value)' onclick='EzColorPicker(this,this);' ></input>";
        b++
    }
    if (g_current_editor.getWidth) {
        var e = a.insertRow(b);
        e.height = 10;
        var d = e.insertCell(0);
        d.innerHTML = "线的宽度";
        d.className = "leftBorder";
        var c = e.insertCell(1);
        c.className = "rightBorder";
        c.innerHTML = "<input size=10 value='" + g_current_editor.getWidth() + "' onpropertychange='g_current_editor.setWidth(this.value)' ></input>";
        b++
    }
    if (g_current_editor.getOpacity) {
        var e = a.insertRow(b);
        e.height = 10;
        var d = e.insertCell(0);
        d.innerHTML = this.opacityName;
        d.className = "leftBorder";
        var c = e.insertCell(1);
        c.className = "rightBorder";
        c.innerHTML = "<input size=10 value='" + g_current_editor.getOpacity() + "' onpropertychange='g_current_editor.setOpacity(this.value)' ></input><font color=red>0~1</font>";
        b++
    }
    if (g_current_editor.getFillColor) {
        var e = a.insertRow(b);
        e.height = 10;
        var d = e.insertCell(0);
        d.innerHTML = "填充颜色";
        d.className = "leftBorder";
        var c = e.insertCell(1);
        c.className = "rightBorder";
        c.innerHTML = "<input size=10 style='BACKGROUND:" + g_current_editor.getFillColor() + "' value='" + g_current_editor.getFillColor() + "' onpropertychange='g_current_editor.setFillColor(this.value)' onclick='EzColorPicker(this,this);'  ></input>";
        b++
    }
    if (g_current_editor.getFillOpacity) {
        var e = a.insertRow(b);
        e.height = 10;
        var d = e.insertCell(0);
        d.innerHTML = "填充透明度";
        d.className = "leftBorder";
        var c = e.insertCell(1);
        c.className = "rightBorder";
        c.innerHTML = "<input size=10 value='" + g_current_editor.getFillOpacity() + "'  onpropertychange='g_current_editor.setFillOpacity(this.value)'></input><font color=red>0~1</font>"
    }
    return a.outerHTML
};
iOverLay.prototype.createSelect = function (d) {
    var a = document.createElement("select");
    a.onchange = "g_current_editor.setLineStyle(this.options[this.selectedIndex].value)";
    for (var c = 0; c < this.lineStyles.length; c++) {
        var b = document.createElement("option");
        b.innerHTML = this.lineStyleNames[c];
        b.value = this.lineStyles[c];
        if (d == this.lineStyles[c]) {
            b.selected = true
        }
        a.appendChild(b)
    }
    return a
};
iOverLay.prototype.showEdit = function () {
    this.openInfoWindowHtml(this.toHTML())
};
iOverLay.prototype.getOpacity = function () {
    return this.opacity
};
iOverLay.prototype.enableEdit = function (a) {
    this.editable = true;
    this.startMove(this.eventHandler("redraw"));
    this.addListener("contextmenu", this.eventHandler("showPropertyEdit"));
    this.edit_callback = a
};
iOverLay.prototype.disableEdit = function (a) {
    this.editable = false;
    this.stopMove();
    this.removeListener("contextmenu", this.eventHandler("showPropertyEdit"));
    if (a) {
        a()
    }
};
function Rect(b, a) {
    this.width = b;
    this.height = a
}
Rect.prototype.toString = function () {
    return "(" + this.width + ", " + this.height + ")"
};
Rect.prototype.equals = function (b) {
    try {
        if (!EzServerClient.GlobeFunction.isTypeRight(b, "Rect")) {
            throw EzErrorFactory.createError("Rect::equals方法中arguments[0]参数类型不正确")
        }
        if (!b) {
            return false
        }
        return this.width == b.width && this.height == b.height
    } catch (a) {
        throw EzErrorFactory.createError("Rect::equals方法执行不正确", a)
    }
};
Rect.prototype.approxEquals = function (b) {
    try {
        if (!EzServerClient.GlobeFunction.isTypeRight(b, "Rect")) {
            throw EzErrorFactory.createError("Rect::approxEquals方法中arguments[0]参数类型不正确")
        }
        if (!b) {
            return false
        }
        return bRetComp(this.width, b.width) && bRetComp(this.height, b.height)
    } catch (a) {
        throw EzErrorFactory.createError("Rect::approxEquals方法执行不正确", a)
    }
};
function Polyline(d, a, g, b, f, c, e) {
    try {
        this.base = iOverLay;
        this.base();
        this.unit = "px";
        if (typeof a == "undefined") {
            this.color = "#0000ff"
        } else {
            this.color = a
        }
        this.tag = EzServerClient.GlobeParams.VML ? "v:shape" : "polyline";
        if (typeof c == "undefined") {
            this.fillColor = "red"
        } else {
            this.fillColor = c
        }
        if (typeof g == "undefined") {
            this.weight = "5"
        } else {
            this.weight = g
        }
        if (typeof b == "undefined") {
            this.opacity = 0.45
        } else {
            this.opacity = b
        }
        this.div = null;
        this.filled = false;
        if (typeof f == "undefined") {
            this.arrow = 0
        } else {
            this.arrow = f
        }
        this.isDashStyle = e;
        this.center = null;
        this.points = d;
        this.name = "";
        this.stroke = null;
        this.opacityName = "线的透明色";
        this.colorName = "线的颜色";
        this.lineStyles = ["none", "dash", "dashdot", "dot", "longdash", "longdashdot", "shortdash", "shortdashdot", "shortdashdotdot", "longdashdotdot", "shortdot"];
        this.lineStyleNames = ["________", "- - - --", "-.-.-.-.", "........", " ___  ___", "___.___", "- - - -", "__ . __", "__ . . ", "____ . .", "........"];
        this.lineStyle = "none";
        this.getFillStyle = function () {
            var e = document.createElement("v:fill");
            e.color = this.fillColor;
            e.opacity = this.opacity;
            e.type = "frame";
            return e
        };

        this.getFillStyleBySVG = function () {
            return {
                color: this.fillcolor,
                opacity: this.opacity
            };
        };
        this.setZIndex = function (j) {
            try {
                if (!(EzServerClient.GlobeFunction.isTypeRight(j, "int"))) {
                    throw EzErrorFactory.createError("Polyline::setZIndex方法中arguments[0]类型不正确")
                }
                if (this.div != null) {
                    this.div.style.zIndex = j
                }
            } catch (k) {
                throw EzErrorFactory.createError("Polyline::setZIndex方法中不正确", k)
            }
        };
        this.getZIndex = function () {
            return this.div.style.zIndex
        };
        this.init()
    } catch (h) {
        throw EzErrorFactory.createError("Polyline构造方法执行不正确", h)
    }
}
Polyline.prototype = new iOverLay;
Polyline.prototype.onclick = function () {
    this.div.fireEvent("onclick");
    this.flash()
};
Polyline.prototype.trans2Points = function (d) {
    var g = d.split(";");
    var f = [];
    var a = [];
    var b = null;
    for (var e = 0; e < g.length; e++) {
        a = g[e].split(",");
        for (var c = 0; c < a.length; c = c + 2) {
            b = new Point(a[c], a[c + 1]);
            if (c == 0) {
                b.partStartFlag = e
            }
            f.push(b)
        }
    }
    a = null;
    b = null;
    g = null;
    return f
};
Polyline.prototype.init = function () {
    this.iZIndex = this.iZIndex - 10;
    if (this instanceof Circle) {
        this.tag = EzServerClient.GlobeParams.VML ? "v:oval" : "circle";
        this.filled = true;
        if (_MapSpanScale == 1) {
            this.radiusUnit = "degree"
        } else {
            this.radiusUnit = "meter"
        }
    } else {
        if (this instanceof Rectangle) {
            this.tag = EzServerClient.GlobeParams.VML ? "v:rect" : "rect";
            this.filled = true
        } else {
            if (this instanceof Polygon) {
                this.tag = EzServerClient.GlobeParams.VML ? "v:shape" : "polygon";
                this.filled = true
            } else {
                if (this instanceof Polyline) {
                    this.tag = EzServerClient.GlobeParams.VML ? "v:shape" : "polyline";
                }
            }
        }
    }
    this.coordSequence = "";
    if (this.points instanceof Array) {
        for (var a = 0; a < this.points.length; a++) {
            if (a == this.points.length - 1) {
                this.coordSequence += this.points[a].x + "," + this.points[a].y
            } else {
                this.coordSequence += this.points[a].x + "," + this.points[a].y + ","
            }
        }
    } else {
        if (typeof this.points == "string") {
            this.coordSequence = this.points;
            this.points = this.trans2Points(this.points)
        }
    }

    var c;
    if (EzServerClient.GlobeParams.VML) {
        c = document.createElement(this.tag);
        c.style.position = "absolute";
        c.style.zIndex = this.iZIndex;
        this.div = c;
        stroke = document.createElement("v:stroke");
        stroke.color = this.color;
        stroke.opacity = this.opacity;
        stroke.weight = convert2Px(this.weight);
        stroke.startarrowwidth = "medium";
        stroke.endarrowwidth = "medium";
        stroke.startarrowlength = "medium";
        stroke.endarrowlength = "medium";
        stroke.joinstyle = "round";
        stroke.endcap = "round";
        if (this.arrow == -1) {
            stroke.startarrow = "classic";
            stroke.endarrow = "oval"
        } else {
            if (this.arrow == 1) {
                stroke.startarrow = "oval";
                stroke.endarrow = "classic"
            }
        }
        this.stroke = stroke;
        try {
            this.div.appendChild(this.stroke);
            this.fillStroke = this.getFillStyle();
            this.div.appendChild(this.fillStroke);
            this.div.filled = this.filled
        } catch (b) {
            var d = document.location
        }
    } else {
        c = document.createElementNS('http://www.w3.org/2000/svg', this.tag);
        c.style.position = "absolute";
        c.style.zIndex = this.iZIndex;
        c.style.stroke = this.color;
        c.style.strokeOpacity = this.opacity;
        c.style.strokeWidth = convert2Px(this.weight);
        c.style.strokeLinejoin = "round";
        c.style.strokeLinecap = "round";
        if (this.isDashStyle) {
            c.style.strokeDasharray = "6";
        }
        var fillStroke = this.getFillStyle();
        c.style.fillOpacity = fillStroke.opacity;
        if (this.tag == "polyline") {
            c.style.fillOpacity = 0;
        }
        c.style.fill = fillStroke.color;
        this.div = c;
        try {
            this.div.filled = this.filled
        } catch (b) {
            var d = document.location
        }
    }

};
Polyline.prototype.setPoints = function (a) {
    try {
        if (!(EzServerClient.GlobeFunction.isTypeRight(a, "string")) && !(EzServerClient.GlobeFunction.isTypeRight(a, "Array"))) {
            throw EzErrorFactory.createError("Polyline::setPoints方法中arguments[0]类型不正确")
        }
        if (typeof a == "string") {
            this.points = this.trans2Points(a)
        } else {
            if (a instanceof Array) {
                this.points = a
            } else {
                alert("传入参数有误,必须是点的线串或Point的数字类型");
                return
            }
        }
        this.redraw()
    } catch (b) {
        throw EzErrorFactory.createError("Polyline::setPoints方法不正确", b)
    }
};
Polyline.prototype.createDiv = function (a) {
    if (typeof this.div == "undefined" || this.div == null) {
        this.init()
    }
    if (typeof a != "undefined" && a != null) {
        this.map = a
    }
    this.map.divPaint.appendChild(this.div);
    this.redraw();
    var c = parseInt(this.div.style.left);
    var b = parseInt(this.div.style.top);
    this.point = this.map.convert2LonLat(c, b)
};
Polyline.prototype.addListener = function (b, a) {
    try {
        if (!(EzServerClient.GlobeFunction.isTypeRight(b, "string"))) {
            throw EzErrorFactory.createError("Polyline::addListener方法中arguments[0]类型不正确")
        }
        if (!(EzServerClient.GlobeFunction.isTypeRight(a, "function"))) {
            throw EzErrorFactory.createError("Polyline::addListener方法中arguments[1]类型不正确")
        }
        if (this.div == null) {
            throw EzErrorFactory.createError("请先加入事件后(addOverlay)，再创建该事件!\n该事件的触发事件没有成功建立")
        }
        this.div.style.cursor = "hand";
        BindingEvent(this.div, b, a)
    } catch (c) {
        throw EzErrorFactory.createError("Polyline::addListener方法中不正确", c)
    }
};
Polyline.prototype.openInfoWindowHtml = function (a, d) {
    try {
        this.map.blowupOverlay(this);
        if (this.center == null) {
            var b = Math.floor(this.points.length / 2);
            this.map.openInfoWindow(this.points[b].x, this.points[b].y, a, d)
        } else {
            this.map.openInfoWindow(this.center.x, this.center.y, a, d)
        }
    } catch (c) {
        throw EzErrorFactory.createError("Polyline::openInfoWindowHtml方法中不正确", c)
    }
};
Polyline.prototype.closeInfoWindowHtml = function () {
    this.map.closeInfoWindow()
};
Polyline.prototype.display = function (b) {
    if (b) {
        this.drawElement.style.display = ""
    } else {
        this.drawElement.style.display = "none"
    }
};
Polyline.prototype.removeFromDiv = function () {
    this.pause();
    this.map.divPaint.removeChild(this.div);
    EventManager.removeNode(this.div);
    this.deleteSnap()
};
Polyline.prototype.redraw = function () {
    if (this.div == null) {
        return
    }
    var b = this.map.viewSize.width;
    var d = this.map.viewSize.height;
    this.div.coordsize = b + "," + d;
    this.div.style.left = convert2Px(0);
    this.div.style.top = convert2Px(0);
    var a = this.points;
    if (this instanceof Polygon) {
        if (this.dScale && this.dScale != 1) {
            a = this.getScalePath(this.points, this.dScale)
        }
    }
    var c = this.getPx(this.weight);
    //vml
    if (EzServerClient.GlobeParams.VML) {
        this.div.style.width = convert2Px(b);
        this.div.style.height = convert2Px(d);
        this.stroke.weight = convert2Px(c * this.dScale);
        var e = this.getVectorPath(a);
        this.div.path = e;
    } //svg
    else {
        this.div.style.width = convert2Px(b);
        this.div.style.height = convert2Px(d);
        //this.div.parentElement.style.width =convert2Px(b) - this.div.parentElement.parentElement.style.top;
        //this.div.parentElement.style.height =convert2Px(d) - this.div.parentElement.parentElement.style.left;
        /* this.div.parentElement.style.top = convert2Px(0);
        this.div.parentElement.style.left = convert2Px(0);
        this.div.parentElement.style.width = convert2Px(b*100);
        this.div.parentElement.style.height = convert2Px(d*100);*/
        this.div.style.strokeWidth = convert2Px(c * this.dScale);
        var e = this.getVectorPathBySVG(a);
        this.div.setAttribute("points", e);
    }

    this.redrawSnap()
};
Polyline.prototype.getPx = function (a) {
    var b = a;
    if ((_MapSpanScale == 1 && this.unit == "degree") || (_MapSpanScale == 1 && this.unit == "meter") || (_MapSpanScale != 1 && this.unit == "meter")) {
        var c = b;
        if (_MapSpanScale == 1 && this.unit == "degree") {
            c = c * 3600 / 0.03
        }
        b = this.map.getPxOfDist(c)
    }
    return b
};
Polyline.prototype.getScalePath = function (a, g) {
    var j = new Array();
    var k = this.getMBR();
    var b = k.centerPoint();
    for (var f = 0; f < a.length; f++) {
        var e = a[f];
        var d = b.x + (e.x - b.x) * g;
        var c = b.y + (e.y - b.y) * g;
        var h = new Point(d, c);
        j.push(h)
    }
    return j
};
Polyline.prototype.getVectorPath = function (d) {
    var a = new Array();
    if (typeof d == "undefined") {
        d = this.points
    }
    for (var g = 0; g < d.length; g++) {
        var f = d[g];
        var c = this.map.convert2WPoint(f.x, f.y);
        if (typeof f.partStartFlag != "undefined" && g != d.length - 1 || g == 0) {
            a.push("x");
            a.push("m");
            a.push(c.x);
            a.push(c.y);
            a.push("l")
        }
        a.push(c.x);
        a.push(c.y)
    }
    a.push("e");
    var h = a.join(" ");
    return h
};
Polyline.prototype.getVectorPathBySVG = function (d) {
    var a = new Array();
    if (typeof d == "undefined") {
        d = this.points
    }
    for (var g = 0; g < d.length; g++) {
        var f = d[g];
        var c = this.map.convert2WPoint(f.x, f.y);
        a.push(c.x);
        a.push(c.y)
    }
    var h = a.join(" ");
    return h
};
Polyline.prototype.getPoints = function () {
    return this.points
};
Polyline.prototype.getLength = function () {
    var a = CalculateLength(this.getPoints());
    a = Math.floor(a);
    return a
};
Polyline.prototype.getArea = function () {
    var a = CalculateArea(this.getPoints());
    a = Math.floor(a);
    return a
};
Polyline.prototype.getMBR = function () {
    var b = this.points[0];
    var d = new MBR(b.x, b.y, b.x, b.y);
    for (var a = 0; a < this.points.length; a++) {
        var c = this.points[a];
        d.extend(c)
    }
    return d
};
Polyline.prototype.setColor = function (a) {
    try {
        if (!(EzServerClient.GlobeFunction.isTypeRight(a, "string"))) {
            throw EzErrorFactory.createError("Polyline::setColor方法中arguments[0]类型不正确")
        }
        this.color = a + "";
        if (this.stroke) {
            this.stroke.color = a
        }
    } catch (b) {
        throw EzErrorFactory.createError("Polyline::setPoints方法中不正确", b)
    }
};
Polyline.prototype.getColor = function () {
    return this.color
};
Polyline.prototype.setWidth = function (a) {
    try {
        if (!(EzServerClient.GlobeFunction.isTypeRight(a, "int"))) {
            throw EzErrorFactory.createError("Polyline::setWidth方法中arguments[0]类型不正确")
        }
        if (typeof a == "string") {
            this.weight = parseFloat(a);
            if (a.indexOf("degree") != -1) {
                this.unit = "degree"
            } else {
                if (a.indexOf("meter") != -1) {
                    this.unit = "meter"
                } else {
                    this.unit = "px"
                }
            }
            this.redraw()
        } else {
            this.weight = a;
            if (this.stroke) {
                this.stroke.weight = this.weight + "px"
            }
        }
    } catch (b) {
        throw EzErrorFactory.createError("Polyline::setWidth方法中不正确", b)
    }
};
Polyline.prototype.getWidth = function () {
    return this.weight
};
Polyline.prototype.setOpacity = function (a) {
    try {
        this.opacity = a + "";
        if (this.stroke) {
            this.stroke.opacity = a
        }
    } catch (b) {
    }
};
Polyline.prototype.getOpacity = function () {
    return this.opacity
};
Polyline.prototype.setLineStyle = function (a) {
    try {
        if (!(EzServerClient.GlobeFunction.isTypeRight(a, "string"))) {
            throw EzErrorFactory.createError("Polyline::setLineStyle方法中arguments[0]类型不正确")
        }
        this.setDashStyle(a)
    } catch (b) {
        throw EzErrorFactory.createError("Polyline::setLineStyle方法中不正确", b)
    }
};
Polyline.prototype.getLineStyle = function () {
    return this.lineStyle
};
Polyline.prototype.setDashStyle = function (a) {
    var b = this.lineStyles.join(",");
    if (b.indexOf(a) != -1) {
        if (this.stroke) {
            this.stroke.dashstyle = a
        } else {
            this.isDashStyle = true;
        }
    } else {
        alert("参数必须是:[" + b + "]中的值！")
    }
    this.lineStyle = a
};
Polyline.prototype.refreshNodeSnap = function () {
    g_current_editor = this;
    var f = this.markers.indexOf(_CurentOverLay);
    var d = f % 2;
    if (d == 0) {
        if (f > 0) {
            var e = this.markers[f - 1];
            var c = this.markers[f - 2].point.getCenter(this.markers[f].point);
            e.setPoint(c)
        }
        if (f < this.markers.length - 2) {
            var e = this.markers[f + 1];
            var c = this.markers[f + 2].point.getCenter(this.markers[f].point);
            e.setPoint(c)
        }
    } else {
        for (i = f; i < this.markers.length; i++) {
            var e = this.markers[i];
            var d = i % 2;
            if (d == 1 && (e.bIsNode == true)) {
                var b = this.markers[i - 1];
                var c = new Point((e.point.x + b.point.x) / 2, (e.point.y + b.point.y) / 2);
                var a = this.createSnap(c, false);
                a.show();
                this.markers = this.markers.insert(i, a)
            }
        }
    }
};
Polyline.prototype.createNodeSnap = function () {
    for (i = 0; i < this.points.length; i++) {
        this.markers.push(this.createSnap(this.points[i], true));
        if (i < this.points.length - 1) {
            var a = new Point((this.points[i].x + this.points[i + 1].x) / 2, (this.points[i].y + this.points[i + 1].y) / 2);
            var b = this.createSnap(a, false);
            this.markers.push(b)
        }
    }
};
Polyline.prototype.enableEdit = function (a) {
    if (this.editable) {
        return
    }
    this.editable = true;
    this.markers = new Array();
    this.createNodeSnap();
    this.showSnapTimeout = null;
    this.snap_hovering = false;
    this.addListener("mouseover", this.eventHandler("showSnap"));
    this.addListener("mouseout", this.eventHandler("hideSnap"));
    this.addListener("contextmenu", this.eventHandler("showPropertyEdit"));
    this.edit_callback = a
};
Polyline.prototype.disableEdit = function (a) {
    if (!this.editable) {
        return
    }
    this.editable = false;
    this.deleteSnap();
    this.removeListener("mouseover", this.eventHandler("showSnap"));
    this.removeListener("mouseout", this.eventHandler("hideSnap"));
    this.removeListener("contextmenu", this.eventHandler("showPropertyEdit"));
    this.edit_callback = null;
    if (a) {
        a()
    }
};
g_Node_iIndex = 0;
Polyline.prototype.createSnap = function (c, d) {
    var b = new Icon();
    if (d) {
        b.image = null
    } else {
        b.image = null
    }
    b.height = 12;
    b.width = 12;
    b.topOffset = 0;
    b.leftOffset = 0;
    var a = new Marker(c, b);
    a.nodeIndex = g_Node_iIndex++;
    a.createDiv(this.map);
    a.hide();
    a.setNode(d);
    a.startMove(this.eventHandler("updateSnap"));
    a.addListener("mouseover", this.eventHandler("snap_hovering_true"));
    a.addListener("mouseout", this.eventHandler("snap_hovering_false"));
    return a
};
Polyline.prototype.snap_hovering_true = function () {
    this.snap_hovering = true
};
Polyline.prototype.snap_hovering_false = function () {
    this.snap_hovering = false
};
Polyline.prototype.updateSnap = function () {
    this.points.clear();
    for (i = 0; i < this.markers.length; i++) {
        if (this.markers[i].div != null && this.markers[i].bIsNode) {
            this.points.push(this.markers[i].point)
        }
    }
    this.redraw();
    this.setTimeout("this.refreshNodeSnap()", 10)
};
g_snap_show = false;
Polyline.prototype.delayShowSnap = function () {
    if (g_snap_show) {
        return
    }
    for (i = 0; i < this.markers.length; i++) {
        this.markers[i].show()
    }
    g_snap_show = true
};
Polyline.prototype.delayHideSnap = function () {
    if (this.snap_hovering || !g_snap_show) {
        return
    }
    for (i = 0; i < this.markers.length; i++) {
        this.markers[i].hide()
    }
    g_snap_show = false
};
Polyline.prototype.showSnap = function () {
    if (this.showSnapTimeout != null) {
        window.clearTimeout(this.showSnapTimeout);
        this.showSnapTimeout = null
    }
    this.showSnapTimeout = this.setTimeout("this.delayShowSnap()", 300)
};
Polyline.prototype.hideSnap = function () {
    if (this.showSnapTimeout != null) {
        window.clearTimeout(this.showSnapTimeout);
        this.showSnapTimeout = null
    }
    this.panTimeout = this.setTimeout("this.delayHideSnap()", 300)
};
Polyline.prototype.deleteSnap = function () {
    if (!this.markers) {
        return
    }
    for (i = 0; i < this.markers.length; i++) {
        var a = this.markers[i];
        a.removeFromDiv()
    }
    this.markers.clear()
};
Polyline.prototype.redrawSnap = function () {
    if (!this.markers) {
        return
    }
    for (i = 0; i < this.markers.length; i++) {
        var a = this.markers[i];
        a.redraw()
    }
};
Polyline.prototype.getCoordSequence = function () {
    return this.coordSequence
};
Polyline.prototype.getGeometryType = function () {
    return "polyline"
};
function Polygon(c, a, d, e, b, f) {
    this.base = Polyline;
    this.base(c, a, d, e, null, b, f);
    this.fillOpacity = e || "1"
}
Polygon.prototype = new Polyline;
Polygon.prototype.setFillOpacity = function (a) {
    try {
        if (!(EzServerClient.GlobeFunction.isTypeRight(a, "float"))) {
            throw EzErrorFactory.createError("Polygon::setFillOpacity方法中arguments[0]类型不正确")
        }
        try {
            this.fillOpacity = a + "";
            if (this.fillStroke) {
                this.fillStroke.opacity = a
            }
        } catch (b) {
        }
    } catch (b) {
        throw EzErrorFactory.createError("Polygon::setFillOpacity方法中不正确", b)
    }
};
Polygon.prototype.getFillOpacity = function () {
    return this.fillOpacity
};
Polygon.prototype.setFillColor = function (a) {
    try {
        if (!(EzServerClient.GlobeFunction.isTypeRight(a, "string"))) {
            throw EzErrorFactory.createError("Polygon::setFillColor方法中arguments[0]类型不正确")
        }
        this.fillColor = a + "";
        if (this.fillStroke) {
            this.fillStroke.color = a
        }
    } catch (b) {
        throw EzErrorFactory.createError("Polygon::setFillColor方法中不正确", b)
    }
};
Polygon.prototype.getFillColor = function () {
    return this.fillColor
};
Polygon.prototype.updateSnap = function () {
    this.points.clear();
    for (i = 0; i < this.markers.length; i++) {
        if (this.markers[i].div != null && this.markers[i].bIsNode) {
            this.points.push(this.markers[i].point)
        }
    }
    this.points.push(this.markers[0].point);
    this.redraw();
    this.setTimeout("this.refreshNodeSnap()", 10)
};
Polygon.prototype.getGeometryType = function () {
    return "polygon"
};
Polygon.prototype.closeInfoWindowHtml = function () {
    this.map.closeInfoWindow()
};
function Circle(c, a, d, e, b) {
    this.base = Polygon;
    this.base(c, a, d, e, b);
    this.radiusUnit = ""
}
Circle.prototype = new Polygon;
Circle.prototype.trans2Points = function (b) {
    var d = b.split(",");
    for (var c = 0; c < d.length; c++) {
        d[c] = parseFloat(d[c])
    }
    this.center = new Point(d[0], d[1]);
    this.radius = d[2];
    return d
};
Circle.prototype.setRadius = function (b) {
    var a = this.toLocalUnit(b);
    this.radius = parseFloat(a);
    this.redraw();
    if (this.markers != null && this.markers.length > 0) {
        var d = this.markers[1];
        var c = new Point(this.center.x, this.center.y + this.radius);
        d.setPoint(c)
    }
};
Circle.prototype.getMeter = function (c) {
    var a = c;
    var b = this.getLocalUnit();
    if (b.indexOf("degree") != -1) {
        a = parseFloat(c) * 3600 / 0.03
    }
    return a
};
Circle.prototype.getRadiusPx = function (b) {
    var c = b;
    if (this.radiusUnit != "px") {
        if (_MapSpanScale == 1 || this.editable == true) {
            dUnit = this.toLocalUnit(b);
            var a = this.map.convert2WPoint(this.center.x, this.center.y);
            var d = this.map.convert2WPoint(this.center.x + dUnit, this.center.y);
            c = (d.x - a.x)
        } else {
            c = this.getMeter(b);
            c = this.map.getPxOfDist(c)
        }
    }
    return c
};
Circle.prototype.redraw = function () {
    var b = this.radius * this.dScale;
    var a = this.map.convert2WPoint(this.center.x, this.center.y);
    b = this.getRadiusPx(b);
    var c = 2 * b;
    if (EzServerClient.GlobeParams.VML) {
        this.div.style.left = convert2Px(a.x - b);
        this.div.style.top = convert2Px(a.y - b);
        this.div.style.width = convert2Px(c);
        this.div.style.height = convert2Px(c);
    } else {
        this.div.setAttribute("cx", convert2Px(a.x));
        this.div.setAttribute("cy", convert2Px(a.y));
        this.div.setAttribute("r", b);
    }
    var d = this.getPx(this.weight);
    if (this.stroke) {
        this.stroke.weight = convert2Px(d);
    }
    this.redrawSnap()
};
Circle.prototype.toString = function () {
    var a = this.center.toString() + "," + this.radius;
    return a
};
Circle.prototype.getCenter = function () {
    return this.center
};
Circle.prototype.getRadius = function () {
    return this.radius
};
Circle.prototype.getPoints = function () {
    var a = new Array();
    for (var c = 0; c <= 36; c++) {
        var e = _C_P * 10 * c;
        var b = this.radius * Math.cos(e);
        var f = this.radius * Math.sin(e);
        var d = new Point(this.center.x + b, this.center.y + f);
        a.push(d)
    }
    return a
};
Circle.prototype.getRadiusLength = function () {
    var a = this.radius;
    var c = new Point(this.center.x + a, this.center.y);
    var b = GetDistanceInLL(this.center, c);
    b = Math.floor(b);
    return b
};
Circle.prototype.refreshNodeSnap = function () {
    this.center.x = this.markers[0].point.x;
    this.center.y = this.markers[0].point.y;
    var a = (this.markers[0].point.x - this.markers[1].point.x);
    var b = (this.markers[0].point.y - this.markers[1].point.y);
    this.radius = Math.sqrt(a * a + b * b);
    this.radiusUnit = this.getLocalUnit();
    this.redraw()
};
Circle.prototype.updateSnap = function () {
    this.refreshNodeSnap()
};
Circle.prototype.createNodeSnap = function () {
    this.markers.push(this.createSnap(this.center, true));
    var a = new Point(this.center.x + this.radius, this.center.y);
    this.markers.push(this.createSnap(a, true));
    this.redraw()
};
Circle.prototype.getGeometryType = function () {
    return "circle"
};
Circle.prototype.getMBR = function () {
    try {
        return new MBR(this.center.x - this.radius, this.center.y - this.radius, this.center.x + this.radius, this.center.y + this.radius)
    } catch (a) {
        throw EzErrorFactory.createError("Circle::getMBR方法中不正确", a)
    }
};
function Marker(c, a, b) {
    try {
        if (!EzServerClient.GlobeFunction.isTypeRight(c, "Point")) {
            throw EzErrorFactory.createError("Marker构造方法中arguments[0]参数类型不正确")
        }
        if (!EzServerClient.GlobeFunction.isTypeRight(a, "Icon")) {
            throw EzErrorFactory.createError("Marker构造方法中arguments[1]参数类型不正确")
        }
        this.base = iOverLay;
        this.base();
        this.point = c;
        this.icon = a;
        this.div = null;
        this.title = b;
        this.init();
        this.name = "";
        this.opacityName = "图标透明色"
    } catch (d) {
        throw EzErrorFactory.createError("Marker构造方法执行不正确", d)
    }
}
Marker.prototype = new iOverLay;
Marker.prototype.init = function () {
    if (this.icon.image != null) {
        this.div = document.createElement("img");
        this.div.galleryimg = "no";
        this.div.src = this.icon.image
    } else {
        this.div = document.createElement("div");
        this.div.style.border = "2px solid red";
        this.div.style.fontSize = "1px"
    }
    this.div.style.position = "absolute";
    this.div.style.zIndex = this.iZIndex;
    this.div.style.display = "";
    if (!isNaN(this.icon.height) && !isNaN(this.icon.width)) {
        this.div.style.height = convert2Px(this.icon.height);
        this.div.style.width = convert2Px(this.icon.width)
    }
    this.titleDiv = this.createTitleDiv()
};
Marker.prototype.createTitleDiv = function () {
    if (typeof this.title == "undefined" || this.title == null) {
        return null
    }
    var a = this.title.createTitleDiv();
    return a
};
Marker.prototype.setZIndex = function (a) {
    try {
        if (!(EzServerClient.GlobeFunction.isTypeRight(a, "int"))) {
            throw EzErrorFactory.createError("Marker::setZIndex方法中arguments[0]类型不正确")
        }
        if (this.div != null) {
            this.div.style.zIndex = a
        }
        if (this.titleDiv != null) {
            this.titleDiv.style.zIndex = a
        }
    } catch (b) {
        throw EzErrorFactory.createError("Polyline::setZIndex方法中不正确", b)
    }
};
Marker.prototype.showTitle = function () {
    if (this.titleDiv && this.div.style.display == "") {
        this.titleDiv.style.display = ""
    }
};
Marker.prototype.hideTitle = function () {
    if (this.titleDiv) {
        this.titleDiv.style.display = "none"
    }
};
Marker.prototype.createDiv = function (a) {
    if (typeof a != "undefined" && a != null) {
        this.map = a
    }
    a.divPaint.appendChild(this.div);
    if (this.titleDiv != null) {
        a.divPaint.appendChild(this.titleDiv)
    }
    this.redraw()
};
Marker.prototype.redraw = function (c) {
    var j = this.map.convert2WPoint(this.point.x, this.point.y);
    var g = 0;
    var k = 0;
    var b = 0;
    try {
        b = this.dScale * this.icon.width;
        var a = this.dScale * this.icon.height;
        g = this.dScale * this.icon.leftOffset;
        k = this.dScale * this.icon.topOffset;
        this.div.style.left = convert2Px(j.x + g - b / 2);
        this.div.style.top = convert2Px(j.y + k - a / 2);
        this.div.style.width = convert2Px(b);
        this.div.style.height = convert2Px(a)
    } catch (h) {
        alert("redraw:" + h.message);
        alert("坐标信息如:" + this.point.toString() + ":" + j.toString())
    }
    if (this.titleDiv != null) {
        var f;
        var d;
        var b = this.title.fontSize * StrLength(this.title.name) / 2;
        b = b * this.dScale;
        var l = this.title.fontSize * this.dScale;
        this.titleDiv.style.fontSize = convert2Px(l);
        if (this.title.pos == 0) {
            f = j.x;
            d = j.y - l - parseInt(this.div.style.height) / 2 + 4
        } else {
            if (this.title.pos == 1) {
                f = j.x + parseInt(this.div.style.width) / 2;
                d = j.y - l - parseInt(this.div.style.height) / 2
            } else {
                if (this.title.pos == 2) {
                    f = j.x + parseInt(this.div.style.width) / 2;
                    d = j.y - l / 2
                } else {
                    if (this.title.pos == 3) {
                        f = j.x + parseInt(this.div.style.width) / 2;
                        d = j.y + 4 + parseInt(this.div.style.height) / 2
                    } else {
                        if (this.title.pos == 4) {
                            f = j.x;
                            d = j.y + 4 + parseInt(this.div.style.height) / 2
                        } else {
                            if (this.title.pos == 5) {
                                f = j.x - b / 2;
                                d = j.y + 4 + parseInt(this.div.style.height) / 2
                            } else {
                                if (this.title.pos == 6) {
                                    f = j.x - b;
                                    d = j.y - l / 2
                                } else {
                                    f = j.x - b / 2;
                                    d = j.y - 4 - l - parseInt(this.div.style.height) / 2
                                }
                            }
                        }
                    }
                }
            }
        }
        f = f + g;
        d = d + k;
        this.titleDiv.style.top = convert2Px(d);
        this.titleDiv.style.left = convert2Px(f);
        if (this.bIsTransparent) {
            this.titleDiv.style.width = convert2Px(b + this.title.fontSize)
        }
    }
};
Marker.prototype.removeFromDiv = function () {
    if (!this.div) {
        return
    }
    this.pause();
    if (this.map) {
        this.map.divPaint.removeChild(this.div);
        EventManager.removeNode(this.div);
        if (this.titleDiv != null) {
            this.map.divPaint.removeChild(this.titleDiv);
            EventManager.removeNode(this.titleDiv)
        }
    }
};
Marker.prototype.openInfoWindowHtml = function (a, c) {
    try {
        this.map.blowupOverlay(this);
        this.map.openInfoWindow(this.point.x, this.point.y, a, c)
    } catch (b) {
        throw EzErrorFactory.createError("Marker::openInfoWindowHtml方法中不正确", b)
    }
};
Marker.prototype.closeInfoWindowHtml = function () {
    this.map.closeInfoWindow()
};
Marker.prototype.setOpacity = function (a) {
    this.opacity = a;
    if (this.div) {
        this.div.style.filter = "ALPHA(opacity=" + this.opacity * 100 + ")"
    }
    if (this.titleDiv) {
        this.titleDiv.style.filter = "ALPHA(opacity=" + this.opacity * 100 + ")"
    }
};
HTMLElementOverLay = function (c, b, a) {
    iOverLay.call(this);
    this.point = b;
    this.id = c;
    this.div = window.document.createElement("div");
    this.div.innerHTML = a;
    this.div.id = this.id;
    this.div.style.zIndex = 10001
};
HTMLElementOverLay.prototype = new iOverLay;
HTMLElementOverLay.prototype.setZIndex = function (a) {
    try {
        if (!(EzServerClient.GlobeFunction.isTypeRight(a, "int"))) {
            throw EzErrorFactory.createError("HTMLElementOverLay::setZIndex方法中arguments[0]类型不正确")
        }
        this.div.style.zIndex = a
    } catch (b) {
        throw EzErrorFactory.createError("HTMLElementOverLay::setZIndex方法中不正确", b)
    }
};
HTMLElementOverLay.prototype.getZIndex = function () {
    return this.div.style.zIndex
};
HTMLElementOverLay.prototype.createDiv = function (a) {
    if (typeof a != "undefined" && a != null) {
        this.map = a
    }
    a.div.appendChild(this.div);
    this.redraw()
};
HTMLElementOverLay.prototype.redraw = function () {
    var a = this.map.convert2WPoint(this.point.x, this.point.y);
    this.div.style.position = "absolute";
    this.div.style.left = a.x + "px";
    this.div.style.top = a.y + "px"
};
HTMLElementOverLay.prototype.removeFromDiv = function () {
    if (!this.div) {
        return
    }
    this.pause();
    if (this.map) {
        this.div.parentElement.removeChild(this.div);
        //this.map.divPaint.removeChild(this.div);
        EventManager.removeNode(this.div)
    }
};
function MultiFeat(e, a, d, b, c) {
    this.base = iOverLay;
    this.base();
    this.filled = true;
    this.fillColor = c || "blue";
    this.lineColor = a || "red";
    this.lineWidth = d || 2;
    this.opacity = b || 1;
    this.feats = new Array();
    this.paths = Trim(e)
}
MultiFeat.prototype = new iOverLay;
MultiFeat.prototype.createDiv = function (c) {
    if (typeof c != "undefined" && c != null) {
        this.map = c
    }
    var e = this.paths.split(";");
    for (var b = 0; b < e.length; b++) {
        var d = e[b];
        var f = null;
        if (this.filled) {
            if (d.length == 3) {
                f = Circle
            } else {
                if (d.length == 4) {
                    f = Rectangle
                } else {
                    if (d.length >= 6) {
                        f = Polygon
                    }
                }
            }
        } else {
            f = Polyline
        }
        var a = new f(d, this.lineColor, this.lineWidth, this.opcacity, this.fillColor);
        a.createDiv(this.map);
        this.feats.push(a)
    }
    this.redraw()
};
MultiFeat.prototype.getMBR = function () {
    var c = null;
    for (var b = 0; b < this.feats.length; b++) {
        var a = this.feats[b];
        if (c == null) {
            c = a.getMBR()
        } else {
            c = MBR.union(c, a.getMBR())
        }
    }
    return c
};
MultiFeat.prototype.redraw = function () {
    for (var b = 0; b < this.feats.length; b++) {
        var a = this.feats[b];
        a.redraw()
    }
};
MultiFeat.prototype.removeFromDiv = function () {
    for (var b = 0; b < this.feats.length; b++) {
        var a = this.feats[b];
        a.removeFromDiv()
    }
};
MultiFeat.prototype.addListener = function (e, b) {
    var a = this;
    for (var d = 0; d < this.feats.length; d++) {
        var c = this.feats[d];
        c.addListener(e, b)
    }
};
MultiFeat.prototype.removeListener = function (d, a) {
    for (var c = 0; c < this.feats.length; c++) {
        var b = this.feats[c];
        b.removeListener(d, a)
    }
};
MultiFeat.prototype.enableEdit = function () {
    for (var b = 0; b < this.feats.length; b++) {
        var a = this.feats[b];
        a.enableEdit()
    }
};
MultiFeat.prototype.disableEdit = function () {
    for (var b = 0; b < this.feats.length; b++) {
        var a = this.feats[b];
        a.disableEdit()
    }
};
function Rectangle(d, b, e, g, c) {
    this.base = Polygon;
    var a = d.split(",");
    var f;
    if (a[0] > a[2]) {
        f = a[0];
        a[0] = a[2];
        a[2] = f
    }
    if (a[1] > a[3]) {
        f = a[1];
        a[1] = a[3];
        a[3] = f
    }
    d = a.join(",");
    f = null;
    a = null;
    this.base(d, b, e, g, c)
}
Rectangle.prototype = new Polygon;
Rectangle.prototype.redraw = function () {
    var h = this.getMBR();
    if (this.dScale && this.dScale != 1) {
        h.scale(this.dScale)
    }
    var a = this.map.convert2WPoint(h.minX, h.minY);
    var g = this.map.convert2WPoint(h.maxX, h.maxY);
    var e = Math.min(a.x, g.x);
    var d = Math.min(a.y, g.y);
    var b = Math.abs(a.x - g.x);
    var f = Math.abs(a.y - g.y);
    if (EzServerClient.GlobeParams.VML) {
        this.div.style.left = convert2Px(e);
        this.div.style.top = convert2Px(d);
        this.div.style.width = convert2Px(b);
        this.div.style.height = convert2Px(f);
    } else {
        this.div.setAttribute("x", convert2Px(e));
        this.div.setAttribute("y", convert2Px(d));
        this.div.setAttribute("width", convert2Px(b));
        this.div.setAttribute("height", convert2Px(f));
    }
    var c = this.getPx(this.weight);
    if (this.stroke) {
        this.stroke.weight = convert2Px(c * this.dScale);
    }
    this.redrawSnap()
};
Rectangle.prototype.getMBR = function () {
    var c = Math.min(this.points[0].x, this.points[1].x);
    var a = Math.max(this.points[0].x, this.points[1].x);
    var b = Math.min(this.points[0].y, this.points[1].y);
    var d = Math.max(this.points[0].y, this.points[1].y);
    if (typeof this.MBR == "undefined" || this.MBR == null) {
        this.MBR = new MBR()
    }
    this.MBR.minX = c;
    this.MBR.minY = b;
    this.MBR.maxX = a;
    this.MBR.maxY = d;
    return this.MBR
};
Rectangle.prototype.getPoints = function () {
    var b = new Array();
    var d = Math.min(this.points[0].x, this.points[1].x);
    var a = Math.max(this.points[0].x, this.points[1].x);
    var c = Math.min(this.points[0].y, this.points[1].y);
    var e = Math.max(this.points[0].y, this.points[1].y);
    b.push(new Point(d, c));
    b.push(new Point(d, e));
    b.push(new Point(a, e));
    b.push(new Point(a, c));
    b.push(new Point(d, c));
    return b
};
Rectangle.prototype.refreshNodeSnap = function () {
};
Rectangle.prototype.createNodeSnap = function () {
    for (i = 0; i < this.points.length; i++) {
        this.markers.push(this.createSnap(this.points[i], true))
    }
};
Rectangle.prototype.getGeometryType = function () {
    return "rectangle"
};
function Title(e, g, h, c, b, f, a, d) {
    this.base = iOverLay;
    this.base();
    this.name = e;
    this.title = this.name.replace(/\n/g, "<br>");
    this.fontSize = 12;
    this.pos = 7;
    this.color = "WHITE";
    this.font = "宋体";
    this.bgColor = "#015190";
    this.borderColor = "red";
    this.borderWidth = "1";
    this.div = null;
    this.bIsTransparent = false;
    this.iShowLen = -1;
    this.opacityName = "图标透明色";
    if (typeof g != "undefined" && g != null) {
        this.fontSize = g
    }
    if (typeof h != "undefined" && h != null) {
        this.pos = h
    }
    if (typeof c != "undefined" && c != null) {
        this.font = c
    }
    if (typeof b != "undefined" && b != null) {
        this.color = b
    }
    if (typeof f != "undefined" && f != null) {
        this.bgColor = f
    }
    if (typeof a != "undefined" && a != null) {
        this.borderColor = a
    }
    if (typeof d != "undefined" && d != null) {
        this.borderWidth = d
    }
    this.div = this.createTitleDiv()
}
Title.prototype = new iOverLay;
Title.prototype.createTitleDiv = function () {
    var a = createTxt(this.title, this.bIsTransparent);
    a.style.zIndex = this.iZIndex;
    a.style.fontSize = convert2Px(this.fontSize);
    a.style.fontFamily = this.font;
    a.style.color = this.color;
    a.noWrap = true;
    a.style.border = this.borderWidth + "px solid " + this.borderColor;
    if (!this.bIsTransparent) {
        a.style.backgroundColor = this.bgColor;
        a.style.width = "auto";
        a.style.height = "auto"
    }
    a.title = this.name;
    return a
};
Title.prototype.setName = function (b, a) {
    this.name = b;
    this.title = this.name.replace(/\n/g, "<br>");
    if (this.iShowLen != -1) {
        this.title = this.name.substr(0, this.iShowLen) + "..."
    }
    if (this.div != null) {
        this.redraw()
    }
};
Title.prototype.setShowMaxLen = function (a) {
    this.iShowLen = a
};
Title.prototype.createDiv = function (a) {
    if (typeof a != "undefined" && a != null) {
        this.map = a
    }
    a.divPaint.appendChild(this.div);
    this.redraw()
};
g_title_index = 0;
Title.prototype.redraw = function () {
    window.status = "==>" + g_title_index++;
    var c = this.map.convert2WPoint(this.point.x, this.point.y);
    if (this.div != null) {
        var e = c.x;
        var d = c.y;
        var b = this.fontSize * StrLength(this.name) / 2;
        var a = this.fontSize;
        if (this.pos == 0) {
            e = c.x;
            d = c.y - a / 2
        } else {
            if (this.pos == 1) {
                e = c.x + b / 2;
                d = c.y - a / 2
            } else {
                if (this.pos == 2) {
                    e = c.x + b / 2;
                    d = c.y
                } else {
                    if (this.pos == 3) {
                        e = c.x + b / 2;
                        d = c.y + a / 2
                    } else {
                        if (this.pos == 4) {
                            e = c.x;
                            d = c.y + a / 2
                        } else {
                            if (this.pos == 5) {
                                e = c.x - b / 2;
                                d = c.y + a / 2
                            } else {
                                if (this.pos == 6) {
                                    e = c.x - b / 2;
                                    d = c.y - a / 2
                                } else {
                                    e = c.x - b / 2;
                                    d = c.y - a / 2
                                }
                            }
                        }
                    }
                }
            }
        }
        this.div.style.top = convert2Px(d);
        this.div.style.left = convert2Px(e);
        if (this.bIsTransparent) {
            this.div.style.width = convert2Px(b + this.fontSize)
        }
        if (this.div.innerHTML != this.title) {
            this.div.title = this.name;
            this.div.innerHTML = this.title
        }
        if (this.dragObject) {
        }
    }
};
Title.prototype.removeFromDiv = function () {
    if (!this.div) {
        return
    }
    this.pause();
    if (this.map) {
        this.map.divPaint.removeChild(this.div);
        EventManager.removeNode(this.div)
    }
};
Title.prototype.setOpacity = function (a) {
    this.opacity = a + "";
    var b = this.div;
    if (b) {
        b.style.filter = "ALPHA(opacity=" + this.opacity * 100 + ")"
    }
};
Title.prototype.openInfoWindowHtml = function (a, c) {
    try {
        this.map.blowupOverlay(this);
        this.map.openInfoWindow(this.point.x, this.point.y, a, c)
    } catch (b) {
        throw EzErrorFactory.createError("Title::openInfoWindowHtml方法中不正确", b)
    }
};
Title.prototype.closeInfoWindowHtml = function () {
    this.map.closeInfoWindow()
};
function MultiPoint(a) {
    if (typeof a == "string") {
        this.coordSequence = a || "";
        var c = this.coordSequence.split(",");
        this.points = [];
        for (var b = 0; b < c.length; b = b + 2) {
            this.points.push(new Point(parseFloat(c[b]), parseFloat(c[b + 1])))
        }
        c = null
    } else {
        if (a instanceof Array) {
            if (a.length > 0) {
                this.points = a;
                this.coordSequence = "";
                for (var b = 0; b < this.points.length; b++) {
                    if (b != this.points.length - 1) {
                        this.coordSequence += this.points[b].x + "," + this.points[b].y + ","
                    } else {
                        this.coordSequence += this.points[b].x + "," + this.points[b].y
                    }
                }
            } else {
                throw new Error("MultiPoint 构造参数有误")
            }
        } else {
            throw new Error("MultiPoint 构造参数有误")
        }
    }
    this.getCenter = function () {
        var d = this.getMBR();
        return new Point((d.minX + d.maxX) / 2, (d.minY + d.maxY) / 2)
    };
    this.getMBR = function () {
        var h, g, e, d;
        h = e = this.getSegment(0).x;
        g = d = this.getSegment(0).y;
        for (var f = 1; f < this.getSegmentCount(); f++) {
            if (h > this.getSegment(f).x) {
                h = this.getSegment(f).x
            } else {
                if (e < this.getSegment(f).x) {
                    e = this.getSegment(f).x
                }
            }
            if (g > this.getSegment(f).y) {
                g = this.getSegment(f).y
            } else {
                if (d < this.getSegment(f).y) {
                    d = this.getSegment(f).y
                }
            }
        }
        return new MBR(h, g, e, d)
    };
    this.getSegmentCount = function () {
        return this.points.length
    };
    this.getSegment = function (d) {
        try {
            if (!(EzServerClient.GlobeFunction.isTypeRight(d, "int"))) {
                throw EzErrorFactory.createError("MultiPoint::getSegment方法中arguments[0]类型不正确")
            }
            return this.points[d]
        } catch (f) {
            throw EzErrorFactory.createError("MultiPoint::getSegment方法中不正确", f)
        }
    };
    this.getCoordSequence = function () {
        return this.coordSequence
    };
    this.getSegments = function () {
        return this.points
    };
    this.setCoordSequence = function (d) {
        try {
            if (!(EzServerClient.GlobeFunction.isTypeRight(d, "string")) && !(EzServerClient.GlobeFunction.isTypeRight(d, "Array"))) {
                throw EzErrorFactory.createError("MultiPoint::setCoordSequence方法中arguments[0]类型不正确")
            }
            if (typeof d == "string") {
                this.coordSequence = d || "";
                var g = this.coordSequence.split(",");
                this.points = [];
                for (var f = 0; f < g.length; f = f + 2) {
                    this.points.push(new Point(parseFloat(g[f]), parseFloat(g[f + 1])))
                }
                g = null
            } else {
                if (d instanceof Array) {
                    if (d.length > 0) {
                        this.points = d;
                        this.coordSequence = "";
                        for (var f = 0; f < this.points.length; f++) {
                            if (f != this.points.length - 1) {
                                this.coordSequence += this.points[f].x + "," + this.points[f].y + ","
                            } else {
                                this.coordSequence += this.points[f].x + "," + this.points[f].y
                            }
                        }
                    } else {
                        throw new Error("MultiPoint::setCoordSequence方法传入的参数无效")
                    }
                } else {
                    throw new Error("MultiPoint::setCoordSequence方法传入的参数无效")
                }
            }
        } catch (h) {
            throw EzErrorFactory.createError("MultiPoint::setCoordSequence方法中不正确", h)
        }
    };
    this.addSegment = function (d) {
        try {
            if (!(EzServerClient.GlobeFunction.isTypeRight(d, "string")) && !(EzServerClient.GlobeFunction.isTypeRight(d, "Array"))) {
                throw EzErrorFactory.createError("MultiPoint::addSegment方法中arguments[0]类型不正确")
            }
            if (typeof d == "string") {
                this.coordSequence += "," + d;
                var f = d.split(",");
                this.points.push(new Point(f[0], f[1]));
                f = null
            } else {
                if (d instanceof Point) {
                    this.points.push(d);
                    this.coordSequence += "," + d.x + "," + d.y
                } else {
                    throw new Error("MultiPoint::addSegment传入参数不正确")
                }
            }
        } catch (g) {
            throw EzErrorFactory.createError("MultiPoint::addSegment方法中不正确", g)
        }
    };
    this.addSegments = function (d) {
        try {
            if (!(EzServerClient.GlobeFunction.isTypeRight(d, "string")) && !(EzServerClient.GlobeFunction.isTypeRight(d, "Array"))) {
                throw EzErrorFactory.createError("MultiPoint::addSegments方法中arguments[0]类型不正确")
            }
            if (typeof d == "string") {
                this.coordSequence += "," + d;
                var g = d.split(",");
                for (var f = 0; f < g.length; f = f + 2) {
                    this.points.push(new Point(g[f], g[f + 1]))
                }
                g = null
            } else {
                if (d instanceof Array) {
                    this.points = this.points.concat(d);
                    for (var f = 0; f < d.length; f++) {
                        this.coordSequence += "," + d[f].x + "," + d[f].y
                    }
                } else {
                    throw new Error("MultiPoint::addSegments传入参数不正确")
                }
            }
        } catch (h) {
            throw EzErrorFactory.createError("MultiPoint::addSegments方法中不正确", h)
        }
    };
    this.getGeometryType = function () {
        return "multipoint"
    }
}
function MultiPolyline(c, a, g, b, f) {
    this.color = a;
    this.weight = g;
    this.opacity = b;
    this.arrow = f;
    if (typeof c == "string") {
        this.coordSequence = c || "";
        this.polylines = [];
        var e = this.coordSequence.split(";");
        for (var d = 0; d < e.length; d++) {
            this.polylines.push(new Polyline(e[d], this.color, this.weight, this.opacity, this.arrow))
        }
        e = null
    } else {
        throw new Error("MultiPolyline 构造参数有误")
    }
    this.getCenter = function () {
        var j = this.getMBR();
        var h = new Point((j.minX + j.maxX) / 2, (j.minY + j.maxY) / 2);
        j = null;
        return h
    };
    this.getMBR = function () {
        var o, k, m, j;
        var n = this.getSegment(0).getMBR();
        o = n.minX;
        k = n.maxX;
        m = n.minY;
        j = n.maxY;
        var h = null;
        for (var l = 1; l < this.getSegmentCount(); l++) {
            h = this.getSegment(l).getMBR();
            if (o > h.minX) {
                o = h.minX
            }
            if (k < h.maxX) {
                k = h.maxX
            }
            if (m > h.minY) {
                m = h.minY
            }
            if (j < h.maxY) {
                j = h.maxY
            }
        }
        h = null;
        return new MBR(o, m, k, j)
    };
    this.getSegmentCount = function () {
        return this.polylines.length
    };
    this.getSegment = function (h) {
        try {
            if (!(EzServerClient.GlobeFunction.isTypeRight(h, "int"))) {
                throw EzErrorFactory.createError("MultiPolyline::getSegment方法中arguments[0]类型不正确")
            }
            return this.polylines[h]
        } catch (j) {
            throw EzErrorFactory.createError("MultiPolyline::getSegment方法中不正确", j)
        }
    };
    this.getCoordSequence = function () {
        return this.coordSequence
    };
    this.getSegments = function () {
        return this.polylines
    };
    this.setCoordSequence = function (h) {
        try {
            if (!(EzServerClient.GlobeFunction.isTypeRight(h, "string"))) {
                throw EzErrorFactory.createError("MultiPolyline::setCoordSequence方法中arguments[0]类型不正确")
            }
            if (typeof h == "string") {
                this.coordSequence = h || "";
                this.polylines = [];
                var k = this.coordSequence.split(";");
                for (var j = 0; j < k.length; j++) {
                    this.polylines.push(new Polyline(k[j], this.color, this.weight, this.opacity, this.arrow))
                }
                k = null
            } else {
                throw new Error("MultiPolyline::setCoordSequence 传入参数类型无效")
            }
        } catch (l) {
            throw EzErrorFactory.createError("MultiPolyline::setCoordSequence方法中不正确", l)
        }
    };
    this.addSegment = function (h) {
        try {
            if (!(EzServerClient.GlobeFunction.isTypeRight(h, "string"))) {
                throw EzErrorFactory.createError("MultiPolyline::addSegment方法中arguments[0]类型不正确")
            }
            if (typeof h == "string") {
                this.coordSequence += ";" + h;
                this.polylines.push(new Polyline(h, this.color, this.weight, this.opacity, this.arrow))
            } else {
                throw new Error("MultiPolyline::addSegment 传入参数类型无效")
            }
        } catch (j) {
            throw EzErrorFactory.createError("MultiPolyline::addSegment 方法中不正确", j)
        }
    };
    this.addSegments = function (h) {
        try {
            if (!(EzServerClient.GlobeFunction.isTypeRight(h, "string"))) {
                throw EzErrorFactory.createError("MultiPolyline::addSegment方法中arguments[0]类型不正确")
            }
            if (typeof h == "string") {
                this.coordSequence += ";" + h;
                var k = h.split(";");
                for (var j = 0; j < k.length; j++) {
                    this.polylines.push(new Polyline(k[j], this.color, this.weight, this.opacity, this.arrow))
                }
                k = null
            } else {
                throw new Error("MultiPolyline::addSegments 传入参数类型无效")
            }
        } catch (l) {
            throw EzErrorFactory.createError("MultiPolyline::addSegment方法中不正确", l)
        }
    };
    this.getGeometryType = function () {
        return "multipolyline"
    }
}
function MultiPolygon(c, a, g, b, f) {
    this.color = a;
    this.weight = g;
    this.opacity = b;
    this.fillcolor = f;
    if (typeof c == "string") {
        this.coordSequence = c || "";
        this.polygons = [];
        var e = this.coordSequence.split("|");
        for (var d = 0; d < e.length; d++) {
            this.polygons.push(new Polygon(e[d], this.color, this.weight, this.opacity, this.fillcolor))
        }
        e = null
    } else {
        throw new Error("MultiPolygon 构造参数有误")
    }
    this.getCenter = function () {
        var j = this.getMBR();
        var h = new Point((j.minX + j.maxX) / 2, (j.minY + j.maxY) / 2);
        j = null;
        return h
    };
    this.getMBR = function () {
        var o, k, m, j;
        var n = this.getSegment(0).getMBR();
        o = n.minX;
        k = n.maxX;
        m = n.minY;
        j = n.maxY;
        var h = null;
        for (var l = 1; l < this.getSegmentCount(); l++) {
            h = this.getSegment(l).getMBR();
            if (o > h.minX) {
                o = h.minX
            }
            if (k < h.maxX) {
                k = h.maxX
            }
            if (m > h.minY) {
                m = h.minY
            }
            if (j < h.maxY) {
                j = h.maxY
            }
        }
        h = null;
        return new MBR(o, m, k, j)
    };
    this.getSegmentCount = function () {
        return this.polygons.length
    };
    this.getSegment = function (h) {
        try {
            if (!(EzServerClient.GlobeFunction.isTypeRight(h, "int"))) {
                throw EzErrorFactory.createError("MultiPolygon::getSegment方法中arguments[0]类型不正确")
            }
            return this.polygons[h]
        } catch (j) {
            throw EzErrorFactory.createError("MultiPolygon::getSegment方法中不正确", j)
        }
    };
    this.getCoordSequence = function () {
        return this.coordSequence
    };
    this.getSegments = function () {
        return this.polygons
    };
    this.setCoordSequence = function (h) {
        try {
            if (!(EzServerClient.GlobeFunction.isTypeRight(h, "string"))) {
                throw EzErrorFactory.createError("MultiPolygon::setCoordSequence方法中arguments[0]类型不正确")
            }
            if (typeof h == "string") {
                this.coordSequence = h || "";
                this.polygons = [];
                var k = this.coordSequence.split("|");
                for (var j = 0; j < k.length; j++) {
                    this.polygons.push(new Polygon(k[j], this.color, this.weight, this.opacity, this.fillcolor))
                }
                k = null
            } else {
                throw new Error("MultiPolygon::setCoordSequence 传入参数类型无效")
            }
        } catch (l) {
            throw EzErrorFactory.createError("MultiPolygon::setCoordSequence方法中不正确", l)
        }
    };
    this.addSegment = function (h) {
        try {
            if (!(EzServerClient.GlobeFunction.isTypeRight(h, "string"))) {
                throw EzErrorFactory.createError("MultiPolygon::addSegment方法中arguments[0]类型不正确")
            }
            if (typeof h == "string") {
                this.coordSequence += "|" + h;
                this.polygons.push(new Polygon(h, this.color, this.weight, this.opacity, this.fillcolor))
            } else {
                throw new Error("MultiPolygon::addSegment传入参数类型无效")
            }
        } catch (j) {
            throw EzErrorFactory.createError("MultiPolygon::addSegment方法中不正确", j)
        }
    };
    this.addSegments = function (h) {
        try {
            if (!(EzServerClient.GlobeFunction.isTypeRight(h, "string"))) {
                throw EzErrorFactory.createError("MultiPolygon::addSegments方法中arguments[0]类型不正确")
            }
            if (typeof h == "string") {
                this.coordSequence += "|" + h;
                var k = h.split("|");
                for (var j = 0; j < k.length; j++) {
                    this.polygons.push(new Polygon(k[j], this.color, this.weight, this.opacity, this.fillcolor))
                }
                k = null
            } else {
                throw new Error("MultiPolygon::addSegments 传入参数类型无效")
            }
        } catch (l) {
            throw EzErrorFactory.createError("MultiPolygon::addSegments方法中不正确", l)
        }
    };
    this.getGeometryType = function () {
        return "multipolygon"
    }
}
function EzShape(a, b) {
    this.geometryType = a;
    this.coordinateSequence = b;
    this.getGeometryType = function () {
        return this.geometryType
    };
    this.getCoordinateSequence = function () {
        return this.coordinateSequence
    };
    this.setGeometryType = function (c) {
        try {
            if (!(EzServerClient.GlobeFunction.isTypeRight(c, "string"))) {
                throw EzErrorFactory.createError("EzShape::setGeometryType方法中arguments[0]类型不正确")
            } else {
                this.geometryType = c
            }
        } catch (d) {
            throw EzErrorFactory.createError("EzShape::setGeometryType方法中不正确", d)
        }
    };
    this.setCoordinateSequence = function (d) {
        try {
            if (!(EzServerClient.GlobeFunction.isTypeRight(a, "string"))) {
                throw EzErrorFactory.createError("EzShape::setCoordinateSequence方法中arguments[0]类型不正确")
            } else {
                this.coordinateSequence = d
            }
        } catch (c) {
            throw EzErrorFactory.createError("EzShape::setCoordinateSequence方法中不正确", c)
        }
    }
}
if (typeof EzGeoPSTool == "undefined" || !EzGeoPSTool) {
    var EzGeoPSTool = {}
}
EzGeoPSTool.equals = function (d, b) {
    try {
        if (typeof ezgeops == "undefined") {
            throw EzErrorFactory.createError("EzGeographicProcessingService服务连接问题或服务异常")
        } else {
            if (!(EzServerClient.GlobeFunction.isTypeRight(d, "object")) || !(EzServerClient.GlobeFunction.isTypeRight(b, "object"))) {
                throw EzErrorFactory.createError("EzGeoPSTool.equals方法调用时传入的参数类型不正确")
            } else {
                var c = EzGeoPSTool.convertGeometry_EzSC2EzGeoPS(d);
                var a = EzGeoPSTool.convertGeometry_EzSC2EzGeoPS(b);
                return c.equals(a)
            }
        }
    } catch (f) {
        throw EzErrorFactory.createError("EzGeoPSTool.equals方法执行不正确", f)
    }
};
EzGeoPSTool.disjoint = function (d, b) {
    try {
        if (typeof ezgeops == "undefined") {
            throw EzErrorFactory.createError("EzGeographicProcessingService服务连接问题或服务异常")
        } else {
            if (!(EzServerClient.GlobeFunction.isTypeRight(d, "object")) || !(EzServerClient.GlobeFunction.isTypeRight(b, "object"))) {
                throw EzErrorFactory.createError("EzGeoPSTool.disjoint方法调用时传入的参数类型不正确")
            } else {
                var c = EzGeoPSTool.convertGeometry_EzSC2EzGeoPS(d);
                var a = EzGeoPSTool.convertGeometry_EzSC2EzGeoPS(b);
                return c.disjoint(a)
            }
        }
    } catch (f) {
        throw EzErrorFactory.createError("EzGeoPSTool.disjoint方法执行不正确", f)
    }
};
EzGeoPSTool.intersects = function (d, b) {
    try {
        if (typeof ezgeops == "undefined") {
            throw EzErrorFactory.createError("EzGeographicProcessingService服务连接问题或服务异常")
        } else {
            if (!(EzServerClient.GlobeFunction.isTypeRight(d, "object")) || !(EzServerClient.GlobeFunction.isTypeRight(b, "object"))) {
                throw EzErrorFactory.createError("EzGeoPSTool.intersects方法调用时传入的参数类型不正确")
            } else {
                var c = EzGeoPSTool.convertGeometry_EzSC2EzGeoPS(d);
                var a = EzGeoPSTool.convertGeometry_EzSC2EzGeoPS(b);
                return c.intersects(a)
            }
        }
    } catch (f) {
        throw EzErrorFactory.createError("EzGeoPSTool.intersects方法执行不正确", f)
    }
};
EzGeoPSTool.touches = function (d, b) {
    try {
        if (typeof ezgeops == "undefined") {
            throw EzErrorFactory.createError("EzGeographicProcessingService服务连接问题或服务异常")
        } else {
            if (!(EzServerClient.GlobeFunction.isTypeRight(d, "object")) || !(EzServerClient.GlobeFunction.isTypeRight(b, "object"))) {
                throw EzErrorFactory.createError("EzGeoPSTool.touches方法调用时传入的参数类型不正确")
            } else {
                var c = EzGeoPSTool.convertGeometry_EzSC2EzGeoPS(d);
                var a = EzGeoPSTool.convertGeometry_EzSC2EzGeoPS(b);
                return c.touches(a)
            }
        }
    } catch (f) {
        throw EzErrorFactory.createError("EzGeoPSTool.touches方法执行不正确", f)
    }
};
EzGeoPSTool.crosses = function (d, b) {
    try {
        if (typeof ezgeops == "undefined") {
            throw EzErrorFactory.createError("EzGeographicProcessingService服务连接问题或服务异常")
        } else {
            if (!(EzServerClient.GlobeFunction.isTypeRight(d, "object")) || !(EzServerClient.GlobeFunction.isTypeRight(b, "object"))) {
                throw EzErrorFactory.createError("EzGeoPSTool.crosses方法调用时传入的参数类型不正确")
            } else {
                var c = EzGeoPSTool.convertGeometry_EzSC2EzGeoPS(d);
                var a = EzGeoPSTool.convertGeometry_EzSC2EzGeoPS(b);
                return c.crosses(a)
            }
        }
    } catch (f) {
        throw EzErrorFactory.createError("EzGeoPSTool.crosses方法执行不正确", f)
    }
};
EzGeoPSTool.within = function (d, b) {
    try {
        if (typeof ezgeops == "undefined") {
            throw EzErrorFactory.createError("EzGeographicProcessingService服务连接问题或服务异常")
        } else {
            if (!(EzServerClient.GlobeFunction.isTypeRight(d, "object")) || !(EzServerClient.GlobeFunction.isTypeRight(b, "object"))) {
                throw EzErrorFactory.createError("EzGeoPSTool.within方法调用时传入的参数类型不正确")
            } else {
                var c = EzGeoPSTool.convertGeometry_EzSC2EzGeoPS(d);
                var a = EzGeoPSTool.convertGeometry_EzSC2EzGeoPS(b);
                return c.within(a)
            }
        }
    } catch (f) {
        throw EzErrorFactory.createError("EzGeoPSTool.within方法执行不正确", f)
    }
};
EzGeoPSTool.contains = function (d, b) {
    try {
        if (typeof ezgeops == "undefined") {
            throw EzErrorFactory.createError("EzGeographicProcessingService服务连接问题或服务异常")
        } else {
            if (!(EzServerClient.GlobeFunction.isTypeRight(d, "object")) || !(EzServerClient.GlobeFunction.isTypeRight(b, "object"))) {
                throw EzErrorFactory.createError("EzGeoPSTool.contains方法调用时传入的参数类型不正确")
            } else {
                var c = EzGeoPSTool.convertGeometry_EzSC2EzGeoPS(d);
                var a = EzGeoPSTool.convertGeometry_EzSC2EzGeoPS(b);
                return c.contains(a)
            }
        }
    } catch (f) {
        throw EzErrorFactory.createError("EzGeoPSTool.contains方法执行不正确", f)
    }
};
EzGeoPSTool.overlaps = function (d, b) {
    try {
        if (typeof ezgeops == "undefined") {
            throw EzErrorFactory.createError("EzGeographicProcessingService服务连接问题或服务异常")
        } else {
            if (!(EzServerClient.GlobeFunction.isTypeRight(d, "object")) || !(EzServerClient.GlobeFunction.isTypeRight(b, "object"))) {
                throw EzErrorFactory.createError("EzGeoPSTool.overlaps方法调用时传入的参数类型不正确")
            } else {
                var c = EzGeoPSTool.convertGeometry_EzSC2EzGeoPS(d);
                var a = EzGeoPSTool.convertGeometry_EzSC2EzGeoPS(b);
                return c.overlaps(a)
            }
        }
    } catch (f) {
        throw EzErrorFactory.createError("EzGeoPSTool.overlaps方法执行不正确", f)
    }
};
EzGeoPSTool.intersection = function (d, b) {
    try {
        if (typeof ezgeops == "undefined") {
            throw EzErrorFactory.createError("EzGeographicProcessingService服务连接问题或服务异常")
        } else {
            if (!(EzServerClient.GlobeFunction.isTypeRight(d, "object")) || !(EzServerClient.GlobeFunction.isTypeRight(b, "object"))) {
                throw EzErrorFactory.createError("EzGeoPSTool.intersection方法调用时传入的参数类型不正确")
            } else {
                var c = EzGeoPSTool.convertGeometry_EzSC2EzGeoPS(d);
                var a = EzGeoPSTool.convertGeometry_EzSC2EzGeoPS(b);
                var f = c.intersection(a);
                return EzGeoPSTool.convertGeometry_EzGeoPS2EzSC(f)
            }
        }
    } catch (g) {
        throw EzErrorFactory.createError("EzGeoPSTool.intersection方法执行不正确", g)
    }
};
EzGeoPSTool.union = function (d, b) {
    try {
        if (typeof ezgeops == "undefined") {
            throw EzErrorFactory.createError("EzGeographicProcessingService服务连接问题或服务异常")
        } else {
            if (!(EzServerClient.GlobeFunction.isTypeRight(d, "object")) || !(EzServerClient.GlobeFunction.isTypeRight(b, "object"))) {
                throw EzErrorFactory.createError("EzGeoPSTool.union方法调用时传入的参数类型不正确")
            } else {
                var c = EzGeoPSTool.convertGeometry_EzSC2EzGeoPS(d);
                var a = EzGeoPSTool.convertGeometry_EzSC2EzGeoPS(b);
                var f = c.union(a);
                return EzGeoPSTool.convertGeometry_EzGeoPS2EzSC(f)
            }
        }
    } catch (g) {
        throw EzErrorFactory.createError("EzGeoPSTool.union方法执行不正确", g)
    }
};
EzGeoPSTool.difference = function (d, b) {
    try {
        if (typeof ezgeops == "undefined") {
            throw EzErrorFactory.createError("EzGeographicProcessingService服务连接问题或服务异常")
        } else {
            if (!(EzServerClient.GlobeFunction.isTypeRight(d, "object")) || !(EzServerClient.GlobeFunction.isTypeRight(b, "object"))) {
                throw EzErrorFactory.createError("EzGeoPSTool.difference方法调用时传入的参数类型不正确")
            } else {
                var c = EzGeoPSTool.convertGeometry_EzSC2EzGeoPS(d);
                var a = EzGeoPSTool.convertGeometry_EzSC2EzGeoPS(b);
                var f = c.difference(a);
                return EzGeoPSTool.convertGeometry_EzGeoPS2EzSC(f)
            }
        }
    } catch (g) {
        throw EzErrorFactory.createError("EzGeoPSTool.difference方法执行不正确", g)
    }
};
EzGeoPSTool.buffer = function (c, j) {
    try {
        if (typeof ezgeops == "undefined") {
            throw EzErrorFactory.createError("EzGeographicProcessingService服务连接问题或服务异常")
        } else {
            if (!(EzServerClient.GlobeFunction.isTypeRight(c, "object")) || !(EzServerClient.GlobeFunction.isTypeRight(j, "float"))) {
                throw EzErrorFactory.createError("EzGeoPSTool.buffer方法调用时传入的参数类型不正确")
            } else {
                if (c.getGeometryType() == "circle") {
                    var b = c.getCenter();
                    var h = c.getRadius() + j;
                    var g = b.x + "," + b.y + "," + h;
                    return new Circle(g, c.getColor(), c.getWidth(), c.getFillOpacity(), c.getFillColor())
                } else {
                    if (c.getGeometryType() == "point") {
                        return new Circle(c.x + "," + c.y + "," + j)
                    } else {
                        var a = EzGeoPSTool.convertGeometry_EzSC2EzGeoPS(c);
                        var d = a.buffer(j);
                        return EzGeoPSTool.convertGeometry_EzGeoPS2EzSC(d)
                    }
                }
            }
        }
    } catch (f) {
        throw EzErrorFactory.createError("EzGeoPSTool.buffer方法执行不正确", f)
    }
};
EzGeoPSTool.simplify = function (a, f) {
    try {
        if (typeof ezgeops == "undefined") {
            throw EzErrorFactory.createError("EzGeographicProcessingService服务连接问题或服务异常")
        } else {
            if (!(EzServerClient.GlobeFunction.isTypeRight(a, "object")) || !(EzServerClient.GlobeFunction.isTypeRight(f, "float"))) {
                throw EzErrorFactory.createError("EzGeoPSTool.simplify方法调用时传入的参数类型不正确")
            } else {
                var d = EzGeoPSTool.convertGeometry_EzSC2EzGeoPS(a);
                var b = ezgeops.GeometryUtil.simplify(d, f);
                return EzGeoPSTool.convertGeometry_EzGeoPS2EzSC(b)
            }
        }
    } catch (c) {
        throw EzErrorFactory.createError("EzGeoPSTool.simplify方法执行不正确", c)
    }
};
EzGeoPSTool.isValid = function (b) {
    try {
        if (typeof ezgeops == "undefined") {
            throw EzErrorFactory.createError("EzGeographicProcessingService服务连接问题或服务异常")
        } else {
            if (!(EzServerClient.GlobeFunction.isTypeRight(b, "object"))) {
                throw EzErrorFactory.createError("EzGeoPSTool.isValid方法调用时传入的参数类型不正确")
            } else {
                var a = EzGeoPSTool.convertGeometry_EzSC2EzGeoPS(b);
                return ezgeops.GeometryUtil.isValid(a)
            }
        }
    } catch (c) {
        throw EzErrorFactory.createError("EzGeoPSTool.isValid方法执行不正确", c)
    }
};
EzGeoPSTool.getCirclePoints = function (h, g, a, e, d) {
    h = parseFloat(h);
    g = parseFloat(g);
    a = parseFloat(a);
    e = parseInt(e);
    d = parseInt(d);
    var c = new Array();
    for (var b = e; b < d; b += 4) {
        var f = 2 * Math.PI * b / 360;
        var k = Math.ceil((h + a * Math.cos(f)) * 1000000) / 1000000;
        var j = Math.ceil((g + a * Math.sin(f)) * 1000000) / 1000000;
        c.push(k + "," + j)
    }
    c.push(c[0]);
    return c.join(",")
};
EzGeoPSTool.convertGeometry_EzSC2EzGeoPS = function (g) {
    var e, j;
    var d = new ezgeops.plus.EXTReader();
    var f = g.getGeometryType();
    switch (f) {
        case "point":
            e = new ezgeops.plus.EXTGeometry("Point", g.getCoordSequence());
            j = d.read(e);
            break;
        case "multipoint":
            e = new ezgeops.plus.EXTGeometry("MultiPoint", g.getCoordSequence());
            j = d.read(e);
            break;
        case "polyline":
            e = new ezgeops.plus.EXTGeometry("Polyline", g.getCoordSequence());
            j = d.read(e);
            break;
        case "multipolyline":
            e = new ezgeops.plus.EXTGeometry("MultiPolyline", g.getCoordSequence());
            j = d.read(e);
            break;
        case "polygon":
            e = new ezgeops.plus.EXTGeometry("Polygon", g.getCoordSequence());
            j = d.read(e);
            break;
        case "multipolygon":
            e = new ezgeops.plus.EXTGeometry("MultiPolygon", g.getCoordSequence());
            j = d.read(e);
            break;
        case "rectangle":
            var b = g.getCoordSequence();
            var h = b.split(",");
            var a = h[0] + "," + h[1] + "," + h[2] + "," + h[1] + "," + h[2] + "," + h[3] + "," + h[0] + "," + h[3] + "," + h[0] + "," + h[1];
            e = new ezgeops.plus.EXTGeometry("Polygon", a);
            j = d.read(e);
            break;
        case "circle":
            var c = g.getCenter();
            var a = EzGeoPSTool.getCirclePoints(c.x, c.y, g.getRadius(), 0, 360);
            e = new ezgeops.plus.EXTGeometry("Polygon", a);
            j = d.read(e);
            break
    }
    return j
};
EzGeoPSTool.convertGeometry_EzGeoPS2EzSC = function (f) {
    var e = new ezscGeo.plus.EXTWriter();
    var d = e.write(f.asText());
    var b = d.getType();
    var a = d.getContentText();
    var c;
    switch (b) {
        case "point":
            c = new Point(a);
            break;
        case "multipoint":
            c = new MultiPoint(a);
            break;
        case "polyline":
            c = new Polyline(a);
            break;
        case "multipolyline":
            c = new MultiPolyline(a);
            break;
        case "polygon":
            c = new Polygon(a);
            break;
        case "multipolygon":
            c = new MultiPolygon(a);
            break;
        default:
            throw "传入的不是一个合法的对象的类型！"
    }
    return c
};
function divCreator() {
}
divCreator.setImage = function (e, d, f) {
    if (e.tagName == "DIV") {
        e.cleared = false;
        if (e.loader.ieCrop)
            e.loader.ieCrop = f || false;
        e.loader.src = d
    } else {
        e.src = d
    }
};
divCreator.clearImage = function (d, c) {
    if (d.tagName == "DIV") {
        d.cleared = true;
        d.style.filter = ""
    } else {
        d.src = c
    }
};
divCreator.destroyBeforeUnload = function (b) {
    if (!divCreator.cleanupQueue) {
        divCreator.cleanupQueue = [];
        EventManager.addUnloadFunc(divCreator.onUnload)
    }
    divCreator.cleanupQueue.push(b)
};
divCreator.onUnload = function () {
    window.status = "清除对DOM的引用..";
    window.defaultStatus = "";
    for (var b = 0; b < divCreator.cleanupQueue.length; ++b) {
        window.status = "清除对DOM的引用.." + b;
        divCreator.destroyImage(divCreator.cleanupQueue[b])
    }
};
divCreator.destroyImage = function (b) {
    if (b.loader) {
        b.loader.onload = null;
        b.loader = null
    }
};
// 拖放事件
function DragEvent(a, c, b, d) {
    this.bIsMouseDown = false;
    this.src = a;
    this.container = d;
    this.ondragstart = null;
    this.ondrag = null;
    this.ondragend = null;
    this.onmove = null;
    this.onclick = null;
    this.disabled = false;
    this.dragPoint = new Point(0, 0);
    this.clickStartPos = new Point(0, 0);
    //this.src.style.position = "absolute";
    this.bIsPan = true;
    this.moveTo(c != null ? c : a.offsetLeft, b != null ? b : a.offsetTop);
    this.mouseDownHandler = this.eventHandler("onMouseDown");
    this.mouseMoveHandler = this.eventHandler("onMouseMove");
    this.mouseUpHandler = this.eventHandler("onMouseUp");
    if (_IEBrowser.type == 2) {
        BindingEvent(window, "mouseout", this.eventHandler("onWindowMouseOut"))
    }
    this.eventSrc = this.src.setCapture ? this.src : window;
    BindingEvent(this.src, "mousedown", this.mouseDownHandler)
}
DragEvent.prototype.moveTo = function (c, b) {
    try {
        if (this.left != c || this.top != b) {
            this.left = c;
            this.top = b;
            this.src.style.left = this.left + "px";
            this.src.style.top = this.top + "px";
            if (EzServerClient.GlobeParams.VML) {
            } else {
                if (this.src.childNodes[0]) {
                    this.src.childNodes[0].style.top = (-(this.top)) + "px";
                    this.src.childNodes[0].style.left = (-(this.left)) + "px";
                    this.svg = this.src.childNodes[0].childNodes[0].childNodes;
                    if (this.svg) {
                        for (var i = 0, j = this.svg.length; i < j; i++) {
                            var transformString = "translate(" + this.left + "," + this.top + ")";
                            this.svg[i].setAttributeNS(null, "transform", transformString);
                            this.svg[i].setAttribute("transform", "translate(" + this.left + "," + this.top + ")");
                        };
                    }
                }
            }

            if (this.onmove) {
                this.onmove()
            }
        }
    } catch (a) {
        alert("moveTo:" + a.message)
    }
};
DragEvent.prototype.onMouseDown = function (a) {
    this.bIsMouseDown = true;
    if (a.cancelDrag) {
        return
    }
    var c = a.button == 0 || a.button == 1;
    if (this.disabled || !c) {
        return false
    }
    this.dragPoint.x = a.clientX;
    this.dragPoint.y = a.clientY;
    BindingEvent(this.eventSrc, "mousemove", this.mouseMoveHandler);
    BindingEvent(this.eventSrc, "mouseup", this.mouseUpHandler);
    if (this.src.setCapture) {
        this.src.setCapture()
    }
    this.clickStartTime = (new Date()).getTime();
    this.clickStartPos.x = a.clientX;
    this.clickStartPos.y = a.clientY;
    if (this.ondragstart) {
        this.ondragstart(a)
    }
    this.originalCursor = this.src.style.cursor;
    if (this.bIsPan) {
        setCursor(this.src, "move")
    }
    S(a)
};
DragEvent.prototype.onMouseMove = function (h) {
    if (_IEBrowser.os == 1) {
        if (h == null) {
            return
        }
        if (this.dragDisabled) {
            this.savedMove = new Object();
            this.savedMove.clientX = h.clientX;
            this.savedMove.clientY = h.clientY;
            return
        }
        this.setTimeout("this.dragDisabled = false; this.onMouseMove(this.savedMove)", 30);
        this.dragDisabled = true;
        this.savedMove = null
    }
    var j = this.left + (h.clientX - this.dragPoint.x);
    var d = this.top + (h.clientY - this.dragPoint.y);
    var c = 0;
    var f = 0;
    if (this.container) {
        var g = j;
        if (j < this.container.minX) {
            g = this.container.minX
        } else {
            var k = this.container.maxX - this.src.offsetWidth;
            if (j > k) {
                g = k
            }
        }
        c = g - j;
        j = g;
        var a = d;
        if (d < this.container.minY) {
            a = this.container.minY
        } else {
            var e = this.container.maxY - this.src.offsetHeight;
            if (d > e) {
                a = e
            }
        }
        f = a - d;
        d = a
    }
    this.moveTo(j, d);
    this.dragPoint.x = h.clientX + c;
    this.dragPoint.y = h.clientY + f;
    if (this.ondrag) {
        this.ondrag(h)
    }
};
DragEvent.prototype.onMouseUp = function (a) {
    this.bIsMouseDown = false;
    unbindingEvent(this.eventSrc, "mousemove", this.mouseMoveHandler);
    unbindingEvent(this.eventSrc, "mouseup", this.mouseUpHandler);
    setCursor(this.src, this.originalCursor);
    if (document.releaseCapture) {
        document.releaseCapture()
    }
    if (this.ondragend) {
        this.ondragend(a)
    }
    if (this.onclick) {
        var c = (new Date()).getTime();
        if (c - this.clickStartTime <= 500 && (Math.abs(this.clickStartPos.x - a.clientX) <= 2 && Math.abs(this.clickStartPos.y - a.clientY) <= 2)) {
            this.onclick(a)
        }
    }
};
DragEvent.prototype.onWindowMouseOut = function (a) {
    if (!a.relatedTarget) {
        this.onMouseUp(a)
    }
};
DragEvent.prototype.disable = function () {
    this.disabled = true
};
DragEvent.prototype.enable = function () {
    this.disabled = false
};
var EventManager = { _registry: null, _unload: [], Initialise: function () {
    if (this._registry == null) {
        this._registry = [];
        this.addUnloadFunc(this.cleanUp);
        EventManager.add(window, "unload", this.unload)
    }
}, add: function (d, c, b, a) {
    this.Initialise();
    if (typeof d == "string") {
        d = document.getElementById(d)
    }
    if (d == null || b == null) {
        return false
    }
    if (d.addEventListener) {
        d.addEventListener(c, b, a);
        this._registry.push({ obj: d, type: c, fn: b, useCapture: a });
        return true
    }
    if (d.attachEvent && d.attachEvent("on" + c, b)) {
        this._registry.push({ obj: d, type: c, fn: b, useCapture: false });
        return true
    }
    return false
}, remove: function (e, d, c) {
    for (var b = this._registry.length - 1; b > -1; b--) {
        var a = this._registry[b];
        if (c && c != a.fn)
            continue;

        if (e == a.obj && d == a.type) {
            this._registry.splice(b, 1);
            if (e.removeEventListener) {
                e.removeEventListener(a.type, a.fn, a.useCapture)
            } else {
                if (e.detachEvent) {
                    e.detachEvent("on" + a.type, a.fn)
                } else {
                    e["on" + a.type] = null
                }
            }
            break
        }
    }
}, removeNode: function (c) {
    for (var b = this._registry.length - 1; b > -1; b--) {
        var a = this._registry[b];
        if (c == a.obj) {
            this._registry.splice(b, 1);
            if (a.obj.removeEventListener) {
                a.obj.removeEventListener(a.type, a.fn, a.useCapture)
            } else {
                if (a.obj.detachEvent) {
                    a.obj.detachEvent("on" + a.type, a.fn)
                } else {
                    a.obj["on" + a.type] = null
                }
            }
        }
    }
}, cleanUp: function () {
    window.status = "清除事件缓冲....";
    for (var i = 0; i < EventManager._registry.length; i++) {
        window.status = "清除事件缓冲...." + i;
        with (EventManager._registry[i]) {
            if (obj.removeEventListener) {
                obj.removeEventListener(type, fn, useCapture)
            } else {
                if (obj.detachEvent) {
                    obj.detachEvent("on" + type, fn)
                } else {
                    obj["on" + type] = null
                }
            }
        }
    }
    EventManager._registry = null
}, unload: function () {
    var a = EventManager._unload.length;
    for (var b = 0; b < a; b++) {
        EventManager._unload[b]()
    }
}, addUnloadFunc: function (a) {
    this._unload.push(a)
}, showEvent: function () {
    for (var b = this._registry.length - 1; b > -1; b--) {
        var a = this._registry[b];
        alert(a.type + ":" + a.fn + ":" + a.useCapture)
    }
} 
};
function EzLog() {
}
function EzManager() {
}
function EzPointStr() {
    this.value = ""
}
EzPointStr.prototype.toString = function () {
    return this.value
};
function Ic(c) {
    this.size = 0;
    if (c) {
        for (var b = c.length - 1; b >= 0; b--) {
            this.add(c[b])
        }
    }
}
Ic.prototype.add = function (a) {
    if (!this.contains(a)) {
        this[":" + a] = 1;
        this.size++
    }
};
Ic.prototype.remove = function (a) {
    if (this.contains(a)) {
        delete this[":" + a];
        this.size--
    }
};
Ic.prototype.contains = function (a) {
    return this[":" + a] == 1
};
function Icon(b, c, j, h, g, d, f, e, a) {
    this.name = b;
    this.width = c || 30;
    this.height = j || 30;
    this.topOffset = 0;
    this.leftOffset = 0;
    this.image = null;
    this.pointCoord = h;
    this.infoTipCoord = g;
    this.shadowTipCoord = d;
    this.shadowURL = f;
    this.shadowWidth = e;
    this.imageMapArray = a || []
}
Icon.prototype.translateImageMapArray = function (d, f) {
    var c = [];
    var b = this.imageMapArray;
    for (var e = 0; e < b.length; e += 2) {
        c.push(b[e] + d);
        c.push(b[e + 1] + f)
    }
    return c
};
function IconInfo(b, a) {
    this.image = b;
    this.iconClass = a
}
function InfoObj(e, d, a, b, c) {
    this.id = e;
    this.point = d;
    this.icon = a;
    this.infoStyle = b;
    this.xml = c
}
function InfoWind(c, a, b, d) {
    this.oncloseclick = c;
    this.createWindow(b);
    this.createShadow(d);
    if (_IEBrowser.type != 1) {
        this.createMask()
    } else {
        this.maskPng = null
    }
    this.createContentArea();
    this.createCloseButton();
    a.appendChild(this.windowDiv);
    a.appendChild(this.shadowDiv);
    this.setSize(208, 69);
    this.hide()
}
InfoWind.prototype.setContentSize = function (b, a) {
    this.setSize(b - (this.window.w.width - 15) * 2, a - (this.window.n.height - 15) * 2)
};
InfoWind.prototype.setSize = function (b, a) {
    if (b < 0) {
        b = 0
    }
    if (a < 0) {
        a = 0
    }
    this.width = b;
    this.height = a;
    this.setWindowSize(b, a);
    this.setShadowSize(b, a);
    if (this.hasMask()) {
        this.setMaskSize()
    }
    this.closeButton.style.left = this.getTotalWidth() - this.closeButton.width - 10 - 1 + "px";
    this.closeButton.style.top = "10px"
};
InfoWind.prototype.getWindowHeight = function () {
    return this.window.c.height + 2 * this.window.n.height
};
InfoWind.prototype.getTotalHeight = function () {
    return this.height + this.window.pointer.height + this.window.n.height
};
InfoWind.prototype.getTotalHeightAboveGround = function () {
    return this.getTotalHeight() + (this.iconClass.pointCoord.y - this.iconClass.infoTipCoord.y)
};
InfoWind.prototype.getTotalShadowHeight = function () {
    return Math.floor(this.height / 4) + this.shadow.pointer.height + this.shadow.nw.height
};
InfoWind.prototype.getTotalWidth = function () {
    return this.width + this.window.w.width + this.window.e.width
};
InfoWind.prototype.getOffsetLeft = function () {
    return this.windowDiv.offsetLeft
};
InfoWind.prototype.getOffsetTop = function () {
    return this.windowDiv.offsetTop
};
InfoWind.prototype.setWindowSize = function (d, a) {
    this.window.n.style.width = d + "px";
    this.window.e.style.height = a + "px";
    this.window.c.style.width = d + "px";
    this.window.c.style.height = a + "px";
    this.window.w.style.height = a + "px";
    var c = this.calculatePointerOffset(d);
    this.window.s1.style.width = c + "px";
    this.window.pointer.style.left = c + this.window.sw.width + "px";
    this.window.s2.style.left = c + this.window.pointer.width + this.window.sw.width + "px";
    this.window.s2.style.width = d - c - this.window.pointer.width + "px";
    var e = d + this.window.w.width + "px";
    this.window.ne.style.left = e;
    this.window.e.style.left = e;
    this.window.se.style.left = e;
    var b = a + this.window.n.height + "px";
    this.window.sw.style.top = b;
    this.window.s1.style.top = b;
    this.window.pointer.style.top = b;
    this.window.s2.style.top = b;
    this.window.se.style.top = b
};
InfoWind.prototype.setShadowSize = function (c, b) {
    c -= 15;
    var f = Math.floor(b / 4);
    var g = c + this.shadow.nw.width;
    var l = this.calculatePointerOffset(c) - 41;
    var h = f + this.shadow.n.height + "px";
    var j = f + this.shadow.nw.height;
    this.shadow.s1Div.style.width = Math.max(l, 0) + "px";
    this.shadow.pointer.style.left = l + this.shadow.sw.width + "px";
    this.shadow.s2Div.style.left = l + this.shadow.pointer.width + this.shadow.sw.width + "px";
    this.shadow.s2Div.style.width = c - l - this.shadow.pointer.width + "px";
    this.shadow.sw.style.top = h;
    this.shadow.s1Div.style.top = h;
    this.shadow.pointer.style.top = h;
    this.shadow.s2Div.style.top = h;
    this.shadow.se.style.top = h;
    this.shadow.se.style.left = g + "px";
    var n = this.shadow.nw.height;
    var a = Math.floor(b / 2);
    this.shadow.wDiv.style.height = f + "px";
    this.shadow.wDiv.style.left = n + "px";
    this.shadow.wDiv.style.width = a + "px";
    this.shadow.w.style.left = f - this.shadow.w.width + 80 + "px";
    var e = this.shadow.nw.height + c + 70;
    this.shadow.eDiv.style.height = f + "px";
    this.shadow.eDiv.style.left = e + "px";
    this.shadow.eDiv.style.width = b + "px";
    this.shadow.e.style.left = f - this.shadow.w.width + 80 + "px";
    var d = n + a;
    this.shadow.cDiv.style.width = e - d + "px";
    this.shadow.cDiv.style.height = f + "px";
    this.shadow.cDiv.style.left = d + "px";
    this.shadow.nw.style.left = j + "px";
    this.shadow.nDiv.style.width = c - 30 + "px";
    this.shadow.nDiv.style.left = j + this.shadow.nw.width + "px";
    this.shadow.ne.style.left = g + j - 30 + "px"
};
InfoWind.prototype.setMaskSize = function () {
    this.maskPng.style.width = this.getTotalWidth() + "px";
    this.maskPng.style.height = this.getTotalHeight() + "px";
    var d = this.getTotalWidth();
    var a = this.getWindowHeight();
    var c = this.getTotalHeight();
    var g = this.window.pointer.offsetLeft;
    var e = g + this.window.pointer.width;
    var b = g + 53;
    var h = g + 4;
    var f = ",";
    var j = this.getMaskMap();
    var k = j.firstChild;
    k.setAttribute("coords", "0,0,0," + a + f + b + f + a + f + h + f + c + f + e + f + a + f + d + f + a + f + d + ",0")
};
InfoWind.prototype.hide = function () {
    if (this.windowDiv) {
        this.windowDiv.style.display = "none"
    }
    this.shadowDiv.style.display = "none"
};
InfoWind.prototype.show = function () {
    this.windowDiv.style.display = "";
    this.shadowDiv.style.display = "";
    this.windowDiv.style.visibility = "visible";
    this.shadowDiv.style.visibility = "visible";
    this.contentArea.style.visibility = "visible"
};
InfoWind.prototype.isVisible = function () {
    return this.windowDiv.style.display != "none"
};
InfoWind.prototype.positionAt = function (f, e, d) {
    var b = this.calculatePointerOffset(this.width) + this.window.w.width + 5;
    var g = this.height + this.window.n.height + this.window.s1.height;
    this.left = f - b;
    this.top = e - g;
    this.left += d.infoTipCoord.x - d.pointCoord.x;
    this.top += d.infoTipCoord.y - d.pointCoord.y;
    this.windowDiv.style.left = this.left + "px";
    this.windowDiv.style.top = this.top + "px";
    var a = 0;
    var c = this.getTotalHeight() - this.getTotalShadowHeight();
    a += d.shadowTipCoord.x - d.infoTipCoord.x;
    c += d.shadowTipCoord.y - d.infoTipCoord.y;
    this.shadowDiv.style.left = this.left + a + "px";
    this.shadowDiv.style.top = this.top + c + "px"
};
InfoWind.prototype.calculatePointerOffset = function (a) {
    return Math.floor(a / 4)
};
InfoWind.prototype.createCroppingDiv = function (b) {
    var a = window.document.createElement("div");
    a.style.overflow = "hidden";
    a.style.position = "absolute";
    a.style.width = b.width + "px";
    a.style.height = b.height + "px";
    a.style.left = b.style.left;
    a.style.top = b.style.top;
    a.style.zIndex = b.style.zIndex;
    b.style.left = "0px";
    b.style.top = "0px";
    a.appendChild(b);
    return a
};
InfoWind.prototype.createWindow = function (a) {
    this.window = new Object();
    this.window.nw = divCreator.create(ti, 25, 25, 0, 0, 0, false);
    this.window.n = divCreator.create(Wh, 640, 25, this.window.nw.width, 0, 0, true);
    this.window.ne = divCreator.create(ji, 25, 25, 0, 0, 0, false);
    this.window.w = divCreator.create(bi, 25, 640, 0, this.window.nw.height, 0, true);
    this.window.c = divCreator.create(Wg, 640, 640, this.window.w.width, this.window.n.height, 0, true);
    this.window.e = divCreator.create(Rg, 25, 640, 0, this.window.ne.height, 0, true);
    this.window.sw = divCreator.create(vi, 25, 96, 0, 0, 0, false);
    this.window.s1 = divCreator.create(nf, 640, 96, this.window.sw.width, 0, 0, true);
    this.window.pointer = divCreator.create(Hh, 98, 96, 0, 0, 0, false);
    this.window.s2 = divCreator.create(nf, 640, 96, 0, 0, 0, true);
    this.window.se = divCreator.create(ng, 25, 96, 0, 0, 0, false);
    this.window.nw.onmousedown = this.onMouseDown;
    this.window.n.onmousedown = this.onMouseDown;
    this.window.ne.onmousedown = this.onMouseDown;
    this.window.w.onmousedown = this.onMouseDown;
    this.window.c.onmousedown = this.onMouseDown;
    this.window.e.onmousedown = this.onMouseDown;
    this.window.sw.onmousedown = this.onMouseDown;
    this.window.s1.onmousedown = this.onMouseDown;
    this.window.pointer.onmousedown = this.onMouseDown;
    this.window.s2.onmousedown = this.onMouseDown;
    this.window.se.onmousedown = this.onMouseDown;
    this.windowDiv = window.document.createElement("div");
    this.windowDiv.style.position = "absolute";
    this.windowDiv.style.left = "0px";
    this.windowDiv.style.top = "0px";
    this.windowDiv.style.zIndex = a;
    setClass(this.windowDiv, "noprint");
    this.windowDiv.appendChild(this.window.nw);
    this.windowDiv.appendChild(this.window.n);
    this.windowDiv.appendChild(this.window.ne);
    this.windowDiv.appendChild(this.window.w);
    this.windowDiv.appendChild(this.window.c);
    this.windowDiv.appendChild(this.window.e);
    this.windowDiv.appendChild(this.window.sw);
    this.windowDiv.appendChild(this.window.s1);
    this.windowDiv.appendChild(this.window.pointer);
    this.windowDiv.appendChild(this.window.s2);
    this.windowDiv.appendChild(this.window.se)
};
InfoWind.prototype.createShadow = function (a) {
    this.shadow = new Object();
    this.shadow.nw = divCreator.create(Fg, 70, 30, 0, 0, 0, false);
    this.shadow.n = divCreator.create(Oi, 640, 30, this.shadow.nw.width, 0, 0, false);
    this.shadow.ne = divCreator.create(ii, 70, 30, 0, 0, 0, false);
    this.shadow.w = divCreator.create(Th, 360, 280, 0, this.shadow.nw.height, 0, false);
    this.shadow.c = divCreator.create(Gg, 640, 640, this.shadow.w.width, this.shadow.n.height, 0, false);
    this.shadow.e = divCreator.create(Og, 360, 280, 0, this.shadow.ne.height, 0, false);
    this.shadow.sw = divCreator.create(Qg, 70, 60, 0, 0, 0, false);
    this.shadow.s1 = divCreator.create(qf, 320, 60, this.shadow.sw.width, 0, 0, false);
    this.shadow.pointer = divCreator.create(Eg, 140, 60, 0, 0, 0, false);
    this.shadow.s2 = divCreator.create(qf, 320, 60, 0, 0, 0, false);
    this.shadow.se = divCreator.create(Lg, 70, 60, 0, 0, 0, false);
    this.shadow.nDiv = this.createCroppingDiv(this.shadow.n);
    this.shadow.wDiv = this.createCroppingDiv(this.shadow.w);
    this.shadow.eDiv = this.createCroppingDiv(this.shadow.e);
    this.shadow.s1Div = this.createCroppingDiv(this.shadow.s1);
    this.shadow.s2Div = this.createCroppingDiv(this.shadow.s2);
    this.shadow.cDiv = this.createCroppingDiv(this.shadow.c);
    this.shadowDiv = window.document.createElement("div");
    this.shadowDiv.style.position = "absolute";
    this.shadowDiv.style.left = "0px";
    this.shadowDiv.style.top = "0px";
    this.shadowDiv.style.zIndex = 0;
    this.shadowDiv.style.zIndex = a;
    setClass(this.shadowDiv, "noprint");
    this.shadowDiv.appendChild(this.shadow.nw);
    this.shadowDiv.appendChild(this.shadow.nDiv);
    this.shadowDiv.appendChild(this.shadow.ne);
    this.shadowDiv.appendChild(this.shadow.wDiv);
    this.shadowDiv.appendChild(this.shadow.cDiv);
    this.shadowDiv.appendChild(this.shadow.eDiv);
    this.shadowDiv.appendChild(this.shadow.sw);
    this.shadowDiv.appendChild(this.shadow.s1Div);
    this.shadowDiv.appendChild(this.shadow.pointer);
    this.shadowDiv.appendChild(this.shadow.s2Div);
    this.shadowDiv.appendChild(this.shadow.se)
};
InfoWind.prototype.hasMask = function () {
    return this.maskPng != null
};
InfoWind.prototype.getMaskMap = function () {
    return document.getElementById(this.maskMapId)
};
var cf = 0;
InfoWind.prototype.createMask = function () {
    var c = document.createElement("map");
    this.maskMapId = "iwMap" + cf;
    c.setAttribute("id", this.maskMapId);
    c.setAttribute("name", this.maskMapId);
    cf++;
    this.windowDiv.appendChild(c);
    var d = document.createElement("area");
    d.setAttribute("shape", "poly");
    d.setAttribute("coords", "");
    d.setAttribute("href", "");
    d.onclick = _NoAction;
    d.onmousedown = this.onmousedown;
    c.appendChild(d);
    for (var b = 0; b < 10; b++) {
        var d = document.createElement("area");
        d.setAttribute("shape", "poly");
        d.setAttribute("coords", "");
        d.setAttribute("href", "PolylineDrawer");
        d.onclick = _NoAction;
        c.appendChild(d)
    }
    this.maskPng = divCreator.create(_TransparentImageUrl, 0, 0, 0, 0, 0, false);
    this.windowDiv.appendChild(this.maskPng);
    this.maskPng.setAttribute("usemap", "#" + this.maskMapId);
    this.nextMaskArea = 1
};
InfoWind.prototype.addAreaToMaskMap = function (a, c) {
    if (this.hasMask()) {
        var b = this.getMaskMap();
        if (this.nextMaskArea < b.childNodes.length) {
            var d = b.childNodes[this.nextMaskArea];
            d.setAttribute("coords", a.join(","));
            d.onmousedown = c;
            this.nextMaskArea++
        }
    }
};
InfoWind.prototype.clearMaskMap = function () {
    if (this.hasMask()) {
        var c = this.getMaskMap();
        for (var b = 1; b < c.childNodes.length; b++) {
            var d = c.childNodes[b];
            d.setAttribute("coords", "");
            d.onmousedown = null
        }
        this.nextMaskArea = 1
    }
};
InfoWind.prototype.getMaskLeft = function () {
    return this.windowDiv.offsetLeft
};
InfoWind.prototype.getMaskTop = function () {
    return this.windowDiv.offsetTop
};
InfoWind.prototype.createContentArea = function () {
    var a = null;
    var b = 15;
    a = window.document.createElement("DIV");
    a.style.position = "absolute";
    a.style.left = convert2Px(b);
    a.style.top = convert2Px(b);
    a.style.zIndex = 0;
    a.id = "contentArea";
    setCursor(a, "auto");
    a.onmousedown = this.onMouseDown;
    this.windowDiv.appendChild(a);
    this.contentArea = a;
    this.contentArea.onmousedown = this.onMouseDown;
    h1 = window.document.createElement("DIV");
    h1.style.position = "absolute";
    h1.style.left = convert2Px(-screen.width);
    h1.style.top = convert2Px(-screen.height);
    h1.style.width = convert2Px(screen.width);
    h1.style.height = convert2Px(screen.height);
    h1.style.visibility = "hidden";
    this.offscreenContainer = h1;
    window.document.body.appendChild(h1);
    h1.id = "offscreenContainer";
    h2 = window.document.createElement("DIV");
    h2.style.position = "absolute";
    h2.style.left = convert2Px(b);
    h2.style.top = convert2Px(b);
    h2.style.zIndex = 0;
    setCursor(h2, "auto");
    this.offscreenArea = h2;
    h2.id = "offscreenArea";
    this.offscreenArea.onmousedown = this.onMouseDown;
    this.offscreenContainer.appendChild(this.offscreenArea)
};
InfoWind.prototype.prepareOffscreen = function (a) {
    if (this.windowDiv.style.display == "none") {
        this.windowDiv.style.display = "";
        this.shadowDiv.style.display = "";
        this.windowDiv.style.visibility = "hidden";
        this.shadowDiv.style.visibility = "hidden";
        this.contentArea.style.visibility = "hidden";
        this.offscreenArea.style.visibility = "hidden"
    }
    if (a) {
        this.offscreenContainer.style.width = convert2Px(a)
    }
};
InfoWind.prototype.clearOffscreenArea = function () {
    RemoveChildren(this.offscreenArea)
};
InfoWind.prototype.flipOffscreenAndSize = function () {
    var b = Math.max(this.offscreenArea.offsetWidth, 200);
    var a = Math.max(this.offscreenArea.offsetHeight, 85);
    this.flipOffscreenArea(b, a);
    this.setContentSize(b + 15, a)
};
InfoWind.prototype.sizeToContent = function () {
    EzLog.write("Offset width: " + this.contentArea.offsetWidth);
    EzLog.write("Offset height: " + this.contentArea.offsetHeight);
    this.setContentSize(Math.max(this.contentArea.offsetWidth, 183), this.contentArea.offsetHeight)
};
InfoWind.prototype.flipOffscreenArea = function (b, a) {
    this.offscreenContainer.removeChild(this.offscreenArea);
    this.windowDiv.removeChild(this.contentArea);
    var c = this.offscreenArea;
    this.offscreenArea = this.contentArea;
    this.contentArea = c;
    this.offscreenContainer.appendChild(this.offscreenArea);
    this.windowDiv.appendChild(this.contentArea);
    if (b && a) {
        this.contentArea.style.width = convert2Px(b);
        this.contentArea.style.height = convert2Px(a)
    }
    this.offscreenArea.style.width = "auto";
    this.offscreenArea.style.height = "auto";
    this.offscreenArea.style.visibility = "visible";
    this.clearOffscreenArea()
};
InfoWind.prototype.onMouseDown = function (a) {
    if (_IEBrowser.type == 1) {
        window.event.cancelBubble = true
    } else {
        a.cancelDrag = true
    }
};
InfoWind.prototype.createCloseButton = function () {
    this.closeButton = Shaderer.create(Di, 14, 13, null, null, 4, null, null);
    this.closeButton.style.position = "absolute";
    setCursor(this.closeButton, "pointer");
    this.closeButton.onmousedown = this.eventHandler("onCloseMouseDown");
    this.windowDiv.appendChild(this.closeButton)
};
InfoWind.prototype.onCloseMouseDown = function (a) {
    S(a);
    if (this.oncloseclick) {
        this.oncloseclick(a)
    }
};
function LegendFunc() {
    this.baseURL = "http://192.168.201.101:8888/service/GovEMap/wms?BBOX=499363.93485404254,303222.1048456149,501725.0529552169,304805.2040882361&WIDTH=400&HEIGHT=300&SRS=EPSG:NONE&layers=26&version=1.0.0&service=WMS&FORMAT=JPEG&TRANSPARENT=TRUE&request=getmap&ServiceName=wmstest";
    this.format = "http://192.168.201.101:8888/service/GovEMap/wms?BBOX=EZBOX&WIDTH=EZWIDTH&HEIGHT=EZHEIGHT&SRS=EPSG:NONE&layers=26&version=1.0.0&service=WMS&FORMAT=GIF&TRANSPARENT=TRUE&request=getmap&ServiceName=wmstest";
    this.marker = null;
    this.bIsFilter = false;
    this.div = null;
    this.bIsPNG = true;
    this.mapApp = null;
    this.opacity = 100;
    this.loadingCallback = null;
    this.completeCallback = null;
    this.refreshTime = 0;
    this.refreshTimeout = null
}
LegendFunc.prototype.getContainer = function () {
    return this.div
};
LegendFunc.prototype.setLoadingFunc = function (b) {
    try {
        if (!EzServerClient.GlobeFunction.isTypeRight(b, "function")) {
            throw EzErrorFactory.createError("LegendFunc::setLoadingFunc方法中arguments[0]类型不正确")
        }
        this.loadingCallback = b
    } catch (a) {
        throw EzErrorFactory.createError("LegendFunc::setLoadingFunc方法执行不正确", a)
    }
};
LegendFunc.prototype.setCompleteFunc = function (b) {
    try {
        if (!EzServerClient.GlobeFunction.isTypeRight(b, "function")) {
            throw EzErrorFactory.createError("LegendFunc::setCompleteFunc方法中arguments[0]类型不正确")
        }
        this.completeCallback = b
    } catch (a) {
        throw EzErrorFactory.createError("LegendFunc::setCompleteFunc方法执行不正确", a)
    }
};
LegendFunc.prototype.setRefreshTime = function (a) {
    try {
        if (!EzServerClient.GlobeFunction.isTypeRight(a, "int")) {
            throw EzErrorFactory.createError("LegendFunc::setRefreshTime方法中arguments[0]类型不正确")
        }
        this.refreshTime = a;
        if (this.refreshTimeout) {
            window.clearTimeout(this.refreshTimeout);
            this.refreshTimeout = null
        }
        if (this.refreshTime > 0) {
            this.refreshTimeout = this.setTimeout("this.refreshURL()", this.refreshTime)
        }
    } catch (b) {
        throw EzErrorFactory.createError("LegendFunc::setRefreshTime方法执行不正确", b)
    }
};
LegendFunc.prototype.open = function (d) {
    try {
        if (d) {
            this.mapApp = d
        } else {
            this.mapApp = getMapApp()
        }
        var a = this;
        var c = this.format.toLowerCase();
        if (c.indexOf("gif") != -1 || this.opacity < 100) {
            this.bIsPNG = false
        }
        if (this.bIsPNG) {
            this.div = document.createElement("div")
        } else {
            this.div = document.createElement("img")
        }
        this.div.style.position = "absolute";
        this.div.style.left = "100px";
        this.div.style.top = "100px";
        this.div.style.zIndex = 10;
        this.src = this.getURL();
        this.redraw();
        this.div.oncontextmenu = function () {
            return false
        };
        this.div.onerror = function () {
            this.style.display = "none"
        };
        this.div.onload = function () {
            if (this.saveLeft) {
                this.style.left = this.saveLeft;
                this.style.top = this.saveTop
            }
            this.style.display = ""
        };
        var a = this;
        this.div.onreadystatechange = function (e) {
            if (this.readyState == "loading") {
                if (a.loadingCallback) {
                    a.loadingCallback()
                }
            } else {
                if (this.readyState == "complete") {
                    if (a.completeCallback) {
                        a.completeCallback()
                    }
                } else {
                    if (this.readyState == "uninitialized") {
                    }
                }
            }
        };
        this.mapApp.map.div.appendChild(this.div);
        this.mapApp.addMapChangeListener(this.eventHandler("redraw"))
    } catch (b) {
        throw EzErrorFactory.createError("LegendFunc::open方法执行不正确", b)
    }
};
LegendFunc.prototype.redraw = function () {
    try {
        this.src = this.getURL();
        var d = this.mapApp.map.viewSize.width;
        var e = this.mapApp.map.viewSize.height;
        this.div.style.width = d + "px";
        this.div.style.height = e + "px";
        var b = this.mapApp.map.getCenterLatLng();
        var c = this.mapApp.map.convert2WPoint(b.x, b.y);
        this.div.saveLeft = (c.x - d / 2) + "px";
        this.div.saveTop = (c.y - e / 2) + "px";
        if (this.bIsPNG) {
            this.div.style.left = this.div.saveLeft;
            this.div.style.top = this.div.saveTop
        }
        if (this.bIsPNG) {
            this.correctPNG()
        } else {
            this.div.src = this.src;
            if (this.opacity < 100) {
                this.div.style.filter = "ALPHA(opacity=" + this.opacity + ")"
            }
        }
    } catch (a) {
        alert(a.message)
    }
};
LegendFunc.prototype.refreshURL = function () {
    this.src = this.getURL();
    if (this.bIsPNG) {
        this.correctPNG()
    } else {
        this.div.src = this.src
    }
    if (this.refreshTime > 0) {
        if (this.refreshTimeout) {
            window.clearTimeout(this.refreshTimeout);
            this.refreshTimeout = null
        }
        this.refreshTimeout = this.setTimeout("this.refreshURL()", this.refreshTime)
    }
};
LegendFunc.prototype.getURL = function () {
    var d = this.format;
    var c = this.mapApp.map.getBoundsLatLng();
    var b = this.mapApp.map.viewSize;
    re = /EZBOX/g;
    d = d.replace(re, c.toString());
    re = /EZWIDTH/g;
    d = d.replace(re, b.width);
    re = /EZHEIGHT/g;
    d = d.replace(re, b.height);
    var a = new Date();
    d += "&time=" + a.getTime();
    return d
};
LegendFunc.prototype.close = function () {
    this.mapApp.map.div.removeChild(this.div);
    var a = this;
    this.mapApp.removeMapChangeListener(this.eventHandler("redraw"))
};
LegendFunc.prototype.correctPNG = function () {
    var a = this.div;
    var b = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + this.src + "', sizingmethod=scale);WIDTH:" + a.width + "px; HEIGHT: " + a.height + "px";
    a.style.filter = b
};
function MapControl() {
    this.div = document.createElement("div");
    this.div.style.left = convert2Px(8);
    this.div.style.top = convert2Px(8);
    this.div.style.position = "absolute"
}
MapControl.prototype.init = function (a) {
    if (a instanceof MainFrame) {
        a.createZoomControls(this.div);
        a.createZoomSlider(this.div)
    }
};
MapControl.prototype.getContainer = function () {
    return this.div
};
function MenuObject(a, b) {
    this.name = a;
    this.func = b
}
;

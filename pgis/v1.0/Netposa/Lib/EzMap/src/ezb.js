function QueryObject() {
    this.queryType = 6;
    this.tableName;
    this.layerName = "";
    this.layerId = "";
    this.subFields = "*";
    this.dispField = "";
    this.coordsType = "multipoint";
    this.coords = "";
    this.radius = 0.01;
    this.unit = "meter";
    this.where = "";
    this.html = "";
    this.featurelimit = 10;
    this.beginrecord = 0;
    this.imgURL = "image/tack.gif";
    this.imgWidth = 39;
    this.imgHeight = 38;
    this.leftOffset = 19;
    this.topOffset = -19;
    this.fields = new Array();
    this.fieldsDisp = new Array();
    this.bIsLabel = true;
    this.filtertblName = "";
    this.filterShape = "";
    this.filterWhere = "";
    this.srcUnit = "meter";
    this.solverecordcount = true;
    if (typeof _MapSpanScale == "undefined" || _MapSpanScale == 1) {
        this.srcUnit = "degree";
        this.unit = "degree"
    }
    this.serviceSource = "";
    this.precision = 6;
    this.baseDistanceTolerance = 0.00001;
    this.orderByClause = "";
    this.queryFields = [];
    this.isFieldsContainDispField = true
}
QueryObject.prototype.next = function() {
    this.beginrecord = this.beginrecord + this.featurelimit
};
QueryObject.prototype.prev = function() {
    this.beginrecord = this.beginrecord - this.featurelimit
};
QueryObject.prototype.addField = function(a, b) {
    this.fields.push(a);
    this.fieldsDisp.push(b)
};
QueryObject.prototype.addSubFields = function(b) {
    try {
        if (!(EzServerClient.GlobeFunction.isTypeRight(b, "string"))) {
            throw EzErrorFactory.createError("QueryObject::addSubFields方法中arguments[0]类型不正确")
        }
        this.subFields = b;
        var c = b.split(";");
        for (var f = 0; f < c.length; f++) {
            var a = c[f].split(":");
            if (a.length > 1) {
                this.fields.push(a[0]);
                this.fieldsDisp.push(a[1])
            } else {
                this.fields.push(a[0]);
                this.fieldsDisp.push(a[0])
            }
        }
        this.queryFields = this.fields.Clone()
    } catch (d) {
        throw EzErrorFactory.createError("QueryObject::addSubFields方法中不正确", d)
    }
};
QueryObject.prototype.getPostURL = function() {
    if (this.serviceSource == null || this.serviceSource == "") {
        return EzServerClient.GlobeFunction.formatStrURL(EzServerClient.GlobeParams.EzMapServiceURL)
    } else {
        return EzServerClient.GlobeFunction.formatStrURL(this.serviceSource)
    }
};
QueryObject.prototype.toxml = function() {
    if (!this.fieldsIsContadipField(this.fields, this.dispField)) {
        this.isFieldsContainDispField = false;
        this.queryFields.push(this.dispField)
    }
    switch (parseInt(this.queryType)) {
        case 1:
            return this.getPointQueryXML();
        case 2:
            return this.getRectangleQueryXML();
        case 3:
            return this.getCircleQueryXML();
        case 4:
            return this.getPolygonQueryXML();
        case 5:
            return this.getAroundQueryXML();
        case 6:
            return this.getFuzyQueryXML();
        case 7:
            return this.getBelongQueryXML();
        default:
            return ""
    }
};
QueryObject.prototype.getPointQueryXML = function() {
    return this.getSpatialQueryXML("multipoint", this.radius)
};
QueryObject.prototype.getRectangleQueryXML = function() {
    return this.getSpatialQueryXML("rectangle", 0)
};
QueryObject.prototype.getCircleQueryXML = function() {
    return this.getSpatialQueryXML("circle", 0)
};
QueryObject.prototype.getPolygonQueryXML = function() {
    return this.getSpatialQueryXML("multipolygon", 0)
};
QueryObject.prototype.getAroundQueryXML = function() {
    return this.getSpatialQueryXML(this.coordsType, this.radius)
};
QueryObject.prototype.getFuzyQueryXML = function() {
    var b = new ezserverclient.easyxmlparse.E_WhereClauseSelect();
    b.setContent(this.where);
    var d = new ezserverclient.easyxmlparse.E_ColumnsClause();
    d.setContent(this.queryFields);
    var g = new ezserverclient.easyxmlparse.E_Select();
    g.setFeatureLimit(this.featurelimit);
    g.setBeginRecord(this.beginrecord);
    g.setSolveRecordcount(this.solverecordcount);
    g.setObjectName(this.tableName);
    g.setAlwaysReturnShape(true);
    g.setDistanceTolerance(this.baseDistanceTolerance);
    g.setPrecision(this.precision);
    g.setColumns(d);
    g.setWhere(b);
    if (this.orderByClause) {
        var a = new ezserverclient.easyxmlparse.E_OrderByClause();
        a.setContent(this.orderByClause);
        g.setOrderBy(a)
    }
    var e = new ezserverclient.easyxmlparse.E_Execute();
    e.setSelectQuery(g);
    var c = new ezserverclient.easyxmlparse.E_Request();
    c.setFreeText(this.dispField);
    c.setExecute(e);
    var f = new ezserverclient.easyxmlparse.E_EasyXml();
    f.setRequest(c);
    return ezserverclient.easyxmlparse.EzFactory.ToXml(f)
};
QueryObject.prototype.getBelongQueryXML = function() {
    var d = new ezserverclient.easyxmlparse.E_WhereClause();
    d.setContent(this.filterWhere);
    var g = new ezserverclient.easyxmlparse.E_SpatialFilterLayer();
    g.setRelation("overlap");
    g.setObjectName(this.filtertblName);
    g.setWhere(d);
    var c = new ezserverclient.easyxmlparse.E_SpatialFilters();
    c.add(g);
    var j = new ezserverclient.easyxmlparse.E_WhereClauseSelect();
    j.setContent(this.where);
    var h = new ezserverclient.easyxmlparse.E_ColumnsClause();
    h.setContent(this.queryFields);
    var e = new ezserverclient.easyxmlparse.E_Select();
    e.setFeatureLimit(this.featurelimit);
    e.setBeginRecord(this.beginrecord);
    e.setSolveRecordcount(this.solverecordcount);
    e.setObjectName(this.tableName);
    e.setAlwaysReturnShape(true);
    e.setDistanceTolerance(this.baseDistanceTolerance);
    e.setPrecision(this.precision);
    e.setColumns(h);
    e.setWhere(j);
    e.setSpatialFilters(c);
    if (this.orderByClause) {
        var i = new ezserverclient.easyxmlparse.E_OrderByClause();
        i.setContent(this.orderByClause);
        e.setOrderBy(i)
    }
    var f = new ezserverclient.easyxmlparse.E_Execute();
    f.setSelectQuery(e);
    var b = new ezserverclient.easyxmlparse.E_Request();
    b.setFreeText(this.dispField);
    b.setExecute(f);
    var a = new ezserverclient.easyxmlparse.E_EasyXml();
    a.setRequest(b);
    return ezserverclient.easyxmlparse.EzFactory.ToXml(a)
};
QueryObject.prototype.getSpatialQueryXML = function(k, e) {
    var d = new ezserverclient.easyxmlparse.E_Shape();
    d.setGeoType(k);
    d.setContent(this.coords);
    var h = new ezserverclient.easyxmlparse.E_SpatialFilter();
    h.setRelation("overlap");
    h.setBufferSize(e);
    h.setBufferUnit(this.unit);
    h.setShape(d);
    var c = new ezserverclient.easyxmlparse.E_SpatialFilters();
    c.add(h);
    var l = new ezserverclient.easyxmlparse.E_WhereClauseSelect();
    l.setContent(this.where);
    var j = new ezserverclient.easyxmlparse.E_ColumnsClause();
    j.setContent(this.queryFields);
    var g = new ezserverclient.easyxmlparse.E_Select();
    g.setFeatureLimit(this.featurelimit);
    g.setBeginRecord(this.beginrecord);
    g.setSolveRecordcount(this.solverecordcount);
    g.setObjectName(this.tableName);
    g.setAlwaysReturnShape(true);
    g.setDistanceTolerance(this.baseDistanceTolerance);
    g.setPrecision(this.precision);
    g.setColumns(j);
    g.setWhere(l);
    g.setSpatialFilters(c);
    if (this.orderByClause) {
        var i = new ezserverclient.easyxmlparse.E_OrderByClause();
        i.setContent(this.orderByClause);
        g.setOrderBy(i)
    }
    var f = new ezserverclient.easyxmlparse.E_Execute();
    f.setSelectQuery(g);
    var b = new ezserverclient.easyxmlparse.E_Request();
    b.setFreeText(this.dispField);
    b.setExecute(f);
    var a = new ezserverclient.easyxmlparse.E_EasyXml();
    a.setRequest(b);
    return ezserverclient.easyxmlparse.EzFactory.ToXml(a)
};
QueryObject.prototype.fieldsIsContadipField = function(a, b) {
    if (b == null || b == "") {
        return true
    }
    for (var c = 0; c < a.length; c++) {
        if (b.toUpperCase() == a[c].toUpperCase()) {
            return true
        }
    }
    return false
};
var _LayerArr = [];
if (typeof mapSpatial != "function") {
    function mapSpatial() {
    }
}
var g_prox_calss = null;
var g_engine = null;
var bIsWriteFile = true;
DWREngine = {};
DWREngine.Clone = function() {
    return new MapService_v6_Stub_DWREngine()
};
function MapService_v6_Stub_DWREngine() {
    this.beginBatch = function() {
    };
    this.endBatch = function() {
    }
}
_bIsQuerying = false;
_bIsLoading = false;
MapsApp.prototype.bIsQuery = function() {
    return _bIsQuerying
};
function loading() {
    var a = document.getElementById("process");
    if (a != null) {
        a.style.display = ""
    }
    _bIsQuerying = true;
    _bIsLoading = true
}
function loaded() {
    var a = document.getElementById("process");
    if (a != null) {
        a.style.display = "none"
    }
    _bIsQuerying = false;
    _bIsLoading = false
}
MapsApp.prototype.getResultTable_ = function(h) {
    var a = document.createElement("table");
    a.border = 0;
    a.id = "EzLayerTable";
    a.align = "center";
    a.cellspacing = 0;
    a.cellpadding = 0;
    if (typeof h == "undefined" || h == null) {
        h = _LayerArr
    }
    var i = h.length;
    var g = 0;
    var d = a.insertRow(g);
    var e = d.appendChild(document.createElement("th"));
    e.innerHTML = "图层名";
    var e = d.appendChild(document.createElement("th"));
    e.innerHTML = "总数";
    g = 1;
    for (var f = 0; f < h.length; f++) {
        var c = h[f];
        var d = a.insertRow(g);
        var b = d.insertCell(0);
        b.innerHTML = c.layerName;
        b = d.insertCell(1);
        b.innerHTML = c.maxRecord;
        g++
    }
    return a
};
MapsApp.prototype.getResultTable = function(i) {
    var a = document.createElement("table");
    a.border = 0;
    a.id = "EzLayerTable";
    a.align = "center";
    a.cellspacing = 0;
    a.cellpadding = 0;
    if (typeof i == "undefined" || i == null) {
        i = _LayerArr
    }
    var j = i.length;
    var g = 0;
    var d = a.insertRow(g);
    var e = d.appendChild(document.createElement("th"));
    e.innerHTML = "图层";
    for (var f = 0; f < i.length; f++) {
        var c = i[f];
        var e = d.appendChild(document.createElement("th"));
        e.innerHTML = c.layerName
    }
    g = 1;
    var d = a.insertRow(g);
    var b = d.appendChild(document.createElement("td"));
    b.innerHTML = "总数";
    for (var h = 0; h < i.length; h++) {
        var c = i[h];
        pTd1 = d.appendChild(document.createElement("td"));
        pTd1.innerHTML = c.maxRecord
    }
    return a
};
MapsApp.prototype.setEzLayer = function(a) {
    _LayerArr = a
};
function addOverLay(b, a) {
    getMapApp().addOverlay(b);
    b.addListener("click", function() {
        b.openInfoWindowHtml(a)
    })
}
MapsApp.prototype.query = function(j, m) {
    try {
        if (!EzServerClient.GlobeFunction.isTypeRight(j, "QueryObject") && !EzServerClient.GlobeFunction.isTypeRight(j, "Array")) {
            throw EzErrorFactory.createError("EzMap::query方法中arguments[0]类型不正确")
        }
        if (!EzServerClient.GlobeFunction.isTypeRight(m, "function")) {
            throw EzErrorFactory.createError("EzMap::query方法中arguments[1]类型不正确")
        }
        j.beginrecord = j.beginrecord - 1;
        var g = new ezserverclient.easyxmlparse.EzMapserviceQuery();
        if (EzServerClient.GlobeFunction.isTypeRight(j, "QueryObject")) {
            var k = EzServerClient.GlobeFunction.getRequestObject(j);
            var n = k.url;
            var c = k.xml;
            var l = new ezserverclient.easyxmlparse.QueryItem(n, c);
            g.addQueryItem(l)
        } else {
            for (var f = 0; f < j.length; f++) {
                var k = EzServerClient.GlobeFunction.getRequestObject(j[f]);
                var n = k.url;
                var c = k.xml;
                var l = new ezserverclient.easyxmlparse.QueryItem(n, c);
                g.addQueryItem(l)
            }
        }
        g.setTryTime(this.ezMapServiceTryTimes);
        g.setFailureOnError(false);
        g.doQuery();
        var a = true;
        var d = this;
        var b = d.getQueryResults2();
        g.onFinished = function() {
            for (var C = 0; C < g.getQueryItemCount(); C++) {
                var u = g.getQueryItem(C).getResponseXml();
                var H = null;
                if (EzServerClient.GlobeFunction.isTypeRight(j, "QueryObject")) {
                    H = j
                } else {
                    if (EzServerClient.GlobeFunction.isTypeRight(j, "Array")) {
                        H = j[C]
                    }
                }
                if (!g.getQueryItem(C).getResultState()) {
                    a = false
                }
                var x = new EzLayer();
                x.layerId = H.layerId;
                x.tableName = H.tableName;
                x.layerName = H.layerName;
                x.queryObj = H;
                x.imgURL = H.imgURL;
                x.imgHeight = H.imgHeight;
                x.imgWidth = H.imgWidth;
                x.leftOffset = H.leftOffset;
                x.topOffset = H.topOffset;
                x.fieldsDisp = H.fieldsDisp;
                x.fields = H.fields;
                if (!EzServerClient.GlobeFunction.isContainLayer(b, x)) {
                    b.push(x)
                }
                if (u) {
                    var s = ezserverclient.easyxmlparse.EzFactory.FromXml(u);
                    var E = s.getResponse();
                    var r = E.getError();
                    if (r) {
                        x.error = new Error(r.getMessage())
                    } else {
                        var I = E.getResultSet();
                        var q = E.getFreeText();
                        if (q) {
                            x.freeText = q
                        }
                        uLayerExtension = I.getLayerExtension();
                        if (uLayerExtension) {
                            var o = uLayerExtension.getFullExtent().split(",");
                            x.MBR = new MBR(o[0], o[1], o[2], o[3]);
                            x.geometryType = uLayerExtension.getGeoType();
                            x.spatialColumn = uLayerExtension.getSpatialColumn()
                        }
                        var v = I.getSpatialFilterObjects();
                        if (v) {
                            for (var B = 0; B < v.size(); B++) {
                                var z = v.get(B);
                                var F = new EzShape();
                                F.geometryType = z.getGeoType();
                                F.coordinateSequence = z.getContent();
                                x.spatialFilterShapes.push(F)
                            }
                        }
                        var A = I.getRecords();
                        x.maxRecord2 = A.getRecordCount() || 0;
                        var J = A.size();
                        x.recordCount = J;
                        x.maxRecord = x.maxRecord2;
                        for (var B = 0; B < x.recordCount; B++) {
                            var t = A.get(B);
                            var p = new FeatureObject(x);
                            p.objectid = t.getObjectID();
                            var G = t.getFeatureExtension();
                            if (G) {
                                p.setCenterPoint(new Point(G.getCenterX(), G.getCenterY()))
                            }
                            var e = t.getFields();
                            for (var w = 0; w < e.size(); w++) {
                                var y = e.get(w);
                                var D = new EzField(y.getDisplayName(), y.getName(), y.getType(), y.getValue());
                                if (D.name == H.dispField.toUpperCase()) {
                                    p.dispFieldValue = D.value;
                                    p.dispname = p.dispFieldValue;
                                    if (!H.isFieldsContainDispField) {
                                        continue
                                    }
                                }
                                if (D.type == "Geometry") {
                                    p.type = x.geometryType;
                                    p.linestr = D.value;
                                    continue
                                }
                                p.fieldValues.push(D.value);
                                p.ezFields.push(D)
                            }
                            x.features.push(p)
                        }
                    }
                } else {
                    x.error = new Error("EzMapService连接错误")
                }
            }
            m(a, d)
        }
    } catch (h) {
        throw EzErrorFactory.createError("EzMap::query方法执行不正确", h)
    }
};
MapsApp.prototype.getQueryResult = function() {
    var a = this.getQueryResults2().Clone();
    _LayerArr = a;
    return a
};
MapsApp.prototype.clearLayers = function() {
    this.queryResults2 = [];
    _LayerArr = []
};
MapsApp.prototype.setEzMapServiceTryTimes = function(b) {
    try {
        if (!EzServerClient.GlobeFunction.isTypeRight(b, "int")) {
            throw EzErrorFactory.createError("EzMap::setEzMapServiceTryTimes方法中arguments[0]类型不正确")
        } else {
            if (b <= 0) {
                throw EzErrorFactory.createError("EzMap::setEzMapServiceTryTimes方法中arguments[0]应当为一个大于0的整数")
            }
            this.ezMapServiceTryTimes = b
        }
    } catch (a) {
        throw EzErrorFactory.createError("EzMap::setEzMapServiceTryTimes方法执行不正确", a)
    }
};
MapsApp.prototype.getEzMapServiceTryTimes = function() {
    return this.ezMapServiceTryTimes
};
MapsApp.prototype.registerProx = function(a) {
    MapsApp.registerProx(a)
};
MapsApp.proxyURL2EzMapService = "";
MapsApp.registerProx = function(a) {
    g_prox_calss = a;
    MapsApp.proxyURL2EzMapService = a
};
EzServerClient.GlobeFunction.isContainLayer = function(b, a) {
    for (var c = 0; c < b.length; c++) {
        if (a.tableName.toString().toLowerCase() == b[c].tableName.toString().toLowerCase() && a.layerId.toString().toLowerCase() == b[c].layerId.toString().toLowerCase()) {
            b.splice(c, 1, a);
            return true
        }
    }
    return false
};
EzServerClient.GlobeFunction.getRequestObject = function(b) {
    var d = b.getPostURL();
    var c = b.toxml();
    if (MapsApp.proxyURL2EzMapService) {
        var a = d;
        d = MapsApp.proxyURL2EzMapService;
        var e = new Date();
        c = "url=" + encodeURIComponent(a + "/XMLPort") + "&xml=" + encodeURIComponent(c) + "&time=" + e.getTime()
    } else {
        d += "/DirectPort"
    }
    return {url: d,xml: c}
};
EzServerClient.GlobeFunction.formatStrURL = function(a) {
    a = a.replace(/(^\s*)|(\s*$)/g, "");
    if (a.lastIndexOf("/") == a.length - 1) {
        return a.substring(0, a.length - 1)
    } else {
        return a
    }
};
EzLayer = function() {
    this.layerId = "";
    this.fields = [];
    this.fieldsDisp = [];
    this.tableName = "";
    this.layerName = "";
    this.MBR = null;
    this.queryObj = null;
    this.editObj = null;
    this.features = [];
    this.imgURL = "";
    this.maxRecord = 0;
    this.maxRecord2 = 0;
    this.bShow = true;
    this.geometryType = "";
    this.error = null;
    this.recordCount = 0;
    this.freetext = "";
    this.spatialFilterShapes = [];
    this.spatialColumn = "shape";
    this.imgURL = "";
    this.imgHeight = 32;
    this.imgWidth = 32;
    this.leftOffset = 0;
    this.topOffset = 0
};
EzLayer.sortByName = function(d, c) {
    d = d.dispname;
    c = c.dispname;
    var f = parseFloat(d);
    var e = parseFloat(c);
    var g = 1;
    if (isNaN(f) || isNaN(e)) {
        g = d.localeCompare(c)
    } else {
        g = f - e
    }
    return g
};
EzLayer.sortByNumber = function(e, d) {
    var f = d.dispname - e.dispname;
    return f
};
EzLayer.prototype.sort = function() {
    this.features.sort(EzLayer.sortByName)
};
EzLayer.prototype.toTable = function(c) {
    var a = document.createElement("table");
    a.border = 0;
    a.id = "EzLayerTable";
    a.align = "center";
    a.cellspacing = 0;
    a.cellpadding = 0;
    var j = 0;
    var e = this.features;
    var d = a.insertRow(j);
    var n = this.fieldsDisp;
    for (var l = 0; l < n.length; l++) {
        var h = n[l];
        var g = d.appendChild(document.createElement("th"));
        g.innerHTML = h
    }
    j = 1;
    for (var i = 0; i < e.length; i++) {
        var f = e[i];
        var d = a.insertRow(j);
        for (var m = 0; m < f.fieldValues.length; m++) {
            var k = f.fieldValues[m];
            var b = d.insertCell(m);
            if (k == null || k == "") {
                k = "&nbsp;"
            }
            b.innerHTML = k
        }
        j++
    }
    return a
};
EzLayer.prototype.setLayerInfo = function(a) {
    if (a instanceof QueryObject) {
        this.queryObj = a;
        this.tableName = a.tableName.toUpperCase();
        this.layerName = a.layerName;
        this.layerId = a.layerId + "";
        this.fields = a.fields;
        this.fieldsDisp = a.fieldsDisp;
        this.imgURL = a.imgURL;
        this.bIsLabel = a.bIsLabel;
        this.imgHeight = a.imgHeight;
        this.imgWidth = a.imgWidth;
        this.leftOffset = a.leftOffset;
        this.topOffset = a.topOffset;
        this.tableInfo = a.tableInfo;
        this.beginrecord = a.beginrecord
    } else {
        if (a instanceof EditObject) {
            this.editObj = a;
            this.tableName = a.tableName.toUpperCase()
        }
    }
};
EzLayer.prototype.getFieldInd = function(c) {
    var b = -1;
    for (var a = 0; a < this.fields.length; a++) {
        if (this.fields[a].toUpperCase() == c.toUpperCase()) {
            b = a;
            break
        }
    }
    return b
};
EzLayer.prototype.getFieldsSize = function() {
    if (this.fields == null) {
        return 0
    } else {
        return this.fields.length
    }
};
EzLayer.prototype.getFieldsCount = EzLayer.prototype.getFieldsSize;
EzLayer.prototype.setSpatialFilterShapes = function(a) {
    try {
        if (!EzServerClient.GlobeFunction.isTypeRight(a, "Array")) {
            throw EzErrorFactory.createError("EzLayer::setSpatialFilterShapes方法中arguments[0]参数类型不正确")
        }
        this.spatialFilterShapes = a
    } catch (b) {
        throw EzErrorFactory.createError("EzLayer::setSpatialFilterShapes方法执行不正确", b)
    }
};
EzLayer.prototype.getSpatialFilterShapes = function() {
    return this.spatialFilterShapes
};
EzLayer.prototype.getSpatialColumn = function() {
    return this.spatialColumn
};
EzLayer.prototype.setSpatialColumn = function(b) {
    try {
        if (!EzServerClient.GlobeFunction.isTypeRight(b, "string")) {
            throw EzErrorFactory.createError("EzLayer::setSpatialColumn方法中arguments[0]参数类型不正确")
        }
        this.spatialColumn = b
    } catch (a) {
        throw EzErrorFactory.createError("EzLayer::setSpatialColumn方法执行不正确", a)
    }
};
EzLayer.prototype.getGeometryType = function() {
    return this.geometryType
};
EzLayer.prototype.setGeometryType = function(a) {
    try {
        if (!(EzServerClient.GlobeFunction.isTypeRight(a, "string"))) {
            throw EzErrorFactory.createError("EzLayer::setGeometryType方法中arguments[0]类型不正确")
        } else {
            this.geometryType = a
        }
    } catch (b) {
        throw EzErrorFactory.createError("EzLayer::setGeometryType方法中不正确", b)
    }
};
EzLayer.prototype.getFeatures = function() {
    return this.features
};
EzLayer.prototype.setFeatures = function(a) {
    try {
        if (!(EzServerClient.GlobeFunction.isTypeRight(a, "Array"))) {
            throw EzErrorFactory.createError("EzLayer::setFeatures方法中arguments[0]类型不正确")
        } else {
            this.features = a
        }
    } catch (b) {
        throw EzErrorFactory.createError("EzLayer::setFeatures方法中不正确", b)
    }
};
_VideoName = null;
function playVideo() {
    window.open("media.htm", "视频播放", "height=300, width=460, top=0, left=0, toolbar=no, menubar=no, scrollbars=no,resizable=no,location=no, status=no")
}
function getCenterOfPaths(c) {
    var b = trans2Points(c);
    var a = Math.floor(b.length / 2);
    return b[a]
}
function FeatureObject(a) {
    this.dispname = "";
    this.type;
    this.point;
    this.linestr;
    this.html;
    this.fieldValues = new Array();
    if (a == null) {
        throw new Error("请在构造函数中传入图层对象!")
    }
    this.layInfo = a;
    this.ezFields = [];
    this.centerPoint = null;
    this.objectId = "";
    this.dispFieldValue = ""
}
FeatureObject.prototype.addFieldValue = function(b, a) {
    this.fieldValues.push(a)
};
FeatureObject.prototype.getMBR = function() {
    var a = EzServerClient.GlobeFunction.getPathMBR(this.linestr);
    return a
};
FeatureObject.prototype.getCenterPoint = function() {
    this.centerPoint = this.getMBR().getCenterPoint();
    this.point = this.centerPoint;
    return this.point
};
FeatureObject.prototype.setCenterPoint = function(a) {
    try {
        if (!(EzServerClient.GlobeFunction.isTypeRight(a, Point))) {
            throw EzErrorFactory.createError("FeatureObject::setCenterPoint方法中arguments[0]类型不正确")
        } else {
            this.centerPoint = a;
            this.point = this.centerPoint
        }
    } catch (b) {
        throw EzErrorFactory.createError("FeatureObject::setCenterPoint方法中不正确", b)
    }
};
FeatureObject.prototype.getLength = function() {
    var b = 0;
    try {
        var a = trans2Points(this.linestr);
        b = CalculateLength(a);
        b = Math.floor(b)
    } catch (c) {
    }
    return b
};
FeatureObject.prototype.toHTML = function(f) {
    var c = document.createElement("table");
    c.border = 0;
    c.id = "InfoTable";
    c.align = "center";
    c.cellspacing = 0;
    c.cellpadding = 0;
    var l = this.fieldValues.length;
    var i = 0;
    for (var h = 0; h < l; h++) {
        var g = "";
        var j = "";
        j = this.fieldValues[h];
        g = this.layInfo.fieldsDisp[h];
        if (j == null || j == "" || j == "undefined" || g == "no") {
            continue
        }
        var e = c.insertRow(i);
        e.height = 10;
        var d = e.insertCell(0);
        if (j.toLowerCase().indexOf("http") != -1) {
            d.colspan = 2;
            var k = document.createElement("a");
            var b = j;
            if (j.toLowerCase().indexOf(".avi") != -1 || j.toLowerCase().indexOf(".mpg") != -1) {
                b = "javascript:void(0);";
                k.onclick = "_VideoName='" + j + "';playVideo();"
            } else {
                k.target = "_blank"
            }
            k.href = b;
            k.innerHTML = g;
            d.innerHTML = k.outerHTML;
            d.align = "center"
        } else {
            d.innerHTML = g;
            d.className = "leftBorder";
            var a = e.insertCell(1);
            a.className = "rightBorder";
            if (j != null) {
                j = j.replace(/ /g, "");
                if (j == "") {
                    j = "&nbsp;"
                }
            } else {
                j = "&nbsp;"
            }
            a.innerHTML = j
        }
        i++
    }
    if (f) {
        var e = c.insertRow(i);
        var d = e.insertCell(0);
        d.colspan = 2;
        d.align = "center";
        if (typeof f == "string") {
            d.innerHTML = f
        } else {
            d.appendChild(f)
        }
    }
    return c.outerHTML
};
FeatureObject.prototype.getField = function(a) {
    try {
        if (!(EzServerClient.GlobeFunction.isTypeRight(a, "int"))) {
            throw EzErrorFactory.createError("FeatureObject::getField方法中arguments[0]类型不正确")
        }
        return this.layInfo.fields[a]
    } catch (b) {
        throw EzErrorFactory.createError("FeatureObject::getField方法中不正确", b)
    }
};
FeatureObject.prototype.getFieldValue = function(b) {
    try {
        if (!(EzServerClient.GlobeFunction.isTypeRight(b, "string")) && !(EzServerClient.GlobeFunction.isTypeRight(b, "int"))) {
            throw EzErrorFactory.createError("FeatureObject::getFieldValue方法中arguments[0]类型不正确")
        }
        var f = null;
        var c = null;
        if (typeof b == "string") {
            for (var a = 0; a < this.ezFields.length; a++) {
                if (this.ezFields[a].getName() == b) {
                    c = a;
                    break
                }
            }
        } else {
            if (typeof b == "number") {
                c = b
            }
        }
        f = this.fieldValues[c];
        return f
    } catch (d) {
        throw EzErrorFactory.createError("FeatureObject::getFieldValue方法中不正确", d)
    }
};
FeatureObject.prototype.setFieldValue = function(a, c) {
    try {
        if (!(EzServerClient.GlobeFunction.isTypeRight(a, "string")) && !(EzServerClient.GlobeFunction.isTypeRight(a, "int"))) {
            throw EzErrorFactory.createError("FeatureObject::setFieldValue方法中arguments[0]类型不正确")
        }
        var b = null;
        if (typeof a == "string") {
            b = this.layInfo.getFieldInd(a)
        } else {
            if (typeof a == "number") {
                b = a
            }
        }
        this.fieldValues[b] = c
    } catch (d) {
        throw EzErrorFactory.createError("FeatureObject::setFieldValue方法中不正确", d)
    }
};
FeatureObject.prototype.getDispField = function(a) {
    try {
        if (!(EzServerClient.GlobeFunction.isTypeRight(a, "int"))) {
            throw EzErrorFactory.createError("FeatureObject::getDispField方法中arguments[0]类型不正确")
        }
        return this.layInfo.fieldsDisp[a]
    } catch (b) {
        throw EzErrorFactory.createError("FeatureObject::getDispField方法中不正确", b)
    }
};
FeatureObject.prototype.getEzFields = function() {
    return this.ezFields
};
FeatureObject.prototype.setEzFields = function(a) {
    try {
        if (!(EzServerClient.GlobeFunction.isTypeRight(a, Array))) {
            throw EzErrorFactory.createError("FeatureObject::setEzFields方法中arguments[0]类型不正确")
        } else {
            this.ezFields = a
        }
    } catch (b) {
        throw EzErrorFactory.createError("FeatureObject::setEzFields方法中不正确", b)
    }
};
FeatureObject.prototype.getCoordinateSequence = function() {
    return this.linestr
};
FeatureObject.prototype.setCoordinateSequence = function(b) {
    try {
        if (!(EzServerClient.GlobeFunction.isTypeRight(b, "string"))) {
            throw EzErrorFactory.createError("FeatureObject::setCoordinateSequence方法中arguments[0]类型不正确")
        } else {
            this.linestr = b
        }
    } catch (a) {
        throw EzErrorFactory.createError("FeatureObject::setCoordinateSequence方法中不正确", a)
    }
};
FeatureObject.prototype.getQueryDispFieldValue = function() {
    return this.dispFieldValue
};
FeatureObject.prototype.setQueryDispFieldValue = function(b) {
    try {
        if (!(EzServerClient.GlobeFunction.isTypeRight(b, "string"))) {
            throw EzErrorFactory.createError("FeatureObject::setQueryDispFieldValue方法中arguments[0]类型不正确")
        } else {
            this.dispFieldValue = b
        }
    } catch (a) {
        throw EzErrorFactory.createError("FeatureObject::setQueryDispFieldValue方法中不正确", a)
    }
};
EditObject = function(d, a, b) {
    try {
        if (!EzServerClient.GlobeFunction.isTypeRight(d, "string")) {
            throw EzErrorFactory.createError("EditObject构造方法中arguments[0]参数类型不正确")
        }
        if (!EzServerClient.GlobeFunction.isTypeRight(a, "string")) {
            throw EzErrorFactory.createError("EditObject构造方法中arguments[1]参数类型不正确")
        }
        if (!EzServerClient.GlobeFunction.isTypeRight(b, "string")) {
            throw EzErrorFactory.createError("EditObject构造方法中arguments[2]参数类型不正确")
        }
        this.otype = d;
        this.gtype = a;
        this.tableName = b;
        this.where = "";
        this.serviceSource = null;
        this.fields = [];
        this.fieldsValue = []
    } catch (c) {
        throw EzErrorFactory.createError("EzMap::edit方法执行不正确", c)
    }
};
EditObject.prototype.addField = function(c, b) {
    try {
        if (!(EzServerClient.GlobeFunction.isTypeRight(c, "string"))) {
            throw EzErrorFactory.createError("EditObject::addField方法中arguments[0]类型不正确")
        }
        if (!(EzServerClient.GlobeFunction.isTypeRight(b, "string"))) {
            throw EzErrorFactory.createError("EditObject::addField方法中arguments[1]类型不正确")
        }
        this.fields.push(c.toUpperCase());
        this.fieldsValue.push(b)
    } catch (a) {
        throw EzErrorFactory.createError("EditObject::addField方法中不正确", a)
    }
};
EditObject.prototype.toAddXML = function() {
    var g = new ezserverclient.easyxmlparse.E_Fields();
    for (var b = 0; b < this.fields.length; b++) {
        var f = new ezserverclient.easyxmlparse.E_Field();
        f.setName(this.fields[b]);
        f.setValue(this.fieldsValue[b]);
        g.add(f)
    }
    var d = new ezserverclient.easyxmlparse.E_Insert();
    d.setObjectName(this.tableName);
    d.setFields(g);
    var c = new ezserverclient.easyxmlparse.E_Execute();
    c.setSelectQuery(d);
    var a = new ezserverclient.easyxmlparse.E_Request();
    a.setFreeText(this.dispField);
    a.setExecute(c);
    var e = new ezserverclient.easyxmlparse.E_EasyXml();
    e.setRequest(a);
    return ezserverclient.easyxmlparse.EzFactory.ToXml(e)
};
EditObject.prototype.toDelXML = function() {
    var a = new ezserverclient.easyxmlparse.E_WhereClause();
    a.setContent(this.where);
    var e = new ezserverclient.easyxmlparse.E_Delete();
    e.setObjectName(this.tableName);
    e.setWhereClause(a);
    var c = new ezserverclient.easyxmlparse.E_Execute();
    c.setSelectQuery(e);
    var b = new ezserverclient.easyxmlparse.E_Request();
    b.setFreeText(this.dispField);
    b.setExecute(c);
    var d = new ezserverclient.easyxmlparse.E_EasyXml();
    d.setRequest(b);
    return ezserverclient.easyxmlparse.EzFactory.ToXml(d)
};
EditObject.prototype.toUpdateXML = function() {
    var a = new ezserverclient.easyxmlparse.E_WhereClause();
    a.setContent(this.where);
    var h = new ezserverclient.easyxmlparse.E_Fields();
    for (var c = 0; c < this.fields.length; c++) {
        var g = new ezserverclient.easyxmlparse.E_Field();
        g.setName(this.fields[c]);
        g.setValue(this.fieldsValue[c]);
        h.add(g)
    }
    var f = new ezserverclient.easyxmlparse.E_Update();
    f.setObjectName(this.tableName);
    f.setFields(h);
    f.setWhereClause(a);
    var d = new ezserverclient.easyxmlparse.E_Execute();
    d.setSelectQuery(f);
    var b = new ezserverclient.easyxmlparse.E_Request();
    b.setFreeText(this.dispField);
    b.setExecute(d);
    var e = new ezserverclient.easyxmlparse.E_EasyXml();
    e.setRequest(b);
    return ezserverclient.easyxmlparse.EzFactory.ToXml(e)
};
EditObject.prototype.toxml = function() {
    var a = this.otype.toLowerCase();
    switch (a) {
        case "add":
            return this.toAddXML();
        case "del":
            return this.toDelXML();
        case "update":
            return this.toUpdateXML();
        default:
            return ""
    }
};
EditObject.prototype.getPostURL = function() {
    if (this.serviceSource == null || this.serviceSource == "") {
        return EzServerClient.GlobeFunction.formatStrURL(EzServerClient.GlobeParams.EzMapServiceURL)
    } else {
        return EzServerClient.GlobeFunction.formatStrURL(this.serviceSource)
    }
};
MapsApp.prototype.edit = function(n, l) {
    try {
        if (!EzServerClient.GlobeFunction.isTypeRight(n, "EditObject") && !EzServerClient.GlobeFunction.isTypeRight(n, "Array")) {
            throw EzErrorFactory.createError("EzMap::pEdit方法中arguments[0]参数类型不正确")
        }
        if (!EzServerClient.GlobeFunction.isTypeRight(l, "function")) {
            throw EzErrorFactory.createError("EzMap::pEdit方法中arguments[1]参数类型不正确")
        }
        var g = new ezserverclient.easyxmlparse.EzMapserviceQuery();
        if (EzServerClient.GlobeFunction.isTypeRight(n, "EditObject")) {
            var j = EzServerClient.GlobeFunction.getRequestObject(n);
            var m = j.url;
            var c = j.xml;
            var k = new ezserverclient.easyxmlparse.QueryItem(m, c);
            g.addQueryItem(k)
        } else {
            for (var f = 0; f < n.length; f++) {
                var j = EzServerClient.GlobeFunction.getRequestObject(n[f]);
                var m = j.url;
                var c = j.xml;
                var k = new ezserverclient.easyxmlparse.QueryItem(m, c);
                g.addQueryItem(k)
            }
        }
        g.setTryTime(this.ezMapServiceTryTimes);
        g.setFailureOnError(false);
        g.doQuery();
        var a = true;
        var d = this;
        var b = d.getQueryResults2();
        g.onFinished = function() {
            for (var o = 0; o < g.getQueryItemCount(); o++) {
                var e = g.getQueryItem(o).getResponseXml();
                var p = null;
                if (EzServerClient.GlobeFunction.isTypeRight(n, "EditObject")) {
                    p = n
                } else {
                    if (EzServerClient.GlobeFunction.isTypeRight(n, "Array")) {
                        p = n[o]
                    }
                }
                if (!g.getQueryItem(o).getResultState()) {
                    a = false
                }
            }
            l(a)
        }
    } catch (h) {
        throw EzErrorFactory.createError("EzMap::edit方法执行不正确", h)
    }
};
function EzField(a, b, c, d) {
    this.displayName = a;
    this.name = b;
    this.type = c;
    this.value = d;
    this.getDisplayName = function() {
        return this.displayName
    };
    this.setDisplayName = function(e) {
        this.displayName = e
    };
    this.getName = function() {
        return this.name
    };
    this.setName = function(e) {
        this.name = e
    };
    this.getType = function() {
        return this.type
    };
    this.setType = function(e) {
        this.type = e
    };
    this.getValue = function() {
        return this.value
    };
    this.setValue = function(e) {
        this.value = e
    }
}
function drawFeatureObject(a, k) {
    try {
        var n = k.getQueryResult();
        if (n[0]) {
            drawQueryArea(n[0].getSpatialFilterShapes()[0], k)
        }
        for (var q = 0; q < n.length; q++) {
            var l = n[q];
            if (!l.bShow) {
                continue
            }
            var h = l.getGeometryType();
            var g = l.getFeatures();
            for (var p = 0; p < g.length; p++) {
                var c = g[p];
                var t = c.getQueryDispFieldValue();
                var s = c.getCoordinateSequence();
                var d = null;
                switch (h) {
                    case "nil":
                        break;
                    case "point":
                    case "multipoint":
                        var f = new Icon();
                        f.image = l.imgURL;
                        f.height = l.imgHeight;
                        f.width = l.imgWidth;
                        f.leftOffset = l.leftOffset;
                        f.topOffset = l.topOffset;
                        var m = new Title(t, 12, 7);
                        var b = new MultiPoint(c.linestr);
                        for (var q = 0; q < b.getSegmentCount(); q++) {
                            d = new Marker(b.getSegment(q), f, m);
                            testAddFeat(k, d, c.toHTML())
                        }
                        break;
                    case "polyline":
                    case "multipolyline":
                        var o = new MultiPolyline(s, "#157CC4", 3, 0.5, 0);
                        for (var q = 0; q < o.getSegmentCount(); q++) {
                            d = o.getSegment(q);
                            testAddFeat(k, d, c.toHTML())
                        }
                        break;
                    case "polygon":
                    case "multipolygon":
                        var u = new MultiPolygon(s, "#157CC4", 3, 0.5, "blue");
                        for (var q = 0; q < u.getSegmentCount(); q++) {
                            d = u.getSegment(q);
                            testAddFeat(k, d, c.toHTML())
                        }
                        break;
                    default:
                        break
                }
            }
        }
    } catch (r) {
        alert("查询过程中出错：" + r.msssage)
    }
}
function drawQueryArea(e, c) {
    if (e) {
        var b = e.getCoordinateSequence();
        var a = null;
        switch (e.getGeometryType()) {
            case "polygon":
                a = new Polygon(b, "#ff00FF", 3, 0.3, "green");
                c.addOverlay(a);
                break;
            case "circle":
                a = new Circle(b, "#ff00FF", 3, 0.3, "green");
                c.addOverlay(a);
                break;
            case "rectangle":
                a = new Rectangle(b, "#ff00FF", 3, 0.3, "green");
                c.addOverlay(a);
                break;
            case "multipolygon":
                var a = new MultiPolygon(b, "#ff00FF", 3, 0.3, "green");
                for (var d = 0; d < a.getSegmentCount(); d++) {
                    var f = a.getSegment(d);
                    c.addOverlay(f, "#ff00FF")
                }
                break;
            default:
                return
        }
        c.centerAtLatLng(a.getMBR().centerPoint())
    }
}
function testAddFeat(b, c, a) {
    b.addOverlay(c);
    c.addListener("click", function() {
        c.openInfoWindowHtml(a)
    })
}
function editCallback(a) {
    alert("更新状态:" + a)
}
function EzTileThematic(a, b, c) {
    try {
        if (!EzServerClient.GlobeFunction.isTypeRight(a, "string")) {
            throw EzErrorFactory.createError("EzTileThematic构造方法中arguments[0]类型不正确")
        } else {
            this.format = a;
            this.bIsStreamOrText = b;
            this.thematicProxyURL = c
        }
    } catch (d) {
        throw EzErrorFactory.createError("EzTileThematic构造方法执行不正确", d)
    }
}
EzTileThematic.prototype.getFormat = function() {
    return this.format
};
EzTileThematic.prototype.setFormat = function(a) {
    try {
        if (!EzServerClient.GlobeFunction.isTypeRight(a, "string")) {
            throw EzErrorFactory.createError("EzTileThematic::setFormat方法中arguments[0]类型不正确")
        } else {
            this.format = a
        }
    } catch (b) {
        throw EzErrorFactory.createError("EzTileThematic::setFormat方法执行不正确", b)
    }
};
EzTileThematic.prototype.open = function(a) {
    try {
        if (!EzServerClient.GlobeFunction.isTypeRight(a, "EzMap")) {
            throw EzErrorFactory.createError("EzTileThematic::open方法中arguments[0]类型不正确")
        } else {
            a.map.bThematicOverlay = true;
            a.map.curThematicURL = this.format;
            if (this.bIsStreamOrText) {
                a.map.bIsStreamOrText = true
            } else {
                if (this.thematicProxyURL) {
                    a.map.strThematicProxyURL = this.thematicProxyURL
                }
            }
            a.map.loadTileImages()
        }
    } catch (b) {
        throw EzErrorFactory.createError("EzTileThematic::open方法执行不正确", b)
    }
};
EzTileThematic.prototype.close = function(a) {
    try {
        if (!EzServerClient.GlobeFunction.isTypeRight(a, "EzMap")) {
            throw EzErrorFactory.createError("EzTileThematic::close方法中arguments[0]类型不正确")
        } else {
            a.map.bThematicOverlay = false;
            a.map.removeTilesFromDiv(a.map.overlayImages);
            a.map.overlayImages = []
        }
    } catch (b) {
        throw EzErrorFactory.createError("EzTileThematic::close方法执行不正确", b)
    }
};
function EzTileThematicCP03(b, a, c, d) {
    try {
        if (!EzServerClient.GlobeFunction.isTypeRight(b, "string")) {
            throw EzErrorFactory.createError("EzTileThematicCP03构造方法中arguments[0]类型不正确")
        } else {
            if (!EzServerClient.GlobeFunction.isTypeRight(a, "string")) {
                throw EzErrorFactory.createError("EzTileThematicCP03构造方法中arguments[1]类型不正确")
            } else {
                this.thematicBaseURL = b;
                this.thematicXML = a;
                this.thematicProxyURL = d;
                this.bIsStreamOrText = c
            }
        }
    } catch (f) {
        throw EzErrorFactory.createError("EzTileThematicCP03构造方法执行不正确", f)
    }
}
EzTileThematicCP03.prototype.getThematicBaseURL = function() {
    return this.thematicBaseURL
};
EzTileThematicCP03.prototype.getThematicXML = function() {
    return this.thematicXML
};
EzTileThematicCP03.prototype.setThematicBaseURL = function(a) {
    try {
        if (!EzServerClient.GlobeFunction.isTypeRight(a, "string")) {
            throw EzErrorFactory.createError("EzTileThematicCP03::setThematicBaseURL方法中arguments[0]类型不正确")
        } else {
            this.thematicBaseURL = a
        }
    } catch (b) {
        throw EzErrorFactory.createError("EzTileThematicCP03::setThematicBaseURL方法执行不正确", b)
    }
};
EzTileThematicCP03.prototype.open = function(a) {
    try {
        if (!EzServerClient.GlobeFunction.isTypeRight(a, "EzMap")) {
            throw EzErrorFactory.createError("EzTileThematicCP03::open方法中arguments[0]类型不正确")
        } else {
            a.map.bThematicOverlay = true;
            a.map.bThematicOverlayCP03 = true;
            a.map.curThematicURLCP03 = this.thematicBaseURL;
            a.map.strThematicXML = this.thematicXML;
            if (this.bIsStreamOrText) {
                a.map.bIsStreamOrText = true
            } else {
                if (this.thematicProxyURL) {
                    a.map.strThematicProxyURL = this.thematicProxyURL
                }
            }
            a.map.loadTileImages()
        }
    } catch (b) {
        throw EzErrorFactory.createError("EzTileThematicCP03::open方法执行不正确", b)
    }
};
EzTileThematicCP03.prototype.close = function(a) {
    try {
        if (!EzServerClient.GlobeFunction.isTypeRight(a, "EzMap")) {
            throw EzErrorFactory.createError("EzTileThematicCP03::close方法中arguments[0]类型不正确")
        } else {
            a.map.bThematicOverlay = false;
            a.map.bThematicOverlayCP03 = false;
            a.map.removeTilesFromDiv(a.map.overlayImages);
            a.map.overlayImages = []
        }
    } catch (b) {
        throw EzErrorFactory.createError("EzTileThematicCP03::close方法执行不正确", b)
    }
};

if (typeof EzServerClient.TMSXmlParse == "undefined" || EzServerClient.TMSXmlParse) {
    EzServerClient.TMSXmlParse = {}
}
EzServerClient.TMSXmlParse.E_Element = function() {
};
if (typeof EzServerClient.TMSXmlParse.EzXmlDomUtil == "undefined" || EzServerClient.TMSXmlParse.EzXmlDomUtil) {
    EzServerClient.TMSXmlParse.EzXmlDomUtil = {}
}
EzServerClient.TMSXmlParse.EzXmlDomUtil.addChildElement = function(a, b) {
    if (b == null) {
        return
    } else {
        a.appendChild(b.toElement(a.ownerDocument))
    }
};
EzServerClient.TMSXmlParse.EzXmlDomUtil.createElement = function(a, b) {
    return a.createElement(b)
};
EzServerClient.TMSXmlParse.EzXmlDomUtil.createElementNS = function(b, c) {
    var a = b.createElement(c);
    return a
};
EzServerClient.TMSXmlParse.EzXmlDomUtil.equal = function(c, b, a) {
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
EzServerClient.TMSXmlParse.EzXmlDomUtil.getAttribute = function(c, a) {
    if (c.nodeName == "#comment") {
        return null
    }
    var b = c.getAttribute(a);
    return b
};
EzServerClient.TMSXmlParse.EzXmlDomUtil.getChildElement = function(e, a) {
    if (e.nodeName == "#comment") {
        return null
    }
    var d = e.getElementsByTagName(a);
    if (d.length == 0) {
        return null
    } else {
        for (var b = 0; b < d.length; b++) {
            var c = d.item(b);
            if (c.parentNode.nodeName == e.nodeName) {
                return c
            }
        }
        return null
    }
};
EzServerClient.TMSXmlParse.EzXmlDomUtil.getChildElements = function(d, c) {
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
EzServerClient.TMSXmlParse.EzXmlDomUtil.getChildElements = function(d) {
    var c = d.childNodes;
    if (c.length == 0) {
        return new Array()
    } else {
        var b = new Array();
        for (var a = 0; a < c.length; a++) {
            var e = c.item(a);
            if (typeof (e) == "object") {
                b.push(e)
            }
        }
        return b.slice(0)
    }
};
EzServerClient.TMSXmlParse.EzXmlDomUtil.getContext = function(d) {
    var e = new Array();
    var c = d.childNodes;
    for (var a = 0; a < c.length; a++) {
        var b = c.item(a);
        if (typeof (b) == "object") {
            e.push(b.nodeValue)
        }
    }
    return e.toString()
};
EzServerClient.TMSXmlParse.EzXmlDomUtil.getEzXMLNamespace = function() {
    return "http://tiledmapservice.easymap.com"
};
EzServerClient.TMSXmlParse.EzXmlDomUtil.setAttribute = function(c, a, b) {
    if (b == null) {
    } else {
        c.setAttribute(a, b)
    }
};
EzServerClient.TMSXmlParse.EzXmlDomUtil.setContext = function(e, a) {
    if (a != null) {
        var f = e.ownerDocument.createTextNode(a);
        var d = e.childNodes;
        for (var b = d.length - 1; b >= 0; b--) {
            var c = d.item(b);
            if (c instanceof String) {
                e.removeChild(c)
            }
        }
        e.insertBefore(f, e.firstChild)
    }
};
if (typeof EzServerClient.TMSXmlParse.EzXmlTypeUtil == "undefined" || EzServerClient.TMSXmlParse.EzXmlTypeUtil) {
    EzServerClient.TMSXmlParse.EzXmlTypeUtil = {}
}
EzServerClient.TMSXmlParse.EzXmlTypeUtil.toBooleanValue = function(c, b) {
    var a = EzServerClient.TMSXmlParse.string_trim(this.toStringValue(c, ""));
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
EzServerClient.TMSXmlParse.EzXmlTypeUtil.toDoubleValue = function(c, b) {
    var a = EzServerClient.TMSXmlParse.string_trim(this.toStringValue(c, ""));
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
EzServerClient.TMSXmlParse.EzXmlTypeUtil.toIntegerValue = function(c, b) {
    var a = EzServerClient.TMSXmlParse.string_trim(this.toStringValue(c, ""));
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
EzServerClient.TMSXmlParse.EzXmlTypeUtil.toLongValue = function(c, b) {
    var a = EzServerClient.TMSXmlParse.string_trim(this.toStringValue(c, ""));
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
EzServerClient.TMSXmlParse.EzXmlTypeUtil.toStringValue = function(a, b) {
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
EzServerClient.TMSXmlParse.string_trim = function(c) {
    var b = c;
    if (b == null) {
        return null
    } else {
        b = b.replace(/^(\s)*/, "");
        b = b.replace(/(\s)*$/, "");
        return b
    }
};
EzServerClient.TMSXmlParse.E_Collection = function() {
};
EzServerClient.TMSXmlParse.E_Collection.prototype.add = function() {
};
EzServerClient.TMSXmlParse.E_Collection.prototype.clear = function() {
};
EzServerClient.TMSXmlParse.E_Collection.prototype.get = function(a) {
};
EzServerClient.TMSXmlParse.E_Collection.prototype.isEmpty = function() {
};
EzServerClient.TMSXmlParse.E_Collection.prototype.remove = function() {
};
EzServerClient.TMSXmlParse.E_Collection.prototype.size = function() {
};
EzServerClient.TMSXmlParse.E_TiledBoundingBox = function() {
    EzServerClient.TMSXmlParse.E_Element.call(this);
    this.minx = null;
    this.miny = null;
    this.maxx = null;
    this.maxy = null
};
EzServerClient.TMSXmlParse.E_TiledBoundingBox.prototype = new EzServerClient.TMSXmlParse.E_Element;
EzServerClient.TMSXmlParse.E_TiledBoundingBox.prototype.fromElement = function(a) {
    if (a == null) {
        return null
    }
    this.setMinx(EzServerClient.TMSXmlParse.EzXmlDomUtil.getAttribute(a, "minx"));
    this.setMiny(EzServerClient.TMSXmlParse.EzXmlDomUtil.getAttribute(a, "miny"));
    this.setMaxx(EzServerClient.TMSXmlParse.EzXmlDomUtil.getAttribute(a, "maxx"));
    this.setMaxy(EzServerClient.TMSXmlParse.EzXmlDomUtil.getAttribute(a, "maxy"));
    return this
};
EzServerClient.TMSXmlParse.E_TiledBoundingBox.prototype.getElementName = function() {
    return "TiledBoundingBox"
};
EzServerClient.TMSXmlParse.E_TiledBoundingBox.prototype.getMinx = function() {
    return this.minx
};
EzServerClient.TMSXmlParse.E_TiledBoundingBox.prototype.setMinx = function(a) {
    this.minx = a
};
EzServerClient.TMSXmlParse.E_TiledBoundingBox.prototype.getMiny = function() {
    return this.miny
};
EzServerClient.TMSXmlParse.E_TiledBoundingBox.prototype.setMiny = function(a) {
    this.miny = a
};
EzServerClient.TMSXmlParse.E_TiledBoundingBox.prototype.getMaxx = function() {
    return this.maxx
};
EzServerClient.TMSXmlParse.E_TiledBoundingBox.prototype.setMaxx = function(a) {
    this.maxx = a
};
EzServerClient.TMSXmlParse.E_TiledBoundingBox.prototype.getMaxy = function() {
    return this.maxy
};
EzServerClient.TMSXmlParse.E_TiledBoundingBox.prototype.setMaxy = function(a) {
    this.maxy = a
};
EzServerClient.TMSXmlParse.E_TiledFormat = function() {
    EzServerClient.TMSXmlParse.E_Element.call(this);
    this.width = null;
    this.height = null;
    this.mimeType = null;
    this.extension = null
};
EzServerClient.TMSXmlParse.E_TiledFormat.prototype = new EzServerClient.TMSXmlParse.E_Element;
EzServerClient.TMSXmlParse.E_TiledFormat.prototype.fromElement = function(a) {
    if (a == null) {
        return null
    }
    this.setWidth(EzServerClient.TMSXmlParse.EzXmlDomUtil.getAttribute(a, "width"));
    this.setHeight(EzServerClient.TMSXmlParse.EzXmlDomUtil.getAttribute(a, "height"));
    this.setMimeType(EzServerClient.TMSXmlParse.EzXmlDomUtil.getAttribute(a, "mime-type"));
    this.setExtension(EzServerClient.TMSXmlParse.EzXmlDomUtil.getAttribute(a, "extension"));
    return this
};
EzServerClient.TMSXmlParse.E_TiledFormat.prototype.getElementName = function() {
    return "TiledFormat"
};
EzServerClient.TMSXmlParse.E_TiledFormat.prototype.getWidth = function() {
    return this.width
};
EzServerClient.TMSXmlParse.E_TiledFormat.prototype.setWidth = function(a) {
    this.width = a
};
EzServerClient.TMSXmlParse.E_TiledFormat.prototype.getHeight = function() {
    return this.height
};
EzServerClient.TMSXmlParse.E_TiledFormat.prototype.setHeight = function(a) {
    this.height = a
};
EzServerClient.TMSXmlParse.E_TiledFormat.prototype.getMimeType = function() {
    return this.mimeType
};
EzServerClient.TMSXmlParse.E_TiledFormat.prototype.setMimeType = function(a) {
    this.mimeType = a
};
EzServerClient.TMSXmlParse.E_TiledFormat.prototype.getExtension = function() {
    return this.extension
};
EzServerClient.TMSXmlParse.E_TiledFormat.prototype.setExtension = function(a) {
    this.extension = a
};
EzServerClient.TMSXmlParse.E_TiledFormats = function() {
    EzServerClient.TMSXmlParse.E_Element.call(this);
    this.tiledFormatContainer = []
};
EzServerClient.TMSXmlParse.E_TiledFormats.prototype = new EzServerClient.TMSXmlParse.E_Element;
EzServerClient.TMSXmlParse.E_TiledFormats.prototype.fromElement = function(d) {
    if (d == null) {
        return null
    }
    var f = new EzServerClient.TMSXmlParse.E_TiledFormat();
    var e = EzServerClient.TMSXmlParse.EzXmlDomUtil.getChildElements(d, f.getElementName());
    var c = new Array();
    for (var b = 0; b < e.length; b++) {
        var a = new EzServerClient.TMSXmlParse.E_TiledFormat();
        a = a.fromElement(e[b]);
        c.push(a)
    }
    this.tiledFormatContainer = c;
    return this
};
EzServerClient.TMSXmlParse.E_TiledFormats.prototype.get = function(a) {
    return this.tiledFormatContainer[a]
};
EzServerClient.TMSXmlParse.E_TiledFormats.prototype.getElementName = function() {
    return "TiledFormats"
};
EzServerClient.TMSXmlParse.E_TiledFormats.prototype.isEmpty = function() {
    if (this.tiledFormatContainer.length == 0) {
        return true
    }
};
EzServerClient.TMSXmlParse.E_TiledFormats.prototype.remove = function(a) {
    return this.tiledFormatContainer.splice(a, a)
};
EzServerClient.TMSXmlParse.E_TiledFormats.prototype.size = function() {
    return this.tiledFormatContainer.length
};
EzServerClient.TMSXmlParse.E_TiledLayer = function() {
    EzServerClient.TMSXmlParse.E_Element.call(this);
    this.name = null;
    this.tiledSRS = null;
    this.tiledBoundingBox = null;
    this.tiledOrigin = null;
    this.tiledFormats = null;
    this.tiledRoateAngle = null;
    this.tiledRefreshTime = null;
    this.tiledStyle = null;
    this.tiledTimeDimension = null;
    this.tiledSets = null
};
EzServerClient.TMSXmlParse.E_TiledLayer.prototype = new EzServerClient.TMSXmlParse.E_Element;
EzServerClient.TMSXmlParse.E_TiledLayer.prototype.fromElement = function(h) {
    if (h == null) {
        return null
    }
    var f = new EzServerClient.TMSXmlParse.E_TiledSRS();
    f = f.fromElement(EzServerClient.TMSXmlParse.EzXmlDomUtil.getChildElement(h, f.getElementName()));
    this.setTiledSRS(f);
    var c = new EzServerClient.TMSXmlParse.E_TiledBoundingBox();
    c = c.fromElement(EzServerClient.TMSXmlParse.EzXmlDomUtil.getChildElement(h, c.getElementName()));
    this.setTiledBoundingBox(c);
    var a = new EzServerClient.TMSXmlParse.E_TiledOrigin();
    a = a.fromElement(EzServerClient.TMSXmlParse.EzXmlDomUtil.getChildElement(h, a.getElementName()));
    this.setTiledOrigin(a);
    var b = new EzServerClient.TMSXmlParse.E_TiledFormats();
    b = b.fromElement(EzServerClient.TMSXmlParse.EzXmlDomUtil.getChildElement(h, b.getElementName()));
    this.setTiledFormats(b);
    var g = new EzServerClient.TMSXmlParse.E_TiledRoateAngle();
    g = g.fromElement(EzServerClient.TMSXmlParse.EzXmlDomUtil.getChildElement(h, g.getElementName()));
    this.setTiledRoateAngle(g);
    var i = new EzServerClient.TMSXmlParse.E_TiledRefreshTime();
    i = i.fromElement(EzServerClient.TMSXmlParse.EzXmlDomUtil.getChildElement(h, i.getElementName()));
    this.setTiledRefreshTime(i);
    var j = new EzServerClient.TMSXmlParse.E_TiledStyle();
    j = j.fromElement(EzServerClient.TMSXmlParse.EzXmlDomUtil.getChildElement(h, j.getElementName()));
    this.setTiledStyle(j);
    var e = new EzServerClient.TMSXmlParse.E_TiledTimeDimension();
    e = e.fromElement(EzServerClient.TMSXmlParse.EzXmlDomUtil.getChildElement(h, e.getElementName()));
    this.setTiledTimeDimension(e);
    var d = new EzServerClient.TMSXmlParse.E_TiledSets();
    d = d.fromElement(EzServerClient.TMSXmlParse.EzXmlDomUtil.getChildElement(h, d.getElementName()));
    this.setTiledSets(d);
    this.setName(EzServerClient.TMSXmlParse.EzXmlDomUtil.getAttribute(h, "name"));
    return this
};
EzServerClient.TMSXmlParse.E_TiledLayer.prototype.getElementName = function() {
    return "TiledLayer"
};
EzServerClient.TMSXmlParse.E_TiledLayer.prototype.getName = function() {
    return this.name
};
EzServerClient.TMSXmlParse.E_TiledLayer.prototype.setName = function(a) {
    this.name = a
};
EzServerClient.TMSXmlParse.E_TiledLayer.prototype.getTiledSRS = function() {
    return this.tiledSRS
};
EzServerClient.TMSXmlParse.E_TiledLayer.prototype.setTiledSRS = function(a) {
    this.tiledSRS = a
};
EzServerClient.TMSXmlParse.E_TiledLayer.prototype.getTiledBoundingBox = function() {
    return this.tiledBoundingBox
};
EzServerClient.TMSXmlParse.E_TiledLayer.prototype.setTiledBoundingBox = function(a) {
    this.tiledBoundingBox = a
};
EzServerClient.TMSXmlParse.E_TiledLayer.prototype.getTiledOrigin = function() {
    return this.tiledOrigin
};
EzServerClient.TMSXmlParse.E_TiledLayer.prototype.setTiledOrigin = function(a) {
    this.tiledOrigin = a
};
EzServerClient.TMSXmlParse.E_TiledLayer.prototype.getTiledFormats = function() {
    return this.tiledFormats
};
EzServerClient.TMSXmlParse.E_TiledLayer.prototype.setTiledFormats = function(a) {
    this.tiledFormats = a
};
EzServerClient.TMSXmlParse.E_TiledLayer.prototype.getTiledRoateAngle = function() {
    return this.tiledRoateAngle
};
EzServerClient.TMSXmlParse.E_TiledLayer.prototype.setTiledRoateAngle = function(a) {
    this.tiledRoateAngle = a
};
EzServerClient.TMSXmlParse.E_TiledLayer.prototype.getTiledRefreshTime = function() {
    return this.tiledRefreshTime
};
EzServerClient.TMSXmlParse.E_TiledLayer.prototype.setTiledRefreshTime = function(a) {
    this.tiledRefreshTime = a
};
EzServerClient.TMSXmlParse.E_TiledLayer.prototype.getTiledStyle = function() {
    return this.tiledStyle
};
EzServerClient.TMSXmlParse.E_TiledLayer.prototype.setTiledStyle = function(a) {
    this.tiledStyle = a
};
EzServerClient.TMSXmlParse.E_TiledLayer.prototype.getTiledTimeDimension = function() {
    return this.tiledTimeDimension
};
EzServerClient.TMSXmlParse.E_TiledLayer.prototype.setTiledTimeDimension = function(a) {
    this.tiledTimeDimension = a
};
EzServerClient.TMSXmlParse.E_TiledLayer.prototype.getTiledSets = function() {
    return this.tiledSets
};
EzServerClient.TMSXmlParse.E_TiledLayer.prototype.setTiledSets = function(a) {
    this.tiledSets = a
};
EzServerClient.TMSXmlParse.E_TiledLayers = function() {
    EzServerClient.TMSXmlParse.E_Element.call(this);
    this.tiledLayerContainer = []
};
EzServerClient.TMSXmlParse.E_TiledLayers.prototype = new EzServerClient.TMSXmlParse.E_Element;
EzServerClient.TMSXmlParse.E_TiledLayers.prototype.fromElement = function(d) {
    if (d == null) {
        return null
    }
    var f = new EzServerClient.TMSXmlParse.E_TiledLayer();
    var e = EzServerClient.TMSXmlParse.EzXmlDomUtil.getChildElements(d, f.getElementName());
    var c = new Array();
    for (var b = 0; b < e.length; b++) {
        var a = new EzServerClient.TMSXmlParse.E_TiledLayer();
        a = a.fromElement(e[b]);
        c.push(a)
    }
    this.tiledLayerContainer = c;
    return this
};
EzServerClient.TMSXmlParse.E_TiledLayers.prototype.get = function(a) {
    return this.tiledLayerContainer[a]
};
EzServerClient.TMSXmlParse.E_TiledLayers.prototype.getElementName = function() {
    return "TiledLayers"
};
EzServerClient.TMSXmlParse.E_TiledLayers.prototype.isEmpty = function() {
    if (this.tiledLayerContainer.length == 0) {
        return true
    }
};
EzServerClient.TMSXmlParse.E_TiledLayers.prototype.remove = function(a) {
    return this.tiledLayerContainer.splice(a, a)
};
EzServerClient.TMSXmlParse.E_TiledLayers.prototype.size = function() {
    return this.tiledLayerContainer.length
};
EzServerClient.TMSXmlParse.E_TiledOrigin = function() {
    EzServerClient.TMSXmlParse.E_Element.call(this);
    this.x = null;
    this.y = null
};
EzServerClient.TMSXmlParse.E_TiledOrigin.prototype = new EzServerClient.TMSXmlParse.E_Element;
EzServerClient.TMSXmlParse.E_TiledOrigin.prototype.fromElement = function(a) {
    if (a == null) {
        return null
    }
    this.setX(EzServerClient.TMSXmlParse.EzXmlDomUtil.getAttribute(a, "x"));
    this.setY(EzServerClient.TMSXmlParse.EzXmlDomUtil.getAttribute(a, "y"));
    return this
};
EzServerClient.TMSXmlParse.E_TiledOrigin.prototype.getElementName = function() {
    return "TiledOrigin"
};
EzServerClient.TMSXmlParse.E_TiledOrigin.prototype.getX = function() {
    return this.x
};
EzServerClient.TMSXmlParse.E_TiledOrigin.prototype.setX = function(a) {
    this.x = a
};
EzServerClient.TMSXmlParse.E_TiledOrigin.prototype.getY = function() {
    return this.y
};
EzServerClient.TMSXmlParse.E_TiledOrigin.prototype.setY = function(a) {
    this.y = a
};
EzServerClient.TMSXmlParse.E_TiledRefreshTime = function() {
    EzServerClient.TMSXmlParse.E_Element.call(this);
    this.content = null
};
EzServerClient.TMSXmlParse.E_TiledRefreshTime.prototype = new EzServerClient.TMSXmlParse.E_Element;
EzServerClient.TMSXmlParse.E_TiledRefreshTime.prototype.fromElement = function(b) {
    if (b == null) {
        return null
    }
    var a = EzServerClient.TMSXmlParse.EzXmlDomUtil.getContext(b);
    this.setContent(a);
    return this
};
EzServerClient.TMSXmlParse.E_TiledRefreshTime.prototype.getElementName = function() {
    return "TiledRefreshTime"
};
EzServerClient.TMSXmlParse.E_TiledRefreshTime.prototype.getContent = function() {
    return this.content
};
EzServerClient.TMSXmlParse.E_TiledRefreshTime.prototype.setContent = function(a) {
    this.content = a
};
EzServerClient.TMSXmlParse.E_TiledRoateAngle = function() {
    EzServerClient.TMSXmlParse.E_Element.call(this);
    this.content = null
};
EzServerClient.TMSXmlParse.E_TiledRoateAngle.prototype = new EzServerClient.TMSXmlParse.E_Element;
EzServerClient.TMSXmlParse.E_TiledRoateAngle.prototype.fromElement = function(b) {
    if (b == null) {
        return null
    }
    var a = EzServerClient.TMSXmlParse.EzXmlDomUtil.getContext(b);
    this.setContent(a);
    return this
};
EzServerClient.TMSXmlParse.E_TiledRoateAngle.prototype.getElementName = function() {
    return "TiledRoateAngle"
};
EzServerClient.TMSXmlParse.E_TiledRoateAngle.prototype.getContent = function() {
    return this.content
};
EzServerClient.TMSXmlParse.E_TiledRoateAngle.prototype.setContent = function(a) {
    this.content = a
};
EzServerClient.TMSXmlParse.E_TiledSet = function() {
    EzServerClient.TMSXmlParse.E_Element.call(this);
    this.level = null;
    this.unitsPerPixel = null
};
EzServerClient.TMSXmlParse.E_TiledSet.prototype = new EzServerClient.TMSXmlParse.E_Element;
EzServerClient.TMSXmlParse.E_TiledSet.prototype.fromElement = function(a) {
    if (a == null) {
        return null
    }
    this.setLevel(EzServerClient.TMSXmlParse.EzXmlDomUtil.getAttribute(a, "level"));
    this.setUnitsPerPixel(EzServerClient.TMSXmlParse.EzXmlDomUtil.getAttribute(a, "units-per-pixel"));
    return this
};
EzServerClient.TMSXmlParse.E_TiledSet.prototype.getElementName = function() {
    return "TiledSet"
};
EzServerClient.TMSXmlParse.E_TiledSet.prototype.getLevel = function() {
    return this.level
};
EzServerClient.TMSXmlParse.E_TiledSet.prototype.setLevel = function(a) {
    this.level = a
};
EzServerClient.TMSXmlParse.E_TiledSet.prototype.getUnitsPerPixel = function() {
    return this.unitsPerPixel
};
EzServerClient.TMSXmlParse.E_TiledSet.prototype.setUnitsPerPixel = function(a) {
    this.unitsPerPixel = a
};
EzServerClient.TMSXmlParse.E_TiledSets = function() {
    EzServerClient.TMSXmlParse.E_Element.call(this);
    this.tiledSetContainer = []
};
EzServerClient.TMSXmlParse.E_TiledSets.prototype = new EzServerClient.TMSXmlParse.E_Element;
EzServerClient.TMSXmlParse.E_TiledSets.prototype.fromElement = function(d) {
    if (d == null) {
        return null
    }
    var f = new EzServerClient.TMSXmlParse.E_TiledSet();
    var e = EzServerClient.TMSXmlParse.EzXmlDomUtil.getChildElements(d, f.getElementName());
    var c = new Array();
    for (var b = 0; b < e.length; b++) {
        var a = new EzServerClient.TMSXmlParse.E_TiledSet();
        a = a.fromElement(e[b]);
        c.push(a)
    }
    this.tiledSetContainer = c;
    return this
};
EzServerClient.TMSXmlParse.E_TiledSets.prototype.get = function(a) {
    return this.tiledSetContainer[a]
};
EzServerClient.TMSXmlParse.E_TiledSets.prototype.getElementName = function() {
    return "TiledSets"
};
EzServerClient.TMSXmlParse.E_TiledSets.prototype.isEmpty = function() {
    if (this.tiledSetContainer.length == 0) {
        return true
    }
};
EzServerClient.TMSXmlParse.E_TiledSets.prototype.remove = function(a) {
    return this.tiledSetContainer.splice(a, a)
};
EzServerClient.TMSXmlParse.E_TiledSets.prototype.size = function() {
    return this.tiledSetContainer.length
};
EzServerClient.TMSXmlParse.E_TiledSRS = function() {
    EzServerClient.TMSXmlParse.E_Element.call(this);
    this.content = null
};
EzServerClient.TMSXmlParse.E_TiledSRS.prototype = new EzServerClient.TMSXmlParse.E_Element;
EzServerClient.TMSXmlParse.E_TiledSRS.prototype.fromElement = function(b) {
    if (b == null) {
        return null
    }
    var a = EzServerClient.TMSXmlParse.EzXmlDomUtil.getContext(b);
    this.setContent(a);
    return this
};
EzServerClient.TMSXmlParse.E_TiledSRS.prototype.getElementName = function() {
    return "TiledSRS"
};
EzServerClient.TMSXmlParse.E_TiledSRS.prototype.getContent = function() {
    return this.content
};
EzServerClient.TMSXmlParse.E_TiledSRS.prototype.setContent = function(a) {
    this.content = a
};
EzServerClient.TMSXmlParse.E_TiledStyle = function() {
    EzServerClient.TMSXmlParse.E_Element.call(this);
    this.content = null
};
EzServerClient.TMSXmlParse.E_TiledStyle.prototype = new EzServerClient.TMSXmlParse.E_Element;
EzServerClient.TMSXmlParse.E_TiledStyle.prototype.fromElement = function(b) {
    if (b == null) {
        return null
    }
    var a = EzServerClient.TMSXmlParse.EzXmlDomUtil.getContext(b);
    this.setContent(a);
    return this
};
EzServerClient.TMSXmlParse.E_TiledStyle.prototype.getElementName = function() {
    return "TiledStyle"
};
EzServerClient.TMSXmlParse.E_TiledStyle.prototype.getContent = function() {
    return this.content
};
EzServerClient.TMSXmlParse.E_TiledStyle.prototype.setContent = function(a) {
    this.content = a
};
EzServerClient.TMSXmlParse.E_TiledTimeDimension = function() {
    EzServerClient.TMSXmlParse.E_Element.call(this);
    this.content = null
};
EzServerClient.TMSXmlParse.E_TiledTimeDimension.prototype = new EzServerClient.TMSXmlParse.E_Element;
EzServerClient.TMSXmlParse.E_TiledTimeDimension.prototype.fromElement = function(b) {
    if (b == null) {
        return null
    }
    var a = EzServerClient.TMSXmlParse.EzXmlDomUtil.getContext(b);
    this.setContent(a);
    return this
};
EzServerClient.TMSXmlParse.E_TiledTimeDimension.prototype.getElementName = function() {
    return "TiledTimeDimension"
};
EzServerClient.TMSXmlParse.E_TiledTimeDimension.prototype.getContent = function() {
    return this.content
};
EzServerClient.TMSXmlParse.E_TiledTimeDimension.prototype.setContent = function(a) {
    this.content = a
};
EzServerClient.TMSXmlParse.E_TiledMapService = function() {
    EzServerClient.TMSXmlParse.E_Element.call(this);
    this.version = "1.0.0";
    this.name = null;
    this.tiledLayers = null
};
EzServerClient.TMSXmlParse.E_TiledMapService.prototype = new EzServerClient.TMSXmlParse.E_Element;
EzServerClient.TMSXmlParse.E_TiledMapService.prototype.fromElement = function(a) {
    if (a == null) {
        return null
    }
    var b = new EzServerClient.TMSXmlParse.E_TiledLayers();
    b = b.fromElement(EzServerClient.TMSXmlParse.EzXmlDomUtil.getChildElement(a, b.getElementName()));
    this.setTiledLayers(b);
    this.setVersion(EzServerClient.TMSXmlParse.EzXmlDomUtil.getAttribute(a, "version"));
    return this;
    this.setName(EzServerClient.TMSXmlParse.EzXmlDomUtil.getAttribute(a, "name"));
    return this
};
EzServerClient.TMSXmlParse.E_TiledMapService.prototype.getElementName = function() {
    return "TiledMapService"
};
EzServerClient.TMSXmlParse.E_TiledMapService.prototype.getName = function() {
    return this.name
};
EzServerClient.TMSXmlParse.E_TiledMapService.prototype.setName = function(a) {
    this.name = a
};
EzServerClient.TMSXmlParse.E_TiledMapService.prototype.getVersion = function() {
    return this.version
};
EzServerClient.TMSXmlParse.E_TiledMapService.prototype.setVersion = function(a) {
    EzServerClient.TMSXmlParse.E_TiledMapService.version = EzServerClient.TMSXmlParse.EzXmlTypeUtil.toStringValue(a, "1.0.0");
    if (EzServerClient.TMSXmlParse.E_TiledMapService.version != "1.0.0") {
        throw new Error("设置的版本号不是TiledMapService 1.0.0")
    }
    this.version = EzServerClient.TMSXmlParse.E_TiledMapService.version
};
EzServerClient.TMSXmlParse.E_TiledMapService.prototype.makeMutexEmpty = function() {
    this.tiledLayers = null
};
EzServerClient.TMSXmlParse.E_TiledMapService.prototype.getTiledLayers = function() {
    return this.tiledLayers
};
EzServerClient.TMSXmlParse.E_TiledMapService.prototype.setTiledLayers = function(a) {
    if (a != null) {
        this.makeMutexEmpty()
    }
    this.tiledLayers = a
};
EzServerClient.TMSXmlParse.EzFactory = function() {
};
EzServerClient.TMSXmlParse.EzFactory.FromXml = function(f) {
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
            throw (b)
        }
    }
    var d = c.documentElement;
    var a = new EzServerClient.TMSXmlParse.E_TiledMapService().fromElement(d);
    return a
};
EzServerClient.TMSXmlParse.EzFactory.FromXmlByFile = function(c) {
    try {
        xmlDoc = new ActiveXObject("Microsoft.XMLDOM")
    } catch (b) {
        try {
            xmlDoc = document.implementation.createDocument("", "", null)
        } catch (b) {
            throw b
        }
    }
    try {
        xmlDoc.async = false;
        xmlDoc.load(c);
        var a = new EzServerClient.TMSXmlParse.E_TiledMapService().fromElement(xmlDoc.documentElement);
        return a
    } catch (b) {
        return (null)
    }
};
EzServerClient.TMSXmlParse.QueryItem = function(a, b) {
    this.timeOut = null;
    this.tryTime = null;
    this.state = State.SUCCESS;
    this.url = a;
    this.failureOnError = false;
    this.xmlDoc = b;
    this.responseXml = null
};
EzServerClient.TMSXmlParse.QueryItem.prototype.currentTryTime = 0;
EzServerClient.TMSXmlParse.QueryItem.prototype.reSendId = 0;
EzServerClient.TMSXmlParse.QueryItem.prototype.getTimeOut = function() {
    return this.timeOut
};
EzServerClient.TMSXmlParse.QueryItem.prototype.setTimeOut = function(a) {
    this.timeOut = a
};
EzServerClient.TMSXmlParse.QueryItem.prototype.getTryTime = function() {
    return this.tryTime
};
EzServerClient.TMSXmlParse.QueryItem.prototype.setTryTime = function(a) {
    this.tryTime = a
};
EzServerClient.TMSXmlParse.QueryItem.prototype.getQueryXml = function() {
    return this.xmlDoc
};
EzServerClient.TMSXmlParse.QueryItem.prototype.setQueryXml = function(a) {
    this.xmlDoc = a
};
EzServerClient.TMSXmlParse.QueryItem.prototype.getResponseXml = function() {
    return this.responseXml
};
EzServerClient.TMSXmlParse.QueryItem.prototype.setResponseXml = function(a) {
    this.responseXml = a
};
EzServerClient.TMSXmlParse.QueryItem.prototype.getResultState = function() {
    return this.state
};
EzServerClient.TMSXmlParse.QueryItem.prototype.setResultState = function(a) {
    this.state = a
};
EzServerClient.TMSXmlParse.QueryItem.prototype.getFailureOnError = function() {
    return this.failureOnError
};
EzServerClient.TMSXmlParse.QueryItem.prototype.setFailureOnError = function(a) {
    this.failureOnError = a
};
EzServerClient.TMSXmlParse.QueryItem.prototype.doQuery = function() {
    var b = this.url;
    var g = this.xmlDoc;
    var e = this.tryTime;
    var a = this;
    var d = this.xmlDoc;
    this.itemId = null;
    var c = window.ActiveXObject ? new ActiveXObject("Microsoft.XMLHTTP") : new XMLHttpRequest();
    c.open("POST", this.url, true);
    c.setRequestHeader("Content-Type", "text/xml");
    c.onreadystatechange = f;
    if (a.currentTryTime == 0) {
        RequestMapObject.add(c, new RequestMapItemBinding(EzServerClient.TMSXmlParse.EzMapserviceQuery.NextOrder, d))
    } else {
        RequestMapObject.add(c, new RequestMapItemBinding(a.reSendId, d))
    }
    c.send(d);
    if (a.currentTryTime == 0) {
        EzServerClient.TMSXmlParse.EzMapserviceQuery.NextOrder++
    }
    function f() {
        if (c.readyState == 4) {
            if (c.status == 200) {
                var j = null;
                try {
                    j = new ActiveXObject("Microsoft.XMLDOM");
                    j.async = false;
                    if (c.responseText != null) {
                        j.loadXML(c.responseText)
                    } else {
                        return
                    }
                } catch (h) {
                    try {
                        parser = new DOMParser();
                        if (c.responseText != null) {
                            j = parser.parseFromString(c.responseText, "text/xml")
                        } else {
                            return
                        }
                    } catch (h) {
                        alert(h.message)
                    }
                }
                if ((j.getElementsByTagName("ERROR").length == 0)) {
                    var i = RequestMapObject.getValue(c);
                    RequestMapObject.remove(c);
                    a.setResponseXml(c.responseText);
                    a.setQueryXml(RequestMapObject.getValue(c).text);
                    a.itemId = RequestMapObject.getValue(c).num;
                    if (--a.mapServiceQuery.itemCurrentCount == 0) {
                        EzServerClient.TMSXmlParse.EzMapserviceQuery.QueryState = false;
                        a.mapServiceQuery.onFinished()
                    }
                } else {
                    if (++a.currentTryTime > a.getTryTime()) {
                        a.setResultState(State.ERROR);
                        a.mapServiceQuery.queryFlag++;
                        --a.mapServiceQuery.itemCurrentCount;
                        if (a.mapServiceQuery.failureOnError && a.mapServiceQuery.queryFlag == 1) {
                            EzServerClient.TMSXmlParse.EzMapserviceQuery.QueryState = false;
                            throw new Error("由于第" + RequestMapObject.getValue(c).num + "个子查询出错，该查询事务终止")
                        }
                        a.setResponseXml(c.responseText);
                        if (a.mapServiceQuery.itemCurrentCount == 0) {
                            EzServerClient.TMSXmlParse.EzMapserviceQuery.QueryState = false;
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
                        EzServerClient.TMSXmlParse.EzMapserviceQuery.QueryState = false;
                        throw new Error("由于第" + RequestMapObject.getValue(c).num + "个子查询出错，该查询事务终止")
                    }
                    if (a.mapServiceQuery.itemCurrentCount == 0) {
                        EzServerClient.TMSXmlParse.EzMapserviceQuery.QueryState = false;
                        a.mapServiceQuery.onFinished()
                    }
                    return
                }
                a.doQuery()
            }
        }
    }
};

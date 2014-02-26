NPNamespace.register("NPMapLib.Adapter.OpenLayers");

/*!
* 地图适配器－－与地图相关的操作接口
*/
(function() {
    var _container;
    var _opts;
    var _map;

    var _markersLayer; //存放marker
    var _featuresLayer; //存放feature

    var _zoomBar; //缩放
    var _navigator; //鼠标事件
    var _keyBord; //键盘
    var _overView; //鹰眼
    var _laySwitcher; //图层切换控制    
    var _scale; //比例尺
    var _drawControls; //画图控件集

    var _events;


    var e = NPMapLib.Adapter.OpenLayers.MapAdapter = function(container, opts) {
        _container = container;
        _opts = opts;
        _map = null;
        this._initialize();
    };

    //初始化
    e.prototype._initialize = function() {
        _navigator = new OpenLayers.Control.Navigation();
        _keyBord = new OpenLayers.Control.KeyboardDefaults();
        _keyBord.autoActivate = false;
        _laySwitcher = new OpenLayers.Control.LayerSwitcher({ 'ascending': true });

        var mapOptions = {
            resolutions: [0.703125, 0.3515625, 0.17578125, 0.087890625, 0.0439453125, 0.02197265625, 0.010986328125, 0.0054931640625, 0.00274658203125, 0.001373291015625, 6.866455078125E-4, 3.4332275390625E-4, 1.71661376953125E-4, 8.58306884765625E-5, 4.291534423828125E-5, 2.1457672119140625E-5, 1.0728836059570312E-5, 5.364418029785156E-6, 2.682209014892578E-6, 1.341104507446289E-6, 6.705522537231445E-7, 3.3527612686157227E-7],
            projection: new OpenLayers.Projection('EPSG:4326'),
            maxExtent: new OpenLayers.Bounds(-180.0, -90.0, 180.0, 90.0),
            units: "degrees",
            controls: [_navigator, _keyBord]
        };

        _map = new OpenLayers.Map(_container, mapOptions);
        //_map.addControl(new OpenLayers.Control.Navigation());
    };

    e.prototype._initControl = function() {
        var layer = new OpenLayers.Layer.Vector("cotrolslayer");
        _drawControls = {
            point: new OpenLayers.Control.DrawFeature(layer,
                        OpenLayers.Handler.Point),
            rect: new OpenLayer.Control.DrawFeature(layer,
                        OpenLayers.Handler.RegularPolygon, {
                            handlerOptions: {
                                sides: 4,
                                irregular: true
                            }
                        }
                    ),
            circle: new OpenLayers.Control.DrawFeature(layer,
                        OpenLayers.Handler.RegularPolygon, {
                            handlerOptions: {
                                sides: 50,
                                irregular: false
                            }
                        }
                    ),
            line: new OpenLayers.Control.DrawFeature(layer,
                        OpenLayers.Handler.Path),
            polygon: new OpenLayers.Control.DrawFeature(layer,
                        OpenLayers.Handler.Polygon)

        };
        _markersLayer = new OpenLayers.Layer.Markers("markersLayer");
        _featuresLayer = new Openlayers.Layer.Vector("featureLayer");
        _featuresLayer.displayInLayerSwitcher = false;
        _map.addLayers([layer, _markersLayer]);
    };


    //--------------------配置方法 开始----------------------
    //启用滚轮放大缩小，默认启用
    e.prototype.enableScrollWheelZoom = function() {
        if (_navigator) {
            _navigator.enableZoomWheel();
        }
    };

    //禁用滚轮放大缩小
    e.prototype.disableScrollWheelZoom = function() {
        if (_navigator) {
            _navigator.disableZoomWheel();
        }
    };

    //启用双击放大，默认启用
    e.prototype.enableDoubleClickZoom = function() {
        if (_navigator) {// && _navigator.active) {
            _navigator.handlers.click.activate();
        }
    };

    //禁用双击放大
    e.prototype.disableDoubleClickZoom = function() {
        if (_navigator) {
            _navigator.handlers.click.deactivate();
        }
    };

    //启用键盘操作
    e.prototype.enableKeyboard = function() {
        if (_keyBord !== null) {
            _keyBord.activate();
        }
    };

    //禁用键盘操作
    e.prototype.disableKeyboard = function() {
        if (_keyBord !== null) {
            _keyBord.deactivate();
        }
    };

    //启用地图惯性拖拽，默认禁用
    e.prototype.enableInertialDragging = function() {

    };

    //禁用地图惯性拖拽
    e.prototype.disableInertialDragging = function() {

    };

    //设置地图默认的鼠标指针样式
    e.prototype.setDefaultCursor = function(cursor) {

    };

    //返回地图默认的鼠标指针样式
    e.prototype.getDefaultCursor = function() {

    };

    //设置拖拽地图时的鼠标指针样式
    e.prototype.setDraggingCursor = function(cursor) {

    };

    //返回拖拽地图时的鼠标指针样式
    e.prototype.getDraggingCursor = function() {

    };

    //设置地图允许的最小级别。取值不得小于地图类型所允许的最小级别
    e.prototype.setMinZoom = function(zoom) {
        return _map.getMinZoom();
    };

    //设置地图允许的最大级别。取值不得大于地图类型所允许的最大级别
    e.prototype.setMaxZoom = function(zoom) {
        return _map.setMaxZoom();
    };
    //--------------------配置方法  结束----------------------



    //////////////////////////地图状态方法 开始//////////////////////
    //返回地图可视区域，以地理坐标表示
    e.prototype.getExtent = function() {
        return _map.getExtent();
    };

    //返回地图当前中心点
    e.prototype.getCenter = function() {
        return _map.getCenter();
    };

    //返回两点之间的距离，单位是米
    e.prototype.getDistance = function(start, end) {
        return start.distanceTo(end);
    };

    //返回地图视图的大小，以像素表示
    e.prototype.getSize = function() {
        return _map.getSize();
    };

    //返回地图当前缩放级别
    e.prototype.getZoom = function() {
        return _map.getZoom();
    };
    //////////////////////////地图状态方法 结束//////////////////////

    //////////////////////////修改地图状态方法 开始//////////////////////
    //地图根据指定的点和级别进行对中
    e.prototype.centerAndZoom = function(center, zoom) {
        var p = new OpenLayers.Lonlat(center.lon, center.lat);
        _map.setCenter(p, zoom);
    };

    //将地图的中心点更改为给定的点
    e.prototype.panTo = function(center) {
        _map.pan(center.x, center.y);
    };

    //将地图在水平位置上移动x像素，垂直位置上移动y像素
    e.prototype.panByPixel = function(x, y) {
        _map.panTo(new OpenLayers.LonLat(x, y));
    };

    //重新设置地图，恢复地图初始化时的中心点和级别
    e.prototype.reset = function() {

    };

    //设置地图中心点
    e.prototype.setCenter = function(center) {
        var p = new OpenLayers.Lonlat(center.lon, center.lat);
        _map.setCenter(p);
    };

    //设置地图类型
    e.prototype.switchLayer = function(index) {
    };

    //将视图切换到指定的缩放等级，中心点坐标不变
    e.prototype.setZoom = function(zoom) {
        _map.zoomTo(zoom);
    };

    //全图
    e.prototype.fullExtent = function() {

    };

    //拉框放大
    e.prototype.zoomIn = function() {
        _map.zoomInExtent(arguments);
    };

    //拉框缩小
    e.prototype.zoomOut = function() {
        _map.zoomInExtent(arguments);
    };

    //固定放大一个级别
    e.prototype.zoomInFixed = function() {
        _map.zoomIn();
    };

    //固定缩小一个级别
    e.prototype.zoomOutFixed = function() {
        _map.zoomOut();
    };
    //地图缩放到指定范围
    e.prototype.zoomToExtent = function(lonmin, latmin, lonmax, latmax) {
        _map.zoomToExtent(new OpenLayers.Bounds(lonmin, latmin, lonmax, latmax));
    };

    e.prototype.rotate = function(overlay, angle) {
        if (overlay instanceof NPMapLib.Symbols.Marker) {
            try {
                var o = overlay._apiObj.markerObj;
                var divDom = o.icon.imageDiv;
                if (typeof (angle) === "number") {

                    if (!dom.style.Transform) { //IE 9-
                        var rad = angle * (Math.PI / 180);
                        var m11 = Math.cos(rad),
                        m12 = -1 * Math.sin(rad),
                        m21 = Math.sin(rad),
                        m22 = m11;
                        dom.style.filter = "progid:DXImageTransform.Microsoft.Matrix(M11=" + m11 + ",M12=" + m12 + ",M21=" + m21 + ",M22=" + m22 + ",SizingMethod='auto expand')";
                    }
                    //Modern 
                    dom.style.MozTransform = "rotate(" + angle + "deg)";   //firfox
                    dom.style.WebkitTransform = "rotate(" + angle + "deg)"; //google
                    dom.style.OTransform = "rotate(" + angle + "deg)";  //opera 
                    dom.style.msTransform = "rotate(" + angle + "deg)"; //ie9+
                    dom.style.Transform = "rotate(" + angle + "deg)";   //others
                }
            }
            catch (e) {
                //window.alert(''

            }
        }
    };
    //////////////////////////修改地图状态方法 结束//////////////////////


    //////////////////////////控件方法 开始//////////////////////
    //返回地图的容器元素
    e.prototype.getContainer = function() {
        return _container;
    };
    //////////////////////////控件方法 结束//////////////////////
    //显示导航控件
    e.prototype.showNavigationControl = function() {
        if (!_zoomBar) {
            _zoomBar = new OpenLayers.Control.PanZoomBar();
        }
        _map.addControl(_zoomBar);
    };

    //隐藏导航控件
    e.prototype.hideNavigationControl = function() {
        _map.removeControl(_zoomBar);
        _zoomBar = null;
    };

    //添加鹰眼控件
    e.prototype.addOverviewControl = function() {
        if (!_overView)
            _overView = new OpenLayers.Control.OverViewMap();
        _map.addControl(_overView);
    };

    //移除鹰眼控件
    e.prototype.removeOverviewControl = function() {
        _map.removeControl(_overView);
    };

    //设置鹰眼框大小
    e.prototype.setOverViewSize = function(width, height) {
        if (_overView && _overView instanceof OpenLayers.Control.OverViewMap) {
            _overView.size.w = width;
            _overView.size.h = height;
        }
    };

    //显示鹰眼控件
    e.prototype.showOverviewControl = function() {
        if (_overView && _overView instanceof OpenLayers.Control.OverViewMap) {
            _overView.maximizeControl();
        }
    };

    //隐藏鹰眼控件
    e.prototype.hideOverviewControl = function() {
        if (_overView && _overView instanceof OpenLayers.Control.OverViewMap) {
            _overView.minimizeControl();
        }
    };

    //显示比例尺控件
    e.prototype.showScaleControl = function() {
        if (!_scale) {
            _scale = new OpenLayers.Control.Scale();
        }
        _map.addControl(_scale);
    };

    //隐藏比例尺控件
    e.prototype.hideScaleControl = function() {
        _map.removeControl(_scale);
        _scale = null;
    };

    //////////////////////////控件方法 结束//////////////////////


    //////////////////////////右键菜单方法 开始//////////////////////
    //添加右键菜单
    e.prototype.addContextMenu = function(menu) {

    };

    //移除右键菜单
    e.prototype.removeContextMenu = function(menu) {

    };
    //////////////////////////右键菜单方法 结束//////////////////////


    //////////////////////////覆盖物（叠加对象）方法 开始//////////////////////

    //将覆盖物添加到地图中，一个覆盖物实例只能向地图中添加一次
    e.prototype.addOverlay = function(overlay) {
        var o;
        var type = overlay.overlayType;
        switch (type) {
            case NPMapLib.OVERLAY_TYPE_POLYLINE:
                o = _createPolyline(overlay);
                break;
            case NPMapLib.OVERLAY_TYPE_POLYGON:
                o = _createPolygon(overlay);
                break;
            case NPMapLib.OVERLAY_TYPE_CIRCLE:
                o = _createLine(overlay);
                break;
            case NPMapLib.OVERLAY_TYPE_LABEL:
                o = _createLabel(overlay);
                break;
            case NPMapLib.OVERLAY_TYPE_MARKER:
                var mk = getMarker(overlay);
                o = getLabel(overlay.getLabel());
                o.markerObj = mk;
                _markersLayer.addMarker(mk);
                break;
            default:
                return;
        }
        overlay._apiObj = o;
        _featuresLayer.addFeature(o);
        NPMapLib.Managers.OverlayManager.addOverlay(overlay);
    };

    //将多个覆盖物添加到地图中
    e.prototype.addOverlays = function(overlays) {
        for (var i = 0; i < overlays.length; i++) {
            this.addOverlay(overlays[i]);
        };
    };
    //从地图中移除覆盖物。如果覆盖物从未被添加到地图中，则该移除不起任何作用
    e.prototype.removeOverlay = function(overlay) {
        if (overlay) {
            if (overlay._apiObj instanceof OpenLayers.Marker) {
                _markersLayer.removeMarker(overlay._apiObj.markerObj);
            }
            _featuresLayer.removeFeatures([overlay._apiObj]);
            NPMapLib.Managers.OverlayManager.removeOverlay(overlay.id);
        }
    };
    //从地图中移除覆盖物
    e.prototype.removeOverlays = function(overlays) {
        for (var i = 0; i < overlays.length; i++) {
            this.removeOverlay(overlays[i]);
        };
    };
    //返回地图上的所有覆盖物
    e.prototype.getOverlays = function() {
        return NPMapLib.Managers.OverlayManager.getAllOverlays();
    };
    //清除所有覆盖物
    e.prototype.clearOverlays = function() {
        _markersLayer.clearMarkers();
        _featuresLayer.removeAllFeatures();
        NPMapLib.Managers.OverlayManager.removeAllOverlays();
    };
    //显示覆盖物
    e.prototype.showOverlay = function(overlay) {
        if (!overlay || overlay._apiObj === null)
            return;
        overlay._apiObj.style.display = 'block';
        _featuresLayer.drawFeature(overlay._apiObj); //重绘
        if (overlay._apiObj.markerObj) {
            overlay._apiObj.markerObj.display(true);
        }
    };
    //隐藏覆盖物
    e.prototype.hideOverlay = function(overlay) {
        if (!overlay || overlay._apiObj === null)
            return;
        overlay._apiObj.style.display = 'none';
        _featuresLayer.drawFeature(overlay._apiObj);
        if (overlay._apiObj.markerObj) {
            overlay._apiObj.markerObj.display(false);
        }
    };
    e.prototype.setOverlayPosition = function(overlay, point) {

        if (!overlay || overlay._apiObj === null || overlay._apiObj.markObj == null) {
            return;
        }
        overlay._apiObj.markObj.moveTo(point);
    };

    //在地图上打开信息窗口
    e.prototype.openInfoWindow = function(infoWnd, point) {

    };

    //关闭在地图上打开的信息窗口
    e.prototype.closeInfoWindow = function() {

    };

    //返回地图上处于打开状态的信息窗的实例
    e.prototype.getInfoWindow = function() {

    };
    //////////////////////////覆盖物（叠加对象）方法 结束//////////////////////


    //--------------------图层方法  开始----------------------

    //增加图层
    e.prototype.addLayer = function(layer, isInit) {
        var myLayer = null;
        switch (OpenLayersClient.GlobeParams.MyMapType) {
            case NPMapLib.MAP_LAYER_TYPE_WMS:
                myLayer = this.WMSLayer(layer);
                break;
            case NPMapLib.MAP_LAYER_TYPE_VECTORGML:
                myLayer = this.VectorGMLLayer(layer);
                break;
            case NPMapLib.MAP_LAYER_TYPE_VECTORWFS:
                myLayer = this.VectorWFSLayer(layer);
                break;

        }
        if (null != myLayer){
            _map.addLayer(myLayer);
            if(layer.fullExtent)
                this.zoomToExtent(layer.fullExtent[0],layer.fullExtent[1],layer.fullExtent[2],layer.fullExtent[3]);
        }
            
    };
    //增加图层组
    e.prototype.addLayers = function(layers) {
        if (layers) {
            for (var i = 0; i < layers.length; ++i) {
                this.addLayer(layers[i], false);
            }
        }
    };
    //移除一个图层
    e.prototype.removeLayer = function(id) {
        var layer = _map.getLayer(id);
        if (layer) {
            _map.removeLayer(layer, false);
        }
    };
    //获取图层，根据图层id
    e.prototype.getLayer = function(id) {
        return _map.getLayer(id);
    };
    //创建一个WMS图层
    e.prototype.WMSLayer = function(layer) {
        var wmsLayer = new OpenLayers.Layer.WMS(
            layer.name,
            layer.url,
            {
                layers: layer.layerName,
                format: layer.format,
                tiled: layer.tiled,
                transparent: false
            },
            {
                tileSize: new OpenLayers.Size(layer.mapUnitPixels, layer.mapUnitPixels),
                projection: layer.projection,
                buffer: layer.buffer,
                reproject: layer.reproject,
                isBaseLayer: layer.isBaseLayer
            });
        return wmsLayer;
    };
    //创建一个vector图层-加载gml数据
    e.prototype.VectorGMLLayer = function(layer) {
        var vectorLayer = new OpenLayers.Layer.Vector(
            layer.name,
            {
                strategies: [new OpenLayers.Strategy.Fixed()],
                protocol: new OpenLayers.Protocol.HTTP({
                    url: layer.url,
                    format: new OpenLayers.Format.GML()
                })
            });
        return vectorLayer;
    };
    //创建Vector图层-加载WFS服务数据
    e.prototype.VectorWFSLayer = function(layer) {
        var vectorLayer = new OpenLayers.Layer.Vector(
            "WFS",
            {
                strategies: [new OpenLayers.Strategy.BBOX()],
                protocol: new OpenLayers.Protocol.WFS({
                    url: "http://demo.opengeo.org/geoserver/wfs",
                    featureType: "tasmania_roads",
                    featureNS: "http://www.openplans.org/topp"
                })
            });
        return vectorLayer;
    };
    //--------------------图层方法  结束----------------------

    /*--------------------坐标变换方法 开始-----------------------*/
    //像素坐标转换为经纬度坐标
    e.prototype.pixelToPoint = function(pixel) {
        var temp = _map.getLonLatFromPixex(new OpenLayers.Pixex(pixel.x, pixel.y));
        return new NPMapLib.Geometry.Point(temp.lon, temp.lat);
    };

    //经纬度坐标转换为像素坐标
    e.prototype.pointToPixel = function(point) {
        var temp = _map.getPixelFromLonLat(new OpenLayers.Lonlat(point.lon, point.lat));
        return new NPMapLib.Geometry.Pix(temp.x, temp.y);
    };

    /*---------------------------坐标变换方法 结束--------------------------*/

    /*-----------------------------工具------------------------------------*/
    //绘制
    e.prototype.drawing = function(mode, callBack) {
        var d = null;
        switch (mode) {
            case NPMapLib.DRAW_MODE_RECT:
                d = _drawControls["rect"];
                break;
            case NPMapLib.DRAW_MODE_CIRCLE:
                d = _drawControls["circle"];
                break;
            case NPMapLib.DRAW_MODE_POLYLINE:
                d = _drawControls["line"];
                break;
            case NPMapLib.DRAW_MODE_POLYLGON:
                d = _drawControls["polygon"];
                break;
            case NPMapLib.DRAW_MODE_NONE:
            default:
                break;
        }
        for (var t in _drawControls) {
            if (t == d) {
                t.activate();
            }
            else {
                t.deactivate();
            }
        }
    };
    //测量
    e.prototype.measure = function(obj, callBack) {
        var c = null;
        switch (obj.mode) {

            case NPMapLib.MEASURE_MODE_DISTANCE:
                c = new OpenLayers.Control.Measure(OpenLayers.Handler.Path, { displayUnits: "km", persist: true }); //obj.options);
                break;
            case NPMapLib.MEASURE_MODE_AREA:
                // = measureControls["polygon"];
                c = new OpenLayers.Control.Measure(OpenLayers.Handler.Polygon, { displayUnits: "km", persist: true });
                break;
            case NPMapLib.MEASURE_MODE_LOCATION:
                c = new OpenLayers.Control.Measure(OpenLayers.Handler.Point, {});
                break;
        }
        if (c) {
            c.event.on("measure" = function(event) {
                var unit = event.Units;
                var t = event.measure;
                var result = t.toString() + unit.toString();
                window.alert(result);
            })
        }
    };


    //创建多段线
    e.prototype._createPolyline = function(polyline) {
        if (!(polyline instanceof NPMapLib.Geometry.Polyline))
            return;

        var points = polyline.getPath();
        if (!points || points.length <= 0)
            return;

        var l = new OpenLayers.Geometry.LineString(_castPoints(points));
        var f = new OpenLayers.Feature.Vector(l, {},
        {
            strokeColor: polyline.getColor(),
            strokeWidth: polyline.getWeight(),
            strokeOpacity: polyline.getOpacity()
            // polyline.getArrowStyle());
        });
        return f;
    };

    //创建多边形
    e.prototype._createPolygon = function(polygon) {
        if (!(polygon instanceof NPMapLib.Geometry.Polygon))
            return;

        var points = polygon.getPath();
        if (!points || points.length <= 0)
            return;
        var lr = new OpenLayers.Geometry.LinearRing(_castPoints(points));
        var pg = new OpenLayers.Geometry.Polygon(lr);
        var f = new OpenLayers.Feature.Vector(pg, {}, {
            fill: true,
            fillColor: polygon.getFillColor(),
            strokeColor: polygon.getColor(),
            strokeWidth: polygon.getWeight(),
            strokeOpacity: polygon.getFillOpacity()
        });
        return f;
    };

    //创建圆形
    e.prototype._createCircle = function(circle) {
        if (!(circle instanceof NPMapLib.Geometry.Circle))
            return;

        var center = circle.getCenter();
        var radius = circle.getRadius();
        if (!center || !radius)
            return;
        var c = new OpenLayers.Geometry.Point(center.lon, center.lat);
        var f = new OpenLayers.Feature.Vector(c, {}, {
            fill: true,
            fillColor: circle.getFillColor(),
            fillOpacity: circle.getFillOpacity(),

            strokeWidth: circle.getWeight(),
            strokeColor: circle.getColor(),
            pointRadius: circle.getRadius()
        });
    };

    e.prototype._createMarker = function(marker) {
        var result;

        var s_icon = marker.getIcon();
        if (s_icon) return;
        var pt = marker.getPosition();
        var size = new OpenLayers.Size(icon.getImageSize().width, icon.getImageSize().height);
        var offset = new OpenLayers.Pix(-(size.w / 2), -size.h);
        var d_Iron = new OpenLayers.Icon(s_icon.getImageUrl(), size, offset);
        var result = new OpenLayers.Marker(new OpenLayers.LonLat(pt.lon, pt.lat), d_Iron);

        return result;
    };
    e.prototype._createLabel = function(label) {
        if (!label) return;
        var ls = label.getStyle();
        var d_style = {
            label: ls.getContent(),
            fontSize: ls.fontSize,
            fontFamily: ls.fontFamily,
            fontWeight: ls.isBold ? 'bold' : 'normal',
            labelXOffset: ls.getOffset().width,
            labelYOffset: ls.getOffset().height,
            labelAlign: 'm',
            fillColor: "#212122"
        };
        var pt = label.getPosition();
        var f = new OpenLayers.Feature.Vector(new OpenLayers.LonLat(pt.lon, pt.lat), {}, d_style);
        return f;
    };
    e.prototype._castPoint = function(point) {
        return new OpenLayers.Geometry.Point(point.lon, point.lat);
    };
    e.prototype._castPoints = function(points) {
        if (!points) {
            return [];
        }
        var result = [];
        for (var i = 0; i < points.length; ++i) {
            result.push(_castPoint(points[i]));
        }
        return result;
    };


    //////////////////////////事件 开始//////////////////////
    //添加事件监听函数
    e.prototype.addEventListener = function(obj, type, handler) {
        //    if (!_isInit)
        //        return;

        if (!obj || obj === null || !((obj instanceof NPMapLib.Map) ||
			(obj instanceof NPMapLib.Symbols.Marker) ||
			(obj instanceof NPMapLib.Symbols.Label) ||
			(obj instanceof NPMapLib.Geometry.Polyline) ||
			(obj instanceof NPMapLib.Geometry.Polygon) ||
			(obj instanceof NPMapLib.Geometry.Circle)))
            return;

        var key = event + "_" + obj.id;
        if (_events[key])
            return;

        _events[key] = key;
        if (obj instanceof NPMapLib.Map) {
            switch (event) {

                case NPMapLib.MAP_EVENT_CLICK:
                    _map.event.register('click', this, function(e) {
                        handler(new NPMapLib.Geometry.Point(e.x, e.y));
                    });
                    break;
                case NPMapLib.MAP_EVENT_DBLCLICK:
                    _map.event.register('dblclick', this, function(e) {
                        handler(new NPMapLib.Geometry.Point(e.x, e.y));
                    });
                    break;
                case NPMapLib.MAP_EVENT_RIGHT_CLICK:
                    _map.event.register('rightclick', this, function(e) {
                        handler(new NPMapLib.Geometry.Point(e.x, e.y));
                    });
                    break;
                case NPMapLib.MAP_EVENT_ZOOM_START:
                    _map.events.register('zoomstart', this, function(e) {//
                        handler();
                    });
                case NPMapLib.MAP_EVENT_ZOOM_END:
                    _map.events.register('zoomend', this, function(e) {
                        handler(e.zoom);
                    });
                    break;
                case NPMapLib.MAP_EVENT_MOUSE_MOVE:
                    _map.events.register('mousemove', this, function(e) {
                    });
                    break;
                case NPMapLib.MAP_EVENT_MOUSE_OVER:
                    _map.event.register('mouseover', this, function(e) {
                    });
                    break;
                case NPMapLib.MAP_EVENT_MOUSE_OUT:
                    _map.event.register('mouseout', this, function(e) {
                    });
                    break;
            }
        }
        else if (obj instanceof NPMapLib.Symbols.Marker) {
            switch (event) {
                case NPMapLib.MARKER_EVENT_CLICK:
                    obj._apiObj.markerObj.events.register('click', function() {
                        var pos = obj.getPosition();
                        handler(new NPMapLib.Geometry.Point(pos.lon, pos.lat));
                    });
                    break;
                case NPMapLib.MARKER_EVENT_DBLCLICK:
                    obj._apiObj.markerObj.events.register('dblclick', function() {
                        var pos = obj.getPosition();
                        handler(new NPMapLib.Geometry.Point(pos.lon, pos.lat));
                    });
                    break;
                case NPMapLib.MARKER_EVENT_RIGHT_CLICK:
                    obj._apiObj.markerObj.events.register('mouseup', function() {
                        if (window.event.button === 2) {
                            var pos = obj.getPosition();
                            handler(new NPMapLib.Geometry.Point(pos.lon, pos.lat));
                        }
                    });
                    break;
                case NPMapLib.MARKER_EVENT_MOUSE_DOWN:
                    obj._apiObj.markerObj.events.register('mousedown', function() {
                        var pos = obj.getPosition();
                        handler(new NPMapLib.Geometry.Point(pos.lon, pos.lat));
                    });
                    break;
                case NPMapLib.MARKER_EVENT_MOUSE_UP:
                    obj._apiObj.markerObj.events.register('mouseup', function() {
                        var pos = obj.getPosition();
                        handler(new NPMapLib.Geometry.Point(pos.lon, pos.lat));
                    });
                    break;
                case NPMapLib.MARKER_EVENT_MOUSE_OVER:
                    obj._apiObj.markerObj.events.register('mouseover', function() {
                        var pos = obj.getPosition();
                        handler(new NPMapLib.Geometry.Point(pos.lon, pos.lat));
                    });
                    break;
                case NPMapLib.MARKER_EVENT_MOUSE_OUT:
                    obj._apiObj.markerObj.events.register('mouseout', function() {
                        var pos = obj.getPosition();
                        handler(new NPMapLib.Geometry.Point(pos.lon, pos.lat));
                    });
                    break;
                case NPMapLib.MARKER_EVENT_DRAG_START:

                    break;
                case NPMapLib.MARKER_EVENT_DRAG_END:

                    break;
            }

        }
        else if (obj instanceof NPMapLib.Symbols.Label) {
            switch (event) {
                case NPMapLib.LABEL_EVENT_CLICK:
                    obj._apiObj.layer.events.register('click', function() {
                        var pos = obj.getPosition();
                        handler(new NPMapLib.Geometry.Point(pos.lon, pos.lat));
                    });
                    break;
                case NPMapLib.LABEL_EVENT_DBLCLICK:
                    obj._apiObj.layer.events.register('dblclick', function() {
                        var pos = obj.getPosition();
                        handler(new NPMapLib.Geometry.Point(pos.lon, pos.lat));
                    });
                    break;
                case NPMapLib.LABEL_EVENT_RIGHT_CLICK:
                    obj._apiObj.layer.events.register('mouseup', function() {
                        if (window.event.button === 2) {
                            var pos = obj.getPosition();
                            handler(new NPMapLib.Geometry.Point(pos.lon, pos.lat));
                        }
                    });
                    break;
                case NPMapLib.LABEL_EVENT_MOUSE_DOWN:
                    obj._apiObj.layer.events.register('mousedown', function() {
                        var pos = obj.getPosition();
                        handler(new NPMapLib.Geometry.Point(pos.lon, pos.lat));
                    });
                    break;
                case NPMapLib.LABEL_EVENT_MOUSE_UP:
                    obj._apiObj.layer.events.register('mouseup', function() {
                        var pos = obj.getPosition();
                        handler(new NPMapLib.Geometry.Point(pos.lon, pos.lat));
                    });
                    break;
                case NPMapLib.LABEL_EVENT_MOUSE_OVER:
                    obj._apiObj.layer.events.register('mouseover', function() {
                        var pos = obj.getPosition();
                        handler(new NPMapLib.Geometry.Point(pos.lon, pos.lat));
                    });
                    break;
                case NPMapLib.LABEL_EVENT_MOUSE_OUT:
                    obj._apiObj.layer.events.register('mouseout', function() {
                        var pos = obj.getPosition();
                        handler(new NPMapLib.Geometry.Point(pos.lon, pos.lat));
                    });
                    break;
                case NPMapLib.LABEL_EVENT_DRAG_START:

                    break;
                case NPMapLib.LABEL_EVENT_DRAG_END:

                    break;
            }
        }
        else if (obj instanceof NPMapLib.Geometry.Polyline) {
            switch (event) {
                case NPMapLib.POLYLINE_EVENT_CLICK:
                    obj._apiObj.layer.events.register('click', function(e) {
                        var pixel = new NPMapLib.Geometry.Pixel(e.x, e.y);
                        handler(this.pixelToPoint(pixel));
                    });
                    break;
                case NPMapLib.POLYLINE_EVENT_DBLCLICK:
                    obj._apiObj.layer.events.register('dblclick', function(e) {
                        var pixel = new NPMapLib.Geometry.Pixel(e.x, e.y);
                        handler(this.pixelToPoint(pixel));
                    });
                    break;
                case NPMapLib.POLYLINE_EVENT_RIGHT_CLICK:
                    obj._apiObj.layer.events.register('mouseup', function(e) {
                        if (window.event.button === 2) {
                            var pixel = new NPMapLib.Geometry.Pixel(e.x, e.y);
                            handler(this.pixelToPoint(pixel));
                        }
                    });
                    break;
                case NPMapLib.POLYLINE_EVENT_MOUSE_DOWN:
                    obj._apiObj.layer.events.register('mousedown', function(e) {
                        var pixel = new NPMapLib.Geometry.Pixel(e.x, e.y);
                        handler(this.pixelToPoint(pixel));
                    });
                    break;
                case NPMapLib.POLYLINE_EVENT_MOUSE_UP:
                    obj._apiObj.layer.events.register('mouseup', function(e) {
                        var pixel = new NPMapLib.Geometry.Pixel(e.x, e.y);
                        handler(this.pixelToPoint(pixel));
                    });
                    break;
                case NPMapLib.POLYLINE_EVENT_MOUSE_OVER:
                    obj._apiObj.layer.events.register('mouseover', function(e) {
                        var pixel = new NPMapLib.Geometry.Pixel(e.x, e.y);
                        handler(this.pixelToPoint(pixel));
                    });
                    break;
                case NPMapLib.POLYLINE_EVENT_MOUSE_OUT:
                    obj._apiObj.layer.events.register('mouseout', function(e) {
                        var pixel = new NPMapLib.Geometry.Pixel(e.x, e.y);
                        handler(this.pixelToPoint(pixel));
                    });
                    break;
                case NPMapLib.POLYLINE_EVENT_LINE_UPDATE:

                    break;
            }
        } else if (obj instanceof NPMapLib.Geometry.Polygon) {
            switch (event) {
                case NPMapLib.POLYGON_EVENT_CLICK:
                    obj._apiObj.layer.events.register('click', function(e) {
                        var pixel = new NPMapLib.Geometry.Pixel(e.x, e.y);
                        handler(this.pixelToPoint(pixel));
                    });
                    break;
                case NPMapLib.POLYGON_EVENT_DBLCLICK:
                    obj._apiObj.layer.events.register('dblclick', function(e) {
                        var pixel = new NPMapLib.Geometry.Pixel(e.x, e.y);
                        handler(this.pixelToPoint(pixel));
                    });
                    break;
                case NPMapLib.POLYGON_EVENT_RIGHT_CLICK:
                    obj._apiObj.layer.events.register('mouseup', function(e) {
                        if (window.event.button === 2) {
                            var pixel = new NPMapLib.Geometry.Pixel(e.x, e.y);
                            handler(this.pixelToPoint(pixel));
                        }
                    });
                    break;
                case NPMapLib.POLYGON_EVENT_MOUSE_DOWN:
                    obj._apiObj.layer.events.register('mousedown', function(e) {
                        var pixel = new NPMapLib.Geometry.Pixel(e.x, e.y);
                        handler(this.pixelToPoint(pixel));
                    });
                    break;
                case NPMapLib.POLYGON_EVENT_MOUSE_UP:
                    obj._apiObj.layer.events.register('mouseup', function(e) {
                        var pixel = new NPMapLib.Geometry.Pixel(e.x, e.y);
                        handler(this.pixelToPoint(pixel));
                    });
                    break;
                case NPMapLib.POLYGON_EVENT_MOUSE_OVER:
                    obj._apiObj.layer.events.register('mouseover', function(e) {
                        var pixel = new NPMapLib.Geometry.Pixel(e.x, e.y);
                        handler(this.pixelToPoint(pixel));
                    });
                    break;
                case NPMapLib.POLYGON_EVENT_MOUSE_OUT:
                    obj._apiObj.layer.events.register('mouseout', function(e) {
                        var pixel = new NPMapLib.Geometry.Pixel(e.x, e.y);
                        handler(this.pixelToPoint(pixel));
                    });
                    break;
                case NPMapLib.POLYGON_EVENT_LINE_UPDATE:

                    break;
            }
        }
        else if (obj instanceof NPMapLib.Geometry.Circle) {
            switch (event) {
                case NPMapLib.CIRCLE_EVENT_CLICK:
                    obj._apiObj.layer.events.register('click', function() {
                        var pixel = new NPMapLib.Geometry.Pixel(e.x, e.y);
                        handler(this.pixelToPoint(pixel));
                    });
                    break;
                case NPMapLib.CIRCLE_EVENT_DBLCLICK:
                    obj._apiObj.layer.events.register('dblclick', function() {
                        var pixel = new NPMapLib.Geometry.Pixel(e.x, e.y);
                        handler(this.pixelToPoint(pixel));
                    });
                    break;
                case NPMapLib.CIRCLE_EVENT_RIGHT_CLICK:
                    obj._apiObj.layer.events.register('mouseup', function() {
                        if (window.event.button === 2) {
                            var pixel = new NPMapLib.Geometry.Pixel(e.x, e.y);
                            handler(this.pixelToPoint(pixel));
                        }
                    });
                    break;
                case NPMapLib.CIRCLE_EVENT_MOUSE_DOWN:
                    obj._apiObj.layer.events.register('mousedown', function() {
                        var pixel = new NPMapLib.Geometry.Pixel(e.x, e.y);
                        handler(this.pixelToPoint(pixel));
                    });
                    break;
                case NPMapLib.CIRCLE_EVENT_MOUSE_UP:
                    obj._apiObj.layer.events.register('mouseup', function() {
                        var pixel = new NPMapLib.Geometry.Pixel(e.x, e.y);
                        handler(this.pixelToPoint(pixel));
                    });
                    break;
                case NPMapLib.CIRCLE_EVENT_MOUSE_OVER:
                    obj._apiObj.layer.events.register('mouseover', function() {
                        var pixel = new NPMapLib.Geometry.Pixel(e.x, e.y);
                        handler(this.pixelToPoint(pixel));
                    });
                    break;
                case NPMapLib.CIRCLE_EVENT_MOUSE_OUT:
                    obj._apiObj.layer.events.register('mouseout', function() {
                        var pixel = new NPMapLib.Geometry.Pixel(e.x, e.y);
                        handler(this.pixelToPoint(pixel));
                    });
                    break;
                case NPMapLib.CIRCLE_EVENT_LINE_UPDATE:

                    break;
            }
        }
    };
    //移除事件监听函数
    e.prototype.removeEventListener = function(obj, event, handler) {

        if (!obj || obj === null || !((obj instanceof NPMapLib.Map) ||
			(obj instanceof NPMapLib.Symbols.Marker) ||
			(obj instanceof NPMapLib.Symbols.Label) ||
			(obj instanceof NPMapLib.Geometry.Polyline) ||
			(obj instanceof NPMapLib.Geometry.Polygon) ||
			(obj instanceof NPMapLib.Geometry.Circle)))
            return;

        var key = event + "_" + obj.id;
        var type;
        switch (event) {
            case NPMapLib.MAP_EVENT_ZOOM_START:
                type = 'zoomstart';
            case NPMapLib.MAP_EVENT_ZOOM_END:
                type = 'zoomend';
                break;
            case NPMapLib.MAP_EVENT_MOUSE_MOVE:
                type = 'mousemove';
                break;
            case NPMapLib.MAP_EVENT_MOUSE_OVER:
                type = 'mouseover';
                break;
            case NPMapLib.MAP_EVENT_MOUSE_OUT:
                type = 'mouseout';
                break;
        }
        if (obj instanceof NPMapLib.Map) {
            _map.events.unregister(type, this, handler);
        }
        else if (obj instanceof NPMapLib.Symbols.Marker) {
            obj._apiObj.markerObj.events.unregister(type, this, handler);
        }
        else if ((obj instanceof NPMapLib.Symbols.Label) ||
			(obj instanceof NPMapLib.Geometry.Polyline) ||
			(obj instanceof NPMapLib.Geometry.Polygon) ||
			(obj instanceof NPMapLib.Geometry.Circle)) {
            obj._apiObj.events.unregister(type, this, handler);
        }

        if (_events[key])
            delete _events[key];
    };
    //////////////////////////事件 结束//////////////////////
})();
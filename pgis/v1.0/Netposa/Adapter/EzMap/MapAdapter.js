NPNamespace.register("NPMapLib.Adapter.EzMap");

/*!
* 地图适配器－－与地图相关的操作接口
*/
(function() {
    var _container;
    var _map;
    var _overview = null;
    var _isInit = false;
    var _events = {};
    var e = NPMapLib.Adapter.EzMap.MapAdapter = function(container, opts) {
        _container = container;
        _map = null;
        this._initialize();
    };

    //初始化
    e.prototype._initialize = function() {
        try {
            _map = new EzMap(_container);
            if (typeof (eval(_map.initialize)) == "function")
                _map.initialize();

            _isInit = true;
            //隐藏地图服务切换控件
            _map.hideMapServer();
            //隐藏比例尺控件
            _map.hideMapScale();
            //隐藏版权信息
            _map.hideCopyright();
            //全图
            _map.fullExtent();
        } catch (e) {

        }
    };

    ////////////////////////////////工具部分 开始
    //测量
    e.prototype.measure = function(measureTool) {
        if (!_isInit)
            return;

        var mode = measureTool.getMode();
        switch (mode) {
            case NPMapLib.MEASURE_MODE_DISTANCE:
                _map.measureLength(function(len) {
                    window.alert(len);
                    this.pan();
                } .bind(this));
                break;
            case NPMapLib.MEASURE_MODE_AREA:
                _map.measureArea(function(area) {
                    window.alert(area);
                    this.pan();
                } .bind(this));
                break;
            case NPMapLib.MEASURE_MODE_LOCATION:

                break;
        }
    };

    //几何图形绘制
    e.prototype.drawing = function(drawingTool, callback) {
        if (!_isInit)
            return;

        var mode = drawingTool.getMode();
        var drawMode = 'none';
        switch (mode) {
            case NPMapLib.DRAW_MODE_NONE:
                drawMode = 'none';
                break;
            case NPMapLib.DRAW_MODE_RECT:
                drawMode = 'drawRect';
                break;
            case NPMapLib.DRAW_MODE_CIRCLE:
                drawMode = 'drawCircle';
                break;
            case NPMapLib.DRAW_MODE_POLYLINE:
                drawMode = 'drawPolyline';
                break;
            case NPMapLib.DRAW_MODE_POLYLGON:
                drawMode = 'drawPolygon';
                break;
        }
        this._actionDragMode(drawMode, callback);
    };

    //启动测量、平移和绘制操作[私有方法]
    e.prototype._actionDragMode = function(mode, callback) {
        if (!_isInit)
            return;

        if (mode === 'pan') {
            _map.changeDragMode(mode);
            this._setMouseCursor('default');
        } else {
            if (!callback)
                callback = function() { };
            _map.changeDragMode(mode, null, null, callback);
        }
    },

    //设置鼠标指针
	e.prototype._setMouseCursor = function(cursor) {
	    if (!_isInit)
	        return;
	    _map.getMapContainer().style.cursor = cursor;
	},

    ////////////////////////////////工具部分 结束

    //////////////////////////配置方法 开始//////////////////////////
    //启用滚轮放大缩小，默认启用
	e.prototype.enableScrollWheelZoom = function() {
	    if (!_isInit)
	        return;
	    _map.enableMouseScroll();
	};

    //禁用滚轮放大缩小
    e.prototype.disableScrollWheelZoom = function() {
        if (!_isInit)
            return;
        _map.disableMouseScroll();
    };

    //启用双击放大，默认启用
    e.prototype.enableDoubleClickZoom = function() {
        if (!_isInit)
            return;
        _map.enableDblClickZoom();
    };

    //禁用双击放大
    e.prototype.disableDoubleClickZoom = function() {
        if (!_isInit)
            return;
        _map.disableDblClickZoom();
    };

    //启用键盘操作[只适用于IE]
    e.prototype.enableKeyboard = function() {
        if (!_isInit)
            return;
        _map.enableKeyboard();
    };

    //禁用键盘操作
    e.prototype.disableKeyboard = function() {
        if (!_isInit)
            return;
        _map.disableKeyboard();
    };

    //启用地图惯性拖拽，默认禁用[未实现]
    e.prototype.enableInertialDragging = function() {
        if (!_isInit)
            return;
        _map.enableSlipPan(2);
    };

    //禁用地图惯性拖拽[只适用于IE]
    e.prototype.disableInertialDragging = function() {
        if (!_isInit)
            return;
        _map.disableSlipPan();
    };

    //设置地图默认的样式
    e.prototype.setCursor = function(cursor) {
        this._setMouseCursor(cursor);
    };

    //返回地图默认的样式
    e.prototype.getCursor = function() {
        return _map.getMapContainer().style.cursor;
    };

    //设置地图允许的最小级别。取值不得小于地图类型所允许的最小级别
    e.prototype.setMinZoom = function(zoom) {
        // if(NPMapLib.Utils.BaseUtils.isTypeRight(zoom, "int"))
        // 	EzServerClient.GlobeParams.MapInitLevel = zoom;
    };

    //设置地图允许的最大级别。取值不得大于地图类型所允许的最大级别
    e.prototype.setMaxZoom = function(zoom) {
        // if(NPMapLib.Utils.BaseUtils.isTypeRight(zoom, "int"))
        // 	EzServerClient.GlobeParams.MapMaxLevel = zoom;
    };
    //////////////////////////配置方法 结束//////////////////////////


    //////////////////////////地图状态方法 开始//////////////////////
    //返回地图可视区域，以地理坐标表示
    e.prototype.getExtent = function() {
        if (!_isInit)
            return;

        var result = _map.getBoundsLatLng();
        if (!result)
            return;
        return new NPMapLib.Geometry.Extent(result.minX, result.minY, result.maxX, result.maxY);
    };

    //返回地图当前中心点
    e.prototype.getCenter = function() {
        if (!_isInit)
            return;
        var result = _map.getCenterLatLng();
        if (!result)
            return;

        return new NPMapLib.Geometry.Point(result.x, result.y);
    };

    //返回两点之间的距离，单位是米
    e.prototype.getDistance = function(start, end) {
        var pt1 = start;
        var pt2 = end;
        return Math.sqrt(Math.pow(pt1.x - pt2.x, 2) + Math.pow(pt1.y - pt2.y, 2));
    };

    //返回地图视图的大小，以像素表示
    e.prototype.getSize = function() {

    };

    //返回地图当前缩放级别
    e.prototype.getZoom = function() {
        if (!_isInit)
            return;

        return _map.getZoomLevel();
    };
    //////////////////////////地图状态方法 结束//////////////////////

    //////////////////////////修改地图状态方法 开始//////////////////////
    //地图根据指定的点和级别进行对中
    e.prototype.centerAndZoom = function(center, zoom) {
        if (!_isInit || !NPMapLib.Utils.BaseUtils.isTypeRight(center, "NPMapLib.Geometry.Point") ||
			!NPMapLib.Utils.BaseUtils.isTypeRight(zoom, "int"))
            return;

        _map.centerAndZoom(new Point(center.lon, center.lat), zoom);
    };

    //平移
    e.prototype.pan = function() {
        if (!_isInit)
            return;

        this._actionDragMode('pan');
    };

    //将地图的中心点更改为给定的点
    e.prototype.panTo = function(center) {
        if (!_isInit || !NPMapLib.Utils.BaseUtils.isTypeRight(center, "NPMapLib.Geometry.Point"))
            return;

        this.map.centerAtLatLng(new Point(center.lon, center.lat));
    };

    //将地图在水平位置上移动x像素，垂直位置上移动y像素
    e.prototype.panByPixel = function(x, y) {
        if (!_isInit)
            return;

        this.map.pan(x, y);
    };

    //重新设置地图，恢复地图初始化时的中心点和级别
    e.prototype.reset = function() {
        if (!_isInit)
            return;

    };

    //设置地图中心点
    e.prototype.setCenter = function(center) {
        if (!_isInit)
            return;

    };

    //切换图层
    e.prototype.switchLayer = function(index) {
        if (!_isInit || !NPMapLib.Utils.BaseUtils.isTypeRight(index, "int"))
            return;

        _map.switchMapServer(index);
    };

    //将视图切换到指定的缩放等级，中心点坐标不变
    e.prototype.setZoom = function(zoom) {
        if (!_isInit || !NPMapLib.Utils.BaseUtils.isTypeRight(zoom, "int"))
            return;

        _map.zoomTo(zoom);
    };

    //全图
    e.prototype.fullExtent = function() {
        if (!_isInit)
            return;
        _map.fullExtent();
    };

    //拉框放大
    e.prototype.zoomIn = function() {
        if (!_isInit)
            return;

        _map.zoomInExt();
        this._setMouseCursor('crosshair');
    };

    //拉框缩小
    e.prototype.zoomOut = function() {
        if (!_isInit)
            return;

        _map.zoomOutExt();
        this._setMouseCursor('crosshair');
    };

    //固定放大一个级别
    e.prototype.zoomInFixed = function() {
        if (!_isInit)
            return;

        _map.zoomIn();
    };

    //固定缩小一个级别
    e.prototype.zoomOutFixed = function() {
        _map.zoomOut();
    };
    //////////////////////////修改地图状态方法 结束//////////////////////

    //显示版权控件
    e.prototype.showCopyRightControl = function() {
        if (!_isInit)
            return;
        _map.showCopyright();
    };

    //隐藏版权控件
    e.prototype.hideCopyRightControl = function() {
        if (!_isInit)
            return;
        _map.hideCopyright();
    };

    //设置版权信息
    e.prototype.setCopyRight = function(copyRight) {
        if (!_isInit)
            return;

        EzServerClient.GlobeParams.Copyright = "&copy; " + copyRight;
        _map.setCopyright(EzServerClient.GlobeParams.Copyright);
    };

    //显示导航控件
    e.prototype.showNavigationControl = function() {
        if (!_isInit)
            return;
        _map.showStandMapControl();
    };

    //隐藏导航控件
    e.prototype.hideNavigationControl = function() {
        if (!_isInit)
            return;
        _map.hideMapControl();
    };

    //添加鹰眼控件
    e.prototype.addOverviewControl = function() {
        if (!_isInit)
            return;

        if (_overview !== null)
            return;
        _overview = new OverView();
        _map.addOverView(_overview);
        _map.showOverView();
        _overview.width = 200;
        _overview.height = 200;
    };

    //添加鹰眼控件
    e.prototype.removeOverviewControl = function() {
        if (!_isInit)
            return;

        if (_overview === null)
            return;
        _map.removeOverview();
        _overview = null;
    };

    //设置鹰眼框大小
    e.prototype.setOverViewSize = function(width, height) {
        if (!_overview)
            return;

        _overview.width = width;
        _overview.height = height;
    };

    //显示鹰眼控件
    e.prototype.showOverviewControl = function() {
        if (!_isInit)
            return;
        _map.showOverView();
    };

    //隐藏鹰眼控件
    e.prototype.hideOverviewControl = function() {
        if (!_isInit)
            return;
        _map.hideOverView();
    };

    //显示比例尺控件
    e.prototype.showScaleControl = function() {
        if (!_isInit)
            return;
        _map.showMapScale();
    };

    //隐藏比例尺控件
    e.prototype.hideScaleControl = function() {
        if (!_isInit)
            return;
        _map.hideMapScale();
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
        if (!_isInit || !overlay)
            return;

        var o;
        var type = overlay.overlayType;
        switch (type) {
            case NPMapLib.OVERLAY_TYPE_POLYLINE:
                o = this._createPolyline(overlay);
                break;
            case NPMapLib.OVERLAY_TYPE_POLYGON:
                o = this._createPolygon(overlay);
                break;
            case NPMapLib.OVERLAY_TYPE_CIRCLE:
                o = this._createCircle(overlay);
                break;
            case NPMapLib.OVERLAY_TYPE_LABEL:
                o = this._createLabel(overlay);
                break;
            case NPMapLib.OVERLAY_TYPE_MARKER:
                o = this._createMarker(overlay);
                break;
            case NPMapLib.OVERLAY_TYPE_INFOWIN:
                o = this._createInfoWin(overlay);
                break;
            default:
                return;
        }

          if (o) {
            var id = NPMapLib.Managers.OverlayManager.GetNextId();
            overlay.id = id;
            o.setDivId(id);
            _map.addOverlay(o);
            overlay._apiObj = o;
            overlay.setContainer(_container);
            NPMapLib.Managers.OverlayManager.addOverlay(overlay);
         }
    };

    //将多个覆盖物添加到地图中
    e.prototype.addOverlays = function(overlays) {
        for (var i = 0; i < overlays.length; i++) {
            this.addOverlay(overlays[i]);
        };
    };

    //从地图中移除覆盖物。如果覆盖物从未被添加到地图中，则该移除不起任何作用
    e.prototype.removeOverlay = function(overlay) {
        if (!_isInit || !NPMapLib.Utils.BaseUtils.isTypeRight(overlay, "NPMapLib.Overlay"))
            return;

        _map.removeOverlay(overlay._apiObj);
        NPMapLib.Managers.OverlayManager.removeOverlay(overlay.id);
    };

    //从地图中移除覆盖物。如果覆盖物从未被添加到地图中，则该移除不起任何作用
    e.prototype.removeOverlays = function(overlays) {
        if (!_isInit || !NPMapLib.Utils.BaseUtils.isTypeRight(overlays, "Array"))
            return;

        for (var i = 0; i < overlays.length; i++) {
            this.removeOverlay(overlays[i]);
        };
    };

    //显示覆盖物
    e.prototype.showOverlay = function(overlay) {
        if (!overlay || overlay._apiObj === null)
            return;
        overlay._apiObj.show();
    };

    //隐藏覆盖物
    e.prototype.hideOverlay = function(overlay) {
        if (!overlay || overlay._apiObj === null)
            return;
        overlay._apiObj.hide();
    };

    //闪烁
    e.prototype.falshOverlay = function(overlay, times) {
        if (!overlay || overlay._apiObj === null)
            return;
        if (!times)
            overlay._apiObj.flash();
        else
            overlay._apiObj.flash2(times);
    };
    //更换图标
    e.prototype.resetIcon = function(overlay, icon) {
        if (!overlay || overlay._apiObj === null)
            return;
        if (icon)
            overlay._apiObj.resetIcon(icon);
    }
    //获取覆盖物的范围
    e.prototype.getOverlayExtent = function(overlay) {
        if (!overlay || overlay._apiObj === null)
            return;

        var mbr = overlay._apiObj.getMBR();
        return new NPMapLib.Geometry.Extent(mbr.minX, mbr.minY, mbr.maxX, mbr.maxY);
    };

    //获取当前对象在图层中的叠加次序
    e.prototype.getOverlayZIndex = function(overlay) {
        if (!overlay || overlay._apiObj === null)
            return;

        return overlay._apiObj.getZIndex();
    };

    //设置当前对象在图层中的叠加次序
    e.prototype.setOverlayZIndex = function(overlay, zIndex) {
        if (!overlay || overlay._apiObj === null)
            return;

        overlay._apiObj.setZIndex(zIndex);
    };

    //设置覆盖物的位置
    e.prototype.setOverlayPosition = function(overlay, position) {
        if (!NPMapLib.Utils.BaseUtils.isTypeRight(overlay, "NPMapLib.Overlay") ||
			overlay._apiObj === null ||
			!NPMapLib.Utils.BaseUtils.isTypeRight(position, "NPMapLib.Geometry.Point"))
            return;

        var pt = new Point(position.lon, position.lat);
        overlay._apiObj.setPoint(pt);
    };

    //覆盖物旋转
    e.prototype.rotateOverlay = function(overlay, angle) {
        if (EzServerClient.GlobeParams.VML) {
            angle = (angle + 90) * Math.PI / 180;
            var Cos = Math.sin(angle),
            Sin = Math.cos(angle);
            overlay._apiObj.div.childNodes[0].style.filter = "progid:DXImageTransform.Microsoft.Matrix(M11=" + Cos + ",M12=" + (-Sin) + ",M21=" + Sin + ",M22=" + Cos + ",SizingMethod='auto expand')";
        } else {
            angle = -angle;
            overlay._apiObj.div.childNodes[0].style.cssText = "-moz-transform:rotate(" + angle + "deg); -webkit-transform:rotate(" + angle + "deg); transform:rotate(" + angle + "deg);";
        }
    };

    //显示marker名称
    e.prototype.showMarkerLabel = function(marker) {
        if (!marker || marker._apiObj === null)
            return;
        marker._apiObj.div.childNodes[1].style.display = "";
    };

    //隐藏marker名称
    e.prototype.hideMarkerLabel = function(marker) {
        if (!marker || marker._apiObj === null)
            return;
        marker._apiObj.div.childNodes[1].style.display = "none";
    };

    //返回地图上的所有覆盖物
    e.prototype.getOverlays = function() {
        return NPMapLib.Managers.OverlayManager.getAllOverlays();
    };
    //根据ID获取覆盖物
    e.prototype.getOverlayById = function(id) {
         var overlays = this.getOverlays();
         return overlays[id];
    }
    //清除地图上所有覆盖物
    e.prototype.clearOverlays = function() {
        var _overlays = this.getOverlays();
        for (var key in _overlays) {
            this.removeOverlay(_overlays[key]);
        }

        NPMapLib.Managers.OverlayManager.removeAllOverlays();
        _map.clear();
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


     // 修改位置
    e.prototype.changePosition = function (overlay,point) { 
       this.setOverlayPosition(overlay,point);
    };
    // 修改大小
    e.prototype.changeSize = function (overlay,point) {
       
    };
    // 修改颜色
    e.prototype.changeColor = function (overlay,color) {
        if (!overlay || overlay._apiObj === null)
            return;
        overlay._apiObj.div.childNodes[1].style.color = color;
    };
    // 修改字体
    e.prototype.changeFontFamily = function (overlay,fontfamily) {
         if (!overlay || overlay._apiObj === null)
            return;
         overlay._apiObj.div.childNodes[1].style.fontFamily  = fontfamily;
    };
    // 修改字体大小
    e.prototype.changeFontSize = function (overlay,fontSize) {
     if (!overlay || overlay._apiObj === null)
            return;
        overlay._apiObj.div.childNodes[1].style.fontSize  = fontSize;
    }
    // 修改锚点
    e.prototype.changeAnchor = function (overlay,fontfamily) {
        if (!overlay || overlay._apiObj === null)
            return;
    };
    // 修改marker 的lable 的位置
    e.prototype.changeLabelOffset = function(marker,offset){
     if (!marker || marker._apiObj === null)
            return;
        var div = marker._apiObj;
        if(div){
            if(div.children.lenght <=1){
                return;
            }
            if(offset.height){
                this._offset.height = offset.height;
                div.children[1].style.top = this._offset.height + "px";
                }
                if(offset.width){
                this._offset.width = offset.width;
                div.children[1].style.left = this._offset.width + "px";
                }
        }
    };
    e.prototype.GetApiObjDiv = function(overlay){
      if (!overlay || overlay._apiObj === null)
            return null;
       return overlay._apiObj;
    }
    //////////////////////////覆盖物（叠加对象）方法 结束//////////////////////


    //////////////////////////地图图层方法 开始//////////////////////
    //添加一个图层
    e.prototype.addLayer = function(layer, isInit) {
        var url = [];
        if (typeof layer.url === "string")
            url = [layer.url];
        else if (typeof layer.url === "Array") {
            for (var i = 0; i < layer.url.length; i++) {
                url.push(layer.url[i]);
            };
        }

        EzServerClient.GlobeParams.MapSrcURL.push([layer.name, url]);
        if (!_isInit)
            this._initialize();

        NPMapLib.Managers.LayerManager.addLayer(layer);
    };

    //添加多个图层
    e.prototype.addLayers = function(layers) {
        for (var i = 0; i < layers.length; i++) {
            this.addLayer(layers[i], _isInit);
        };

        //        if (!_isInit)
        //            this._initialize();
    };

    //移除一个图层
    e.prototype.removeLayer = function(id) {
        var layer = this.getLayer(id);
        //如果不是覆盖物图层
        if (!NPMapLib.Utils.BaseUtils.isTypeRight(layer, "undefined") &&
			!NPMapLib.Utils.BaseUtils.isTypeRight(layer, "NPMapLib.Layers.OverlayLayer")) {
            for (var i = 0; i < EzServerClient.GlobeParams.MapSrcURL.length; i++) {
                //图层名称与url匹配
                if (EzServerClient.GlobeParams.MapSrcURL[i][0] === layer.name &&
				   EzServerClient.GlobeParams.MapSrcURL[i][1] === layer.url) {
                    EzServerClient.GlobeParams.MapSrcURL.splice(i, 1);
                    break;
                }
            };
        }

        NPMapLib.Managers.LayerManager.removeLayer(id);
    };

    //获取图层，根据图层id
    e.prototype.getLayer = function(id) {
        return NPMapLib.Managers.LayerManager.getLayer(id);
    };
    //////////////////////////地图图层方法 结束//////////////////////

    //////////////////////////坐标变换方法 开始//////////////////////
    //像素坐标转换为经纬度坐标
    e.prototype.pixelToPoint = function(pixel) {
        if (!_isInit)
            return;

        var extent = this.getExtent();
        var container = _map.getMapContainer();
        var xMap = extent.sw.lon + pixel.x * (extent.ne.lon - extent.sw.lon) / container.clientWidth;
        var yMap = extent.ne.lat - pixel.y * (extent.ne.lat - extent.sw.lat) / container.clientHeight;
        return new NPMapLib.Geometry.Point(xMap, yMap);

        // var result = _map.containerCoord2Map(new Point(pixel.x, pixel.y));
        // return new NPMapLib.Geometry.Point(result.x, result.y);
    };

    //经纬度坐标转换为像素坐标
    e.prototype.pointToPixel = function(point) {
        if (!_isInit)
            return;
        var result = _map.mapCoord2Container(new Point(point.lon, point.lat));
        if (result)
            return new NPMapLib.Geometry.Pixel(result.x, result.y);
    };
    //////////////////////////坐标变换方法 结束//////////////////////

    //////////////////////////事件 开始//////////////////////
    //添加事件监听函数
    e.prototype.addEventListener = function(obj, event, handler) {
        if (!_isInit)
            return;

        if (!obj || obj === null || !((obj instanceof NPMapLib.Map) ||
			(obj instanceof NPMapLib.Symbols.Marker) ||
			(obj instanceof NPMapLib.Symbols.Label) ||
			(obj instanceof NPMapLib.Geometry.Polyline) ||
			(obj instanceof NPMapLib.Geometry.Polygon) ||
			(obj instanceof NPMapLib.Geometry.Circle)))
            return;

        var key = event + "_" + obj.id;
        if(obj instanceof NPMapLib.Map){
            key = key + "map";
        }
        if (_events[key])
            return;

        _events[key] = key;
        if (obj instanceof NPMapLib.Map) {
            switch (event) {
                case NPMapLib.MAP_EVENT_CLICK:
                    _map.addMapEventListener('mapclick', function(e) {
                        handler(new NPMapLib.Geometry.Point(e.mapPoint.x, e.mapPoint.y));
                    });
                    break;
                case NPMapLib.MAP_EVENT_DBLCLICK:
                    _map.addMapEventListener('mapdblclick', function(e) {
                        handler(new NPMapLib.Geometry.Point(e.mapPoint.x, e.mapPoint.y));
                    });
                    break;
                case NPMapLib.MAP_EVENT_RIGHT_CLICK:
                    _map.addMapEventListener('mapmouseup', function(e) {
                        if (window.event.button === 2)
                            handler(new NPMapLib.Geometry.Point(e.mapPoint.x, e.mapPoint.y));
                    });
                    break;
                case NPMapLib.MAP_EVENT_MOUSE_MOVE:
                    _map.addMapEventListener('mapmousemove', function(e) {
                        handler(new NPMapLib.Geometry.Point(e.mapPoint.x, e.mapPoint.y));
                    });
                    break;
                case NPMapLib.MAP_EVENT_MOUSE_OVER:
                    _map.addMapEventListener('mapmouseover', function(e) {
                        handler(new NPMapLib.Geometry.Point(e.mapPoint.x, e.mapPoint.y));
                    });
                    break;
                case NPMapLib.MAP_EVENT_MOUSE_OUT:
                    _map.addMapEventListener('mapmouseout', function(e) {
                        handler(new NPMapLib.Geometry.Point(e.mapPoint.x, e.mapPoint.y));
                    });
                    break;
                case NPMapLib.MAP_EVENT_ZOOM_START:
                    _map.addMapEventListener('mapzoomstart', function(e) {
                        handler(e.zoomLevel);
                    });
                    break;
                case NPMapLib.MAP_EVENT_ZOOM_END:
                    _map.addMapEventListener('mapzoomend', function(e) {
                        handler(_map.getZoomLevel());
                    });
                    break;
                case NPMapLib.MAP_EVENT_ADD_OVERLAY:

                    break;
                case NPMapLib.MAP_EVENT_REMOVE_OVERLAY:

                    break;
                case NPMapLib.MAP_EVENT_CLEAR_OVERLAYS:

                    break;
                case NPMapLib.MAP_EVENT_ADD_CONTROL:

                    break;
                case NPMapLib.MAP_EVENT_REMOVE_CONTROL:

                    break;
                case NPMapLib.MAP_EVENT_DRAG_START:

                    break;
                case NPMapLib.MAP_EVENT_DRAG_END:

                    break;
                case NPMapLib.MAP_EVENT_RESIZE:
                    _map.addMapEventListener('mapresize', function(e) {
                        handler(new NPMapLib.Geometry.Size(e.map.mapContainer.clientWidth, e.map.mapContainer.clientHeight));
                    });
                case NPMapLib.MAP_EVENT_MOUSE_DOWN:
                  _map.addMapEventListener('mapmousedown', function(e) {
                        handler(new NPMapLib.Geometry.Point(e.mapPoint.x, e.mapPoint.y));
                    });
                    break;
            }
        } else if (obj instanceof NPMapLib.Symbols.Marker) {
            switch (event) {
                case NPMapLib.MARKER_EVENT_CLICK:
                    obj._apiObj.addListener('click', function() {
                        var pos = obj.getPosition();
                        handler(new NPMapLib.Geometry.Point(pos.lon, pos.lat), obj);
                    });
                    break;
                case NPMapLib.MARKER_EVENT_DBLCLICK:
                    obj._apiObj.addListener('dblclick', function() {
                        var pos = obj.getPosition();
                        handler(new NPMapLib.Geometry.Point(pos.lon, pos.lat));
                    });
                    break;
                case NPMapLib.MARKER_EVENT_RIGHT_CLICK:
                    obj._apiObj.addListener('mouseup', function() {
                        if (window.event.button === 2) {
                            var pos = obj.getPosition();
                            handler(new NPMapLib.Geometry.Point(pos.lon, pos.lat));
                        }
                    });
                    break;
                case NPMapLib.MARKER_EVENT_MOUSE_DOWN:
                    obj._apiObj.addListener('mousedown', function() {
                        var pos = obj.getPosition();
                        handler(new NPMapLib.Geometry.Point(pos.lon, pos.lat),obj);
                    });
                    break;
                case NPMapLib.MARKER_EVENT_MOUSE_UP:
                    obj._apiObj.addListener('mouseup', function() {
                        var pos = obj.getPosition();
                        handler(new NPMapLib.Geometry.Point(pos.lon, pos.lat),obj);
                    });
                    break;
                case NPMapLib.MARKER_EVENT_MOUSE_OVER:
                    obj._apiObj.addListener('mouseover', function() {
                        var pos = obj.getPosition();
                        handler(new NPMapLib.Geometry.Point(pos.lon, pos.lat), obj);
                    });
                    break;
                case NPMapLib.MARKER_EVENT_MOUSE_OUT:
                    obj._apiObj.addListener('mouseout', function() {
                        var pos = obj.getPosition();
                        handler(new NPMapLib.Geometry.Point(pos.lon, pos.lat), obj);
                    });
                    break;
                case NPMapLib.MARKER_EVENT_DRAG_START:
//                      obj._apiObj.addListener('dragstart',function() {
//                        var pos = obj.getPosition();
//                        handler(new NPMapLib.Geometry.Point(pos.lon, pos.lat), obj);
//                    });
                    break;
                case NPMapLib.MARKER_EVENT_DRAG_END:
                   
                    break;
            }
        } else if (obj instanceof NPMapLib.Symbols.Label) {
            switch (event) {
                case NPMapLib.LABEL_EVENT_CLICK:
                    obj._apiObj.addListener('click', function() {
                        var pos = obj.getPosition();
                        handler(new NPMapLib.Geometry.Point(pos.lon, pos.lat));
                    });
                    break;
                case NPMapLib.LABEL_EVENT_DBLCLICK:
                    obj._apiObj.addListener('dblclick', function() {
                        var pos = obj.getPosition();
                        handler(new NPMapLib.Geometry.Point(pos.lon, pos.lat));
                    });
                    break;
                case NPMapLib.LABEL_EVENT_RIGHT_CLICK:
                    obj._apiObj.addListener('mouseup', function() {
                        if (window.event.button === 2) {
                            var pos = obj.getPosition();
                            handler(new NPMapLib.Geometry.Point(pos.lon, pos.lat));
                        }
                    });
                    break;
                case NPMapLib.LABEL_EVENT_MOUSE_DOWN:
                    obj._apiObj.addListener('mousedown', function() {
                        var pos = obj.getPosition();
                        handler(new NPMapLib.Geometry.Point(pos.lon, pos.lat));
                    });
                    break;
                case NPMapLib.LABEL_EVENT_MOUSE_UP:
                    obj._apiObj.addListener('mouseup', function() {
                        var pos = obj.getPosition();
                        handler(new NPMapLib.Geometry.Point(pos.lon, pos.lat));
                    });
                    break;
                case NPMapLib.LABEL_EVENT_MOUSE_OVER:
                    obj._apiObj.addListener('mouseover', function() {
                        var pos = obj.getPosition();
                        handler(new NPMapLib.Geometry.Point(pos.lon, pos.lat));
                    });
                    break;
                case NPMapLib.LABEL_EVENT_MOUSE_OUT:
                    obj._apiObj.addListener('mouseout', function() {
                        var pos = obj.getPosition();
                        handler(new NPMapLib.Geometry.Point(pos.lon, pos.lat));
                    });
                    break;
                case NPMapLib.LABEL_EVENT_DRAG_START:
                 obj._apiObj.addListener('dragstart', handler);
                    break;
                case NPMapLib.LABEL_EVENT_DRAG_END:

                    break;
            }
        } else if (obj instanceof NPMapLib.Geometry.Polyline) {
            switch (event) {
                case NPMapLib.POLYLINE_EVENT_CLICK:
                    obj._apiObj.addListener('click', function(e) {
                        var pixel = new NPMapLib.Geometry.Pixel(e.x, e.y);
                        handler(this.pixelToPoint(pixel));
                    } .bind(this));
                    break;
                case NPMapLib.POLYLINE_EVENT_DBLCLICK:
                    obj._apiObj.addListener('dblclick', function(e) {
                        var pixel = new NPMapLib.Geometry.Pixel(e.x, e.y);
                        handler(this.pixelToPoint(pixel));
                    } .bind(this));
                    break;
                case NPMapLib.POLYLINE_EVENT_RIGHT_CLICK:
                    obj._apiObj.addListener('mouseup', function(e) {
                        if (window.event.button === 2) {
                            var pixel = new NPMapLib.Geometry.Pixel(e.x, e.y);
                            handler(this.pixelToPoint(pixel));
                        }
                    } .bind(this));
                    break;
                case NPMapLib.POLYLINE_EVENT_MOUSE_DOWN:
                    obj._apiObj.addListener('mousedown', function(e) {
                        var pixel = new NPMapLib.Geometry.Pixel(e.x, e.y);
                        handler(this.pixelToPoint(pixel));
                    } .bind(this));
                    break;
                case NPMapLib.POLYLINE_EVENT_MOUSE_UP:
                    obj._apiObj.addListener('mouseup', function(e) {
                        var pixel = new NPMapLib.Geometry.Pixel(e.x, e.y);
                        handler(this.pixelToPoint(pixel));
                    } .bind(this));
                    break;
                case NPMapLib.POLYLINE_EVENT_MOUSE_OVER:
                    obj._apiObj.addListener('mouseover', function(e) {
                        var pixel = new NPMapLib.Geometry.Pixel(e.x, e.y);
                        handler(this.pixelToPoint(pixel));
                    } .bind(this));
                    break;
                case NPMapLib.POLYLINE_EVENT_MOUSE_OUT:
                    obj._apiObj.addListener('mouseout', function(e) {
                        var pixel = new NPMapLib.Geometry.Pixel(e.x, e.y);
                        handler(this.pixelToPoint(pixel));
                    } .bind(this));
                    break;
                case NPMapLib.POLYLINE_EVENT_LINE_UPDATE:

                    break;
            }
        } else if (obj instanceof NPMapLib.Geometry.Polygon) {
            switch (event) {
                case NPMapLib.POLYGON_EVENT_CLICK:
                    obj._apiObj.addListener('click', function(e) {
                        var pixel = new NPMapLib.Geometry.Pixel(e.x, e.y);
                        handler(this.pixelToPoint(pixel));
                    } .bind(this));
                    break;
                case NPMapLib.POLYGON_EVENT_DBLCLICK:
                    obj._apiObj.addListener('dblclick', function(e) {
                        var pixel = new NPMapLib.Geometry.Pixel(e.x, e.y);
                        handler(this.pixelToPoint(pixel));
                    } .bind(this));
                    break;
                case NPMapLib.POLYGON_EVENT_RIGHT_CLICK:
                    obj._apiObj.addListener('mouseup', function(e) {
                        if (window.event.button === 2) {
                            var pixel = new NPMapLib.Geometry.Pixel(e.x, e.y);
                            handler(this.pixelToPoint(pixel));
                        }
                    } .bind(this));
                    break;
                case NPMapLib.POLYGON_EVENT_MOUSE_DOWN:
                    obj._apiObj.addListener('mousedown', function(e) {
                        var pixel = new NPMapLib.Geometry.Pixel(e.x, e.y);
                        handler(this.pixelToPoint(pixel));
                    } .bind(this));
                    break;
                case NPMapLib.POLYGON_EVENT_MOUSE_UP:
                    obj._apiObj.addListener('mouseup', function(e) {
                        var pixel = new NPMapLib.Geometry.Pixel(e.x, e.y);
                        handler(this.pixelToPoint(pixel));
                    } .bind(this));
                    break;
                case NPMapLib.POLYGON_EVENT_MOUSE_OVER:
                    obj._apiObj.addListener('mouseover', function(e) {
                        var pixel = new NPMapLib.Geometry.Pixel(e.x, e.y);
                        handler(this.pixelToPoint(pixel));
                    } .bind(this));
                    break;
                case NPMapLib.POLYGON_EVENT_MOUSE_OUT:
                    obj._apiObj.addListener('mouseout', function(e) {
                        var pixel = new NPMapLib.Geometry.Pixel(e.x, e.y);
                        handler(this.pixelToPoint(pixel));
                    } .bind(this));
                    break;
                case NPMapLib.POLYGON_EVENT_LINE_UPDATE:

                    break;
            }
        } else if (obj instanceof NPMapLib.Geometry.Circle) {
            switch (event) {
                case NPMapLib.CIRCLE_EVENT_CLICK:
                    obj._apiObj.addListener('click', function() {
                        var pixel = new NPMapLib.Geometry.Pixel(e.x, e.y);
                        handler(this.pixelToPoint(pixel));
                    } .bind(this));
                    break;
                case NPMapLib.CIRCLE_EVENT_DBLCLICK:
                    obj._apiObj.addListener('dblclick', function() {
                        var pixel = new NPMapLib.Geometry.Pixel(e.x, e.y);
                        handler(this.pixelToPoint(pixel));
                    } .bind(this));
                    break;
                case NPMapLib.CIRCLE_EVENT_RIGHT_CLICK:
                    obj._apiObj.addListener('mouseup', function() {
                        if (window.event.button === 2) {
                            var pixel = new NPMapLib.Geometry.Pixel(e.x, e.y);
                            handler(this.pixelToPoint(pixel));
                        }
                    } .bind(this));
                    break;
                case NPMapLib.CIRCLE_EVENT_MOUSE_DOWN:
                    obj._apiObj.addListener('mousedown', function() {
                        var pixel = new NPMapLib.Geometry.Pixel(e.x, e.y);
                        handler(this.pixelToPoint(pixel));
                    } .bind(this));
                    break;
                case NPMapLib.CIRCLE_EVENT_MOUSE_UP:
                    obj._apiObj.addListener('mouseup', function() {
                        var pixel = new NPMapLib.Geometry.Pixel(e.x, e.y);
                        handler(this.pixelToPoint(pixel));
                    } .bind(this));
                    break;
                case NPMapLib.CIRCLE_EVENT_MOUSE_OVER:
                    obj._apiObj.addListener('mouseover', function() {
                        var pixel = new NPMapLib.Geometry.Pixel(e.x, e.y);
                        handler(this.pixelToPoint(pixel));
                    } .bind(this));
                    break;
                case NPMapLib.CIRCLE_EVENT_MOUSE_OUT:
                    obj._apiObj.addListener('mouseout', function() {
                        var pixel = new NPMapLib.Geometry.Pixel(e.x, e.y);
                        handler(this.pixelToPoint(pixel));
                    } .bind(this));
                    break;
                case NPMapLib.CIRCLE_EVENT_LINE_UPDATE:

                    break;
            }
        }
    };

    //移除事件监听函数
    e.prototype.removeEventListener = function(obj, event) {
        if (!_isInit)
            return;

        if (!obj || obj === null || !((obj instanceof NPMapLib.Map) ||
			(obj instanceof NPMapLib.Symbols.Marker) ||
			(obj instanceof NPMapLib.Symbols.Label) ||
			(obj instanceof NPMapLib.Geometry.Polyline) ||
			(obj instanceof NPMapLib.Geometry.Polygon) ||
			(obj instanceof NPMapLib.Geometry.Circle)))
            return;

        var key = event + "_" + obj.id;

        if (obj instanceof NPMapLib.Map) {
            switch (event) {
                case NPMapLib.MAP_EVENT_CLICK:
                    _map.removeMapEventListener('mapclick');
                    break;
                case NPMapLib.MAP_EVENT_DBLCLICK:
                    _map.removeMapEventListener('mapdblclick');
                    break;
                case NPMapLib.MAP_EVENT_RIGHT_CLICK:
                    _map.removeMapEventListener('mapmouseup');
                    break;
                case NPMapLib.MAP_EVENT_MOUSE_MOVE:
                    _map.removeMapEventListener('mapmousemove');
                    break;
                case NPMapLib.MAP_EVENT_MOUSE_OVER:
                    _map.removeMapEventListener('mapmouseover');
                    break;
                case NPMapLib.MAP_EVENT_MOUSE_OUT:
                    _map.removeMapEventListener('mapmouseout');
                    break;
                case NPMapLib.MAP_EVENT_ZOOM_START:
                    _map.removeMapEventListener('mapzoomstart');
                    break;
                case NPMapLib.MAP_EVENT_ZOOM_END:
                    _map.removeMapEventListener('mapzoomend');
                    break;
                case NPMapLib.MAP_EVENT_ADD_OVERLAY:

                    break;
                case NPMapLib.MAP_EVENT_REMOVE_OVERLAY:

                    break;
                case NPMapLib.MAP_EVENT_CLEAR_OVERLAYS:

                    break;
                case NPMapLib.MAP_EVENT_ADD_CONTROL:

                    break;
                case NPMapLib.MAP_EVENT_REMOVE_CONTROL:

                    break;
                case NPMapLib.MAP_EVENT_DRAG_START:

                    break;
                case NPMapLib.MAP_EVENT_DRAG_END:

                    break;
                case NPMapLib.MAP_EVENT_RESIZE:
                    _map.removeMapEventListener('mapresize');
                    break;
            }
        } else if (obj instanceof NPMapLib.Symbols.Marker) {
            switch (event) {
                case NPMapLib.MARKER_EVENT_CLICK:
                    obj._apiObj.removeListener('click');
                    break;
                case NPMapLib.MARKER_EVENT_DBLCLICK:
                    obj._apiObj.removeListener('dblclick');
                    break;
                case NPMapLib.MARKER_EVENT_RIGHT_CLICK:
                    obj._apiObj.removeListener('mouseup');
                    break;
                case NPMapLib.MARKER_EVENT_MOUSE_DOWN:
                    obj._apiObj.removeListener('mousedown');
                    break;
                case NPMapLib.MARKER_EVENT_MOUSE_UP:
                    obj._apiObj.removeListener('mouseup');
                    break;
                case NPMapLib.MARKER_EVENT_MOUSE_OVER:
                    obj._apiObj.removeListener('mouseover');
                    break;
                case NPMapLib.MARKER_EVENT_MOUSE_OUT:
                    obj._apiObj.removeListener('mouseout');
                    break;
                case NPMapLib.MARKER_EVENT_DRAG_START:

                    break;
                case NPMapLib.MARKER_EVENT_DRAG_END:

                    break;
            }
        } else if (obj instanceof NPMapLib.Symbols.Label) {
            switch (event) {
                case NPMapLib.LABEL_EVENT_CLICK:
                    obj._apiObj.removeListener('click');
                    break;
                case NPMapLib.LABEL_EVENT_DBLCLICK:
                    obj._apiObj.removeListener('dblclick');
                    break;
                case NPMapLib.LABEL_EVENT_RIGHT_CLICK:
                    obj._apiObj.removeListener('mouseup');
                    break;
                case NPMapLib.LABEL_EVENT_MOUSE_DOWN:
                    obj._apiObj.removeListener('mousedown');
                    break;
                case NPMapLib.LABEL_EVENT_MOUSE_UP:
                    obj._apiObj.removeListener('mouseup');
                    break;
                case NPMapLib.LABEL_EVENT_MOUSE_OVER:
                    obj._apiObj.removeListener('mouseover');
                    break;
                case NPMapLib.LABEL_EVENT_MOUSE_OUT:
                    obj._apiObj.removeListener('mouseout');
                    break;
                case NPMapLib.LABEL_EVENT_DRAG_START:

                    break;
                case NPMapLib.LABEL_EVENT_DRAG_END:

                    break;
            }
        } else if (obj instanceof NPMapLib.Geometry.Polyline) {
            switch (event) {
                case NPMapLib.POLYLINE_EVENT_CLICK:
                    obj._apiObj.removeListener('click');
                    break;
                case NPMapLib.POLYLINE_EVENT_DBLCLICK:
                    obj._apiObj.removeListener('dblclick');
                    break;
                case NPMapLib.POLYLINE_EVENT_RIGHT_CLICK:
                    obj._apiObj.removeListener('mouseup');
                    break;
                case NPMapLib.POLYLINE_EVENT_MOUSE_DOWN:
                    obj._apiObj.removeListener('mousedown');
                    break;
                case NPMapLib.POLYLINE_EVENT_MOUSE_UP:
                    obj._apiObj.removeListener('mouseup');
                    break;
                case NPMapLib.POLYLINE_EVENT_MOUSE_OVER:
                    obj._apiObj.removeListener('mouseover');
                    break;
                case NPMapLib.POLYLINE_EVENT_MOUSE_OUT:
                    obj._apiObj.removeListener('mouseout');
                    break;
                case NPMapLib.POLYLINE_EVENT_LINE_UPDATE:

                    break;
            }
        } else if (obj instanceof NPMapLib.Geometry.Polygon) {
            switch (event) {
                case NPMapLib.POLYGON_EVENT_CLICK:
                    obj._apiObj.removeListener('click');
                    break;
                case NPMapLib.POLYGON_EVENT_DBLCLICK:
                    obj._apiObj.removeListener('dblclick');
                    break;
                case NPMapLib.POLYGON_EVENT_RIGHT_CLICK:
                    obj._apiObj.removeListener('mouseup');
                    break;
                case NPMapLib.POLYGON_EVENT_MOUSE_DOWN:
                    obj._apiObj.removeListener('mousedown');
                    break;
                case NPMapLib.POLYGON_EVENT_MOUSE_UP:
                    obj._apiObj.removeListener('mouseup');
                    break;
                case NPMapLib.POLYGON_EVENT_MOUSE_OVER:
                    obj._apiObj.removeListener('mouseover');
                    break;
                case NPMapLib.POLYGON_EVENT_MOUSE_OUT:
                    obj._apiObj.removeListener('mouseout');
                    break;
                case NPMapLib.POLYGON_EVENT_LINE_UPDATE:

                    break;
            }
        } else if (obj instanceof NPMapLib.Geometry.Circle) {
            switch (event) {
                case NPMapLib.CIRCLE_EVENT_CLICK:
                    obj._apiObj.removeListener('click');
                    break;
                case NPMapLib.CIRCLE_EVENT_DBLCLICK:
                    obj._apiObj.removeListener('dblclick');
                    break;
                case NPMapLib.CIRCLE_EVENT_RIGHT_CLICK:
                    obj._apiObj.removeListener('mouseup');
                    break;
                case NPMapLib.CIRCLE_EVENT_MOUSE_DOWN:
                    obj._apiObj.removeListener('mousedown');
                    break;
                case NPMapLib.CIRCLE_EVENT_MOUSE_UP:
                    obj._apiObj.removeListener('mouseup');
                    break;
                case NPMapLib.CIRCLE_EVENT_MOUSE_OVER:
                    obj._apiObj.removeListener('mouseover');
                    break;
                case NPMapLib.CIRCLE_EVENT_MOUSE_OUT:
                    obj._apiObj.removeListener('mouseout');
                    break;
                case NPMapLib.CIRCLE_EVENT_LINE_UPDATE:

                    break;
            }
        }

        if (_events[key])
            delete _events[key];
    };
    //////////////////////////事件 结束//////////////////////


    //////////////////////////Geometry 开始//////////////////////
    //创建多段线
    e.prototype._createPolyline = function(polyline) {
        if (!(polyline instanceof NPMapLib.Geometry.Polyline))
            return;

        var points = polyline.getPath();
        if (!points || points.length <= 0)
            return;

        var strPoints = "";
        for (var i = 0; i < points.length; i++) {
            strPoints = strPoints + points[i].lon + "," + points[i].lat;
            if (i < points.length - 1)
                strPoints += ",";
        };

        var result = new Polyline(strPoints, polyline.getColor(), polyline.getWeight(), polyline.getOpacity(), polyline.getArrowStyle());
        result.setLineStyle(polyline.getLineStyle());
        return result;
    };

    //创建多边形
    e.prototype._createPolygon = function(polygon) {
        if (!(polygon instanceof NPMapLib.Geometry.Polygon))
            return;

        var points = polygon.getPath();
        if (!points || points.length <= 0)
            return;

        var strPoints = "";
        for (var i = 0; i < points.length; i++) {
            strPoints = strPoints + points[i].lon + "," + points[i].lat;
            if (i < points.length - 1)
                strPoints += ",";
        };

        var result = new Polygon(strPoints, polygon.getColor(), polygon.getWeight(), polygon.getFillOpacity(), polygon.getFillColor());
        return result;
    };

    //创建圆形
    e.prototype._createCircle = function(circle) {
        if (!(circle instanceof NPMapLib.Geometry.Circle))
            return;

        var center = circle.getCenter();
        var radius = circle.getRadius();
        if (!center || !radius)
            return;

        var str = center.lon + "," + center.lat + "," + radius;
        var overlay = new Circle(str, circle.getColor(), circle.getWeight(), circle.getFillOpacity(), circle.getFillColor());
        return overlay;
    };
    //////////////////////////Geometry 结束//////////////////////



    //////////////////////////Symbols 开始//////////////////////
    //创建Marker对象
    e.prototype._createMarker = function(marker) {
        if (!(marker instanceof NPMapLib.Symbols.Marker))
            return;

        var tempIcon = marker.getIcon();
        if (!tempIcon)
            return;

        //图标
        var strImgHtml = '<img src="' + tempIcon.getImageUrl() + '" ';
        strImgHtml += 'width=' + tempIcon.getImageSize().width;
        strImgHtml += ' height=' + tempIcon.getImageSize().height;
        strImgHtml += ' style="position:absolute;';
        strImgHtml += 'top:' + tempIcon.getAnchor().height + 'px;';
        strImgHtml += 'left:' + tempIcon.getAnchor().width + 'px;" />';

        //文字
        var tempLabel = marker.getLabel();
        var strTextHTML;
        if (tempLabel) {
            var labelStyle = tempLabel.getStyle();
            console.log(labelStyle);
            strTextHTML = '<p style="text-align:center;';
            strTextHTML += 'font-family:' + labelStyle.fontFamily;
            strTextHTML += ';font-size:' + labelStyle.fontSize;
            strTextHTML += ';width:' + tempLabel.getContent().length * labelStyle.fontSize;
            strTextHTML += ';color:' + labelStyle.color;
            if (labelStyle.bgColor)
                strTextHTML += ';background-color:' + labelStyle.bgColor;
            if (labelStyle.borderColor)
                strTextHTML += ';border-color:' + labelStyle.borderColor;
            if (labelStyle.borderSize)
                strTextHTML += ';border:' + labelStyle.borderSize;
            strTextHTML += ';top:' + (tempLabel.getOffset().height) + "px";
            if (tempLabel.getOffset().width) {
                strTextHTML += ';left:' + (tempLabel.getOffset().width + "px");
            } else {
                if (labelStyle.align === 'center') {
                    strTextHTML += ';left:' + (-tempLabel.getContent().length * labelStyle.fontSize / 2 + tempLabel.getOffset().width);
                } else if (labelStyle.align === 'right') {
                    strTextHTML += ';left:' + (tempLabel.getContent().length * labelStyle.fontSize / 2 + tempLabel.getOffset().width);
                } else {
                    strTextHTML += ';left:' + tempLabel.getOffset().width;
                }
            }
            if (labelStyle.isBold)
                strTextHTML += ';font-weight:bold';
            else
                strTextHTML += ';font-weight:normal';
            //strTextHTML += ';text-align:' + labelStyle.align;
            strTextHTML += ';position:absolute;" >';
            strTextHTML += tempLabel.getContent();
            strTextHTML += ' </p>';

            strImgHtml =  strImgHtml + strTextHTML  ;
        }

        var tempPt = marker.getPosition();

        //图像标记
        return new HTMLElementOverLay(marker.id, new Point(tempPt.lon, tempPt.lat), strImgHtml);
    };

    //创建Label对象
    e.prototype._createLabel = function(label) {
        if (!(label instanceof NPMapLib.Symbols.Label))
            return;
        //文字
        var labelStyle = label.getStyle();
        var strTextHTML = '<p style="';
        strTextHTML += 'font-family:' + labelStyle.fontFamily;
        strTextHTML += ';font-size:' + labelStyle.fontSize;
        strTextHTML += ';width:' + label.getContent().length * labelStyle.fontSize;
        strTextHTML += ';color:' + labelStyle.color;
        if (labelStyle.bgColor)
            strTextHTML += ';background-color:' + labelStyle.bgColor;
        if (labelStyle.borderColor)
            strTextHTML += ';border-color:' + labelStyle.borderColor;
        if (labelStyle.borderSize)
            strTextHTML += ';border:' + labelStyle.borderSize;
        strTextHTML += ';top:' + label.getOffset().height;
        if (labelStyle.align === 'center') {
            strTextHTML += ';left:' + (-label.getContent().length * labelStyle.fontSize / 2 + label.getOffset().width);
        } else if (labelStyle.align === 'right') {
            strTextHTML += ';left:' + (label.getContent().length * labelStyle.fontSize / 2 + label.getOffset().width);
        } else {
            strTextHTML += ';left:' + label.getOffset().width;
        }
        if (labelStyle.isBold)
            strTextHTML += ';font-weight:bold';
        else
            strTextHTML += ';font-weight:normal';
        //strTextHTML += ';text-align:' + labelStyle.align;
        strTextHTML += ';position:absolute;" >';
        strTextHTML += label.getContent();
        strTextHTML += ' </p>';

        var tempPt = label.getPosition();

        //文本标记
        return new HTMLElementOverLay(label.id, new Point(tempPt.lon, tempPt.lat), strTextHTML);
    };
    //创建InfoWin对象
    e.prototype._createInfoWin = function(infoWin) {
        if (!(infoWin instanceof NPMapLib.Symbols.InfoWindow))
            return;
        var strTextHTML = "";
        if (infoWin._arrow) {
            this._domElement = document.createElement('div');
            this._domElement.className = "NPMap-popup";
            var top = document.createElement('div');
            top.className = "NPMap-popup-top";

            var h3 = document.createElement('h3');
            h3.className = "NPMap-popup-title";
            h3.innerHTML = infoWin._title;
            top.appendChild(h3);

            var spanClose = document.createElement('span');
            spanClose.className = "NPMap-popup-close";
            spanClose.title = "关闭";
            spanClose.setAttribute("onclick", 'closeInfoWin()');
            top.appendChild(spanClose);
            this._middle = document.createElement('div');
            this._middle.className = "NPMap-popup-middle";
            this._middle.innerHTML = infoWin._content;

            this._bottom = document.createElement('div');
            this._bottom.className = "NPMap-popup-bottom";

            this._spanArrow = document.createElement('span');
            this._spanArrow.className = "NPMap-popup-arrow";
            this._bottom.appendChild(this._spanArrow);

            this._domElement.appendChild(top);
            this._domElement.appendChild(this._middle);
            this._domElement.appendChild(this._bottom);

            this._domElement.style.width = infoWin._width + "px";
            this._domElement.style.height = infoWin._height + "px";

            this._middle.style.height = (infoWin._height - 36) + "px";
            this._spanArrow.style.left = (infoWin._width / 2) + "px";

            strTextHTML = this._domElement.outerHTML;
        } else {
            this._domElement = document.createElement('div');
            this._domElement.className = "NPMap-popup";
            var top = document.createElement('div');
            top.className = "NPMap-popup-top";

            var h3 = document.createElement('h3');
            h3.className = "NPMap-popup-title";
            h3.innerHTML = infoWin._title;
            top.appendChild(h3);

            var spanClose = document.createElement('span');
            spanClose.className = "NPMap-popup-close";
            spanClose.title = "关闭";
            spanClose.setAttribute("onclick", 'closeInfoWin()');
            top.appendChild(spanClose);

            this._middle = document.createElement('div');
            this._middle.className = "NPMap-popup-middle";
            this._middle.innerHTML = infoWin._content;

            this._domElement.appendChild(top);
            this._domElement.appendChild(this._middle);

            this._domElement.style.width = infoWin._width + "px";
            this._domElement.style.height = infoWin._height + "px";

            this._middle.style.height = (this._config._height - 36) + "px";

            strTextHTML = this._domElement.outerHTML;
        };
        var tempPt = infoWin.getPosition();
        var tempPixcel = this.pointToPixel(tempPt);
        var newtempPixcel = this.pixelToPoint(new NPMapLib.Geometry.Pixel(tempPixcel.x - infoWin._offset.width, tempPixcel.y - infoWin._offset.height));
        //文本标记
        return new HTMLElementOverLay(infoWin.id, new Point(newtempPixcel.lon, newtempPixcel.lat), strTextHTML);
    };
    //////////////////////////Symbols 开始//////////////////////

    e.prototype.draw = function(overlay){
         if (!overlay || overlay._apiObj === null)
            return;
      var tempPt = overlay.getPosition(); 
      overlay._apiObj.setPoint(new Point(tempPt.lon, tempPt.lat));
      
    };
    // 修改lable 文案
    e.prototype.resetContent = function(lable,content){
        if(!lable || !lable._apiObj){
            return;
        }
        lable._apiObj.div.children[0].innerHTML = content;
    };
     // 设置config 重新生成popup
    e.prototype.setconfig = function (infoWindow,config) {
        if(!infoWindow || !config || infoWindow._popup == null){
            return;
        }
        infoWindow._popup.setconfig(config);
    };
    // 重新设置marker 的label 内容
    e.prototype.resetLabelContent = function(marker,content){
        if(!marker || !marker._apiObj){
            return;
        }
        if(content){
         marker._apiObj.div.getElementsByTagName("p")[0].innerHTML = content;
        }
    };
    //修改Polyline 颜色
    e.prototype.changePolylineColor = function(Polyline,color){
        if(!Polyline || Polyline._apiObj == null){
            return;
        }
        if(Polyline._apiObj){
            Polyline._apiObj.div.style.stroke = color;
            Polyline._apiObj.setColor(color);
        }
    };
    // 启用编辑
    e.prototype.enableEditing = function(overlay){
        var obj = overlay;
         if (!obj || obj === null || !((obj instanceof NPMapLib.Map) ||
			(obj instanceof NPMapLib.Symbols.Marker) ||
			(obj instanceof NPMapLib.Symbols.Label) ||
			(obj instanceof NPMapLib.Geometry.Polyline) ||
			(obj instanceof NPMapLib.Geometry.Polygon) ||
			(obj instanceof NPMapLib.Geometry.Circle))){
                return;
            }
        if(obj._apiObj){
            obj._apiObj.enableEdit();
        }
    };
    // 禁用编辑
    e.prototype.disableEdit = function(){
     var obj = overlay;
         if (!obj || obj === null || !((obj instanceof NPMapLib.Map) ||
			(obj instanceof NPMapLib.Symbols.Marker) ||
			(obj instanceof NPMapLib.Symbols.Label) ||
			(obj instanceof NPMapLib.Geometry.Polyline) ||
			(obj instanceof NPMapLib.Geometry.Polygon) ||
			(obj instanceof NPMapLib.Geometry.Circle))){
                return;
            }
        if(obj._apiObj){
            obj._apiObj.disableEdit();
        }
    }
})();
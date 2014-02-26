/*!
* 事件
*/
NPMapLib.MAP_EVENT_CLICK = 'click';
NPMapLib.MAP_EVENT_DBLCLICK = 'dblclick';
NPMapLib.MAP_EVENT_RIGHT_CLICK = 'rightclick';
NPMapLib.MAP_EVENT_MOUSE_MOVE = 'mousemove';
NPMapLib.MAP_EVENT_MOUSE_OVER = 'mouseover';
NPMapLib.MAP_EVENT_MOUSE_OUT = 'mouseout';
NPMapLib.MAP_EVENT_ZOOM_START = 'zoomstart';
NPMapLib.MAP_EVENT_ZOOM_END = 'zoomend';
NPMapLib.MAP_EVENT_ADD_OVERLAY = 'addoverlay';
NPMapLib.MAP_EVENT_REMOVE_OVERLAY = 'removeoverlay';
NPMapLib.MAP_EVENT_CLEAR_OVERLAYS = 'clearoverlays';
NPMapLib.MAP_EVENT_ADD_CONTROL = 'addcontrol';
NPMapLib.MAP_EVENT_REMOVE_CONTROL = 'removecontrol';
NPMapLib.MAP_EVENT_DRAG_START = 'dragstart';
NPMapLib.MAP_EVENT_DRAG_END = 'dragend';
NPMapLib.MAP_EVENT_RESIZE = 'resize';
NPMapLib.MAP_EVENT_MOUSE_DOWN = 'mapmousedown';
//事件参考
//@描述：左键单击地图时触发此事件  关键字：click  参数：{type, target(point)}
//@描述：双击地图时会触发此事件  关键字：dblclick  参数：{type, target(point)}
//@描述：右键单击地图时触发此事件  关键字：rightclick  参数：{type, target(point)}
//@描述：鼠标在地图区域移动过程中触发此事件  关键字：mousemove  参数：{type, target(point)}
//@描述：鼠标移入地图区域时触发此事件  关键字：mouseover  参数：{type, target(point)}
//@描述：鼠标移出地图区域时触发此事件  关键字：mouseout  参数：{type, target(point)}
//@描述：地图更改缩放级别开始时触发触发此事件  关键字：zoomstart  参数：{type, target(zoomLevel)}
//@描述：地图更改缩放级别结束时触发触发此事件  关键字：zoomend  参数：{type, target(zoomLevel)}
//@描述：当使用Map.addOverlay()方法向地图中添加单个覆盖物时会触发此事件  关键字：addoverlay  参数：{type, target()}
//@描述：当使用Map.removeOverlay()方法移除单个覆盖物时会触发此事件  关键字：removeoverlay  参数：{type, target()}
//@描述：当使用Map.clearOverlays()方法一次性移除全部覆盖物时会触发此事件  关键字：clearoverlays  参数：{type, target()}
//@描述：当使用Map.addControl()方法向地图中添加单个控件时会触发此事件  关键字：addcontrol  参数：{type, target()}
//@描述：当使用Map.removeControl()方法移除单个控件时会触发此事件  关键字：removecontrol  参数：{type, target()}
//@描述：开始拖拽地图时触发  关键字：dragstart  参数：{type, target(point)}
//@描述：停止拖拽地图时触发  关键字：dragend  参数：{type, target(point)}
//@描述：地图可视区域大小发生变化时会触发此事件  关键字：resize  参数：{type, target(size)}
//--------------------------------------------------------------------------------------------

/*!
*NPMapLib.Map构造函数的可选参数
*/
(function() {
    var e = NPMapLib.MapOptions = {
        minZoom: 0, 	//地图允许展示的最小级别
        maxZoom: 10		//地图允许展示的最大级别
    };

})();

/*!
*地图对象
*/
(function() {
    var e = NPMapLib.Map = function(container, opts, injectId) {
        this._container = container;
        if (injectId instanceof Number && injectId > 0) {
            this.id = injectId;
        }
        else {
            this.id = NPMapLib.Managers.MapManager.getMaxId();
        }
        this._mapAdapter = NPMapLib.Adapter.AdapterFactory.createMapAdapter(container, opts, this.id);

        if (this._mapAdapter === null) {
            return;
        }

        NPMapLib.Managers.MapManager.addMap(this);
        if (!opts || opts === null)
            return;

        if (NPMapLib.Utils.BaseUtils.isTypeRight(opts.minZoom, "int"))
            this.setMinZoom(opts.minZoom);
        if (NPMapLib.Utils.BaseUtils.isTypeRight(opts.maxZoom, "int"))
            this.setMinZoom(opts.maxZoom);
    };

    //////////////////////////配置方法 开始//////////////////////////
    //启用滚轮放大缩小，默认启用
    e.prototype.enableScrollWheelZoom = function() {
        if (this._mapAdapter)
            this._mapAdapter.enableScrollWheelZoom();
    };

    //禁用滚轮放大缩小
    e.prototype.disableScrollWheelZoom = function() {
        if (this._mapAdapter)
            this._mapAdapter.disableScrollWheelZoom();
    };

    //启用双击放大，默认启用
    e.prototype.enableDoubleClickZoom = function() {
        if (this._mapAdapter)
            this._mapAdapter.enableDoubleClickZoom();
    };

    //禁用双击放大
    e.prototype.disableDoubleClickZoom = function() {
        if (this._mapAdapter)
            this._mapAdapter.disableDoubleClickZoom();
    };

    //启用键盘操作，默认启用
    e.prototype.enableKeyboard = function() {
        if (this._mapAdapter)
            this._mapAdapter.enableKeyboard();
    };

    //禁用键盘操作
    e.prototype.disableKeyboard = function() {
        if (this._mapAdapter)
            this._mapAdapter.disableKeyboard();
    };

    //启用地图惯性拖拽，默认禁用
    e.prototype.enableInertialDragging = function() {
        if (this._mapAdapter)
            this._mapAdapter.enableInertialDragging();
    };

    //禁用地图惯性拖拽
    e.prototype.disableInertialDragging = function() {
        if (this._mapAdapter)
            this._mapAdapter.disableInertialDragging();
    };

    //设置地图鼠标指针样式
    e.prototype.setCursor = function(cursor) {
        if (this._mapAdapter)
            this._mapAdapter.setCursor(cursor);
    };

    //返回地图鼠标指针样式
    e.prototype.getCursor = function() {
        if (this._mapAdapter)
            this._mapAdapter.getCursor();
    };

    //设置地图允许的最小级别。取值不得小于地图类型所允许的最小级别
    e.prototype.setMinZoom = function(zoom) {
        if (this._mapAdapter)
            this._mapAdapter.setMinZoom(zoom);
    };

    //设置地图允许的最大级别。取值不得大于地图类型所允许的最大级别
    e.prototype.setMaxZoom = function(zoom) {
        if (this._mapAdapter)
            this._mapAdapter.setMaxZoom(zoom);
    };
    //////////////////////////配置方法 结束//////////////////////////


    //////////////////////////地图状态方法 开始//////////////////////
    //返回地图可视区域，以地理坐标表示
    e.prototype.getExtent = function() {
        if (this._mapAdapter)
            return this._mapAdapter.getExtent();
    };

    //返回地图当前中心点
    e.prototype.getCenter = function() {
        if (this._mapAdapter)
            return this._mapAdapter.getCenter();
    };

    //返回两点之间的距离，单位是米
    e.prototype.getDistance = function(start, end) {
        if (this._mapAdapter)
            return this._mapAdapter.getDistance(start, end);
    };

    //返回地图视图的大小，以像素表示
    e.prototype.getSize = function() {
        if (this._mapAdapter)
            return this._mapAdapter.getSize();
    };

    //返回地图当前缩放级别
    e.prototype.getZoom = function() {
        if (this._mapAdapter)
            return this._mapAdapter.getZoom();
    };
    //////////////////////////地图状态方法 结束//////////////////////

    //////////////////////////修改地图状态方法 开始//////////////////////
    //地图根据指定的点和级别进行对中
    e.prototype.centerAndZoom = function(center, zoom) {
        if (this._mapAdapter)
            this._mapAdapter.centerAndZoom(center, zoom);
    };

    //平移
    e.prototype.pan = function() {
        if (this._mapAdapter)
            this._mapAdapter.pan();
    };

    //将地图的中心点更改为给定的点
    e.prototype.panTo = function(center) {
        if (this._mapAdapter)
            this._mapAdapter.panTo(center);
    };

    //将地图在水平位置上移动x像素，垂直位置上移动y像素
    e.prototype.panByPixel = function(x, y) {
        if (this._mapAdapter)
            this._mapAdapter.panByPixel(x, y);
    };

    //重新设置地图，恢复地图初始化时的中心点和级别
    e.prototype.reset = function() {
        if (this._mapAdapter)
            this._mapAdapter.reset();
    };

    //设置地图中心点
    e.prototype.setCenter = function(center) {
        if (this._mapAdapter)
            this._mapAdapter.setCenter(center);
    };

    //切换图层。index为添加到地图时的顺序。
    e.prototype.switchLayer = function(index) {
        if (this._mapAdapter)
            this._mapAdapter.switchLayer(index);
    };

    //将视图切换到指定的缩放等级，中心点坐标不变
    e.prototype.setZoom = function(zoom) {
        if (this._mapAdapter)
            this._mapAdapter.setZoom(zoom);
    };

    //全图
    e.prototype.fullExtent = function() {
        if (this._mapAdapter)
            this._mapAdapter.fullExtent();
    };

    //拉框放大
    e.prototype.zoomIn = function() {
        if (this._mapAdapter)
            this._mapAdapter.zoomIn();
    };

    //拉框缩小
    e.prototype.zoomOut = function() {
        if (this._mapAdapter)
            this._mapAdapter.zoomOut();
    };

    //固定放大一个级别
    e.prototype.zoomInFixed = function() {
        if (this._mapAdapter)
            this._mapAdapter.zoomInFixed();
    };

    //固定缩小一个级别
    e.prototype.zoomOutFixed = function() {
        if (this._mapAdapter)
            this._mapAdapter.zoomOutFixed();
    };
    //缩放到指定范围
    e.prototype.zoomToExtent = function(lonmin, latmin, lonmax, latmax) {
        if (this._mapAdapter)
            this._mapAdapter.zoomToExtent(lonmin, latmin, lonmax, latmax);
    };
    //////////////////////////修改地图状态方法 结束//////////////////////


    //////////////////////////控件方法 开始//////////////////////
    //将控件添加到地图，一个控件实例只能向地图中添加一次
    e.prototype.addControl = function(control) {
        if (!this._mapAdapter) {
            return;
        }
        if (!control || !control.id) {
            return;
        }
        if (NPMapLib.Managers.ControlManager.getControl(control.id)) {
            return;
        }

        control.mapId = this.id;
        if (!control.visible) {
            control.show();
        }
        NPMapLib.Managers.ControlManager.addControl(control);
    };

    //从地图中移除控件。如果控件从未被添加到地图中，则该移除不起任何作用
    e.prototype.removeControl = function(control) {
        if (!this._mapAdapter) {
            return;
        }
        if (!control || !control.id) {
            return;
        }

        control.hide();
        control.mapId = -1;
        NPMapLib.Managers.ControlManager.removeControl(control.id);
    };

    //返回地图的容器元素
    e.prototype.getContainer = function() {
        if (!this._mapAdapter)
            return;

        return this._container;
    };
    //////////////////////////控件方法 结束//////////////////////

    //////////////////////////覆盖物方法 开始//////////////////////
    //将覆盖物添加到地图中，一个覆盖物实例只能向地图中添加一次
    e.prototype.addOverlay = function(overlay) {
        if (!this._mapAdapter)
            return;

        if (!overlay || !(overlay instanceof NPMapLib.Overlay))
            return;

        this._mapAdapter.addOverlay(overlay);
        overlay.mapId = this.id;
    };

    //将多个覆盖物添加到地图中
    e.prototype.addOverlays = function(overlays) {
        if (!this._mapAdapter)
            return;

        if (!NPMapLib.Utils.BaseUtils.isTypeRight(overlays, "Array"))
            return;

        for (var i = 0; i < overlays.length; i++) {
            this.addOverlay(overlays[i]);
        };
    };

    //从地图中移除覆盖物。如果覆盖物从未被添加到地图中，则该移除不起任何作用
    e.prototype.removeOverlay = function(overlay) {
        if (!this._mapAdapter)
            return;

        if (!overlay || !(overlay instanceof NPMapLib.Overlay))
            return;
        this._mapAdapter.removeOverlay(overlay);
        overlay.mapId = -1;
    };


    //从地图中移除覆盖物。如果覆盖物从未被添加到地图中，则该移除不起任何作用
    e.prototype.removeOverlays = function(overlays) {
        if (!this._mapAdapter)
            return;

        if (!NPMapLib.Utils.BaseUtils.isTypeRight(overlays, "Array"))
            return;

        for (var i = 0; i < overlays.length; i++) {
            this.removeOverlay(overlays[i]);
        };
    };

    //返回地图上的所有覆盖物
    e.prototype.getOverlays = function() {
        if (!this._mapAdapter)
            return;
        return this._mapAdapter.getOverlays();
    };

    //清除地图上所有覆盖物
    e.prototype.clearOverlays = function() {
        if (!this._mapAdapter)
            return;
        this._mapAdapter.clearOverlays();
    };
    //获取覆盖物的范围
    e.prototype.getOverlayExtent = function(overlay) {
        if (!this._mapAdapter)
            return;
        this._mapAdapter.getOverlayExtent(overlay);
    }
    //////////////////////////覆盖物（叠加对象）方法 结束//////////////////////


    //////////////////////////地图图层方法 开始//////////////////////
    //添加一个图层
    e.prototype.addLayer = function(layer) {
        if (!this._mapAdapter)
            return;

        this._mapAdapter.addLayer(layer);
        layer.mapId = this.id;
    };

    //添加图层组
    e.prototype.addLayers = function(layers) {
        if (!this._mapAdapter)
            return;

        this._mapAdapter.addLayers(layers);
    };

    //移除一个图层
    e.prototype.removeLayer = function(id) {
        if (!this._mapAdapter)
            return;

        this._mapAdapter.removeLayer(id);
    };

    //获取图层，根据图层id
    e.prototype.getLayer = function(id) {
        if (!this._mapAdapter)
            return;

        return this._mapAdapter.getLayer(id);
    };
    //////////////////////////地图图层方法 结束//////////////////////

    //////////////////////////坐标变换方法 开始//////////////////////
    //像素坐标转换为经纬度坐标
    e.prototype.pixelToPoint = function(pixel) {
        if (!this._mapAdapter)
            return;

        return this._mapAdapter.pixelToPoint(pixel);
    };

    //经纬度坐标转换为像素坐标
    e.prototype.pointToPixel = function(point) {
        if (!this._mapAdapter)
            return;

        return this._mapAdapter.pointToPixel(point);
    };
    //////////////////////////坐标变换方法 结束//////////////////////


    //////////////////////////事件 开始//////////////////////
    //添加事件监听函数
    e.prototype.addEventListener = function(event, handler) {
        if (!this._mapAdapter)
            return;

        this._mapAdapter.addEventListener(this, event, handler);
    };

    //移除事件监听函数
    e.prototype.removeEventListener = function(event) {
        if (!this._mapAdapter)
            return;

        this._mapAdapter.removeEventListener(this, event);
    };
    //////////////////////////事件 结束//////////////////////

})();
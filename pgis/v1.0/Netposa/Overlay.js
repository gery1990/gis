
/*!
* 覆盖物(基类)
*/
(function () {
    var e = NPMapLib.Overlay = function () {
        this.id = -1;
        this.overlayType = NPMapLib.OVERLAY_TYPE_UNKNOWN;
        this.mapId = -1;

        this._visible = true;
        this._apiObj = null;
        this._ableDragging = false;
        this._container = null;
    };
    // 设置容器
    e.prototype.setContainer = function (container) {
        this._container = container;
    }


    //是否显示
    e.prototype.isVisible = function () {
        return this._visible;
    };

    //显示
    e.prototype.show = function () {
        if (this.mapId <= 0 || this._visible)
            return;

        var mapAdapter = NPMapLib.Adapter.AdapterFactory.getMapAdapter(this.mapId);
        if (mapAdapter)
            mapAdapter.showOverlay(this);
        this._visible = true;
    };

    //隐藏
    e.prototype.hide = function () {
        if (this.mapId <= 0 || !this._visible)
            return;

        var mapAdapter = NPMapLib.Adapter.AdapterFactory.getMapAdapter(this.mapId);
        if (mapAdapter)
            mapAdapter.hideOverlay(this);
        this._visible = false;
    };

    //闪烁，默认3次
    e.prototype.flash = function () {
        if (this.mapId <= 0 || !this._visible)
            return;

        var mapAdapter = NPMapLib.Adapter.AdapterFactory.getMapAdapter(this.mapId);
        if (mapAdapter)
            mapAdapter.falshOverlay(this);
    };

    //闪烁
    e.prototype.flash2 = function (times) {
        if (this.mapId <= 0 || !this._visible)
            return;

        var mapAdapter = NPMapLib.Adapter.AdapterFactory.getMapAdapter(this.mapId);
        if (mapAdapter)
            mapAdapter.falshOverlay(this, times);
    };

    //获取当前对象在图层中的叠加次序
    e.prototype.getZIndex = function () {
        if (this.mapId <= 0)
            return;

        var mapAdapter = NPMapLib.Adapter.AdapterFactory.getMapAdapter(this.mapId);
        if (mapAdapter)
            mapAdapter.getOverlayZIndex(this);
    };

    //设置当前对象在图层中的叠加次序
    e.prototype.setZIndex = function (zIndex) {
        if (this.mapId <= 0)
            return;

        var mapAdapter = NPMapLib.Adapter.AdapterFactory.getMapAdapter(this.mapId);
        if (mapAdapter)
            mapAdapter.setOverlayZIndex(this, zIndex);
    };

    //旋转
    e.prototype.rotate = function (angle) {
        if (this.mapId <= 0)
            return;

        var mapAdapter = NPMapLib.Adapter.AdapterFactory.getMapAdapter(this.mapId);
        if (mapAdapter)
            mapAdapter.rotateOverlay(this, angle);
    };
    //更换图标
    e.prototype.resetIcon = function (icon) {
        if (this.mapId <= 0 || !this._visible)
            return;
        var mapAdapter = NPMapLib.Adapter.AdapterFactory.getMapAdapter(this.mapId);
        if (mapAdapter)
            mapAdapter.resetIcon(this, icon);
    };
    // 返回覆盖物Html
    e.prototype.GetApiObjDiv = function () {
        var mapAdapter = NPMapLib.Adapter.AdapterFactory.getMapAdapter(this.mapId);
        if (mapAdapter)
            mapAdapter.GetApiObjDiv(this);
    };
    // 修改位置
    e.prototype.changePosition = function (point) {
        var mapAdapter = NPMapLib.Adapter.AdapterFactory.getMapAdapter(this.mapId);
        if (mapAdapter)
            mapAdapter.changePosition(this, point);
    };
    // 修改大小
    e.prototype.changeSize = function (point) {
        var mapAdapter = NPMapLib.Adapter.AdapterFactory.getMapAdapter(this.mapId);
        if (mapAdapter)
            mapAdapter.changeSize(this, point);
    };
    // 修改颜色
    e.prototype.changeColor = function (color) {
        var mapAdapter = NPMapLib.Adapter.AdapterFactory.getMapAdapter(this.mapId);
        if (mapAdapter)
            mapAdapter.changeColor(this, color);
    };
    // 修改字体
    e.prototype.changeFontFamily = function (fontfamily) {
        var mapAdapter = NPMapLib.Adapter.AdapterFactory.getMapAdapter(this.mapId);
        if (mapAdapter)
            mapAdapter.changeFontFamily(this, fontfamily);
    };
    // 修改字体大小
    e.prototype.changeFontSize = function (fontSize) {
        var mapAdapter = NPMapLib.Adapter.AdapterFactory.getMapAdapter(this.mapId);
        if (mapAdapter)
            mapAdapter.changeFontSize(this, fontSize);
    }
    // 修改锚点
    e.prototype.changeAnchor = function (fontfamily) {
        var mapAdapter = NPMapLib.Adapter.AdapterFactory.getMapAdapter(this.mapId);
        if (mapAdapter)
            mapAdapter.changeAnchor(this, fontfamily);
    };
    //    //可拖拽
    //    e.prototype.enableDragging = function () {
    //        this._ableDragging = true;
    //        var mapAdapter = NPMapLib.Adapter.AdapterFactory.getMapAdapter(this.mapId);
    //        if (mapAdapter != null) {
    //            mapAdapter.disableInertialDragging();
    //        }
    //    };
    //    //不可拖拽
    //    e.prototype.disableDragging = function () {
    //        this._ableDragging = false;
    //        var mapAdapter = NPMapLib.Adapter.AdapterFactory.getMapAdapter(this.mapId);
    //        if (mapAdapter != null) {
    //            mapAdapter.enableInertialDragging();
    //        }
    //    }
    //    // 是否可拖拽
    //    e.prototype.GetIsDragging = function () {
    //        return this._ableDragging;
    //    }

})();
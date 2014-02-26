/*
 *覆盖物图层
 */
(function () {
    var e = NPMapLib.Layers.OverlayLayer = function (name, order, scale) {
        this.name = name;
        this.order = order;
        this._scale = scale;
        this._overlays = {};
    };

    e.prototype = new NPMapLib.Layer;
    // 设置比例尺
    e.prototype.setScale = function (scale) {
        this._scale = scale;
        var mapAdapter = NPMapLib.Adapter.AdapterFactory.getMapAdapter(this.mapId);
        if (mapAdapter) {
            
        }
    }

    //添加覆盖物
    e.prototype.addOverlay = function (overlay) {
        if (!NPMapLib.Utils.BaseUtils.isTypeRight(overlay, "NPMapLib.Overlay"))
            return;

        //if(overlay.id < 0){ 
        var mapAdapter = NPMapLib.Adapter.AdapterFactory.getMapAdapter(this.mapId);
        if (mapAdapter) {
            mapAdapter.addOverlay(overlay);
            overlay.mapId = this.mapId;

            if (this.visible)
                overlay.show();
            else
                overlay.hide();
        }
        //}

        this._overlays[overlay.id] = overlay;
    };

    //添加覆盖物
    e.prototype.addOverlays = function (overlays) {
        if (!NPMapLib.Utils.BaseUtils.isTypeRight(overlays, "Array"))
            return;

        for (var i = 0; i < overlays.length; i++) {
            this.addOverlay(overlays[i]);
        };
    };

    //获取所有覆盖物
    e.prototype.getOverlays = function () {
        return this._overlays;
    };

    //获取某一覆盖物
    e.prototype.getOverlay = function (id) {
        return this._overlays[id];
    };

    //移除某一覆盖物
    e.prototype.removeOverlay = function (id) {
        if (this._overlays[id])
            delete this._overlays[id];
    };

    //移除所有覆盖物
    e.prototype.removeAllOverlays = function () {
        var mapAdapter = NPMapLib.Adapter.AdapterFactory.getMapAdapter(this.mapId);
        if (!mapAdapter)
            return;

        for (var key in this._overlays) {
            mapAdapter.removeOverlay(this._overlays[key]);
        }
    };

    //显示
    e.prototype.show = function () {
        var mapAdapter = NPMapLib.Adapter.AdapterFactory.getMapAdapter(this.mapId);
        if (!mapAdapter)
            return;

        for (var key in this._overlays) {
            this._overlays[key].show();
        }
    };

    //隐藏
    e.prototype.hide = function () {
        var mapAdapter = NPMapLib.Adapter.AdapterFactory.getMapAdapter(this.mapId);
        if (!mapAdapter)
            return;

        for (var key in this._overlays) {
            this._overlays[key].hide();
        }
    };
})();

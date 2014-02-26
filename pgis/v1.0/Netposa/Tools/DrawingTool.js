/*
 *几何图形绘制工具
 */
(function () {
    var e = NPMapLib.Tools.DrawingTool = function (mapId) {
        this._mode = NPMapLib.DRAW_MODE_POLYLINE; 	        //默认绘制模式
        this._isStartUp = false;

        this.mapId = mapId;

    };

    //设置绘制模式
    e.prototype.setMode = function (mode,callback) {
        if (mode === NPMapLib.DRAW_MODE_NONE ||
		   mode === NPMapLib.DRAW_MODE_RECT ||
		   mode === NPMapLib.DRAW_MODE_CIRCLE ||
		   mode === NPMapLib.DRAW_MODE_POLYLINE ||
		   mode === NPMapLib.DRAW_MODE_POLYLGON)
            this._mode = mode;
        if (!this._isStartUp)
            return;

        var mapAdapter = NPMapLib.Adapter.AdapterFactory.getMapAdapter(this.mapId);
        if (mapAdapter)
            mapAdapter.drawing(this, callback);
    };

    //获取绘制模式
    e.prototype.getMode = function () {
        return this._mode;
    };

    //启动
    e.prototype.startUp = function () {
        this._isStartUp = true;
    };

    //取消
    e.prototype.cancel = function () {
        if (!this._isStartUp)
            return;

        var mapAdapter = NPMapLib.Adapter.AdapterFactory.getMapAdapter(this.mapId);
        if (mapAdapter)
            mapAdapter.pan();
        this._isStartUp = false;
    };
})();
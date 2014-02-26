/*
 *比例尺控件
 */
(function() {
    var e = NPMapLib.Controls.ScaleControl = function() {
        this.controlType = NPMapLib.CONTROL_TYPE_SCALE;
        this.anchor = NPMapLib.CONTROL_ANCHOR_BOTTOM_RIGHT; //停靠窗口右下

        this._unit = NPMapLib.MAP_UNITS_KILOMETERS; 		//默认公里
    };

    e.prototype = new NPMapLib.Control;
    //获取长度单位
    e.prototype.getUnit = function() {
        return this._unit;
    };

    //设置长度单位
    e.prototype.setUnit = function(unit) {
        if (!(unit instanceof NPMapLib.Enums.Units) ||
			this._unit === unit)
            return;

        this._unit = unit;
    };

    //显示
    e.prototype.show = function() {
        if (this.visible)
            return;
        var mapAdapter = NPMapLib.Adapter.AdapterFactory.getMapAdapter(this.mapId);
        if (mapAdapter)
            mapAdapter.showScaleControl();
        this.visible = !this.visible;
    };

    //隐藏
    e.prototype.hide = function() {
        if (!this.visible)
            return;

        var mapAdapter = NPMapLib.Adapter.AdapterFactory.getMapAdapter(this.mapId);
        if (mapAdapter)
            mapAdapter.hideScaleControl();
        this.visible = !this.visible;
    };

    //设置控件停靠的偏移量
    e.prototype.setOffset = function(offset) {
        this.offset = offset;
    };

    //设置控件停靠位置
    e.prototype.setAnchor = function(anchor) {
        if (!(anchor instanceof NPMapLib.Enums.ControlAnchor) ||
			this.anchor === anchor)
            return;

        this.anchor = anchor;
    };
})();
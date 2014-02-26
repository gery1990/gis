//鹰眼控件
(function() {
    var e = NPMapLib.Controls.OverviewControl = function() {
        this.controlType = NPMapLib.CONTROL_TYPE_OVERVIEW;
        this.anchor = NPMapLib.CONTROL_ANCHOR_BOTTOM_RIGHT; //停靠窗口右下

        this._isOpen = true; 							//开合状态，默认为开
    };

    e.prototype = new NPMapLib.Control;

    //设置开合状态
    e.prototype.changeView = function(isOpen) {
        if (this._isOpen === isOpen)
            return;
        var mapAdapter = NPMapLib.Adapter.AdapterFactory.getMapAdapter(this.mapId);
        if (!mapAdapter)
            return;

        if (isOpen)
            mapAdapter.showOverviewControl();
        else
            mapAdapter.hideOverviewControl();
        this._isOpen = isOpen;
    };

    //显示
    e.prototype.show = function() {
        if (this.visible)
            return;
        var mapAdapter = NPMapLib.Adapter.AdapterFactory.getMapAdapter(this.mapId);
        if (mapAdapter)
            mapAdapter.addOverviewControl();

        this.visible = !this.visible;
    };

    //隐藏
    e.prototype.hide = function() {
        if (!this.visible)
            return;
        var mapAdapter = NPMapLib.Adapter.AdapterFactory.getMapAdapter(this.mapId);

        if (mapAdapter)
            mapAdapter.removeOverviewControl();
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
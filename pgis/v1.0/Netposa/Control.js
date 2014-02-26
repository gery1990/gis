/*!
* 控件(基类)
*/
(function() {
    var e = NPMapLib.Control = function() {
        this.id = -1;
        this.controlType = NPMapLib.CONTROL_TYPE_UNKNOWN;
        this.offset = new NPMapLib.Geometry.Size(0, 0);
        this.visible = false;
        this.mapId = -1;
        this.anchor;
    };

    //是否显示
    e.prototype.isVisible = function() {
        return this.visible;
    };

    //返回控件停靠的偏移量
    e.prototype.getOffset = function() {
        return this.offset;
    };

    //获取控件停靠位置
    e.prototype.getAnchor = function() {
        return this.anchor;
    };

    //显示(由继承类实现)
    e.prototype.show = function() {
    };

    //隐藏(由继承类实现)
    e.prototype.hide = function() {
    };

    //设置控件停靠的偏移量(由继承类实现)
    e.prototype.setOffset = function(offset) {
    };

    //设置控件停靠位置(由继承类实现)
    e.prototype.setAnchor = function(anchor) {
    };

})();
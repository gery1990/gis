/*
 *版权控件
 */
 (function() {
     var e = NPMapLib.Controls.CopyRightControl = function(info) {
         this.controlType = NPMapLib.CONTROL_TYPE_COPYRIGHT;
         this.anchor = NPMapLib.CONTROL_ANCHOR_BOTTOM_LEFT;

         this._info = (info) ? info : "NetPosa";
     };

     e.prototype = new NPMapLib.Control;
     //设置版权信息
     e.prototype.setInfo = function(info) {
         this._info = info;
         var mapAdapter = NPMapLib.Adapter.AdapterFactory.getMapAdapter(this.mapId);

         if (mapAdapter)
             mapAdapter.setCopyRight(this._info);
     };

     //获取版权信息
     e.prototype.getInfo = function() {
         return this._info;
     };

     //显示
     e.prototype.show = function() {
         if (this.visible)
             return;

         var mapAdapter = NPMapLib.Adapter.AdapterFactory.getMapAdapter(this.mapId);
         if (mapAdapter) {
             mapAdapter.setCopyRight(this._info);
             mapAdapter.showCopyRightControl();
         }
         this.visible = !this.visible;
     };

     //隐藏
     e.prototype.hide = function() {
         if (!this.visible)
             return;

         var mapAdapter = NPMapLib.Adapter.AdapterFactory.getMapAdapter(this.mapId);
         if (mapAdapter)
             mapAdapter.hideCopyRightControl();
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
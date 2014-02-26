//导航控件
(function() {
	var e = NPMapLib.Controls.NavigationControl = function() {
		this.controlType = NPMapLib.CONTROL_TYPE_NAVIGATION;
		this.anchor = NPMapLib.CONTROL_ANCHOR_TOP_LEFT;	//停靠窗口左上

		this._levelBarVisible = false;
	};

	e.prototype = new NPMapLib.Control;
	//显示级别条
	e.prototype.showLevelBar = function() {
		if(this._levelBarVisible)
			return;
		
		this._levelBarVisible = true;	
	};

	//隐藏级别条
	e.prototype.hideLevelBar = function() {
		if(!this._levelBarVisible)
			return;
		
		this._levelBarVisible = false;	
	};

	//显示
	e.prototype.show = function() {
		if(this.visible)
			return;

		var mapAdapter =NPMapLib.Adapter.AdapterFactory.getMapAdapter(this.mapId);
		if(mapAdapter)
			mapAdapter.showNavigationControl();
		this.visible = !this.visible;
	};

	//隐藏
	e.prototype.hide = function() {
		if(!this.visible)
			return;
		
		var mapAdapter =NPMapLib.Adapter.AdapterFactory.getMapAdapter(this.mapId);
		if(mapAdapter)
			mapAdapter.hideNavigationControl();
		this.visible = !this.visible;
	};

	//设置控件停靠的偏移量
	e.prototype.setOffset = function(offset) {
		this.offset = offset;
	};

	//设置控件停靠位置
	e.prototype.setAnchor = function(anchor){
		if(!(anchor instanceof NPMapLib.Enums.ControlAnchor) || 
			this.anchor === anchor)
			return;

		this.anchor = anchor;
	};
})();
var MapToolInterface = new Class({
    //刷新
	refreshOperate: function(){
		if(_mapUtils === null) return;
		window.location.reload();
	},

	//光标(或默认状态)
	pan: function(){
		if(_mapUtils === null) return;
		_mapUtils.pan();
	},
	
	//全图
	fullExtent: function() {
		if(_mapUtils === null) return;
		_mapUtils.fullExtent();
	},
	
	//放大(拉框)
	zoomIn: function() {
		if(_mapUtils === null) return;
		_mapUtils.zoomIn();
	},
	
	//缩小(拉框)
	zoomOut: function() {
		if(_mapUtils === null) return;
			_mapUtils.zoomOut();
	},

    //固定放大
	zoomInFixed: function() {
		if(_mapUtils === null) return;
		_mapUtils.zoomInFixed();
	},

    //固定缩小
	zoomOutFixed: function() {
		 if(_mapUtils === null) return;
			_mapUtils.zoomOutFixed();
	},
    
    //显示/隐藏鹰眼
	setOverViewVisible:function(isShow){
		if(_mapUtils === null) return;
	    _mapUtils.setOverViewVisible(isShow);
	},

	//设置鹰眼框大小
	setOverViewSize:function(width, height){
		if(_mapUtils === null) return;
		_mapUtils.setOverViewSize(width, height);
	},

	//是否显示地图服务切换按钮
	setSwitchMapServerControlOnMapVisible:function(visible){
		if(_mapUtils === null) return;
		_mapUtils.setSwitchMapServerControlOnMapVisible(visible);
	},

	//测量长度
	measureLength: function() {
		if(_mapUtils === null) return;
		_mapUtils.measureLength();
	},

	//测量面积
	measureArea: function() {
		if(_mapUtils === null) return;
		_mapUtils.measureArea();
	},
	
	//切换地图服务,0--矢量地图，1--影像地图，2--矢量叠加地图
	switchMapServer: function(index) {
		if(_mapUtils === null) return;
		_mapUtils.switchMapServer(index);
	},
	
	//显示和隐藏名称
	setMarkerTitleVisible:function(visible){
		if(_markerModelManager === null) 
			return;
		_markerModelManager.setMarkerTitleVisible(visible);

		if(_defenseManager === null)
			return;
		_defenseManager.setEmergencyNameVisible(visible);
	},

	//导出地图
	downloadMap:function(){
		if(_mapUtils === null) return;
		_mapUtils.downloadMap();
	},

	//清除
	clear: function() {
		if(_markerClusterer !== null)
			_markerClusterer.clear();
		if(_mapUtils !== null)
			_mapUtils.clear();
	}
});
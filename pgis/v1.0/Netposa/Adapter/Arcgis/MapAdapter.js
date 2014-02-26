NPNamespace.register("NPMapLib.Adapter.Arcgis");

/*!
 * 地图适配器－－与地图相关的操作接口
*/
(function() {
	var _container;
	var _opts;
	var _map;
	var e = NPMapLib.Adapter.Arcgis.MapAdapter = function(container, opts) {
		_container = container;
		_opts = opts;
		_map = null;
		dojo.addOnLoad(this._initialize);
	};

	//初始化
	e.prototype._initialize = function(){
		_map = new esri.Map(_container);
		var onLineChinaMapServiceLayer = new esri.layers.ArcGISTiledMapServiceLayer("http://cache1.arcgisonline.cn/ArcGIS/rest/services/ChinaCities_Community_BaseMap_CHN/BeiJing_Community_BaseMap_CHN/MapServer");
        _map.addLayer(onLineChinaMapServiceLayer);
	};

	//平移
	e.prototype.pan = function(){

	};
})();
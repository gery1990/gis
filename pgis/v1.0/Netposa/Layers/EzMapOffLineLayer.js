/*
 *PGis切片离线图层
 */
(function(){
	var e = NPMapLib.Layers.EzMapOffLineLayer = function(url, name, opts) {
		this._opts = opts;
		this.url = url;
		this.name = name;
		this._initialize();
	};

	e.prototype = new NPMapLib.Layer;

	//初始化
	e.prototype._initialize = function(){
		EzServerClient.GlobeParams.MyMapType = NPMapLib.MAP_LAYER_TYPE_EZMAP_OFFLINE;
		EzServerClient.GlobeParams.IsLocal = true;
		if(!this._opts || this._opts === null)
			return;

		if(this._opts.centerPoint)
			EzServerClient.GlobeParams.CenterPoint = this._opts.centerPoint;
		if(this._opts.fullExtent)
			EzServerClient.GlobeParams.MapFullExtent = this._opts.fullExtent;
		if(this._opts.minLevel)
			this.minLevel = EzServerClient.GlobeParams.MapInitLevel = this._opts.minLevel;
		if(this._opts.maxLevel)
			EzServerClient.GlobeParams.MapMaxLevel = this._opts.maxLevel;
		if(this._opts.zoomOffset)
			EzServerClient.GlobeParams.ZoomOffset = this._opts.zoomOffset;
		if(this._opts.tilePixels)
			EzServerClient.GlobeParams.MapUnitPixels = this._opts.tilePixels;
		if(this._opts.zoomLevelSequence)
			EzServerClient.GlobeParams.ZoomLevelSequence = this._opts.zoomLevelSequence;

		EzServerClient.GlobeParams.MapCoordinateType = 1;

		this.maxLevel = EzServerClient.GlobeParams.MapMaxLevel - EzServerClient.GlobeParams.ZoomOffset;
	};

	//设置切片图片格式
	e.prototype.setTileImageFormat = function(imageFormat){
		if(imageFormat === NPMapLib.IMAGE_FORMAT_JPEG)
			EzServerClient.GlobeParams.TileImageFormat = NPMapLib.IMAGE_FORMAT_JPEG;
		else if(imageFormat === NPMapLib.IMAGE_FORMAT_BMP)
			EzServerClient.GlobeParams.TileImageFormat = NPMapLib.IMAGE_FORMAT_BMP;
		else
			EzServerClient.GlobeParams.TileImageFormat = NPMapLib.IMAGE_FORMAT_PNG;
	};
})();
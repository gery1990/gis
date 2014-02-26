/*
 *Google在线地图图层
 */
(function(){
	var e = NPMapLib.Layers.GoogleMapTileLayer = function(url, name, opts) {
		this.url = url;
		this.name = name;
		this._opts = opts;
		this._initialize();
	};

	e.prototype = new NPMapLib.Layer;
	//???
	e.prototype._initialize = function(){
		EzServerClient.GlobeParams.MyMapType = NPMapLib.MAP_LAYER_TYPE_GOOGLE_TILE;
		EzServerClient.GlobeParams.IsLocal = false;
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

		EzServerClient.GlobeParams.MapCoordinateType = 114699;
		_MapSpanScale = 114699;
		this.maxLevel = EzServerClient.GlobeParams.MapMaxLevel - EzServerClient.GlobeParams.ZoomOffset;
	};
})();

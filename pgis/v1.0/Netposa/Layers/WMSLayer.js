/*
*openlayer
*/
(function() {
    var e = NPMapLib.Layers.WMSLayer = function(url,name,opts) {
        this.name = name;
        this.url = url;
        this._opts = opts;
        this._initialize();
    };

    e.prototype = new NPMapLib.Layer;
    e.prototype._initialize = function() {
        OpenLayersClient.GlobeParams.MyMapType = NPMapLib.MAP_LAYER_TYPE_WMS;
        OpenLayersClient.GlobeParams.IsLocal = false;
        if (!this._opts || this._opts === null) {
            return;
        }
        if (this._opts.layerName)
            this.layerName = this._opts.layerName;
        if (this._opts.projection)
            this.projection = this._opts.projection;
        if (this._opts.fullExtent)
            this.fullExtent = this._opts.fullExtent;
        if (this._opts.minLevel) 
            this.minLevel = this._opts.minLevel;
        if (this._opts.maxLevel) 
            this.maxLevel = this._opts.maxLevel;
        this.tiled=this._opts.tiled;
        this.buffer = this._opts.buffer;
        if (this._opts.format) 
            this.format=this._opts.format;
        if(this._opts.mapUnitPixels)
            this.mapUnitPixels=this._opts.mapUnitPixels;
        if(this._opts.buffer)
            this.buffer=this._opts.buffer;
        if(this._opts.reproject)
            this.reproject=this._opts.reproject;
        if(this._opts.isBaseLayer)
            this.isBaseLayer=this._opts.isBaseLayer;
    };
})();

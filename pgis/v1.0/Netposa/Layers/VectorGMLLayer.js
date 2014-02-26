/*
*GML矢量图层
*openlayer
*/
(function() {
    var e = NPMapLib.Layers.VectorGMLLayer = function(url,name,opts) {
        this.url=url;                        //图层数据连接地址
        this.name = name;                    //图层名称
        this._opts = opts;                   //图层相关参数
        this._initialize();
    };

    e.prototype = new NPMapLib.Layer;
    e.prototype._initialize = function() {
        OpenLayersClient.GlobeParams.MyMapType = NPMapLib.MAP_LAYER_TYPE_VECTORGML;
        OpenLayersClient.GlobeParams.IsLocal = false;
        if (!this._opts || this._opts === null) {
            return;
        }
        if (this._opts.layerName)
            this.layerName = this._opts.layerName;
        if (this._opts.geometryType)
            this.geometryType = this._opts.geometryType;
        if (this._opts.styles)
            this.styles = this._opts.styles;
    };
})();

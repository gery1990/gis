
/*!
 * NPMapLib.Symbols.Icon构造函数的可选参数
 */
(function(){
	var e = NPMapLib.Symbols.IconOptions = {
		anchor: new NPMapLib.Geometry.Size(0, 0)			//图标的定位锚点
	};
})();

/*!
 * 标注覆盖物所使用的图标
 */
(function() {
	var e = NPMapLib.Symbols.Icon = function(imageUrl, size, opts) {
		this.id = -1;
		if(!(size instanceof NPMapLib.Geometry.Size))
			return;
		
		this._imageUrl = imageUrl;		//图标所用图片资源的路径
		this._imageSize = size;			//图标所用的图片的大小
		this._anchor = new NPMapLib.Geometry.Size(0, 0);

		if(!opts)
			return;

		if(opts.anchor)
			this.anchor = opts.anchor;		//图标的定位点相对于图标左上角的偏移值。
	};

	//设置图片资源的路径
	e.prototype.setImageUrl = function(imageUrl){
		if(typeof imageUrl !== "string")
			return;
		this._imageUrl = imageUrl;
	};

	//返回图片资源的路径
	e.prototype.getImageUrl = function(){
		return this._imageUrl;
	};

	//设置图标可视区域的大小
	e.prototype.setImageSize = function(size){
		if (!(size instanceof NPMapLib.Geometry.Size))
			return;
		this._imageSize = size;
	};

	//返回图标可视区域的大小
	e.prototype.getImageSize = function(){
		return this._imageSize;
	};

	//设置图标定位点相对于其左上角的偏移值
	e.prototype.setAnchor = function(anchor){
		if (!(anchor instanceof NPMapLib.Geometry.Size))
			return;
		this._anchor = anchor;
	};

	//返回图标定位点相对于其左上角的偏移值
	e.prototype.getAnchor = function(){
		return this._anchor;
	};
    //开启编辑功能
	e.prototype.enableEditing = function(){
	  var mapAdapter = NPMapLib.Adapter.AdapterFactory.getMapAdapter(this.mapId);
		if(mapAdapter)
			mapAdapter.enableEditing(this);
	};

	//关闭编辑功能
	e.prototype.disableEditing = function(){
        var mapAdapter = NPMapLib.Adapter.AdapterFactory.getMapAdapter(this.mapId);
		if(mapAdapter)
			mapAdapter.disableEditing(this);
	};
})();
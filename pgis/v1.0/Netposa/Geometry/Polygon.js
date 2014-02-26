/*!
 * 事件
 */
 NPMapLib.POLYGON_EVENT_CLICK = 'click';
 NPMapLib.POLYGON_EVENT_DBLCLICK = 'dblclick';
 NPMapLib.POLYGON_EVENT_RIGHT_CLICK = 'rightclick';
 NPMapLib.POLYGON_EVENT_MOUSE_DOWN = 'mousedown';
 NPMapLib.POLYGON_EVENT_MOUSE_UP = 'mouseup';
 NPMapLib.POLYGON_EVENT_MOUSE_OVER = 'mouseover';
 NPMapLib.POLYGON_EVENT_MOUSE_OUT = 'mouseout';
 NPMapLib.POLYGON_EVENT_LINE_UPDATE = 'lineupdate';

//事件参考
//@描述：点击标注后会触发此事件  关键字：click  参数：event{type, target(point)}
//@描述：双击标注后会触发此事件  关键字：dblclick  参数：event{type, target(point)}
//@描述：右键点击标注时触发此事件  关键字：rightclick  参数：event{type, target(point)}
//@描述：鼠标在标注上按下触发此事件  关键字：mousedown  参数：event{type, target(point)}
//@描述：鼠标在标注上释放触发此事件  关键字：mouseup  参数：event{type, target(point)}
//@描述：当鼠标进入标注区域时会触发此事件  关键字：mouseover  参数：event{type, target(point)}
//@描述：鼠标离开标注时触发此事件  关键字：mouseout  参数：event{type, target(point)}
//@描述：覆盖物的属性发生变化时触发  关键字：lineupdate  参数：event{type, target()}

/*!
 * NPMapLib.Geometry.Polygon构造函数的可选参数
 */
(function(){
	var e = NPMapLib.Geometry.PolygonOptions = {
		color:"blue",				//边线颜色
		fillColor:"red",			//填充颜色
		weight:2,					//边线的宽度，以像素为单位
		opacity:1,					//边线透明度，取值范围0-1
		fillOpacity:0.5,			//填充的透明度，取值范围0-1
		lineStyle:NPMapLib.LINE_TYPE_SOLID,	//边线的样式
		enableEditing:false,			//是否启用编辑，默认为false
		enableClicking:true				//是否响应点击事件，默认为true
	};
})();

/*!
 * 多边形
 */
(function() {
	var e = NPMapLib.Geometry.Polygon = function(points, opts) {
		this.overlayType = NPMapLib.OVERLAY_TYPE_POLYGON;
		this._points = points;
		this._color = "blue";
		this._fillColor = "red";
		this._weight = 2;
		this._opacity = 1;
		this._fillOpacity = 0.5;
		this._lineStyle = NPMapLib.LINE_TYPE_SOLID;
		this._enableEditing = false;
		this._enableClicking = true;

		if(!opts)
			return;

		if(opts.color)
			this._color = opts.color;
		if(opts.fillColor)
			this._fillColor = opts.fillColor;
		if(opts.weight)
			this._weight = opts.weight;
		if(opts.opacity)
			this._opacity = opts.opacity;
		if(opts.fillOpacity)
			this._fillOpacity = opts.fillOpacity;
		if(opts.lineStyle)
			this._lineStyle = opts.lineStyle;
		if(opts.enableEditing)
			this._enableEditing = opts.enableEditing;
		if(opts.enableClicking)
			this._enableClicking = opts.enableClicking;
	};

	e.prototype = new NPMapLib.Overlay;
	
	//设置多边型的点数组
	e.prototype.setPath = function(path) {
		this._points = path;
	};

	//返回多边型的点数组
	e.prototype.getPath = function() {
		return this._points;
	};

	//设置多边型的边线颜色
	e.prototype.setColor = function(color) {
		this._color = color;
	};

	//返回多边型的边线颜色
	e.prototype.getColor = function() {
		return this._color;
	};
    // 修改颜色
    e.prototype.changeColor = function (color) {
        this._color = color;
        if(this._apiObj){
              this._apiObj.div.style.stroke = color;
        }
    };
	//设置多边型的填充颜色
	e.prototype.setFillColor = function(color) {
		this._fillColor = color;
	};

	//返回多边型的填充颜色
	e.prototype.getFillColor = function() {
		return this._fillColor;
	};
     // 修改填充颜色
    e.prototype.changeFillColor = function (color) {
        this._fillColor = color;
        if(this._apiObj){
              this._apiObj.div.style.fill = color;
        }
    };
	//设置多边形的边线透明度，取值范围0 - 1。
	e.prototype.setOpacity = function(opacity) {
		this._opacity = opacity;
	};

	//返回多边形的边线透明度
	e.prototype.getOpacity = function() {
		return this._opacity;
	};

	//设置多边形的填充透明度，取值范围0 - 1。
	e.prototype.setFillOpacity = function(opacity) {
		this._fillOpacity = opacity;
	};

	//返回多边形的填充透明度
	e.prototype.getFillOpacity = function() {
		return this._fillOpacity;
	};

	//设置多边形边线的宽度，范围为大于等于1的整数
	e.prototype.setWeight = function(weight) {
		this._weight = weight;
	};

	//返回多边形边线的宽度。
	e.prototype.getWeight = function() {
		return this._weight;
	};

	//设置多边形边线样式
	e.prototype.setLineStyle = function(lineStyle) {
		this._lineStyle = lineStyle;
	};

	//返回多边形边线样式
	e.prototype.getLineStyle = function() {
		return this._lineStyle;
	};

	//返回覆盖物的地理区域范围
	e.prototype.getExtent = function(){
		var extent = new NPMapLib.Geometry.Extent(0, 0, 0, 0);
		var mapAdapter = NPMapLib.Adapter.AdapterFactory.getMapAdapter(this.mapId);
		if(mapAdapter)
			extent = mapAdapter.getOverlayExtent(this);
		return extent;
	};

	//开启编辑功能
	e.prototype.enableEditing = function(){
		if(this._enableEditing)
			return;
         var mapAdapter = NPMapLib.Adapter.AdapterFactory.getMapAdapter(this.mapId);
		if(mapAdapter)
			mapAdapter.enableEditing(this);
		this._enableEditing = true;
	};

	//关闭编辑功能
	e.prototype.disableEditing = function(){
		if(!this._enableEditing)
			return;
        var mapAdapter = NPMapLib.Adapter.AdapterFactory.getMapAdapter(this.mapId);
		if(mapAdapter)
			mapAdapter.disableEditing(this);
		this._enableEditing = false;
	};

	//修改指定位置的坐标
	e.prototype.setPositionAt = function(index, point){
		if(!this._points || index > this._points.length -1 || index <0)
			return;
		this._points.splice(index,0,point);
	};

	//添加事件监听函数
	e.prototype.addEventListener = function(event, handler){
		var mapAdapter = NPMapLib.Adapter.AdapterFactory.getMapAdapter(this.mapId);
		if(mapAdapter)
			mapAdapter.addEventListener(this, event, handler);
	};

	//移除事件监听函数
	e.prototype.removeEventListener = function(event){
		var mapAdapter = NPMapLib.Adapter.AdapterFactory.getMapAdapter(this.mapId);
		if(mapAdapter)
			mapAdapter.removeEventListener(this, event);
	};
})();
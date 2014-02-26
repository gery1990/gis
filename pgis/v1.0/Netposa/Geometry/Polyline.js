/*!
 * 事件
 */
 NPMapLib.POLYLINE_EVENT_CLICK = 'click';
 NPMapLib.POLYLINE_EVENT_DBLCLICK = 'dblclick';
 NPMapLib.POLYLINE_EVENT_RIGHT_CLICK = 'rightclick';
 NPMapLib.POLYLINE_EVENT_MOUSE_DOWN = 'mousedown';
 NPMapLib.POLYLINE_EVENT_MOUSE_UP = 'mouseup';
 NPMapLib.POLYLINE_EVENT_MOUSE_OVER = 'mouseover';
 NPMapLib.POLYLINE_EVENT_MOUSE_OUT = 'mouseout';
 NPMapLib.POLYLINE_EVENT_LINE_UPDATE = 'lineupdate';

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
 * NPMapLib.Geometry.Polyline构造函数的可选参数
 */
(function(){
	var e = NPMapLib.Geometry.PolylineOptions = {
		color:"blue",								//线颜色
		weight:2,									//线的宽度，以像素为单位
		opacity:1.0,								//线的透明度，取值范围0-1
		lineStyle:NPMapLib.LINE_TYPE_SOLID,			//线的样式
		arrowStyle:NPMapLib.LINE_ARROW_TYPE_NULL, 	//线的箭头样式
		enableEditing:false,						//是否启用线编辑，默认为false
		enableClicking:true							//是否响应点击事件，默认为true
	};
})();

/*!
 * 多段线
 */
(function() {
	var e = NPMapLib.Geometry.Polyline = function(points, opts) {
		this.overlayType = NPMapLib.OVERLAY_TYPE_POLYLINE;
		this._points = points;
		this._color = "blue";
		this._weight = 2;
		this._opacity = 1.0;
		this._lineStyle = NPMapLib.LINE_TYPE_SOLID;
		this._arrowStyle = NPMapLib.LINE_ARROW_TYPE_NULL;
		this._enableEditing = false;
		this._enableClicking = true;
		if(!opts)
			return;

		if(NPMapLib.Utils.BaseUtils.isTypeRight(opts.color, "string"))
			this._color = opts.color;
		if(NPMapLib.Utils.BaseUtils.isTypeRight(opts.weight, "int"))
			this._weight = opts.weight;
		if(NPMapLib.Utils.BaseUtils.isTypeRight(opts.opacity, "number"))
			this._opacity = opts.opacity;
		if(!NPMapLib.Utils.BaseUtils.isTypeRight(opts.lineStyle, "undefined"))
			this._lineStyle = opts.lineStyle;
		if(!NPMapLib.Utils.BaseUtils.isTypeRight(opts.arrowStyle, "undefined"))
			this._arrowStyle = opts.arrowStyle;
		if(NPMapLib.Utils.BaseUtils.isTypeRight(opts.enableEditing, "boolean"))
			this._enableEditing = opts.enableEditing;
		if(NPMapLib.Utils.BaseUtils.isTypeRight(opts.enableClicking, "boolean"))
			this._enableClicking = opts.enableClicking;
	};

	e.prototype = new NPMapLib.Overlay;
	
	//设置折线的点数组
	e.prototype.setPath = function(path) {
		this._points = path;
	};

	//返回折线的点数组
	e.prototype.getPath = function() {
		return this._points;
	};

	//设置折线的颜色
	e.prototype.setColor = function(color) {
		this._color = color;
	};

	//返回折线的颜色
	e.prototype.getColor = function() {
		return this._color;
	};
    // 修改颜色
    e.prototype.changeColor = function (color) {
        this._color = color;
        var map = NPMapLib.Adapter.AdapterFactory.getMapAdapter(this.mapId);
        if(map){
            map.changePolylineColor(this,color);
        }
    };
	//设置透明度，取值范围0 - 1。
	e.prototype.setOpacity = function(opacity) {
		if(opacity<0 || opacity > 1)
			return;
		this._opacity = opacity;
	};

	//返回透明度
	e.prototype.getOpacity = function() {
		return this._opacity;
	};

	//设置线的宽度，范围为大于等于1的整数
	e.prototype.setWeight = function(weight) {
		if(weight < 1)
			return;

		this._weight = weight;
	};

	//返回线的宽度。
	e.prototype.getWeight = function() {
		return this._weight;
	};

	//设置当前线样式
	e.prototype.setLineStyle = function(lineStyle) {
		this._lineStyle = lineStyle;
	};

	//返回当前线样式
	e.prototype.getLineStyle = function() {
		return this._lineStyle;
	};

	//设置箭头样式
	e.prototype.setArrowStyle = function(arrowStyle) {
		this._arrowStyle = arrowStyle;
	};

	//返回箭头样式
	e.prototype.getArrowStyle = function() {
		return this._arrowStyle;
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
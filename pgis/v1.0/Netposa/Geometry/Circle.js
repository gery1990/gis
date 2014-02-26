/*!
 * 事件
 */
 NPMapLib.CIRCLE_EVENT_CLICK = 'click';
 NPMapLib.CIRCLE_EVENT_DBLCLICK = 'dblclick';
 NPMapLib.CIRCLE_EVENT_RIGHT_CLICK = 'rightclick';
 NPMapLib.CIRCLE_EVENT_MOUSE_DOWN = 'mousedown';
 NPMapLib.CIRCLE_EVENT_MOUSE_UP = 'mouseup';
 NPMapLib.CIRCLE_EVENT_MOUSE_OVER = 'mouseover';
 NPMapLib.CIRCLE_EVENT_MOUSE_OUT = 'mouseout';
 NPMapLib.CIRCLE_EVENT_LINE_UPDATE = 'lineupdate';

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
 * NPMapLib.Geometry.Circle构造函数的可选参数
 */
(function(){
	var e = NPMapLib.Geometry.CircleOptions = {
		color:"blue",				//边线颜色
		fillColor:"red",			//填充颜色
		weight:2,					//边线的宽度，以像素为单位
		opacity:1,					//边线透明度，取值范围0 - 1
		fillOpacity:0.5,			//填充的透明度，取值范围0 - 1
		lineStyle:NPMapLib.LINE_TYPE_SOLID,	//边线的样式
		enableEditing:false,			//是否启用线编辑，默认为false
		enableClicking:true				//是否响应点击事件，默认为true
	};
})();

/*!
 * 圆形
 */
(function() {
	var e = NPMapLib.Geometry.Circle = function(center, radius, opts) {
		this.overlayType = NPMapLib.OVERLAY_TYPE_CIRCLE;
		this._center = center;
		this._radius = radius;
		this._color = "blue";
		this._fillColor = "red";
		this._opacity = 1;
		this._fillOpacity = 0.5;
		this._lineStyle = NPMapLib.LINE_TYPE_SOLID;
		this._weight = 2;
		this._enableClicking = true;

		if(NPMapLib.Utils.BaseUtils.isTypeRight(opts.color, "string"))
			this._color = opts.color;
		if(NPMapLib.Utils.BaseUtils.isTypeRight(opts.fillColor, "string"))
			this._fillColor = opts.fillColor;
		if(NPMapLib.Utils.BaseUtils.isTypeRight(opts.weight, "number"))
			this._weight = opts.weight;
		if(NPMapLib.Utils.BaseUtils.isTypeRight(opts.opacity, "number") && (opts.opacity >=0 && opts.opacity <= 1))
			this._opacity = opts.opacity;
		if(NPMapLib.Utils.BaseUtils.isTypeRight(opts.fillOpacity, "number") && (opts.fillOpacity >=0 && opts.fillOpacity <= 1))
			this._fillOpacity = opts.fillOpacity;
		if(NPMapLib.Utils.BaseUtils.isTypeRight(opts.lineStyle, "int"))
			this._lineStyle = opts.lineStyle;
		if(NPMapLib.Utils.BaseUtils.isTypeRight(opts.enableEditing, "boolean"))
			this._enableEditing = opts.enableEditing;
		if(NPMapLib.Utils.BaseUtils.isTypeRight(opts.enableClicking, "boolean"))
			this._enableClicking = opts.enableClicking;
 	};

	e.prototype = new NPMapLib.Overlay;
	
	//设置圆形的中心点坐标
	e.prototype.setCenter = function(center) {
		if(!NPMapLib.Utils.BaseUtils.isTypeRight(center, "NPMapLib.Geometry.Point"))
			return;

		this._center = center;
		var mapAdapter = NPMapLib.Adapter.AdapterFactory.getMapAdapter(this.mapId);
		if(mapAdapter)
			mapAdapter.setOverlayPosition(this, center);
	};

	//返回圆形的中心点坐标
	e.prototype.getCenter = function() {
		return this._center;
	};

	//设置圆形的半径，单位为米
	e.prototype.setRadius = function(radius) {
		if(!NPMapLib.Utils.BaseUtils.isTypeRight(radius, "number"))
			return;
		this._radius = radius;

	};

	//返回圆形的半径，单位为米
	e.prototype.getRadius = function() {
		return this._radius;
	};

	//设置圆形的边线颜色
	e.prototype.setColor = function(color) {
		if(!NPMapLib.Utils.BaseUtils.isTypeRight(color, "string"))
			return;
		this._color = color;
	};
      // 修改颜色
    e.prototype.changeColor = function (color) {
        if(!NPMapLib.Utils.BaseUtils.isTypeRight(color, "string")){
			return;
            }
        this._color = color;
        if(this._apiObj){
              this._apiObj.div.style.stroke = color;
        }
    };
       // 修改填充颜色
    e.prototype.changeFillColor = function (color) {
        if(!NPMapLib.Utils.BaseUtils.isTypeRight(color, "string"))
			return;
        this._fillColor = color;
        if(this._apiObj){
              this._apiObj.div.style.fill = color;
        }
    };
	//返回圆形的边线颜色
	e.prototype.getColor = function() {
		return this._color;
	};
    e.prototype.changelineStyle = function(lineStyle)    {
        this._lineStyle = lineStyle;
        if(this._apiObj){
             //this._apiObj.div.style
        }
    };
	//设置圆形的填充颜色
	e.prototype.setFillColor = function(color) {
		if(!NPMapLib.Utils.BaseUtils.isTypeRight(color, "string"))
			return;

		this._fillColor = color;
	};

	//返回圆形的填充颜色
	e.prototype.getFillColor = function() {
		return this._fillColor;
	};

	//设置透明度，取值范围0 - 1。
	e.prototype.setOpacity = function(opacity) {
		if(!NPMapLib.Utils.BaseUtils.isTypeRight(opacity, "number") || (opacity <0 || opacity > 1))
			return;

		this._opacity = opacity;
	};

	//返回透明度
	e.prototype.getOpacity = function() {
		return this._opacity;
	};

	//设置圆形的填充透明度，取值范围0 - 1。
	e.prototype.setFillOpacity = function(opacity) {
		this._fillOpacity = opacity;

	};

	//返回圆形的填充透明度
	e.prototype.getFillOpacity = function() {
		return this._fillOpacity;
	};

	//设置圆形的宽度，范围为大于等于1的整数
	e.prototype.setWeight = function(weight) {
		if(weight || this._weight === weight)
			return;

		this._weight = weight;
		
	};

	//返回圆形的宽度。
	e.prototype.getWeight = function() {
		return this._weight;
	};

	//设置圆形边线的样式
	e.prototype.setLineStyle = function(lineStyle) {
		this._lineStyle = lineStyle;
	};

	//返回当前线样式状态
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
/*!
 * 事件
 */
 NPMapLib.INFOWINDOW_EVENT_CLOSE = 'close';
 NPMapLib.INFOWINDOW_EVENT_OPEN = 'open';
 NPMapLib.INFOWINDOW_EVENT_CLICK_CLOSE = 'clickclose';

//事件参考
//@描述：信息窗口被关闭时触发此事件  关键字：close  参数：event{type, target()}
//@描述：信息窗口被打开时触发此事件  关键字：open  参数：event{type, target()}
//@描述：点击信息窗口的关闭按钮时触发此事件  关键字：clickclose  参数：event{type, target()}

/*!
 * NPMapLib.Symbols.InfoWindow构造函数的可选参数
 */
(function(){
	var e = NPMapLib.Symbols.InfoWindowOptions = {
		width:260,				//信息窗宽度，单位像素
		height:180,				//信息窗高度，单位像素
		offset:new NPMapLib.Geometry.Size(0,0),				//信息窗位置偏移值
		arrow:true,				//是否带箭头
		enableCloseOnClick:true	//是否开启点击地图关闭信息窗口（默认开启）
	};
})();

/*!
 * 包含信息的窗口
 */
(function(){
	var e = NPMapLib.Symbols.InfoWindow = function(point,title, content, opts){
		this.overlayType = NPMapLib.OVERLAY_TYPE_INFOWIN,
		this.id = -1;
		this._title = title;
		this._content = content;
		this._position = point;
		this._isOpen = false;
		this._offset = new NPMapLib.Geometry.Size(0,0)
		this._width = 260;
		this._height = 180;
		this._arrow = true;
		this._enableCloseOnClick = true;
		this._eventHandle = {};
		if(!opts)
			return;

		if(opts.width)
			this._width = opts.width;

		if(opts.height)
			this._height = opts.height;

		if(opts.offset)
			this._offset = opts.offset;

		if(typeof(opts.arrow) === "boolean")
			this._arrow = opts.arrow;

		if(typeof(opts.enableCloseOnClick) === "boolean")
			this._enableCloseOnClick = opts.enableCloseOnClick;
	};
	e.prototype = new NPMapLib.Overlay;
	//打开
	e.prototype.open = function(x, y){
		if(this._isOpen)
			return;

		if(!this._popup){
			this._popup = new NPMapLib.Utils.Popup({
				arrow:this._arrow,
				caption:this._title,
				content:this._content,
				width:this._width,
				height:this._height
			});
		}

		this._popup.open(y + this._offset.height, x + this._offset.width, function(){
			this._actionEventHandle(NPMapLib.INFOWINDOW_EVENT_CLICK_CLOSE);
			this.close();
		}.bind(this));
		this._isOpen = true;
		
		this._actionEventHandle(NPMapLib.INFOWINDOW_EVENT_OPEN);
	};
	//设置标注的地理坐标
	e.prototype.setPosition = function(point){
		this._position = point;
	}; 

	//返回标注的地理坐标
	e.prototype.getPosition = function(){
		return this._position;
	};

	//设置标注的偏移值
	e.prototype.setOffset = function(offset){
		this._offset = offset;
	};

	//返回标注的偏移值
	e.prototype.getOffset = function(){
		return this._offset;
	};

	//关闭
	e.prototype.close = function(){
		if(!this._isOpen || !this._popup)
			return;

		this._popup.close();
		this._isOpen = false;
		this._actionEventHandle(NPMapLib.INFOWINDOW_EVENT_CLOSE);
	};

	//设置信息窗口的宽度，单位像素.取值范围：220 - 730
	e.prototype.setWidth = function(width){
		if(typeof width !== "number")
			return;

		this._width = width;
	};

	//设置信息窗口的高度，单位像素
	e.prototype.setHeight = function(height){
		if(typeof height !== "number")
			return;

		this._height = height;
	};

	//设置信息窗口标题
	e.prototype.setTitle = function(title){
		this._title = title;
	};

	//返回信息窗口标题
	e.prototype.getTitle = function(){
		return this._title;
	};

	//设置信息窗口内容
	e.prototype.setContent = function(content){
		this._content = content;
	};

	//返回信息窗口内容
	e.prototype.getContent = function(){
		return this._content;
	};

	//返回信息窗口的打开状态
	e.prototype.isOpen = function(){
		return this._isOpen;
	};

	//开启点击地图时关闭信息窗口
	e.prototype.enableCloseOnClick = function(){
		if(this._enableCloseOnClick)
			return;
		this._enableCloseOnClick = true;
	};

	//关闭点击地图时关闭信息窗口
	e.prototype.disableCloseOnClick = function(){
		if(!this._enableCloseOnClick)
			return;
		this._enableCloseOnClick = false;
	};

	//添加事件监听函数
	e.prototype.addEventListener = function(event, handler){
		if(!this._eventHandle[event] && (event === NPMapLib.INFOWINDOW_EVENT_CLOSE ||
			event === NPMapLib.INFOWINDOW_EVENT_OPEN ||
			event === NPMapLib.INFOWINDOW_EVENT_CLICK_CLOSE))
			this._eventHandle[event] = handler;
	};

	//移除事件监听函数
	e.prototype.removeEventListener = function(event){
		if(this._eventHandle[event])
			delete this._eventHandle[event];
	};

	//执行事件监听函数
	e.prototype._actionEventHandle = function(event){
		var handle = this._eventHandle[event];
		if(handle)
			handle();
	};
     e.prototype.GetApiObjDiv = function () {
        try {
            return this._popup._domElement;
        }
        catch (e) {
            return null;
        }
    };
     // 设置config 重新生成popup
    e.prototype.redraw = function () {
      var config = {
				arrow:this._arrow,
				caption:this._title,
				content:this._content,
				width:this._width,
				height:this._height
			};
        this._popup.setconfig(config);
    };
})();
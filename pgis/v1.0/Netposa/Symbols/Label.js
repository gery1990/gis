/*!
 * 事件
 */
 NPMapLib.LABEL_EVENT_CLICK = 'click';
 NPMapLib.LABEL_EVENT_DBLCLICK = 'dblclick';
 NPMapLib.LABEL_EVENT_RIGHT_CLICK = 'rightclick';
 NPMapLib.LABEL_EVENT_MOUSE_DOWN = 'mousedown';
 NPMapLib.LABEL_EVENT_MOUSE_UP = 'mouseup';
 NPMapLib.LABEL_EVENT_MOUSE_OVER = 'mouseover';
 NPMapLib.LABEL_EVENT_MOUSE_OUT = 'mouseout';
 NPMapLib.LABEL_EVENT_DRAG_START = 'dragstart';
 NPMapLib.LABEL_EVENT_DRAG_END = 'dragend';

//事件参考
//@描述：点击标注后会触发此事件  关键字：click  参数：event{type, target(point)}
//@描述：双击标注后会触发此事件  关键字：dblclick  参数：event{type, target(point)}
//@描述：右键点击标注时触发此事件  关键字：rightclick  参数：event{type, target(point)}
//@描述：鼠标在标注上按下触发此事件  关键字：mousedown  参数：event{type, target(point)}
//@描述：鼠标在标注上释放触发此事件  关键字：mouseup  参数：event{type, target(point)}
//@描述：鼠标离开标注时触发此事件  关键字：mouseout  参数：event{type, target(point)}
//@描述：当鼠标进入标注区域时会触发此事件  关键字：mouseover  参数：event{type, target(point)}
//@描述：开始拖拽标注时触发此事件  关键字：dragstart  参数：event{type, target(point)}
//@描述：拖拽结束时触发此事件  关键字：dragend  参数：event{type, target(point)}


/*!
 * NPMapLib.Symbols.Label构造函数的可选参数
 */
(function(){
	var e = NPMapLib.Symbols.LabelOptions = {
		offset: new NPMapLib.Geometry.Size(0, 0),	//文本标注的位置偏移值
		position: new NPMapLib.Geometry.Point(0,0)	//文本标注的地理位置
	};

	var f = NPMapLib.Symbols.LabelStyles = {
		fontSize:12,			//文字大小
		fontFamily:'宋体',		//字体
		color:'red',			//文字前景色
		bgColor:'#FFFFFF',		//背景色
		bordColor:'#CCCCFF',	//边框颜色
		borderSize:1,			//边框宽度
		align:'center',			//对方方式
		isBold:false			//是否粗体
	};
})();

/*!
 * 文本标注
 */
(function() {
	var e = NPMapLib.Symbols.Label = function(content, opts) {
		this.overlayType = NPMapLib.OVERLAY_TYPE_LABEL;
		this._content = content;
		this._offset = new NPMapLib.Geometry.Size(0,0);
		this._fontSize = 12;			//文字大小
		this._fontFamily ='宋体';	//字体
		this._color ='red';			//文字前景色
		this._bgColor;				//背景色 '#FFFFFF'
		this._bordColor;				//边框颜色 '#CCCCFF'
		this._borderSize;			//边框宽度 1
		this._align = 'center';		//对方方式
		this._isBold = false;		//是否粗体
		if(!opts)
			return;

		if(opts.offset)
			this._offset = opts.offset;
		else
			this._offset = new NPMapLib.Geometry.Size(0, 0);

		if(opts.position)
			this._position = opts.position;
		else
			this._position = new NPMapLib.Geometry.Point(0, 0);
	};

	e.prototype = new NPMapLib.Overlay;

	//设置文本标注样式，该样式将作用于文本标注的容器元素上
	e.prototype.setStyle = function(styles){
		if(!styles)
			return;

		if(styles.fontSize)
			this._fontSize = styles.fontSize;
		if(styles.fontFamily)
			this._fontFamily = styles.fontFamily;
		if(styles.color)
			this._color = styles.color;
		if(styles.bgColor)
			this._bgColor = styles.bgColor;
		if(styles.bordColor)
			this._bordColor = styles.bordColor;
		if(styles.borderSize)
			this._borderSize = styles.borderSize;
		if(styles.isBold)
			this._isBold = styles.isBold;
		if(styles.align)
			this._align = styles.align;
	};

	//获取文本标注样式
	e.prototype.getStyle = function(){
		return {
				fontSize:this._fontSize,			
				fontFamily:this._fontFamily,		
				color:this._color,			
				bgColor:this._bgColor,		
				bordColor:this._bordColor,
				borderSize:this._borderSize,
				align:this._align,
				isBold:this._isBold
			};
	}; 

	//设置文本标注的内容
	e.prototype.setContent = function(content){
		this._content = content;
	};
    e.prototype.resetContent = function(content){
		this._content = content;
        var mapAdapter = NPMapLib.Adapter.AdapterFactory.getMapAdapter(this.mapId);
		if(mapAdapter){
             mapAdapter.resetContent(this,content);
        }

	};
	//获取内容
	e.prototype.getContent = function(){
		return this._content;
	};

	//设置文本标注坐标
	e.prototype.setPosition = function(position){
		this._position = position;
		var mapAdapter = NPMapLib.Adapter.AdapterFactory.getMapAdapter(this.mapId);
		if(mapAdapter)
			mapAdapter.setOverlayPosition(this, point);
	};

	//获取标注位置
	e.prototype.getPosition = function(){
		return this._position;	
	};

	//设置文本标注的偏移值
	e.prototype.setOffset = function(offset){
		this._offset = offset;
	};

	//返回文本标注的偏移值
	e.prototype.getOffset = function(){
		return this._offset;
	};

	//设置文本标注的标题
	e.prototype.setTitle = function(title){
		this._title = title;
	};

	//返回文本标注的标题
	e.prototype.getTitle = function(){
		return this._title;
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
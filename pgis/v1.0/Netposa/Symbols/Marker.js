/*!
* 事件
*/
NPMapLib.MARKER_EVENT_CLICK = 'click';
NPMapLib.MARKER_EVENT_DBLCLICK = 'dblclick';
NPMapLib.MARKER_EVENT_RIGHT_CLICK = 'rightclick';
NPMapLib.MARKER_EVENT_MOUSE_DOWN = 'mousedown';
NPMapLib.MARKER_EVENT_MOUSE_UP = 'mouseup';
NPMapLib.MARKER_EVENT_MOUSE_OVER = 'mouseover';
NPMapLib.MARKER_EVENT_MOUSE_OUT = 'mouseout';
NPMapLib.MARKER_EVENT_DRAG_START = 'dragstart';
NPMapLib.MARKER_EVENT_DRAG_END = 'dragend';

//事件参考
//@描述：点击标注图标后会触发此事件  关键字：click  参数：event{type, target(point)}
//@描述：双击标注图标后会触发此事件  关键字：dblclick  参数：event{type, target(point)}
//@描述：右键点击标注时触发此事件  关键字：rightclick  参数：event{type, target(point)}
//@描述：鼠标在标注上按下触发此事件  关键字：mousedown  参数：event{type, target(point)}
//@描述：鼠标在标注上释放触发此事件  关键字：mouseup  参数：event{type, target(point)}
//@描述：鼠标移入标注区域时触发此事件  关键字：mouseover  参数：{type, target(point)}
//@描述：当鼠标进入标注图标区域时会触发此事件  关键字：mouseover  参数：event{type, target(point)}
//@描述：鼠标离开标注时触发此事件  关键字：mouseout  参数：event{type, target(point)}
//@描述：开始拖拽标注时触发此事件  关键字：dragstart  参数：event{type, target(point)}
//@描述：拖拽结束时触发此事件  关键字：dragend  参数：event{type, target, target(point)}
//--------------------------------------------------------------------------------------------

/*!
* NPMapLib.Symbols.Marker构造函数的可选参数
*/
(function () {
    var e = NPMapLib.Symbols.MarkerOptions = {
        offset: new NPMapLib.Geometry.Size(0, 0), 		//标注的位置偏移值
        icon: null, 			//标注所用的图标对象
        enableDragging: true		//是否启用拖拽，默认为false
    };
})();


/**
* 声明baidu包
*/
var baidu = baidu || {
    guid: "$BAIDU$"
};

(function () {
    // 一些页面级别唯一的属性，需要挂载在window[baidu.guid]上
    window[baidu.guid] = {};

    /**
    * 将源对象的所有属性拷贝到目标对象中
    * @name baidu.extend
    * @function
    * @grammar baidu.extend(target, source)
    * @param {Object} target 目标对象
    * @param {Object} source 源对象
    * @returns {Object} 目标对象
    */
    baidu.extend = function (target, source) {
        for (var p in source) {
            if (source.hasOwnProperty(p)) {
                target[p] = source[p];
            }
        }
        return target;
    };

    /**
    * @ignore
    * @namespace
    * @baidu.lang 对语言层面的封装，包括类型判断、模块扩展、继承基类以及对象自定义事件的支持。
    * @property guid 对象的唯一标识
    */
    baidu.lang = baidu.lang || {};

    /**
    * 返回一个当前页面的唯一标识字符串。
    * @function
    * @grammar baidu.lang.guid()
    * @returns {String} 当前页面的唯一标识字符串
    */
    baidu.lang.guid = function () {
        return "TANGRAM__" + (window[baidu.guid]._counter++).toString(36);
    };

    window[baidu.guid]._counter = window[baidu.guid]._counter || 1;

    /**
    * 所有类的实例的容器
    * key为每个实例的guid
    */
    window[baidu.guid]._instances = window[baidu.guid]._instances || {};

    /**
    * Tangram继承机制提供的一个基类，用户可以通过继承baidu.lang.Class来获取它的属性及方法。
    * @function
    * @name baidu.lang.Class
    * @grammar baidu.lang.Class(guid)
    * @param {string} guid	对象的唯一标识
    * @meta standard
    * @remark baidu.lang.Class和它的子类的实例均包含一个全局唯一的标识guid。
    * guid是在构造函数中生成的，因此，继承自baidu.lang.Class的类应该直接或者间接调用它的构造函数。<br>
    * baidu.lang.Class的构造函数中产生guid的方式可以保证guid的唯一性，及每个实例都有一个全局唯一的guid。
    */
    baidu.lang.Class = function (guid) {
        this.guid = guid || baidu.lang.guid();
        window[baidu.guid]._instances[this.guid] = this;
    };

    window[baidu.guid]._instances = window[baidu.guid]._instances || {};

    /**
    * 判断目标参数是否string类型或String对象
    * @name baidu.lang.isString
    * @function
    * @grammar baidu.lang.isString(source)
    * @param {Any} source 目标参数
    * @shortcut isString
    * @meta standard
    *             
    * @returns {boolean} 类型判断结果
    */
    baidu.lang.isString = function (source) {
        return '[object String]' == Object.prototype.toString.call(source);
    };
    baidu.isString = baidu.lang.isString;

    /**
    * 判断目标参数是否为function或Function实例
    * @name baidu.lang.isFunction
    * @function
    * @grammar baidu.lang.isFunction(source)
    * @param {Any} source 目标参数
    * @returns {boolean} 类型判断结果
    */
    baidu.lang.isFunction = function (source) {
        return '[object Function]' == Object.prototype.toString.call(source);
    };

    /**
    * 自定义的事件对象。
    * @function
    * @name baidu.lang.Event
    * @grammar baidu.lang.Event(type[, target])
    * @param {string} type	 事件类型名称。为了方便区分事件和一个普通的方法，事件类型名称必须以"on"(小写)开头。
    * @param {Object} [target]触发事件的对象
    * @meta standard
    * @remark 引入该模块，会自动为Class引入3个事件扩展方法：addEventListener、removeEventListener和dispatchEvent。
    * @see baidu.lang.Class
    */
    baidu.lang.Event = function (type, target) {
        this.type = type;
        this.returnValue = true;
        this.target = target || null;
        this.currentTarget = null;
    };

    /**
    * 注册对象的事件监听器。引入baidu.lang.Event后，Class的子类实例才会获得该方法。
    * @grammar obj.addEventListener(type, handler[, key])
    * @param 	{string}   type         自定义事件的名称
    * @param 	{Function} handler      自定义事件被触发时应该调用的回调函数
    * @param 	{string}   [key]		为事件监听函数指定的名称，可在移除时使用。如果不提供，方法会默认为它生成一个全局唯一的key。
    * @remark 	事件类型区分大小写。如果自定义事件名称不是以小写"on"开头，该方法会给它加上"on"再进行判断，即"click"和"onclick"会被认为是同一种事件。 
    */
    baidu.lang.Class.prototype.addEventListener = function (type, handler, key) {
        if (!baidu.lang.isFunction(handler)) {
            return;
        } !this.__listeners && (this.__listeners = {});
        var t = this.__listeners,
                id;
        if (typeof key == "string" && key) {
            if (/[^\w\-]/.test(key)) {
                throw ("nonstandard key:" + key);
            } else {
                handler.hashCode = key;
                id = key;
            }
        }
        type.indexOf("on") != 0 && (type = "on" + type);
        typeof t[type] != "object" && (t[type] = {});
        id = id || baidu.lang.guid();
        handler.hashCode = id;
        t[type][id] = handler;
    };

    /**
    * 移除对象的事件监听器。引入baidu.lang.Event后，Class的子类实例才会获得该方法。
    * @grammar obj.removeEventListener(type, handler)
    * @param {string}   type     事件类型
    * @param {Function|string} handler  要移除的事件监听函数或者监听函数的key
    * @remark 	如果第二个参数handler没有被绑定到对应的自定义事件中，什么也不做。
    */
    baidu.lang.Class.prototype.removeEventListener = function (type, handler) {
        if (baidu.lang.isFunction(handler)) {
            handler = handler.hashCode;
        } else if (!baidu.lang.isString(handler)) {
            return;
        } !this.__listeners && (this.__listeners = {});
        type.indexOf("on") != 0 && (type = "on" + type);
        var t = this.__listeners;
        if (!t[type]) {
            return;
        }
        t[type][handler] && delete t[type][handler];
    };

    /**
    * 派发自定义事件，使得绑定到自定义事件上面的函数都会被执行。引入baidu.lang.Event后，Class的子类实例才会获得该方法。
    * @grammar obj.dispatchEvent(event, options)
    * @param {baidu.lang.Event|String} event 	Event对象，或事件名称(1.1.1起支持)
    * @param {Object} options 扩展参数,所含属性键值会扩展到Event对象上(1.2起支持)
    * @remark 处理会调用通过addEventListenr绑定的自定义事件回调函数之外，还会调用直接绑定到对象上面的自定义事件。
    * 例如：<br>
    * myobj.onMyEvent = function(){}<br>
    * myobj.addEventListener("onMyEvent", function(){});
    */
    baidu.lang.Class.prototype.dispatchEvent = function (event, options) {
        if (baidu.lang.isString(event)) {
            event = new baidu.lang.Event(event);
        } !this.__listeners && (this.__listeners = {});
        options = options || {};
        for (var i in options) {
            event[i] = options[i];
        }
        var i, t = this.__listeners,
                p = event.type;
        event.target = event.target || this;
        event.currentTarget = this;
        p.indexOf("on") != 0 && (p = "on" + p);
        baidu.lang.isFunction(this[p]) && this[p].apply(this, arguments);
        if (typeof t[p] == "object") {
            for (i in t[p]) {
                t[p][i].apply(this, arguments);
            }
        }
        return event.returnValue;
    };

    /**
    * @ignore
    * @namespace baidu.dom 
    * 操作dom的方法
    */
    baidu.dom = baidu.dom || {};

    /**
    * 从文档中获取指定的DOM元素
    * **内部方法**
    * 
    * @param {string|HTMLElement} id 元素的id或DOM元素
    * @meta standard
    * @return {HTMLElement} DOM元素，如果不存在，返回null，如果参数不合法，直接返回参数
    */
    baidu.dom._g = function (id) {
        if (baidu.lang.isString(id)) {
            return document.getElementById(id);
        }
        return id;
    };
    baidu._g = baidu.dom._g;

    /**
    * @ignore
    * @namespace baidu.event 屏蔽浏览器差异性的事件封装。
    * @property target 	事件的触发元素
    * @property pageX 		鼠标事件的鼠标x坐标
    * @property pageY 		鼠标事件的鼠标y坐标
    * @property keyCode 	键盘事件的键值
    */
    baidu.event = baidu.event || {};

    /**
    * 事件监听器的存储表
    * @private
    * @meta standard
    */
    baidu.event._listeners = baidu.event._listeners || [];

    /**
    * 为目标元素添加事件监听器
    * @name baidu.event.on
    * @function
    * @grammar baidu.event.on(element, type, listener)
    * @param {HTMLElement|string|window} element 目标元素或目标元素id
    * @param {string} type 事件类型
    * @param {Function} listener 需要添加的监听器
    * @remark
    * 
    1. 不支持跨浏览器的鼠标滚轮事件监听器添加<br>
    2. 改方法不为监听器灌入事件对象，以防止跨iframe事件挂载的事件对象获取失败
            
    * @shortcut on
    * @meta standard
    * @see baidu.event.un
    * @returns {HTMLElement|window} 目标元素
    */
    baidu.event.on = function (element, type, listener) {
        type = type.replace(/^on/i, '');
        element = baidu.dom._g(element);

        var realListener = function (ev) {
            listener.call(element, ev);
        },
                lis = baidu.event._listeners,
                filter = baidu.event._eventFilter,
                afterFilter, realType = type;
        type = type.toLowerCase();
        if (filter && filter[type]) {
            afterFilter = filter[type](element, type, realListener);
            realType = afterFilter.type;
            realListener = afterFilter.listener;
        }
        if (element.addEventListener) {
            element.addEventListener(realType, realListener, false);
        } else if (element.attachEvent) {
            element.attachEvent('on' + realType, realListener);
        }
        lis[lis.length] = [element, type, listener, realListener, realType];
        return element;
    };
    baidu.on = baidu.event.on;

    /**
    * 为目标元素移除事件监听器
    * @name baidu.event.un
    * @function
    * @grammar baidu.event.un(element, type, listener)
    * @param {HTMLElement|string|window} element 目标元素或目标元素id
    * @param {string} type 事件类型
    * @param {Function} listener 需要移除的监听器
    * @shortcut un
    * @meta standard
    * @see baidu.event.on
    *             
    * @returns {HTMLElement|window} 目标元素
    */
    baidu.event.un = function (element, type, listener) {
        element = baidu.dom._g(element);
        type = type.replace(/^on/i, '').toLowerCase();

        var lis = baidu.event._listeners,
                len = lis.length,
                isRemoveAll = !listener,
                item, realType, realListener;
        while (len--) {
            item = lis[len];
            if (item[1] === type && item[0] === element && (isRemoveAll || item[2] === listener)) {
                realType = item[4];
                realListener = item[3];
                if (element.removeEventListener) {
                    element.removeEventListener(realType, realListener, false);
                } else if (element.detachEvent) {
                    element.detachEvent('on' + realType, realListener);
                }
                lis.splice(len, 1);
            }
        }

        return element;
    };
    baidu.un = baidu.event.un;

    /**
    * 阻止事件的默认行为
    * @name baidu.event.preventDefault
    * @function
    * @grammar baidu.event.preventDefault(event)
    * @param {Event} event 事件对象
    * @meta standard
    */
    baidu.preventDefault = baidu.event.preventDefault = function (event) {
        if (event.preventDefault) {
            event.preventDefault();
        } else {
            event.returnValue = false;
        }
    };
})(); 
/*!
* 图像标记
*/
(function () {
    var e = NPMapLib.Symbols.Marker = function (point, opts) {
        this.overlayType = NPMapLib.OVERLAY_TYPE_MARKER;
        this._position = point;
        this._offset = new NPMapLib.Geometry.Size(0, 0);
        this._icon;
        this._label;
        this._x = this._y = 0;
        this._fM = this._fS = null;
        this._enableDragging = false;
       this._isSetEventDispath = false;
        if (!opts)
            return;

        if (opts.offset)
            this._offset = opts.offset;
        else
            this._offset = new NPMapLib.Geometry.Size(0, 0);

        if (opts.icon)
            this._icon = opts.icon;
    };

    e.prototype = new NPMapLib.Overlay;

    /////////////////////////////方法 　开始////////////////////////////
    //设置标注所用的图标对象
    e.prototype.setIcon = function (icon) {
        this._icon = icon;
    };
    
    //返回标注所用的图标对象
    e.prototype.getIcon = function () {
        return this._icon;
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
    //设置标注的地理坐标
    e.prototype.setPosition = function (point) {
        this._position = point;
        var mapAdapter = NPMapLib.Adapter.AdapterFactory.getMapAdapter(this.mapId);
        if (mapAdapter)
            mapAdapter.setOverlayPosition(this, point);
    };

    //返回标注的地理坐标
    e.prototype.getPosition = function () {
        return this._position;
    };

    //设置标注的偏移值
    e.prototype.setOffset = function (offset) {
        this._offset = offset;
    };

    //返回标注的偏移值
    e.prototype.getOffset = function () {
        return this._offset;
    };

    //为标注添加文本标注
    e.prototype.setLabel = function (label) {
        this._label = label;
        this._label.setPosition(this._position);
    };

    //返回标注的文本标注
    e.prototype.getLabel = function () {
        return this._label;
    };

    //显示文本
    e.prototype.showLabel = function () {
        if (!this._label)
            return;

        var mapAdapter = NPMapLib.Adapter.AdapterFactory.getMapAdapter(this.mapId);
        if (mapAdapter)
            mapAdapter.showMarkerLabel(this);
    };

    //隐藏文本
    e.prototype.hideLabel = function () {
        if (!this._label)
            return;

        var mapAdapter = NPMapLib.Adapter.AdapterFactory.getMapAdapter(this.mapId);
        if (mapAdapter)
            mapAdapter.hideMarkerLabel(this);
    };

    //设置标注的标题，当鼠标移至标注上时显示此标题
    e.prototype.setTitle = function (title) {

    };

    //返回标注的标题
    e.prototype.getTitle = function () {

    };

    //开启标注拖拽功能
    e.prototype.enableDragging = function () {
        this._enableDragging = true; 
        if(this._isSetEventDispath == false){
            this._setEventDispath();
        }
        this._isSetEventDispath = true;
    };
    // 修改当前label offset
    e.prototype.changeLabelOffset = function(offset){ 
       if (!this._label)
            return;
        var mapAdapter = NPMapLib.Adapter.AdapterFactory.getMapAdapter(this.mapId);
        if (mapAdapter)
            mapAdapter.changeLabelOffset(this,offset);
    };
    //关闭标注拖拽功能
    e.prototype.disableDragging = function () {
        this._enableDragging = false;
    };
    e.prototype._bindAsEventListener = function (object, fun) {
        return function (event) {
            return fun.call(object, (event || window.event));
        }
    };
    e.prototype._getPositionByEvent = function (e) {
        var e = window.event || e,
        x = e.pageX || e.clientX || 0,
        y = e.pageY || e.clientY || 0,
        pixel = new NPMapLib.Geometry.Pixel(x, y);
        var map = NPMapLib.Adapter.AdapterFactory.getMapAdapter(this.mapId);
        var point = map.pixelToPoint(pixel);
         return {
                "pixel": pixel,
                "point": point
            };
    };
    // 修改label 的文案
    e.prototype.resetLabelContent = function(content){
          if (!this._label)
            return;
          this._label.setContent(content);
          var map = NPMapLib.Adapter.AdapterFactory.getMapAdapter(this.mapId);
          if(map != null){
            map.resetLabelContent(this,content);
          }
    };
    // 修改位置后，重绘
    e.prototype.draw = function(){
       var mapAdapter = NPMapLib.Adapter.AdapterFactory.getMapAdapter(this.mapId);
       if (mapAdapter)
         mapAdapter.draw(this);
    };
     e.prototype._setEventDispath = function () {
            var me = this,
            div =  me._apiObj.div,
            isMouseDown = false,
            // 鼠标是否按下，用以判断鼠标移动过程中的拖拽计算
            startPosition = null; // 拖拽时，鼠标按下的初始位置，拖拽的辅助计算参数   
            var map = NPMapLib.Adapter.AdapterFactory.getMapAdapter(me.mapId); 
             var startPixel1 = map.pointToPixel(me._position);
             _log("startPixel.x"+startPixel1.x + "startPixel.y" + startPixel1.y);

        // 通过e参数获取当前鼠标所在位置
        function _getPositionByEvent(e) {
            var e = window.event || e,
                x = e.pageX || e.clientX || 0,
                y = e.pageY || e.clientY || 0,
                pixel = new NPMapLib.Geometry.Pixel(x, y),
                point = map.pixelToPoint(pixel);
            return {
                "pixel": pixel,
                "point": point
            };
        };
        // 鼠标移上事件
        div.onmouseover = function (e) {
            var position = _getPositionByEvent(e);
            /**
             * 鼠标移到Marker上时，派发事件的接口
             * @name RichMarker#onmouseover
             * @event
             * @param {Event Object} e 回调函数会返回event参数，包括以下返回值：
             * <br />{"<b>target</b> : {BMap.Overlay} 触发事件的元素,
             * <br />"<b>type</b>：{String} 事件类型,
             * <br />"<b>point</b>：{BMap.Point} 鼠标的物理坐标,
             * <br />"<b>pixel</b>：{BMap.Pixel} 鼠标的像素坐标}
             *
             * @example <b>参考示例：</b>
             * myRichMarkerObject.addEventListener("onmouseover", function(e) { 
             *     alert(e.type);  
             * });
             */
            _dispatchEvent(me, "onmouseover", {
                "point": position.point,
                "pixel": position.pixel
            });
            _stopAndPrevent(e);
        }

        // 鼠标移出事件
        div.onmouseout = function (e) {
            var position = _getPositionByEvent(e);
            /**
             * 鼠标移出Marker时，派发事件的接口
             * @name RichMarker#onmouseout
             * @event
             * @param {Event Object} e 回调函数会返回event参数，包括以下返回值：
             * <br />{"<b>target</b> : {BMap.Overlay} 触发事件的元素,
             * <br />"<b>type</b>：{String} 事件类型,
             * <br />"<b>point</b>：{BMap.Point} 鼠标的物理坐标,
             * <br />"<b>pixel</b>：{BMap.Pixel} 鼠标的像素坐标}
             *
             * @example <b>参考示例：</b>
             * myRichMarkerObject.addEventListener("onmouseout", function(e) { 
             *     alert(e.type);  
             * });
             */
            _dispatchEvent(me, "onmouseout", {
                "point": position.point,
                "pixel": position.pixel
            });
            _stopAndPrevent(e);
        }

        // 鼠标弹起事件
        var mouseUpEvent = function (e) {
                var position = _getPositionByEvent(e);
                /**
                 * 在Marker上弹起鼠标时，派发事件的接口
                 * @name RichMarker#onmouseup
                 * @event
                 * @param {Event Object} e 回调函数会返回event参数，包括以下返回值：
                 * <br />{"<b>target</b> : {BMap.Overlay} 触发事件的元素,
                 * <br />"<b>type</b>：{String} 事件类型,
                 * <br />"<b>point</b>：{BMap.Point} 鼠标的物理坐标,
                 * <br />"<b>pixel</b>：{BMap.Pixel} 鼠标的像素坐标}
                 *
                 * @example <b>参考示例：</b>
                 * myRichMarkerObject.addEventListener("onmouseup", function(e) { 
                 *     alert(e.type);  
                 * });
                 */
                _dispatchEvent(me, "onmouseup", {
                    "point": position.point,
                    "pixel": position.pixel
                });

                if (me._container.releaseCapture) {
                   _removeEventHandler(div, "onmousemove", mouseMoveEvent);
                   _removeEventHandler(div, "onmouseup", mouseUpEvent);
                } else {
                 _removeEventHandler(window, "onmousemove", mouseMoveEvent);
                   _removeEventHandler(window, "onmouseup", mouseUpEvent);
                }

                // 判断是否需要进行拖拽事件的处理
                if (!me._enableDragging) {
                    _stopAndPrevent(e);
                    return;
                }
                // 拖拽结束时，释放鼠标捕获
                me._container.releaseCapture && me._container.releaseCapture();
                /**
                 * 拖拽Marker结束时，派发事件的接口
                 * @name RichMarker#ondragend
                 * @event
                 * @param {Event Object} e 回调函数会返回event参数，包括以下返回值：
                 * <br />{"<b>target</b> : {BMap.Overlay} 触发事件的元素,
                 * <br />"<b>type</b>：{String} 事件类型,
                 * <br />"<b>point</b>：{BMap.Point} 鼠标的物理坐标,
                 * <br />"<b>pixel</b>：{BMap.Pixel} 鼠标的像素坐标}
                 *
                 * @example <b>参考示例：</b>
                 * myRichMarkerObject.addEventListener("ondragend", function(e) { 
                 *     alert(e.type);  
                 * });
                 */
                _dispatchEvent(me, "ondragend", {
                    "point": position.point,
                    "pixel": position.pixel
                });
                isMouseDown = false;
                startPosition = null;
                // 设置拖拽结束后的鼠标手型
                me._setCursor("dragend");
                // 拖拽过程中防止文字被选中
                me._container.style['MozUserSelect'] = '';
                me._container.style['KhtmlUserSelect'] = '';
                me._container.style['WebkitUserSelect'] = '';
                me._container['unselectable'] = 'off';
                me._container['onselectstart'] = function () {};

                _stopAndPrevent(e);
            }

            // 鼠标移动事件
        var mouseMoveEvent = function (e) {
                // 判断是否需要进行拖拽事件的处理
                if (!me._enableDragging || !isMouseDown) {
                    return;
                }
                var position = _getPositionByEvent(e);

                // 计算当前marker应该所在的位置
                var startPixel = map.pointToPixel(me._position);
                _log("startPixel.x"+startPixel.x + "startPixel.y" + startPixel.y);
                var x = position.pixel.x - startPosition.x + startPixel.x;
                var y = position.pixel.y - startPosition.y + startPixel.y;

                startPosition = position.pixel;
                me._position = map.pixelToPoint(new NPMapLib.Geometry.Pixel(x, y));
                me.draw();
                // 设置拖拽过程中的鼠标手型
                me._setCursor("dragging");
                /**
                 * 拖拽Marker的过程中，派发事件的接口
                 * @name RichMarker#ondragging
                 * @event
                 * @param {Event Object} e 回调函数会返回event参数，包括以下返回值：
                 * <br />{"<b>target</b> : {BMap.Overlay} 触发事件的元素,
                 * <br />"<b>type</b>：{String} 事件类型,
                 * <br />"<b>point</b>：{BMap.Point} 鼠标的物理坐标,
                 * <br />"<b>pixel</b>：{BMap.Pixel} 鼠标的像素坐标}
                 *
                 * @example <b>参考示例：</b>
                 * myRichMarkerObject.addEventListener("ondragging", function(e) { 
                 *     alert(e.type);  
                 * });
                 */
                _dispatchEvent(me, "ondragging", {
                    "point": position.point,
                    "pixel": position.pixel
                });
                _stopAndPrevent(e);
            }

            // 鼠标按下事件
            _addEventHandler(div, "onmousedown", function (e) {
                var position = _getPositionByEvent(e);
                /**
                 * 在Marker上按下鼠标时，派发事件的接口
                 * @name RichMarker#onmousedown
                 * @event
                 * @param {Event Object} e 回调函数会返回event参数，包括以下返回值：
                 * <br />{"<b>target</b> : {BMap.Overlay} 触发事件的元素,
                 * <br />"<b>type</b>：{String} 事件类型,
                 * <br />"<b>point</b>：{BMap.Point} 鼠标的物理坐标,
                 * <br />"<b>pixel</b>：{BMap.Pixel} 鼠标的像素坐标}
                 *
                 * @example <b>参考示例：</b>
                 * myRichMarkerObject.addEventListener("onmousedown", function(e) { 
                 *     alert(e.type);  
                 * });
                 */
                _dispatchEvent(me, "onmousedown", {
                    "point": position.point,
                    "pixel": position.pixel
                });

                if (me._container.setCapture) {
                   _addEventHandler(div, "onmousemove", mouseMoveEvent);
                   _addEventHandler(div, "onmouseup", mouseUpEvent);
                } else {
                   _addEventHandler(window, "onmousemove", mouseMoveEvent);
                    _addEventHandler(window, "onmouseup", mouseUpEvent);
                }

                // 判断是否需要进行拖拽事件的处理
                if (!me._enableDragging) {
                    _stopAndPrevent(e);
                    return;
                }
                startPosition = position.pixel;
                /**
                 * 开始拖拽Marker时，派发事件的接口
                 * @name RichMarker#ondragstart
                 * @event
                 * @param {Event Object} e 回调函数会返回event参数，包括以下返回值：
                 * <br />{"<b>target</b> : {BMap.Overlay} 触发事件的元素,
                 * <br />"<b>type</b>：{String} 事件类型,
                 * <br />"<b>point</b>：{BMap.Point} 鼠标的物理坐标,
                 * <br />"<b>pixel</b>：{BMap.Pixel} 鼠标的像素坐标}
                 *
                 * @example <b>参考示例：</b>
                 * myRichMarkerObject.addEventListener("ondragstart", function(e) { 
                 *     alert(e.type);  
                 * });
                 */ 
                _dispatchEvent(me, "ondragstart", {
                    "point": position.point,
                    "pixel": position.pixel
                });
                isMouseDown = true;
                // 设置拖拽开始的鼠标手型
                me._setCursor("dragstart");
                // 拖拽开始时，设置鼠标捕获
                me._container.setCapture && me._container.setCapture();
                // 拖拽过程中防止文字被选中
                me._container.style['MozUserSelect'] = 'none';
                me._container.style['KhtmlUserSelect'] = 'none';
                me._container.style['WebkitUserSelect'] = 'none';
                me._container['unselectable'] = 'on';
                me._container['onselectstart'] = function () {
                    return false;
                };
                _stopAndPrevent(e);
            });
    };
     e.prototype._setCursor = function (cursorType) {
        var cursor = '';
        var cursorStylies = {
            "moz": {
                "dragstart": "-moz-grab",
                "dragging": "-moz-grabbing",
                "dragend": "pointer"
            },
            "other": {
                "dragstart": "move",
                "dragging": "move",
                "dragend": "pointer"
            }
        };

        if (navigator.userAgent.indexOf('Gecko/') !== -1) {
            cursor = cursorStylies.moz[cursorType];
        } else {
            cursor = cursorStylies.other[cursorType];
        }
        var _container = this._apiObj.map.container;
        if (_container.style.cursor != cursor) {
           _container.style.cursor = cursor;
        }
    };
    function _log(msg){
            console.log(msg);
        };
    function _addEventHandler(oTarget, sEventType, fnHandler) {
        sEventType = sEventType.replace("on","");
        if (oTarget.addEventListener) {
            oTarget.addEventListener(sEventType, fnHandler, false);
        } else if (oTarget.attachEvent) {
            oTarget.attachEvent("on" + sEventType, fnHandler);
        } else {
            oTarget["on" + sEventType] = fnHandler;
        }
    };
    function _removeEventHandler(oTarget, sEventType, fnHandler) {
        sEventType = sEventType.replace("on","");
        if (oTarget.removeEventListener) {
            oTarget.removeEventListener(sEventType, fnHandler, false);
        } else if (oTarget.detachEvent) {
            oTarget.detachEvent("on" + sEventType, fnHandler);
        } else {
            oTarget["on" + sEventType] = null;
        }
    };
   
    /**
     * 集中派发事件函数
     *
     * @private
     * @param {Object} instance 派发事件的实例
     * @param {String} type 派发的事件名
     * @param {Json} opts 派发事件里添加的参数，可选
     */
    function _dispatchEvent(instance, type, opts) {
        type.indexOf("on") != 0 && (type = "on" + type);
        var baiduevent = new baidu.lang.Event(type);
        if ( !! opts) {
            for (var p in opts) {
                baiduevent[p] = opts[p];
            }
        }
        var event = new Event(type);
        instance._apiObj.div.dispatchEvent(event,opts);
    };
    /**
     * 清理DOM事件，防止循环引用
     *
     * @type {DOM} dom 需要清理的dom对象
     */
    function _purge(dom) {
        if (!dom) {
            return;
        }
        var attrs = dom.attributes,
            name = "";
        if (attrs) {
            for (var i = 0, n = attrs.length; i < n; i++) {
                name = attrs[i].name;
                if (typeof dom[name] === "function") {
                    dom[name] = null;
                }
            }
        }
        var child = dom.childnodes;
        if (child) {
            for (var i = 0, n = child.length; i < n; i++) {
                _purge(dom.childnodes[i]);
            }
        }
    };

    /**
     * 停止事件冒泡传播
     *
     * @type {Event} e e对象
     */
    function _stopAndPrevent(e) {
        var e = window.event || e;
        e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
       // return baidu.preventDefault(e);
    } ;
    //添加事件监听函数
    e.prototype.addEventListener = function (event, handler) {
        var mapAdapter = NPMapLib.Adapter.AdapterFactory.getMapAdapter(this.mapId);
        if (mapAdapter)
            mapAdapter.addEventListener(this, event, handler);
    };

    //移除事件监听函数
    e.prototype.removeEventListener = function (event) {
        var mapAdapter = NPMapLib.Adapter.AdapterFactory.getMapAdapter(this.mapId);
        if (mapAdapter)
            mapAdapter.removeEventListener(this, event);
    };   
    /////////////////////////////方法 　结束////////////////////////////
})();

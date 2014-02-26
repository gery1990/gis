/*!
 * 事件
 */
 NPMapLib.ANIMATION_EVENT_START = 'start';
 NPMapLib.ANIMATION_EVENT_PAUSE = 'pause';
 NPMapLib.ANIMATION_EVENT_STOP = 'stop';
 NPMapLib.ANIMATION_EVENT_MOVING = 'moving';
 NPMapLib.ANIMATION_EVENT_MOVED = 'moved';


//事件参考
//@描述：启动推演时会触发此事件  关键字：start  参数：event{type, target(point)}
//@描述：暂停推演时会触发此事件  关键字：pause  参数：event{type, target(point)}
//@描述：停止推演时会触发此事件  关键字：stop  参数：event{type, target(point)}
//@描述：覆盖物准备移动时触发此事件  关键字：moving  参数：event{type, target(point)}
//@描述：覆盖物移动后触发此事件  关键字：moved  参数：event{type, target(point)}
//--------------------------------------------------------------------------------------------

/*
* 动画标注
*/
(function() {
    var e = NPMapLib.Symbols.Animation = function(mapId, overLay, opts) {
        this.id = -1;
        this._points=new Array();
        if(NPMapLib.Utils.BaseUtils.isTypeRight(overLay, "NPMapLib.Overlay"))
            this._overlay = overLay;
        
        this._listeners = {};
        this._initialize();

        this.mapAdapter = NPMapLib.Adapter.AdapterFactory.getMapAdapter(mapId);
        if (!opts || opts === null) {
            return;
        }
        
        if (NPMapLib.Utils.BaseUtils.isTypeRight(opts.speed, "number"))
            this._speed = opts.speed;
        if (NPMapLib.Utils.BaseUtils.isTypeRight(opts.isReturn, "boolean"))
            this._isReturn = opts.isReturn;
        if (NPMapLib.Utils.BaseUtils.isTypeRight(opts.isRepeat, "boolean"))
            this._isRepeat = opts.isRepeat;
    };

    //设置推演行径路线
    e.prototype.setPath = function(path) {
        if(!NPMapLib.Utils.BaseUtils.isTypeRight(path, "NPMapLib.Geometry.Polyline"))
            return;

        this._path = path;
        this._points = path.getPath();
    };

    //返回推演行径路线
    e.prototype.getPath = function() {
        return this._path;
    };

    //返回覆盖物对象
    e.prototype.getOverlay = function(){
        return this.overLay;
    };

    //设置是否重复
    e.prototype.setRepeat = function(isRepeat) {
        if (NPMapLib.Utils.BaseUtils.isTypeRight(isRepeat, "boolean"))
            this._isRepeat = isRepeat;
    };

    //设置是否返回
    e.prototype.setReturn = function(isReturn){
        if (NPMapLib.Utils.BaseUtils.isTypeRight(isReturn, "boolean"))
            this._isReturn = isReturn;
    };

    //设置速度
    e.prototype.setSpeed = function(speed){
        if (NPMapLib.Utils.BaseUtils.isTypeRight(speed, "number"))
            this._speed = speed;
    };

    //启动推演
    e.prototype.start = function() {
        this.stop();
        if (!NPMapLib.Utils.BaseUtils.isTypeRight(this._overlay, "NPMapLib.Overlay") || 
            !NPMapLib.Utils.BaseUtils.isTypeRight(this._points, "Array") || 
            this._points.length <= 1)
            return;

        this._interval = true;
        this._isPause = false;
        this._curPointIndex = 0;

        //设置位置
        this._overlay.setPosition(this._points[0]);

        //设置角度
        var angle = this._getAngle(this._points[0], this._points[1]);
        this._changeAngle(angle);

        this._calculateSegment(this._points[0], this._points[1]);

        this._triggerEvent(NPMapLib.ANIMATION_EVENT_START, this._points[0]);
        this._startTimer();
    };

    //暂停推演
    e.prototype.pause = function() {
        this._isPause = !this._isPause;
        this._triggerEvent(NPMapLib.ANIMATION_EVENT_PUASE, this._points[this._curPointIndex]);
    };

    //停止推演
    e.prototype.stop = function() {
        if(this._timer)
            window.clearInterval(this._timer);
        this._triggerEvent(NPMapLib.ANIMATION_EVENT_STOP, this._points[this._curPointIndex]);
    };

    //添加事件监听函数
    e.prototype.addEventListener = function(event, handler) {
        switch (event) {
            case NPMapLib.ANIMATION_EVENT_START:
                if (this._listeners.start) {
                    this._listeners.start = [];
                }
                this._listeners.start.push(callBack);
                break;
            case NPMapLib.ANIMATION_EVENT_PAUSE:
                if (this._listeners.pause) {
                    this._listeners.pause = [];
                }
                this._listeners.pause.push(callBack);
                break;
            case NPMapLib.ANIMATION_EVENT_STOP:
                if (this._listeners.stop) {
                    this._listeners.stop = [];
                }
                this._listeners.stop.push(callBack);
                break;
            case NPMapLib.ANIMATION_EVENT_MOVE:
                if (this._listeners.move) {
                    this._listeners.move = [];
                }
                this._listeners.move.push(callBack);
                break;
            default:
                break;
        }
    };

    //移除事件监听函数
    e.prototype.removeEventListener = function(event, handler) {
        var listener = this._listeners[event];
        if (listener instanceof Array) {
            for (var k = 0; k < listener.length; ++k) {
                if (listener[k] == callBack) {
                    this._listeners.splice(k, 1);
                    break;
                }
            }
        }
    };

    /////////////////////////私有方法
    e.prototype._initialize = function(){
        this._angle = 0;
        this._isIncreaseDirection = true;
        this._curPointIndex = 0;
        this._interval = 100;
        this._isReturn = true;
        this._isRepeat = true;
    };

    //启动定时推演
    e.prototype._startTimer = function() {
        this._timer = setInterval(function(){
            if(!this._isPause)
                this._actionStart();
        }.bind(this),this._interval);
    };

    e.prototype._actionStart = function() {
        //移动前
        this._triggerEvent(NPMapLib.ANIMATION_EVENT_MOVING, this._points[this._curPointIndex]);
        var p = this._getNextPoint();
        this._moveTo(p);
        //移动后
        this._triggerEvent(NPMapLib.ANIMATION_EVENT_MOVED, p);

        if (this._curSegCount >= this._totalSegCount) {
            if(this._points.length -1 === this._curPointIndex){
                //如果重复，不回头
                if (this._isRepeat && !this._isReturn){
                   this._curPointIndex = 0;
                }//如果重复，且回头
                else if(this._isRepeat && this._isReturn){

                }//如果不重复，且回头
                else if(!this._isRepeat && this._isReturn){
                    this._isHaveReturn = true;
                }//如果不重复，也不回头
                else{
                    this.stop();
                    return;
                }
            }

            //如果已调头
            if(this._isHaveReturn && this._curPointIndex === 0){
                this.stop();
                return;
            }
            
            this._turningPoint();
        }
        else {
            this._curSegCount++;
        }
    };

    //获取下一个推演位置
    e.prototype._getNextPoint = function() {
        if (this._curSegCount >= this._totalSegCount) {
            if (this._isIncreaseDirection) {
                ++this._curPointIndex;
            } else {
                --this._curPointIndex;
            }
            return this._points[this._curPointIndex];
        } else {
            if (this._isIncreaseDirection) {
                return this._getPoint(this._points[this._curPointIndex], this._points[this._curPointIndex + 1]);
            }
            else {
                return this._getPoint(this._points[this._curPointIndex], this._points[this._curPointIndex - 1]);
            }
        }
    };
    //根据相邻两点 获取下一个推演位置
    e.prototype._getPoint = function(startPoint, endPoint) {
        var sp = this.mapAdapter.pointToPixel(startPoint);
        var ep = this.mapAdapter.pointToPixel(endPoint);
        var per = this._curSegCount / this._totalSegCount;

        var x = (ep.x - sp.x) * per + sp.x;
        var y = (ep.y - sp.y) * per + sp.y;
        if(EzServerClient.GlobeParams.VML){}
        else{
            x -= 32/2;
            y -= 32/2;
        }
        var pt = new NPMapLib.Geometry.Pixel(x, y);
        return this.mapAdapter.pixelToPoint(pt);
    };

    //转折点处理
    e.prototype._turningPoint = function() {
        var i = this._curPointIndex;
        if (i >= this._points.length - 1 || i <= 0) {
            this._isIncreaseDirection = this._isReturn?(!this._isIncreaseDirection):this._isIncreaseDirection;
        }
        if (this._isIncreaseDirection) {
            this._calculateSegment(this._points[i], this._points[i + 1]);
            //设置角度
            var angle = this._getAngle(this._points[i], this._points[i + 1]);
            this._changeAngle(angle);
        } else {
            this._calculateSegment(this._points[i], this._points[i - 1]);

            //设置角度
            var angle = this._getAngle(this._points[i], this._points[i - 1]);
            this._changeAngle(angle);
        }
    };
    //计算两点之间存在的点数
    e.prototype._calculateSegment = function(fromPoint, targetPoint) {
        var distance = this._getDistance(fromPoint, targetPoint);
        var t = distance / (this._speed * this._interval / 1000);
        this._totalSegCount = Math.ceil(t) - 1;
        this._curSegCount = 0;
    };
    //获取两点之间的距离
    e.prototype._getDistance = function(fromPoint, targetPoint) {
        var f = this.mapAdapter.pointToPixel(fromPoint);
        var t = this.mapAdapter.pointToPixel(targetPoint);
        return this.mapAdapter.getDistance(f, t);
    };

    e.prototype._moveTo = function(point) {
        this.mapAdapter.setOverlayPosition(this._overlay, point);
    };

    //获取角度
    e.prototype._getAngle = function(ptFrom, ptTarget) {
        return Math.atan2(ptTarget.lat - ptFrom.lat, ptTarget.lon - ptFrom.lon) * 180 / Math.PI;
    };

    //将对象旋转一定角度
    e.prototype._changeAngle = function(angle) {
        if (this._angle == angle)
            return;

        if (this._overlay instanceof NPMapLib.Overlay) {
            this._overlay.rotate(angle);
            this._angle = angle;
        }
    };

    e.prototype._triggerEvent = function(type, params) {
        var listener = this._listeners[type];
        if (listener instanceof Array) {
            for (var k = 0; k < listener.length; ++k) {
                listener[k].apply(this, params);
            }
        }
    };

    /////////////////////////私有方法
})();

NPMapLib.Symbols.Animation.Options = {
    speed: 100,         //速度
    isReturn: true,     //是否往返：若为true，则来回推演
    isRepeat: true      //是否重复：若为true，则反复推演
};

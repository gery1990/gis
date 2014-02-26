NPNamespace.register("NPMapLib");


//离线下载工具JS端接口
(function() {
	var e = NPMapLib.GisToolKit = function() {
		//所划区域的最小、大经纬度
		_minX = 119.81395;
		_minY = 31.56493;
		_maxX = 120.0161;
		_maxY = 31.7954;

		//当前窗口的尺寸
		_sizeX = 0.0;
		_sizeY = 0.0;

		//定时器频率
	    _intervalInfo = 3000;
	    //定时器
	    _timerInfo = null;
		
		//移动的像素
		_planPx = 512;
		
		//地图平移方向
		_mapDirection = true;
	};

	//开始扫描
	e.prototype.startScan = function(rate, pPx){
	  _intervalInfo = rate;
	  _planPx = pPx;
      this.getPanSize();
	  var zoomLevel = _mapUtils.getZoomLevel();
	  _mapUtils.centerAndZoom(this.minX,this.minY,zoomLevel + 1);
      window.setTimeout(function(){
      	 _timerInfo = window.setInterval(this.doWork,this.intervalInfo);
      }.bind(this),2000);
	};

     //任务
	e.prototype.doWork = function() {
		var centerPoint = _mapUtils.getCenterLatLng();
		var xPx = centerPoint.x;
		var yPx = centerPoint.y;
		
		if((yPx >= _maxY && xPx >= _maxX)){
		    var zoomLevel = _mapUtils.getZoomLevel();
		    var maxLevel = _mapManager.getMapMaxLevel();
			
			if(zoomLevel <= maxLevel){
		      _mapUtils.centerAndZoom(_minX,_minY,zoomLevel + 1);
			}else{
				window.clearInterval(_timerInfo);
				alert("it's over");
			}
		}

		if(xPx < _minX){
			_mapUtils.panTo(-_planPx, -_planPx);
			_mapDirection = true;
		}else if(xPx <= _pgistools.maxX){
		   if(_mapDirection == true){
				_mapUtils.panTo(-_planPx, 0);
		   }else if(_mapDirection == false){
				_mapUtils.panTo(_planPx, 0);
		   }
		}else if(yPx <= _maxY){
		   if(xPx > _maxX){
				_mapUtils.panTo(_planPx, -_planPx);
				_mapDirection = false;
		   }
		}else{

		}
		
	};
	
	//停止扫描
	e.prototype.stopScan = function(){
	  window.clearInterval(this.timerInfo);
	};
	
	//获取绘制返回的字符串
	e.prototype.getMapDrawPoints = function(drawMode){
		this.actionDrawBySelf(drawMode,function(points){
		    var arr = points.split(',');
			if(arr.length === 4){
			   _minX = arr[0]; _minY = arr[1]; _maxX = arr[2]; _maxY = arr[3];
			}
			window.external.OnDrawCompletedCallBack(points);
		}.bind(this));
	};
	
	//创建点
	e.prototype.createPoint = function(x, y){
		if(_mapUtils === null) return null;
		return _mapUtils.createPoint(x, y);
	};
	
	//坐标偏移
	e.prototype.pointOffset = function(pt, topOffset, leftOffset){
		if(_mapUtils === null) return null;
		return _mapUtils.pointOffset(pt, topOffset, leftOffset);
	};
	
	//启动自定义绘制
	e.prototype.actionDrawBySelf = function(mode,callback){
		if(_mapUtils === null) return;
		$('drawMode').value = mode;
		_mapUtils.actionDraw(mode, callback);
	};
	
	//获取当前移动像素信息
	e.prototype.getPanSize = function(){
	   var size = window.getSize();
	   _sizeX = size.x;
	   _sizeY = size.y;
	};
})();

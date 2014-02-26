//业务类
var BusinessClass = new Class({
	animatePointer: null,

	//初始化
	initialize:function(){
		if (_mapManager === null) return;
		var options = _mapManager.getOptions();

		// 是否显示控制控件
		_mapUtils.setNavigateControlVisible(options.navigateControl);
		// 是否显示比例尺
		_mapUtils.setScaleControlVisible(options.scaleControl);
		// 是否显示鹰眼
		_mapUtils.setOverViewVisible(options.overview);
		if(options.overview)
			_mapUtils.setOverViewSize(options.overviewW, options.overviewH);
		// 是否显示地图切换按钮
		_mapUtils.setSwitchMapServerControlOnMapVisible(options.switchServerButtons);

		//初始化地图位置
		if(options.centerX > 0 && options.centerY > 0 && options.zoomLevel > 0)
			_mapUtils.centerAndZoom(options.centerX,options.centerY,options.zoomLevel);
		else{//否则全图
			_mapUtils.fullExtent();
		}

		//	加载数据
		//this.loadDatas();
		//$$('.loading').destroy();
	},

	//加载数据
	loadDatas:function(jsonMarkers){
		if (_markerModelManager === null) return;
		_markerModelManager.loadMarkerDatas(jsonMarkers);
	},

	//添加数据
	addData:function(data){
		if (_markerModelManager === null) return;
		var key = _markerModelManager.addMarkerData(data);
		if (_locationManager.isLocating && key !== null)
			_locationManager.saveMarkerKeys(key);
	},

	//移除数据
	removeData:function(type, id){
		if(_markerModelManager === null) return;
		_markerModelManager.removeMarkerData(type,id);
	},

	//获取绘制返回的字符串
	getMapDrawPoints:function(drawMode){
		this.actionDrawBySelf(drawMode,function(points){
			window.external.OnDrawCompletedCallBack(points);
		});
	},

	//启动选取操作
	actionSelect: function(mode) {
		if(_mapUtils === null) return;
		$('drawMode').value = mode;
		_mapUtils.actionDraw(mode, this.actionSelectCallback);
		_mapUtils.setMouseCursor('crosshair');
	},

	//启动绘制操作
	actionDraw: function(mode){
		if(_mapUtils === null) return;
		$('drawMode').value = mode;
		_mapUtils.actionDraw(mode, this.actionDrawCallback);
	},

	//启动自定义绘制
	actionDrawBySelf:function(mode,callback){
		if(_mapUtils === null) return;
		$('drawMode').value = mode;
		_mapUtils.actionDraw(mode, callback);
	},

	//选取操作回调函数
	actionSelectCallback: function(str){
		try{
			var drawMode = $('drawMode').value;
			var result = [];
			if(drawMode == 'drawPoint'){

			}
			else if(drawMode == 'drawPolyline'){

			}
			else if(drawMode == 'drawRect'){
				result = _markerModelManager.getMarksByRectangle(str);
			}
			else if(drawMode == 'drawCircle'){
				result = _markerModelManager.getMarksByCircle(str);
			}
			else if(drawMode == 'drawPolygon'){
				result = _markerModelManager.getMarksByPolygon(str);
			}

			
			_mapUtils.pan();
			if(result === null || result.length<=0) return;

			var params = [];
			for (var j = 0; j < result.length; j++) {
				params.push(result[j].type + '_' + result[j].id);
			}

			if(_markerClusterer !== null){
				var arr = str.split(',');
				var mbr = _mapUtils.createExtent(arr[0],arr[1],arr[2],arr[3]);
				_markerClusterer.startGather(result, mbr, false);
			}	
			window.external.OnSelectCompletedCallBack(params.join(';'));
		}
		catch(e){
			alert(e.message);
		}
	},

	//绘制操作回调函数
	actionDrawCallback: function(str){
		if(_mapUtils === null) return;

		var drawMode = $('drawMode').value;
		var overlay=null;
		if(drawMode == 'drawPoint'){
			str = str.split(',');
			overlay = _mapUtils.createPoint(str[0], str[1]);
		}
		else if(drawMode == 'drawPolyline'){
			overlay = _mapUtils.createPolyline(str, '#000000', 1, 1, 2, 'none');
		}
		else if(drawMode == 'drawRect'){
			overlay = _mapUtils.createRectangle(points, '#000000', 1, 0.05, '#2319DC');
		}
		else if(drawMode == 'drawCircle'){
			overlay = _mapUtils.createCircle(points, '#000000', 1, 0.05, '#2319DC');
		}
		else if(drawMode == 'drawPolygon'){
			overlay = _mapUtils.createPolygon(points, '#000000', 1, 0.05, '#2319DC');
		}

		return overlay;
	},

	//定位
	animateCenter: function(x, y, level) {
		if(_mapUtils === null) return;

		_mapUtils.centerAndZoom(x,y,level);

		if (this.animatePointer === null) {
			this.animatePointer = document.createElement('div');
			this.animatePointer.id = 'centerPoint';
			document.body.appendChild(this.animatePointer);
		}

		var element = this.animatePointer,
			width = 50,
			height = 50,
			viewport = window.getSize(),
			top = viewport.y / 2 - height,
			left = viewport.x / 2 - width / 2;

		element.style.left = left + 'px';

		var locatedAnimate = new Fx.Tween(element, {
			duration: 1000,
			transition: 'bounce:out',
			property: 'top'
		});

		var opacityAnimate = new Fx.Tween(element, {
			duration: 500,
			property: 'opacity'
		});

		locatedAnimate.addEvent('complete', function(e) {
			setTimeout(function() {
				opacityAnimate.start(1, 0);
			}, 500);
		});

		opacityAnimate.addEvent('complete', function(e) {
			element.style.top = '-200px';
			$(element).setStyle('opacity', 1);
		});

		locatedAnimate.start(-200, top);
	},

	//地图资源定位
	//params:data--json对象，lever--地图缩放级别，isFlash--是否闪烁
	locationMarker:function(data,level,isFlash){
		if(_markerModelManager === null) return;

		if(typeof data === 'string')
		   data = eval('(' + data + ')');
		var model = _markerModelManager.getMarkerModel(data.type,data.id);
		if(!model) return;

		_markerModelManager.addMarkerModel(model);
		_locationManager.saveMarkerKeys(model.getKey());
		
		_mapUtils.centerAndZoom(model.x,model.y,level);
		if (isFlash) {
			_mapUtils.flashOverlay(model.marker);
		}
	},

	//获取当前级别
	getZoomLevel:function(){
		if(_mapUtils === null) return -1;
		return _mapUtils.getZoomLevel();
	},

	//转到某一级别
	setZoomLevel:function(level){
		if(_mapUtils === null) return;
		_mapUtils.setZoomLevel(level);
	},

	//设置摄像机缩放级别
	setCameraLevel:function(level){
		if(_mapManager === null) return;
		_mapManager.setCameraLevel(level);
	},

	//设置摄像机缩放级别
	setPersonLevel:function(level){
		if(_mapManager === null) return;
		_mapManager.setPersonLevel(level);
	},

	//设置摄像机缩放级别
	setRmpGateLevel:function(level){
		if(_mapManager === null) return;
		_mapManager.setRmpGateLevel(level);
	},

	//设置最小聚合个数
	setMinMarkerClusterCount:function(count){
		if(_markerClusterer === null) return;
		_markerClusterer.setMinClusterCount(count);
	},

	//设置聚合分散临界
	setDepartMarkerClusterCount:function(count){
		if(_markerClusterer === null) return;
		_markerClusterer.setDepartClusterCount(count);
	},

	//设备摄像机图层是否可见
	setCameraVisible:function(visible){
		if(_markerClusterer === null) return;
		_markerClusterer.setCameraVisible(visible);
	},

	//设备卡口图层是否可见
	setRmpGateVisible:function(visible){
		if(_markerClusterer === null) return;
		_markerClusterer.setRmpGateVisible(visible);
	},

	//设备人员图层是否可见
	setPersonVisible:function(visible){
		if(_markerClusterer === null) return;
		_markerClusterer.setPersonVisible(visible);
	},

	//获取中心点
	getCenterPosition:function(){
		if(_mapUtils === null) return;
		var pt = _mapUtils.getCenterLatLng();
		return pt.x + "," + pt.y;
	},

	//保存截图至视图库
	saveViewCaptureToCase:function(){
		if(_mapUtils === null) return;
		var mbr = _mapUtils.getExtent();
		var url = "http://" + GlobalConfig.apiAddress + ":" + GlobalConfig.apiPort + "/EzServer/Maps/SL/EzMap?Service=getRectImg&result=image&minx=" + mbr.minX + "&miny=" + mbr.minY + "&maxx=" + mbr.maxX + "&maxy=" + mbr.maxY + "&zoom=" + (this.getZoomLevel() + EzServerClient.GlobeParams.ZoomOffset);
		window.external.OnSaveViewCaptureCallback(url);
	}
});
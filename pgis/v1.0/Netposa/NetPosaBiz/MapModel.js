/*!
 * 对象类
 */
var MarkerModel = new Class({
	type: '', //对象类型
	id: -1, //对象ID
	name: '', //对象名称
	x: 0, //经度
	y: 0, //纬度
	marker: null, //叠加标记
	remark: '', //描述（备注）
	objExt: null, //扩展对象
	visible: false, //是否显示
	titleVisible: true, //是否显示名称
	isAddToMap: false, //是否已经加入地图
	isInCluster: false, //是否在聚合类中

	//获取Key
	getKey: function() {
		try {
			return this.type + "_" + this.id;
		} catch (e) {
			alert("getKey: " + e.message);
		}
	},

	//设置显示状态
	display: function(visible, titleVisible) {
		if (this.marker === null || this.visible === visible)
			return;

		if (!this.isAddToMap) {
			_mapUtils.addOverlay(this.marker);
			this.isAddToMap = true;
		}

		_mapUtils.stopFlashOverlay(this.marker);
		//if(_mapManager.getMapVersion() > 1.0)
		this.marker.div.childNodes[0].style.display = visible ? "" : "none";
		// else
		// 	this.marker.div.style.display = visible?"":"none";

		this.visible = visible;
		if (!this.visible)
			this.displayTitle(visible);
		else
			this.displayTitle(titleVisible);
	},

	//设置名称的显示状态
	displayTitle: function(visible) {
		if (this.marker === null || this.titleVisible === visible)
			return;

		this.titleVisible = this.visible ? visible : this.visible;

		// if(_mapManager.getMapVersion() > 1.0)
		this.marker.div.childNodes[1].style.display = this.titleVisible ? "" : "none";
		// else
		// 	_mapUtils.setMarkTitleVisible(this.marker, this.titleVisible);
	}
});

/*!
 * 标记类
 */
var FlagMarkerModel = new Class({
	x: 0, //经度
	y: 0, //纬度
	marker: null, //标记对象
	flagIndexMarker: null, //序号标记对象
	objExt: null //扩展对象
});

/*!
 * 对象管理类
 */
var MarkerModelManager = new Class({
	markerDatas: [], //原始对象数据集
	markerModels: {}, //对象集
	markerStyles: {
		width: 16,
		height: 16,
		pos: 5,
		topOffset: 0,
		leftOffset: 0,
		fontSize: 11,
		fontFamily: 'MicroSoft Yahei',
		fontColor: 'red',
		bgColor: '#FFFFFF',
		borderColor: '#CCCCFF',
		borderSize: 0
	},
	markerImageModels: {},
	showTitle: false, //是否显示名称
	loadIndex: 0,
	loadTimer: null,
	totalCount: 0,
	startIndex: 0,
	endIndex: 0,
	section: 1000,
	sectionCount: 0,

	//加载所有对象
	loadMarkerDatas: function(jsonMarkers) {
		try {
			if (this.loadTimer !== null)
				clearInterval(this.loadTimer);

			this.markerDatas = jsonMarkers;
			if (!this.markerDatas || this.markerDatas.length <= 0) {
				$$('.loading').destroy();
				window.external.OnLoadDataComplatedCallBack(true);
				return;
			}

			if (typeof this.markerDatas === 'string')
				this.markerDatas = eval('(' + this.markerDatas + ')');

			if (!this.markerDatas || this.markerDatas.length <= 0) {
				$$('.loading').destroy();
				window.external.OnLoadDataComplatedCallBack(true);
				return;
			}


			_markerModelManager.totalCount = this.markerDatas.length;
			_markerModelManager.loadIndex = 0;
			this.createAllMarkerModels();

		} catch (e) {
			alert("loadMarkerDatas: " + e.message);
		}
	},

	createAllMarkerModelsEx: function() {
		try {
			for (var i = _markerModelManager.loadIndex; i < _markerModelManager.totalCount; i++) {
				_markerModelManager.createMarkerModel(_markerModelManager.markerDatas[i]);
				_markerModelManager.loadIndex++;
			}

			if (_markerModelManager.loadIndex >= _markerModelManager.totalCount) {
				clearInterval(_markerModelManager.loadTimer);
				$$('.loading').destroy();
				window.external.OnLoadDataComplatedCallBack(true);
			}
		} catch (e) {
			alert("createAllMarkerModels: " + e.message);
		}
	},

	//创建所有对象
	createAllMarkerModels: function() {
		try {
			this.sectionCount = 0;
			var iCount = (this.totalCount / this.section).toInt();
			var remaind = this.totalCount % this.section;
			this.sectionCount = (remaind > 0) ? iCount : (iCount - 1);
			var thds = [];
			if (iCount > 0) {
				for (var i = 0; i < iCount; i++) {
					var thd = Concurrent.Thread.create(function(fromIndex, toIndex) {
						while (true) {
							_markerModelManager.createMarkerModel(_markerModelManager.markerDatas[fromIndex]);
							fromIndex++;
							if (fromIndex >= toIndex) {
								_markerModelManager.sectionCount = _markerModelManager.sectionCount - 1;
								break;
							}
						}
					}, i * this.section, (i + 1) * this.section);
					thds.push(thd);
				}
			}

			if (remaind > 0) {
				var thd = Concurrent.Thread.create(function(fromIndex, toIndex) {
					while (true) {
						_markerModelManager.createMarkerModel(_markerModelManager.markerDatas[fromIndex]);
						fromIndex++;
						if (fromIndex >= toIndex) {
							_markerModelManager.sectionCount = _markerModelManager.sectionCount - 1;
							break;
						}
					}
				}, iCount * _markerModelManager.section, iCount * _markerModelManager.section + remaind);
				thds.push(thd);
			}

			_markerModelManager.loadTimer = setInterval(function() {
				if (_markerModelManager.sectionCount <= 0) {
					$$('.loading').destroy();
					window.external.OnLoadDataComplatedCallBack(true);
					for (var i = 0; i < thds.length; i++) {
						thds[i].stop();
					};
					clearInterval(_markerModelManager.loadTimer);
				}
			}, 300);

		} catch (e) {
			alert("createAllMarkerModels: " + e.message);
		}
	},

	//添加多个对象
	addMarkerModels: function(mkModels) {
		if (mkModels === null || mkModels.length <= 0) return;

		for (var i = 0; i < mkModels.length; i++) {
			this.addMarkerModel(mkModels[i]);
		}
	},

	//添加一个对象
	addMarkerModel: function(markerModel) {
		if (!markerModel || markerModel === null)
			return;

		markerModel.display(true, this.showTitle);
	},

	addMarkerData: function(markerData) {
		try {
			if (typeof markerData === 'string')
				markerData = eval('(' + markerData + ')');
			this.markerDatas.push(markerData);
			this.createMarkerModel(markerData);

			var key = this.getKey(markerData);
			this.setMarkerModelPosition(key, markerData.x, markerData.y, true);
			return key;
		} catch (e) {
			return null;
		}
	},

	//设置位置
	setMarkerModelPosition: function(key, x, y, isAddToMap) {
		var model = this.getMarkerModelByKey(key);
		if (!model || model === null) return;

		model.x = x;
		model.y = y;
		var point = _mapUtils.createPoint(x, y);
		_mapUtils.setOverlayPoint(model.marker, point);
		if (isAddToMap)
			this.addMarkerModel(model);
	},

	//创建一个对象
	createMarkerModel: function(markerData) {
		try {
			if (typeof markerData === 'string')
				markerData = eval('(' + markerData + ')');

			var key = this.getKey(markerData);
			if (this.markerModels[key])
				return;

			var icon = this.markerImageModels[markerData.type];
			var point = null;
			var title = null;
			var marker = null;

			if (!icon || icon === null) {
				icon = _mapUtils.createMyIcon(_mapManager.getMarkImage(markerData.type), this.markerStyles.width, this.markerStyles.height, -this.markerStyles.width / 2, -this.markerStyles.height / 2);
				this.markerImageModels[markerData.type] = icon;
			}
			point = _mapUtils.createPoint(markerData.x, markerData.y);
			title = _mapUtils.createMyTitle(markerData.name, this.markerStyles.fontFamily, this.markerStyles.fontSize, "center", this.markerStyles.fontColor, null, null, null, 3 * this.markerStyles.height / 4, -markerData.name.length * this.markerStyles.fontSize / 2, true);
			marker = _mapUtils.createMyMarker(key, icon, title, point);

			var model = new MarkerModel();
			model.type = markerData.type;
			model.id = markerData.id;
			model.name = markerData.name;
			model.x = markerData.x;
			model.y = markerData.y;
			model.remark = (markerData.remark === "") ? markerData.name : markerData.remark;
			model.marker = marker;
			this.addMarkerListeners(model.marker, model.x, model.y, model.type, model.id, model.remark);
			this.markerModels[key] = model;
		} catch (e) {
			alert("createMarker: " + e.message);
		}
	},

	addMarkerListeners: function(marker, x, y, type, id, remark) {
		try {
			if (marker === null) return;

			marker.addListener('dblclick', function() {
				window.external.OnDbClickCallBack(x, y, type, id);
			});

			marker.addListener('mouseover', function() {
				_popup.drc('[' + remark + ']', '-经度: ' + x + '</br>-纬度: ' + y);
			});

			marker.addListener('mouseout', function() {
				_popup.nd();
			});

			marker.addListener('mouseup', function(e) {
				// 使用MooTools封装事件 以便判断右键
				e = new DOMEvent(e);
				if (e.rightClick) {
					window.external.OnRightMouseUpCallBack(x, y, type, id);
				} else {
					window.external.OnLeftMouseUpCallBack(x, y, type, id);
				}
			});
		} catch (e) {
			alert(e.message);
		}
	},

	//移除所有对象【从地图上，不删除数据】
	removeAllMarkerModel: function() {
		Concurrent.Thread.create(function() {
			for (var key in _markerModelManager.markerModels) {
				_markerModelManager.removeMarkerModel(_markerModelManager.markerModels[key]);
			}
		});
	},

	//移除对象【从地图上，不删除数据】
	removeMarkerModel: function(markerModel) {
		if (!markerModel || markerModel === null) return;
		markerModel.display(false, false);
	},

	//移除对象
	removeMarkerModelByKey: function(key) {
		try {
			var temp = this.markerModels[key];
			if (temp) {
				temp.display(false, false);
			}
		} catch (e) {
			alert("removeMarkerModelByKey: " + e.message);
		}
	},

	//移除原始对象数据
	removeMarkerData: function(type, id) {
		// 移除缓存的数据
		for (var j = 0; j < this.markerDatas.length; j++) {
			var markerData = this.markerDatas[j];
			if (markerData.type === type.toInt() && markerData.id === id.toInt()) {
				//移除对象
				var markerModel = this.markerModels[this.getKey(markerData)];
				if (markerModel) {
					this.removeMarkerModel(markerModel);
					delete markerModel;
				}
				//移除原始数据
				this.markerDatas.splice(j, 1);
				break;
			}
		}
	},

	//显示/隐藏名称
	setMarkerTitleVisible: function(visible) {
		try {
			this.showTitle = visible;
			var mdModels = _markerModelManager.markerModels;
			for (var key in mdModels) {
				mdModels[key].displayTitle(visible, false);
			}
		} catch (e) {
			alert("setMarkerTitleVisible: " + e.message);
		}
	},

	//获取键
	getKey: function(markerData) {
		if (typeof markerData === 'string')
			markerData = eval('(' + markerData + ')');
		return markerData.type + "_" + markerData.id;
	},

	//获取对象
	getMarkerModelByKey: function(key) {
		return this.markerModels[key];
	},

	//获取对象
	getMarkerModel: function(type, id) {
		return this.markerModels[type + "_" + id];
	},

	//框选范围内的对象
	//params: str--矩形点序列字符串
	getMarksByRectangle: function(str) {
		var result = [],
			data = str.split(','),
			min = {
				x: data[0],
				y: data[1]
			},
			max = {
				x: data[2],
				y: data[3]
			};

		var model = null;
		for (var key in this.markerModels) {
			model = this.markerModels[key];
			if (model.x >= min.x && model.x <= max.x && model.y >= min.y && model.y <= max.y) {
				result.push(model);
			}
		}
		return result;
	},

	//圈选范围内的对象
	//params: str--圆形点序列字符串
	getMarksByCircle: function(str) {
		var result = [],
			data = str.split(','),
			point = {
				x: data[0],
				y: data[1]
			},
			radius = data[2];

		var model = null;
		for (var key in this.markerModels) {
			model = this.markerModels[key];
			if (Math.sqrt(Math.pow(model.x - point.x, 2) + Math.pow(model.y - point.y, 2)) <= radius) {
				result.push(model);
			}
		}
		return result;
	},

	//多边形范围内的对象
	//params: polygon--多边形对象
	getMarksByPolygon: function(str) {
		try {
			// var result = [],
			// 	points = str.split(',');
			// var model = null;
			// for (var key in this.markerModels) {
			// 	model = this.markerModels[key];
			// 	if (_mapUtils.isPtInPolygon(model.x, model.y, points))
			// 		result.push(model);
			// }
			// return result;

			var result = [],points = str.split(',');
			var polygon = _mapUtils.createPolygon(str, 'red','red',1,1);
			var mbr = _mapUtils.getPolygonMBR(polygon);
			var model = null;
			for (var key in this.markerModels) {
				model = this.markerModels[key];
				if(!_mapUtils.isInExtentByXY(model.x, model.y, mbr))
					continue;

				if (_mapUtils.isPtInPolygon(model.x, model.y, points))
					result.push(model);
			}
			return result;
		} catch (e) {
			alert("getMarksByPolygon: " + e.message);
		}
	}
});

/*!
 * 视频巡逻
 */
var VideoPatrolClass = new Class({
	car: null,
	carName: '巡逻车',
	carAngle: 0,
	interval: 100,
	patrolLine: null,
	patrolRadius: 0,
	patrolSpeed: 0,
	step: 0,
	pointIndex: 0,
	patrolPoints: null,
	totalStep: 0,
	patrolTimer: null,
	imgUrl: 'images/patrolcar.png',
	isPuase: false,
	mapViewModel: 1, //地图焦点模式：1-地图视野焦点模式；2-地图中心焦点模式；3-非地图焦点模式
	markerKeys: {}, //存放巡逻时的地图资源对象

	//////////////////////////public////////////////////////////
	//画自由巡逻线
	actionDrawFeedbackLine: function() {
		// 停止上次巡逻
		this.stopPatrol();
		// 画出巡逻路线
		_mapUtils.actionDraw('drawPolyline', this.getPatrolLine);
	},

	//启动巡逻
	start: function(points, radius, speed, mapViewModel) {
		try {
			this.mapViewModel = mapViewModel;
			// 停止上次巡逻
			this.stop();
			// 画出巡逻路线
			this.patrolLine = _mapUtils.createPolyline(points, '#2319DC', 3, 0.8, 0, 'none');
			if (this.patrolLine === null)
				return;
			_mapUtils.addOverlay(this.patrolLine);

			// 将字符串点位换成点位数组
			this.patrolPoints = _mapUtils.getPolylinePoints(this.patrolLine);

			// 如果没有巡逻车 重新绘制一个放在起点上
			if (this.car === null) {
				var icon = _mapUtils.createIcon(this.imgUrl, 48, 48, 0, 0);
				this.car = _mapUtils.createMarker(icon, this.patrolPoints[0], null);
				_mapUtils.addOverlay(this.car);
				_mapUtils.setZoomLevel(_mapManager.getCameraLevel());
				_mapUtils.centerByPoint(this.patrolPoints[0]);
			}

			// 路线总长度
			var pt = _mapUtils.createPoint(0, 0);
			this.patrolRadius = _mapUtils.getDegree(pt, radius).toFloat();
			this.patrolSpeed = speed * 1000 / 3600;
			if(_mapUtils.getMapUnit() === 'degree')
				this.step = _mapUtils.getDegree(pt, this.patrolSpeed.toFloat() * this.interval / 1000);
			else
				this.step = this.patrolSpeed.toFloat() * this.interval / 1000;
			this.pointIndex = 0;
			this.moveNextPoint(this.pointIndex);
		} catch (e) {
			alert("start: " + e.message);
		}
	},

	//暂停/继续
	pause: function() {
		try {
			this.isPuase = !this.isPuase;
		} catch (e) {
			alert("pausePatrol: " + e.message);
		}
	},

	//停止巡逻
	stop: function() {
		try {
			if (this.car !== null) {
				clearInterval(this.patrolTimer);
				_mapUtils.removeOverlay(this.car);
				_mapUtils.removeOverlay(this.patrolLine);

				this.clearPatrolMarkers();
			}
			this.isPuase = false;
			this.patrolLine = this.car = null;
		} catch (e) {
			alert("stop: " + e.message);
		}
	},

	//设置巡逻地图焦点模式
	setMapViewModel: function(model) {
		this.mapViewModel = model.toInt();
	},

	//////////////////////////public////////////////////////////

	//获取巡逻线
	getPatrolLine: function(points) {
		try {
			if (points !== null) {
				var overlay = _mapUtils.createPolylineDefault(points);
				window.external.AddVideoPatrolLine(points, _mapUtils.getPolylineLength(overlay));
			}
			_mapUtils.pan();
		} catch (e) {
			alert("getPatrolLine: " + e.message);
		}
	},

	//获取当前车的点位
	setCarPoint: function(pt, angle) {
		try {
			pt.x = pt.x + this.step * Math.cos(angle);
			pt.y = pt.y + this.step * Math.sin(angle);
			this.car.setPoint(pt);
		} catch (e) {
			alert("setCarPoint: " + e.message);
		}
	},

	//获取角度
	getCarAngle: function(ptFrom, ptTarget) {
		return _mapUtils.caluAngle2(ptFrom.x, ptFrom.y, ptTarget.x, ptTarget.y);
	},

	changePatrolCarAngle: function(angle) {
		try {
			if (this.carAngle !== angle) {
				angle = (angle + 90) * Math.PI / 180;
				var Cos = Math.sin(angle),
					Sin = Math.cos(angle);
				this.car.div.style.filter = "progid:DXImageTransform.Microsoft.Matrix(M11=" + Cos + ",M12=" + (-Sin) + ",M21=" + Sin + ",M22=" + Cos + ",SizingMethod='auto expand')";
				this.carAngle = angle;
			}
		} catch (e) {
			alert("changePatrolCarAngle: " + e.message);
		}
	},

	moveNextPoint: function(index) {
		if (index < this.patrolPoints.length - 1) {
			this.doMove(this.patrolPoints[index], this.patrolPoints[index + 1]);
		}
	},

	doMove: function(initPos, targetPos) {
		var currentCount = 0;
		var distance = _mapUtils.getDistance(initPos, targetPos);
		var count = Math.round(distance / this.step);
		//如果小于1直接移动到下一点
		if (count < 1) {
			this.pointIndex++;
			this.moveNextPoint(this.pointIndex);
			return;
		}
		//两点之间匀速移动
		this.patrolTimer = setInterval(function() {
			if (this.isPuase) return;
			//两点之间当前帧数大于总帧数的时候，则说明已经完成移动
			if (currentCount >= count) {
				clearInterval(this.patrolTimer);
				this.pointIndex++;
				//移动的点已经超过总的长度
				if (this.pointIndex >= this.patrolPoints.length - 1) {
					this.pointIndex = 0;
					//this.clearPatrolMarkers();
					this.patrolPoints = this.patrolPoints.reverse();
					this.moveNextPoint(this.pointIndex);
					return;
				}
				this.moveNextPoint(this.pointIndex);
			} else {
				//正在移动
				currentCount++;

				var point = this.doEffect(initPos, targetPos, currentCount, count);
				_mapUtils.setOverlayPoint(this.car, point);
				var angle = this.getCarAngle(initPos, targetPos);
				this.changePatrolCarAngle(angle);

				this.patrolMapViewModel(point);
				var markerModels = _markerModelManager.getMarksByCircle([point.x, point.y, this.patrolRadius].join(','));
				var params = [];
				if (markerModels.length > 0) {
					for (var i = 0; i < markerModels.length; i++) {
						params.push(markerModels[i].getKey());

						this.createAndFlashMarker(markerModels[i], true);
					}

					window.external.OnOpenVideosOrRmpGatesCallBack(params.join(';'));
				}
			}
		}.bind(this), this.interval);
	},

	doEffect: function(ptFrom, ptTarget, currentCount, totalCount) {
		var x = (ptTarget.x - ptFrom.x) * currentCount / totalCount + ptFrom.x;
		var y = (ptTarget.y - ptFrom.y) * currentCount / totalCount + ptFrom.y;
		var pt = _mapUtils.createPoint(x, y);
		if (ptFrom.x < ptTarget.x && ptFrom.y < ptTarget.y)
			pt = _mapUtils.pointOffset(pt, -12, 0);
		else if (ptFrom.x > ptTarget.x && ptFrom.y > ptTarget.y)
			pt = _mapUtils.pointOffset(pt, -12, 0);
		return pt;
	},

	//清除标记
	clearPatrolMarkers: function() {
		for (var key in this.markerKeys) {
			_markerModelManager.removeMarkerModelByKey(key);
			delete this.markerKeys[key];
		}
	},

	//创建并闪烁marker对象
	createAndFlashMarker: function(markerModel, isFlash) {
		try {
			if (markerModel === null) return;

			var key = markerModel.getKey();
			if (!this.markerKeys[key]) {
				this.markerKeys[key] = key;
				_markerModelManager.addMarkerModel(markerModel);
			}

			if (isFlash) {
				_mapUtils.flashOverlay(markerModel.marker);
			}
		} catch (e) {
			alert("createAndFlashMarker: " + e.message);
		}
	},



	//地图焦点模式判断
	patrolMapViewModel: function(point) {
		switch (this.mapViewModel) {
			case 1:
				var mbr = _mapUtils.getExtent();
				if (!_mapUtils.isInExtent(mbr, point)) {
					_mapUtils.centerByPoint(point);
				}
				break;
			case 2:
				_mapUtils.centerByPoint(point);
				break;
			case 3:
				break;
		}
	}
});

/*!
 * 轨迹分析
 */
var TrackAnalysisClass = new Class({
	rmpGateKeys: {}, //卡口对象集合
	flagMarkers: [], //标记对象集合
	showTime: false, //是否显示时间
	redFlagIcon: "images/Flag_Red.png",
	blueFlagIcon: "images/Flag_Blue.png",
	patrolLine: null, //模拟路径
	flagCount: 0, //标记总数
	threadFlag: 0, //跑路标记
	threadTimer: null,
	mbrGates: null,

	///////////////////////////////public///////////////////
	//启动轨迹分析
	start: function(rmpGateDatas, flagDatas, points) {
		this.addRmpGateMarkers(rmpGateDatas);
		this.addFlagMarkers(flagDatas);
		this.setPerformTrackLine(points);

		if (this.mbrGates !== null)
			_mapUtils.centerAtMBR(this.mbrGates);
	},

	//设置是否显示时间
	setTimeMarkerVisible: function(visible) {
		try {
			this.showTime = visible;
			if (this.flagMarkers.length <= 0) return;

			for (var j = 0; j < this.flagMarkers.length; j++) {
				_mapUtils.setMarkTitleVisible(this.flagMarkers[j].marker, visible);
			}
		} catch (e) {
			alert(e.message);
		}
	},

	//是否启动轨迹模拟
	performTrack: function(flag) {
		if (!flag) {
			if (_trackAnalysis.threadTimer !== null)
				window.clearInterval(_trackAnalysis.threadTimer);
			return;
		}

		if (_trackAnalysis.flagMarkers === null || _trackAnalysis.flagMarkers.length <= 0) return;

		_trackAnalysis.threadFlag = 0;
		_trackAnalysis.threadTimer = window.setInterval(_trackAnalysis.preformOne, 2000);
	},

	///////////////////////////////public///////////////////

	//设置轨迹线
	setPerformTrackLine: function(data) {
		try {
			this.patrolLine = _mapUtils.createPolyline(data, 'red', 4, 1, 1, 'none');
			if (this.patrolLine === null)
				return;

			_mapUtils.addOverlay(this.patrolLine);
		} catch (e) {
			alert(e.message);
		}
	},

	//添加卡口标记集合
	addRmpGateMarkers: function(datas) {
		try {
			if (typeof datas === 'string')
				datas = eval('(' + datas + ')');

			if (datas === null || datas.length <= 0) return;

			for (var j = 0; j < datas.length; j++) {
				this.addRmpGateMarker(datas[j]);
			}
		} catch (e) {
			alert(e.message);
		}
	},

	//添加卡口标记
	addRmpGateMarker: function(data) {
		try {
			if (typeof data === 'string')
				data = eval('(' + data + ')');
			var markerModel = _markerModelManager.getMarkerModel(data.type, data.id);
			if (!markerModel || markerModel === null) return;

			var key = markerModel.getKey();
			_markerModelManager.addMarkerModel(markerModel);
			this.rmpGateKeys[key] = key;

			if (this.mbrGates === null)
				this.mbrGates = _mapUtils.createExtent(markerModel.x, markerModel.y, markerModel.x, markerModel.y);
			else {
				if (this.mbrGates.minX > markerModel.x)
					this.mbrGates.minX = markerModel.x;
				if (this.mbrGates.minY > markerModel.y)
					this.mbrGates.minY = markerModel.y;
				if (this.mbrGates.maxX < markerModel.x)
					this.mbrGates.maxX = markerModel.x;
				if (this.mbrGates.maxY < markerModel.y)
					this.mbrGates.maxY = markerModel.y;
			}
		} catch (e) {
			alert(e.message);
		}
	},

	//添加通行标记
	addFlagMarkers: function(datas) {
		try {
			if (typeof datas === 'string')
				datas = eval('(' + datas + ')');
			if (datas.length <= 0) return;

			this.flagCount = datas.length;
			for (var j = 0; j < datas.length; j++) {
				this.addFlagMarker(datas[j]);
			}
		} catch (e) {
			alert(e.message);
		}
	},

	//添加通行标记
	addFlagMarker: function(data) {
		try {
			if (typeof data === 'string')
				data = eval('(' + data + ')');

			var rmpGateMarker = _markerModelManager.getMarkerModel('3', data.rmpGateId);
			if (!rmpGateMarker || rmpGateMarker === null) {
				return;
			}

			//标记
			var icon = null;
			var flagIndexColor = '#4174d8';
			if (this.flagMarkers.length === 0 || this.flagMarkers.length === this.flagCount - 1) {
				icon = _mapUtils.createIcon(this.blueFlagIcon, 32, 32, -24 - 32 * data.rmgGateIndex.toInt(), 0);
				flagIndexColor = '#4174d8';
			} else {
				icon = _mapUtils.createIcon(this.redFlagIcon, 32, 32, -24 - 32 * data.rmgGateIndex.toInt(), 0);
				flagIndexColor = '#f02929';
			}

			var point = _mapUtils.createPoint(rmpGateMarker.x, rmpGateMarker.y);
			var title = _mapUtils.createTitle(data.text, 12, 2, '宋体', 'blue', '#FFFFFF', '#CCCCFF', 1, point);
			var marker = _mapUtils.createMarker(icon, point, title);
			if (marker === null)
				return;

			_mapUtils.setOverlayZIndex(marker, _mapUtils.getOverlayZIndex(rmpGateMarker.marker) + 1);

			_mapUtils.setMarkTitleVisible(marker, this.showTime);

			_mapUtils.addOverlay(marker);
			this.addFlagMarkerListeners(marker, data.index);

			//序号标记
			var pt = _mapUtils.pointOffset(point, -32 - 32 * data.rmgGateIndex.toInt(), 0);
			var flagIndexTitle = _mapUtils.createTitle(data.index.toString(), 11, 6, '宋体', 'white', flagIndexColor, flagIndexColor, 0, pt);
			_mapUtils.addOverlay(flagIndexTitle);
			this.addFlagMarkerListeners(flagIndexTitle, data.index);

			_mapUtils.setOverlayZIndex(flagIndexTitle, _mapUtils.getOverlayZIndex(marker));

			var model = new FlagMarkerModel();
			model.x = point.x;
			model.y = point.y;
			model.marker = marker;
			model.flagIndexMarker = flagIndexTitle;
			model.objExt = data;
			this.flagMarkers.push(model);
		} catch (e) {
			alert("addFlagMarker: " + e.message);
		}
	},

	preformOne: function() {
		_mapUtils.flashOverlay(_trackAnalysis.flagMarkers[_trackAnalysis.threadFlag].marker, 2);
		_trackAnalysis.threadFlag += 1;
		if (_trackAnalysis.threadFlag === _trackAnalysis.flagCount)
			_trackAnalysis.threadFlag = 0;
	},

	//重绘标记
	repaintFlagIndexs: function(zoomLevel) {
		if (this.flagMarkers === null || this.flagMarkers.length <= 0) return;

		var pt = _mapUtils.createPoint(0, 0);
		var data = null;
		var rmpGateMarker = null;
		for (var j = 0; j < this.flagMarkers.length; j++) {
			data = this.flagMarkers[j].objExt;
			rmpGateMarker = _markerModelManager.getMarkerModel('3', data.rmpGateId);
			if (!data || data === null) continue;

			pt.x = rmpGateMarker.x;
			pt.y = rmpGateMarker.y;
			pt = _mapUtils.pointOffset(pt, -32 - 32 * data.rmgGateIndex.toInt(), 0);
			this.flagMarkers[j].flagIndexMarker.setPoint(pt);
		}
	},

	//添加事件
	addFlagMarkerListeners: function(marker, flagIndex) {
		try {
			marker.addListener('click', function() {
				//显示通行记录信息
				window.external.OnClickVehicleFlagCallBack(flagIndex);
			}.bind(this));
		} catch (e) {
			alert(e.message);
		}
	},

	//清除
	clear: function() {
		try {
			for (var key in this.rmpGateKeys) {
				_markerModelManager.removeMarkerModelByKey(key);
				delete this.rmpGateKeys[key];
			}

			if (this.flagMarkers.length > 0) {
				for (var i = 0; i < this.flagMarkers.length; i++) {
					_mapUtils.removeOverlay(this.flagMarkers[i].marker);
					_mapUtils.removeOverlay(this.flagMarkers[i].flagIndexMarker);
				}

				this.flagMarkers.splice(0, this.flagMarkers.length);
			}

			if (!this.patrolLine || this.patrolLine === null) return;
			_mapUtils.removeOverlay(this.patrolLine);
		} catch (e) {
			alert("TrackAnalysisClass Clear: " + this.rmpGateKeys.length + "  " + e.message);
		}
	}
});

/*!
 * 跟车分析
 */
var FollowAnalysisClass = new Class({
	rmpGateKeys: {}, //卡口对象集合
	flagMarkers: [], //标记对象集合
	flagIndexMarkers: [], //标记序号集合
	isShowTime: false, //是否显示时间标记
	redFlagIcon: "images/Flag_Red.png", //时间标记图标
	blueFlagIcon: "images/Flag_Blue.png", //时间标记图标
	trackLine: [],

	//////////////////////////public////////////////////////////
	//启动轨迹分析
	start: function(rmpGateDatas, flagDatas, points, timeModel, isFollowVehicle) {
		try {
			this.addRmpGateMarkers(rmpGateDatas);
			this.setFollowTrackLine(points);
			if (!isFollowVehicle)
				this.addFlagMarkers(flagDatas, timeModel);
		} catch (ex) {
			alert(ex.message);
		}
	},

	//设置是否显示时间标记
	setTimeMarkerVisible: function(isVisible) {
		try {
			this.isShowTime = isVisible;
			if (this.flagMarkers.length <= 0) return;
			for (var i = 0; i < this.flagMarkers.length; i++) {
				_mapUtils.setMarkTitleVisible(this.flagMarkers[i].marker, isVisible);
			}
		} catch (e) {
			alert(e.message);
		}
	},

	//////////////////////////public////////////////////////////

	//跟车轨迹线
	setFollowTrackLine: function(data) {
		if (typeof data === 'string')
			data = eval('(' + data + ')');
		if (data.length <= 0) {
			return
		};

		var overlay = _mapUtils.createPolyline(data.points, data.color, data.weight, data.opacity, data.arrow, data.lineStyle);
		if (overlay == null) return;
		_mapUtils.addOverlay(overlay);
		this.trackLine.push(overlay);
		var mbr = _mapUtils.getPolylineMBR(overlay);
		_mapUtils.centerAtMBR(mbr);
		_mapUtils.flashOverlay(overlay);
	},

	//添加卡口标记集合
	addRmpGateMarkers: function(datas) {
		try {
			if (typeof datas === 'string')
				datas = eval('(' + datas + ')');
			if (datas === null || datas.length <= 0)
				return;

			for (var i = 0; i < datas.length; i++) {
				this.addRmpGateMarker(datas[i]);
			}
		} catch (e) {
			alert(e.message);
		}
	},

	//添加卡口标记
	addRmpGateMarker: function(data) {
		try {
			if (typeof data === 'string')
				data = eval('(' + data + ')');
			var markerModel = _markerModelManager.getMarkerModel(data.type, data.id);
			if (markerModel === null)
				return;

			_markerModelManager.addMarkerModel(markerModel);
			if (this.rmpGateKeys[markerModel.getKey()])
				return;

			this.rmpGateKeys[markerModel.getKey()] = markerModel.getKey();
		} catch (e) {
			alert(e.message);
		}
	},

	//添加通行标记
	addFlagMarkers: function(datas, timeModel) {
		try {
			if (typeof datas === 'string')
				datas = eval('(' + datas + ')');
			if (datas.length <= 0) return;

			this.flagCount = datas.length;
			for (var j = 0; j < datas.length; j++) {
				this.addFlagMarker(datas[j], timeModel);
			}
		} catch (e) {
			alert(e.message);
		}
	},

	//添加通行标记
	addFlagMarker: function(data, timeModel) {
		try {
			if (typeof data === 'string')
				data = eval('(' + data + ')');
			if (typeof timeModel === 'string')
				timeModel = eval('(' + timeModel + ')');
			var rmpGateMarker = _markerModelManager.getMarkerModel('3', data.rmpGateId);
			if (rmpGateMarker === null) return;

			//图标标记
			var icon = null;
			var flagIndexColor = '#4174d8';
			if (this.flagMarkers.length === 0 || this.flagMarkers.length === this.flagCount - 1) {
				icon = _mapUtils.createIcon(this.blueFlagIcon, 32, 32, -24 - 32 * data.rmgGateIndex.toInt(), 0);
				flagIndexColor = '#4174d8';
			} else {
				icon = _mapUtils.createIcon(this.redFlagIcon, 32, 32, -24 - 32 * data.rmgGateIndex.toInt(), 0);
				flagIndexColor = '#f02929';
			}
			//时间标记
			var point = _mapUtils.createPoint(rmpGateMarker.x, rmpGateMarker.y);
			var title = _mapUtils.createTitle(data.text, timeModel.fontSize, timeModel.pos, timeModel.font, timeModel.color, timeModel.bgColor, timeModel.borderColor, timeModel.borderSize, point);
			var marker = _mapUtils.createMarker(icon, point, title);
			if (marker === null) return;

			_mapUtils.setOverlayZIndex(marker, _mapUtils.getOverlayZIndex(rmpGateMarker.marker) + 1);

			_mapUtils.setMarkTitleVisible(marker, this.showTime);
			_mapUtils.addOverlay(marker);
			this.addFlagMarkerListeners(marker, data.index);

			//序号标记
			var pt = _mapUtils.pointOffset(point, -32 - 32 * data.rmgGateIndex.toInt(), 0);
			var flagIndexTitle = _mapUtils.createTitle(data.index.toString(), 11, 6, '宋体', 'white', flagIndexColor, flagIndexColor, 0, pt);
			_mapUtils.addOverlay(flagIndexTitle);
			this.addFlagMarkerListeners(flagIndexTitle, data.index);

			_mapUtils.setOverlayZIndex(flagIndexTitle, _mapUtils.getOverlayZIndex(marker));

			var model = new FlagMarkerModel();
			model.x = point.x;
			model.y = point.y;
			model.marker = marker;
			model.flagIndexMarker = flagIndexTitle;
			model.objExt = data;
			this.flagMarkers.push(model);
		} catch (e) {
			alert(e.message);
		}
	},

	//重绘标记
	repaintFlagIndexs: function(zoomLevel) {
		if (this.flagMarkers === null || this.flagMarkers.length <= 0) return;

		var pt = _mapUtils.createPoint(0, 0);
		var data = null;
		var rmpGateMarker = null;
		for (var j = 0; j < this.flagMarkers.length; j++) {
			data = this.flagMarkers[j].objExt;
			rmpGateMarker = _markerModelManager.getMarkerModel('3', data.rmpGateId);
			if (!data || data === null) continue;

			pt.x = rmpGateMarker.x;
			pt.y = rmpGateMarker.y;
			pt = _mapUtils.pointOffset(pt, -32 - 32 * data.rmgGateIndex.toInt(), 0);
			this.flagMarkers[j].flagIndexMarker.setPoint(pt);
		}
	},

	//添加事件
	addFlagMarkerListeners: function(marker, flagIndex) {
		try {
			marker.addListener('click', function() {
				//显示通行记录信息
				window.external.OnClickVehicleFlagCallBack(flagIndex);
			}.bind(this));
		} catch (e) {
			alert(e.message);
		}
	},

	//清除
	clear: function() {
		try {
			for (var key in this.rmpGateKeys) {
				_markerModelManager.removeMarkerModelByKey(key);
				delete this.rmpGateKeys[key];
			}

			if (this.flagMarkers.length > 0) {
				for (var i = 0; i < this.flagMarkers.length; i++) {
					_mapUtils.removeOverlay(this.flagMarkers[i].marker);
					_mapUtils.removeOverlay(this.flagMarkers[i].flagIndexMarker);
				}

				this.flagMarkers.splice(0, this.flagMarkers.length);
			}

			if (this.trackLine !== null && this.trackLine.length > 0) {
				for (var i = 0; i < this.trackLine.length; i++) {
					_mapUtils.removeOverlay(this.trackLine[i]);
				}
				this.trackLine.splice(0, this.trackLine.length);
			}
		} catch (e) {
			alert("FollowAnalysisClass Clear: " + this.rmpGateKeys.length + "  " + e.message);
		}
	}

});


var CollisionRegionModel = new Class({
	id: -1, //ID
	name: '', //名称
	regionOverlay: null, //区域标记对象
	titleOvelay: null, //标题标记对象
	markerModelKeys: [], //marker对象键值
	addToMap: function() {
		if (this.regionOverlay !== null)
			_mapUtils.addOverlay(this.regionOverlay);

		if (this.titleOvelay !== null)
			_mapUtils.addOverlay(this.titleOvelay);

		if (this.markerModelKeys !== null && this.markerModelKeys.length > 0) {
			var model = null;
			var key = null;
			for (var i = 0; i < this.markerModelKeys.length; i++) {
				key = this.markerModelKeys[i];
				model = _markerModelManager.getMarkerModelByKey(key);
				if (!model || model === null)
					continue;

				_markerModelManager.addMarkerModel(model);
			};
		}
	},

	removeFromMap: function() {
		if (this.regionOverlay !== null)
			_mapUtils.removeOverlay(this.regionOverlay);
		this.regionOverlay = null;

		if (this.titleOvelay !== null)
			_mapUtils.removeOverlay(this.titleOvelay);
		this.titleOvelay = null;

		if (this.markerModelKeys !== null && this.markerModelKeys.length > 0) {
			var key = null;
			for (var i = 0; i < this.markerModelKeys.length; i++) {
				key = this.markerModelKeys[i];
				_markerModelManager.removeMarkerModelByKey(key);
			};

			this.markerModelKeys.splice(0, this.markerModelKeys.length);
		}
	}
});

/*!
 * 碰撞分析
 */
var ReportCollisionClass = new Class({
	count: 0,
	preRegionKey: '区域',
	collisionRegionModels: {},
	keys: {},
	regionStyle: {
		borderColor: 'red',
		borderSize: 3,
		fillcolor: 'green',
		defaultOpacity: 0.3
	},

	//画区域
	drawRegion: function(mode) {
		if (_mapUtils === null)
			return;

		$('drawMode').value = mode;
		_mapUtils.actionDraw(mode, this.drawRegionCallback);
	},

	//回调函数[暂用：非聚合模式展现]
	drawRegionCallback: function(str) {
		try {
			var drawMode = $('drawMode').value;
			var result = [];
			var overlay = null;
			var titleOvelay = null;
			var mbr = null;
			if (drawMode == 'drawPoint') {

			} else if (drawMode == 'drawPolyline') {

			} else if (drawMode == 'drawRect') {
				result = _markerModelManager.getMarksByRectangle(str);
				overlay = _mapUtils.createRectangle(str, _reportCollision.regionStyle.borderColor, _reportCollision.regionStyle.fillcolor, _reportCollision.regionStyle.borderSize, _reportCollision.regionStyle.defaultOpacity);
				if (!overlay)
					return;

				mbr = _mapUtils.getRectangleMBR(overlay);
			} else if (drawMode == 'drawCircle') {
				result = _markerModelManager.getMarksByCircle(str);
				overlay = _mapUtils.createCircle(str, _reportCollision.regionStyle.borderColor, _reportCollision.regionStyle.fillcolor, _reportCollision.regionStyle.borderSize, _reportCollision.regionStyle.defaultOpacity);
				if (!overlay)
					return;
				mbr = _mapUtils.getCircleMBR(overlay);
			} else if (drawMode == 'drawPolygon') {
				result = _markerModelManager.getMarksByPolygon(str);
				overlay = _mapUtils.createPolygon(str, _reportCollision.regionStyle.borderColor, _reportCollision.regionStyle.fillcolor, _reportCollision.regionStyle.borderSize, _reportCollision.regionStyle.defaultOpacity);
				if (!overlay)
					return;
				mbr = _mapUtils.getPolygonMBR(overlay);
			}

			_mapUtils.pan();
			if (result === null || result.length <= 0) {
				alert("当前区域未找到可用资源！");
				return;
			}

			var params = [];
			for (var j = 0; j < result.length; j++) {
				if (result[j].type.toString() !== '3')
					continue;

				_reportCollision.addMarkerModel(result[j]);
				params.push(result[j].getKey());
			}
			result.splice(0, result.length);

			var model = null;
			for (var key in _reportCollision.keys) {
				model = _markerModelManager.getMarkerModelByKey(key);
				result.push(model);
			}

			if (params.length <= 0) {
				alert("当前区域未找到可用资源！");
				return;
			}

			var region = new CollisionRegionModel();
			region.id = _reportCollision.count + 1;
			region.name = _reportCollision.preRegionKey + region.id;
			region.regionOverlay = overlay;

			titleOvelay = _mapUtils.createTitle(region.name, 18, 3, '宋体', 'blue', '#FFFFFF', '#CCCCFF', 1, _mapUtils.getCenterPointOfMBR(mbr));
			region.titleOvelay = titleOvelay;
			region.markerModelKeys = params;
			region.addToMap();
			_reportCollision.collisionRegionModels[region.id] = region;
			_reportCollision.count++;

			//添加区域ID，以便CS操作
			params.push(region.id);
			window.external.OnSelectCompletedCallBack(params.join(';'));
		} catch (e) {
			alert("drawRegionCallback: " + e.message);
		}
	},

	addMarkerModel: function(markerModel) {
		if (!markerModel || markerModel === null)
			return;

		var key = markerModel.getKey();
		if (this.keys[key])
			return;

		this.keys[key] = key;
	},

	removeRegion: function(regionId) {
		try {
			var region = this.collisionRegionModels[regionId];
			if (!region || region === null)
				return;

			region.removeFromMap();

			var key = null;
			for (var i = 0; i < region.markerModelKeys.length; i++) {
				delete this.keys[key];
			};
			this.count--;
			delete this.collisionRegionModels[regionId];
		} catch (e) {
			alert("removeRegion: " + e.message);
		}
	},

	clear: function() {
		try {
			for (var key in this.collisionRegionModels) {
				this.collisionRegionModels[key].removeFromMap();
			}
			delete this.collisionRegionModels;
			delete this.keys;
			this.count = 0;
		} catch (e) {

		}
	}
});

/* 
 * 防线管理
 */
var DefenseManagerClass = new Class({
	defenses: [],
	emergencyMarkers: [], //应急堵控点
	tempMarkers: [], //临时点位
	emergencyIcon: "images/emergency.png", //应急堵控点图标

	//添加多边形防线
	//params: data--json对象, title--json对象, isFlash--是否闪烁
	addPolygonDefense: function(data, title, isFlash) {
		try {
			if (typeof data === 'string')
				data = eval('(' + data + ')');
			var overlay = _mapUtils.createPolygon(data.points, data.color, data.fillcolor, data.weight, data.opacity);
			if (overlay === null) return;

			_mapUtils.addOverlay(overlay);
			this.defenses.push(overlay);

			if (isFlash)
				_mapUtils.flashOverlay(overlay);

			if (title !== "") {
				var mbr = _mapUtils.getPolygonMBR(overlay);
				this.addDefenseTitle(title, _mapUtils.getCenterPointOfMBR(mbr));
			}

		} catch (e) {
			alert("addPolygonDefense: " + e.message);
		}
	},

	//添加多段线防线
	//params: data--json对象, title--json对象, isFlash--是否闪烁
	addPolylineDefense: function(data, title, isFlash) {
		try {
			if (typeof data === 'string')
				data = eval('(' + data + ')');
			var overlay = _mapUtils.createPolyline(data.points, data.color, data.weight, data.opacity, data.arrow, data.lineStyle);
			if (overlay === null) return;

			_mapUtils.addOverlay(overlay);
			this.defenses.push(overlay);

			if (isFlash)
				_mapUtils.flashOverlay(overlay);
			var mbr = _mapUtils.getPolylineMBR(overlay);
			if (title !== "")
				this.addDefenseTitle(title, _mapUtils.getCenterPointOfMBR(mbr));
		} catch (e) {
			alert("addPolylineDefense: " + e.message);
		}
	},

	//添加应急堵控点
	addEmergencyPoint: function(datas) {
		try {
			if (this.emergencyMarkers.length > 0) {
				this.setEmergencyVisible(true);
				return;
			}

			if (typeof datas === 'string')
				datas = eval('(' + datas + ')');

			if (datas === null || datas.length <= 0)
				return;

			var icon = _mapUtils.createMyIcon(this.emergencyIcon, 32, 32, -16, -16);
			var point = null;
			var title = null;
			var marker = null;
			var key = "Emergency";
			var index = 0;
			for (var i = 0; i < datas.length; i++) {
				point = _mapUtils.createPoint(datas[i].x, datas[i].y);
				title = _mapUtils.createMyTitle(datas[i].name, '宋体', 12, "center", 'red', null, null, null, 16, (-datas[i].name.length * 12 / 2), true);
				marker = _mapUtils.createMyMarker(key + "_" + index, icon, title, point);
				this.addMarkerListeners(marker, datas[i].x, datas[i].y, datas[i].name);
				_mapUtils.addOverlay(marker);

				this.emergencyMarkers.push(marker);
			};
			this.setEmergencyNameVisible(false);
		} catch (e) {
			alert("addEmergencyPoint: " + e.message);
		}
	},

	addMarkerListeners: function(marker, x, y, remark) {
		try {
			if (marker === null) return;

			marker.addListener('mouseover', function() {
				_popup.drc('[' + remark + ']', '-经度: ' + x + '</br>-纬度: ' + y);
			});

			marker.addListener('mouseout', function() {
				_popup.nd();
			});
		} catch (e) {
			alert(e.message);
		}
	},

	//设置应急堵控点是否显示
	setEmergencyVisible: function(visible) {
		if (this.emergencyMarkers === null || this.emergencyMarkers.length <= 0)
			return;

		for (var i = 0; i < this.emergencyMarkers.length; i++) {
			this.emergencyMarkers[i].div.style.display = visible ? "" : "none";
		};
	},

	//设置应急堵控点名称是否显示
	setEmergencyNameVisible: function(visible) {
		if (this.emergencyMarkers === null || this.emergencyMarkers.length <= 0)
			return;

		for (var i = 0; i < this.emergencyMarkers.length; i++) {
			this.emergencyMarkers[i].div.childNodes[1].style.display = visible ? "" : "none";
		};
	},

	//添加标题
	addDefenseTitle: function(data, pt) {
		if (typeof data === 'string')
			data = eval('(' + data + ')');

		if (data.x > 0 && data.y > 0)
			pt = _mapUtils.createPoint(data.x, data.y);
		var overlay = _mapUtils.createTitle(data.name, data.fontSize, data.pos, data.font, data.color, data.bgColor, data.borderColor, data.borderSize, pt);
		if (overlay === null) return;

		_mapUtils.addOverlay(overlay);
		this.defenses.push(overlay);
	},

	//定位防线[面填充]
	locatePolygonDefense: function(data, title, isFlash, isSelect) {
		try {
			if (typeof data === 'string')
				data = eval('(' + data + ')');

			var overlay = _mapUtils.createPolygon(data.points, data.color, data.fillcolor, data.weight, data.opacity);
			if (overlay === null) return;

			_mapUtils.addOverlay(overlay);
			this.defenses.push(overlay);

			//获取overlay对象的外包络框
			var mbr = _mapUtils.getPolygonMBR(overlay);
			_mapUtils.centerAtMBR(mbr);

			if (isFlash)
				_mapUtils.flashOverlay(overlay);

			if (title !== "")
				this.addDefenseTitle(title, _mapUtils.getCenterPointOfMBR(mbr));
			if (isSelect) {
				var result = _markerModelManager.getMarksByPolygon(data.points);
				_markerClusterer.startGather(result, mbr, false);
			}
		} catch (e) {
			alert(e.message);
		}
	},

	//定位防线[不填充]
	locatePolygonDefenseNoFill: function(data, title, isFlash, isSelect) {
		try {
			if (typeof data === 'string')
				data = eval('(' + data + ')');

			//var overlay = _mapUtils.createPolyline(data.points, data.color, data.weight, data.opacity,0,"none");
			var overlay = _mapUtils.createPolygon(data.points, data.color, data.fillcolor, data.weight, data.opacity);
			if (overlay === null) return;
			overlay.setFillOpacity(0);

			_mapUtils.addOverlay(overlay);
			this.defenses.push(overlay);

			//获取overlay对象的外包络框
			var mbr = _mapUtils.getPolygonMBR(overlay);
			_mapUtils.centerAtMBR(mbr);

			if (isFlash)
				_mapUtils.flashOverlay(overlay);

			if (title !== "")
				this.addDefenseTitle(title, _mapUtils.getCenterPointOfMBR(mbr));
			if (isSelect) {
				var result = _markerModelManager.getMarksByPolygon(data.points);
				_markerClusterer.startGather(result, mbr, false);
			}
		} catch (e) {
			alert(e.message);
		}
	},

	//定位防线[线]
	locatePolylineDefense: function(data, title, isFlash) {
		try {
			if (typeof data === 'string')
				data = eval('(' + data + ')');
			var overlay = _mapUtils.createPolyline(data.points, data.color, data.weight, data.opacity, data.arrow, data.lineStyle);
			if (overlay === null) return;

			_mapUtils.addOverlay(overlay);
			this.defenses.push(overlay);
			if (isFlash)
				_mapUtils.flashOverlay(overlay);

			var mbr = _mapUtils.getPolylineMBR(overlay);
			_mapUtils.centerAtMBR(mbr);
			if (title != "" && title != null)
				this.addDefenseTitle(title, _mapUtils.getCenterPointOfMBR(mbr));
		} catch (e) {
			alert(e.message);
		}
	},

	//注记点定位
	//params:data--json对象，lever--地图缩放级别，isFlash--是否闪烁
	locationTitleDefense: function(data, level, isFlash) {
		if (typeof data === 'string')
			data = eval('(' + data + ')');
		var point = _mapUtils.createPoint(data.x, data.y);
		if (point == null) return;
		var overlay = _mapUtils.createTitle(data.name, data.fontSize, data.pos, data.font, data.color, data.bgColor, data.borderColor, data.borderSize, point);
		if (overlay === null) return;
		_mapUtils.centerByPoint(point);
		_mapUtils.setZoomLevel(level);
		if (isFlash == true)
			_mapUtils.flashOverlay(overlay);
		_mapUtils.addOverlay(overlay);
		this.defenses.push(overlay);
	},

	//应急堵控点定位
	//params:data--json对象，lever--地图缩放级别，isFlash--是否闪烁
	locationEmergencyPoint: function(data, level, isFlash) {
		try {
			if (typeof data === 'string')
				data = eval('(' + data + ')');
			var icon = _mapUtils.createMyIcon(this.emergencyIcon, 32, 32, -16, -16);
			var key = data.type + "_" + data.id;
			var point = _mapUtils.createPoint(data.x, data.y);
			var title = _mapUtils.createMyTitle(data.name, '宋体', 12, "center", 'red', null, null, null, 16, (-data.name.length * 12 / 2), true);
			var marker = _mapUtils.createMyMarker(key, icon, title, point);
			this.addMarkerListeners(marker, data.x, data.y, data.name);
			_mapUtils.addOverlay(marker);
			this.tempMarkers.push(marker);

			_mapUtils.centerAndZoom(data.x, data.y, level);
			if (isFlash) {
				_mapUtils.flashOverlay(marker);
			}

		} catch (e) {
			alert("locationEmergencyPoint:" + e.message);
		}
	},

	//清除防线
	clear: function() {
		try {
			if (this.defenses.length > 0) {
				for (var i = 0; i < this.defenses.length; i++) {
					_mapUtils.removeOverlay(this.defenses[i]);
				}
				this.defenses.splice(0, this.defenses.length);
			}
			if (this.tempMarkers.length > 0) {
				for (var i = 0; i < this.tempMarkers.length; i++) {
					//alert(this.tempMarkers[i].div);
					this.tempMarkers[i].div.childNodes[0].style.display = "none";
					this.tempMarkers[i].div.childNodes[1].style.display = "none";
					//_mapUtils.removeOverlay(this.tempMarkers[i]);
				}
				this.tempMarkers.splice(0, this.tempMarkers.length);
			}

			this.setEmergencyVisible(false);
		} catch (e) {
			alert("defenseManager Clear: " + this.defenses.length + "  " + e.message);
		}

	}
});


var AdministrativeModel = new Class({
	id: -1,
	name: '',
	type: '',
	mbr: null,
	polygons: [],
	isAddToMap: false,
	visible: false,
	fillOpacity: 0.5,

	locate: function() {
		if (this.mbr === null)
			return;
		_mapUtils.centerAtMBR(this.mbr);
	},

	display: function(visible, isFlash) {
		if (this.visible === visible)
			return;

		try {
			for (var i = 0; i < this.polygons.length; i++) {
				if (!this.isAddToMap) {
					_mapUtils.addOverlay(this.polygons[i]);
				}

				_mapUtils.stopFlashOverlay(this.polygons[i]);
				this.polygons[i].div.style.display = visible ? '' : 'none';
				if (isFlash)
					_mapUtils.flashOverlay(this.polygons[i]);
			}

			this.visible = visible;
			if (!this.isAddToMap)
				this.isAddToMap = true;
		} catch (e) {
			alert("display: " + e.message);
		}
	},

	setFillOpacity: function(opacity) {
		if (this.fillOpacity === opacity || this.polygons.length <= 0)
			return;

		for (var i = 0; i < this.polygons.length; i++) {
			this.polygons[i].setFillOpacity(opacity);
		}

		this.fillOpacity = opacity;
	}
});

/*
 * 行政区域管理
 */
var AdministrativeManagerClass = new Class({
	administratives: {},
	administrativeStyles: {
		color: '#1E90FF',
		fillcolor: '#1E90FF',
		weight: 3,
		opacity: 0.5
	},
	mbrAdministrative: null,

	//定位区域
	//params: data--json对象, color--颜色, fillcolor--填充颜色, weight--宽度, opacity--透明度, isFlash--是否闪烁
	locateAera: function(data, isFlash) {
		try {
			if (typeof data === 'string')
				data = eval('(' + data + ')');

			this.clear();
			if (!data.polygonPoints)
				return;
			this.setAdministrativeStyles(data);

			//如果存在
			var model = this.administratives[data.administrativeId];
			if (model) {
				this.mbrAdministrative = model.mbr;
				model.setFillOpacity(this.administrativeStyles.opacity);
				model.locate();
				setTimeout(function() {
					model.display(true, isFlash);
				}.bind(this), 300);
				return;
			}

			//点集json对象
			var polygonDatas = data.polygonPoints;
			if (typeof polygonDatas === 'string')
				polygonDatas = eval('(' + polygonDatas + ')');

			//不存在
			var festures = polygonDatas.features;
			if (festures.length > 0) {
				model = new AdministrativeModel();
				model.id = data.administrativeId;
				model.name = data.name;
				model.type = data.administrativeType;

				var polygons = [];
				var overlay = null;
				var mbr = null;
				for (var i = 0; i < festures.length; i++) {
					var rings = festures[i].geometry.rings;
					for (var j = 0; j < rings.length; j++) {
						overlay = _mapUtils.createPolygon(rings[j].toString(), this.administrativeStyles.color, this.administrativeStyles.fillcolor, this.administrativeStyles.weight, this.administrativeStyles.opacity);
						if (overlay === null) continue;
						mbr = _mapUtils.unionMBR(_mapUtils.getPolygonMBR(overlay), mbr);

						polygons.push(overlay);
					}
				}

				model.polygons = polygons;
				model.fillOpacity = this.administrativeStyles.opacity;
				model.mbr = mbr;
				this.administratives[data.administrativeId] = model;
				this.mbrAdministrative = mbr;
				model.locate();
				setTimeout(function() {
					model.display(true, isFlash);
				}.bind(this), 300);
			}
		} catch (e) {
			alert("locateAera: " + e.message);
		}
	},

	//定位区域[不填充]
	//params: data--json对象, color--颜色, fillcolor--填充颜色, weight--宽度, opacity--透明度, isFlash--是否闪烁
	locateAeraNoFill: function(data, isFlash) {
		try {
			if (typeof data === 'string')
				data = eval('(' + data + ')');

			this.clear();
			if (!data.polygonPoints)
				return;
			this.setAdministrativeStyles(data);

			//如果存在
			var model = this.administratives[data.administrativeId];
			if (model) {
				this.mbrAdministrative = model.mbr;
				model.setFillOpacity(0);
				model.locate();
				setTimeout(function() {
					model.display(true, isFlash);
				}.bind(this), 300);
				return;
			}

			//点集json对象
			var polygonDatas = data.polygonPoints;
			if (typeof polygonDatas === 'string')
				polygonDatas = eval('(' + polygonDatas + ')');

			//不存在
			var festures = polygonDatas.features;
			if (festures.length > 0) {
				model = new AdministrativeModel();
				model.id = data.administrativeId;
				model.name = data.name;
				model.type = data.administrativeType;

				var polygons = [];
				var overlay = null;
				var mbr = null;
				for (var i = 0; i < festures.length; i++) {
					var rings = festures[i].geometry.rings;
					for (var j = 0; j < rings.length; j++) {
						//overlay = _mapUtils.createPolyline(rings[j].toString(), this.administrativeStyles.color, this.administrativeStyles.weight, this.administrativeStyles.opacity,0,"none");
						overlay = _mapUtils.createPolygon(rings[j].toString(), this.administrativeStyles.color, this.administrativeStyles.fillcolor, this.administrativeStyles.weight, this.administrativeStyles.opacity);
						if (overlay === null) continue;
						overlay.setFillOpacity(0);
						mbr = _mapUtils.unionMBR(_mapUtils.getPolygonMBR(overlay), mbr);

						polygons.push(overlay);
					}
				}

				model.polygons = polygons;
				model.mbr = mbr;
				model.fillOpacity = 0;
				this.administratives[data.administrativeId] = model;
				this.mbrAdministrative = mbr;
				model.locate();
				setTimeout(function() {
					model.display(true, isFlash);
				}.bind(this), 300);
			}
		} catch (e) {
			alert("locateAera: " + e.message);
		}
	},

	//设置行政区域的显示样式
	setAdministrativeStyles: function(data) {
		if (data == null) return;
		if (typeof data === 'string') {
			data = eval('(' + data + ')');
		}
		this.administrativeStyles.color = data.color;
		this.administrativeStyles.fillcolor = data.fillcolor;
		this.administrativeStyles.weight = data.weight;
		this.administrativeStyles.opacity = data.opacity;
	},

	//显示标记
	showMarkers: function(markerKeys) {
		var keys = markerKeys.split(';');
		if (keys.length > 0) {
			var result = [];
			var model = null;
			for (var i = 0; i < keys.length - 1; i++) {
				model = _markerModelManager.getMarkerModelByKey(keys[i]);
				if (model)
					result.push(model);
			}
			_markerClusterer.startGather(result, this.mbrAdministrative, false);
		}
	},

	//清除
	clear: function() {
		try {
			for (var key in this.administratives) {
				this.administratives[key].display(false, false);
			}
			this.mbrAdministrative = null;
		} catch (e) {
			alert("AdministrativeManagerClass clear: " + e.message);
		}
	}
});

/*
 * 布点管理
 */
var LocationManagerClass = new Class({
	divMousePoint: null,
	mousepoint: null,
	isLocating: false,
	markerModelKeys: [],
	//启动布点
	startLocation: function() {
		try {
			if (_locationManager.divMousePoint === null) {
				_locationManager.divMousePoint = document.createElement('div');
				_locationManager.divMousePoint.id = 'mousepoint';
				_locationManager.divMousePoint.innerHTML = '<div class="icon"></div><span class="text">\u5DE6\u952E\u6807\u8BB0\uFF0C\u53F3\u952E\u53D6\u6D88</span>';
				document.body.appendChild(_locationManager.divMousePoint);
			}

			document.addEvent('mousemove', _locationManager.moveLocation);
			document.addEvent('mouseup', _locationManager.cancelLocated); // 右键取消定位

			// 开启取点模式 但是不期望鼠标变化
			_mapUtils.pan();
		} catch (e) {
			alert("startLocation: " + e.message);
		}
	},

	//布点时，移动鼠标位置
	moveLocation: function(e) {
		var top = e.page.y - 23,
			left = e.page.x - 6;

		if (_locationManager.mousepoint === null)
			_locationManager.mousepoint = _mapUtils.createPoint(e.page.x, e.page.y);
		else {
			_locationManager.mousepoint.x = e.page.x;
			_locationManager.mousepoint.y = e.page.y;
		}
		_locationManager.divMousePoint.style.top = top + 'px';
		_locationManager.divMousePoint.style.left = left + 'px';
	},

	//右键，取消布点
	cancelLocated: function(e) {
		if (e.rightClick) {
			_locationManager.stopLocation(null);
		} else {
			var pt = _mapUtils.pointToMap(_locationManager.mousepoint);
			_locationManager.stopLocation(pt);
		}
	},

	//完成布点操作
	stopLocation: function(point) {
		try {
			if (_locationManager.divMousePoint !== null) {
				document.removeEvent('mousemove', _locationManager.startLocation);
				document.removeEvent('mousedown', _locationManager.cancelLocated);
				document.body.removeChild(_locationManager.divMousePoint);
				_mapUtils.pan();
				_locationManager.divMousePoint = null;
			}

			if (point === null) return;
			_locationManager.isLocating = true;
			window.external.OnMapClickCallBack(point.x, point.y);
		} catch (e) {

		}
	},

	//临时保存对象
	saveMarkerKeys: function(key) {
		this.markerModelKeys.push(key);
		this.isLocating = false;
	},

	//清除
	clear: function() {
		try {
			if (this.markerModelKeys.length > 0) {
				for (var i = 0; i < this.markerModelKeys.length; i++) {
					_markerModelManager.removeMarkerModelByKey(this.markerModelKeys[i]);
				}
				this.markerModelKeys.splice(0, this.markerModelKeys.length);
			}
		} catch (e) {
			alert("LocationManagerClass Clear: " + this.markerModelKeys.length + "  " + e.message);
		}
	}
});
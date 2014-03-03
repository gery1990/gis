// 地图辅助类
var GisMapTools = {

	// geometry:框选/圈选 group:分组选择
	selectType: "",

	// 当前选区坐标信息
	currGeometry: "",

	// 当前监控点的信息
	currentCamera: null,

	// 当前选中的组
	groupObj: null,

	clusterLayer: null,

	//搜索结果图层
	searchResultLayer: "",

	//是否已点击地图标注
	isOnClickGraphic: false,

	//标注数
	markerCount: 0,

	//标注圆圈元素
	markerCircle: null,

	//标注圆圈元素重置位置按钮
	markerCircleResizeBtn: null,

	//标注半径提示语
	markerCircleRadius: null,

	//提示语
	markerCircleRadiusText: null,

	//地图拖拽事件
	mapMouseDragHandle: null,

	//标注中心点坐标
	markerCenter: null,

	//标注拖拽结束坐标
	markerDragEnd: null,

	wgs: new esri.SpatialReference({
		"wkid":   102100
	}),

	initialize: function(){
		this.registerHelper();
	},
	// 选择地区
	selectPlace: function(obj) {
		var This = jQuery(obj),
			Next = This.next();
		if (Next.is(":hidden")) {
			Next.fadeIn(200);
		} else if (Next.is(":visible")) {
			Next.fadeOut(200);
		}
		jQuery(".map-select-list").fadeOut(200);
		jQuery("#mapSearchAroundContent").fadeOut(200);
	},

	// 选择区域下拉列表
	selectMap: function(obj) {
		var This = jQuery(obj),
			Next = This.next();
		if (Next.is(":hidden")) {
			Next.fadeIn(200);
		} else if (Next.is(":visible")) {
			Next.fadeOut(200);
		}
		jQuery(".map-region-info").fadeOut(200);
		jQuery("#mapSearchAroundContent").fadeOut(200);
	},

	// 隐藏搜索区域内容
	hideSearchAroundContent: function(obj) {
		var This = jQuery(obj);
		This.parent().fadeOut(200);
	},

	// 获取所有的监控点
	getAllCameras: function() {
		jQuery.ajax({
			url: '/service/map/map_all_cameras',
			type: 'post',
			dataType: 'json',
			success: function(res) {
				if (res.code === 200) {
					GisMapTools.clusterCameras(res.data.cameras);
				} else if (res.code === 500) {
					notify.error(res.data.message);
				} else {
					notify.error("获取数据异常！");
				}
			},
			error: function() {
				notify.error("请查看网络状况！");
			}
		});
	},

	// 聚合监控点
	clusterCameras: function(datas) {
		var camerasInfo = {};
		require(["dojo/_base/array", "dojo/ClusterLayer"], function(array, ClusterLayer) {
			camerasInfo.data = array.map(datas, function(p) {
				var webMercator = new esri.geometry.Point(parseFloat(p.longitude), parseFloat(p.latitude), GisMapTools.wgs);
				if (mapConfig.coorTransform) {
					webMercator = esri.geometry.geographicToWebMercator(webMercator);
				}
				return {
					"x": webMercator.x,
					"y": webMercator.y,
					"attributes": p
				};
			});
			GisMapTools.clusterLayer = new ClusterLayer({
				"data": camerasInfo.data,
				"id": "clusters",
				"distance": 100,
				"labelColor": "#fff",
				"labelOffset": 10,
				"resolution": InspectMap.extent.getWidth() / InspectMap.width,
				"singleColor": "#F9927F",
				"spatialReference": GisMapTools.wgs,
				"singleTemplate": new esri.InfoTemplate({
					"title": "",
					"content": ""
				})
				//"singleSymbol": new esri.symbol.PictureMarkerSymbol("/assets/images/map/simple-marker.gif", 10, 13)
			});
			// cluster layer that uses OpenLayers style clustering
			var defaultSym = new esri.symbol.SimpleMarkerSymbol().setSize(4);
			var renderer = new esri.renderer.ClassBreaksRenderer(defaultSym, "clusterCount");

			var blue = new esri.symbol.PictureMarkerSymbol("/assets/images/map/camera-ball.png", 12, 14);
			var cluster1 = new esri.symbol.PictureMarkerSymbol("/assets/images/map/map-cluster-1.png", 20, 23).setOffset(1, 12),
				cluster2 = new esri.symbol.PictureMarkerSymbol("/assets/images/map/map-cluster-2.png", 30, 23).setOffset(1, 12),
				cluster3 = new esri.symbol.PictureMarkerSymbol("/assets/images/map/map-cluster-3.png", 34, 23).setOffset(1, 12),
				cluster4 = new esri.symbol.PictureMarkerSymbol("/assets/images/map/map-cluster-4.png", 40, 23).setOffset(1, 12);
			renderer.addBreak(0, 2, blue);
			renderer.addBreak(2, 100, cluster1);
			renderer.addBreak(100, 1000, cluster2);
			renderer.addBreak(1000, 10000, cluster3);
			renderer.addBreak(10000, 100000, cluster4);
			GisMapTools.clusterLayer.setRenderer(renderer);
			InspectMap.addLayer(GisMapTools.clusterLayer);
			// close the info window when the map is clicked
			InspectMap.on("click", GisMapTools.cleanUp);
			// close the info window when esc is pressed
			InspectMap.on("key-down", function(e) {
				if (e.keyCode === 27) {
					GisMapTools.cleanUp();
				}
			});
		});
	},

	// 清除聚合
	cleanUp: function() {
		//InspectMap.infoWindow.hide();
		GisMapTools.clusterLayer.clearSingles();
	},
	//隐藏提示信息
	hideTooltip: function() {
		jQuery("#gismap .map-measure-tooltip").css("left", "-2000px");
		jQuery("#gismap").unbind("mousemove");
	},
	//显示提示信息
	getTooltipPosition: function(evt) {
		var top, left;
		var ie = navigator.userAgent.indexOf("MSIE") > 0;
		var isFullscreen = (parseInt(jQuery("#major").css("left")) <= 0) ? true : false;
		if (ie) {
			if (isFullscreen) {
				left = parseInt(evt.clientX);
				top = parseInt(evt.clientY + 20);
			} else {
				left = parseInt(evt.clientX - 280);
				top = parseInt(evt.clientY - 86);
			}
		} else {
			if (isFullscreen) {
				left = parseInt((evt.x ? evt.x : evt.pageX));
				top = parseInt((evt.y ? evt.y : evt.pageY) + 20);
			} else {
				left = parseInt((evt.x ? evt.x : evt.pageX) - 280);
				top = parseInt((evt.y ? evt.y : evt.pageY) - 86);
			}
		}
		return {
			left: left,
			top: top
		};
	},
	//获取提示
	getTooltip: function() {
		return jQuery("#gismap .map-measure-tooltip");
	},
	// 框选
	rectangleSelect: function(obj) {
		InpectDrawtool.deactivate();
		InspectMarkertool.deactivate();
		InspectMeasuretool.setTool("distance", false);
		GisMapTools.hideTooltip();
		//释放鼠标移动和点击事件
		if (MeasureOnMouseMoveHandle) {
			dojo.disconnect(MeasureOnMouseMoveHandle);
		}
		if (MeasureOnClickHandle) {
			dojo.disconnect(MeasureOnClickHandle);
		}
		InspectPager = null;
		var This = jQuery(obj);
		This.parent().parent().fadeOut(200);
		GisMapTools.selectType = "geometry";
		InpectDrawtool.activate(esri.toolbars.Draw.RECTANGLE);
		jQuery("#gismap").bind("mousemove", function(evt) {
			var position = GisMapTools.getTooltipPosition(evt);
			GisMapTools.getTooltip().css({
				left: position.left + "px",
				top: position.top + "px"
			});
			GisMapTools.getTooltip().html("按住鼠标左键拖选区域,</br>释放完成绘制。");
		});
	},

	// 圈选
	circleSelect: function(obj) {
		InpectDrawtool.deactivate();
		InspectMarkertool.deactivate();
		InspectMeasuretool.setTool("distance", false);
		//释放鼠标移动和点击事件
		if (MeasureOnMouseMoveHandle) {
			dojo.disconnect(MeasureOnMouseMoveHandle);
		}
		if (MeasureOnClickHandle) {
			dojo.disconnect(MeasureOnClickHandle);
		}
		GisMapTools.hideTooltip();
		InspectPager = null;
		var This = jQuery(obj);
		This.parent().parent().fadeOut(200);
		GisMapTools.selectType = "geometry";
		InpectDrawtool.activate(esri.toolbars.Draw.CIRCLE);
		jQuery("#gismap").bind("mousemove", function(evt) {
			var position = GisMapTools.getTooltipPosition(evt);
			GisMapTools.getTooltip().css({
				left: position.left + "px",
				top: position.top + "px"
			});
		});
		GisMapTools.getTooltip().html("按住鼠标左键拖选区域,</br>释放完成绘制。");
	},

	// 坐标数组转换
	convertArrayToWKT: function(arr) {
		if (arr === null || arr === '' || arr === 'undefined') {
			return;
		}
		var result = "POLYGON((";
		for (var i = 0, j = arr.length; i < j; i++) {
			if (i === j - 1) {
				result += arr[i][0] + " " + arr[i][1] + "))";
			} else {
				result += arr[i][0] + " " + arr[i][1] + ",";
			}
		}
		return result;
	},
	// 选区后回调函数
	searchCallBack: function(geometry, curr_page, page_size) {
		GisMapTools.currGeometry = geometry;
		InpectDrawtool.deactivate();
		GisMapTools.hideTooltip();
		var points = GisMapTools.convertArrayToWKT(geometry.geographicGeometry.rings[0]);
		jQuery.ajax({
			url: "/service/map/map_geometry_cameras",
			type: 'get',
			cache: false,
			data: {
				points: points,
				current_page: curr_page ? curr_page : 1,
				page_size: page_size ? page_size : 10
			},
			dataType: 'json',
			success: function(res) {
				if (res.code === 200) {
					GisMapTools.setCamerasToMap(res);
				} else if (res.code === 500) {
					notify.error(res.data.message);
				} else {
					notify.error("获取数据异常！");
				}
			},
			error: function() {
				notify.error("请查看网络状况！");
			}
		});
	},
	registerHelper: function(){
		Handlebars.registerHelper("cameraStatusAndType", function(status, type,  options){
			if((status===0)&& (type===0)){
				return "camera-gun-online";
			}
			if((status===0)&& (type===1)){
				return "camera-gun-offline";
			}
			if((status===1)&& (type===0)){
				return "camera-ball-online";
			}
			if((status===1)&& (type===1)){
				return "camera-ball-offline";
			}
		});
		//左边显示搜索结果
		Handlebars.registerHelper("isOnline", function(num, options) {
			if (num === 0) {
				return options.fn({'data':true});
			}
			if (num === 1) {
				return options.fn({'data':false});
			}
			return options.fn();
		});
		Handlebars.registerHelper("picture", function(imgUrl) {
			if (imgUrl) {
				return imgUrl;
			}
			return "/assets/images/map/video-default.png";
		});
	},
	// 给地图撒监控点
	setCamerasToMap: function(resultdata) {
		dojo.disconnect(SearchResultLayerGraphicsOnClickHandle);
		dojo.disconnect(SearchResultLayerGraphicsOnMouseoverHandle);
		dojo.disconnect(SearchResultLayerGraphicsOnMouseoutHandle);
		InspectMap.infoWindow.hide();
		if (GisMapTools.searchResultLayer) {
			GisMapTools.searchResultLayer.clear();
		} else {
			GisMapTools.searchResultLayer = new esri.layers.GraphicsLayer({
				id: "search-result-layer"
			});
			InspectMap.addLayer(GisMapTools.searchResultLayer);
		}
		var cameraNum = resultdata.data.cameras.length;
		var cameraSymbol = null;
		var textSymbol = null;
		var cameraFlag = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
		for (var i = 0; i < cameraNum; i++) {
			resultdata.data.cameras[i].num = cameraFlag[i];
			var imgSymbolData = resultdata.data.cameras[i];
			var textSymbolData = resultdata.data.cameras[i];
			textSymbolData.index = i * 2 + 1;
			imgSymbolData.index = i * 2;
			cameraSymbol = new esri.symbol.PictureMarkerSymbol("/assets/images/map/map-marker-red.png", 22, 26).setOffset(2, 1);
			textSymbol = new esri.symbol.TextSymbol(cameraFlag[i],
				new esri.symbol.Font("12px"),
				new dojo.Color("#fff"));
			//信息窗（图片）
			var picture = imgSymbolData.imgUrl ? imgSymbolData.imgUrl : "/assets/images/map/video-default.png";
			var content = Handlebars.compile(jQuery("#map-camera-info").html());
			var infoTemplate = new esri.InfoTemplate({
				title: resultdata.data.cameras[i].name,
				content: content(resultdata.data.cameras[i])
			});
			//监控点标注
			if (resultdata.data.cameras[i].longitude && resultdata.data.cameras[i].latitude) {
				var webMercator = new esri.geometry.Point(parseFloat(resultdata.data.cameras[i].longitude), parseFloat(resultdata.data.cameras[i].latitude));
				if (mapConfig.coorTransform) {
					webMercator = esri.geometry.geographicToWebMercator(webMercator);
				}
				var marker = new esri.Graphic({
					"geometry": {
						"x": webMercator.x,
						"y": webMercator.y,
						"spatialReference": {
							"wkid": mapConfig.extent.spatialReference.wkid ? mapConfig.extent.spatialReference.wkid : 102100
						}
					},
					"attributes": imgSymbolData
				});

				marker.setSymbol(cameraSymbol);
				marker.setInfoTemplate(infoTemplate);
				GisMapTools.searchResultLayer.add(marker);
				var textMarker = new esri.Graphic({
					"geometry": {
						"x": webMercator.x,
						"y": webMercator.y,
						"spatialReference": {
							"wkid": mapConfig.extent.spatialReference.wkid ? mapConfig.extent.spatialReference.wkid : 102100
						}
					},
					"attributes": textSymbolData
				});
				textMarker.setSymbol(textSymbol);
				textMarker.setInfoTemplate(infoTemplate);
				GisMapTools.searchResultLayer.add(textMarker);
			}
		}
		jQuery(".esriPopup .titleButton.close").unbind("click");
		jQuery(".esriPopup .titleButton.close").click(function() {
			if (GisMapTools.currentCamera) {
				var num = GisMapTools.currentCamera.attributes.num;
				//重置标注的图标
				var hoverCameraSymbol = new esri.symbol.PictureMarkerSymbol("/assets/images/map/map-marker-red.png", 22, 26).setOffset(2, 1);
				GisMapTools.currentCamera.setSymbol(hoverCameraSymbol);

				var ThisSearchResult = jQuery(".map-search-result-item[item_id |= '" + num + "']");
				if (ThisSearchResult.hasClass("active")) {
					ThisSearchResult.removeClass("active");
					ThisSearchResult.find(".map-result-ico-red").removeClass("active");
					ThisSearchResult.find(".third-line").removeClass("active");
				}
				GisMapTools.currentCamera = null;
			}
		});
		// 鼠标单击监控点
		SearchResultLayerGraphicsOnClickHandle = GisMapTools.searchResultLayer.on("mouse-down", function(e) {
			if (e.graphic.attributes) {
				var num = e.graphic.attributes.num;
				var index = e.graphic.attributes.index;
				if (index % 2 === 1) {
					index = index - 1;
				}
				var currGraphic = this.graphics[index];

				if (GisMapTools.currentCamera !== null) {
					var cameraSymbol = new esri.symbol.PictureMarkerSymbol("/assets/images/map/map-marker-red.png", 22, 26).setOffset(2, 1);
					GisMapTools.currentCamera.setSymbol(cameraSymbol);
				}
				InspectMap.infoWindow.updateHighlight(InspectMap, currGraphic);
				var hoverCameraSymbol = new esri.symbol.PictureMarkerSymbol("/assets/images/map/map-marker-blue.png", 22, 29).setOffset(1, 1);
				currGraphic.setSymbol(hoverCameraSymbol);
				//设置左侧搜索结果
				var ThisSearchResult = jQuery(".map-search-result-item[item_id |= '" + num + "']");
				GisMapTools.linkageToSearchResultClick(ThisSearchResult[0]);
				GisMapTools.currentCamera = currGraphic;
				GisMapTools.isOnClickGraphic = true;
			}
		});
		//鼠标悬浮监控点
		SearchResultLayerGraphicsOnMouseoverHandle = GisMapTools.searchResultLayer.on("mouse-over", function(e) {
			if (e.graphic.attributes) {
				var num = e.graphic.attributes.num;
				if (GisMapTools.currentCamera) {
					if (GisMapTools.currentCamera.attributes.num === num) {
						return;
					}
				}
				var index = e.graphic.attributes.index;
				if (index % 2 === 1) {
					index = index - 1;
				}

				var currGraphic = this.graphics[index];
				var textGraphic = this.graphics[index + 1];

				var hoverCameraSymbol = new esri.symbol.PictureMarkerSymbol("/assets/images/map/map-marker-blue.png", 22, 29).setOffset(1, 1);
				currGraphic.setSymbol(hoverCameraSymbol);
				//设置左侧搜索结果
				var ThisSearchResult = jQuery(".map-search-result-item[item_id |= '" + num + "']");
				GisMapTools.linkageToSearchResultHover(ThisSearchResult[0]);
			}
		});
		//鼠标移出监控点
		SearchResultLayerGraphicsOnMouseoutHandle = GisMapTools.searchResultLayer.on("mouse-out", function(e) {
			if (e.graphic.attributes) {
				var num = e.graphic.attributes.num;
				if (GisMapTools.currentCamera) {
					if (GisMapTools.currentCamera.attributes.num === num) {
						return;
					}
				}
				var index = e.graphic.attributes.index;
				if (index % 2 === 1) {
					index = index - 1;
				}
				var currGraphic = this.graphics[index];
				var cameraSymbol = new esri.symbol.PictureMarkerSymbol("/assets/images/map/map-marker-red.png", 22, 26).setOffset(2, 1);
				currGraphic.setSymbol(cameraSymbol);
				//设置左侧搜索结果
				var ThisSearchResult = jQuery(".map-search-result-item[item_id |= '" + num + "']");
				GisMapTools.linkageToSearchResultHoverout(ThisSearchResult[0]);
			}
		});

		
		var pagerListener = null,
			template = Handlebars.compile(jQuery("#map-search-result").html());

		if (InspectPager === null) {
			var templateContainer = Handlebars.compile(jQuery("#map-search-result-container").html());
			jQuery("#camerasPanel .overview > .mapping").empty().html(templateContainer);
		}

		jQuery("#camerasPanel .overview > .mapping #mapSearchResult").empty().html(template(resultdata.data));

		// 切换面板
		jQuery('#treePanel .overview').children().hide().filter('.mapping').show();
		jQuery('#treePanel .form-panel').children().removeClass('active');

		GisMapTools.bindSearchResultEvents();

		if (InspectPager === null) {
			if (GisMapTools.selectType === "geometry") {
				pagerListener = GisMapTools.searchCallBack;
			} else if (GisMapTools.selectType === "group") {
				pagerListener = GisMapTools.searchArea;
			}
			InspectPager = new MapPage({
				curr_page: 1,
				page_size: 10,
				target: "map-pager",
				total_page: resultdata.data.count / 10 > parseInt(resultdata.data.count / 10) ? parseInt(resultdata.data.count / 10) + 1 : parseInt(resultdata.data.count / 10),
				listener: pagerListener
			});
		}
	},
	grouplist: function(list, parent) {
		if (jQuery("#groupwrap").length !== 0) {
			jQuery("#groupwrap").remove();
		}
		jQuery.when(Toolkit.loadTempl('/assets/inc/grouplist.html')).done(function(source) {
			var template = Handlebars.compile(source);
			parent.append(template(list));
		});
	},
	//绑定搜索结果事件
	bindSearchResultEvents: function() {
		//搜索结果事件绑定
		jQuery(".map-search-result-item").bind({
			click: function() {
				GisMapTools.clickSearchResultItem(this);
			},
			mouseenter: function() {
				GisMapTools.hoverSearchResultItem(this);
			},
			mouseleave: function() {
				GisMapTools.hoveroutSearchResultItem(this);
			}
		});
		//添加到自定义分组
		jQuery(".map-search-result-item .map-add-group").click(function() {
			var data = jQuery(this).closest(".search-result").data();
			var parent = jQuery(this);
			jQuery.getJSON("/service/video_access/list_customGroup?cameraId=" + data.id + "&r=" + Math.random(), function(res) {
				GisMapTools.grouplist(res.data, parent);
				if (jQuery(".grouplist").has("h2")) {
					return;
				}
				jQuery(".grouplist").tinyscrollbar({
					thumbSize: 15
				});
			});
			e.stopPropagation();
		});
		jQuery(".map-search-result-item .map-add-group").mouseleave(function() {
			jQuery("#groupwrap").hide();
		});
		//添加到监巡分组
		jQuery(".map-search-result-item .map-add-inspect").click(function() {
			var data = jQuery(this).closest(".search-result").data();
			var parent = jQuery(this);
			VideoWatch.getVideoWatchList(data.id, function(list) {
				GisMapTools.grouplist({
					cameras: list
				}, parent);
				if (jQuery(".grouplist").has("h2")) {
					return;
				}
				jQuery(".grouplist").tinyscrollbar({
					thumbSize: 10
				});
			});
			e.stopPropagation();
		});
		jQuery(".map-search-result-item .map-add-inspect").mouseleave(function() {
			jQuery("#groupwrap").hide();
		});
		//视频播放
		jQuery(".map-search-result-item .map-result-play").click(function(e) {
			var index = jQuery(this).closest(".map-search-result-item").attr("Index");
			GisMapTools.linkageToMapGeometry(index);
			if(jQuery(this).parent().find("span").html() === "(在线)"){
				GisMapTools.playMapCameraVideo();
			}else{
				GisMapTools.showMapCameraInfo();
			}
			e.stopPropagation();
		});
		jQuery(".map-search-result-item .map-result-play").mouseleave(function() {
			jQuery("#groupwrap").hide();
		});
		//历史调阅
		jQuery(".map-search-result-item .map-result-history").click(function() {
			notify.warn("该功能暂未实现！");
		});
		jQuery(".map-search-result-item .map-result-history").mouseleave(function() {
			jQuery("#groupwrap").hide();
		});
		//发送到电视墙
		jQuery(".map-search-result-item .map-result-sendtotvwall").click(function() {
			notify.warn("该功能暂未实现！");
		});
		jQuery(".map-search-result-item .map-result-sendtotvwall").mouseleave(function() {
			jQuery("#groupwrap").hide();
		});
	},
	//播放地图上的摄像机的视频
	playMapCameraVideo: function(){
		//显示信息窗口
		InspectMap.infoWindow.setTitle(GisMapTools.currentCamera.getTitle());
		InspectMap.infoWindow.setContent(jQuery("#map-camera-video").html());
		InspectMap.infoWindow.show(GisMapTools.currentCamera.geometry);
		//播放视频
		var videoPlayer = new VideoPlayer({
			layout: 1,
			uiocx: '#UIOCXMAP',
			npsdk: '#COREOCXMAP'
		});
		videoPlayer.openChannelByIndex({
			ip: GisMapTools.currentCamera.attributes.ip,
			port: GisMapTools.currentCamera.attributes.port,
			username: GisMapTools.currentCamera.attributes.username,
			password: GisMapTools.currentCamera.attributes.password,
			path: GisMapTools.currentCamera.attributes.path,
			autoplay: true,
			loop: false,
			status: GisMapTools.currentCamera.attributes.cameraStatus
		}, 0);
	},
	//显示地图上摄像机的基本信息
	showMapCameraInfo: function(){
		//显示信息窗口
		InspectMap.infoWindow.setTitle(GisMapTools.currentCamera.getTitle());
		InspectMap.infoWindow.setContent(GisMapTools.currentCamera.getContent());
		InspectMap.infoWindow.show(GisMapTools.currentCamera.geometry);
		jQuery(".camera-status-online").click(function(){
			GisMapTools.playMapCameraVideo();
		});
	},
	// 视频扩展
	videoExpand: function() {

	},

	// 移动监控点位置
	moveCameraPosition: function() {

	},

	// 移除监控点
	removeCamera: function() {

	},

	// 监控点详细信息
	cameraDetail: function() {

	},

	// 巡检
	inspectVideo: function() {

	},

	// 显示报警信息
	showAlarmInfo: function() {

	},

	// 显示周边搜索
	showSearchAround: function(obj) {
		jQuery(".map-region-info").fadeOut(200);
		jQuery(".map-select-list").fadeOut(200);
		// 获取分组信息
		jQuery.ajax({
			url: "/service/map/search_group_info/",
			type: 'get',
			cache: false,
			dataType: 'json',
			success: function(res) {
				if (res.code === 200) {
					var This = jQuery(obj),
						Next = This.next();
					if (Next.is(":hidden")) {
						Next.fadeIn(200);
					} else if (Next.is(":visible")) {
						Next.fadeOut(200);
					}
					// 渲染分组信息
					var template = Handlebars.compile(jQuery("#map-around-search-template").html());
					jQuery("#mapSearchAroundContent").html(template(res.data));
				} else if (res.code === 500) {
					notify.error(res.data.message);
				} else {
					notify.error("获取数据异常！");
				}
			},
			error: function() {
				notify.error("请查看网络状况！");
			}
		});
	},

	// 搜索某个区域
	searchArea: function(obj, curr_page, page_size) {
		GisMapTools.selectType = "group";
		GisMapTools.groupObj = obj;
		if ((typeof curr_page === 'undefined') || (typeof page_size === 'undefined')) {
			InspectPager = null;
		}
		var This = jQuery(obj);
		This.parent().parent().parent().fadeOut(200);
		// 调用接口
		jQuery.ajax({
			url: "/service/map/group_search_result",
			type: 'get',
			cache: false,
			data: {
				groupId: This.attr("groupId"),
				type: This.attr("groupType"),
				current_page: curr_page ? curr_page : 1,
				page_size: page_size ? page_size : 10
			},
			dataType: 'json',
			success: function(res) {
				if (res.code === 200) {
					GisMapTools.setCamerasToMap(res);
				} else if (res.code === 500) {
					notify.error(res.data.message);
				} else {
					notify.error("获取数据异常！");
				}
			},
			error: function() {
				notify.error("请查看网络状况！");
			}
		});
	},

	// 测量长度
	measurLength: function(obj) {
		InspectMeasuretool.setTool("distance", false);
		InpectDrawtool.deactivate();
		InspectMarkertool.deactivate();
		InspectMap.disableDoubleClickZoom();

		dojo.disconnect(MeasureOnMouseMoveHandle);
		dojo.disconnect(MeasureOnClickHandle);
		var measureTooltip = jQuery("#gismap .map-measure-tooltip")[0];
		measureTooltip.style.left = "-2000px";
		measureTooltip.innerHTML = "单击确定起点";
		var isStartMeasure = false;

		InspectMeasuretool.measureDistance();
		//测量鼠标移动事件
		MeasureOnMouseMoveHandle = dojo.connect(InspectMap, "onMouseMove", InspectMeasuretool, function(evt) {
			var top, left;
			var position = GisMapTools.getTooltipPosition(evt);
			if (isStartMeasure) {
				var result = InspectMeasuretool._geodesicDistance(InspectMeasuretool._currentStartPt, evt.mapPoint);
				if (!(isNaN(result))) {
					measureTooltip.style.top = position.top + "px";
					measureTooltip.style.left = position.left + "px";
					measureTooltip.innerHTML = "总长：" + parseInt((result + InspectMeasuretool.result) * InspectMeasuretool.unitDictionary['米']) + "米<br>单击确定地点，双击结束";
				}
			} else {
				measureTooltip.style.top = position.top + "px";
				measureTooltip.style.left = position.left + "px";
			}
		});
		//测量鼠标点击事件
		MeasureOnClickHandle = dojo.connect(InspectMap, "onClick", InspectMeasuretool, function(evt) {
			isStartMeasure = true;
			var point = evt.mapPoint;
			var result = parseInt(InspectMeasuretool.result * InspectMeasuretool.unitDictionary['米']);
			if (result > 0) {
				//设置搜索结果
				var textMarker = new esri.Graphic({
					"geometry": {
						"x": point.x,
						"y": point.y,
						"spatialReference": {
							"wkid": mapConfig.extent.spatialReference.wkid ? mapConfig.extent.spatialReference.wkid : 102100
						}
					}
				});
				var resultSymbol = new esri.symbol.TextSymbol(result + "米",
					new esri.symbol.Font("12px"),
					new dojo.Color("#000")).setOffset(10, 10);
				textMarker.setSymbol(resultSymbol);

				InspectMap.graphics.add(textMarker);
				InspectMeasuretool.measureGraphics.push(textMarker);
			} else {
				measureTooltip.innerHTML = "单击确定起点";
			}
		});
	},

	// 截图
	mapScreenshot: function(obj) {
		var mbr = Map.param.map.getBoundsLatLng();
	},

	// 打印
	mapPrint: function(obj) {

	},

	// 初始化标记动作
	initMark: function(obj) {
		InspectMeasuretool.setTool("distance", false);
		GisMapTools.hideTooltip();

		//释放鼠标移动和点击事件
		if (MeasureOnMouseMoveHandle) {
			dojo.disconnect(MeasureOnMouseMoveHandle);
		}
		if (MeasureOnClickHandle) {
			dojo.disconnect(MeasureOnClickHandle);
		}
		InpectDrawtool.deactivate();
		InspectMarkertool.activate(esri.toolbars.Draw.POINT);
		jQuery("#gismap").bind("mousemove", function(evt) {
			var position = GisMapTools.getTooltipPosition(evt);
			GisMapTools.getTooltip().css({
				left: position.left + "px",
				top: position.top + "px"
			});
			GisMapTools.getTooltip().html("点击左键标记位置");
		});
	},

	// 结束标记动作
	endMark: function(evt) {
		GisMapTools.markerCount++;
		dojo.disconnect(InspectMap.graphics);
		InspectMarkertool.deactivate();
		InspectMap.enableMapNavigation();
		GisMapTools.hideTooltip();
		var symbol = new esri.symbol.PictureMarkerSymbol("/assets/images/map/map-marker.png", 13, 21);
		var markerGraphic = new esri.Graphic(evt.geometry, symbol),
			textGraphic = null;
		InspectMap.graphics.add(markerGraphic);
		//显示添加窗口
		GisMapTools.markerAddWin(evt.geometry);
		//绑定保存事件
		GisMapTools.markerAddSave(evt.geometry, markerGraphic);
		//绑定删除事件
		GisMapTools.markerDelete(markerGraphic);
		InspectMap.graphics.on("click", function(evt) {
			if (evt.graphic) {
				if (evt.graphic.attributes) {
					if (evt.graphic.attributes.isBtn) {
						return;
					}
					if (evt.graphic.symbol.type === "picturemarkersymbol" || evt.graphic.symbol.type === "textsymbol") {
						//显示标注业务窗口
						GisMapTools.markerBusinessWin(evt.graphic.attributes.name, evt.graphic.attributes.remark, evt.graphic.geometry, evt.graphic.attributes.index);
					}
				} else {
					var attributes = {
						name: "",
						remark: "",
						index: GisMapTools.markerCount
					};
					evt.graphic.setAttributes(attributes);
					return;
				}
			}
		});
	},
	markerAddWin: function(geometry) {
		//显示信息窗口
		InspectMap.infoWindow.setTitle("添加标记");
		InspectMap.infoWindow.setContent(jQuery("#map-mark-add").html());
		InspectMap.infoWindow.show(geometry);
	},
	markerAddSave: function(geometry, markerGraphic) {
		jQuery("#mapId").find("#saveMarker").click(function() {
			var name = jQuery("#mapId").find("#markerName").val();
			var remark = jQuery("#mapId").find("#markerDescription").val();
			var attributes = {
				name: name,
				remark: remark,
				index: GisMapTools.markerCount
			};
			if (name || remark) {
				var textsymbol = new esri.symbol.TextSymbol(name,
					new esri.symbol.Font("12px"),
					new dojo.Color("#000000")).setOffset(18, 12);
				var textGraphic = new esri.Graphic(geometry, textsymbol);
				InspectMap.graphics.add(textGraphic);
				markerGraphic.setAttributes(attributes);
				textGraphic.setAttributes(attributes);
			} else {
				markerGraphic.setAttributes(attributes);
			}
			InspectMap.infoWindow.hide();

			GisMapTools.markerBusinessWin(name, remark, geometry, GisMapTools.markerCount);
		});
	},
	markerEditWin: function(geometry, name, remark) {
		//显示信息窗口
		InspectMap.infoWindow.setTitle("编辑标记");
		InspectMap.infoWindow.setContent(jQuery("#map-mark-add").html());
		jQuery("#mapId").find("#markerName").val(name);
		jQuery("#mapId").find("#markerDescription").val(remark);
		InspectMap.infoWindow.show(geometry);
	},
	markerEditSave: function(index, geometry, markerGraphic, textGraphic) {
		jQuery("#mapId").find("#saveMarker").click(function() {
			var name = jQuery("#mapId").find("#markerName").val();
			var remark = jQuery("#mapId").find("#markerDescription").val();
			if (name) {
				var attributes = {
					name: name,
					remark: remark,
					index: index
				};
				if (textGraphic) {
					markerGraphic.setAttributes(attributes);
					textGraphic.symbol.setText(name);
					textGraphic.setSymbol(textGraphic.symbol);
					textGraphic.setAttributes(attributes);
				} else {
					var textsymbol = new esri.symbol.TextSymbol(name,
						new esri.symbol.Font("12px"),
						new dojo.Color("#000000")).setOffset(18, 6);
					textGraphic = new esri.Graphic(geometry, textsymbol);
					textGraphic.setAttributes(attributes);
					InspectMap.graphics.add(textGraphic);
				}
			} else {
				if (textGraphic) {
					InspectMap.graphics.remove(textGraphic);
				}
			}
			InspectMap.infoWindow.hide();

			GisMapTools.markerBusinessWin(name, remark, geometry, index);
		});
	},
	markerDelete: function(markerGraphic, textGraphic) {
		jQuery("#mapId").find("#deleteMarker").click(function() {
			InspectMap.infoWindow.hide();
			InspectMap.graphics.remove(markerGraphic);
			if (textGraphic) {
				InspectMap.graphics.remove(textGraphic);
			}
		});
	},
	markerBusinessWin: function(name, remark, geometry, index) {
		InspectMap.infoWindow.setTitle(name ? name : "标注");
		InspectMap.infoWindow.setContent(jQuery("#map-marker-business").html());
		jQuery(".map-marker-business .marker-remark span:first-child").empty().html(remark ? remark : "我的备注");
		var thisMarkerGraphic = null,
			thisTextGraphic = null;
		for (var i = 0, j = InspectMap.graphics.graphics.length; i < j; i++) {
			if (InspectMap.graphics.graphics[i].attributes) {
				if (index === InspectMap.graphics.graphics[i].attributes.index) {
					if (InspectMap.graphics.graphics[i].symbol.type === "picturemarkersymbol") {
						thisMarkerGraphic = InspectMap.graphics.graphics[i];
					}
					if (InspectMap.graphics.graphics[i].symbol.type === "textsymbol") {
						thisTextGraphic = InspectMap.graphics.graphics[i];
						break;
					}
				}
			}
		}
		jQuery(".map-marker-business .marker-remark span.marker-edit").click(function() {
			//显示编辑窗口
			GisMapTools.markerEditWin(geometry, name, remark);
			//绑定保存事件
			GisMapTools.markerEditSave(index, geometry, thisMarkerGraphic, thisTextGraphic);
			//绑定删除事件
			GisMapTools.markerDelete(thisMarkerGraphic, thisTextGraphic);
		});
		jQuery("#markerBusinessAll").click(function() {
			GisMapTools.markerAroundMsg(geometry, thisMarkerGraphic, thisTextGraphic);
		});
		jQuery("#markerBusinessCamera").click(function() {
			GisMapTools.markerAroundMsg(geometry, thisMarkerGraphic, thisTextGraphic);
		});
		jQuery("#markerBusinessAlarm").click(function() {
			GisMapTools.markerAroundMsg(geometry, thisMarkerGraphic, thisTextGraphic);
		});
		jQuery("#markerBusinessBayonet").click(function() {
			GisMapTools.markerAroundMsg(geometry, thisMarkerGraphic, thisTextGraphic);
		});
		jQuery("#markerBusinessPolice").click(function() {
			GisMapTools.markerAroundMsg(geometry, thisMarkerGraphic, thisTextGraphic);
		});
		InspectMap.infoWindow.show(geometry);
	},
	markerAroundMsg: function(geometry, MarkerGraphic, TextGraphic) {
		dojo.disconnect(InspectMap.mapMouseDragHandle);
		//圆圈
		if (GisMapTools.markerCircle) {
			InspectMap.graphics.remove(GisMapTools.markerCircle);
		}
		var outlineSymbol = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID,
			new dojo.Color([172, 185, 209]),
			1);
		var fillSymbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID,
			outlineSymbol,
			new dojo.Color([105, 128, 188, 0.2]));
		var circle = new esri.geometry.Circle({
			center: geometry,
			radius: 1000,
			radiusUnit: esri.Units.METERS
		});
		GisMapTools.markerCircle = new esri.Graphic(circle, fillSymbol);
		InspectMap.graphics.add(GisMapTools.markerCircle);
		//圆圈重置半径按钮
		if (GisMapTools.markerCircleResizeBtn) {
			InspectMap.graphics.remove(GisMapTools.markerCircleResizeBtn);
		}
		var pictureMarkerSymbol = new esri.symbol.PictureMarkerSymbol("/assets/images/map/marker-circle-resize.png", 29, 18);
		var pictureMarkerGeometry = new esri.geometry.Point(geometry.x + 1000, geometry.y, geometry.spatialReference);
		GisMapTools.markerCircleResizeBtn = new esri.Graphic(pictureMarkerGeometry, pictureMarkerSymbol);
		GisMapTools.markerCircleResizeBtn.setAttributes({
			"isBtn": true
		});
		InspectMap.graphics.add(GisMapTools.markerCircleResizeBtn);
		//圆圈半径提示
		if (GisMapTools.markerCircleRadius) {
			InspectMap.graphics.remove(GisMapTools.markerCircleRadius);
		}
		var radiusMarkerSymbol = new esri.symbol.PictureMarkerSymbol("/assets/images/map/marker-radius.png", 51, 18);
		var radiusMarkerGeometry = new esri.geometry.Point(geometry.x + 1000 + GisMapTools.calculatePx(50), geometry.y, geometry.spatialReference);
		GisMapTools.markerCircleRadius = new esri.Graphic(radiusMarkerGeometry, radiusMarkerSymbol);
		GisMapTools.markerCircleRadius.setAttributes({
			"isBtn": true
		});
		InspectMap.graphics.add(GisMapTools.markerCircleRadius);

		//圆圈半径文本
		if (GisMapTools.markerCircleRadiusText) {
			InspectMap.graphics.remove(GisMapTools.markerCircleRadiusText);
		}
		var textMarkerSymbol = new esri.symbol.TextSymbol("1000米");
		var textMarkerGeometry = new esri.geometry.Point(geometry.x + 1000 + GisMapTools.calculatePx(50), geometry.y - GisMapTools.calculatePx(5), geometry.spatialReference);
		GisMapTools.markerCircleRadiusText = new esri.Graphic(textMarkerGeometry, textMarkerSymbol);
		GisMapTools.markerCircleRadiusText.setAttributes({
			"isBtn": true
		});
		InspectMap.graphics.add(GisMapTools.markerCircleRadiusText);
		//添加鼠标落下事件
		InspectMap.graphics.on("mouse-down", function(evt) {
			if (evt.graphic.attributes) {
				var ie = navigator.userAgent.indexOf("MSIE") > 0;
				if (evt.graphic.attributes.isBtn) {
					var moreThenIE9 = function() {
						var UA = navigator.userAgent,
							isIE = UA.indexOf('MSIE') > -1,
							v = isIE ? /\d+/.exec(UA.split(';')[1]) : 'no ie';
						return v > 9;
					}();
					if (ie) {
						if (!moreThenIE9) {
							InspectMap.mapMouseDragHandle = InspectMap.on("mouse-drag", function(evt) {
								GisMapTools.markerRadiusResize(evt, geometry, outlineSymbol, fillSymbol);
							});
						} else {
							InspectMap.mapMouseDragHandle = InspectMap.on("mouse-move", function(evt) {
								GisMapTools.markerRadiusResize(evt, geometry, outlineSymbol, fillSymbol);
							});
						}
					} else {
						InspectMap.mapMouseDragHandle = InspectMap.on("mouse-drag", function(evt) {
							GisMapTools.markerRadiusResize(evt, geometry, outlineSymbol, fillSymbol);
						});
					}
					InspectMap.disablePan();
				}
			}
			InspectMap.markerCenter = geometry;
		});

		if (MarkerGraphic) {
			MarkerGraphic.getDojoShape().moveToFront();
		}
		if (TextGraphic) {
			TextGraphic.getDojoShape().moveToFront();
		}
		InspectMap.infoWindow.hide();
		InspectMap.markerCenter = geometry;
		InspectMap.markerDragEnd = pictureMarkerGeometry;
		//根据几何元素重置地图图层级别和中心点
		GisMapTools.markerCircleReset(geometry, 1000);
	},
	//调整圆圈半径大小
	markerRadiusResize: function(evt, geometry, outlineSymbol, fillSymbol) {
		var radius = Math.sqrt((evt.mapPoint.x - geometry.x) * (evt.mapPoint.x - geometry.x) + (evt.mapPoint.y - geometry.y) * (evt.mapPoint.y - geometry.y));
		if (radius > 5000 || radius < 500) {
			return;
		}
		InspectMap.graphics.remove(GisMapTools.markerCircle);
		var circle = new esri.geometry.Circle({
			center: geometry,
			radius: radius,
			radiusUnit: esri.Units.METERS
		});
		GisMapTools.markerCircle = new esri.Graphic(circle, fillSymbol);
		InspectMap.graphics.add(GisMapTools.markerCircle);
		if (GisMapTools.markerCircleResizeBtn.getDojoShape()){
			GisMapTools.markerCircleResizeBtn.getDojoShape().moveToFront();
		}
		if (GisMapTools.markerCircleRadius.getDojoShape()){
			GisMapTools.markerCircleRadius.getDojoShape().moveToFront();
		}
		if (GisMapTools.markerCircleRadiusText.getDojoShape()){
			GisMapTools.markerCircleRadiusText.getDojoShape().moveToFront();
		}
		//修改重置圆圈按钮位置
		var btnGeometry = new esri.geometry.Point(geometry.x + (evt.mapPoint.x - geometry.x), geometry.y, geometry.spatialReference);
		GisMapTools.markerCircleResizeBtn.setGeometry(btnGeometry);
		//修改圆圈半径提示位置
		var radiusGeometry = new esri.geometry.Point(geometry.x + (evt.mapPoint.x - geometry.x + GisMapTools.calculatePx(50)), geometry.y, geometry.spatialReference);
		GisMapTools.markerCircleRadius.setGeometry(radiusGeometry);
		//修改圆圈半径文本
		var textGeometry = new esri.geometry.Point(geometry.x + (evt.mapPoint.x - geometry.x + GisMapTools.calculatePx(50)), geometry.y - GisMapTools.calculatePx(5), geometry.spatialReference);
		GisMapTools.markerCircleRadiusText.setGeometry(textGeometry);
		GisMapTools.markerCircleRadiusText.symbol.setText(parseInt(radius) + "米");
		GisMapTools.markerCircleReset(geometry, radius);
		InspectMap.markerDragEnd = evt.mapPoint;
	},
	//设置标注圈选的图层级别
	markerCircleReset: function(geometry, radius) {
		var mapHeight = document.getElementById("mapId").offsetHeight,
			mapWidth = document.getElementById("mapId").offsetWidth;
		var minLength = mapHeight > mapWidth ? mapWidth : mapHeight;
		var maxLength = mapHeight > mapWidth ? mapHeight : mapWidth;
		var scale = radius * 2 / (minLength - 80) * 96 / 0.0254000508;
		var zoom = InspectMap.getZoom();
		for (var i = 0, j = mapConfig.lods.length; i < j - 1; i++) {
			if (scale === mapConfig.lods[i].scale) {
				zoom = mapConfig.lods[i].level;
				break;
			}
			if (scale < mapConfig.lods[i].scale && scale > mapConfig.lods[i + 1].scale) {
				zoom = mapConfig.lods[i].level;
				break;
			}
		}
		InspectMap.centerAndZoom(geometry, zoom);
		InspectMap.on("zoom-end", function() {
			InspectMap.reposition();
		});
	},
	calculatePx: function(num) {
		return InspectMap.getScale() * 0.025400508 / 96 * num;
	},
	// 全屏
	fullscreen: function(obj) {
		var This = jQuery(obj);
		jQuery("#navigator,#header").hide();
		jQuery("#sidebar").hide();
		jQuery("#content .wrapper").css("top", "0px");
		jQuery("#major").css({
			top: "0px",
			left: "0px"
		});
		var exitFullscreen = Handlebars.compile(jQuery("#map-exitfullscreen").html());
		This.parent().empty().html(exitFullscreen);
		InspectMap.resize();
	},

	// 退出全屏
	exitFullscreen: function(obj) {
		var This = jQuery(obj);
		jQuery("#navigator,#header,#sidebar").show();
		jQuery("#content .wrapper").css("top", "86px");
		jQuery("#major").css({
			top: "10px",
			left: jQuery("#sidebar").width()
		});
		var fullscreen = Handlebars.compile(jQuery("#map-fullscreen").html());
		This.parent().empty().html(fullscreen);
		InspectMap.resize();
	},

	// 切换图层
	switchMapLayer: function(obj) {
		var This = jQuery(obj);
		if (This.attr("layer") === "normal") {
			This.removeClass("map-layer-satellite").addClass("map-layer-normal");
			This.attr("layer", "sattilate");
			This.attr("title", "显示卫星地图");
			This.find(".map-layer-text").text("地图");
			// 图层切换到卫星地图
			InspectBaseLayer.hide();
			InspectSatelliteLayer.show();
			//鹰眼切换
			jQuery("#baselayerOverview").css("display", "none");
			jQuery("#sattilatelayerOverview").show();
			SattilateLayerOverview.show();
		} else {
			This.removeClass("map-layer-normal").addClass("map-layer-satellite");
			This.attr("layer", "normal");
			This.attr("title", "显示普通地图");
			This.find(".map-layer-text").text("卫星");
			// 图层切换到普通地图
			InspectSatelliteLayer.hide();
			InspectBaseLayer.show();
			//鹰眼切换
			jQuery("#sattilatelayerOverview").css("display", "none");
			jQuery("#baselayerOverview").show();
			BaseLayerOverview.show();
		}
	},
	//点击搜索结果联动地图元素
	linkageToMapGeometry: function(index){
		index = parseInt(index);
		if (GisMapTools.searchResultLayer.graphics) {
			var currGeometry = GisMapTools.searchResultLayer.graphics[index];
			if (currGeometry) {
				//高亮选中的元素
				var highLight = InspectMap.infoWindow.updateHighlight(InspectMap, currGeometry);
				InspectMap.infoWindow.showHighlight();
				var textGeometry = GisMapTools.searchResultLayer.graphics[index + 1];
				var activeCameraSymbol = new esri.symbol.PictureMarkerSymbol("/assets/images/map/map-marker-blue.png", 22, 29).setOffset(1, 1);
				currGeometry.setSymbol(activeCameraSymbol);
				if (currGeometry.getDojoShape()) {
					currGeometry.getDojoShape().moveToFront();
					textGeometry.getDojoShape().moveToFront();
				}
				//还原上次活动点
				if (GisMapTools.currentCamera !== null && GisMapTools.currentCamera.attributes.index !== index) {
					var cameraSymbol = new esri.symbol.PictureMarkerSymbol("/assets/images/map/map-marker-red.png", 22, 26).setOffset(2, 1);
					GisMapTools.currentCamera.setSymbol(cameraSymbol);
				}
				GisMapTools.currentCamera = currGeometry;
			} else {
				notify.warn("该点没有地理坐标！");
			}
		}
	},
	//地图元素点击后联动到搜索结果
	linkageToSearchResultClick: function(obj) {
		var This = jQuery(obj);
		var ResultContainer = This.parent();
		ResultContainer.find(".map-search-result-item").each(function(index) {
			jQuery(this).data("active", false);
			jQuery(this).removeClass("active");
			jQuery(this).find(".third-line").removeClass("active");
			jQuery(this).find(".map-result-ico-red").removeClass("active");
		});
		This.addClass("active");
		This.find(".third-line").addClass("active");
		This.find(".map-result-ico-red").addClass("active");
		This.data("active", true);
	},
	// 点击搜索结果
	clickSearchResultItem: function(obj) {
		var This = jQuery(obj);
		var ResultContainer = This.parent();
		ResultContainer.find(".map-search-result-item").each(function(index) {
			jQuery(this).data("active", false);
			jQuery(this).removeClass("active");
			jQuery(this).find(".third-line").removeClass("active");
			jQuery(this).find(".map-result-ico-red").removeClass("active");
		});
		This.addClass("active");
		This.find(".third-line").addClass("active");
		This.find(".map-result-ico-red").addClass("active");
		This.data("active", true);
		var index = parseInt(This.attr("Index"));
		GisMapTools.linkageToMapGeometry(index);
		GisMapTools.showMapCameraInfo();
	},

	//地图元素悬浮后联动到搜索结果
	linkageToSearchResultHover: function(obj) {
		var This = jQuery(obj);
		if (!This.data("active")) {
			This.addClass("active");
			This.find(".map-result-ico-red").addClass("active");
		}
	},
	// 鼠标悬浮搜索结果
	hoverSearchResultItem: function(obj) {
		var This = jQuery(obj);
		if (!This.data("active")) {
			This.addClass("active");
			This.find(".map-result-ico-red").addClass("active");
		}
		if (GisMapTools.searchResultLayer.graphics) {
			var index = parseInt(This.attr("Index"));
			var currGeometry = GisMapTools.searchResultLayer.graphics[index];
			if (currGeometry) {
				var textGeometry = GisMapTools.searchResultLayer.graphics[index + 1];
				if (currGeometry.getDojoShape()) {
					currGeometry.getDojoShape().moveToFront();
					textGeometry.getDojoShape().moveToFront();
				} else {
					InspectMap.centerAt(currGeometry.geometry);
				}
				var activeCameraSymbol = new esri.symbol.PictureMarkerSymbol("/assets/images/map/map-marker-blue.png", 22, 29).setOffset(1, 1);
				currGeometry.setSymbol(activeCameraSymbol);
			}
		}
	},
	//地图元素移除悬浮后联动到搜索结果
	linkageToSearchResultHoverout: function(obj) {
		var This = jQuery(obj);
		if (!This.data("active")) {
			This.removeClass("active");
			This.find(".map-result-ico-red").removeClass("active");
		}
	},
	// 鼠标移出悬浮搜索结果
	hoveroutSearchResultItem: function(obj) {
		var This = jQuery(obj);
		if (!This.data("active")) {
			This.removeClass("active");
			This.find(".map-result-ico-red").removeClass("active");
			if (GisMapTools.searchResultLayer.graphics) {
				var index = parseInt(This.attr("Index"));
				var currGeometry = GisMapTools.searchResultLayer.graphics[index];
				if (currGeometry) {
					var normalCameraSymbol = new esri.symbol.PictureMarkerSymbol("/assets/images/map/map-marker-red.png", 22, 26).setOffset(2, 1);
					currGeometry.setSymbol(normalCameraSymbol);
				}
			}
		}
	}
};
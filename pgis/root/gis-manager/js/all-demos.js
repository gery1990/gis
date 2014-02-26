var mapOpera = new Object();
//地图操作参数
mapOpera.param = {
	mapContainer : null,//地图容器
	map : null,//地图对象
	measuretool : null,//测量工具
	drawtool : null,//绘制工具
	overviewctrl : null,//鹰眼控件
	Navictrl : null,//导航控件
	versionCtrl : null,//版本控件
	scaleCtrl : null,//比例尺控件
	animation : null,//动画
	userdefineLayer : null,//自定义层
	infoWindow : null//信息窗口
};
/**
* 初始化地图
**/
mapOpera.init = function(){
	/******************************北京arcgis在线地图***************************************************/
	//地图控件
	mapOpera.param.mapContainer = document.getElementById("mapId");
	mapOpera.param.map = new NPMapLib.Map(mapOpera.param.mapContainer, {minZoom:0, maxZoom:10});

	var resolutions = [156543.033928,78271.5169639999,39135.7584820001,19567.8792409999,9783.93962049996,
						   4891.96981024998,2445.98490512499,1222.99245256249,305.748113140558,152.874056570411,
						   76.4370282850732,38.2185141425366,19.1092570712683,9.55462853563415,4.77731426794937,
						   2.38865713397468,1.19432856685505,0.597164283559817];

	//图层参数
	var opts = {centerPoint:[12959745.271695066,4848706.4522418715],
			    fullExtent:[12912392.532672398,4819583.94446522,13007098.010717731,4877828.960018523],
				minLevel:0,
				maxLevel:7,
				zoomOffset:11,
				zoomLevelSequence:2,
				initResolution:resolutions,
				origin:[-20037508.342789248, 20037508.342789248]
			};

	//图层路径
	var url = "http://cache1.arcgisonline.cn/ArcGIS/rest/services/ChinaCities_Community_BaseMap_CHN/BeiJing_Community_BaseMap_CHN/MapServer";
	var layerSL = new NPMapLib.Layers.ArcgisTileLayer(url, "矢量地图", opts);
	mapOpera.param.map.addLayer(layerSL);
	/******************************北京arcgis在线地图************************************************/

	/******************************西安arcgis在线地图***************************************************/
	//地图控件
	// mapOpera.param.mapContainer = document.getElementById("mapId");
	// mapOpera.param.map = new NPMapLib.Map(mapOpera.param.mapContainer, {minZoom:0, maxZoom:10});
	// //图层参数
	// var opts = {centerPoint:[12105225.7401,4058397.728],
	// 		    fullExtent:[11985074.1609,3987770.8812,12225377.3193,4129024.5748],
	// 			minLevel:0,
	// 			maxLevel:7,
	// 			zoomOffset:11,
	// 			zoomLevelSequence:2,
	// 			initResolution:156543.033928,
	// 			origin:[-20037508.342787, 20037508.342787]
	// 		};

	// //图层路径
	// var url = "http://cache1.arcgisonline.cn/ArcGIS/rest/services/ChinaCities_Community_BaseMap_CHN/XiAn_Community_BaseMap_CHN/MapServer";
	// var layerSL = new NPMapLib.Layers.ArcgisTileLayer(url, "矢量地图", opts);
	// mapOpera.param.map.addLayer(layerSL);
	/******************************西安arcgis在线地图************************************************/
	
	/*******************************google在线地图***************************************************/
	// //地图控件
	// mapOpera.param.mapContainer = document.getElementById("mapId");
	// mapOpera.param.map = new NPMapLib.Map(mapOpera.param.mapContainer, {minZoom:0,
	// 										  maxZoom:6});
	
	// //图层参数
	// var opts = {centerPoint:[32991597.27439121,4853139.799882412],
	// 		    fullExtent:[32896891.79634588,4826998.336208882,33086302.752436545,4879281.263555942],
	// 			minLevel:0,
	// 			maxLevel:6,
	// 			zoomOffset:10,
	// 			zoomLevelSequence:2
	// 		};

	// //图层路径
	// var url = "http://mt1.google.cn/vt/lyrs=m@160000000";
	// var layerSL = new NPMapLib.Layers.GoogleMapTileLayer(url, "矢量地图", opts);

	// url = "http://mt2.google.cn/vt/lyrs=s@132";
	// var layerYX = new NPMapLib.Layers.GoogleMapTileLayer(url, "影像地图", opts);

	// url = ["http://mt1.google.cn/vt/lyrs=s@132", "http://mt0.google.cn/vt/imgtp=png32&lyrs=h@224000000"];
	// var layerSLYX = new NPMapLib.Layers.GoogleMapTileLayer(url, "矢量影像地图", opts);

	// mapOpera.param.map.addLayers([layerSL, layerYX, layerSLYX]);
	/*********************************google在线地图结束************************************************/

	//测量工具
	mapOpera.param.measuretool = new NPMapLib.Tools.MeasureTool(mapOpera.param.map.id, {
			lengthUnit: NPMapLib.MAP_UNITS_METERS, //长度单位
			areaUnit: NPMapLib.MAP_UNITS_SQUARE_KILOMETERS,	//面积单位
			mode: NPMapLib.MEASURE_MODE_DISTANCE //测量模式
			});
	//几何图形绘制工具
	mapOpera.param.drawtool = new NPMapLib.Tools.DrawingTool(mapOpera.param.map.id);
   
	//鹰眼控件
	mapOpera.param.overviewctrl = new NPMapLib.Controls.OverviewControl();
	//导航控件
	mapOpera.param.naviCtrl = new NPMapLib.Controls.NavigationControl(); 
	//比例尺控件
	mapOpera.param.scaleCtrl = new NPMapLib.Controls.ScaleControl(); 
	//版权控件
	mapOpera.param.versionCtrl = new NPMapLib.Controls.CopyRightControl("东方网力"); 
};
/**
* 获取点信息
**/
mapOpera.getPointsStr = function(coverType){
	var PointMsgObj = document.getElementById("pointMsg");
	var pointsValue = PointMsgObj.value;
	var areaType = PointMsgObj.type;
	var centerPoint = mapOpera.param.map.getCenter();  
	var centerLon=centerPoint.lon,centerLat=centerPoint.lat;
	switch (coverType){
		case "animation"://动画
			if(areaType!="animation"){
				var lon1 = centerLon+12025.54554624,lon2=centerLon+675.454454548;
				var lat1 = centerLat+11182.545454546,lat2=centerLat+12565.236541256;
				pointsValue=centerLon+","+centerLat+"|"+lon1+","+lat1+"|"+lon2+","+lat2;
				PointMsgObj.value = pointsValue;
				PointMsgObj.type = "animation";
			}
			break;
		case "point"://图像、文字
			if(areaType!="point"){
				pointsValue=centerLon+","+centerLat;
				PointMsgObj.value = pointsValue;
				PointMsgObj.type = "point";
			}
			break;
		case "line"://线
			if(areaType!="line"){
				var lon1 = centerLon+12025.54554624,lon2=centerLon+675.454454548;
				var lat1 = centerLat+11182.545454546,lat2=centerLat+12565.236541256;
				pointsValue=centerLon+","+centerLat+"|"+lon1+","+lat1+"|"+lon2+","+lat2;
				PointMsgObj.value = pointsValue;
				PointMsgObj.type = "line";
			}
			break;
		case "rectangle"://矩形
			if(areaType!="rectangle"){
				var lon1=centerLon+15363.84268532,lon2=centerLon+15363.84268532,lon3=centerLon,lon4=centerLon;
				var lat1=centerLat+76.437028286,lat2=centerLat-9860.376648787,lat3=centerLat-9860.376648787,lat4=centerLat;
				pointsValue=centerLon+","+centerLat+"|"+lon1+","+lat1+"|"+lon2+","+lat2+"|"+lon3+","+lat3+"|"+lon4+","+lat4;
				PointMsgObj.value = pointsValue;
				PointMsgObj.type = "rectangle";
			}
			break;
		case "polygon"://多边形
			if(areaType!="polygon"){
				var lon1=centerLon+15669.59079846,lon2=centerLon+15363.84268532,lon3=centerLon+152.87405657,lon4=centerLon-20790.87169356,lon5=centerLon;
				var lat1=centerLat+76.437028286,lat2=centerLat-9860.376648787,lat3=centerLat-11236.243157921,lat4=centerLat-8713.82122451,lat5=centerLat;
				pointsValue=centerLon+","+centerLat+"|"+lon1+","+lat1+"|"+lon2+","+lat2+"|"+lon3+","+lat3+"|"+lon4+","+lat4+"1"+lon5+","+lat5;
				PointMsgObj.value = pointsValue;
				PointMsgObj.type = "polygon";
			}
			break;
		case "circle"://圆
			if(areaType!="circle"){
				pointsValue=centerLon+","+centerLat;
				PointMsgObj.value = pointsValue;
				PointMsgObj.type = "circle";
			}
			break;
		case "infoWindow"://信息窗口
			pointsValue="";
			break;
	}
	return pointsValue;
};
/**
* 初始化点位信息
**/
mapOpera.initPoints = function(str){
	var points = [];
	var pointsArray = str.split("|");
	for(var i=0,j=pointsArray.length;i<j;i++){
		var pointArray = pointsArray[i].split(",");
		var point = {
			lon : pointArray[0],
			lat : pointArray[1]
		};
		points.push(new NPMapLib.Geometry.Point(point.lon,point.lat));
	}
	return points;
}
/**
* 设置图像标注
**/
mapOpera.setIconMarker = function(){
	var pt = mapOpera.initPoints(mapOpera.getPointsStr("point"))[0];
	//图片大小
	var size = new NPMapLib.Geometry.Size(32,32);
	//图片
	var icon = new NPMapLib.Symbols.Icon("images/Flag.png",size);
	//设置偏移量，这里取坐标点为图片中心点
	icon.setAnchor(new NPMapLib.Geometry.Size(-size.width/2, -size.height/2));

	//图像标记
	var marker = new NPMapLib.Symbols.Marker(pt);
	marker.setIcon(icon);
	return marker;
};
/**
* 设置文字标注
**/
mapOpera.setTextMarker = function(){
	//初始化点位
	var pt = mapOpera.initPoints(mapOpera.getPointsStr("point"))[0];
	//文本标记
	var label = new NPMapLib.Symbols.Label("一个图像标注");
	//图片大小
	var size = new NPMapLib.Geometry.Size(32,32);
	//设置样式
	label.setStyle(
					{
						fontSize:12,			//文字大小
						fontFamily:'宋体',		//字体
						color:'red',			//文字前景色
						align:'center',			//对方方式
						isBold:true			//是否粗体
					}
				  );
	//设置偏移量
	label.setOffset(new NPMapLib.Geometry.Size(0, size.height/2));
	label.setPosition(pt); 
	return label;
};
/**
* 设置线标注
**/
mapOpera.setPolygonLine = function(){
	//点序列
	var points = mapOpera.initPoints(mapOpera.getPointsStr("line"));
	//多段线
	var polyline = new NPMapLib.Geometry.Polyline(points, {
		color:"blue",	//颜色
		weight:5,		//宽度，以像素为单位
		opacity:0.5,	//透明度，取值范围0 - 1
		lineStyle:NPMapLib.LINE_TYPE_SOLID	//样式
	  });
	return polyline;
};
/**
* 设置矩形标注
**/
mapOpera.setRectangle = function(){
	//点序列（注：矩形为特殊的多边形）
	var rectanglepoints = mapOpera.initPoints(mapOpera.getPointsStr("rectangle"));
	//矩形
	var rectagle = new NPMapLib.Geometry.Polygon(rectanglepoints, {
		color:"blue",			//颜色
		fillColor:"red",		//填充颜色
		weight:2,				//宽度，以像素为单位
		opacity:1,				//透明度，取值范围0 - 1
		fillOpacity:0.5			//填充的透明度，取值范围0 - 1
	  });
	return rectagle;
};
/**
* 设置多边形标注
**/
mapOpera.setPolygon = function(){
	//点序列（注：多连形的起始点与终止点一致，形成闭合）
	var polygonpoints = mapOpera.initPoints(mapOpera.getPointsStr("polygon"));

	//多边形
	var polygon = new NPMapLib.Geometry.Polygon(polygonpoints, {
		color:"blue",			//颜色
		fillColor:"red",		//填充颜色
		weight:2,				//宽度，以像素为单位
		opacity:1,				//透明度，取值范围0 - 1
		fillOpacity:0.5			//填充的透明度，取值范围0 - 1
	  });
	return polygon;
};
/**
* 设置圆标注
**/
mapOpera.setCircle = function(){
	//中点 
	var center = mapOpera.initPoints(mapOpera.getPointsStr("circle"))[0];
	var radius = 5000;
	//圆形
	var circle = new NPMapLib.Geometry.Circle(center, radius, {
		color:"blue",			//颜色
		fillColor:"red",		//填充颜色
		weight:2,				//宽度，以像素为单位
		opacity:1,				//透明度，取值范围0 - 1
		fillOpacity:0.5			//填充的透明度，取值范围0 - 1
	  });
	return circle;
};
/**
* 设置动画
**/
mapOpera.setAnimation = function(){
	//初始化点位
	var centerPoint = mapOpera.param.map.getCenter();
	var pt = new NPMapLib.Geometry.Point(centerPoint.lon,centerPoint.lat);
	//图片大小
	var size = new NPMapLib.Geometry.Size(32,32);
	//图片
    var AnimeIcon = new NPMapLib.Symbols.Icon("images/Car.png", size);
    //设置偏移量，这里取坐标点为图片中心点
    AnimeIcon.setAnchor(new NPMapLib.Geometry.Size(-size.width / 2, -size.height / 2));

    //文本标记
    var AnimelLabel = new NPMapLib.Symbols.Label("一个动画标注");
    //设置样式
    AnimelLabel.setStyle(
					{
					    fontSize: 12, 		//文字大小
					    fontFamily: '宋体', 	//字体
					    color: 'red', 		//文字前景色
					    align: 'center', 		//对方方式
					    isBold: true			//是否粗体
					}
				  );
    //设置偏移量
    AnimelLabel.setOffset(new NPMapLib.Geometry.Size(0, size.height / 2));

    //图像标记
    Animemarker = new NPMapLib.Symbols.Marker(pt);
    Animemarker.setIcon(AnimeIcon);
    Animemarker.setLabel(AnimelLabel);
    //点序列
    var AnimePoints = mapOpera.initPoints(mapOpera.getPointsStr("animation"));
    //多段线
    Animepolyline = new NPMapLib.Geometry.Polyline(AnimePoints, {
            color: "blue", //颜色
            weight: 5, 	//宽度，以像素为单位
            opacity: 0.5, //透明度，取值范围0 - 1
            lineStyle: NPMapLib.LINE_TYPE_SOLID	//样式
        }
    );
    var Animeoptions = {
        speed: 100,        //速度 米/秒
        isReturn: true,     //是否往返：若为true，则来回推演
        isRepeat: true      //是否重复：若为true，则反复推演
    };
    //动画参数
    var animeEleArray = {
    	Animemarker : Animemarker,
    	Animepolyline : Animepolyline,
    	Animeoptions : Animeoptions
    };
    return animeEleArray;
};
/**
* 自定义图层
**/
mapOpera.defineLayer = function(){
	//自定义图层
	userdefineLayer = new NPMapLib.Layers.OverlayLayer("图层1");
	mapOpera.param.map.addLayer(userdefineLayer);

	//向图层中添加覆盖物
	userdefineLayer.addOverlay(mapOpera.setPolygonLine());
	userdefineLayer.addOverlay(mapOpera.setTextMarker());
	userdefineLayer.addOverlay(mapOpera.setCircle);
	userdefineLayer.addOverlay(mapOpera.setPolygon);
	userdefineLayer.hide();
	return userdefineLayer;
};
/**
* 添加信息窗口
**/
mapOpera.addInfoWin = function(){
	var pt = mapOpera.initPoints(mapOpera.getPointsStr("point"))[0];
	var title = "信息窗口";
	var content = "您可以自己填充需要的内容";
	var w = 300;
	var h = 100;

	var leftOffset = 100;
	var topOffset = 0;

	var offset = new NPMapLib.Geometry.Size(leftOffset,topOffset);
	mapOpera.param.infoWindow = new NPMapLib.Symbols.InfoWindow(title, content, {
			width:w,		//信息窗宽度，单位像素
			height:h,		//信息窗高度，单位像素
			offset:offset, 	//信息窗位置偏移值
			arrow:false		//是否带箭头
		});

	//转换为像素坐标
	var posPixel = mapOpera.param.map.pointToPixel(pt);
	mapOpera.param.infoWindow.open(posPixel.x, posPixel.y);
}
/**
* 添加事件
**/
mapOpera.addEvents = function(){
	//左键单击
	mapOpera.param.map.addEventListener(NPMapLib.MAP_EVENT_CLICK, function(point){
		alert("您左键单击了地图！点击的经纬度为：" + point.lon + "," + point.lat);
	});

	//右键单击
	mapOpera.param.map.addEventListener(NPMapLib.MAP_EVENT_RIGHT_CLICK, function(point){
		alert("您右键单击了地图！点击的经纬度为：" + point.lon + "," + point.lat);
	});

	//双击事件
	mapOpera.param.map.addEventListener(NPMapLib.MAP_EVENT_DBLCLICK, function(point){
		alert("您左键双击了地图！点击的经纬度为：" + point.lon + "," + point.lat);
	});

	//地图更改缩放级别开始时触发触发此事件
	mapOpera.param.map.addEventListener(NPMapLib.MAP_EVENT_ZOOM_START, function(zoomLevel){
		alert("正准备进行地图缩放！当前缩放级别为：" + zoomLevel);
	});

	//地图更改缩放级别结束时触发触发此事件
	mapOpera.param.map.addEventListener(NPMapLib.MAP_EVENT_ZOOM_END, function(zoomLevel){
		alert("已完成地图缩放！当前缩放级别为：" + zoomLevel);
	});
}

/**
* 移除事件
**/
mapOpera.removeEvents = function(){
	mapOpera.param.map.removeEventListener(NPMapLib.MAP_EVENT_CLICK);
	mapOpera.param.map.removeEventListener(NPMapLib.MAP_EVENT_RIGHT_CLICK);
	mapOpera.param.map.removeEventListener(NPMapLib.MAP_EVENT_DBLCLICK);
	mapOpera.param.map.removeEventListener(NPMapLib.MAP_EVENT_ZOOM_START);
	mapOpera.param.map.removeEventListener(NPMapLib.MAP_EVENT_ZOOM_END);
}

/********************地图操作********************************/
//刷新
var krefreshOperate = function(){

};
//光标
var kdefaultOperate = function(){
	mapOpera.param.map.pan(); 
};
//全屏
var kfullwin = function(){
	jQuery("#maptool,#gisTop").hide();
	jQuery("#displaymap").height($(window).height()).width($(window).width()).css("margin-left","0px");
	jQuery("#cancleFullScreen").show();
};
//全图
var kfullMap = function(){
	mapOpera.param.map.fullExtent(); 
};
//刷新
var krefreshMap = function(){
	document.location.reload();
};
//取消全屏
var cancleFullwin = function(){
	jQuery("#maptool,#gisTop").show();
	jQuery("#displaymap").height(jQuery(window).height()-70).width(jQuery(window).width() - 310-10).css("margin-left","5px");
	jQuery("#cancleFullScreen").hide();
};
//对中
var toCenter = function(){

};
//放大
var kzoomIn = function(){
	mapOpera.param.map.zoomIn(); 
};
//缩小
var kzoomOut = function(){
	mapOpera.param.map.zoomOut(); 
};
//固定放大
var kzoomInFixed = function(){
	mapOpera.param.map.zoomInFixed(); 
};
//固定缩小
var kzoomOutFixed = function(){
	mapOpera.param.map.zoomOutFixed(); 
};
//距离测量
var kmeasureLength = function(){
	mapOpera.param.measuretool.startUp();
	mapOpera.param.measuretool.setMode(NPMapLib.MEASURE_MODE_DISTANCE);
};
//面积测量
var kmeasureArea = function(){
	mapOpera.param.measuretool.startUp();
	mapOpera.param.measuretool.setMode(NPMapLib.MEASURE_MODE_AREA);
};
//清除测量
var cancleMeasure = function(){
	mapOpera.param.measuretool.cancel();
};
//获取坐标
var kaddEvents = function(){
	mapOpera.addEvents();
};
//取消获取坐标
var kremoveEvents = function(){
	mapOpera.removeEvents();
};
//绘制回调函数
function callBackMethod(result){
}
//画矩形/圆/多边形
var kactionDraw = function(str){
	mapOpera.param.drawtool.startUp();
	/*if(str == "point"){
		drawtool.setMode(NPMapLib.DRAW_MODE_POLYLINE, callBackMethod);
	}else */if(str == "line"){
		mapOpera.param.drawtool.setMode(NPMapLib.DRAW_MODE_POLYLINE, callBackMethod);
	}else if(str == "rectangle"){
		mapOpera.param.drawtool.setMode(NPMapLib.DRAW_MODE_RECT, callBackMethod);
	}else if(str == "circle"){
		mapOpera.param.drawtool.setMode(NPMapLib.DRAW_MODE_CIRCLE, callBackMethod);
	}else if(str == "polygon"){
		mapOpera.param.drawtool.setMode(NPMapLib.DRAW_MODE_POLYLGON, callBackMethod);
	}
};
//取消绘制
var cancelDraw = function(){
	mapOpera.param.drawtool.cancel();
};

//图像标注
var kaddIco = function(){
	var marker = mapOpera.setIconMarker();
	mapOpera.param.map.addOverlay(marker);
};
//文本标注
var kaddText = function(){
	var label = mapOpera.setTextMarker();
	mapOpera.param.map.addOverlay(label); 
};
//动画标注
var kbudian = function(){
	if(mapOpera.param.animation == null){
		var animeEle = mapOpera.setAnimation();
		mapOpera.param.map.addOverlay(animeEle.Animepolyline);
		mapOpera.param.animation = new NPMapLib.Symbols.Animation(mapOpera.param.map.id, animeEle.Animemarker, animeEle.Animeoptions);
	    mapOpera.param.animation.setPath(animeEle.Animepolyline);
	    mapOpera.param.map.addOverlay(animeEle.Animemarker);
	}
};
//动画开始
var kbudianStart = function(){
	mapOpera.param.animation.setSpeed(100);
	mapOpera.param.animation.start();
};
//动画暂停
var kbudianStop = function(){
	mapOpera.param.animation.pause();
};
//动画移除
var kbudianRemove = function(){
	mapOpera.param.animation.stop();
	mapOpera.param.map.removeOverlay(Animepolyline);
    mapOpera.param.map.removeOverlay(Animemarker);
    mapOpera.param.animation = null;
};
//加线
var kaddLine = function(){
	var polyline = mapOpera.setPolygonLine();
	mapOpera.param.map.addOverlay(polyline); 
};
//加多边形
var kaddArea = function(){
	var polygon = mapOpera.setPolygon();
	mapOpera.param.map.addOverlay(polygon);
};
//加矩形
var kaddRectangle = function(){
	var rectagle = mapOpera.setRectangle();
	mapOpera.param.map.addOverlay(rectagle);
};
//加圆
var kaddCircle = function(){
	var circle = mapOpera.setCircle();
	mapOpera.param.map.addOverlay(circle);
};
//信息窗口
var kaddInfoWin = function(){
	if(mapOpera.param.infoWindow){
		mapOpera.param.infoWindow.close();  
		mapOpera.param.infoWindow = null;  
	}
	mapOpera.addInfoWin();
};
//显示/隐藏鹰眼
var ksetOverViewVisible = function(bool){
	if(bool){
		mapOpera.param.map.addControl(mapOpera.param.overviewctrl);	
	}else{
		mapOpera.param.map.removeControl(mapOpera.param.overviewctrl);
	}
};
//显示/隐藏导航控件
var ksetMapControl = function(bool){
	if(bool){
		mapOpera.param.map.addControl(mapOpera.param.naviCtrl); 
	}else{
		mapOpera.param.map.removeControl(mapOpera.param.naviCtrl);
	}
};
//显示/隐藏版权
var ksetMapVersion = function(bool){
	if(bool){
		mapOpera.param.map.addControl(mapOpera.param.versionCtrl); 
	}else{
		mapOpera.param.map.removeControl(mapOpera.param.versionCtrl);
	}
};
//显示/隐藏比例尺
var ksetMapScale = function(bool){
	if(bool){
		mapOpera.param.map.addControl(mapOpera.param.scaleCtrl); 
	}else{
		mapOpera.param.map.removeControl(mapOpera.param.scaleCtrl);
	}
};
//获取当前中心点位置
var kgetCurrentCenter = function(){
	var centerPoint = mapOpera.param.map.getCenter();  
	alert("当前中心点位置："+centerPoint.lon + "," + centerPoint.lat);  
};
//获取当前地图缩放级别
var kgetCurrentZoom = function(){
	var zoom = mapOpera.param.map.getZoom();  
	alert("当前缩放级别："+zoom);
};
//获取地图当前可视范围坐标
var kgetCurrentActivearea = function(){
	 var extent = mapOpera.param.map.getExtent();  
	 alert("当前可视范围："+extent.sw.lon + "," + extent.sw.lat + "," + extent.ne.lon + "," + extent.ne.lat);
}
//显示自定义图层
var kshowUserdefineLayer = function(){
	if(mapOpera.param.userdefineLayer==null){
		mapOpera.param.userdefineLayer = mapOpera.defineLayer();
	}
	mapOpera.param.userdefineLayer.show();
};
//隐藏自定义图层
var khideUserdefineLayer = function(){
	if(mapOpera.param.userdefineLayer)
		mapOpera.param.userdefineLayer.hide();
};

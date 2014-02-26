var MapUtils = new Class({
	map:null,
	overview: null,
	//构造函数
	initialize:function(map){
		this.map = map;
		this.map.disableDragging = true;
	},

	//获取地图单位
	getMapUnit:function(){
		if(this.map === null)
			return "getDegree";

		return this.map.getMapUnit();
	},

	//添加叠加图层标记
	addOverlay:function(overlay){
		try{
			if(this.map === null || overlay === null) return;
			this.map.addOverlay(overlay);
		}
		catch(e){
			alert("addOverlay: " + e.message);
		}
	},

	//移除叠加图层标记
	removeOverlay:function(overlay){
		try{
			if(this.map === null || overlay === null) return;
			this.stopFlashOverlay(overlay);
			this.map.removeOverlay(overlay);
		}
		catch(e){
			alert("removeOverlay: " + e.message);
		}
	},

	//移除多个标记
	removeOverlays:function(overlays){
		if(this.map === null || overlays.length <=0) return;

		var allOverlays = this.map.getOverlays();
		for (var i = 0; i < allOverlays.length; i++) {
			for (var j = 0; j < overlays.length; j++) {
				if(overlays[j] !== null && overlays[j] === allOverlays[i]){
					allOverlays.splice(i,1);
				}
			}
		}
	},

	getAllOverlays:function(){
		return this.map.getOverlays();
	},

	//获取标记层号
	getOverlayZIndex:function(overlay){
		if(!overlay || overlay === null) return -1;
		return overlay.getZIndex();
	},

	//设置标记层号
	setOverlayZIndex:function(overlay, index){
		if(!overlay || overlay === null) return;
		overlay.setZIndex(index);
	},

	//获取坐标点
	getOverlayPoint:function(overlay){
		try{
			return overlay.getPoint();
		}
		catch(e){
			alert("getOverlayPoint: " + e.message);
		}
	},

	//设置坐标点
	setOverlayPoint:function(overlay, pt){
		try{
			overlay.setPoint(pt);
		}
		catch(e){
			alert("setOverlayPoint: " + e.message);
		}
	},

	//叠加图层标记闪烁
	flashOverlay: function(overlay){
		try{
			if(overlay === null) return;
			overlay.flash();
		}
		catch(e){
			alert("flashOverlay: " + e.message);
		}
	},

	//停止叠加图层标记闪烁
	stopFlashOverlay:function(overlay){
		try{
			if(overlay === null) return;
			if(overlay.flashTimeOut)
				window.clearTimeout(overlay.flashTimeOut);
		}
		catch(e){
			alert("stopFlashOverlay: " + e.message);
		}
	},

	//创建点
	createPoint: function(x, y){
		try{
			var pt = new Point(x, y);
			return pt;
		}
		catch(e){
			return null;
		}
	},

	//创建多段线
	createPolyline: function(points,color,weight,opacity,arrow,lienStyle){
		try{
			var overlay = new Polyline(points, color, weight, opacity, arrow);
			overlay.setLineStyle(lienStyle);
			return overlay;
		}
		catch(e){
			alert(e.message);
			return null;
		}
	},

	//创建多段线
	createPolylineDefault: function(points){
		try{
			var overlay = new Polyline(points);
			return overlay;
		}
		catch(e){
			return null;
		}
	},

	//创建矩形
	createRectangle:function(points,color,fillcolor,weight,opacity){
		try{
			var overlay = new Rectangle(points, color, weight, opacity, fillcolor);
			return overlay;
		}
		catch(e){
			return null;
		}
	},

	//创建多边形
	createPolygon:function(points,color,fillcolor,weight,opacity) {
		try{
	 		var overlay = new Polygon(points, color, weight, opacity, fillcolor);
		    return overlay;
		}
		catch(e){
			return null;
		}
	},

	//创建圆形
	createCircle:function(points,color,fillcolor,weight,opacity){
		try{
	 		var overlay = new Circle(points, color, weight, opacity, fillcolor);
		    return overlay;
		}
		catch(e){
			return null;
		}
	},

	//创建文本
	createTitle:function(text, fontSize, pos, font, color, bgColor, borderColor, borderSize, pt){
		try{
		    var overlay =new Title(text, fontSize, pos, font, color, bgColor, borderColor, borderSize);
		    overlay.setPoint(pt);
		    return overlay;
	    }
		catch(e){
			alert("createTitle: " + e.message);
			return null;
		}
	},

	//创建图标
	createIcon:function(image, width, height, topOffset, leftOffset){
		try{
			var icon = new Icon();
			icon.image = image;
			icon.width = width;
			icon.height = height;
			icon.topOffset = topOffset;
			icon.leftOffset = leftOffset;
			return icon;
		}
		catch(e){
			return null;
		}
	},

	//创建对象标记
	createMarker: function(icon, pt, title) {
		try{
			var marker = null;
			if(title === null)
				marker = new Marker(pt, icon);
			else
				marker = new Marker(pt, icon, title);
			return marker;
		}
		catch(e){
			alert("createMarker: " + e.message);
			return null;
		}
	},

	//显示/隐藏标记
	setMarkTitleVisible: function(marker, visible){
		try{
			if(marker === null) return;
			if(!visible)
				marker.hideTitle();
			else
				marker.showTitle();
		}
		catch(e){
			return null;
		}
	},

	//创建自定义文本标记
	createMyTitle:function(text, fontFamily, fontSize, pos, color, bgColor, borderColor, borderSize, topOffset, leftOffset, isBold){
		var strTextHTML = '<p style="';
		strTextHTML += 'font-family:' + fontFamily;
		strTextHTML += ';font-size:' + fontSize;
		strTextHTML += ';width:' + text.length*fontSize;
		strTextHTML += ';color:' + color;
		if(bgColor !== null)
			strTextHTML += ';background-color:' + bgColor;
		if(borderColor !== null)
			strTextHTML += ';border-color:' + borderColor;
		if(borderSize !== null)
			strTextHTML += ';border:' + borderSize;
		strTextHTML += ';top:' + topOffset;
		strTextHTML += ';left:' + leftOffset;
		if(isBold)
			strTextHTML += ';font-weight:bold';
		else
			strTextHTML += ';font-weight:normal';
		strTextHTML += ';text-align:' + pos;
		strTextHTML += ';position:absolute;" >';
		strTextHTML += text;
		strTextHTML += ' </p>';
		return strTextHTML;
	},

	//创建自定义图标标记
	createMyIcon:function(strImgUrl, width, height, topOffset, leftOffset){
		var strImgHtml = '<img src="' + strImgUrl + '" ';
		strImgHtml += 'width=' + width;
		strImgHtml += ' height=' + height;
		strImgHtml += ' style="position:absolute;';
		strImgHtml += 'top:' + topOffset + 'px;';
		strImgHtml += 'left:' + leftOffset + 'px;" />';
		return strImgHtml;
	},

	//创建自定义对象标记
	createMyMarker: function(key, strImgUrl, strTitle, pt){
		try{
			var overLay = new HTMLElementOverLay(key, pt, strImgUrl + strTitle);
			return overLay;
		}catch(e){
			alert("createMyMarker: " + e.message);
			return null;
		}
	},

	//关闭提示消息框
	closeInfoWindow: function(){
		try{
			if(this.map === null) return;
			this.map.closeInfoWindow();
		}
		catch(e){
			return null;
		}
	},

	//打开某标记的提示消息框
	openInfoWindowWithMarker: function(marker,remark){
		try{
			if(marker !== null)
				marker.openInfoWindowHtml(remark, false);
		}
		catch(e){
			alert("openInfoWindowWithMarker: " + e.message);
		}
	},

	//转到level缩放级别
	setZoomLevel: function(level) {
		if(this.map === null) return;
		this.map.zoomTo(level);
	},

	//获取缩放级别
	getZoomLevel: function() {
		try{
			if(this.map === null) return;
			return this.map.getZoomLevel();
		}
		catch(e){
			alert("getZoomLevel: " + e.message);
			return -1;
		}
	},

	//获取经纬度单位, radius--米
	getDegree: function(pt, radius){
		if(this.map === null) return;
		return this.map.getDegree(pt, radius);
	},

	//获取线的点集
	getPolylinePoints:function(line){
		if(line === null) return null;
		return line.getPoints();
	},

	//获取线的长度
	getPolylineLength:function(line){
		if(line === null) return -1;
		return line.getLength();
	},

	//启动绘制，用于框选、点选、圈选、多边形选等
	actionDraw:function(mode, callback){
		try{
			if(this.map === null) return;
			if(mode === 'pan'){
				this.map.changeDragMode(mode);
				this.map.getMapContainer().style.cursor = 'default';
			}
			else{
				if(callback === null) 
					callback = function(){};
				this.map.changeDragMode(mode, $('dragInputX'), $('dragInputY'), callback);
			}
		}catch(e){
			alert("actionDraw: " + e.message);
		}
	},

	//居中且放大
	centerAndZoom: function(x, y, level) {
		if(this.map === null) return;
		var pt = this.createPoint(x, y);
		this.map.centerAndZoom(pt, level);
	},

	//居中
	gotoCenter: function() {
		if(this.map === null) return;
		var point = this.map.getCenterLatLng();
		this.map.recenterOrPanToLatLng(point);
	},

	//获取圆形范围
	getCircleMBR:function(circle){
		return circle.getMBR();
	},

	getRectangleMBR:function(rectangle){
		return rectangle.getMBR();
	},

	//获取多边形范围
	getPolygonMBR:function(polygon){
		return polygon.getMBR();
	},

	//获取多段线范围
	getPolylineMBR:function(polyline){
		return polyline.getMBR();
	},

	//根据指定范围对地图进行定位
	centerAtMBR:function(mbr){
		if (this.map===null) return;
		this.map.centerAtMBR(mbr);
	},

	//获取指定范围的中心点
	getCenterPointOfMBR: function(mbr){
		if (this.map===null) return;
		return mbr.centerPoint();
	},

	//范围并集
	unionMBR:function(mbr1, mbr2){
		if (this.map===null) return;
		if(mbr1 === null) return mbr2;
		if(mbr2 === null) return mbr1;

		return MBR.union(mbr1,mbr2);
	},

	//获取指定范围中点坐标
	getCenter:function(mbr){
		if(mbr === null) return null;
		return mbr.getCenterPoint();
	},

	//获取中点坐标
	getCenterLatLng: function(){
		if(this.map === null) return null;
	    return this.map.getCenterLatLng();
	},

	//根据指定点位进行地图居中
	centerByPoint:function(point){
		if (this.map===null) return;

		this.map.centerAtLatLng(point);
	},

	//平移
	panTo:function(x, y){
		if (this.map===null) return;

		this.map.pan(x,y);
	},

	//获取当前视窗区域
	getExtent:function(){
		if(this.map === null) return null;
		return this.map.getBoundsLatLng();
	},

	//创建区域
	createExtent:function(minX, minY, maxX, maxY){
		if(this.map === null) return null;
		return new MBR(minX, minY, maxX, maxY);
	},

	//判断某坐标是否在当前视窗区域
	isInExtent:function(mbr,pt){
		if(this.map === null || mbr === null) return false;
		return mbr.containsPoint(pt);
	},

	isInExtentByXY:function(x, y, mbr){
		if(this.map === null || mbr === null) 
			return false;
		return (x >= mbr.minX && x <= mbr.maxX && y >= mbr.minY && y <= mbr.maxY);
	},

	//设置鼠标指针
	setMouseCursor: function(cursor){
		if(this.map === null) return null;
		this.map.getMapContainer().style.cursor = cursor;
	},

	//是否显示导航控件
	setNavigateControlVisible: function(visible){
		if(this.map === null) return null;
		if(visible)
			this.map.showSmallMapControl();
	},

	//是否显示比例尺控件
	setScaleControlVisible: function(visible){
		if(this.map === null) return null;
		if(visible)
			this.map.showMapScale();
		else
			this.map.hideMapScale();
	},

	//切换地图服务
	switchMapServer:function(index){
		if(this.map === null) return null;
		this.map.switchMapServer(index);
	},

	//转换成地图坐标
	pointToMap:function(pt){
		try{
			if(this.map === null) return null;
			var mbr = this.getExtent();
			var size = window.getSize();
			var xMap = mbr.minX + pt.x * (mbr.maxX - mbr.minX)/size.x;
			var yMap = mbr.maxY - pt.y * (mbr.maxY - mbr.minY)/size.y;
			return this.createPoint(xMap, yMap);
		}catch(e){
			alert("pointToMap: " + e.message);
		}
	},

	//由地图坐标转换成屏幕坐标
	pointFromMap:function(pt){
		if(this.map === null) return null;
		return this.map.mapCoord2Container(pt);
	},

	//坐标偏移
	pointOffset:function(pt, topOffset, leftOffset){
		try{
			if(this.map === null) return null;
			var ptScreen = this.map.mapCoord2Container(pt);
			ptScreen.x = ptScreen.x + leftOffset;
			ptScreen.y = ptScreen.y + topOffset;
			var ptMap = this.pointToMap(ptScreen);
			return ptMap;
		}
		catch(e){
			alert("pointOffset: " + e.message);
		}
	},

	//获取比例尺
	getScale:function(){
		if(this.map === null) return null;
		var scale = this.map.getCurrentMapScale();
		return scale.split(':')[1].toInt();
	},

	//获取两点间的距离
	getDistance:function(pt1,pt2){
		return Math.sqrt(Math.pow(pt1.x - pt2.x, 2) + Math.pow(pt1.y - pt2.y, 2));
	},

	//判断点pt，是否在pt1与pt2组成的线段内
	isPtOnPolyline:function(pt1,pt2,pt){
		try{
			var totalLength = this.getDistance(pt1,pt2);
			var len1 = this.getDistance(pt1, pt);
			var len2 = this.getDistance(pt,pt2);
			var depart = 0.0000000000000001;
			if(Math.abs(totalLength - len1 - len2) < depart)
				return true;
			else
				return false;

		}catch(e){
			alert("isPtOnPolyline: " + e.message);
		}
	},

	//判断点在多边形内【polygon必须是非自相交的】
	//params: x--经度，y--纬度，polygon--多边形对象
	isPtInPolygon:function(x, y, polygon) { 
	    var n = polygon.length;
	    var i = n - 2, wn = 0;
	    var ix = polygon[i], iy = polygon[i + 1];
	    for (var j = 0; j < n; j += 2) {
	        var jx = polygon[j], jy = polygon[j + 1];
	        if ((y >= iy && y <= jy) || (y <= iy && y >= jy)) { // 过(x,y)的水平线和线段(ix,iy)-(jx,jy)有交点
	            var k = (x - ix) * (jy - iy) - (jx - ix) * (y - iy); // 计算点(x,y)在线段(ix,iy)-(jx,jy)的左边还是右边
	            if (k < -0.0000000000000000001) // 右边
	                ++wn;
	            else if (k > 0.0000000000000000001) // 左边
	                --wn;
	            else if ((x >= ix && x <= jx) || (x <= ix && x >= jx))
	                return true;
	        }
	        i = j;
	        ix = jx;
	        iy = jy;
	    }
	    return wn !== 0;
	},

	//计算转角【狐度】
	caluAngle:function(x1,y1,x2,y2,x3,y3){
		var angle = 0, angle1=0, angle2=0;
		try{
            angle1 = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI; 
            angle2 = Math.atan2(y3 - y2, x3 - x2) * 180 / Math.PI; 
            angle = angle2 - angle1; 
		}
		catch(e){
			alert("caluAngle: " + e.message);
		}
		return angle;
	},

	//计算角度
	caluAngle2:function(x1,y1,x2,y2){
		return (Math.atan2(y2-y1,x2-x1) * 180 / Math.PI );
	},

	////////////////////////////////////////////////////////////////////
	////////////////////////   【工具栏功能】   ////////////////////////

	//平移(或默认操作[光标])
	pan: function(){
		if(this.map === null) return;
		this.actionDraw('pan',null);
	},
	
	//全图
	fullExtent: function() {
		if(this.map === null) return;
		this.map.fullExtent();
	},
	
	//放大(拉框)
	zoomIn: function() {
		if(this.map === null) return;
		this.map.zoomInExt();
		this.setMouseCursor('crosshair');
	},
	
	//缩小(拉框)
	zoomOut: function() {
		if(this.map === null) return;
		this.map.zoomOutExt();
		this.setMouseCursor('crosshair');
	},

    //固定放大
	zoomInFixed: function() {
		if(this.map === null) return;
		this.map.zoomIn();
	},

    //固定缩小
	zoomOutFixed: function() {
		if(this.map === null) return;
		this.map.zoomOut();
	},
    
    //显示/隐藏鹰眼
	setOverViewVisible:function(visible){
		try{
			if(this.map === null) return;

			if (this.overview === null) {
				this.overview = new OverView();
				this.map.addOverView(this.overview);
			}

	        if(visible)
			    this.map.showOverView();
			else 
			    this.map.hideOverView();
		}
		catch(e){
			alert("setOverViewVisible: " + e.message);
		}
	},

	//设置鹰眼框大小
	setOverViewSize:function(width, height){
		if(this.overview === null) return;
		this.overview.width = width;
		this.overview.height = height;
	},

	//是否显示地图服务切换按钮
	setSwitchMapServerControlOnMapVisible:function(visible){
		try{
			if(this.map === null) return;
			if(visible)
				this.map.showMapServer();
			else
				this.map.hideMapServer();
		}
		catch(e){
			alert("setSwitchMapServerControlOnMapVisible: " + e.message);
		}
	},

	//测量长度
	measureLength: function() {
		this.map.measureLength(function(len) {
			window.alert(len);
			_mapUtils.pan();
		});
	},

	//测量面积
	measureArea: function() {
		this.map.measureArea(function(area) {
			window.alert(area);
			_mapUtils.pan();
		});
	},
	
	//切换地图服务,0--矢量地图，1--影像地图，2--矢量叠加地图
	switchMapServer: function(index) {
		if(this.map === null) return;
		this.map.switchMapServer(index);
	},

	//下载地图
	downloadMap:function(){
		if(this.map === null) return;
		var mbr = this.getExtent();
		//var url = "http://" + GlobalConfig.apiAddress + ":" + GlobalConfig.apiPort + "/EzServer/Maps/SL/EzMap?Service=getRectImg&result=image&minx=" + mbr.minX + "&miny=" + mbr.minY + "&maxx=" + mbr.maxX + "&maxy=" + mbr.maxY + "&zoom=" + (this.getZoomLevel() + EzServerClient.GlobeParams.ZoomOffset);
		//window.external.DownloadMap(url);

		this.map.downloadMap(mbr.minX,mbr.minY,mbr.maxX, mbr.maxY, this.getZoomLevel());
	},

	//下载地图
	downloadMapByExtent:function(minx, miny, maxx, maxy, iLevel, format){
		if(this.map === null) return;
		this.map.downloadMap(minx, miny, maxx, maxy, iLevel, format)

		//var url = "http://" + GlobalConfig.apiAddress + ":" + GlobalConfig.apiPort + "/EzServer/Maps/SL/EzMap?Service=getRectImg&result=" + format + "&minx=" + minx + "&miny=" + miny + "&maxx=" + maxx + "&maxy=" + maxy + "&zoom=" + (iLevel + EzServerClient.GlobeParams.ZoomOffset);
		//window.external.DownloadMap(url);
	},
	
	//清除
	clear: function() {
		try{
			if(this.map === null) return;
			
			this.actionDraw('drawPoint', null);
			this.pan();
		}catch(e){
			alert("clear: " + e.message);
		}
	}

	////////////////////////   【工具栏功能】   ////////////////////////
	////////////////////////////////////////////////////////////////////
});
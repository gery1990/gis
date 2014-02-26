
(function() {
    var e = NPMapLib.Layers.EzMapLayerOptions = {
        centerPoint: [0, 0], 				//中心点
        fullExtent: [0, 0, 0, 0], 			//全图坐标范围
        minLevel: 0, 						//最小显示级别
        maxLevel: 10, 					//最大显示级别
        zoomOffset: 10, 					//缩放级别偏移量
        tilePixels: 256, 					//切片规格
        zoomLevelSequence: 2                 /*0: 比例尺等级从上往下升序，EzServer服务器端切图等级升序
											  1: 比例尺等级从上往下降序，EzServer服务器端切图等级升序
											  2: 比例尺等级从上往下降序，EzServer服务器端切图等级降序
											  3: 比例尺等级从上往下升序，EzServer服务器端切图等级降序
											  */
    };

    var f = NPMapLib.Layers.ArcgisTileLayerOptions = {
        centerPoint: [0, 0], 				//中心点
        fullExtent: [0, 0, 0, 0], 			//全图坐标范围
        minLevel: 0, 						//最小显示级别
        maxLevel: 10, 					//最大显示级别
        zoomOffset: 10, 					//缩放级别偏移量
        tilePixels: 256, 					//切片规格
        zoomLevelSequence: 2,                 /*0: 比例尺等级从上往下升序，EzServer服务器端切图等级升序
											  1: 比例尺等级从上往下降序，EzServer服务器端切图等级升序
											  2: 比例尺等级从上往下降序，EzServer服务器端切图等级降序
											  3: 比例尺等级从上往下升序，EzServer服务器端切图等级降序
											  */
        initResolution: 0, 				//初始分辨率
        origin: [0, 0]						//原点坐标
    };

    var g = NPMapLib.Layers.OpenLayerOptions = {
    	layerName: "",						//图层标识
        projection: "EPSG:4326",            //投影方式
        fullExtent: [0, 0, 0, 0], 			//全图坐标范围
		minLevel: 0, 						//最小显示级别
		maxLevel: 10,					    //最大显示级别
		tiled: false,						//是否缓存
		format: 'image/png',				//缓存图片格式
		mapUnitPixels:256,                  //缓存图片像素
		buffer:0,                           //图片加载方式，0--快速下载，2--双螺旋下载[默认为0]
		reproject:true,                     //是否进行重投影
		isBaseLayer:true					//是否作为基础图层，备注：基础图层无法控制显示隐藏
    };


    var h = NPMapLib.Layers.VectorGMLLayerOptions ={
        projection: "EPSG:4326",               //地图数据的坐标投影
        mapUnitPixels:256,                     //缓存图片像素
        buffer:0,                              //图片加载方式，0--快速下载，2--双螺旋下载[默认为0]
        reproject:true,                        //是否进行重投影
        isBaseLayer:true                       //是否作为基础图层
    };
})();

/*!
 * 图层(基类)
 */
(function() {
	var e = NPMapLib.Layer = function() {
		this.id = -1;				//图层ID
		this.mapId = null;			//地图ID
		this.url;					//图层路径
		this.name = "Not Set";		//图层名称
		this.visible = true;		//是否显示
		this.minLevel = 0;			//最小显示级别
		this.maxLevel = 0;			//最大显示级别
	};

	//获取图层路径
	e.prototype.getUrl = function(){
		return this.url;
	};

	//设置图层路径
	e.prototype.setUrl = function(url){
		this.url = url;
	};

	//判断是否显示
	e.prototype.isVisible = function(){
		return this.visible;
	};

	//设置名称
	e.prototype.setName = function(name){
		this.name = name;
	};

	//获取名称
	e.prototype.getName = function(){
		return this.name;
	};

	//设置最小显示级别
	e.prototype.setMinLevel = function(level){
		this.minLevel = level;
	};

	//获取最小显示级别
	e.prototype.getMinLevel = function(){
		return this.minLevel;
	};

	//设置最大显示级别
	e.prototype.setMaxLevel = function(level){
		this.maxLevel = level;
	};

	//获取最大显示级别
	e.prototype.getMaxLevel = function(){
		return this.maxLevel;
	};

	//显示(由继承类实现)
	e.prototype.show = function(){
	};

	//隐藏(由继承类实现)
	e.prototype.hide = function(){
	};
})();
/**
 *Description：EzServer Client js配置文档设置
 */
/**
 * ++++++++++++++++++++++++第一部分，兼容性配置参数部分++++++++++++++++++++++++
 */
if (typeof EzServerClient == "undefined" || !EzServerClient) var EzServerClient = {};
if (typeof EzServerClient.GlobeParams == "undefined" || !EzServerClient.GlobeParams) EzServerClient.GlobeParams = {};

EzServerClient.GlobeParams.MapIpAddress = '172.21.12.51';
EzServerClient.GlobeParams.MapPort = 9080;
EzServerClient.GlobeParams.IsLocal = false;
EzServerClient.GlobeParams.IsDownMap = false;
EzServerClient.GlobeParams.LocalCacheDictery = '/cache/';
EzServerClient.GlobeParams.MyMapType = 'pgis';

if(GlobalConfig.apiAddress)
	EzServerClient.GlobeParams.MapIpAddress = GlobalConfig.apiAddress;
if(GlobalConfig.apiPort)
	EzServerClient.GlobeParams.MapPort = GlobalConfig.apiPort;
if(GlobalConfig.isLocal)
	EzServerClient.GlobeParams.IsLocal = GlobalConfig.isLocal;
if(GlobalConfig.isDownMap)
	EzServerClient.GlobeParams.IsDownMap = GlobalConfig.isDownMap;
if(GlobalConfig.productName)
	EzServerClient.GlobeParams.MyMapType = 	GlobalConfig.productName;


/**********************************************************************************/
/**************************以下为EzServer Client兼容性配置参数部分，如果相关参数在构造函数中设置，则这些配置参数可以删除掉，在构造时在设置**************************/
/**********************************************************************************/
/**
 *参数说明：设置图图片请求地址，三维数组第二层中：[][0]指图片服务器名称;[][1])指图片服务器地址;[][2]指叠加在[][1]之下的图片服务器地址（[][2]可省略）
 *参数类型：{[][(2|3)][]String} String类型的n*(2|3)*n的三维数组
 *取值范围：无限制
 *默认值：无
 *参数举例：如下所示
 */
//EzServerClient.GlobeParams.MapSrcURL = [["map-jw-china",["http://172.18.69.154:8080/EzServer66/Maps/map-jw-china"]]
//                                    	];
EzServerClient.GlobeParams.MapSrcURL = [
	["矢量地图", ["http://10.173.2.20/PGIS_S_TileMapServer/Maps/V"]],
	["影像地图", ["http://10.173.2.20/PGIS_S_TileMapServer/Maps/R"]],
	["矢量影像地图", ["http://10.173.2.20/PGIS_S_TileMapServer/Maps/RV"]]
];

//叠加地图配置如下:
//EzServerClient.GlobeParams.MapSrcURL = [["矢量叠加地图",["http://192.168.10.14:701/EzServer_DF_SLYX"],["http://192.168.10.14:701/EzServer_DF_YX"]]];
//集群地图配置如下(上边变量中的[][1]和[][2]可以引用多个图片来源地址，即当前地图的瓦片来自多个来源，以减轻图片服务器负担和加快显示速度):
//EzServerClient.GlobeParams.MapSrcURL= [["矢量影像",["http://192.168.10.3/EzServer","http://192.168.10.4/EzServer"]]];


/**
 *参数说明：设置版权信息
 *参数类型：{String}
 *取值范围：无限制
 *默认值：""
 *参数举例：如下所示
 */
EzServerClient.GlobeParams.Copyright = "&copy; PGis";

/**
 *参数说明：设置显示动态图片来源版权信息
 *参数类型：{Array}
 *取值范围：无限制
 *默认值：[]（此时表示不动态的显示版权信息）
 *参数举例：如下所示
 */
EzServerClient.GlobeParams.DynamicCopyright = []; //表示不动态的显示版权信息
/**
EzServerClient.GlobeParams.DynamicCopyright = [
	//如下对象含义：图片来源为http://192.168.10.241:9080/EzServerV634/Maps/map-jw-china 并且在5到8级（实际的级别），而且区域在116.32458,39.89782,116.3927,39.94738范围之内的图片，左下角版权显示为@2009PGIS西城区
	{
		label:"<font size=2 >@2009PGIS西城区</font>", //版权信息内容
		source:"http://192.168.10.241:9080/EzServerV634/Maps/map-jw-china", //图片来源
		minzoom:5,//最小级别（实际的级别，即EzServerClient.GlobeParams.ZoomOffset==0时的级别）
		maxzoom:8,//最大级别
		region : new MBR(116.32458,39.89782,116.3927,39.94738)//显示版权信息的区域范围
	},
	//如下对象含义：图片来源为http://192.168.10.115:10000/EzServerV634/Maps/map-jw-bj 并且在2到3级（实际的级别），而且区域在116.38269,39.89685,116.4447,39.96325范围之内的图片，左下角版权显示为@2009PGIS东城区
	{
		label:"<font size=2 >@2009PGIS东城区</font>", 
		source:"http://192.168.10.115:10000/EzServerV634/Maps/map-jw-bj",
		minzoom:2, maxzoom:4, region:new MBR(116.38269,39.89685,116.4447,39.96325) 
	}
];
*/

/**
 *参数说明：设置版本信息
 *参数类型：{Float}
 *取值范围：无限制
 *默认值：无
 *参数举例：如下所示
 */
EzServerClient.GlobeParams.Version = 0.3;


/**
 *参数说明：设置地图初始化中心位置
 *参数类型：{[2]Float} 长度为2的Float类型数组
 *取值范围：无限制
 *默认值：无
 *参数举例：如下所示
 */

EzServerClient.GlobeParams.CenterPoint = [108.72265, 34.24023];


/**
 *参数说明：设置全图显示时地图显示范围
 *参数类型：{[4]Float} 长度为4的Float类型数组
 *取值范围：无限制
 *默认值：无
 *参数举例：如下所示
 */

EzServerClient.GlobeParams.MapFullExtent = [107.4414,33.75,110.0039,34.73046];

/**
 *参数说明：设置地图初始显示级别
 *参数类型：{Float}
 *取值范围：无限制
 *默认值：无
 *参数举例：如下所示
 */
EzServerClient.GlobeParams.MapInitLevel = 12;

/**
 *参数说明：设置地图显示的最大级别
 *参数类型：{Float}
 *取值范围：[0,22]
 *默认值：无
 *参数举例：如下所示
 */
EzServerClient.GlobeParams.MapMaxLevel = 20;

/**
 *参数说明：设置地图级别的偏移量（可为正负数：当前级别的实际级别=当前级别-EzServerClient.GlobeParams.ZoomOffset）
 *参数类型：{Float}
 *取值范围：无限制
 *默认值：0
 *参数举例：如下所示
 */
EzServerClient.GlobeParams.ZoomOffset = 0;

/**
 *参数说明：设置来源地图图片大小（根据图片来源服务器提供图片的大小决定）
 *参数类型：{Int}
 *取值范围：128|256
 *默认值：无
 *参数举例：如下所示
 */
EzServerClient.GlobeParams.MapUnitPixels = 256;

/**
 *参数说明：设置地图坐标系类型：经纬度坐标系为1；地方坐标时为EzServerClient.GlobeParams.MapConvertScale所设定的值
 *参数类型：{Int}
 *取值范围：无限制
 *默认值：无
 *参数举例：如下所示
 */
EzServerClient.GlobeParams.MapCoordinateType = 1;
//EzServerClient.GlobeParams.MapCoordinateType = 114699;

/**
 *参数说明：设置地方坐标系缩放比例（根据切图时所给定的值设定此值）
 *参数类型：{Int}
 *取值范围：无限制
 *默认值：114699
 *参数举例：如下所示
 */
EzServerClient.GlobeParams.MapConvertScale = 114699;

/**
 *参数说明：设置地方坐标系X轴偏移量（此时，根据切图时所给定的值设定此值）
 *参数类型：{Int}
 *取值范围：无限制
 *默认值：无
 *参数举例：如下所示
 */
EzServerClient.GlobeParams.MapConvertOffsetX = 0;
/**
 *参数说明：设置地方坐标系Y轴偏移量（此时，根据切图时所给定的值设定此值）
 *参数类型：{Int}
 *取值范围：无限制
 *默认值：无
 *参数举例：如下所示
 */
EzServerClient.GlobeParams.MapConvertOffsetY = 0;


/**
 *参数说明：设置地图图片是否叠加
 *参数类型：{Boolean}
 *取值范围：true|false
 *默认值：无
 *参数举例：如下所示
 */
EzServerClient.GlobeParams.IsOverlay = true;

/**
 *参数说明：设置请求地图图片来源是否通过代理
 *参数类型：{Boolean}
 *取值范围：true|false
 *默认值：无
 *参数举例：如下所示
 */
EzServerClient.GlobeParams.MapProx = false;

/**
 *参数说明：设置地图比例尺级别是降序还是升序的，以及采用的是什么版本的切图地图
 *参数类型：{Int}
 *取值范围：{0,1,2,3}
 *默认值：0
 *参数举例：如下所示
 */
EzServerClient.GlobeParams.ZoomLevelSequence = 2;
//EzServerClient.GlobeParams.ZoomLevelSequence = 0;// 比例尺等级从上往下升序，EzServer服务器端切图等级升序
//EzServerClient.GlobeParams.ZoomLevelSequence = 1;// 比例尺等级从上往下降序，EzServer服务器端切图等级升序
//EzServerClient.GlobeParams.ZoomLevelSequence = 2;// 比例尺等级从上往下降序，EzServer服务器端切图等级降序
//EzServerClient.GlobeParams.ZoomLevelSequence = 3;// 比例尺等级从上往下升序，EzServer服务器端切图等级降序

/**
 *参数说明：设置瓦片地图起始锚点，即0行0列地图的左下角地图坐标，瓦片行列号方向为以此锚点向上向右递增
 *参数类型：{[2]Float}
 *取值范围：{无限制}
 *默认值：[0, 0]
 *参数举例：如下所示
 */
EzServerClient.GlobeParams.TileAnchorPoint = [0, 0];


/**
 *参数说明：如果需要调用空间矢量数据服务，则需要设置以下默认EzMapService的引用地址，有关EzMapService服务的介绍请参照EzMapService的有关介绍（可选配置）
 *参数类型：{String}
 *取值范围：无
 *默认值：无
 *参数举例：如下所示
 */
EzServerClient.GlobeParams.EzMapServiceURL = "";

/**
 *参数说明：如果需要调用地理处理服务，则需要设置以下默认EzGeographicProcessingService引用地址，有关EzGeographicProcessingService服务的介绍请参照EzGeographicProcessingService的有关介绍（可选配置）
 *参数类型：{String}
 *取值范围：无
 *默认值：无
 *参数举例：如下所示
 */
//如果配置了地理处理服务EzGeographicProcessingService，通过以下引入相关脚本
//EzServerClient.GlobeParams.EzGeoPSURL = "http://192.168.10.183:10000/EzGeoPS";	
//document.writeln("<script type='text/javascript' charset='GB2312' src='" + EzServerClient.GlobeParams.EzGeoPSURL + "/ezgeops_js/EzGeoPS.js'></script>");

/**
 *参数说明：配置热点样式
 *参数类型：{Object}
 *取值范围：无
 *默认值：无
 *参数举例：如下所示
 */
EzServerClient.GlobeParams.HotspotStyle = {
	//设置热点边框颜色
	borderColor: "red",
	//设置热点边框宽度
	borderWeight: "1.2pt",
	//设置热点填充颜色
	fillColor: "blue",
	//设置热点填充透明度
	opacity: "19660f"
};

EzServerClient.GlobeParams.EzServerClientURL="";
/**********************************************************************************/
/**************************************参数配置结束*************************************/
/**********************************************************************************/


/**
 * ++++++++++++++++++++++++第二部分，主脚本部分++++++++++++++++++++++++
 */
/**
 * Description：EzServer Client主脚本
 */
 

/**
 * Constant: 版本号
 */
EzServerClient.VERSION_NUMBER = "V6.6.6.201108121100a";
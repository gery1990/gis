// 全局配置信息
var GlobalConfig = {
	apiAddress: '127.0.0.1',			//地图底图地址【与服务器关联】
	apiPort: 80,						//地图底图端口【与服务器关联】
	mapDataAddress: '172.21.15.197',  	//地图数据地址【与服务器关联】
	mapDataPort: 8399,  				//地图数据端口【与服务器关联】
	element: 'gismap',					//地图容器
	scaleControl: true,					//是否显示比例尺工具
	navigateControl: true,				//是否显示导航工具
	switchServerButtons: false,			//是否显示地图上的服务切换按钮
	overview: true,						//是否显示鹰眼
	overviewW: 200,						//鹰眼框宽度，鹰眼显示时有效
	overviewH: 200,						//鹰眼框长度，鹰眼显示时有效
	centerX: -1,						//初始化定位经度【与服务器关联】
	centerY: -1,						//初始化定位纬度【与服务器关联】
	zoomLevel: -1,						//缩放级别【与服务器关联】
	cameraLevel: 7,
	personLevel: 7,
	rmpgateLevel: 7,
	apiProduction:'EzMap',				//地图开发接口厂商
	mapProduction:'PGIS',               // 地图服务商
	projectUnit:"changzhou",            //项目单位
	isLocal:true,						//false---在线，true---离线【仅管理员使用，切勿修改】
	isDownMap:false
};

// 加载服务器配置
try {
	var config = window.external.GetMapConfigInfo();
	if (typeof config === 'string')
		config = eval('(' + config + ')');
	if (config.apiAddress)
		GlobalConfig.apiAddress = config.apiAddress;
	if (config.apiPort)
		GlobalConfig.apiPort = config.apiPort;
	if (config.mapDataAddress)
		GlobalConfig.mapDataAddress = config.mapDataAddress;
	if (config.mapDataPort)
		GlobalConfig.mapDataPort = config.mapDataPort;
	if (config.centerX)
		GlobalConfig.centerX = config.centerX;
	if (config.centerY)
		GlobalConfig.centerY = config.centerY;
	if (config.zoomLevel)
		GlobalConfig.zoomLevel = config.zoomLevel;
	if (config.zoomLevel)
		GlobalConfig.zoomLevel = config.zoomLevel;
	if (config.cameraLevel)
		GlobalConfig.cameraLevel = config.cameraLevel;
	if (config.personLevel)
		GlobalConfig.personLevel = config.personLevel;
	if (config.rmpgateLevel)
		GlobalConfig.rmpgateLevel = config.rmpgateLevel;
	if (config.apiProduction)
		GlobalConfig.apiProduction = config.apiProduction;
	if (config.mapProduction)
		GlobalConfig.mapProduction = config.mapProduction;
	if (config.isLocalMap)
		GlobalConfig.isLocal = config.isLocalMap;
} catch (e) {
	$$('.loading').destroy();
}

function setDownMapEnable(enable){
	GlobalConfig.isLocalMap = enable;
}

// 根据配置信息导入地图API
(function(w, o) {
	if (w[o]) {
		return false;
	}
	
	if (GlobalConfig.apiProduction == "EzMap") {
		//地图API
		document.writeln("<script type='text/javascript' charset='GB2312' src='js/apps/EzMap/" + GlobalConfig.mapProduction + "/"+GlobalConfig.projectUnit+"/EzMapAPI.js'><\/script>");
		//PGIS加载类库文件
		var jsfiles = new Array("src/ezd.gzjs", "src/ezc.gzjs", "src/ezg.gzjs", 
								"src/ezf.gzjs", "src/eze.gzjs", "src/eza.gzjs", 
								"src/ezh.gzjs", "src/ezb.gzjs");
		var cssfiles = new Array("css/EzServer.css");
		var host = "js/apps/EzMap/";
		//var baseUrl=host+GlobalConfig.mapProduction + "/";
		var baseUrl=host + "/";
		var agent = navigator.userAgent;
		
		var docWrite = (agent.match("MSIE") || agent.match("Safari"));
		if (docWrite) {
			var allScriptTags = new Array(jsfiles.length);
			var allCSSTags = new Array(cssfiles.length);
		}
		
		for (var i = 0, len = jsfiles.length; i < len; i++) {
			if (docWrite) {
				allScriptTags[i] = "<script type = 'text/javascript' charset = 'gb2312' src = '" + baseUrl + jsfiles[i] + "'> </script>";
			} else {
				var s = document.createElement("script");
				s.type = "text/javascript";
				s.charset = "gb2312 ";
				s.src = baseUrl + jsfiles[i];
				var h = document.getElementsByTagName("head ").length ? document.getElementsByTagName("head ")[0] : document.body;
				h.appendChild(s);
			}
		}
		
		for (var i = 0, len = cssfiles.length; i < len; i++) {
			if (docWrite) {
				allCSSTags[i] = " <link charset = 'gb2312' type = 'text/css' rel = 'stylesheet' href = '" + host + cssfiles[i] + "'/> ";
			} else {
				var s = document.createElement("link ");
				s.rel = "stylesheet ";
				s.type = "text/css ";
				s.charset = "gb2312 ";
				s.src = baseUrl + jsfiles[i];
				var h = document.getElementsByTagName("head ").length ? document.getElementsByTagName("head ")[0] : document.body;
				h.appendChild(s);
			}
		}
		
		if (docWrite) {
			document.write(allScriptTags.join(""));
			document.write(allCSSTags.join(""));
		}
	}else if (GlobalConfig.apiProduction == "GeoMap") {
		document.writeln('<script type="text/javascript" src="js/apps/' + GlobalConfig.apiProduction + '/lib/OpenLayers/OpenLayers-min.js"><\/script>');
		document.writeln('<script type="text/javascript" src="js/apps/' + GlobalConfig.apiProduction + '/lib/GeoGlobeSDK/GeoGlobeJS.min.js"><\/script>');
		document.writeln('<script type="text/javascript" src="js/apps/' + GlobalConfig.apiProduction + '/MSConfig.js"><\/script>');
	}

	//业务API
	document.writeln('<script type="text/javascript" src="js/apps/' + GlobalConfig.apiProduction + '/MarkerClusterer.js"><\/script>');
	document.writeln('<script type="text/javascript" src="js/apps/' + GlobalConfig.apiProduction + '/EzMapManager.js"><\/script>');
	document.writeln('<script type="text/javascript" src="js/apps/' + GlobalConfig.apiProduction + '/MapUtils.js"><\/script>');
	document.writeln('<script type="text/javascript" src="js/apps/' + GlobalConfig.apiProduction + '/MapModel.js"><\/script>');
	document.writeln('<script type="text/javascript" src="js/apps/' + GlobalConfig.apiProduction + '/Business.js"><\/script>');
	document.writeln('<script type="text/javascript" src="js/apps/' + GlobalConfig.apiProduction + '/PgisTool.js"><\/script>');

	//接口API
	document.writeln('<script type="text/javascript" src="js/apps/MapManagerInterface.js"><\/script>');
	document.writeln('<script type="text/javascript" src="js/apps/MapToolInterface.js"><\/script>');
	document.writeln('<script type="text/javascript" src="js/apps/netposa.js"><\/script>');
	document.writeln('<script type="text/javascript" src="js/lib/Concurrent.Thread.js"><\/script>');
	
})(window, 'MyMap');
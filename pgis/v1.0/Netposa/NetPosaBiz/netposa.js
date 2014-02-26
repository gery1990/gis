/////基础类库///////
var _mapManager = null;
var _mapUtils = null;
var _markerModelManager = null;
var _markerClusterer = null;
var _popup = null;
/////基础类库///////

/////业务类库///////
var _mapTool = null;
var _business = null;
var _videoPatrol = null;
var _trackAnalysis = null;
var _followAnalysis = null;
var _reportCollision = null;
var _defenseManager = null;
var _administrativeManager = null;
var _locationManager = null;
/////业务类库///////

//GIS工具专用
var _pgistools = null;

//初始化
window.addEvent('domready', function() {
	try {
		if(_business === null){
			_mapManager = new MapManagerInterface(GlobalConfig);
			if(_mapManager === null || _mapManager.isInit === false){
				setLoadingErrorInfo();
				return;
			}
			var map = _mapManager.getMap();
			//气泡类
			_popup = new PopupClass();
			//工具类
			_mapUtils = new MapUtils(map);
			//对象管理类
			_markerModelManager = new MarkerModelManager();
			//聚合类
			_markerClusterer = new MarkerClusterer();
			//pgis 工具
			_pgistools = new PgisTool(map);
			//工具条
			_mapTool = new MapToolInterface();
			//业务类
			_business = new BusinessClass();
			//视频巡逻
			_videoPatrol = new VideoPatrolClass();
			//轨迹分析
			_trackAnalysis = new TrackAnalysisClass();
			//跟车分析
			_followAnalysis = new FollowAnalysisClass();
			//碰撞分析
			_reportCollision = new ReportCollisionClass();
			//防线管理
			_defenseManager = new DefenseManagerClass();
			//行政区域管理
			_administrativeManager = new AdministrativeManagerClass();
			//布点管理
			_locationManager = new LocationManagerClass();
            if (GlobalConfig.apiProduction==="EzMap") {
				addMapEventListener(map);
            }
		}

		//$$('.loading').destroy();
	} catch (e) {
		setLoadingErrorInfo();
		
	}
});

// 屏蔽右键
document.oncontextmenu = function(e) {
	return false;
};

//地图事件
function addMapEventListener(map){
	if(!_mapManager || !map || map === null) return;

	map.addMapEventListener('mapzoomend',function(e) {
		document.focus();
		_markerClusterer.repaintClusterer();
		_trackAnalysis.repaintFlagIndexs(e.zoomLevel);
		_followAnalysis.repaintFlagIndexs(e.zoomLevel);
	}.bind(this));

	map.addMapEventListener('mappanend', function(e){
		document.focus();
	}.bind(this));

	map.addMapEventListener('mapresize', function(e){
		document.focus();
		_trackAnalysis.repaintFlagIndexs(e.zoomLevel);
		_followAnalysis.repaintFlagIndexs(e.zoomLevel);
	}.bind(this));

	map.addMapEventListener('mapswitchmapserver', function(e){
		document.focus();
		_trackAnalysis.repaintFlagIndexs(e.zoomLevel);
		_followAnalysis.repaintFlagIndexs(e.zoomLevel);
	}.bind(this));
}

//地图工具类代理
function mapToolProxy(){
	var args = Array.prototype.slice.call(arguments),
		func = args.shift();
	if (_mapTool !== null && typeof _mapTool[func] === 'function') {
		return _mapTool[func].apply(_mapTool, args);
	}
}

//业务代理
function businessProxy(){
	var args = Array.prototype.slice.call(arguments),
		func = args.shift();
	if (_business !== null && typeof _business[func] === 'function') {
		return _business[func].apply(_business, args);
	}
}

//PGis工具
function pgisToolsProxy(){
	var args = Array.prototype.slice.call(arguments),
		func = args.shift();
	if (_pgistools !== null && typeof _pgistools[func] === 'function') {
		return _pgistools[func].apply(_pgistools, args);
	}
}

//视频巡逻功能代理
function videoPatrolProxy(){
	var args = Array.prototype.slice.call(arguments),
		func = args.shift();
	if (_videoPatrol !== null && typeof _videoPatrol[func] === 'function') {
		return _videoPatrol[func].apply(_videoPatrol, args);
	}
}

//轨迹分析功能代理
function trackAnalysisProxy(){
	var args = Array.prototype.slice.call(arguments),
		func = args.shift();
	if (_trackAnalysis !== null && typeof _trackAnalysis[func] === 'function') {
		return _trackAnalysis[func].apply(_trackAnalysis, args);
	}
}

//跟车分析功能代理
function followAnalysisProxy() {
    var args = Array.prototype.slice.call(arguments),
	    func = args.shift();
    if (_followAnalysis != null && typeof _followAnalysis[func] === 'function') {
        return _followAnalysis[func].apply(_followAnalysis, args);
    }
}

//跟车分析功能代理
function reportCollisionProxy() {
    var args = Array.prototype.slice.call(arguments),
	    func = args.shift();
    if (_reportCollision != null && typeof _reportCollision[func] === 'function') {
        return _reportCollision[func].apply(_reportCollision, args);
    }
}

//电子防线功能代理
function defenseManagerProxy(){
	var args=Array.prototype.slice.call(arguments),
		func=args.shift();
	if (_defenseManager!=null && typeof _defenseManager[func]==='function') {
		return _defenseManager[func].apply(_defenseManager, args);
	}
}

//行政区域功能代理
function administrativeManagerProxy(){
	var args=Array.prototype.slice.call(arguments),
		func=args.shift();
	if (_administrativeManager!=null && typeof _administrativeManager[func]==='function') {
		return _administrativeManager[func].apply(_administrativeManager, args);
	}
}

//布点功能代理
function locationManagerProxy(){
	var args=Array.prototype.slice.call(arguments),
		func=args.shift();
	if (_locationManager!=null && typeof _locationManager[func]==='function') {
		return _locationManager[func].apply(_locationManager, args);
	}
}

/*! I dont know why EzMapAPI aways report: document.focus undefined... */
if (document.focus === undefined) {
	document.focus = function() {
		if (window.focus) {
			window.focus();
		}
	};
}

function setLoadingErrorInfo(){
	document.body.id = 'ERROR';
	$$('.loading').innerHTML = '<p class="warn"><b>\u5730\u56FE\u8D44\u6E90\u52A0\u8F7D\u5931\u8D25\uFF0C\u8BF7\u68C0\u67E5\u7F51\u7EDC\u6216\u8054\u7CFB\u6280\u672F\u4EBA\u5458\uFF01</b></p>';
	if(typeof window.external.OnLoadDataComplatedCallBack === 'function')
		window.external.OnLoadDataComplatedCallBack(false);
}

/*! 工具方法：将中文转换成unicode
 * 因为脚本本件是UTF-8编码 但是页面是GB2312 所以如果需要回显中文请先转码
 * 之所以页面不用UTF-8是因为PGIS的脚本中含有中文 它没有经过转码 而且是GBK...
 */
function escapeToUnicode(chinese) {
	return window.escape(chinese || '').replace(/%/g, '\\');
}
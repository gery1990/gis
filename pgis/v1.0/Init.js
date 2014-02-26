
///////////////////////
///////////////////////注册命名空间  开始/////////////////////////
///////////////////////

var NPNamespace = window.NPNamespace = NPNamespace || {};
// 注册命名空间
NPNamespace.register = function(fullNS){
    // 将命名空间切成N部分
    var nsArray = fullNS.split('.');
    var sEval = "";
    var sNS = "";
    for (var i = 0; i < nsArray.length; i++)
    {
        if (i != 0) 
            sNS += ".";
        sNS += nsArray[i];
        // 依次创建构造命名空间对象（假如不存在的话）的语句
        sEval += "if (typeof(" + sNS + ") == 'undefined') " + sNS + " = new Object();"
    }
    if (sEval != "") 
    	eval(sEval);
};

NPNamespace.register("NPMapLib");
NPNamespace.register("NPMapLib.Adapter");
NPNamespace.register("NPMapLib.Controls");
NPNamespace.register("NPMapLib.Geometry");
NPNamespace.register("NPMapLib.Layers");
NPNamespace.register("NPMapLib.Managers");
NPNamespace.register("NPMapLib.Symbols");
NPNamespace.register("NPMapLib.Tools");
NPNamespace.register("NPMapLib.Utils");

///////////////////////
///////////////////////注册命名空间  结束/////////////////////////
///////////////////////


///////////////////////
///////////////////////Const常量  开始/////////////////////////
///////////////////////
/*!
 * 版本号
 */
NPMapLib.VERSION_NUMBER = "v1.0";

/*!
 * 适配器(API)类型
 */
NPMapLib.ADAPTER_TYPE_ARCGIS = "Arcgis";            //arcgis
NPMapLib.ADAPTER_TYPE_EZMAP = "EzMap";              //山海经纬（默认）
NPMapLib.ADAPTER_TYPE_OPENLAYERS = "OpenLayers";    //openlayers


/*!
 * 图层类型
 */
NPMapLib.MAP_LAYER_TYPE_EZMAP_OFFLINE = 0;
NPMapLib.MAP_LAYER_TYPE_EZMAP_TILE = 1;
NPMapLib.MAP_LAYER_TYPE_GOOGLE_OFFLINE = 2;
NPMapLib.MAP_LAYER_TYPE_GOOGLE_TILE = 3;
NPMapLib.MAP_LAYER_TYPE_ARCGIS_OFFLINE = 4;
NPMapLib.MAP_LAYER_TYPE_ARCGIS_TILE = 5;
NPMapLib.MAP_LAYER_TYPE_WMS = 6;
NPMapLib.MAP_LAYER_TYPE_VECTORGML=7;
NPMapLib.MAP_LAYER_TYPE_VECTORWFS=8;
NPMapLib.MAP_LAYER_TYPE_OVERLAY=9;


/*!
 * 几何标注类型
 */
NPMapLib.GEOMETRY_TYPE_UNKNOWN = 0;                 //未知（默认）
NPMapLib.GEOMETRY_TYPE_POINT = 1;                   //点
NPMapLib.GEOMETRY_TYPE_POLYLINE = 2;                //多段线
NPMapLib.GEOMETRY_TYPE_POLYGON = 3;                 //多边形
NPMapLib.GEOMETRY_TYPE_CIRCLE = 4;                  //圆形
NPMapLib.GEOMETRY_TYPE_RECTANGLE = 5;               //矩形


/*!
 * 线形
 */
NPMapLib.LINE_TYPE_SOLID = 0;                       //实线（默认）
NPMapLib.LINE_TYPE_DASH = 1;                        //虚线
NPMapLib.LINE_TYPE_DOT = 2;                         //点
NPMapLib.LINE_TYPE_DASHDOTDOT = 3;                  //虚线（中间夹杂点点)
NPMapLib.LINE_TYPE_DASHDOT = 4;                     //虚线（中间夹杂点)
NPMapLib.LINE_TYPE_SHORTDASH = 5;                   //短虚线
NPMapLib.LINE_TYPE_SHORTDOT = 6;                    //短点线
NPMapLib.LINE_TYPE_SHORTDASHDOTDOT = 7;             //短虚线（中间夹杂点点）
NPMapLib.LINE_TYPE_SHORTDASHDOT = 8;                //短虚线（中间夹杂点）
NPMapLib.LINE_TYPE_LONGDASH = 9;                    //长虚线
NPMapLib.LINE_TYPE_LONGDASHDOT = 10;                //长虚线（中间夹杂点）


/*!
 * 线箭头类型
 */
NPMapLib.LINE_ARROW_TYPE_REVERSE = -1;              //带箭头，反向
NPMapLib.LINE_ARROW_TYPE_NULL = 0;                  //不带箭头（默认）
NPMapLib.LINE_ARROW_TYPE_FORWORD = 1;               //带箭头，正向


/*!
 * 测量类型
 */
NPMapLib.MEASURE_MODE_DISTANCE = 0;        //测量距离
NPMapLib.MEASURE_MODE_AREA = 1;            //测量面积
NPMapLib.MEASURE_MODE_LOCATION = 2;        //测量区域


/*!
 * 几何图形绘制模式
 */
NPMapLib.DRAW_MODE_NONE = 0;                   //不绘制
NPMapLib.DRAW_MODE_RECT = 1;                   //画矩形
NPMapLib.DRAW_MODE_CIRCLE = 2;                 //画圆
NPMapLib.DRAW_MODE_POLYLINE = 3;               //画多段线
NPMapLib.DRAW_MODE_POLYLGON = 4;               //画面
NPMapLib.OVERLAY_TYPE_INFOWIN = 5;             //信息窗口


/*!
 * 标注类型
 */
NPMapLib.OVERLAY_TYPE_UNKNOWN = 0;              //未知
NPMapLib.OVERLAY_TYPE_POLYLINE = 1;             //多段线
NPMapLib.OVERLAY_TYPE_POLYGON = 2;              //多边形
NPMapLib.OVERLAY_TYPE_CIRCLE = 3;               //圆形
NPMapLib.OVERLAY_TYPE_LABEL = 4;                //文本
NPMapLib.OVERLAY_TYPE_MARKER = 5;               //标注
NPMapLib.OVERLAY_TYPE_INFOWIN = 6;               //图像标注


/*!
 * 控件类型
 */
NPMapLib.CONTROL_TYPE_UNKNOWN = 0;              //未知
NPMapLib.CONTROL_TYPE_COPYRIGHT = 1;            //版权控件
NPMapLib.CONTROL_TYPE_NAVIGATION = 2;           //导航控件
NPMapLib.CONTROL_TYPE_OVERVIEW = 3;             //鹰眼控件
NPMapLib.CONTROL_TYPE_SCALE = 4;                //比例尺控件


/*!
 * 地图单位
 */
NPMapLib.MAP_UNITS_UNKNOWN = "UnknownUnits";
NPMapLib.MAP_UNITS_CENTIMETERS = "Centimeters";                 
NPMapLib.MAP_UNITS_DECIMAL_DEGREES = "DecimalDegrees";
NPMapLib.MAP_UNITS_DEGREE_MINUTE_SECONDS = "DegreeMinuteSeconds";
NPMapLib.MAP_UNITS_DECIMETERS = "Decimeters";
NPMapLib.MAP_UNITS_FEET = "Feet";
NPMapLib.MAP_UNITS_INCHES = "Inches";
NPMapLib.MAP_UNITS_KILOMETERS = "Kilometers";
NPMapLib.MAP_UNITS_METERS = "Meters";
NPMapLib.MAP_UNITS_MILES = "Miles";
NPMapLib.MAP_UNITS_MILLIMETERS = "Millimeters";
NPMapLib.MAP_UNITS_NAUTICAL_MILES = "NauticalMiles";
NPMapLib.MAP_UNITS_POINTS = "Points";
NPMapLib.MAP_UNITS_YARDS = "Yards";
NPMapLib.MAP_UNITS_ACRES = "Acres";
NPMapLib.MAP_UNITS_ARES = "Ares";
NPMapLib.MAP_UNITS_SQUARE_KILOMETERS = "SquareKilometers";
NPMapLib.MAP_UNITS_SQUARE_MILES = "SquareMiles";
NPMapLib.MAP_UNITS_SQUARE_FEET = "SquareFeet";
NPMapLib.MAP_UNITS_SQUARE_METERS = "SquareMeters";
NPMapLib.MAP_UNITS_HECTARES = "Hectares";
NPMapLib.MAP_UNITS_SQUARE_YARDS = "SquareYards";
NPMapLib.MAP_UNITS_SQUARE_INCHES = "SquareInches";
NPMapLib.MAP_UNITS_SQUARE_MILLIMETERS = "SquareMillimeters";
NPMapLib.MAP_UNITS_SQUARE_CENTIMETERS = "SquareCentimeters";
NPMapLib.MAP_UNITS_SQUARE_DECIMETERS = "SquareDecimeters";


/*!
 * 控件停靠位置
 */
NPMapLib.CONTROL_ANCHOR_TOP_LEFT = 0;           //左上角
NPMapLib.CONTROL_ANCHOR_TOP_RIGHT = 1;          //右上角
NPMapLib.CONTROL_ANCHOR_BOTTOM_LEFT = 2;        //左下角
NPMapLib.CONTROL_ANCHOR_BOTTOM_RIGHT = 3;       //右下角


/*!
 * 图片格式
 */
NPMapLib.IMAGE_FORMAT_PNG = '.png';
NPMapLib.IMAGE_FORMAT_JPEG = '.jpg';
NPMapLib.IMAGE_FORMAT_BMP = '.bmp';


///////////////////////
///////////////////////Const常量  结束/////////////////////////
///////////////////////



///////////////////////
///////////////////////加载css/js  开始/////////////////////////
///////////////////////

//正在使用的适配器类型（默认EzMap）
if(!NPMapLib.USING_ADAPTER)
    NPMapLib.USING_ADAPTER = NPMapLib.ADAPTER_TYPE_EZMAP;

try{
    if(_NPMAPLIB_USING_ADAPTER_OPENLAYERS)
        NPMapLib.USING_ADAPTER = NPMapLib.ADAPTER_TYPE_OPENLAYERS;
        //NPMapLib.USING_ADAPTER = NPMapLib.ADAPTER_TYPE_ARCGIS;
}catch(e){

}


/*!
 * 基础工具(静态类)
 */
NPMapLib.Utils.BaseUtils = (function(){

    var scriptName = "Init.js";
    //获取当前文件路径
    function _getScriptLocation(){
        var r = new RegExp("(^|(.*?\\/))(" + scriptName + ")(\\?|$)"),
            s = document.getElementsByTagName('script'),
            src, m, l = "";
        for(var i=0, len=s.length; i<len; i++) {
            src = s[i].getAttribute('src');
            if(src) {
                m = src.match(r);
                if(m) {
                    l = m[1];
                    break;
                }
            }
        }
        return l;
    }


    //主文件目录
    var host = _getScriptLocation() + "Netposa";

    var e = {};
    //获取当前文件路径
    e.getScriptLocation = function(){
        var scripts = document.getElementsByTagName("script");
        return scripts[scripts.length - 1].getAttribute("src");
    };

    //获取主目录
    e.getHostPath = function(){
        return host;
    };

    //获取当前文件目录路径
    e.getScriptDictoryLocation = function(){
        var path = this.getScriptLocation();
        if(!path && path.length < 0)
            return;

        return path.substring(0, path.lastIndexOf("/")+1);
    };

    //创建错误异常
    e.createError = function(a, b){
        if (b) {
            return new Error(a + "\r\nBecause :" + b.message)
        } else {
            return new Error(a)
        }
    };

    //添加可信任的url
    e.addtrusturl = function(url) {
        var WshShell = new ActiveXObject("WScript.Shell");
        WshShell.RegWrite("HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings\\ZoneMap\\Domains\\" + url, "");
        WshShell.RegWrite("HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings\\ZoneMap\\Domains\\" + url + "\\www", "");
        WshShell.RegWrite("HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings\\ZoneMap\\Domains\\" + url + "\\www\\http", "2", "REG_DWORD");
    };

    //弹出窗口的阻止程序
    e.popupwindow = function(url) {
        var WshShell = new ActiveXObject("WScript.Shell");
        //添加可信站点或IP
        WshShell.RegWrite("HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings\\ZoneMap\\Ranges\\Range100\\", "");
        WshShell.RegWrite("HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings\\ZoneMap\\Ranges\\Range100\\http", "2", "REG_DWORD");
        WshShell.RegWrite("HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings\\ZoneMap\\Ranges\\Range100\\:Range", url);
        //修改IE ActiveX 安全设置
        WshShell.RegWrite("HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings\\Zones\\3\\1001", "0", "REG_DWORD");
        WshShell.RegWrite("HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings\\Zones\\3\\1004", "0", "REG_DWORD");
        WshShell.RegWrite("HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings\\Zones\\3\\1200", "0", "REG_DWORD");
        WshShell.RegWrite("HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings\\Zones\\3\\1201", "0", "REG_DWORD");
        WshShell.RegWrite("HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings\\Zones\\3\\1405", "0", "REG_DWORD");
        WshShell.RegWrite("HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings\\Zones\\3\\2201", "0", "REG_DWORD");
        //禁用弹出窗口阻止程序
        WshShell.RegWrite("HKCU\\Software\\Microsoft\\Internet Explorer\\New Windows\\PopupMgr", "no");
    };

    //把当前打开的网址添加为可信任
    e.addtrustmyself = function() {
        this.addtrusturl(window.location.href);
    };

    //允许当前网址弹出窗口的阻止程序
    e.addpopwinmyself = function(){
        this.popupwindow(window.location.href);
    };

    //添加CSS文件
    e.addCSSFiles = function(cssFiles){
        if(!cssFiles || cssFiles.length <=0)
            return;

        var cssTags = new Array(cssFiles.length);
        for (var i=0, len=cssFiles.length; i<len; i++) {
            cssTags[i] = "<link type='text/css' rel='stylesheet' href = '" + host + "/" + cssFiles[i] + "'/> ";
        }
        if (cssTags.length > 0) {
            document.write(cssTags.join(""));
        }
    };

    //添加JS文件
    e.addJSFiles = function(jsFiles){
        if(!jsFiles || jsFiles.length <=0)
            return;
        var scriptTags = new Array(jsFiles.length);
        for (var i=0, len=jsFiles.length; i<len; i++) {
            scriptTags[i] = "<script type='text/javascript' src='" + host + "/" + jsFiles[i] + "'></script>"; 
        }
        if (scriptTags.length > 0) {
            document.write(scriptTags.join(""));
        }
    };

    e.JsonToStr = function(o) {
        var arr = [];
        var fmt = function(s) {
            if(typeof s === "function")
                return;

            if (typeof s == 'object' && s != null) 
                return e.JsonToStr(s);
            return /^(string|number)$/.test(typeof s) ? "'" + s + "'" : s;
        }

        var temp;
        for (var i in o){
            temp = fmt(o[i]);
            if(!temp)
                continue;
            arr.push("'" + i + "':" + temp);
        }
        return '{' + arr.join(',') + '}';
    }

    //类型判断
    e.isTypeRight = function(param, type){
        switch (type) {
            case "string":
                if (typeof param == "string") {
                    return true
                } else {
                    return false
                }
            case "int":
                if (typeof param == "number") {
                    if (param.toString().indexOf(".") == -1) {
                        return true
                    } else {
                        return false
                    }
                } else {
                    return false
                }
            case "float":
                if (typeof param == "number") {
                    return true
                } else {
                    return false
                }
            case "number":
                if (typeof param == "number") {
                    return true
                } else {
                    return false
                }
            case "boolean":
                if (typeof param == "boolean") {
                    return true
                } else {
                    return false
                }
            case "Array":
                if(param instanceof Array)
                    return true;
                else
                    return false;
            case "function":
                if (typeof param == "function") {
                    return true
                } else {
                    return false
                }
            case "object":
                if (typeof param == "object") {
                    return true
                } else {
                    return false
                }
            case "undefined":
                if (typeof param == "undefined") {
                    return true
                } else {
                    return false
                }
            default:
                if (param instanceof eval(type)) {
                    return true
                } else {
                    return false
                }
        }
    };

    return e;
})();

(function(){
    //CSS
    var cssFiles = [
                    "Css/base.css",
                    "Css/popup.css"
                ];

    //JS
    var jsFiles = [
                    "Map.js",
                    "Layer.js",
                    "Layers" + "/" + "EzMapOffLineLayer.js",
                    "Layers" + "/" + "EzMapTileLayer.js",
                    "Layers" + "/" + "GoogleMapTileLayer.js",
                    "Layers" + "/" + "GoogleOffLineLayer.js",
                    "Layers" + "/" + "ArcgisTileLayer.js",
                    "Layers" + "/" + "WMSLayer.js",
                    "Layers" + "/" + "VectorGMLLayer.js",
                    "Layers" + "/" + "OverlayLayer.js",
                    "Overlay.js",
                    "Managers" + "/" + "CsObjCaster.js",
                    "Managers" + "/" + "MapManager.js",
                    "Managers" + "/" + "OverlayManager.js",
                    "Managers" + "/" + "LayerManager.js",
                    "Managers" + "/" + "ControlManager.js",
                    "Managers" + "/" + "ContextMenuManager.js",
                    "Managers" + "/" + "OtherManager.js",
                    "Geometry" + "/" + "Circle.js",
                    "Geometry" + "/" + "Extent.js",
                    "Geometry" + "/" + "Pixel.js",
                    "Geometry" + "/" + "Point.js",
                    "Geometry" + "/" + "Polygon.js",
                    "Geometry" + "/" + "Polyline.js",
                    "Geometry" + "/" + "Size.js",
                    "Symbols" + "/" + "Animation.js",
                    "Symbols" + "/" + "Icon.js",
                    "Symbols" + "/" + "InfoWindow.js",
                    "Symbols" + "/" + "Label.js",
                    "Symbols" + "/" + "Marker.js",
                    "Control.js",
                    "Controls" + "/" + "CopyRightControl.js",
                    "Controls" + "/" + "NavigationControl.js",
                    "Controls" + "/" + "OverviewControl.js",
                    "Controls" + "/" + "ScaleControl.js",
                    "ContextMenu.js",
                    "Adapter/AdapterFactory.js",
                    "Adapter" + "/" + NPMapLib.USING_ADAPTER + "/" + "MapAdapter.js",
                    "Lib" + "/" + NPMapLib.USING_ADAPTER + "/" + "Init.js",
                    "Tools" + "/" + "DrawingTool.js",
                    "Tools" + "/" + "MeasureTool.js",
                    "Utils" + "/" + "Popup.js",
                ];
    
    NPMapLib.Utils.BaseUtils.addCSSFiles(cssFiles);
    NPMapLib.Utils.BaseUtils.addJSFiles(jsFiles);
})();


//注册右键菜单代理
function PROXY_ContextMenuManager(){
    var args = Array.prototype.slice.call(arguments),
        func = args.shift();
    if (NPMapLib.Managers.ContextMenuManager !== null && typeof NPMapLib.Managers.ContextMenuManager[func] === 'function') {
        return NPMapLib.Managers.ContextMenuManager[func].apply(NPMapLib.Managers.ContextMenuManager, args);
    }
}

//注册控件代理
function PROXY_ControlManager(){
    var args = Array.prototype.slice.call(arguments),
        func = args.shift();
    if (NPMapLib.Managers.ControlManager !== null && typeof NPMapLib.Managers.ControlManager[func] === 'function') {
        return NPMapLib.Managers.ControlManager[func].apply(NPMapLib.Managers.ControlManager, args);
    }
}

//注册控件代理
function PROXY_LayerManager(){
    var args = Array.prototype.slice.call(arguments),
        func = args.shift();
    if (NPMapLib.Managers.LayerManager !== null && typeof NPMapLib.Managers.LayerManager[func] === 'function') {
        return NPMapLib.Managers.LayerManager[func].apply(NPMapLib.Managers.LayerManager, args);
    }
}

//注册控件代理
function PROXY_MapManager(){
    var args = Array.prototype.slice.call(arguments),
        func = args.shift();

    if (NPMapLib.Managers.MapManager !== null && typeof NPMapLib.Managers.MapManager[func] === 'function') {
        return NPMapLib.Managers.MapManager[func].apply(NPMapLib.Managers.MapManager, args);
    }
}

//注册控件代理
function PROXY_OtherManager(){
    var args = Array.prototype.slice.call(arguments),
        func = args.shift();
    if (NPMapLib.Managers.OtherManager !== null && typeof NPMapLib.Managers.OtherManager[func] === 'function') {
        return NPMapLib.Managers.OtherManager[func].apply(NPMapLib.Managers.OtherManager, args);
    }
}

//注册控件代理
function PROXY_OverlayManager(){
    var args = Array.prototype.slice.call(arguments),
        func = args.shift();
    if (NPMapLib.Managers.OverlayManager !== null && typeof NPMapLib.Managers.OverlayManager[func] === 'function') {
        return NPMapLib.Managers.OverlayManager[func].apply(NPMapLib.Managers.OverlayManager, args);
    }
}


//方法扩展接口
Function.prototype.bind = function() {
    var __method = this;
    var args = Array.prototype.slice.call(arguments);
    var object = args.shift();
    return function() {
        return __method.apply(object,
            args.concat(Array.prototype.slice.call(arguments)));
    }
}

//数据扩展接口
Array.prototype.contains = function (element) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == element) {
            return true;
        }
    }
    return false;
}


///////////////////////加载css/js  结束/////////////////////////



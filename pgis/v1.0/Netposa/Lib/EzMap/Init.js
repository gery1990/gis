/*!
* 初始化加载
*/
(function() {
    if (typeof EzServerClient == "undefined" || !EzServerClient)
        EzServerClient = {};
    if (typeof EzServerClient.GlobeParams == "undefined" || !EzServerClient.GlobeParams)
        EzServerClient.GlobeParams = {};
    EzServerClient.GlobeParams.VML = document.createElementNS ? false : true;    //判断选用vml或svg
    EzServerClient.GlobeParams.MapSrcURL = [];
    EzServerClient.GlobeParams.DynamicCopyright = [];
    EzServerClient.GlobeParams.Copyright = "Netposa";
    EzServerClient.GlobeParams.Version = 0.3;
    EzServerClient.GlobeParams.MapCoordinateType = 1;
    EzServerClient.GlobeParams.MapConvertScale = 114699;
    EzServerClient.GlobeParams.MapConvertOffsetX = 0;
    EzServerClient.GlobeParams.MapConvertOffsetY = 0;
    EzServerClient.GlobeParams.IsOverlay = true;
    EzServerClient.GlobeParams.MapProx = false;
    EzServerClient.GlobeParams.TileAnchorPoint = [0, 0];
    EzServerClient.GlobeParams.EzMapServiceURL = "";

    //图层信息
    EzServerClient.GlobeParams.MyMapType = NPMapLib.MAP_LAYER_TYPE_EZMAP_TILE;
    EzServerClient.GlobeParams.IsLocal = true;
    EzServerClient.GlobeParams.CenterPoint = [0, 0];
    EzServerClient.GlobeParams.MapFullExtent = [0, 0, 0, 0];
    EzServerClient.GlobeParams.MapInitLevel = 0;
    EzServerClient.GlobeParams.MapMaxLevel = 10;
    EzServerClient.GlobeParams.ZoomOffset = 10;
    EzServerClient.GlobeParams.MapUnitPixels = 256;
    EzServerClient.GlobeParams.ZoomLevelSequence = 2;
    EzServerClient.GlobeParams.TileImageFormat = NPMapLib.IMAGE_FORMAT_PNG;

    EzServerClient.GlobeParams.HotspotStyle = {
        borderColor: "red",
        borderWeight: "1.2pt",
        fillColor: "blue",
        opacity: "19660f"
    };

    EzServerClient.GlobeParams.EzServerClientURL = NPMapLib.Utils.BaseUtils.getHostPath();
    EzServerClient.VERSION_NUMBER = "V6.6.6.201108121100a";



    var host = "Lib/EzMap/";
    var cssFiles = new Array(host + "css/EzServer.css");
    var jsFiles = new Array(
							host + "src/ezd.js",
							host + "src/ezc.js",
							host + "src/ezg.js",
							host + "src/ezf.js",
							host + "src/eze.js",
							host + "src/eza.js",
							host + "src/ezh.js",
							host + "src/ezb.js");

    NPMapLib.Utils.BaseUtils.addCSSFiles(cssFiles);
    NPMapLib.Utils.BaseUtils.addJSFiles(jsFiles);
})();
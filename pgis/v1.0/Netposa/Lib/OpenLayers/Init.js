/*
 * init
 */
(function() {
    if (typeof OpenLayersClient == 'undefined' || !OpenLayersClient) {
        OpenLayersClient = new Object();
    }
    if (typeof OpenLayersClient.GlobeParams == 'undefined' || !OpenLayersClient.GlobeParams) {
        OpenLayersClient.GlobeParams = new Object();
    }

    // OpenLayersClient.GlobeParams.DynamicCopyright = [];
    // OpenLayersClient.GlobeParams.Copyright = "Netposa";
    // OpenLayersClient.GlobeParams.Version = 0.3;
    // OpenLayersClient.GlobeParams.MapCoordinateType = 1;
    // OpenLayersClient.GlobeParams.MapConvertScale = 114699;
    // OpenLayersClient.GlobeParams.MapConvertOffsetX = 0;
    // OpenLayersClient.GlobeParams.MapConvertOffsetY = 0;
    // OpenLayersClient.GlobeParams.IsOverlay = true;
    // OpenLayersClient.GlobeParams.MapProx = false;
    // OpenLayersClient.GlobeParams.TileAnchorPoint = [0, 0];

    // //图层信息
     OpenLayersClient.GlobeParams.MyMapType = NPMapLib.MAP_LAYER_TYPE_WMS;
     OpenLayersClient.GlobeParams.IsLocal = false;
    // OpenLayersClient.GlobeParams.CenterPoint = [0, 0];
    // OpenLayersClient.GlobeParams.MapFullExtent = [0, 0, 0, 0];
    // OpenLayersClient.GlobeParams.MapInitLevel = 0;
    // OpenLayersClient.GlobeParams.MapMaxLevel = 10;
    // OpenLayersClient.GlobeParams.ZoomOffset = 10;
    // OpenLayersClient.GlobeParams.MapUnitPixels = 256;

    var singleFile = (typeof OpenLayers == "object" && OpenLayers.singleFile);
    var scriptName = (!singleFile) ? "lib/OpenLayers.js" : "OpenLayers.js";

    var jsFiles = window.OpenLayers;

    window.OpenLayers = {
        /**
         * Method: _getScriptLocation
         * Return the path to this script. This is also implemented in
         * OpenLayers/SingleFile.js
         *
         * Returns:
         * {String} Path to this script
         */
        _getScriptLocation: (function() {
            var r = new RegExp("(^|(.*?\\/))(" + scriptName + ")(\\?|$)"),
                s = document.getElementsByTagName('script'),
                src, m, l = "";
            for (var i = 0, len = s.length; i < len; i++) {
                src = s[i].getAttribute('src');
                if (src) {
                    m = src.match(r);
                    if (m) {
                        l = m[1];
                        break;
                    }
                }
            }
            return (function() {
                return l;
            });
        })(),

        /**
         * APIProperty: ImgPath
         * {String} Set this to the path where control images are stored, a path
         * given here must end with a slash. If set to '' (which is the default)
         * OpenLayers will use its script location + "img/".
         *
         * You will need to set this property when you have a singlefile build of
         * OpenLayers that either is not named "OpenLayers.js" or if you move
         * the file in a way such that the image directory cannot be derived from
         * the script location.
         *
         * If your custom OpenLayers build is named "my-custom-ol.js" and the images
         * of OpenLayers are in a folder "/resources/external/images/ol" a correct
         * way of including OpenLayers in your HTML would be:
         *
         * (code)
         *   <script src="/path/to/my-custom-ol.js" type="text/javascript"></script>
         *   <script type="text/javascript">
         *      // tell OpenLayers where the control images are
         *      // remember the trailing slash
         *      OpenLayers.ImgPath = "/resources/external/images/ol/";
         *   </script>
         * (end code)
         *
         * Please remember that when your OpenLayers script is not named
         * "OpenLayers.js" you will have to make sure that the default theme is
         * loaded into the page by including an appropriate <link>-tag,
         * e.g.:
         *
         * (code)
         *   <link rel="stylesheet" href="/path/to/default/style.css"  type="text/css">
         * (end code)
         */
        ImgPath: ''
    };

    OpenLayers.VERSION_NUMBER = "Release 2.13";

    //load javascript
    var pt = "Lib/OpenLayers/";
    if (!singleFile) {
        if (!jsFiles) {
            jsFiles = [
                pt + "OpenLayers/BaseTypes/Class.js",
                pt + "OpenLayers/Util.js",
                pt + "OpenLayers/Util/vendorPrefix.js",
                pt + "OpenLayers/Animation.js",
                pt + "OpenLayers/BaseTypes.js",
                pt + "OpenLayers/BaseTypes/Bounds.js",
                pt + "OpenLayers/BaseTypes/Date.js",
                pt + "OpenLayers/BaseTypes/Element.js",
                pt + "OpenLayers/BaseTypes/LonLat.js",
                pt + "OpenLayers/BaseTypes/Pixel.js",
                pt + "OpenLayers/BaseTypes/Size.js",
                pt + "OpenLayers/Console.js",
                pt + "OpenLayers/Tween.js",
                pt + "OpenLayers/Kinetic.js",
                pt + "OpenLayers/Events.js",
                pt + "OpenLayers/Events/buttonclick.js",
                pt + "OpenLayers/Events/featureclick.js",
                pt + "OpenLayers/Request.js",
                pt + "OpenLayers/Request/XMLHttpRequest.js",
                pt + "OpenLayers/Projection.js",
                pt + "OpenLayers/Map.js",
                pt + "OpenLayers/Layer.js",
                pt + "OpenLayers/Icon.js",
                pt + "OpenLayers/Marker.js",
                pt + "OpenLayers/Marker/Box.js",
                pt + "OpenLayers/Popup.js",
                pt + "OpenLayers/Tile.js",
                pt + "OpenLayers/Tile/Image.js",
                pt + "OpenLayers/Tile/Image/IFrame.js",
                pt + "OpenLayers/Tile/UTFGrid.js",
                pt + "OpenLayers/Layer/Image.js",
                pt + "OpenLayers/Layer/SphericalMercator.js",
                pt + "OpenLayers/Layer/EventPane.js",
                pt + "OpenLayers/Layer/FixedZoomLevels.js",
                pt + "OpenLayers/Layer/Google.js",
                pt + "OpenLayers/Layer/Google/v3.js",
                pt + "OpenLayers/Layer/HTTPRequest.js",
                pt + "OpenLayers/Layer/Grid.js",
                pt + "OpenLayers/Layer/MapGuide.js",
                pt + "OpenLayers/Layer/MapServer.js",
                pt + "OpenLayers/Layer/KaMap.js",
                pt + "OpenLayers/Layer/KaMapCache.js",
                pt + "OpenLayers/Layer/Markers.js",
                pt + "OpenLayers/Layer/Text.js",
                pt + "OpenLayers/Layer/WorldWind.js",
                pt + "OpenLayers/Layer/ArcGIS93Rest.js",
                pt + "OpenLayers/Layer/WMS.js",
                pt + "OpenLayers/Layer/WMTS.js",
                pt + "OpenLayers/Layer/ArcIMS.js",
                pt + "OpenLayers/Layer/GeoRSS.js",
                pt + "OpenLayers/Layer/Boxes.js",
                pt + "OpenLayers/Layer/XYZ.js",
                pt + "OpenLayers/Layer/UTFGrid.js",
                pt + "OpenLayers/Layer/OSM.js",
                pt + "OpenLayers/Layer/Bing.js",
                pt + "OpenLayers/Layer/TMS.js",
                pt + "OpenLayers/Layer/TileCache.js",
                pt + "OpenLayers/Layer/Zoomify.js",
                pt + "OpenLayers/Layer/ArcGISCache.js",
                pt + "OpenLayers/Popup/Anchored.js",
                pt + "OpenLayers/Popup/Framed.js",
                pt + "OpenLayers/Popup/FramedCloud.js",
                pt + "OpenLayers/Feature.js",
                pt + "OpenLayers/Feature/Vector.js",
                pt + "OpenLayers/Handler.js",
                pt + "OpenLayers/Handler/Click.js",
                pt + "OpenLayers/Handler/Hover.js",
                pt + "OpenLayers/Handler/Point.js",
                pt + "OpenLayers/Handler/Path.js",
                pt + "OpenLayers/Handler/Polygon.js",
                pt + "OpenLayers/Handler/Feature.js",
                pt + "OpenLayers/Handler/Drag.js",
                pt + "OpenLayers/Handler/Pinch.js",
                pt + "OpenLayers/Handler/RegularPolygon.js",
                pt + "OpenLayers/Handler/Box.js",
                pt + "OpenLayers/Handler/MouseWheel.js",
                pt + "OpenLayers/Handler/Keyboard.js",
                pt + "OpenLayers/Control.js",
                pt + "OpenLayers/Control/Attribution.js",
                pt + "OpenLayers/Control/Button.js",
                pt + "OpenLayers/Control/CacheRead.js",
                pt + "OpenLayers/Control/CacheWrite.js",
                pt + "OpenLayers/Control/ZoomBox.js",
                pt + "OpenLayers/Control/ZoomToMaxExtent.js",
                pt + "OpenLayers/Control/DragPan.js",
                pt + "OpenLayers/Control/Navigation.js",
                pt + "OpenLayers/Control/PinchZoom.js",
                pt + "OpenLayers/Control/TouchNavigation.js",
                pt + "OpenLayers/Control/MousePosition.js",
                pt + "OpenLayers/Control/OverviewMap.js",
                pt + "OpenLayers/Control/KeyboardDefaults.js",
                pt + "OpenLayers/Control/PanZoom.js",
                pt + "OpenLayers/Control/PanZoomBar.js",
                pt + "OpenLayers/Control/ArgParser.js",
                pt + "OpenLayers/Control/Permalink.js",
                pt + "OpenLayers/Control/Scale.js",
                pt + "OpenLayers/Control/ScaleLine.js",
                pt + "OpenLayers/Control/Snapping.js",
                pt + "OpenLayers/Control/Split.js",
                pt + "OpenLayers/Control/LayerSwitcher.js",
                pt + "OpenLayers/Control/DrawFeature.js",
                pt + "OpenLayers/Control/DragFeature.js",
                pt + "OpenLayers/Control/ModifyFeature.js",
                pt + "OpenLayers/Control/Panel.js",
                pt + "OpenLayers/Control/SelectFeature.js",
                pt + "OpenLayers/Control/NavigationHistory.js",
                pt + "OpenLayers/Control/Measure.js",
                pt + "OpenLayers/Control/WMSGetFeatureInfo.js",
                pt + "OpenLayers/Control/WMTSGetFeatureInfo.js",
                pt + "OpenLayers/Control/Graticule.js",
                pt + "OpenLayers/Control/TransformFeature.js",
                pt + "OpenLayers/Control/UTFGrid.js",
                pt + "OpenLayers/Control/SLDSelect.js",
                pt + "OpenLayers/Control/Zoom.js",
                pt + "OpenLayers/Geometry.js",
                pt + "OpenLayers/Geometry/Collection.js",
                pt + "OpenLayers/Geometry/Point.js",
                pt + "OpenLayers/Geometry/MultiPoint.js",
                pt + "OpenLayers/Geometry/Curve.js",
                pt + "OpenLayers/Geometry/LineString.js",
                pt + "OpenLayers/Geometry/LinearRing.js",
                pt + "OpenLayers/Geometry/Polygon.js",
                pt + "OpenLayers/Geometry/MultiLineString.js",
                pt + "OpenLayers/Geometry/MultiPolygon.js",
                pt + "OpenLayers/Renderer.js",
                pt + "OpenLayers/Renderer/Elements.js",
                pt + "OpenLayers/Renderer/SVG.js",
                pt + "OpenLayers/Renderer/Canvas.js",
                pt + "OpenLayers/Renderer/VML.js",
                pt + "OpenLayers/Layer/Vector.js",
                pt + "OpenLayers/Layer/PointGrid.js",
                pt + "OpenLayers/Layer/Vector/RootContainer.js",
                pt + "OpenLayers/Strategy.js",
                pt + "OpenLayers/Strategy/Filter.js",
                pt + "OpenLayers/Strategy/Fixed.js",
                pt + "OpenLayers/Strategy/Cluster.js",
                pt + "OpenLayers/Strategy/Paging.js",
                pt + "OpenLayers/Strategy/BBOX.js",
                pt + "OpenLayers/Strategy/Save.js",
                pt + "OpenLayers/Strategy/Refresh.js",
                pt + "OpenLayers/Filter.js",
                pt + "OpenLayers/Filter/FeatureId.js",
                pt + "OpenLayers/Filter/Logical.js",
                pt + "OpenLayers/Filter/Comparison.js",
                pt + "OpenLayers/Filter/Spatial.js",
                pt + "OpenLayers/Filter/Function.js",
                pt + "OpenLayers/Protocol.js",
                pt + "OpenLayers/Protocol/HTTP.js",
                pt + "OpenLayers/Protocol/WFS.js",
                pt + "OpenLayers/Protocol/WFS/v1.js",
                pt + "OpenLayers/Protocol/WFS/v1_0_0.js",
                pt + "OpenLayers/Protocol/WFS/v1_1_0.js",
                pt + "OpenLayers/Protocol/CSW.js",
                pt + "OpenLayers/Protocol/CSW/v2_0_2.js",
                pt + "OpenLayers/Protocol/Script.js",
                pt + "OpenLayers/Protocol/SOS.js",
                pt + "OpenLayers/Protocol/SOS/v1_0_0.js",
                pt + "OpenLayers/Layer/PointTrack.js",
                pt + "OpenLayers/Style.js",
                pt + "OpenLayers/Style2.js",
                pt + "OpenLayers/StyleMap.js",
                pt + "OpenLayers/Rule.js",
                pt + "OpenLayers/Format.js",
                pt + "OpenLayers/Format/QueryStringFilter.js",
                pt + "OpenLayers/Format/XML.js",
                pt + "OpenLayers/Format/XML/VersionedOGC.js",
                pt + "OpenLayers/Format/Context.js",
                pt + "OpenLayers/Format/ArcXML.js",
                pt + "OpenLayers/Format/ArcXML/Features.js",
                pt + "OpenLayers/Format/GML.js",
                pt + "OpenLayers/Format/GML/Base.js",
                pt + "OpenLayers/Format/GML/v2.js",
                pt + "OpenLayers/Format/GML/v3.js",
                pt + "OpenLayers/Format/Atom.js",
                pt + "OpenLayers/Format/EncodedPolyline.js",
                pt + "OpenLayers/Format/KML.js",
                pt + "OpenLayers/Format/GeoRSS.js",
                pt + "OpenLayers/Format/WFS.js",
                pt + "OpenLayers/Format/OWSCommon.js",
                pt + "OpenLayers/Format/OWSCommon/v1.js",
                pt + "OpenLayers/Format/OWSCommon/v1_0_0.js",
                pt + "OpenLayers/Format/OWSCommon/v1_1_0.js",
                pt + "OpenLayers/Format/WCSCapabilities.js",
                pt + "OpenLayers/Format/WCSCapabilities/v1.js",
                pt + "OpenLayers/Format/WCSCapabilities/v1_0_0.js",
                pt + "OpenLayers/Format/WCSCapabilities/v1_1_0.js",
                pt + "OpenLayers/Format/WFSCapabilities.js",
                pt + "OpenLayers/Format/WFSCapabilities/v1.js",
                pt + "OpenLayers/Format/WFSCapabilities/v1_0_0.js",
                pt + "OpenLayers/Format/WFSCapabilities/v1_1_0.js",
                pt + "OpenLayers/Format/WFSDescribeFeatureType.js",
                pt + "OpenLayers/Format/WMSDescribeLayer.js",
                pt + "OpenLayers/Format/WMSDescribeLayer/v1_1.js",
                pt + "OpenLayers/Format/WKT.js",
                pt + "OpenLayers/Format/CQL.js",
                pt + "OpenLayers/Format/OSM.js",
                pt + "OpenLayers/Format/GPX.js",
                pt + "OpenLayers/Format/Filter.js",
                pt + "OpenLayers/Format/Filter/v1.js",
                pt + "OpenLayers/Format/Filter/v1_0_0.js",
                pt + "OpenLayers/Format/Filter/v1_1_0.js",
                pt + "OpenLayers/Format/SLD.js",
                pt + "OpenLayers/Format/SLD/v1.js",
                pt + "OpenLayers/Format/SLD/v1_0_0.js",
                pt + "OpenLayers/Format/SLD/v1_0_0_GeoServer.js",
                pt + "OpenLayers/Format/OWSCommon.js",
                pt + "OpenLayers/Format/OWSCommon/v1.js",
                pt + "OpenLayers/Format/OWSCommon/v1_0_0.js",
                pt + "OpenLayers/Format/OWSCommon/v1_1_0.js",
                pt + "OpenLayers/Format/CSWGetDomain.js",
                pt + "OpenLayers/Format/CSWGetDomain/v2_0_2.js",
                pt + "OpenLayers/Format/CSWGetRecords.js",
                pt + "OpenLayers/Format/CSWGetRecords/v2_0_2.js",
                pt + "OpenLayers/Format/WFST.js",
                pt + "OpenLayers/Format/WFST/v1.js",
                pt + "OpenLayers/Format/WFST/v1_0_0.js",
                pt + "OpenLayers/Format/WFST/v1_1_0.js",
                pt + "OpenLayers/Format/Text.js",
                pt + "OpenLayers/Format/JSON.js",
                pt + "OpenLayers/Format/GeoJSON.js",
                pt + "OpenLayers/Format/WMC.js",
                pt + "OpenLayers/Format/WMC/v1.js",
                pt + "OpenLayers/Format/WMC/v1_0_0.js",
                pt + "OpenLayers/Format/WMC/v1_1_0.js",
                pt + "OpenLayers/Format/WCSGetCoverage.js",
                pt + "OpenLayers/Format/WMSCapabilities.js",
                pt + "OpenLayers/Format/WMSCapabilities/v1.js",
                pt + "OpenLayers/Format/WMSCapabilities/v1_1.js",
                pt + "OpenLayers/Format/WMSCapabilities/v1_1_0.js",
                pt + "OpenLayers/Format/WMSCapabilities/v1_1_1.js",
                pt + "OpenLayers/Format/WMSCapabilities/v1_3.js",
                pt + "OpenLayers/Format/WMSCapabilities/v1_3_0.js",
                pt + "OpenLayers/Format/WMSCapabilities/v1_1_1_WMSC.js",
                pt + "OpenLayers/Format/WMSGetFeatureInfo.js",
                pt + "OpenLayers/Format/SOSCapabilities.js",
                pt + "OpenLayers/Format/SOSCapabilities/v1_0_0.js",
                pt + "OpenLayers/Format/SOSGetFeatureOfInterest.js",
                pt + "OpenLayers/Format/SOSGetObservation.js",
                pt + "OpenLayers/Format/OWSContext.js",
                pt + "OpenLayers/Format/OWSContext/v0_3_1.js",
                pt + "OpenLayers/Format/WMTSCapabilities.js",
                pt + "OpenLayers/Format/WMTSCapabilities/v1_0_0.js",
                pt + "OpenLayers/Format/WPSCapabilities.js",
                pt + "OpenLayers/Format/WPSCapabilities/v1_0_0.js",
                pt + "OpenLayers/Format/WPSDescribeProcess.js",
                pt + "OpenLayers/Format/WPSExecute.js",
                pt + "OpenLayers/Format/XLS.js",
                pt + "OpenLayers/Format/XLS/v1.js",
                pt + "OpenLayers/Format/XLS/v1_1_0.js",
                pt + "OpenLayers/Format/OGCExceptionReport.js",
                pt + "OpenLayers/Control/GetFeature.js",
                pt + "OpenLayers/Control/NavToolbar.js",
                pt + "OpenLayers/Control/PanPanel.js",
                pt + "OpenLayers/Control/Pan.js",
                pt + "OpenLayers/Control/ZoomIn.js",
                pt + "OpenLayers/Control/ZoomOut.js",
                pt + "OpenLayers/Control/ZoomPanel.js",
                pt + "OpenLayers/Control/EditingToolbar.js",
                pt + "OpenLayers/Control/Geolocate.js",
                pt + "OpenLayers/Symbolizer.js",
                pt + "OpenLayers/Symbolizer/Point.js",
                pt + "OpenLayers/Symbolizer/Line.js",
                pt + "OpenLayers/Symbolizer/Polygon.js",
                pt + "OpenLayers/Symbolizer/Text.js",
                pt + "OpenLayers/Symbolizer/Raster.js",
                pt + "OpenLayers/Lang.js",
                pt + "OpenLayers/Lang/en.js",
                pt + "OpenLayers/Spherical.js",
                pt + "OpenLayers/TileManager.js",
                pt + "OpenLayers/WPSClient.js",
                pt + "OpenLayers/WPSProcess.js"
            ];
        }
    }
    //jsFiles.push(pt + "OpenLayers.js");
    NPMapLib.Utils.BaseUtils.addJSFiles(jsFiles);
})();
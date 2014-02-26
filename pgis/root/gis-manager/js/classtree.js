var zNodes = [
		{id:1, pId:0, name:"核心类", open:true},
		{id:101, pId:1, name:"Map", file:"classes/Map.html"},
		
		{id:2, pId:0, name:"基础类", open:false},
		{id:201, pId:2, name:"Point", file:"classes/Geometry/Point.html"},
		{id:202, pId:2, name:"Pixel", file:"classes/Geometry/Pixel.html"},
		{id:203, pId:2, name:"Extent", file:"classes/Geometry/Extent.html"},
		{id:204, pId:2, name:"Size", file:"classes/Geometry/Size.html"},

		{id:3, pId:0, name:"控件类", open:false},
		{id:301, pId:3, name:"Control", file:"classes/Control.html"},
		{id:302, pId:3, name:"CopyRightControl", file:"classes/Controls/CopyrightControl.html"},
		{id:303, pId:3, name:"NavigationControl", file:"classes/Controls/NavigationControl.html"},
		{id:304, pId:3, name:"OverviewControl", file:"classes/Controls/OverviewControl.html"},
		{id:305, pId:3, name:"ScaleControl", file:"classes/Controls/ScaleControl.html"},

		{id:4, pId:0, name:"覆盖物类", open:false},
		{id:401, pId:4, name:"Overlay", file:"classes/Overlay.html"},
		{id:402, pId:4, name:"Polyline", file:"classes/Geometry/Polyline.html"},
		{id:403, pId:4, name:"Polygon", file:"classes/Geometry/Polygon.html"},
		{id:404, pId:4, name:"Circle", file:"classes/Geometry/Circle.html"},
		{id:407, pId:4, name:"Icon", file:"classes/Symbols/Icon.html"},
		{id:408, pId:4, name:"InfoWindow", file:"classes/Symbols/InfoWindow.html"},
		{id:409, pId:4, name:"Label", file:"classes/Symbols/Label.html"},
		{id:410, pId:4, name:"Marker", file:"classes/Symbols/Marker.html"},
		{id:411, pId:4, name:"Animation", file:"classes/Symbols/Animation.html"},
	

		{id:5, pId:0, name:"工具类", open:false},
		{id:501, pId:5, name:"DrawingTool", file:"classes/Tools/DrawingTool.html"},
		{id:502, pId:5, name:"MeasureTool", file:"classes/Tools/MeasureTool.html"},
		

		{id:6, pId:0, name:"右键菜单类", open:false},
		{id:601, pId:6, name:"ContextMenu", file:"classes/ContextMenu.html"},
		{id:602, pId:6, name:"ContextMenuItem", file:"classes/ContextMenuItem.html"},

		{id:8, pId:0, name:"地图图层类", open:false},
		{id:801, pId:8, name:"Layer", file:"classes/Layer.html"},
		{id:802, pId:8, name:"ArcgisTileLayer", file:"classes/Layers/ArcgisTileLayer.html"},
		{id:803, pId:8, name:"EzMapOffLineLayer", file:"classes/Layers/EzMapOffLineLayer.html"},
		{id:804, pId:8, name:"EzMapTileLayer", file:"classes/Layers/EzMapTileLayer.html"},
		{id:805, pId:8, name:"GoogleMapTileLayer", file:"classes/Layers/GoogleMapTileLayer.html"},
		{id:806, pId:8, name:"GoogleOffLineLayer", file:"classes/Layers/GoogleOffLineLayer.html"},
		{id:807, pId:8, name:"WMSLayer", file:"classes/Layers/WMSLayer.html"},
		{id:807, pId:8, name:"VectorGMLLayer", file:"classes/Layers/VectorGMLLayer.html"},
		{id:807, pId:8, name:"OverlayLayer", file:"classes/Layers/OverlayLayer.html"}
	];
var setting = {
	view: {
		dblClickExpand: false,
		showLine: true,
		selectedMulti: false,
		expandSpeed: ""
	},
	data: {
		simpleData: {
			enable:true,
			idKey: "id",
			pIdKey: "pId",
			rootPId: ""
		}
	},
	callback: {
		beforeClick: function(treeId, treeNode) {
			var zTree = $.fn.zTree.getZTreeObj("ztree");
			if (treeNode.isParent) {
				zTree.expandNode(treeNode);
				return false;
			} else {
				$("#classIframe").attr("src",treeNode.file);
				return true;
			}
		}
	}
};
var classTree = $.fn.zTree.init($("#ztree"), setting, zNodes);
var defaultClickNode = classTree.getNodeByParam("id", 101, null);
if(defaultClickNode){
	classTree.selectNode(defaultClickNode);
	$("#classIframe").attr("src",defaultClickNode.file);
}
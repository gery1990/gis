var zNodes = [
		{id:1, pId:0, name:"地图展示", open:true},
		{id:101, pId:1, name:"ARCGIS在线地图", file:"demos/Layers/ArcgisTileLayer.html"},
		/*{id:102, pId:1, name:"PGIS在线地图", file:"demos/Layers/EzMapTileLayer.html" },*/
		{id:103, pId:1, name:"PGIS离线地图", file:"demos/Layers/EzMapOffLineLayer.html"},
		{id:104, pId:1, name:"谷歌在线地图", file:"demos/Layers/GoogleMapTileLayer.html"},
		{id:105, pId:1, name:"谷歌离线地图", file:"demos/Layers/GoogleOffLineLayer.html"},
		{id:106, pId:1, name:"NPGIS在线地图", file:"demos/Layers/WMSLayer.html"},

		{id:2, pId:0, name:"地图控件", open:false},
		{id:201, pId:2, name:"导航控件", file:"demos/Controls/Navigation.html"},
		{id:202, pId:2, name:"比例尺控件", file:"demos/Controls/Scale.html"},
		{id:203, pId:2, name:"鹰眼控件", file:"demos/Controls/Overview.html"},
		{id:204, pId:2, name:"版权控件", file:"demos/Controls/CopyRight.html"},

		{id:3, pId:0, name:"地图基本操作", open:false},
		{id:301, pId:3, name:"地图基本操作", file:"demos/Map/Map.html"},

		{id:4, pId:0, name:"地图信息", open:false},
		{id:401, pId:4, name:"获取地图当前中心点坐标", file:"demos/Services/GetCenter.html"},
		{id:402, pId:4, name:"获取地图当前缩放级别", file:"demos/Services/GetZoom.html"},
		{id:403, pId:4, name:"获取地图当前可视范围坐标", file:"demos/Services/GetExtent.html"},

		{id:5, pId:0, name:"自定义图层", open:false},
		{id:501, pId:5, name:"覆盖物图层", file:"demos/Layers/OverlayLayer.html"},
		{id:502, pId:5, name:"GML矢量图层", file:"demos/Layers/VectorGMLLayer.html"},

		{id:8, pId:0, name:"右键菜单", open:false},
		{id:801, pId:8, name:"右键菜单", file:"demos/ContextMenu/ContextMenu.html"},

		{id:9, pId:0, name:"覆盖物", open:false},
		{id:901, pId:9, name:"图像标注", file:"demos/Symbols/Marker.html"},
		{id:902, pId:9, name:"文字标注", file:"demos/Symbols/Label.html"},
		{id:903, pId:9, name:"动画标注", file:"demos/Symbols/Animation.html"},
		{id:904, pId:9, name:"线", file:"demos/Geometry/PolyLine.html"},
		{id:905, pId:9, name:"多边形", file:"demos/Geometry/Polygon.html"},
		{id:906, pId:9, name:"矩形", file:"demos/Geometry/Extent.html"},
		{id:907, pId:9, name:"圆形", file:"demos/Geometry/Circle.html"},
		{id:908, pId:9, name:"信息窗口", file:"demos/Symbols/InfoWindow.html"},

		{id:10, pId:0, name:"地图工具", open:false},
		{id:1001, pId:10, name:"测量工具", file:"demos/Tools/MeasureTool.html"},
		{id:1002, pId:10, name:"几何绘制工具", file:"demos/Tools/DrawingTool.html"},

		{id:11, pId:0, name:"事件", open:false},
		{id:1101, pId:11, name:"地图事件", file:"demos/Events/Map.html"},
		{id:1102, pId:11, name:"图像标注事件", file:"demos/Events/Marker.html"},
		{id:1103, pId:11, name:"文本标注事件", file:"demos/Events/Label.html"},
		{id:1104, pId:11, name:"线事件", file:"demos/Events/PolyLine.html"},
		{id:1105, pId:11, name:"多边形事件", file:"demos/Events/Polygon.html"},
		{id:1106, pId:11, name:"圆形事件", file:"demos/Events/Circle.html"}

		/*{id:12, pId:0, name:"加载本地数据", open:false}*/
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
				$("#demoIframe").attr("src",treeNode.file);
				return true;
			}
		}
	}
};
var demoTree = $.fn.zTree.init($("#ztree"), setting, zNodes);
var defaultClickNode = demoTree.getNodeByParam("id", 101, null);
if(defaultClickNode){
	demoTree.selectNode(defaultClickNode);
	$("#demoIframe").attr("src",defaultClickNode.file);
}
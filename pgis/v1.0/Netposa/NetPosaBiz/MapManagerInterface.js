var MapManagerInterface = new Class({
	mapManager: null, //地图管理
	isInit: false,    //是否初始化成功
	
	//初始化控件
	Implements: [Options],
	initialize: function(options) {
		try{
			this.setOptions(options);
		    if(this.mapManager === null){
		        this.mapManager = new EzMapManagerClass();
		        this.mapManager.init(options);
			}
			
			this.isInit = true;
		}
		catch(e){
			this.isInit = false;
		}
	},

	//获取地图控件
	getMap:function(){
		if(!this.isInit) return null;
		return this.mapManager.getMap();
	},

	//获取地图版本
	getMapVersion:function(){
		if(!this.isInit) return null;
		return this.mapManager.getMapVersion();
	},

	//获取初始配置项
	getOptions:function(){
		if(!this.isInit) return null;
		return this.mapManager.getOptions();
	},

	//获取对象图标
	getMarkImage: function(type) {
		if(!this.isInit) return null;
		return this.mapManager.getMarkImage(type);
	},

	//获取最大级别
	getMapMaxLevel:function(){
		if(!this.isInit) return 7;
		return this.mapManager.getMapMaxLevel();
	},

	//获取摄像机缩放级别
	getCameraLevel: function() {
		if(!this.isInit) return this.getMapMaxLevel();
		return this.mapManager.getCameraLevel();
	},

	//获取人员缩放级别
	getPersonLevel:function(){
		if(!this.isInit) return this.getMapMaxLevel();
		return this.mapManager.getPersonLevel();
	},

	//获取卡口缩放级别
	getRmpGateLevel:function(){
		if(!this.isInit) return this.getMapMaxLevel();
		return this.mapManager.getRmpGateLevel();
	},

	//设置摄像机缩放级别
	setCameraLevel: function(level) {
		if(!this.isInit) return;
		this.mapManager.setCameraLevel(level);
	},

	//设置人员缩放级别
	setPersonLevel:function(level){
		if(!this.isInit) return;
		this.mapManager.setPersonLevel(level);
	},

	//设置卡口缩放级别
	setRmpGateLevel:function(level){
		if(!this.isInit) return;
		this.mapManager.setRmpGateLevel(level);
	},

	//设置地图的可见性
	setMapVisible:function(visible){
		if(this.isInit == false) return;
		this.mapManager.setMapVisible(visible);
	}
});

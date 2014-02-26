var EzMapManagerClass = new Class({
	options: {
		element: null,
		scaleControl: true,
		navigateControl: true,
		switchServerButtons: false,
		overview: true,
		overviewW: 200,
		overviewH: 200,
		centerX: 117.08337,
		centerY: 36.65246,
		zoomLevel: 13,
		cameraLevel: 7,
		personLevel: 7,
		rmpgateLevel: 7,
		version:1.0
	},
	map: null,
	iconMap: {
		'1': 'Camera_Ptz_OnLine.png',
		'2': 'Camera_OnLine.png',
		'3': 'RmpGate.png',
		'4': 'Police.png'
	},
	
	init: function(options) {
		if(this.map === null){
			this.options.element = options.element;
			this.options.scaleControl = options.scaleControl;
			this.options.navigateControl = options.navigateControl;
			this.options.switchServerButtons = options.switchServerButtons;
			this.options.overview = options.overview;
			this.options.overviewW = options.overviewW;
			this.options.overviewH = options.overviewH;
			this.options.centerX = options.centerX;
			this.options.centerY = options.centerY;
			this.options.zoomLevel = options.zoomLevel;
			this.options.cameraLevel = options.cameraLevel;
			this.options.personLevel = options.personLevel;
			this.options.rmpgateLevel = options.rmpgateLevel;
		    this.options.element = $(this.options.element);
		    this.options.version = options.version;
		    this.map = new EzMap(this.options.element);
		    if(typeof(eval(this.map.initialize))=="function") 
            	this.map.initialize();

        }
	},
	
	getMap:function(){
		return this.map;
	},

	getMapVersion:function(){
		return this.options.version.toFloat();
	},

	getOptions:function(){
		return this.options;
	},

	getMarkImage: function(type) {
		return '/images/' + this.iconMap[type];
	},

	getMapMaxLevel:function(){
		if(this.map === null) return 1;
		return this.map.getMaxLevel();
	},

	getCameraLevel: function() {
		return this.options.cameraLevel.toInt();
	},

	getPersonLevel:function(){
		return this.options.personLevel.toInt();
	},

	getRmpGateLevel:function(){
		return this.options.rmpgateLevel.toInt();
	},

	setCameraLevel: function(level) {
		this.options.cameraLevel = level.toInt();
	},

	setPersonLevel:function(level){
		this.options.personLevel = level.toInt();
	},

	setRmpGateLevel:function(level){
		this.options.rmpgateLevel = level.toInt();
	},

	setMapVisible:function(visible){
		if (this.options.element === null) return;
		if(visible)
			this.options.element.style.display="";
		else
			this.options.element.style.display="none";
	}
});
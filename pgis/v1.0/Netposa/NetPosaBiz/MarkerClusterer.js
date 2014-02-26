//标记聚合器 类及其相关接口
var MarkerClusterer = new Class({
    markerModels:[],
    clusters:[],
    gridSize:100,
    minClusterCount:6,
    departClusterCount:20,
    bounds:null,
    clusterCount:200,
    preZoomLevel:-1,
    cameraVisible:true,
    rmpGateVisible:true,
    personVisible:true,

    initialize:function(){
        var cluster = null;
        for (var i = 0; i < this.clusterCount; i++) {
            cluster = new ClusterModel();
            this.clusters.push(cluster);
        }
    },

    //开始聚合
    startGather: function(markerModels, mapBounds, opt_noRedraw) {
        this.clear();
        this.preZoomLevel = _mapUtils.getZoomLevel();
        if (!markerModels && markerModels.length <= 0) 
            return;

        this.bounds = mapBounds;
        try {
            for (var i = 0; i < markerModels.length; i++) {
                this.pushMarkerTo(markerModels[i]);

                if(!this.isMarkerLayerVisible(markerModels[0]))
                    continue;
                this.addToClosestCluster(markerModels[i]);
            }

            for (var i = 0; i < this.clusters.length; i++) {
                this.clusters[i].createClusterMarker();
            }
        } catch (e) {
            alert("startGather: " + e.message);
        }
    },

    //重绘
    repaintClusterer:function(){
        if(this.preZoomLevel === _mapUtils.getZoomLevel()) 
            return;
        
        var flag = _mapUtils.getZoomLevel() > this.preZoomLevel;
        this.clearLastClusters(flag);   
        this.createClusters(flag);  
        this.preZoomLevel = _mapUtils.getZoomLevel();
    },

    pushMarkersTo:function(markerModels){
        if(markerModels === null || markerModels.length <=0)
            return;

        for (var i = 0; i < markerModels.length; i++) {
            this.pushMarkerTo(markerModels[i]);
        };
    },

    //收集单个标记
    pushMarkerTo:function(markerModel){
        this.markerModels.push(markerModel);
    },

    //创建聚合对象
    createClusters:function(flag){
        if (!this.markerModels && this.markerModels.length <= 0) 
            return;

        try {
            for (var i = 0, markerModel; markerModel = this.markerModels[i]; i++) {
                if(!flag && markerModel.visible)
                    continue;

                if(!this.isMarkerLayerVisible(markerModel))
                    continue;

                this.addToClosestCluster(markerModel);
            }

            for (var i = 0; i < this.clusters.length; i++) {
                this.clusters[i].createClusterMarker();
            }
        } catch (e) {
            alert("createClusters : " + e.message);
        }
    },

    isMarkerLayerVisible:function(markerModel){
        var flag = false;
        if(markerModel.type.toString() === '1' || markerModel.type.toString() === '2')
            flag = this.cameraVisible;
        else if(markerModel.type.toString() === '3')
            flag = this.rmpGateVisible;
        else if(markerModel.type.toString() === '4')
            flag = this.personVisible;
        return flag;
    },

    isLayerVisible:function(cluster){
        var flag = true;
        if(cluster.type.toString() === '1' || cluster.type.toString() === '2')
            flag = this.cameraVisible;
        else if(cluster.type.toString() === '3')
            flag = this.rmpGateVisible;
        else if(cluster.type.toString() === '4')
            flag = this.personVisible;
        return flag;
    },

    //将标记添加到临近聚集对象
    addToClosestCluster:function(markerModel){
        try {
            var clusterToAddTo = null;
            for (var i = 0, cluster; cluster = this.clusters[i]; i++) {
                if(!this.isLayerVisible(cluster))
                    continue;

                if(cluster.type.toString() !== markerModel.type.toString() && cluster.type.toString() !== '')
                    continue;

                var center = cluster.getCenter();
                if (center !== null) {
                    if (cluster.isMarkerInClusterBounds(markerModel)) {
                        clusterToAddTo = cluster;
                        break;
                    }
                }else{
                    clusterToAddTo = cluster;
                    break;
                }
            }

            if (clusterToAddTo !== null) {
                clusterToAddTo.addMarkerModel(markerModel);
            }else{
                markerModel.isInCluster = false;
                _markerModelManager.addMarkerModel(markerModel);
            }
        } catch (e) {
            alert("addToClosestCluster : " + e.message);
        }
    },

    clearLastClusters:function(flag){
       try{
            if(this.clusters && this.clusters.length > 0){
                for(var i = 0; i < this.clusters.length; i++){
                    this.clusters[i].remove(flag);
                }
            }

            this.removeMarkerNotInCluster();
        }catch(e){
            alert("clearLastClusters: " + e.message);
        } 
    },

    removeMarkerNotInCluster:function(){
        if (this.markerModels && this.markerModels.length > 0) {
            for (var i = 0, markerModel; markerModel = this.markerModels[i]; i++) {
                if(markerModel.isInCluster) 
                    continue;

                _markerModelManager.removeMarkerModel(markerModel);
            }
        }
    },

    removeMarkersFromMap:function(){
        if (this.markerModels && this.markerModels.length > 0) {
            for (var i = 0, markerModel; markerModel = this.markerModels[i]; i++) {
                // if(!markerModel.isInCluster) 
                //     continue;

                markerModel.isInCluster = false;
                _markerModelManager.removeMarkerModel(markerModel);
            }
        }
    },

    setMinClusterCount:function(count){
        this.minClusterCount = count;
    },

    setDepartClusterCount:function(count){
        this.departClusterCount = count;
    },

    setCameraVisible:function(visible, isSelected){
        if(this.cameraVisible === visible)
            return;

        this.cameraVisible = visible;
        if(GlobalConfig.layerControlMode && !isSelected){
            
            this.clearLastClusters(false); 

            var arrType = [];
            arrType.push('1');
            arrType.push('2');

            this.clearByTypes(arrType);

            var result = _markerModelManager.getMarksByTypes(arrType);
            if(result === null || result.length<=0) return;

            this.pushMarkersTo(result);
            this.createClusters(visible); 
        }else{
            this.clearLastClusters(visible);   
            //this.createClusters(visible); 
        }
    },

    setRmpGateVisible:function(visible, isSelected){
        if(this.rmpGateVisible === visible)
            return;

        this.rmpGateVisible = visible;
        if(GlobalConfig.layerControlMode && !isSelected){

            this.clearLastClusters(false);

            this.clearByType('3');

            var result = _markerModelManager.getMarksByType('3');
            if(result === null || result.length<=0) return;
            this.pushMarkersTo(result);
            this.createClusters(visible);  
        }else{
            this.clearLastClusters(visible);   
            //this.createClusters(visible);    
        }
    },

    setPersonVisible:function(visible, isSelected){
        if(this.personVisible === visible)
            return;
        this.personVisible = visible;

        if(GlobalConfig.layerControlMode && !isSelected){

            this.clearLastClusters(false);

            this.clearByType('4');

            var result = _markerModelManager.getMarksByType('4');
            if(result === null || result.length<=0) return;

            this.pushMarkersTo(result);
            this.createClusters(visible); 
        }else{
            this.clearLastClusters(visible);   
            //this.createClusters(visible);
        }
    },

    clear:function(){
        this.clearMarkers();
    },

    clearByType:function(type){
        if(this.markerModels.length <=0)
            return;

        for (var i = 0, markerModel; markerModel = this.markerModels[i]; i++) {
            if(markerModel.type.toString() === type){
                markerModel.isInCluster = false;
                _markerModelManager.removeMarkerModel(markerModel);
                this.markerModels.splice(i, 1);
            }
        };
    },

    clearByTypes:function(arrType){
        if(this.markerModels.length <=0)
            return;

        for (var i = 0, markerModel; markerModel = this.markerModels[i]; i++) {
            for (var j = 0; j < arrType.length; j++) {
                if(markerModel.type.toString() === arrType[j]){
                    markerModel.isInCluster = false;
    		        if(markerModel.visible){
                        _markerModelManager.removeMarkerModel(markerModel);
                    }
                    this.markerModels.splice(i, 1);
                    break;
                }
            };
        };
    },

    clearMarkers: function() {
        try{
            this.clearLastClusters(false);
            this.removeMarkersFromMap();
            this.markerModels.splice(0, this.markerModels.length);
        }catch(e){
            alert("clearMarkers error: " + e.message);
        }
    }
});

//..........................................
//聚合对象类
var ClusterModel = new Class({
    center: null,
    markerModels:[],
    clusterMarker:null,
    clusterMarkerTitle: null,
    type:'',
    remark:'',
    IMAGE_PATH:'images/cluster/',
    FONT_SIZE:12,
    visible:true,
    minX:0,
    minY:0,
    maxX:0,
    maxY:0,

    //创建聚合标记
    createClusterMarker:function(){
        //没有数据，则隐藏
        if(this.markerModels.length <=0){
            this.display(false);
            return;
        }
        if(this.markerModels.length <= _markerClusterer.minClusterCount || _mapUtils.getZoomLevel() >= _mapManager.getMapMaxLevel())
        {
            for (var i = 0; i < this.markerModels.length; i++) {
                this.markerModels[i].isInCluster = true;
                _markerModelManager.addMarkerModel(this.markerModels[i]);
            }

            return;
        }

        //已创建，则更新
        if(this.clusterMarker !== null){
            this.updateClusterMarker();
            this.display(true);
            return;
        }

        try{
            var image = this.getImgUrl();
            var size = this.getImgSize();
            var fontColor = this.getFontColor();

            var text = this.markerModels.length.toString();
            var icon = null;
            var title = null;
            icon = _mapUtils.createMyIcon(image, size, size, -size / 2, -size / 2);
            title = _mapUtils.createMyTitle(text, '宋体', this.FONT_SIZE, "center", 'black', null, null, null, -this.FONT_SIZE/2, -text.length * this.FONT_SIZE/2, true);
            this.clusterMarker = _mapUtils.createMyMarker("cluster" + _markerClusterer.clusters.length.toString(), icon, title, this.center);
            _mapUtils.addOverlay(this.clusterMarker);
            this.addClusterListeners(this.clusterMarker);
        }catch(e){
            alert("createClusterMarker: " + e.message);
        }
    },

    //更新
    updateClusterMarker: function() {
        var text = this.markerModels.length.toString();
        this.clusterMarker.div.childNodes[0].src = this.getImgUrl();
        this.clusterMarker.div.childNodes[1].innerHTML = text;
        this.clusterMarker.div.childNodes[1].style.width = text.length * this.FONT_SIZE;
        this.clusterMarker.div.childNodes[1].style.left = -text.length * this.FONT_SIZE/2;
        _mapUtils.setOverlayPoint(this.clusterMarker, this.center);
    },

    //获取标记图标
    getImgUrl:function(){
        var preName = 'Cluster_Camera_';
        this.type = this.markerModels[0].type;
        if(this.type.toString() === '3'){
            preName = 'Cluster_RmpGate_';
        }else if(this.type.toString() === '4'){
            preName = "Cluster_Person_"
        }

        var image = this.IMAGE_PATH + preName + "0.png";
        return image;
    },

    //获取标记图标大小
    getImgSize:function(){
        var size = 52;
        return size;
    },

    //获取文本颜色
    getFontColor:function(){
        var fontColor = 'red'; 
        return fontColor;
    },

    //添加事件
    addClusterListeners:function(marker){
        try{
            if(marker === null) return;

            marker.addListener('dblclick', function() {
                 this.departMarkers();
            }.bind(this));
        }
        catch(e){
            alert(e.message);
        }
    },

    //添加对象进聚合对象
    addMarkerModel:function(markerModel){
        try{
            if(this.isMarkerInCluster(markerModel))
                return;
            
            markerModel.isInCluster = true;
            this.markerModels.push(markerModel);

            if(this.center === null)
                this.center = _mapUtils.getOverlayPoint(markerModel.marker);
            
            this.reCalculateBounds();
        }
        catch(e){
            alert("addMarkerModel: " + e.message);
        }
    },

    //判断对象是否已经存在于该聚合对象内
    isMarkerInCluster:function(markerModel){
        for (var i = 0; i < this.markerModels.length; i++) {
            if(this.markerModels[i].getKey() === markerModel.getKey())
                return true;
        }

        return false;
    },

    //判断对象是否属于该聚合对象范围内
    isMarkerInClusterBounds:function(markerModel){
        if(this.markerModels.length <=0) 
            return true;

        if (markerModel.x >= this.minX && markerModel.x <= this.maxX && markerModel.y >= this.minY && markerModel.y <= this.maxY){
            return true
        }
        else{
            return false;
        }
    },

    //计算范围
    reCalculateBounds:function(){
        var size = this.getImgSize();
        var ptWS = _mapUtils.pointOffset(this.center, size, -size);
        var ptNE = _mapUtils.pointOffset(this.center, -size, size);

        this.minX = ptWS.x;
        this.minY = ptWS.y;
        this.maxX = ptNE.x;
        this.maxY = ptNE.y;
    },

    //显示/隐藏对象
    display: function(visible) {
        if (this.clusterMarker === null || this.visible === visible) 
            return;
        this.clusterMarker.div.style.display = visible ? "" : "none";
        this.visible = visible;
    },

    //分散
    departMarkers:function(){
        if(this.markerModels.length > _markerClusterer.departClusterCount)
            return;

        for (var i = 0; i < this.markerModels.length; i++) {
            this.markerModels[i].isInCluster = false;
            _markerModelManager.addMarkerModel(this.markerModels[i]);
        }

        this.display(false);
    },

    //移除该聚合对象
    remove:function(flag){
        try {
            if (this.center === null) return;

            for (var i = 0; i < this.markerModels.length; i++) {
                this.markerModels[i].isInCluster = false;
                _markerModelManager.removeMarkerModel(this.markerModels[i]);
            }
            this.markerModels.splice(0, this.markerModels.length);
            this.center = null;
            this.minX = this.minY = this.maxX = this.maxY = 0;
            this.display(false);
            this.type = '';
        }catch (e) {
            alert("Cluster remove: " + e.message);
        }
    },

    getCenter:function(){
        return this.center;
    }
});

/*!
 * 适配器工厂类
*/
NPMapLib.Adapter.AdapterFactory = (function() {

    var factory = {};

    //地图适配器集合
    var _mapAdapters = {};
    var _mapIdAdapter = {};

    //创建地图适配器
    factory.createMapAdapter = function(container, opts, mapId) {
        if (typeof mapId != 'number' || mapId <= 0) {
            return;
        }
        if (!container || !container.id || _mapAdapters[container.id]) {
            return null;
        }

        var mapAdapter;
        //arcgis
        if (NPMapLib.USING_ADAPTER === NPMapLib.ADAPTER_TYPE_ARCGIS) {
            mapAdapter = new NPMapLib.Adapter.Arcgis.MapAdapter(container, opts);
        } //ezMap
        else if (NPMapLib.USING_ADAPTER === NPMapLib.ADAPTER_TYPE_EZMAP) {
            mapAdapter = new NPMapLib.Adapter.EzMap.MapAdapter(container, opts);
        } //openlayers
        else if (NPMapLib.USING_ADAPTER === NPMapLib.ADAPTER_TYPE_OPENLAYERS) {
            mapAdapter = new NPMapLib.Adapter.OpenLayers.MapAdapter(container, opts);
        }

        if (mapAdapter && mapAdapter !== null) {
            //id = NPMapLib.Managers.MapManager.getMaxId();
            _mapAdapters[container.id] = mapAdapter;
            _mapIdAdapter[mapId] = mapAdapter;
        }
        //alert("create succeed");
        return mapAdapter;
    };

    //获取地图适配器
    factory.getMapAdapter = function(mapId) {
        return _mapIdAdapter[mapId];
    };

    return factory;
})();
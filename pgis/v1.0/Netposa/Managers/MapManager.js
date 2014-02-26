/*!
* 地图管理类
*/
NPMapLib.Managers.MapManager = (function () {
    var factory = {};

    var _MAP_ID = 0;
    var _maps = {};

    //获取控件ID
    factory.getMaxId = function () {
        return (++_MAP_ID);
    };

    //添加
    factory.addMap = function (map) {
        if (!NPMapLib.Utils.BaseUtils.isTypeRight(map, NPMapLib.Map))
            return;

        if (_maps[map.id])
            return;

        if (map.id <= 0)
            map.id = this.getMaxId();
        _maps[map.id] = map;
    };

    //移除
    factory.removeMap = function (id) {
        if (_maps[id])
            delete _maps[id];
    };

    //移除所有
    factory.removeAllMaps = function () {
        for (var key in _maps) {
            delete _maps[key];
        }
    };

    //获取某一地图
    factory.getMap = function (id) {
        return _maps[id];
    };

    //获取所有地图
    factory.getAllMaps = function () {
        return _maps;
    };

    //只接口只适用于CS方调用
    factory.callFromCS = function (jsonModel, method) {
        try {
            if (NPMapLib.Utils.BaseUtils.isTypeRight(jsonModel, "string")) {
                jsonModel = eval('(' + jsonModel + ')');
            }
            var map;
            if (!_maps[jsonModel.mapId]) {
                var mapContainer = document.getElementById("mapId");
                map = new NPMapLib.Map(mapContainer, {
                    minZoom: 0,
                    maxZoom: 10
                }, jsonModel.mapId);
            } else {
                map = this.getMap(jsonModel.mapId);
            }
            var args = NPMapLib.CsObjCaster._castArgs(arguments);
            switch (method) {
                case "addLayer":
                    {
                        if (args.length <= 0)
                            return;
                        var l = NPMapLib.Managers.LayerManager.getLayer(args[0].id);
                        if (!l)
                            l = NPMapLib.CsObjCaster._castLayer(args[0]);
                        if (l) {
                            map.addLayer(l);
                        }
                        return;
                    }
                case "removeLayer":
                    {
                        if (args.length <= 0)
                            return;
                        var l = NPMapLib.Managers.LayerManager.getLayer(args[0].id);
                        if (l) {
                            map.removeLayer(l);
                        }
                        return;
                    }
                case "addControl":
                    {
                        if (args.length <= 0)
                            return;
                        var c = NPMapLib.Managers.ControlManager.getControl(args[0].id);
                        if (!c)
                            c = NPMapLib.CsObjCaster._castControl(args[0]);
                        if (c) {
                            map.addControl(c);
                        }
                        return;
                    }
                case "removeControl":
                    {
                        if (args.length <= 0)
                            return;
                        var c = NPMapLib.Managers.ControlManager.getControl(args[0].id);
                        if (c) {
                            map.removeControl(c);
                        }
                        return;
                    }
                case "addOverlay":
                    {
                        if (args.length <= 0)
                            return;
                        var o = NPMapLib.Managers.OverlayManager.getOverlay(args[0].id);
                        if (!o)
                            o = NPMapLib.CsObjCaster._castOverlay(args[0]);
                        if (o) {
                            map.addOverlay(o);
                        }
                        return;
                    }
                case "removeOverlay":
                    {
                        if (args.length <= 0)
                            return;
                        var o = NPMapLib.Managers.OverlayManager.getOverlay(args[0].id);
                        if (o) {
                            map.removeOverlay(o);
                        }
                        return;
                    }
                case "removeOverlays":
                    {
                        if (args.length > 0 && args[0] && args[0].length > 0) {
                            var count = args[0].length;
                            for (var i = 0; i < count; ++i) {
                                var o = NPMapLib.Managers.OverlayManager.getOverlay(args[0][i].id);
                                if (o) {
                                    map.removeOverlay(o);
                                }
                            }
                        }
                        return;
                    }
                case "addEventListener":
                    {
                        var evt = args[0], cbf = args[1];
                        //to do
                        map.addEventListener(evt, function (p) {
                            if (evt === 'click') {
                                window.external.OnMapClickCallBack(p.lon, p.lat, 1);
                            }
                            else if (evt === 'dblclick') {
                                window.external.OnMapDbClickCallBack(p.lon, p.lat, 1);
                            }
                        });
                        return;
                    }
                case "pointToPixel":
                    {
                        if (args.length <= 0)
                            return;
                        var t = map.pointToPixel(new NPMapLib.Geometry.Point(args[0].Lon, args[0].Lat));//NPMapLib.CsObjCaster._casterPoint(args[0]));
                        return NPMapLib.Utils.BaseUtils.JsonToStr(t);
                    }
                case "pixelToPoint":
                    {
                        if (args.length <= 0)
                            return;
                        var t = map.pixelToPoint(NPMapLib.CsObjCaster._castPixel(args[0]));
                        return NPMapLib.Utils.BaseUtils.JsonToStr(t);
                    }
                    /*
                case "addAnimation":
                    {
                        if (args.length <= 0)
                            return;
                        var a = NPMapLib.Managers.OtherManager._createAnimation(args[0]);
                        if (a) {
                            map.addOverlay(a._overlay);
                            NPMapLib.Managers.OtherManager._addAnimation(a);
                        }
                        return;
                    }
                case "removeAnimation":
                    {
                        if (args.length <= 0)
                            return;
                        var a = NPMapLib.Managers.OtherManager._getAnimation(args[0].id);
                        if (a) {
                            map.removeOverlay(a._overlay);
                        }
                        return;
                    }
                    */
                default:
                    break;
            }
            if (method && typeof map[method] == 'function') {
                var t = map[method].apply(map, args);
                if (typeof t === 'number' || typeof t === 'string') {
                    return t;
                }
                else {
                    return NPMapLib.Utils.BaseUtils.JsonToStr(t);
                }
            }
        } catch (e) {
            alert("map method err_:" + e.message);
        }
    };

    return factory;
})();
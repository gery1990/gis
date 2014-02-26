/*!
* 图层管理类
*/
NPMapLib.Managers.LayerManager = (function () {
    var factory = {};

    var _LAYER_ID = 0;

    var _layers = {};

    //获取ID
    factory._getMaxId = function () {
        return (++_LAYER_ID);
    };

    //添加
    factory.addLayer = function (layer) {
        if (!NPMapLib.Utils.BaseUtils.isTypeRight(layer, NPMapLib.Layer))
            return;

        if (_layers[layer.id])
            return;

        if (layer.id <= 0)
            layer.id = this._getMaxId();
        _layers[layer.id] = layer;
    };

    //移除
    factory.removeLayer = function (id) {
        if (_layers[id])
            delete _layers[id];
    };

    //移除所有
    factory.removeAllLayers = function () {
        for (var key in _layers) {
            delete _layers[key];
        }
    };

    //获取图层
    factory.getLayer = function (id) {
        return _layers[id];
    };

    //获取所有图层
    factory.getAllLayers = function () {
        return _layers;
    };

    //只接口只适用于CS方调用
    factory.callFromCS = function (jsonModel, method, params) {
        if (NPMapLib.Utils.BaseUtils.isTypeRight(jsonModel, "string"))
            jsonModel = eval('(' + jsonModel + ')');

        if (!_layers[jsonModel.id]) {
            var temp = NPMapLib.CsObjCaster ._castLayer(jsonModel);
            if (temp == null) {
                return;
            }
            _layers[jsonModel.id] = temp;
        }
        var layer = _layers[jsonModel.id];
        var args = NPMapLib.CsObjCaster ._castArgs(arguments);

        switch (method) {
            case "addOverlay":
                {
                    if (args.length <= 0)
                        return;
                    var o = NPMapLib.CsObjCaster ._castOverlay(args[0]);
                    if (o) {
                        layer.addOverlay(o);
                    }
                    return;
                }
            case "addOverlays":
                {
                    return;
                }
            default:
                {
                    if (layer && method && typeof layer[method] === 'function') {
                        var t = layer[method].apply(layer, args);
                        if (t) {
                            if (typeof t === 'number' || typeof t === 'string') {
                                return t;
                            }
                            else {
                                return NPMapLib.Utils.BaseUtils.JsonToStr(t);
                            }
                        }
                    }
                    return;
                }
        }
    };

    return factory;
})();
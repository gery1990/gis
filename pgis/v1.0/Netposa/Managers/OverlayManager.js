/*!
* 覆盖物管理类
*/
NPMapLib.Managers.OverlayManager = (function () {
    var factory = {};

    var _OVERLAY_ID = 0;

    var _overlays = {};

    //获取ID
    factory._getMaxId = function () {
        return (++_OVERLAY_ID);
    };
    factory.GetNextId = function () {
        return this._getMaxId();
    };
    //添加
    factory.addOverlay = function (overlay) {
        if (!NPMapLib.Utils.BaseUtils.isTypeRight(overlay, NPMapLib.Overlay))
            return;

        if (_overlays[overlay.id])
            return;

        if (overlay.id <= 0)
            overlay.id = this._getMaxId();

        _overlays[overlay.id] = overlay;
    };

    //移除
    factory.removeOverlay = function (id) {
        if (_overlays[id])
            delete _overlays[id];
    };

    //移除所有覆盖物
    factory.removeAllOverlays = function () {
        for (var key in _overlays) {
            delete _overlays[key];
        }
    };

    //获取覆盖物对象
    factory.getOverlay = function (id) {
        return _overlays[id];
    };

    //获取所有覆盖物对象
    factory.getAllOverlays = function () {
        return _overlays;
    };

    //只接口只适用于CS方调用
    factory.callFromCS = function (obj, method, params) {
        try {
            if (NPMapLib.Utils.BaseUtils.isTypeRight(obj, "string")) {
                obj = eval('(' + obj + ')');
            }
            if (!_overlays[obj.id]) {
                var o = NPMapLib.CsObjCaster._castOverlay(obj);
                _overlays[obj.id] = o;
            }
            var overlay = _overlays[obj.id];

            var args = NPMapLib.CsObjCaster._castArgs(arguments);
            switch (method) {
                case "addEventListener":
                    {
                        return;
                    }
                default:
                    {
                        if (method && overlay && typeof overlay[method] === 'function') {
                            return overlay[method].apply(overlay, args);
                        }
                        return;
                    }
            }
        } catch (e) {
            alert("overlay method err_:" + e.message);
        }
    };

    return factory;
})();
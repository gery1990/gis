/*!
* 控件管理类
*/
NPMapLib.Managers.ControlManager = (function() {
    var factory = {};

    var _CONTROL_ID = 0;

    var _controls = {};

    //获取控件ID
    factory._getMaxId = function() {
        return (++_CONTROL_ID);
    };

    //添加
    factory.addControl = function(control) {
        if (!NPMapLib.Utils.BaseUtils.isTypeRight(control, NPMapLib.Control))
            return;

        if (_controls[control.id])
            return;

        if (control.id <= 0)
            control.id = this._getMaxId();
        _controls[control.id] = control;
    };

    //移除
    factory.removeControl = function(id) {
        if (_controls[id])
            delete _controls[id];
    };

    //移除所有
    factory.removeAllControls = function() {
        for (var key in _controls) {
            delete _controls[key];
        }
    };

    //获取
    factory.getControl = function(id) {
        return _controls[id];
    };

    //获取所有
    factory.getAllControls = function() {
        return _controls;
    };


    //只接口只适用于CS方调用
    factory.callFromCS = function(jsonModel, method, params) {
        try {
            if (NPMapLib.Utils.BaseUtils.isTypeRight(jsonModel, "string")) {
                jsonModel = eval('(' + jsonModel + ')');
            }
            if (!_controls[jsonModel.id]) {
                var c = NPMapLib.CsObjCaster._castControl(jsonModel);
                if (!control) {
                    return;
                }
                _controls[jsonModel.id] = c;
            }
            var control = _controls[jsonModel.id];
            //            switch (method) {
            //                case "setOffset":
            //                    control.setOffset(
            //                    break;
            //                default:
            //                    break;
            //            }
            if (typeof control[method] === 'function') {
                control[method].call(control, params);
            }
        }
        catch (e) {
            alert("ctl method err" + e.toString()); 
        }
    };

    return factory;
})();
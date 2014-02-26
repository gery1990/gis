
/*!
* 其他
*/
NPMapLib.Managers.OtherManager = (function() {
    var factory = {};

    var drawObjs = {};
    factory.drawCallFromCS = function(_json, method, param) {
        try {
            if (NPMapLib.Utils.BaseUtils.isTypeRight(_json, "string")) {
                _json = eval('(' + _json + ')');
            }
            if (NPMapLib.Utils.BaseUtils.isTypeRight(param, "string")) {
                param = eval('(' + param + ')');
            }
            if (!drawObjs[_json.id]) {
                var o = NPMapLib.CsObjCaster._castDrawTool(_json);
                drawObjs[_json.id] = o;
            }
            var tool = drawObjs[_json.id];
            if (method === 'setMode') {
                var cbf = function() { };
                if (arguments.length >= 4) {
                    //cbf = eval.call(window.external, arguments[3].toString());
                }
                tool.setMode(param, function(overlay) {
                    //cbf.call(window.external, "drawComplete", _json.id, "overlay");
                    window.external.OnDrawComlpeted("drawComplete", _json.id, overlay);
                });
                return;
            }
            if (method && tool && typeof tool[method] === 'function') {
                return tool[method].call(tool, param);
            }
            if (method === "delete") {
                if (drawObjs[_json.id]) {
                    delete drawObjs[_json.id];
                }
            }
        } catch (e) {
            alert("draw method err_:" + e.message);

        }
    };

    var measureObjs = {};
    //测量
    factory.measureCallFromCS = function(_json, method, params) {
        try {
            if (NPMapLib.Utils.BaseUtils.isTypeRight(_json, "string")) {
                _json = eval('(' + _json + ')');
            }
            if (NPMapLib.Utils.BaseUtils.isTypeRight(params, "string")) {
                params = eval('(' + params + ')');
            }
            if (!measureObjs[_json.id]) {
                var o = NPMapLib.CsObjCaster._castMesaureTool(_json);
                measureObjs[_json.id] = o;
            }
            var tool = measureObjs[_json.id];

            if (method && tool && typeof tool[method] === 'function') {
                return tool[method].call(tool, params);
            }
            if (method === "delete") {
                if (measureObjs[_json.id]) {
                    delete measureObjs[_json.id];
                }
            }
        } catch (e) {
            alert("measure method err_:" + e.message);
        }
    };

    var infoWinObjs = {};
    factory.infoWinCallFromCS = function(_json, method) {
        try {
            if (NPMapLib.Utils.BaseUtils.isTypeRight(_json, "string")) {
                _json = eval('(' + _json + ')');
            }
            if (method === "close") {
                if (infoWinObjs[_json.id]) {
                    infoWinObjs[_json.id].close();
                    delete infoWinObjs[_json.id];
                }
                return;
            }
            if (!infoWinObjs[_json.id]) {
                var o = NPMapLib.CsObjCaster._castInfoWin(_json);
                infoWinObjs[_json.id] = o;
            }
            var win = infoWinObjs[_json.id];
            var args = NPMapLib.CsObjCaster._castArgs(arguments);

            if (method && win && typeof win[method] === 'function') {
                return win[method].apply(win, args);
            }
        } catch (e) {
            alert("infowin method err_:" + e.message);
        }
    };

    var _icons = {};
    factory._getIcon = function(id) {
        return _icons[id];
    };
    factory._addIcon = function(icon) {
        if (!NPMapLib.Utils.BaseUtils.isTypeRight(icon, NPMapLib.Symbols.Icon)) {
            return;
        }
        if (_icons[icon.id])
            return;
        _icons[icon.id] = icon;
    };
    factory.iconCallFromCS = function(_json, method, p) {
        try {
            if (NPMapLib.Utils.BaseUtils.isTypeRight(_json, "string")) {
                _json = eval('(' + _json + ')');
            }
            if (!_icons[_json.id]) {
                var icon = NPMapLib.CsObjCaster._castIcon(_json);
                _icons[_json.id] = icon;
            }
            var a = _icons[_json.id];
            var arg;
            if (method === "setImageSize") {
                arg = NPMapLib.CsObjCaster._castSize(p);
            }
            else if (method === "setAnchor") {
                arg = NPMapLib.CsObjCaster._castOffset(p);
            }
            else {
                arg = p;
            }
            if (method && a && typeof a[method] === 'function') {
                return a[method].apply(a, arg);
            }
        } catch (e) {
            alert("icon method err_:" + e.message);
        }
    };

    var _animations = {};
    factory._getAnimation = function(id) {
        if (_animations[id]) {
            return _animations[id];
        }
    };
    factory._addAnimation = function(animation) {
        _animations.id = animation;
    };
    factory.animationCallFromCS = function(_json, method) {
        try {
            if (NPMapLib.Utils.BaseUtils.isTypeRight(_json, "string")) {
                _json = eval('(' + _json + ')');
            }
            if (!_animations[_json.id]) {
                var o = NPMapLib.CsObjCaster._castAnimation(_json);
                _animations[_json.id] = o;
            }

            var a = _animations[_json.id];
            var args = NPMapLib.CsObjCaster._castArgs(arguments);

            if (method === 'setPath' && args.length > 0) {
                var p = NPMapLib.Managers.OverlayManager.getOverlay(args[0].id);
                if (!p) {
                    p = NPMapLib.CsObjCaster._castOverlay(args[0]);
                    NPMapLib.Managers.OverlayManager.addOverlay(p);
                }
                a.setPath(p);
                return;
            }
            if (method && a && typeof a[method] === 'function') {
                return a[method].apply(a, args);
            }
        } catch (e) {
            alert("animation method err_:" + e.message);
        }
    };

    var _labels = {};
    factory._getLabel = function(id) {
        return _labels[id];
    };
    factory._addLabel = function(label) {
        if (!NPMapLib.Utils.BaseUtils.isTypeRight(label, NPMapLib.Symbols.Label)) {
            return;
        }
        if (_labels[label.id])
            return;
        _labels[label.id] = label;
    };
    factory.labelCallFromCS = function(_json, method, p) {
        try {
            if (NPMapLib.Utils.BaseUtils.isTypeRight(_json, "string")) {
                _json = eval('(' + _json + ')');
            }
            if (!_labels[_json.id]) {
                var o = NPMapLib.CsObjCaster._castLabel(_json);
                _labels[_json.id] = o;
            }
            var a = _labels[_json.id];
            var args = NPMapLib.CsObjCaster._castArgs(arguments);

            if (method && a && typeof a[method] === 'function') {
                return a[method].apply(a, args);
            }
        } catch (e) {
            alert("label method err_:" + e.message);
        }
    };
    return factory;
})();
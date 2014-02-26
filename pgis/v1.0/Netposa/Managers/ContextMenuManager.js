/*!
* 右键菜单管理类
*/
NPMapLib.Managers.ContextMenuManager = (function() {
    var factory = {};

    var _CONTEXTMENU_ID = 0;

    var _contextMenus = {};

    //获取最大ID
    factory._getMaxId = function() {
        return (++_CONTEXTMENU_ID);
    };

    //添加
    factory.addContextMenu = function(menu) {
        if (!NPMapLib.Utils.BaseUtils.isTypeRight(menu, NPMapLib.ContextMenu))
            return;

        if(_contextMenus[menu.id])
            return;

        if(menu.id <=0)
            menu.id = this._getMaxId();
        _contextMenus[menu.id] = layer;
    };

    //移除
    factory.removeContextMenu = function(id) {
        if(_layers[id])
            delete _layers[id];
    };

    //移除所有
    factory.removeAllContextMenus = function() {
        for (var key in _contextMenus) {
            delete _contextMenus[key];
        }
    };

    //获取
    factory.getContextMenu = function(id) {
        return _contextMenus[id];
    };

    //获取所有
    factory.getAllContextMenus = function() {
        return _contextMenus;
    };

    //只接口只适用于CS方调用
    factory.callFromCS = function(jsonModel, method, params){
        
    };

    return factory;
})();
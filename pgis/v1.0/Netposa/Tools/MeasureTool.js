
/*!
 *NPMapLib.Controls.MeasureTool
*/
(function () {
    var e = NPMapLib.Controls.MeasureToolOptions = {
        lengthUnit: NPMapLib.MAP_UNITS_METERS,				//默认长度单位是米
        areaUnit: NPMapLib.MAP_UNITS_SQUARE_KILOMETERS,		//默认面积单位为平方千米
        mode: NPMapLib.MEASURE_MODE_DISTANCE				//默认测量模式为测量长度
    };

})();

/*
 *测量工具
 */
(function () {
    var e = NPMapLib.Tools.MeasureTool = function (mapId, opts) {
        this._lengthUnit = NPMapLib.MAP_UNITS_METERS;			//默认长度单位是米
        this._areaUnit = NPMapLib.MAP_UNITS_SQUARE_KILOMETERS;	//默认面积单位为平方千米
        this._mode = NPMapLib.MEASURE_MODE_DISTANCE;				//默认测量模式为测量长度
        this._isStartUp = false;

        this.mapId = mapId;

        if (!opts)
            return;

        if (opts.lengthUnit)
            this._lengthUnit = opts.lengthUnit;

        if (opts.areaUnit)
            this._areaUnit = opts.areaUnit;
    };

    //获取长度单位
    e.prototype.getLengthUnit = function () {
        return this._lengthUnit;
    };

    //设置长度单位
    e.prototype.setLengthUnit = function (unit) {
        this._lengthUnit = unit;
    };

    //获取面积单位
    e.prototype.getAreaUnit = function () {
        return this._areaUnit;
    };

    //设置面积单位
    e.prototype.setAreaUnit = function (unit) {
        this._areaUnit = unit;
    };

    //设置测量模式
    e.prototype.setMode = function (mode) {
        if (mode === NPMapLib.MEASURE_MODE_DISTANCE ||
		   mode === NPMapLib.MEASURE_MODE_AREA ||
		   mode === NPMapLib.MEASURE_MODE_LOCATION)
            this._mode = mode;
        if (!this._isStartUp)
            return;
        var mapAdapter = NPMapLib.Adapter.AdapterFactory.getMapAdapter(this.mapId);
        if (mapAdapter)
            mapAdapter.measure(this);
    };

    //获取测量模式
    e.prototype.getMode = function () {
        return this._mode;
    };

    //启动
    e.prototype.startUp = function () {
        
        this._isStartUp = true;
    };

    //取消
    e.prototype.cancel = function () {
        if (!this._isStartUp)
            return;

        var mapAdapter = NPMapLib.Adapter.AdapterFactory.getMapAdapter(this.mapId);
        if (mapAdapter)
            mapAdapter.pan();

        this._isStartUp = false;
    };
})();
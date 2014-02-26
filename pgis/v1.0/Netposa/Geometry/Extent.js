/*!
* 矩形范围
*/
(function() {
    var e = NPMapLib.Geometry.Extent = function(a, b, c, d) {
        this.sw;
        this.ne;
        if (arguments.length === 2) {
            if (!(a instanceof NPMapLib.Geometry.Point) || !(b instanceof NPMapLib.Geometry.Point))
                return NPMapLib.Utils.BaseUtils("Argument exception");

            this.sw = a;
            this.ne = b;
        } else if (arguments.length === 4) {
            this.sw = new NPMapLib.Geometry.Point(a, b);
            this.ne = new NPMapLib.Geometry.Point(c, d);
        }
    };

    //当且仅当此矩形中的两点参数都等于其他矩形的两点参数时，返回true
    e.prototype.equals = function(other) {
        if (!(other instanceof NPMapLib.Geometry.Extent))
            return false;

        return (this.sw.lon === other.sw.lon && this.sw.lat === other.sw.lat &&
			this.ne.lon === other.ne.lon && this.ne.lat === other.ne.lat);
    };

    //如果点的地理坐标位于此矩形内，则返回true
    e.prototype.containsPoint = function(point) {

    };

    //传入的矩形区域完全包含于此矩形区域中，则返回true
    e.prototype.containsExtent = function(extent) {

    };

    //计算与另一矩形的交集区域
    e.prototype.intersects = function(other) {

    };

    //放大此矩形，使其包含给定的点
    e.prototype.extend = function(point) {

    };

    //返回矩形的中心点
    e.prototype.getCenter = function() {

    };

    //如果矩形为空，则返回true
    e.prototype.isEmpty = function() {

        return false;
    };

    //返回矩形区域的西南角
    e.prototype.getSouthWest = function() {

        return this.sw;
    };

    //返回矩形区域的东北角
    e.prototype.getNorthEast = function() {

        return this.ne;
    };
})();
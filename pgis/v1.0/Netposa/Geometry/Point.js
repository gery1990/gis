/*!
 * 坐标点
 */
(function() {
	var e = NPMapLib.Geometry.Point = function(lon, lat) {
		this.lon = lon;
		this.lat = lat;
	};
	
	//判断坐标点是否相等，当且仅当两点的经度和纬度均相等时返回true。
	e.prototype.equals = function(other) {
		if (!(other instanceof NPMapLib.Geometry.Point ))
			return false;

		return (this.lon === other.lon && this.lat === other.lat);
	};
})();
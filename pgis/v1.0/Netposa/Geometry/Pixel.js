/*!
 * 像素点
 */
(function() {
	var e = NPMapLib.Geometry.Pixel = function(x, y) {
		this.x = x;
		this.y = y;
	};

	//判断坐标点是否相等，当且仅当两点的x坐标和y坐标均相等时返回true。
	e.prototype.equals = function(other) {
		if (!(other instanceof NPMapLib.Geometry.Pixel))
			return false;

		return (this.x === other.x && this.y === other.y);
	};
})();
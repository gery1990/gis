/*!
 * 以像素表示一个矩形区域的大小
 */
(function() {
	var e = NPMapLib.Geometry.Size = function(width, height) {
		this.width = parseFloat(width);
		this.height = parseFloat(height);
	};

	//当且仅当此矩形中的宽度和高度都等于其他矩形的宽度和高度时，返回true。
	e.prototype.equals = function(other){
		if(!(other instanceof NPMapLib.Geometry.Size))
			return false;

		return (this.width === other.width && this.height === other.height);
	};
})();
/**
* 气泡
**/
(function () {
    var e = NPMapLib.Utils.Popup = function (config) {
        this._config = {
            arrow: false,   //有无箭头
            caption: "标题", //标题
            content: "内容",
            width: 300,
            height: 200
        };

        this._domElement = null;
        this._top = null, this._left = null, this._callbackClose = null;
        if (config)
            this._config = e.prototype.extend(this._config, config);
    };
    //继承
    e.prototype.extend = function (destination, source) {// 一个静态方法表示继承, 目标对象将拥有源对象的所有属性和方法
        for (var property in source) {
            destination[property] = source[property]; // 利用动态语言的特性, 通过赋值动态添加属性与方法
        }
        return destination;   // 返回扩展后的对象
    };
    //带箭头
    e.prototype._withArrow = function (callback) {
        this._domElement = document.createElement('div');
        this._domElement.className = "NPMap-popup";
        var top = document.createElement('div');
        top.className = "NPMap-popup-top";

        var h3 = document.createElement('h3');
        h3.className = "NPMap-popup-title";
        h3.innerHTML = this._config.caption;
        top.appendChild(h3);

        var spanClose = document.createElement('span');
        spanClose.className = "NPMap-popup-close";
        spanClose.title = "关闭";
        spanClose.onclick = callback;
        top.appendChild(spanClose);

        this._middle = document.createElement('div');
        this._middle.className = "NPMap-popup-middle";
        this._middle.innerHTML = this._config.content;

        this._bottom = document.createElement('div');
        this._bottom.className = "NPMap-popup-bottom";

        this._spanArrow = document.createElement('span');
        this._spanArrow.className = "NPMap-popup-arrow";
        this._bottom.appendChild(this._spanArrow);

        this._domElement.appendChild(top);
        this._domElement.appendChild(this._middle);
        this._domElement.appendChild(this._bottom);
    };

    //不带箭头
    e.prototype._noArrow = function (callback) {
        this._domElement = document.createElement('div');
        this._domElement.className = "NPMap-popup";
        var top = document.createElement('div');
        top.className = "NPMap-popup-top";

        var h3 = document.createElement('h3');
        h3.className = "NPMap-popup-title";
        h3.innerHTML = this._config.caption;
        top.appendChild(h3);

        var spanClose = document.createElement('span');
        spanClose.className = "NPMap-popup-close";
        spanClose.title = "关闭";
        spanClose.onclick = callback;
        top.appendChild(spanClose);

        this._middle = document.createElement('div');
        this._middle.className = "NPMap-popup-middle";
        this._middle.innerHTML = this._config.content;

        this._domElement.appendChild(top);
        this._domElement.appendChild(this._middle);
    };

    //打开
    e.prototype.open = function (top, left, callbackClose) {
        if (this._domElement)
            return;
        this._top = top;
        this._left = left;
        this._callbackClose = callbackClose;
        var _this = this;
        if (this._config.arrow) {
            this._withArrow(callbackClose);

            this._domElement.style.width = this._config.width + "px";
            this._domElement.style.height = this._config.height + "px";
            this._domElement.style.top = top - this._config.height + "px" || 0;
            this._domElement.style.left = left - this._config.width / 2 + "px" || 0;

            this._middle.style.height = (this._config.height - 36) + "px";
            this._bottom.style.left = (this._config.width / 2) + "px";

            document.body.appendChild(this._domElement);
        } else {
            this._noArrow(callbackClose);

            this._domElement.style.width = this._config.width + "px";
            this._domElement.style.height = this._config.height + "px";
            this._domElement.style.top = top + "px" || 0;
            this._domElement.style.left = left + "px" || 0;

            this._middle.style.height = (this._config.height - 36) + "px";

            document.body.appendChild(this._domElement);
        }
    };

    //关闭
    e.prototype.close = function () {
        if (this._domElement) {
            document.body.removeChild(this._domElement);
            this._domElement = null;
        }
    };
    // 
    e.prototype.setconfig = function (config) {
        if (this._domElement == null) {
            return;
        }
        this._config = e.prototype.extend(this._config, config);
        document.body.removeChild(this._domElement);
        this._domElement = null;
        this.open(this._top, this._left, this._callbackClose);
    }
})();


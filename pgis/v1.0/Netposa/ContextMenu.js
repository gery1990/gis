/*!
 * 右键菜单
 */
(function() {
	var e = NPMapLib.ContextMenu = function() {
		this.id = -1;
		this._items = [];
		this._separator = [];
		this._createDOMElement();
	};

	//创建dom元素
	e.prototype._createDOMElement = function(){
		this.DIVElement = document.createElement('div');
		this.DIVElement.className = 'contextMenu';
		document.body.appendChild(this.DIVElement);
	};

	//添加菜单项
	e.prototype.addItem = function(item) {
		if(!item || !this.DIVElement || !(item instanceof NPMapLib.ContextMenuItem))
			return;

		if(!this.ULElement){
			this.ULElement = document.createElement('ul');
			this.DIVElement.appendChild(this.ULElement);
		}

		this.ULElement.appendChild(item._getDOMElement());
		this._items.push(item);
	};

	//返回指定索引位置的菜单项，第一个添加菜单项的index为0，如此递增
	e.prototype.getItem = function(index) {
		if(!this.ULElement || index <0 || this._items.length-1 < index)
			return;

		return this._items[index];
	};

	//移除菜单项
	e.prototype.removeItem = function(index) {
		if(!this.ULElement || index <0 || this._items.length-1 < index)
			return;

		var item = this._items[index];
		this.ULElement.removeChild(item._getDOMElement());
		this._items.splice(index, 1);
	};

	//添加分隔符
	e.prototype.addSeparator = function() {
		if(!this.ULElement)
			return;

		if(!this.ULElement){
			this.ULElement = document.createElement('ul');
			this.DIVElement.appendChild(this.ULElement);
		}

		var li = document.createElement("li");
		this.ULElement.appendChild(li);
		li.className = "li-seperate";

		var hr = document.createElement("div");
		li.appendChild(hr);
		hr.className = "menu-seperate";
		this._separator.push(li);
	};

	//移除分隔符
	e.prototype.removeSeparator = function(index){
		if(!this.ULElement || index <0 || this._separator.length-1 < index)
			return;

		var item = this._separator[index];
		this.ULElement.removeChild(item);
		this._separator.splice(index, 1);
	};

	//显示
	e.prototype.show = function(pixel){
		this.DIVElement.style.left = pixel.x + "px";
		this.DIVElement.style.top = pixel.y + "px";
		this.DIVElement.style.display = "";
	};

	//隐藏
	e.prototype.hide = function(){
		this.DIVElement.style.display = "none";
	};
})();


/*!
 * 右键菜单项
 */
(function() {
	var e = NPMapLib.ContextMenuItem = function(text, callback) {
		this._items = [];
		this._separator = [];
		this._createDOMElement();
		this.setText(text);
	};

	//创建dom元素
	e.prototype._createDOMElement = function() {
		this.LIElement = document.createElement('li');
		this.AElement = document.createElement('a');
		this.LIElement.appendChild(this.AElement);
		this.AElement.className = "contextMenu-a";

		var showTimer = hideTimer = null;
		//鼠标经过事件
		this.LIElement.onmouseover = function() {
			var oThis = this;
			var oUl = oThis.getElementsByTagName("ul");

			//鼠标移入样式
			oThis.className += "active";

			//显示子菜单
			if (oUl[0]) {
				clearTimeout(hideTimer);
				showTimer = setTimeout(function() {
					for (i = 0; i < oThis.parentNode.children.length; i++) {
						oThis.parentNode.children[i].getElementsByTagName("ul")[0] &&
							(oThis.parentNode.children[i].getElementsByTagName("ul")[0].style.display = "none");
					}

					oUl[0].style.display = "block";
					oUl[0].style.top = oThis.offsetTop + "px";
					oUl[0].style.left = oThis.offsetWidth + "px";

					var maxWidth = 0;
					var maxHeight = 0;
					for (i = 0; i < oUl[0].children.length; i++) {
						var oLi = oUl[0].children[i];
						var iWidth = oLi.clientWidth - parseInt(oLi.currentStyle ? oLi.currentStyle["paddingLeft"] : getComputedStyle(oLi, null)["paddingLeft"]) * 2
						if (iWidth > maxWidth) maxWidth = iWidth;
					}
					for (i = 0; i < oUl[0].children.length; i++) 
						oUl[0].children[i].style.width = maxWidth + "px";

					//最大显示范围					
					maxWidth = document.documentElement.offsetWidth - oUl[0].offsetWidth;
					maxHeight = document.documentElement.offsetHeight - oUl[0].offsetHeight;

					//防止溢出
					// maxWidth <  (oUl[0].offsetLeft + (oUl[0].offsetParent ? arguments.callee(oUl[0].offsetParent) : 0)) && (oUl[0].style.left = -oUl[0].clientWidth + "px");
					// maxHeight < (oUl[0].offsetTop + (oUl[0].offsetParent ? arguments.callee(oUl[0].offsetParent) : 0)) && (oUl[0].style.top = -oUl[0].clientHeight + oThis.offsetTop + oThis.clientHeight + "px")
				}, 300);
			}
		};

		//鼠标离开事件
		this.LIElement.onmouseout = function() {
			var oThis = this;
			var oUl = oThis.getElementsByTagName("ul");
			//鼠标移出样式
			oThis.className = oThis.className.replace(/\s?active/, "");

			clearTimeout(showTimer);
			hideTimer = setTimeout(function() {
				for (i = 0; i < oThis.parentNode.children.length; i++) {
					oThis.parentNode.children[i].getElementsByTagName("ul")[0] &&
						(oThis.parentNode.children[i].getElementsByTagName("ul")[0].style.display = "none");
				}
			}, 300);
		};
		var flag =11;
	};

	//获取dom元素
	e.prototype._getDOMElement = function(){
		return this.LIElement;
	};

	//设置菜单项显示的文本
	e.prototype.setText = function(text) {
		if(!this.AElement)
			return;
		
		this.AElement.innerHTML = '<font class="contextMenu-text">'+text+'</font>';
	};

	//添加下级菜单项
	e.prototype.addChildItem = function(item){
		if(!item || !this.LIElement || !(item instanceof NPMapLib.ContextMenuItem))
			return;

		if(!this.ULElement){
			this.ULElement = document.createElement('ul');
			this.LIElement.appendChild(this.ULElement);
			this.LIElement.className = "sub";
			this.SPANElement = document.createElement('span');
			this.SPANElement.className = "contextMenu-ico";
			this.AElement.appendChild(this.SPANElement);
		}

		this.ULElement.appendChild(item._getDOMElement());
		this._items.push(item);
	}

	//获取下级菜单项
	e.prototype.getChildItem = function(index){
		if(!this.ULElement || index <0 || this._items.length-1 < index)
			return;

		return this._items[index];
	};

	//添加分隔符
	e.prototype.addSeparator = function() {
		if(!this.ULElement)
			return;

		if(!this.ULElement){
			this.ULElement = document.createElement('ul');
			this.LIElement.appendChild(this.ULElement);
		}

		var li = document.createElement("li");
		this.ULElement.appendChild(li);

		var hr = document.createElement("hr");
		li.appendChild(hr);
		
		this._separator.push(li);
	};

	//移除分隔符
	e.prototype.removeSeparator = function(index){
		if(!this.ULElement || index <0 || this._separator.length-1 < index)
			return;

		var item = this._separator[index];
		this.ULElement.removeChild(item);
		this._separator.splice(index, 1);
	};

	//启用
	e.prototype.enable = function() {
		if(!this.LIElement.disabled)
			return;
		this.LIElement.disabled = false;
	};

	//禁用
	e.prototype.disable = function() {
		if(this.LIElement.disabled)
			return;
		this.LIElement.disabled = true;
	};
})();
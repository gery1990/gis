/**
* 气泡
**/
var Popup = function(config){
	//默认参数
	var defaultConfig = {
		type : "noArrow",//有没有箭头，默认为有；无箭头noArrow
		caption : "标题",//标题
		content : "内容",
		width : 300,
		height : 200
	};
	var p = {
		_config : jQuery.extend(defaultConfig,config,{}),
		withArrow : function(){
			return  '<div class="NPMap-popup">'+
						'<div class="NPMap-popup-top">'+
							'<h3 class="popup-title">标题</h3>'+
							'<span class="popup-close" title="关闭"></span>'+
						'</div>'+
						'<div class="NPMap-popup-middle">'+
						'</div>'+
						'<div class="NPMap-popup-bottom">'+
							'<span class="NPMap-popup-arrow"></span>'+
						'</div>'+
					'</div>';
		},
		noArrow : function(){
			return  '<div class="NPMap-popup">'+
						'<div class="NPMap-popup-top">'+
							'<h3 class="popup-title">标题</h3>'+
							'<span class="popup-close" title="关闭"></span>'+
						'</div>'+
						'<div class="NPMap-popup-middle">'+
						'</div>'+
					'</div>';
		},
		open :  function(top,left){
			var NPMapPopup = jQuery(document.body).find(".NPMap-popup");
			if(NPMapPopup==null || NPMapPopup=="")
				return;
			var _this = this;
			if(this._config.type == "withArrow"){
				var _withArrow = this.withArrow();
				jQuery(document.body).append(_withArrow);
				jQuery(".NPMap-popup").css({
					width : this._config.width+"px",
					height : this._config.height+"px",
					top : top+"px"|| 0,
					left : left+"px"|| 0
				});
				jQuery(".NPMap-popup-middle").height((this._config.height-50)+"px").append(this._config.content);
				jQuery(".NPMap-popup-bottom .NPMap-popup-arrow").css("left",this._config.width/2 + "px");
				jQuery(".popup-close").live("click",function(){_this.close();});
			}
			else{
				var _noArrow = this.noArrow();
				jQuery(document.body).append(_noArrow);
				jQuery(".NPMap-popup").css({
					width : this._config.width+"px",
					height : this._config.height+"px",
					top : top+"px"|| 0,
					left : left+"px"|| 0
				});
				jQuery(".NPMap-popup-middle").height((this._config.height-50)+"px").append(this._config.content);
				jQuery(".popup-close").live("click",function(){_this.close();});
			}
		},
		close : function(){
			var NPMapPopup = jQuery(document.body).find(".NPMap-popup");
			if(NPMapPopup){
				NPMapPopup.remove();
			}else{
				return;
			}
		}
	};
	return p;
};

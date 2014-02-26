(function(){
	/*$.fn.ResourceCode = function(){*/
		var resouceCodeTemplate = '<div id="codeButton0" class="codeButton0style1"></div><div id="controlButton" class="controlButtonstyle1"></div>'+
		'<div id="codeButton1" style="left: 519px; display: block;"></div><div id="codeButton2" style="left: 519px; display: none;"></div>'+
		'<div id="codeContainer" style="display: none;">'+
			'<pre class="brush:html" name = "code" id="code">'+
			'</pre>'+
		'</div>';
		var $target = jQuery("#mapId");
		$target.after(resouceCodeTemplate);

		//点击查看源码
		$("#codeButton0").live("click",function(){
			$(this).toggleClass("codeButton0style2");
			$("#codeButton1").toggle(500);
			$("#codeButton2").toggle(500);
			$("#codeContainer").slideToggle(500);
		});
		
		//点击向上按钮
		$("#codeButton1").live("click",function(){
			$("#codeButton0").toggleClass("codeButton0style2");
			$(this).hide();
			$("#codeButton2").show(500);
			$("#codeContainer").slideDown(500);
		});
		//点击向下按钮
		$("#codeButton2").live("click",function(){
			$("#codeButton0").toggleClass("codeButton0style2");
			$(this).hide();
			$("#codeButton1").show(500);
			$("#codeContainer").slideUp(500);
		});
	/*};*/
})(jQuery);
var loadDemoCode = function(url){
	var re="";
    $.ajax({
	 	async:false,
	 	dataType: "html",
	    url : url,
	    success : function(result){
	    	re=result;
	    }
	});
	$('#code').text(re);
    SyntaxHighlighter.all("code");
};

var isShowInstruction = true;
//操作说明
var registerDemoInstructions = function(instructionDetails){
	if(isShowInstruction)
		Dialog.show(instructionDetails);
	
	$("#controlButton").live("click", function(){
		isShowInstruction =!isShowInstruction;
		if(isShowInstruction){
			Dialog.show(instructionDetails);
		}else{
			Dialog.close();
		}
	});
};
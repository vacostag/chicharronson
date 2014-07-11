$(function(){
	ch = new Chicharronson();
	ch.init();
	
	$(window).mousewheel(function(event){
		ch.move(event.deltaY);
	});
});

function Chicharronson(){}

Chicharronson.prototype.deltaFactor 	= 100;
Chicharronson.prototype.flow 			= new Array();
Chicharronson.prototype.actual			= 0;
Chicharronson.prototype.last			= 0;

Chicharronson.prototype.init = function(){
	$(".wrapper").height($(window).height());
	
	var count = $(".wrapper section").length;
	this.last = count - 1;
	var self = this;
	$.each($(".wrapper section"), function(i,item){
		self.flow.push({
			'z-index'	: count, 
			'element'	: $(item).attr("id"),
			'index'		: i
		});
		$(item).css("z-index", count);
		count--;
	});
}

Chicharronson.prototype.move = function(delta){
	var actual 	= this.flow[this.actual];
	var top 	= this.sanitizeSizes($("#" + actual.element).css("top"));
	var height 	= $(window).height();
	
	if(top <= (height * -1)){
		console.debug(this.actual == this.last);
		$("#" + actual.element).css("top", height * -1);
		//this.actual++;
		this.actual = (this.actual == this.last) ? this.last : this.actual + 1;
	}else if(top > height){
		$("#" + actual.element).css("top",height);
		this.actual = (this.actual < 0) ? 0 : this.actual - 1;
	}else{// if((this.actual != this.last && delta < 0) || (this.actual != 0 && delta > 0) || (this.actual == 0 && top < height)){
		$("#" + actual.element).css("top", ((delta == -1) ? "-" : "+") + "=" + this.deltaFactor + "px");
	}
	console.debug(this.last);
	//console.debug(delta);
	console.debug(this.actual);
}

Chicharronson.prototype.getSize = function(property, elem){
	var supportedProperties = ["left", "right", "bottom", "top"];
	
	if(property == "padding" || property == "margin"|| property == "border"){
		values = {
			"top"		: sanitizeSizes($(elem).css(property + "-top")), 
			"bottom" 	: sanitizeSizes($(elem).css(property + "-bottom")), 
			"left" 		: sanitizeSizes($(elem).css(property + "-left")), 
			"right" 	: sanitizeSizes($(elem).css(property + "-right"))
		};
	}else if(supportedProperties.indexOf(property) != -1){
		values = sanitizeSizes($(elem).css(property));
	}else{
		values = 0;
	}
	return values;	
}

Chicharronson.prototype.getDimention = function(elem){
	var padding 	= getSize("padding", elem);
	var margin 		= getSize("margin", elem);
	var border 		= getSize("border", elem);	
	return {
		"width" 	: $("#"+elem).width() + padding.left + padding.right + margin.left + margin.right + border.left + border.right,
		"height" 	: $("#"+elem).height() + padding.top + padding.bottom + margin.top + margin.bottom + border.top + border.bottom
	}
}

Chicharronson.prototype.sanitizeSizes = function(size){
	return parseInt(size, 10) || 0;
}
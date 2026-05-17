"use strict";

function InTheBox(element)
{
	this._element=element;
	this._isActive=false;
	this._blackButton=element.querySelector("button.black");
	this._whiteButton=element.querySelector("button.white");
	this._onBlackOverHandler=MyUtils.bind(this._onBlackOver, this);
	this._onWhiteOverHandler=MyUtils.bind(this._onWhiteOver, this);
	this._onButtonOverHandler=MyUtils.bind(this._onButtonOver,this);
	this._onButtonOutHandler=MyUtils.bind(this._onButtonOut,this);
	this._timeline=new TimelineLite({paused:true});
	var $parent=$("> div", element);
	this._images=MyUtils.toArray($(".images li", $parent));
	this._numImages=this._images.length;
	var parentWidth=$parent.width();
	var parentHeight=$parent.height();
	for(var i=0; i<this._numImages; i++)
	{
		var $li=$(this._images[i]);
		var x=(parseInt($li.css("left"))||0)+$li.width()/2;
		var y=(parseInt($li.css("top"))||0)+$li.height()/2;
		var relativeX=(x/parentWidth-0.5)*2;
		var relativeY=y/parentHeight*2;
		this._timeline.insert(TweenLite.fromTo(this._images[i], 1, {x:relativeX*2000}, {x:0, ease:Quart.easeOut, force3D:true}),relativeY/2);
		this._timeline.insert(TweenLite.fromTo(this._images[i], 1, {y:500+relativeY*500}, {y:0, ease:Sine.easeOut, force3D:true}),relativeY/2);
		this._images[i]._alpha=1;
	}
	this._timeline.insert(TweenLite.fromTo($("h1, .specs",element), 0.5, {opacity:0}, {opacity:1, ease:Linear.easeNone}),0.5);
	this._buttons=element.querySelectorAll(".specs > li:first-child button");
	for(var i=0, iLen=this._buttons.length; i<iLen; i++)
	{
		var c=this._buttons[i].className;
		this._buttons[i]._images=[];
		for(var j=0; j<this._numImages; j++)
		{
			if(MyUtils.hasClass(this._images[j],c))
				this._buttons[i]._images.push(this._images[j]);
		}
	}
}

InTheBox.prototype.progress=function(num)
{
	if(num>=0 && num<=1)
	{
		if(!this._isActive)
			this.activate();
		this._timeline.progress(num*1.5);
	}
	else if(this._isActive)
	{
		this.deactivate();
	}
}

InTheBox.prototype.activate=function()
{
	this._isActive=true;
	MyUtils.addEventListener(this._blackButton, "mouseover", this._onBlackOverHandler);
	MyUtils.addEventListener(this._whiteButton, "mouseover", this._onWhiteOverHandler);
	MyUtils.addEventListener(this._buttons, "mouseover", this._onButtonOverHandler);
	MyUtils.addEventListener(this._buttons, "mouseout", this._onButtonOutHandler);
}

InTheBox.prototype.deactivate=function()
{
	this._isActive=false;
	MyUtils.removeEventListener(this._blackButton, "mouseover", this._onBlackOverHandler);
	MyUtils.removeEventListener(this._whiteButton, "mouseover", this._onWhiteOverHandler);
	MyUtils.removeEventListener(this._buttons, "mouseover", this._onButtonOverHandler);
	MyUtils.removeEventListener(this._buttons, "mouseout", this._onButtonOutHandler);
}

InTheBox.prototype._onBlackOver=function()
{
	MyUtils.removeClass(this._element,"white");
	MyUtils.addClass(this._element,"black");
}

InTheBox.prototype._onWhiteOver=function()
{
	MyUtils.removeClass(this._element,"black");
	MyUtils.addClass(this._element,"white");
}

InTheBox.prototype._onButtonOver=function(evt)
{
	for(var i=0; i<this._numImages; i++)
	{
		var destAlpha=(evt.currentTarget._images.indexOf(this._images[i])>=0)?1:0.1;
		TweenLite.to(this._images[i], 0.2, {opacity:destAlpha, ease:Linear.easeNone});
		evt.currentTarget.style.color="#FFF";
	}
}

InTheBox.prototype._onButtonOut=function(evt)
{
	for(var i=0; i<this._numImages; i++)
	{
		TweenLite.to(this._images[i], 0.2, {opacity:1, ease:Linear.easeNone});
		evt.currentTarget.style.color="#787878";
	}
}
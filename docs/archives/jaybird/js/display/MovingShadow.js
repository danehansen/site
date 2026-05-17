"use strict";

function MovingShadow(element)
{
	this._destX=0;
	this._destY=0;
	this._currentX=0;
	this._currentY=0;
	this._active=false;
	this._element=element;
	this._onMouseMoveHandler=MyUtils.bind(this._onMouseMove,this);
	this._onTickHandler=MyUtils.bind(this._onTick, this);
	if(MyUtils.browser().name=="firefox")
	{
		this._element.style.filter="url(#drop-shadow)";
		this._filter=$("#drop-shadow feOffset")[0];
	}
}

MovingShadow.prototype.progress=function(num)
{
	if(num>=0 && num<=1)
		this.activate();
	else
		this.deactivate();
}

MovingShadow.prototype.activate=function()
{
	if(!this._active)
	{
		this._active=true;	
		MyUtils.addEventListener(window, "mousemove", this._onMouseMoveHandler);
		TweenLite.ticker.addEventListener("tick", this._onTickHandler);
	}
}

MovingShadow.prototype._onMouseMove=function(evt)
{
	this._destX=(evt.clientX/STS.width-0.5)*2;
	this._destY=(evt.clientY/STS.height-0.5)*2;
}

MovingShadow.prototype._onTick=function()
{
	MyMath.ease(this, "_currentX", this._destX);
	MyMath.ease(this, "_currentY", this._destY);
	if(MyUtils.browser().webkit)
	{
		this._element.style.webkitFilter="drop-shadow("+(5*-this._currentX)+"px "+(5*-this._currentY+10)+"px 7px rgba(0,0,0,0.3))";
	}
	else if(MyUtils.browser().name=="msie")
	{
		if(MyUtils.browser().version>=9)
			var prefix="msFilter";
		else
			prefix="filter";
		this._element.style[prefix]="progid:DXImageTransform.Microsoft.Dropshadow(OffX="+(5*-this._currentX)+", OffY="+(5*-this._currentY+10)+", Color='#000000')";
	}
	else if(MyUtils.browser().name=="firefox")
	{
		this._filter.dx.baseVal=5*-this._currentX;
		this._filter.dy.baseVal=5*-this._currentY+10;
	}
}

MovingShadow.prototype.deactivate=function()
{
	TweenLite.ticker.removeEventListener("tick", this._onTickHandler);
	MyUtils.removeEventListener(window, "mousemove", this._onMouseMoveHandler);
	this._active=false;
}
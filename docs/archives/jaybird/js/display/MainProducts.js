"use strict";

function MainProducts(element)
{
	this._isActive=false;
	this._lis=element.querySelectorAll("li");
	this._onMouseMoveHandler=MyUtils.bind(this._onMouseMove, this);
	for(var i=0, iLen=this._lis.length; i<iLen; i++)
	{
		this._lis[i]._sprite=new MySprite(this._lis[i].querySelector("div:first-child"),6,32);
		this._lis[i]._sprite.progress(0.5);
	}
}

MainProducts.prototype.progress=function(num)
{
	if(num>=0 && num<=1)
	{
		if(!this._isActive)
			this.activate();
	}
	else if(this._isActive)
	{
		this.deactivate();
	}
}

MainProducts.prototype.activate=function()
{
	this._isActive=true;
	MyUtils.addEventListener(this._lis, "mousemove", this._onMouseMoveHandler);
}

MainProducts.prototype.deactivate=function()
{
	this._isActive=false;
	MyUtils.removeEventListener(this._lis, "mousemove", this._onMouseMoveHandler);
}

MainProducts.prototype._onMouseMove=function(evt)
{
	evt.currentTarget._sprite.progressTo(Math.max(0,(evt.clientX-evt.currentTarget.offsetLeft)/evt.currentTarget.offsetWidth));
}
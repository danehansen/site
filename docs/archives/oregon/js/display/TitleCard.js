"use strict";
	
function TitleCard(element)
{
	this.element=element;
	this.video=this.element.querySelector("video");
	var headline=this.element.querySelector(".headline");
	if(headline)
		this._headline=new Headline(headline);
	this._onResizeHandler=MyUtils.bind(this.onResize,this);
	this._playing=false;
	setTimeout(this._onResizeHandler,1);

	window.addEventListener("resize",this._onResizeHandler);
}

TitleCard.prototype.onResize=function()
{
	MyMath.cover(this.video,this.element);
}

TitleCard.prototype.play=function()
{
	if(!this._playing)
	{
		this.video.play();
		if(this._headline)
			this._headline.play();
		this._playing=true;
	}
}

TitleCard.prototype.pause=function()
{
	if(this._playing)
	{
		this.video.pause();
		this._playing=false;
	}
}

TitleCard.prototype.reset=function()
{
	if(this._headline)
		this._headline.reset();
}

TitleCard.prototype.deactivate=function()
{
	window.removeEventListener("resize",this._onResizeHandler);
	this.video.pause();
	if(this._headline)
		this._headline.deactivate();
}
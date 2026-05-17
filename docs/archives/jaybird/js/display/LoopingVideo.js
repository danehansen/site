"use strict";

function LoopingVideo(element)
{
	this._isActive=false;
	this._element=element;
	this._video=element.querySelector("video");
}

LoopingVideo.prototype.resize=function()
{
	MyMath.cover(this._video, this._element);
}

LoopingVideo.prototype.progress=function(num)
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

LoopingVideo.prototype.activate=function()
{
	this._isActive=true;
	this._video.play();
}

LoopingVideo.prototype.deactivate=function()
{
	this._isActive=false;
	this._video.pause();
}
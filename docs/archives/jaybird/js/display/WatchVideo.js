"use strict";

function WatchVideo(element)
{
	this._isActive=false;
	this._isPlaying=false;
	this._element=element;
	this._video=element.querySelector("video");
	this._fullscreen=document.getElementById("fullscreenVideo");
	this._fullVideo=this._fullscreen.querySelector("video");
	this._onVideoEndedHandler=MyUtils.bind(this._onVideoEnded,this);
	this._onVideoClickHandler=MyUtils.bind(this._onVideoClick,this);
	this._onTimerHandler=MyUtils.bind(this._onTimer,this);
	this._onMouseMoveHandler=MyUtils.bind(this._onMouseMove,this);
	this._destX=0;
	this._destY=0;
	this._currentX=0;
	this._currentY=0;
	this._button=this._element.querySelector("button");
	MyUtils.addEventListener(element, "click", MyUtils.bind(this._onButtonClick, this));
	this._cursorTimer;
	this._power=new MySprite(element.querySelector(".power"),6,90);
	this._your=new MySprite(element.querySelector(".your"),6,90);
	this._passion=new MySprite(element.querySelector(".passion"),7,90);
	this._cursor=this._fullscreen.querySelector(".cursor");
}

WatchVideo.prototype.resize=function()
{
	MyMath.cover(this._video, this._element);
	MyMath.cover(this._fullVideo, this._fullscreen);
}

WatchVideo.prototype.progress=function(num)
{
	if(num>=0 && num<=1)
	{
		if(!this._isActive)
			this.activate();
		var progress=Math.min(1, num*2);
		this._power.progress(progress);
		this._your.progress(progress);
		this._passion.progress(progress);
	}
	else if(this._isActive)
	{
		this.deactivate();
	}
}

WatchVideo.prototype.activate=function()
{
	this._isActive=true;
	if(!this._isPlaying)
		this._video.play();
}

WatchVideo.prototype.deactivate=function()
{
	this._isActive=false;
	if(!this._isPlaying)
		this._video.pause();
}

WatchVideo.prototype._onButtonClick=function(evt)
{
	this._isPlaying=true;
	this._video.pause();
	TweenLite.to(this._fullscreen, 0.5, {autoAlpha:1, ease:Linear.easeNone});
	if(this._fullVideo.currentTime!=0)
		this._fullVideo.currentTime=0;
	this._fullVideo.play();

	this._cursorTimer=new MyTimer(1000,1);
	this._cursorTimer.addEventListener(MyTimerEvent.TIMER, this._onTimerHandler);
	document.addEventListener("mousemove", this._onMouseMoveHandler);
	this._fullVideo.addEventListener("ended", this._onVideoEndedHandler);
	this._fullVideo.addEventListener("click", this._onVideoClickHandler);
	this._cursor.addEventListener("click", this._onVideoClickHandler);

	this._onMouseMove(evt);
}

WatchVideo.prototype._onVideoEnded=function()
{
	this._cursorTimer.removeEventListener(MyTimerEvent.TIMER, this._onTimerHandler);
	document.removeEventListener("mousemove", this._onMouseMoveHandler);
	this._fullVideo.removeEventListener("ended", this._onVideoEndedHandler);
	this._fullVideo.removeEventListener("click", this._onVideoClickHandler);
	this._cursor.removeEventListener("click", this._onVideoClickHandler);
	this._timer=null;
	this._isPlaying=false;
	if(this._isActive)
		this._video.play();
	TweenLite.to(this._fullscreen, 0.5, {autoAlpha:0, ease:Linear.easeNone});
}

WatchVideo.prototype._onVideoClick=function()
{
	this._fullVideo.pause();
	this._onVideoEnded();
}

WatchVideo.prototype._onTimer=function()
{
	MyUtils.addClass(this._cursor, "hidden");
}

WatchVideo.prototype._onMouseMove=function(evt)
{
	this._cursorTimer.reset();
	this._cursorTimer.start();
	MyUtils.removeClass(this._cursor, "hidden");
	this._cursor.style.top=evt.clientY+"px";
	this._cursor.style.left=evt.clientX+"px";
}
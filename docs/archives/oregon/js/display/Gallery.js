"use strict";

Gallery.TRANS=1;

function Gallery(id, xLoc, vidLocs)
{
	this._vidLocs=vidLocs;
	this._playingVid=null;
	this._element=document.getElementById(id);
	this._currentNum=Number.MAX_VALUE;
	this._xLoc=xLoc;
	this._onTimeoutHandler=MyUtils.bind(this._onTimeout,this);
	this._onTimeout();
}

Gallery.prototype._onTimeout=function()
{
	var slits=this._element.querySelector(".slits");
	if(slits)
	{
		this._floaties=slits.querySelector(".floaties");
		this._floaties.l=0;
		this._footer=this._element.querySelector("footer.gallery");
		this._copy=this._footer.querySelectorAll("li");
		this._buttons=slits.querySelectorAll(".diamondButton");
		this._slits=new Slits(slits, MyUtils.bind(this.positionCenters,this));
		this._bws=this._floaties.querySelectorAll(".bw");
		if(this._slits.vids.length>0)
		{
			this._onVidEndedHandler=MyUtils.bind(this._onVidEnded,this);
			for(var i=0, iLen=this._slits.vids.length; i<iLen; i++)
			{
				this._slits.vids[i].srcLoc=this._vidLocs[i];
			}
		}
		this._onSlantedClickHandler=MyUtils.bind(this._onSlantedClick,this);
		this._onNextClickHandler=MyUtils.bind(this._onNextClick,this);
		this._onPrevClickHandler=MyUtils.bind(this._onPrevClick,this);
		this._onResizeHandler=MyUtils.bind(this._onResize,this);
		if(this._activated)
		{
			this._floaties.addEventListener("click", this._onSlantedClickHandler);
			this._slits.activate();
		}
	}
	else
	{
		setTimeout(this._onTimeoutHandler,1);
	}
}

Gallery.prototype.activate=function()
{
	this._onCursorMoveHandler=MyUtils.bind(this._onCursorMove,this);
	this._onCursorClickHandler=MyUtils.bind(this._onCursorClick,this);
	this._onKeyPressHandler=MyUtils.bind(this._onKeyPress,this);
	if(this._slits)
	{
		this._floaties.addEventListener("click", this._onSlantedClickHandler);
		this._slits.activate();
	}
	this._activated=true;
	showTopNav(true);
	this._onXClickHandler=MyUtils.bind(this._onXClick, this);
	topNavX().addEventListener("click",this._onXClickHandler);
}

Gallery.prototype.positionCenters=function(array)
{
	for(var i=0, iLen=array.length; i<iLen; i++)
	{
		if(this._buttons[i].l!=array[i])
		{
			this._buttons[i].l=array[i];
			this._buttons[i].style.left=array[i]+"px";
		}
	}
}

Gallery.prototype._onSlantedClick=function(evt)
{
	this._slits.scrollbar.removeEventListener("mousedown", this._slits.onScrollDownHandler);
	MySounds.play(FX.click);
	clearTimeout(this._slits.timeout);
	this._floaties.removeEventListener("click", this._onSlantedClickHandler);
	this._slits.pause();
	var num=MyUtils.indexOf(this._bws,evt.target);
	this._showImg(num);
	this._slits.diamondButtons[num].out();
	this._slits.activeButton=null;
	for(var i=0; i<this._slits.numSections; i++)
	{
		this._slits.slanteds[i].offset=0;
	}
	MyUtils.removeClass(this._floaties, "closed");
	this._onCursorMove(evt);
	TweenLite.to(this._slits.scrollbar, 0.5, {bottom:-8, ease:Cubic.easeInOut});
	if(this._slits.element.l!=0)
		TweenLite.to(this._slits.element, Gallery.TRANS, {transform:"translate3d(0px,0px,0px)", ease:Cubic.easeInOut,onComplete:this._fullscreenActivate, onCompleteScope:this});
	else
		this._fullscreenActivate();
}

Gallery.prototype._fullscreenActivate=function()
{
	cursor().elements[0].style.zIndex="";
	cursor().currentFrame(19);
	MyUtils.autoAlpha(cursor().elements, 1);
	TweenLite.to(this._footer, 0.5, {bottom:0,ease:Cubic.easeInOut});
	window.addEventListener("resize",this._onResizeHandler);
	topNavLeft().addEventListener("click", this._onPrevClickHandler);
	topNavRight().addEventListener("click", this._onNextClickHandler);
	this._floaties.addEventListener("click", this._onCursorClickHandler);
	document.addEventListener("mousemove", this._onCursorMoveHandler);
	document.addEventListener(KEYBOARD_EVENT, this._onKeyPressHandler);
}

Gallery.prototype._onKeyPress=function(evt)
{
	switch(evt.keyCode)
	{
		case 37 :
			evt.preventDefault();
			if(this._currentNum>0)
			{
				this._onPrevClick(evt);
				this._onCursorMove();
			}
			break;
		case 39 :
			evt.preventDefault();
			if(this._currentNum<this._slits.numSections-1)
			{
				this._onNextClick(evt);
				this._onCursorMove();
			}
			break;
		default :
			break;
	}
}

Gallery.prototype._onCursorMove=function(evt)
{
	if(evt)
	{
		var mouseX=evt.clientX;
		cursor().elements[0].style.left=mouseX+"px";
		cursor().elements[0].style.top=evt.clientY+"px";
	}
	else
	{
		mouseX=parseFloat(cursor().elements[0].style.left);
	}
	var w3=this._slits.winWidth/3;
	if(mouseX<w3 && this._currentNum>0)
		cursor().goto(0);
	else if(mouseX>w3*2 && this._currentNum<this._slits.numSections-1)
		cursor().goto(38);
	else
		cursor().goto(19);
}

Gallery.prototype._onCursorClick=function(evt)
{
	var frame=cursor().currentFrame();
	if(frame<10)
		this._onPrevClick();
	else if(frame>28)
		this._onNextClick();
	else
		this._onXClick(evt);
	this._onCursorMove(evt);
}

Gallery.prototype._endCursor=function()
{
	document.removeEventListener(KEYBOARD_EVENT, this._onKeyPressHandler);
	this._floaties.removeEventListener("click", this._onCursorClickHandler);
	document.removeEventListener("mousemove", this._onCursorMoveHandler);
	MyUtils.autoAlpha(cursor().elements, 0);
}

Gallery.prototype._showImg=function(num)
{
	if(this._currentNum!=num)
	{
		this._hideCopy();
		if(this._slits.vids[num])
			var timeline=new TimelineLite({onComplete:this._playVid,onCompleteScope:this,onCompleteParams:[num]});
		else
			timeline=new TimelineLite({});
		for(var i=0; i<3; i++)
		{
			timeline.insert(TweenLite.to(this._copy[i*this._slits.numSections+num], 0.5, {autoAlpha:1, ease:Cubic.easeOut}),0);
		}
		if(this._playingVid)
		{
			this._playingVid.removeEventListener("ended", this._onVidEndedHandler);
			this._playingVid=null;
		}
		this._slits.stopVids();
		if(num==this._slits.numSections-1 && topNavRight().alphaTracker==1)
		{
			topNavRight().alphaTracker=0;
			timeline.insert(TweenLite.to(topNavRight(), 0.5, {autoAlpha:0, ease:Linear.easeNone}),0);
		}
		if(num<this._slits.numSections-1 && topNavRight().alphaTracker==0)
		{
			topNavRight().alphaTracker=1;
			timeline.insert(TweenLite.to(topNavRight(), 0.5, {autoAlpha:1, ease:Linear.easeNone}),0);
		}
		if(num==0 && topNavLeft().alphaTracker==1)
		{
			topNavLeft().alphaTracker=0;
			timeline.insert(TweenLite.to(topNavLeft(), 0.5, {autoAlpha:0, ease:Linear.easeNone}),0);
		}
		if(num>0 && topNavLeft().alphaTracker==0)
		{
			topNavLeft().alphaTracker=1;
			timeline.insert(TweenLite.to(topNavLeft(), 0.5, {autoAlpha:1, ease:Linear.easeNone}),0);
		}
		this._currentNum=num;
		var destLeft=num==0?0:-this._slits.firstWidthExtra*2;
		if(this._floaties.l!=destLeft)
		{
			this._floaties.l=destLeft;
			timeline.insert(TweenLite.to(this._floaties, Gallery.TRANS, {left:destLeft, ease:Cubic.easeInOut}),0);
		}
		for(i=0; i<this._slits.numSections; i++)
		{
			if(i==num)
				var destWidth=this._slits.winWidth+(i==0?0:(this._slits.firstWidthExtra*2));
			else
				destWidth=0;
			if(this._slits.slanteds[i].w!=destWidth)
			{
				this._slits.slanteds[i].w=destWidth;
				timeline.insert(TweenLite.to(this._slits.slanteds[i], Gallery.TRANS, {width:destWidth, ease:Cubic.easeInOut}),0);
			}
		}
	}
}

Gallery.prototype._hideCopy=function()
{
	if(this._copy[this._currentNum])
	{
		for(var i=0; i<3; i++)
		{
			TweenLite.to(this._copy[i*this._slits.numSections+this._currentNum], 0.5, {autoAlpha:0, ease:Cubic.easeIn});
		}
	}
}

Gallery.prototype._playVid=function(num)
{
	this._playingVid=this._slits.vids[num];
	this._playingVid.addEventListener("ended", this._onVidEndedHandler);
	this._slits.playVid(num);
}

Gallery.prototype._onVidEnded=function(evt)
{
	this._playingVid.removeEventListener("ended", this._onVidEndedHandler);
	this._playingVid=null;
	this._onXClick();
}

Gallery.prototype._onResize=function()
{
	this._slits.getSize();
	this._slits.resizeContent();
	for(var i=0; i<this._slits.numSections; i++)
	{
		if(i==this._currentNum)
			var destWidth=this._slits.winWidth+(i==0?0:(this._slits.firstWidthExtra*2));
		else
			destWidth=0;
		if(this._slits.slanteds[i].w!=destWidth)
		{
			this._slits.slanteds[i].w=destWidth;
			this._slits.slanteds[i].style.width=destWidth+"px";
		}
	}
}

Gallery.prototype._onXClick=function(evt)
{
	this._hideTopArrows();
	if(this._currentNum!=Number.MAX_VALUE)
	{
		if(evt)
		{
			MySounds.play(FX.click);
			evt.preventDefault();
		}
		this._endCursor();
		this._slits.stopVids();
		topNavLeft().removeEventListener("click", this._onPrevClickHandler);
		topNavRight().removeEventListener("click", this._onNextClickHandler);
		window.removeEventListener("resize",this._onResizeHandler);
		MyUtils.addClass(this._floaties, "closed");
		MyUtils.removeClass(this._slits.slanteds,"color");
		var timeline=new TimelineLite({onComplete:this._fullScreenExited, onCompleteScope:this});
		timeline.insert(TweenLite.to(this._footer, 0.5, {bottom:-90,ease:Cubic.easeInOut}),0);
		timeline.insert(TweenLite.to(this._slits.scrollbar, 0.5, {bottom:0, ease:Cubic.easeInOut}),0);
		if(this._slits.element.l!=0)
		{
			timeline.insert(TweenLite.to(this._slits.element, Gallery.TRANS, {transform:"translate3d("+this._slits.element.l+"px,0px,0px)", ease:Cubic.easeInOut}),0);
		}
		if(this._floaties.l!=0)
		{
			this._floaties.l=0;
			timeline.insert(TweenLite.to(this._floaties, Gallery.TRANS, {left:0, ease:Cubic.easeInOut}),0);
		}
		for(var i=0; i<this._slits.numSections; i++)
		{
			if(i==0)
				var destWidth=this._slits.baseWidth-this._slits.firstWidthExtra;
			else if(i==this._slits.numSections-1)
				destWidth=this._slits.baseWidth+this._slits.firstWidthExtra;
			else
				destWidth=this._slits.baseWidth;
			this._slits.slanteds[i].w=destWidth;
			timeline.insert(TweenLite.to(this._slits.slanteds[i], Gallery.TRANS, {width:destWidth, ease:Cubic.easeInOut}),0);
		}
	}
	else
	{
		window.location=this._xLoc;
	}
}

Gallery.prototype._hideTopArrows=function()
{
	if(topNavLeft().alphaTracker==1)
	{
		MyUtils.autoAlpha(topNavLeft(),0);
		topNavLeft().alphaTracker=0;
	}
	if(topNavRight().alphaTracker==1)
	{
		MyUtils.autoAlpha(topNavRight(),0);
		topNavRight().alphaTracker=0;
	}
}

Gallery.prototype._fullScreenExited=function()
{
	this._hideCopy();
		this._currentNum=Number.MAX_VALUE;
	for(var i=0, iLen=this._slits.vids.length; i<iLen; i++)
	{
		if(this._slits.vids[i].a!=0)
		{
			this._slits.vids[i].a=0;
			TweenLite.to(this._slits.vids[i], 0.5, {autoAlpha:0, ease:Linear.easeNone});
		}
	}
	this._slits.unPause();
	this._floaties.addEventListener("click", this._onSlantedClickHandler);
} 


Gallery.prototype._onPrevClick=function()
{
	MySounds.play(FX.click);
	if(this._currentNum>0)
		this._showImg(this._currentNum-1);
}

Gallery.prototype._onNextClick=function()
{
	MySounds.play(FX.click);
	if(this._currentNum<this._slits.numSections-1)
		this._showImg(this._currentNum+1);
}

Gallery.prototype.deactivate=function()
{
	this._hideTopArrows();
	this._endCursor();
	topNavLeft().removeEventListener("click", this._onPrevClickHandler);
	topNavRight().removeEventListener("click", this._onNextClickHandler);
	window.removeEventListener("resize",this._onResizeHandler);
	this._floaties.removeEventListener("click", this._onSlantedClickHandler);
	topNavX().removeEventListener("click",this._onXClickHandler);
	this._slits.deactivate();
}
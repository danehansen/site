"use strict";
	
Slits.HOVER_GROW=50;
Slits.ANGLE=MyMath.toRadians(-15);
Slits.CONTENT_RATIO=16/9;
Slits._DURATION=10;

function Slits(element, positioningCallback)
{
	this._scrollDownX;
	this.scrollbar=document.querySelector(".slitScrollbar");
	this.onScrollHandler=MyUtils.bind(this._onScroll,this);
	this.onScrollDownHandler=MyUtils.bind(this._onScrollDown,this);
	this._onScrollMoveHandler=MyUtils.bind(this._onScrollMove,this);
	this._onScrollUpHandler=MyUtils.bind(this._onScrollUp,this);

	this.activeButton;
	this.element=element;
	this.element.l=0;
	this._playingVid=null;
	this._gallery=MyUtils.hasClass(element,"gallery");
	this._positioningCallback=positioningCallback;
	this.slanteds=element.querySelectorAll(".slanted");
	this._unslanteds=element.querySelectorAll(".unslanted");
	this.vids=element.querySelectorAll("video");
	this._imgs=[];
	this.getSize();
	this._middles=[];
	this.numSections=this.slanteds.length;
	this.diamondButtons=[];
	var db=element.querySelectorAll(".diamondButton");
	for(var i=0; i<this.numSections; i++)
	{
		this.slanteds[i].offset=0;
		if(db[i])
		{
			this.diamondButtons.push(new DiamondButton(db[i]));
			this.diamondButtons[i].timeline.insert(TweenLite.to(this.diamondButtons[i].element, 0.5, {autoAlpha:1,ease:Linear.easeNone}),0);
		}
		var imgs=this._unslanteds[i].querySelectorAll("img");
		for(var j=0, jLen=imgs.length; j<jLen; j++)
		{
			this._imgs.push(imgs[j]);
		}
		if(this.vids[i])
			this.vids[i].a=0;
	}
	this._tan=Math.tan(Slits.ANGLE);
	this._onSlantedOverHandler=MyUtils.bind(this._onSlantedOver,this);
	this._onFloatiesOutHandler=MyUtils.bind(this._onFloatiesOut,this);
	this._onResizeHandler=MyUtils.bind(this._onResize,this);
	this._onResize();
	this.timeout=null;
}

Slits.prototype.getSize=function()
{
	this.winWidth=window.innerWidth;
	this.winHeight=window.innerHeight;
	this.firstWidthExtra=this.winHeight/2*this._tan;
	this.ratio=this.winWidth/this.winHeight;
}

Slits.prototype._onResize=function()
{
	this.getSize();
	this.element.w=Math.max(this.winWidth, this.numSections*270);
	if(this.winWidth==this.element.w)
	{
		this.element.style.width="100%";
		this.element.style[transform()]="translate3d(0px,0px,0px)";
		this._tll=null;
		this._shj=null;
		if(this.scrollbar)
		{
			this.scrollbar.removeEventListener("mousedown", this.onScrollDownHandler);
			this.scrollbar.style.width=0;
		}
	}
	else
	{
		if(!this._scrollAmount)
			this._scrollAmount=0;
		this.element.style.width=this.element.w+"px";
		if(this._tll)
			var progress=this._tll.progress();
		else
			progress=0;
		this._tll=new TimelineLite({paused:true});
		var l=Math.round(-(this.element.w-this.winWidth));
		this._tll.append(TweenLite.fromTo(this.element, 1, {transform:"translate3d(0px,0px,0px)", l:0}, {transform:"translate3d("+l+"px,0px,0px)", l:l, ease:Linear.easeNone}));
		this._lastPoint=0;
		if(this._shj)
			this._shj.stop();
		this._shj=new ScrollHijack(MyUtils.bind(this._onScroll,this), leaveDefaults(), this.element.parentNode);
		if(this.scrollbar)
		{
			this.scrollWidth=this.winWidth/this.element.w*this.winWidth;
			this._tll.insert(TweenLite.fromTo(this.scrollbar, 1, {left:0}, {left:this.winWidth-this.scrollWidth, ease:Linear.easeNone}),0);
			this.scrollbar.style.width=this.scrollWidth+"px";
			this.scrollbar.addEventListener("mousedown", this.onScrollDownHandler);
		}
		this._tll.progress(progress);
	}
	this.baseWidth=this.element.w/this.numSections;
	this._positionSlits();
	this.resizeContent();
}

Slits.prototype._onScroll=function(point)
{
	clearTimeout(this.timeout);
	var sum=point.x||0+point.y||0;
	var difference=sum-this._lastPoint;
	this._lastPoint=sum;
	var num=Math.max(Math.min(1,this._scrollAmount+difference/((this.element.w-this.winWidth))*Slits._DURATION),0);
	this._tll.progress(num);
	this._scrollAmount=num;
	if(this.activeButton)
	{
		this.activeButton.out();
		this.activeButton=null;
	}
	MyUtils.removeClass(this.slanteds,"color");
	this._currentlyOver=null;
}

Slits.prototype._onScrollDown=function(evt)
{
	this.scrollbar.removeEventListener("mousedown", this.onScrollDownHandler);
	this._scrollDownX=evt.clientX;
	document.addEventListener("mousemove", this._onScrollMoveHandler);
	document.addEventListener("mouseup", this._onScrollUpHandler);
}

Slits.prototype._onScrollMove=function(evt)
{
	var difference=(evt.clientX-this._scrollDownX)/(this.winWidth-this.scrollWidth);
	var num=Math.min(Math.max(0,this._tll.progress()+difference),1);
	this._tll.progress(num);
	this._scrollAmount=num;
	this._scrollDownX=evt.clientX;
}

Slits.prototype._onScrollUp=function()
{
	document.removeEventListener("mouseup", this._onScrollUpHandler);
	document.removeEventListener("mousemove", this._onScrollMoveHandler);
	this.scrollbar.addEventListener("mousedown", this.onScrollDownHandler);
}

Slits.prototype.resizeContent=function()
{
	var firstCSSProps={};
	var middleCSSProps={};
	var lastCSSProps={};
	var allCSSProps={};
	if(this.ratio>Slits.CONTENT_RATIO)
	{
		firstCSSProps.marginLeft=-this.winWidth/2+"px";
		lastCSSProps.marginLeft=-this.winWidth/2+this.firstWidthExtra+"px";
		middleCSSProps.marginLeft=-this.winWidth/2+this.firstWidthExtra+"px";
		allCSSProps.height="auto";
		allCSSProps.width=this.winWidth+"px";
		allCSSProps.top=-(this.winWidth/16*9-this.winHeight)/2+"px";
	}
	else
	{
		firstCSSProps.marginLeft=-this.winHeight/9*8+"px";
		middleCSSProps.marginLeft=-this.winHeight/9*8+this.firstWidthExtra+"px";
		lastCSSProps.marginLeft=-this.winHeight/9*8+this.firstWidthExtra+"px";
		allCSSProps.height="100%";
		allCSSProps.width="auto";
		allCSSProps.top="auto";
	}
	for(var i=0, iLen=this.vids.length; i<iLen; i++)
	{
		MyUtils.css(this.vids[i], allCSSProps);
		if(i==0)
			MyUtils.css(this.vids[i], firstCSSProps);
		else if(i==iLen-1)
			MyUtils.css(this.vids[i], lastCSSProps);
		else
			MyUtils.css(this.vids[i], middleCSSProps);
	}
	for(i=0, iLen=this._imgs.length; i<iLen; i++)
	{
		MyUtils.css(this._imgs[i], allCSSProps);
		if(i<2)
			MyUtils.css(this._imgs[i], firstCSSProps);
		else if(i>iLen-3)
			MyUtils.css(this._imgs[i], lastCSSProps);
		else
			MyUtils.css(this._imgs[i], middleCSSProps);
	}
}

Slits.prototype.activate=function()
{
	this.unPause();
}

Slits.prototype.unPause=function()
{
	this._currentlyOver=null;
	MyUtils.addMouseEnter(this.slanteds, this._onSlantedOverHandler);
	MyUtils.addMouseLeave(this.element, this._onFloatiesOutHandler);
	window.addEventListener("resize",this._onResizeHandler);
	MyUtils.addEventListener(this.slanteds,"mousemove", this._onSlantedOverHandler);
	this._onResize();
}

Slits.prototype._positionSlits=function()
{
	var currentOffsets=0;
	for(var i=0; i<this.numSections; i++)
	{
		var offset=this.slanteds[i].offset;
		if(i>0)
			var slitX=Math.round(this.baseWidth*i+currentOffsets-this.firstWidthExtra);
		if(i==0)
		{
			var slitWidth=Math.round(this.baseWidth+offset-this.firstWidthExtra);
			this._middles[i]=Math.round((this.baseWidth+offset)/2);
		}
		else if(i==this.numSections-1)
		{
			slitWidth=Math.round(this.firstWidthExtra+this.baseWidth+offset);
			this._middles[i]=slitX+Math.round((this.baseWidth+offset)/2+this.firstWidthExtra);
		}
		else
		{
			slitWidth=Math.round(this.baseWidth+offset);
			this._middles[i]=Math.round(slitX+(this.firstWidthExtra*2+this.baseWidth+offset)/2);
		}
		if(this.slanteds[i].w!=slitWidth)
		{
			this.slanteds[i].w=slitWidth;
			this.slanteds[i].style.width=slitWidth+"px";
		}
		currentOffsets+=offset;
	}
	this._positioningCallback(this._middles);
}

Slits.prototype._onSlantedOver=function(evt)
{
	var num=MyUtils.indexOf(this.slanteds,evt.currentTarget);
	if(num!=this._currentlyOver)
	{
		this._currentlyOver=num;
		MyUtils.removeClass(this.slanteds,"color");
		MyUtils.addClass(evt.currentTarget,"color");
		var timeline=new TimelineLite({onUpdate:this._positionSlits,onUpdateScope:this});
		for(var i=0; i<this.numSections; i++)
		{
			if(this.diamondButtons[i])
			{
				if(i==num)
				{
					clearTimeout(this.timeout);
					this.timeout=setTimeout(MyUtils.bind(this.diamondButtons[i].over,this.diamondButtons[i]),500);
					this.activeButton=this.diamondButtons[i];
				}
				else
				{
					this.diamondButtons[i].out();
				}
			}
			if(this.vids[num] && !this._gallery)
			{
				if(i!=num)
					this.stopVids();
			}
			if(i==num)
			{
				if(this.slanteds[i].offset!=Slits.HOVER_GROW)
				{
					var params={offset:Slits.HOVER_GROW,ease:Cubic.easeInOut};
					if(this.vids[i]&&!this._gallery)
					{
						params.onComplete=this.playVid;
						params.onCompleteScope=this;
						params.onCompleteParams=[i];
					}
					timeline.insert(TweenLite.to(this.slanteds[i], 0.5, params),0);
				}
			}
			else
			{
				var dest=-Slits.HOVER_GROW/(this.numSections-1);
				if(this.slanteds[i].offset!=dest)
					timeline.insert(TweenLite.to(this.slanteds[i], 0.5, {offset:dest,ease:Cubic.easeInOut}),0);
			}
		}
	}
}

Slits.prototype.playVid=function(num)
{
	this.stopVids();
	if(this._playingVid)
	{
		if(this._playingVid.a!=0)
		{
			this._playingVid.style.opacity=0;
			this._playingVid.style.visibility="hidden";
			this._playingVid.a=0;
		}
	}
	this._playingVid=this.vids[num];
	if(this._gallery)
	{
		this._playingVid.a=1;
		MyUtils.autoAlpha(this._playingVid,1);
		if(!this._playingVid.src)
			this._playingVid.src=this._playingVid.srcLoc;
	}
	this._playingVid.play();
}

Slits.prototype.stopVids=function()
{
	if(this._playingVid)
	{
		this._playingVid.pause();
		this._playingVid=null;
	}
}

Slits.prototype._onFloatiesOut=function()
{
	var timeline=new TimelineLite({onUpdate:this._positionSlits,onUpdateScope:this});
	if(this.activeButton)
	{
		this.activeButton.out();
		this.activeButton=null;
	}
	for(var i=0; i<this.numSections; i++)
	{
		if(this.vids[i] && !this._gallery)
		{
			this.stopVids();
		}
		timeline.insert(TweenLite.to(this.slanteds[i], 0.5, {offset:0, ease:Cubic.easeInOut}),0);	
	}
}

Slits.prototype.pause=function()
{
	MyUtils.removeMouseEnter(this.slanteds);
	MyUtils.removeMouseLeave(this.element);
	window.removeEventListener("resize",this._onResizeHandler);
	MyUtils.removeEventListener(this.slanteds,"mousemove", this._onSlantedOverHandler);
	if(this._shj)
		this._shj.stop();
}

Slits.prototype.deactivate=function()
{
	this.pause();
	this.stopVids();
}
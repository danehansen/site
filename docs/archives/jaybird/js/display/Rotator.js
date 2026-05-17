"use strict";
Rotator._instance;
Rotator._FRAMES=250;
function Rotator(element, hotspotData)
{
	Rotator._instance=this;
	this._isActive=false;
	this._360=new MySprite(element.querySelector(".rotator"), 17, Rotator._FRAMES);
	this._hotspots=[];
	var lis=element.querySelectorAll(".text li");
	var hotspots=element.querySelectorAll(".hotspots li");
	this._caret=new MySprite(element.querySelector(".caret"),5, 105);
	this._caret.progress(0.5);
	this._hotspotTimeline=new TimelineLite({paused:true});
	for(var i=0, iLen=lis.length; i<iLen; i++)
	{
		var hotspot=new Hotspot(lis[i], i==0?null:hotspots[i-1]);
		this._hotspots.push(hotspot);
		if(i==0)
			hotspot.open();
		else
			MyEase.keyframe(hotspots[i-1], this._hotspotTimeline, hotspotData[i-1], true, true);
	}
	this._hotspotTimeline.progress(1);
	this._draggable=new Draggable(this._360.elements[0].querySelector(".invisible"), {type:"x", trigger:this._360.elements[0], throwProps:true, onThrowUpdate:this._onDrag, onThrowUpdateScope:this, onDrag:this._onDrag, onDragScope:this, zIndexBoost:false, cursor:null});
	ThrowPropsPlugin.track(this._draggable, "x");
	this._lastVel=0;
}

Rotator.prototype._onDrag=function(evt)
{
	var x=this._draggable.x;
	var vel=ThrowPropsPlugin.getVelocity(this._draggable, "x");
	if(Math.abs(vel)<1)
		vel=0;
	if(vel>0 && this._lastVel<=0)
		TweenLite.to(this._caret, 0.5, {progress:1, ease:Cubic.easeOut});
	else if(vel<0 && this._lastVel>=0)
		TweenLite.to(this._caret, 0.5, {progress:0, ease:Cubic.easeOut});
	else if(vel==0 && this._lastVel!=0)
		TweenLite.to(this._caret, 0.5, {progress:0.5, ease:Cubic.easeOut});	
	this._lastVel=vel;
	x=x*0.0008;
	if(x<0)
		var dest=(1-((-x)%1));
	else
		dest=(x%1);
	this._hotspotTimeline.progress(dest);
	this._360.currentFrame(Math.floor(dest*Rotator._FRAMES));

	if(dest > 0.75 || dest < 0.25)
	{
		this._hotspots[1].className("");
		this._hotspots[2].className("hidden");
	}
	else
	{
		this._hotspots[1].className("hidden");
		if(dest > 0.45 && dest < 0.55)
			this._hotspots[2].className("hidden");
		else
			this._hotspots[2].className("");
	}
}

Rotator.prototype.activate=function()
{
	this._isActive=true;
	this._draggable.enable();
	for(var i=1, iLen=Hotspot.instances.length; i<iLen; i++)
	{
		Hotspot.instances[i].activate();
	}
}

Rotator.prototype.deactivate=function()
{
	this._isActive=false;
	this._draggable.disable();
	for(var i=1, iLen=Hotspot.instances.length; i<iLen; i++)
	{
		Hotspot.instances[i].deactivate();
	}
}

Rotator.prototype.progress=function(num)
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

Rotator.progress=function(num)
{
	Rotator._instance._360.progress(num);
}

//hotspot

	Hotspot.instances=[];

	function Hotspot(textElement, hotspotElement)
	{
		Hotspot.instances.push(this);
		if(hotspotElement)
		{
			this._className="";
			this._hotspot=hotspotElement;
			this._isOver=false;
			this._overTimeline=new TimelineLite({paused:true});
			this._arrow=hotspotElement.querySelector(".arrow");
			this._overTimeline.insert(TweenLite.fromTo(this._arrow, 0.2, {borderTopWidth:18.2, borderRightWidth:10.5, borderLeftWidth:10.5, width:0}, {borderTopWidth:21, borderRightWidth:0, borderLeftWidth:0, width:21, ease:Cubic.easeInOut}),0);
			this._overTimeline.insert(TweenLite.fromTo(hotspotElement.querySelector("p"), 0.2, {autoAlpha:0}, {autoAlpha:1, ease:Cubic.easeOut}),0.2);
			this._overTimeline.insert(TweenLite.from(hotspotElement.querySelector("p"), 0.2, {width:0, ease:Cubic.easeOut}),0.2);
			var plus=hotspotElement.querySelector(".plus");
			this._overTimeline.insert(TweenLite.fromTo(plus, 0.2, {autoAlpha:0}, {autoAlpha:1, ease:Linear.easeNone}),0.2);
			this._onMouseEnterHandler=MyUtils.bind(this._onMouseEnter, this);
			this._onMouseLeaveHandler=MyUtils.bind(this._onMouseLeave, this);
			this._onClickHandler=MyUtils.bind(this._onClick, this);
		}
		
		this._isOpen=false;
		this._openTimeline=new TimelineLite({paused:true});
		this._openTimeline.insert(TweenLite.fromTo(textElement.querySelector("h1"), 0.5, {autoAlpha:0}, {autoAlpha:1, ease:Linear.easeNone}));
		this._openTimeline.insert(TweenLite.fromTo(textElement.querySelector(".notched"), 0.5, {autoAlpha:0}, {autoAlpha:1, ease:Linear.easeNone}));
		this._openTimeline.insert(TweenLite.fromTo(textElement.querySelector("li > p"), 0.5, {autoAlpha:0}, {autoAlpha:1, ease:Linear.easeNone}));
		var img=textElement.querySelector("li > div");
		if(img)
		{
			this._openTimeline.insert(TweenLite.fromTo(img, 0.5, {autoAlpha:0, width:0, height:0, right:-154, top:116}, {autoAlpha:1, width:212, height:212, right:-260, top:10, ease:Cubic.easeOut}));
			this._openTimeline.insert(TweenLite.fromTo(plus, 0.5, {rotation:0}, {rotation:135, ease:Cubic.easeInOut}));
		}
	}

	Hotspot.prototype.className = function(str)
	{
		if(this._hotspot && str !== this._className)
		{
			this._className = str;
			this._hotspot.className = str;
		}
	}

	Hotspot.prototype.activate=function()
	{
		MyUtils.addMouseEnter(this._hotspot, this._onMouseEnterHandler);
		MyUtils.addMouseLeave(this._hotspot, this._onMouseLeaveHandler);
		MyUtils.addEventListener(this._arrow, "click", this._onClickHandler);
	}

	Hotspot.prototype.deactivate=function()
	{
		MyUtils.removeMouseEnter(this._hotspot, this._onMouseEnterHandler);
		MyUtils.removeMouseLeave(this._hotspot, this._onMouseLeaveHandler);
		MyUtils.removeEventListener(this._arrow, "click", this._onClickHandler);
	}

	Hotspot.prototype._onMouseEnter=function()
	{
		if(!this._isOver)
		{
			this._isOver=true;
			this._overTimeline.play();
		}
	}

	Hotspot.prototype._onMouseLeave=function()
	{
		if(!this._isOpen)
		{
			this._isOver=false;
			this._overTimeline.reverse();
		}
	}

	Hotspot.prototype._onClick=function(evt)
	{
		evt.preventDefault();
		if(this._isOpen)
		{
			this.close();
			Hotspot.instances[0].open();
		}
		else
		{
			this.open();
		}
	}

	Hotspot.prototype.open=function()
	{
		if(!this._isOpen)
		{
			for(var i=0; i<Hotspot.instances.length; i++)
			{
				Hotspot.instances[i].close();
			}
			this._isOpen=true;
			this._openTimeline.play();
		}
	}

	Hotspot.prototype.close=function()
	{
		if(this._isOpen)
		{
			this._isOpen=false;
			this._openTimeline.reverse();
		}
	}
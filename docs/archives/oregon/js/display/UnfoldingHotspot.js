"use strict";
	
UnfoldingHotspot.instances=[];

function UnfoldingHotspot(element)
{
	this.element=element;
	this._upsideDown=false;
	UnfoldingHotspot.instances.push(this);
	this.render=new MyCanvas(element.querySelector("canvas"));
	this.width=this.render.width();
	this.height=this.render.height();
	this.video=element.querySelector("video");
	this.img=element.querySelector("img");
	this.drawHandler=MyUtils.bind(this.draw,this);
	var backgroundParams={onUpdate:MyUtils.bind(this.draw, this)};
	if(this.video || this.img)
	{
		this.buffer=new MyCanvas(this.width,this.height);
		if(this.video)
		{
			backgroundParams.onComplete=MyUtils.bind(this.onHotspotOpen, this);
			backgroundParams.onReverseComplete=MyUtils.bind(this.onHotspotClosed, this);
		}
	}
	this.unfoldingBackground=new UnfoldingBackground(this.width,this.height,backgroundParams,false);
	this.p=element.querySelector("p");
	this.isOpen=false;
	this.button=element.querySelector(".diamondButton");
	this.db=new DiamondButton(this.button);
	this._onMouseEnterHandler=MyUtils.bind(this.db.over,this.db);
	this._onMouseLeaveHandler=MyUtils.bind(this.db.out,this.db);
	this._onClickHandler=MyUtils.bind(this.click,this);
	MyUtils.addMouseEnter(this.button, this._onMouseEnterHandler);
	MyUtils.addMouseLeave(this.button, this._onMouseLeaveHandler);
	this.button.addEventListener("click",this._onClickHandler);
}

UnfoldingHotspot.prototype.loadVideo=function(str)
{
	if(this.video)
		this.video.src="vid/diamond/"+str+vidExt();
}

UnfoldingHotspot.prototype.writeTimeline=function()
{
	this.unfoldingBackground.writeTimeline();
	if(this.p)
		this.unfoldingBackground.timeline.insert(new TweenLite(this.p, 0.5, {autoAlpha:1, ease:Linear.easeNone}),0.5);
	if(this.video)
	{
		this.video.currentTime=0;
		this.video.play();
	}
}

UnfoldingHotspot.prototype.onHotspotOpen=function()
{
	TweenLite.ticker.addEventListener("tick", this.drawHandler);
}

UnfoldingHotspot.prototype.onHotspotClosed=function()
{
	TweenLite.ticker.removeEventListener("tick", this.drawHandler);
	this.draw();
	if(this.video)
		this.video.pause();
}

UnfoldingHotspot.prototype.draw=function()
{
	this.render.context.clearRect(0,0,this.width,this.height);
	if(this.video || this.img)
	{
		this.buffer.context.clearRect(0,0,this.width,this.height);
		this.buffer.context.globalCompositeOperation="source-over";
		this.buffer.context.drawImage(this.video || this.img,0,0);
		this.buffer.context.globalCompositeOperation="destination-in";
		this.drawBlacks(this.buffer.context);
		this.render.context.drawImage(this.buffer.canvas,0,0);
	}
	else
	{
		this.drawBlacks(this.render.context);
	}
}

UnfoldingHotspot.prototype.upsideDown=function(set)
{
	if(set && set!=this._upsideDown)
	{
		this._upsideDown=set;
		if(set)
			MyUtils.addClass(this.element,"upsideDown");
		else
			MyUtils.removeClass(this.element,"upsideDown");
	}
}

UnfoldingHotspot.prototype.drawBlacks=function(context)
{
	if(this._upsideDown)
	{
		context.save();
		context.transform(1,0,0,-1,0,this.render.height());
		context.drawImage(this.unfoldingBackground.canvas.canvas,0,0);
		context.restore();
	}
	else
	{
		context.drawImage(this.unfoldingBackground.canvas.canvas,0,0);
	}	
}

UnfoldingHotspot.prototype.click=function(evt)
{
	MySounds.play(FX.click);
	evt.preventDefault();
	if(this.isOpen)
		this.close(evt);
	else
		this.open(evt);
}

UnfoldingHotspot.prototype.open=function(evt)
{
	this.button.removeEventListener("click",this._onClickHandler);
	if(evt)
		evt.stopImmediatePropagation();
	for(var i=0,len=UnfoldingHotspot.instances.length; i<len; i++)
	{
		var targ=UnfoldingHotspot.instances[i];
		if(targ!=this && targ.isOpen)
		{
			targ.close();
			targ.db.out();
		}
	}
	this.isOpen=true;
	this.db.open();
	this.db.timeline.play();
	if(!this.unfoldingBackground.timeline || this.unfoldingBackground.timeline.progress()==0)
		this.writeTimeline();
	this.unfoldingBackground.timeline.play();
	MyUtils.addClass(this.element,"open");
	body().addEventListener("click",this._onClickHandler);
}

UnfoldingHotspot.prototype.close=function(evt)
{
	body().removeEventListener("click",this._onClickHandler);
	if(evt)
		evt.stopImmediatePropagation();
	MyUtils.removeClass(this.element,"open");
	this.isOpen=false;
	this.db.close();
	this.db.out();
	this.unfoldingBackground.timeline.reverse();
	this.button.addEventListener("click",this._onClickHandler);
}

UnfoldingHotspot.prototype.deactivate=function()
{
	if(this.isOpen)
		body().removeEventListener("click",this._onClickHandler);
	else
		this.button.removeEventListener("click",this._onClickHandler);
	if(this.video)
		this.onHotspotClosed();
	UnfoldingHotspot.instances.splice(UnfoldingHotspot.instances.indexOf(this),1);
	MyUtils.removeMouseEnter(this.button);
	MyUtils.removeMouseLeave(this.button);
}
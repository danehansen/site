"use strict";

GoZone._GREEN_LENGTH=Math.PI/9;
GoZone._GO=0.4;
function GoZone()
{
	this.dayElement=document.querySelector("#rotating .day .goZone");
	this._amount=0;
	var goAngle=Activity.START_ANGLE-GoZone._GO*Activity.SPAN;
	//canvas
		this._render=new MyCanvas(this.dayElement.querySelector("canvas"));
		this._buffer=new MyCanvas(Dashboard.WIDTH,Dashboard.HEIGHT);
		this._static=new MyCanvas(Dashboard.WIDTH,Dashboard.HEIGHT);
		this._static.context.drawImage(Activity.background(),0,0);
		this._static.context.strokeStyle=Dashboard.GRAY_LIGHT;
		Dashboard.drawTick(this._static.context, goAngle);
		this._witchHat=new MyCanvas(Dashboard.WIDTH,Dashboard.HEIGHT);
		this._witchHat.context.lineWidth=3;
		Dashboard.drawArc(this._witchHat.context, Math.PI/2+GoZone._GREEN_LENGTH/2, Math.PI/2-GoZone._GREEN_LENGTH/2, Dashboard.RADIUS-this._witchHat.context.lineWidth/2-1.5);
		var width=15;
		var y=Dashboard.CENTER.y-Dashboard.RADIUS+2;
		this._witchHat.context.beginPath();
		this._witchHat.context.moveTo(Dashboard.CENTER.x+width/2, y);
		this._witchHat.context.lineTo(Dashboard.CENTER.x, y-35);
		this._witchHat.context.lineTo(Dashboard.CENTER.x-width/2, y);
		this._witchHat.context.closePath();
		this._witchHat.context.fill();
		this._green=new MyCanvas(Dashboard.WIDTH,Dashboard.HEIGHT);

	//svg
		Dashboard.curveTextPath(this.dayElement.querySelector("svg defs #fatigued"), Activity.START_ANGLE, goAngle);
		Dashboard.curveTextPath(this.dayElement.querySelector("svg defs #go"), goAngle, Activity.END_ANGLE);
		this._big=this.dayElement.querySelector("svg .big");
		this._bigs=this._big.querySelectorAll("tspan:first-child");
		this._shine=this.dayElement.querySelector("svg #goZoneShine");
	this._faders=[this.dayElement.querySelector("h2"), this._big];
	this._drawDaily();
	MyUtils.addEventListener(document.querySelectorAll("#fading .goZone .faqs button"), "click", this._onFAQClick);
}

GoZone.prototype.activate=function()
{

}

GoZone.prototype.deactivate=function()
{
	
}

GoZone.prototype.displayData=function(data)
{
	this._data=data;
	if(data.days.length==1)
	{
		TweenLite.to(this._faders, 0.3, {opacity:0, ease:Linear.easeNone, onComplete:this._changeDailyText, onCompleteScope:this});
		TweenLite.to(this, 2, {amount:data.days[0].goZone.num, ease:Elastic.easeOut});
	}
	else
	{

	}
}

GoZone.prototype._changeDailyText=function()
{	
	for(var i=0, iLen=this._bigs.length; i<iLen; i++)
	{
		while (this._bigs[i].firstChild)
		{
			this._bigs[i].removeChild(this._bigs[i].firstChild);
		}
		this._bigs[i].appendChild(document.createTextNode(this._data.days[0].goZone.string));
	}
	Dashboard.adjustShine(this._big, this._shine);
	TweenLite.to(this._faders, 0.3, {opacity:1, ease:Linear.easeNone});
}

GoZone.prototype._drawDaily=function()
{
	this._buffer.context.clearRect(0,0,Dashboard.WIDTH,Dashboard.HEIGHT);
	this._render.context.clearRect(0,0,Dashboard.WIDTH,Dashboard.HEIGHT);
	this._green.context.clearRect(0,0,Dashboard.WIDTH,Dashboard.HEIGHT);
	this._buffer.context.drawImage(this._static.canvas,0,0);
	this._green.context.shadowBlur = 0;
	this._green.context.shadowOffsetX = 0;
	this._green.context.shadowOffsetY = 0;
	this._green.context.save();
	this._green.context.translate(Dashboard.CENTER.x,Dashboard.CENTER.y);
	this._green.context.rotate(Activity.START_ANGLE+Activity.SPAN*this._amount);
	this._green.context.drawImage(this._witchHat.canvas,-Dashboard.CENTER.x,-Dashboard.CENTER.y);
	this._green.context.restore();
	this._green.context.globalCompositeOperation="source-atop";
	this._green.context.drawImage(GoZone.gradient(),0,0);
	this._green.context.globalCompositeOperation="source-over";
	this._buffer.context.save();
	this._buffer.context.shadowColor="rgba(0,0,0,0.1)";
	this._buffer.context.shadowBlur=3;
	this._buffer.context.shadowOffsetX=-4;
	this._buffer.context.shadowOffsetY=3;
	this._buffer.context.drawImage(this._green.canvas,0,0);
	this._buffer.context.restore();
	this._render.context.drawImage(this._buffer.canvas,0,0);
}

GoZone.prototype._onFAQClick=function(evt)
{
	var targ=evt.currentTarget.parentNode;
	var open=true;
	if(MyUtils.hasClass(targ, "open"))
		open=false;
	var opens=document.querySelectorAll("#fading .goZone .faqs .open");
	for(var i=0, iLen=opens.length; i<iLen; i++)
	{
		TweenLite.to(opens[i], 0.2, {height:69, ease:Cubic.easeInOut});
		opens[i].className="";
	}
	if(open)
	{
		TweenLite.to(targ, 0.2, {height:69+targ.querySelector("p").offsetHeight, ease:Cubic.easeInOut});
		targ.className="open";
	}
}

GoZone.prototype.amount=function(num)
{
	if(typeof num=="number")
	{
		if(num!=this._amount)
		{
			this._amount=num;
			this._drawDaily();
		}
	}
	else
	{
		return this._amount;
	}
}

GoZone._gradient=null;
GoZone.gradient=function()
{
	if(!GoZone._gradient)
	{
		var mc=new MyCanvas(Dashboard.WIDTH, Dashboard.HEIGHT);
		var ctx=mc.context;
		var gradient=ctx.createLinearGradient(0, 0, 0, Dashboard.HEIGHT);
		gradient.addColorStop(0,"#D1EB24");
		gradient.addColorStop(1,"#4EBD1E");
		ctx.fillStyle=gradient;
		ctx.fillRect(0,0,Dashboard.WIDTH, Dashboard.HEIGHT);
		GoZone._gradient=mc.canvas;
	}
	return GoZone._gradient;
}
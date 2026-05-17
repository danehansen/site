"use strict";
	
//////////////////////////////////////////////////
//author:Dane Hansen/////////////////////////////
//www.danehansen.com////////////////////////////
///////////////////////////////////////////////

	//requires danehansen/MyCanvas.js

function Preloader(element, color, hole, callback)
{
	this.element=element;
	this.callback=callback;
	this.color=color;
	this.render=new MyCanvas(element);
	this.width=this.render.width();
	this.height=this.render.height();
	this.radius=Math.min(this.width,this.height)/2;
	this.hole=hole;
	this.center={x:this.width/2,y:this.height/2};
	this._progress=0;
}

Preloader.prototype.progress=function(num)
{
	if(typeof num=="number")
	{
		this._progress=num;
		this.draw();
	}
	else
	{
		return this._progress;
	}
}

Preloader.prototype.clear=function()
{
	this.render.context.clearRect(0,0,this.width,this.height);
}

Preloader.prototype.draw=function()
{
	this.clear();
	var rotates=Math.floor(this._progress)+1;
	var correctedFraction=1-((this._progress%1)+rotates%2);
	if(correctedFraction!=0)
	{
		var start;
		var end;
		this.render.context.lineWidth=Math.abs(this.radius-this.hole);
		this.render.context.strokeStyle=this.color;
		this.render.context.beginPath();
		var start=-Math.PI/2;
		if(correctedFraction==1)
		{
			end=Math.PI*2;
			this.render.context.arc(this.center.x,this.center.y,(this.radius+this.hole)/2,start,end);
		}
		else
		{
			end=Math.PI*2*(this._progress%1)+start;
			this.render.context.arc(this.center.x,this.center.y,(this.radius+this.hole)/2,rotates%2==0?end:start,rotates%2==0?start:end,start>end);
		}
		this.render.context.stroke();
		this.render.context.closePath();
	}
}

Preloader.prototype.end=function()
{
	var dest=Math.ceil(this._progress);
	if(dest%2!=0)
		dest++;
	TweenLite.to(this, (dest-this._progress)*0.5, {progress:dest, ease:Cubic.easeInOut, onComplete:this._onComplete, onCompleteScope:this});
}

Preloader.prototype._onComplete=function()
{
	this.clear();
	this.element.style.display="none";
	if(this.callback)
		this.callback();
}
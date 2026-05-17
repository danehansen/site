"use strict";

function Ring(selector, args)
{
	this._endPercent=args.num;
	this._selector=selector;

	this._SIZE=150;
	this._EMPTY="#FFF200";
	this._FULL="#9A9DA0";
	this._NUMBER="#9A9DA0";
	this._RING_WIDTH=13;
	this._END_RADIUS=67;
	this.currentRadius=0;
	this.currentPercent=0;
	this._canvas;
	this._context;
	this._bufferCanvas;
	this._bufferContext;
	this._START_ANGLE=-Math.PI/2;
	this._canInit=true;
}	

Ring.prototype.execute=function()
{
	if(this._canInit)
	{
		this._canInit=false;
		this._canvas=$(this._selector)[0];
		this._canvas.width=this._SIZE
		this._canvas.height=this._SIZE;
		this._context=this._canvas.getContext("2d");
		this._context.font = "0pt NexaBlack";
		this._bufferCanvas=document.createElement("canvas");
		this._bufferContext=this._bufferCanvas.getContext("2d");
		this._bufferContext.canvas.width=this._SIZE;
		this._bufferContext.canvas.height=this._SIZE;
		this._draw();
		var tll=new TimelineLite({onUpdate:this._draw, onUpdateScope:this});
		// tll.insert(TweenLite.to(this, this._endPercent*0.05+0.75, {delay:MyMath.random(0.1,0.4), currentPercent:this._endPercent, ease:Cubic.easeOut}),0);
		tll.insert(TweenLite.to(this, MyMath.random(0.8,1.0), {delay:MyMath.random(0.1,0.4), currentRadius:this._END_RADIUS, ease:Back.easeOut}),0);
	}
};

Ring.prototype._draw=function()
{
	this._blank();

	var radius=this.currentRadius-this._RING_WIDTH/2;
	var stroke=this._RING_WIDTH;
	if(radius<this._RING_WIDTH/2)
	{
		stroke=this.currentRadius;
		radius=stroke/2;
	}
	this._bufferContext.lineWidth = stroke;

	if(this.currentRadius>this._RING_WIDTH)
	{
		this._bufferContext.save();
		this._bufferContext.arc(this._SIZE/2,this._SIZE/2,this.currentRadius-this._RING_WIDTH/2,0,2*Math.PI);
		this._bufferContext.clip();
		
		var string=this._endPercent+"%";
		this._bufferContext.font = "28pt NexaBlack";
		var endPercentWidth = this._bufferContext.measureText(string).width;
		
		string=Math.round(this.currentPercent)+"%";
		this._bufferContext.fillStyle = this._NUMBER;
		this._bufferContext.textAlign = "right";
		this._bufferContext.fillText(string, this._SIZE/2+endPercentWidth/2, this._SIZE/2+11);
		this._bufferContext.restore();
	}

	this._bufferContext.strokeStyle = this._EMPTY;
	this._bufferContext.beginPath();
	this._bufferContext.arc(this._SIZE/2,this._SIZE/2,radius,0,2*Math.PI);
	this._bufferContext.stroke();

	this._bufferContext.strokeStyle = this._FULL;
	this._bufferContext.beginPath();
	this._bufferContext.arc(this._SIZE/2,this._SIZE/2,radius,this._START_ANGLE,this._START_ANGLE+2*Math.PI*this.currentPercent/100);
	this._bufferContext.stroke();

	this._context.drawImage(this._bufferCanvas, 0,0,this._SIZE,this._SIZE);
};

Ring.prototype.percent=function(num)
{
	this.currentPercent=num;
	this._draw();
}

Ring.prototype._blank=function()
{
	this._context.clearRect (0, 0, this._SIZE, this._SIZE);
	this._bufferContext.clearRect (0, 0, this._SIZE, this._SIZE);
};
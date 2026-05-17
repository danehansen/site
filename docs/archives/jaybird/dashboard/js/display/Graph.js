"use strict";

Graph._scalePoint=function(point, xOffset, yOffset, width, height)
{
	var point={x:xOffset+point.x*width, y:yOffset+height*(1-point.y)}
	return point;
}

function Graph(render, callback, x, y, width, height, filled)
{
	this._callback=callback;
	this.buffer=new MyCanvas(render.width(), render.height());
	this._x=x;
	this._y=y;
	this._width=width;
	this._height=height;
	this._xFull=this._x+this._width;
	this._yZero=this._y+this._height;
	this._filled=filled;
	this._points=[];
	MyUtils.bindAll(this, "_draw");
}

Graph.prototype.plot=function(points)
{
	for(var i=0, iLen=points.length; i<iLen; i++)
	{
		points[i]=Graph._scalePoint(points[i], this._x, this._y, this._width, this._height);
	}
	var timeline=new TimelineLite({onUpdate:this._draw});
	for(var i=0, iLen=this._points.length; i<iLen; i++)
	{
		if(this._points[i].y!=this._yZero)
			timeline.insert(TweenLite.to(this._points[i], 0.5, {y:this._yZero, ease:Expo.easeOut}),0);
	}
	var time=timeline.duration();
	timeline.call(this._setPoints, [points], this);
	for(i=0, iLen=points.length; i<iLen; i++)
	{
		if(points[i].y!=this._yZero)
			timeline.insert(TweenLite.from(points[i], 0.5, {y:this._yZero, ease:Cubic.easeInOut}),time+points[i].x/this._xFull*0.2);
	}
}

Graph.prototype._setPoints=function(points)
{
	this._points=points;
}

Graph.prototype._draw=function()
{
	this.buffer.context.clearRect(0,0,this.buffer.width(),this.buffer.height());
	if(this._points.length>0)
	{
		this.buffer.context.beginPath();
		this.buffer.context.moveTo(this._points[0].x,this._points[0].y);
		if(this._points.length==9)
			var curviness=1.2;
		else if(this._points.length==14)
			curviness=1.2;
		else
			curviness=0.6;
		var segments=BezierPlugin.bezierThrough(this._points, curviness);
		for(var i=0, iLen=this._points.length-1; i<iLen; i++)
		{
			this.buffer.context.bezierCurveTo(segments.x[i].b, segments.y[i].b, segments.x[i].c, segments.y[i].c, segments.x[i].d, segments.y[i].d);
		}
		if(this._filled)
		{
			this.buffer.context.lineTo(this._xFull,this._yZero);
			this.buffer.context.lineTo(this._x,this._yZero);
			this.buffer.context.closePath();
			this.buffer.context.fill();
		}
		else
		{
			this.buffer.context.stroke();
		}
		this._callback();
	}
}
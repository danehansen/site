"use strict";

Fillbar.BLUE=
{
	left:"#0C8DE6",
	right:"#34E4F9"
};
Fillbar.GREEN=
{
	left:"#8CD321",
	right:"#D1EB24"
};
Fillbar.GRAY=
{
	left:"#A6A6A6",
	right:"#DCDCDC"
};
Fillbar._FOOTPRINT_COLOR="#E6E6E6";
Fillbar._WIDTH=170;
Fillbar._HEIGHT=16;
Fillbar._EXTRUSION_HEIGHT=5;
Fillbar._EXTRUSION_ANGLE=0.4*Math.PI;
Fillbar._EXTRUSION_SIN=Math.sin(Math.PI*0.5+Fillbar._EXTRUSION_ANGLE);
Fillbar._EXTRUSION_COS=Math.cos(Math.PI*0.5+Fillbar._EXTRUSION_ANGLE);
Fillbar._CUT_ANGLE=Math.PI*0.2;
Fillbar._CUT_OFFSET=Fillbar._HEIGHT/(Math.tan(Math.PI*0.5-Fillbar._CUT_ANGLE));
function Fillbar(element, color)
{
	this._amount=0;
	this._depth=0;
	this._xOffset=0;
	this._yOffset=0;
	this._render=new MyCanvas(element);
	this._topLeft={x:this._render.width()/2-Fillbar._WIDTH/2, y:this._render.height()/2-Fillbar._HEIGHT/2};
	this._buffer=new MyCanvas(this._render.width(), this._render.height());
	this._footprint=new MyCanvas(this._render.width(), this._render.height());
	this._footprint.context.fillStyle=Fillbar._FOOTPRINT_COLOR;
	this._draw2DFill(this._footprint.context, 1);
	this._gradient=this._buffer.context.createLinearGradient(this._topLeft.x-Fillbar._EXTRUSION_HEIGHT,0,this._topLeft.x+Fillbar._WIDTH, 0);
	this._gradient.addColorStop(0, color.left);
	this._gradient.addColorStop(1, color.right);
	this._draw();
}

Fillbar.prototype.amount=function(num)
{
	if(typeof num=="number")
	{
		if(num!=this._amount)
			this._amount=num;
	}
	else
	{
		return this._amount;
	}
}

Fillbar.prototype.depth=function(num)
{
	if(typeof num=="number")
	{
		if(num!=this._depth)
		{
			this._depth=num;
			this._xOffset=Fillbar._EXTRUSION_COS*this._depth*Fillbar._EXTRUSION_HEIGHT;
			this._yOffset=-Fillbar._EXTRUSION_SIN*this._depth*Fillbar._EXTRUSION_HEIGHT;
		}
	}
	else
	{
		return this._depth;
	}
}

Fillbar.prototype._draw2DFill=function(ctx, num)
{
	var points=[];
	num=Math.min(num,1);
	var left=this._topLeft.x+this._xOffset;
	var top=this._topLeft.y+this._yOffset;
	ctx.beginPath();
	ctx.moveTo(left, top);
	var topRight=new MyPoint(left+Fillbar._WIDTH*num, top);
	ctx.lineTo(topRight.x, topRight.y);
	points.push(topRight);
	var bottomRight=new MyPoint(topRight.x-Fillbar._CUT_OFFSET, top+Fillbar._HEIGHT);
	if(bottomRight.x<left)
	{
		var relPerc=MyMath.relativePercentage(topRight.x, bottomRight.x, left);
		bottomRight=MyPoint.interpolate(topRight, bottomRight, relPerc);
	}
	ctx.lineTo(bottomRight.x, bottomRight.y);
	points.push(bottomRight);
	if(bottomRight.x>left)
	{
		ctx.lineTo(left, bottomRight.y);
		points.push({x:left, y:bottomRight.y});
	}
	ctx.closePath();
	ctx.fill();
	return points;
}

Fillbar.prototype.show=function(num)
{
	var timeline=new TimelineLite({onUpdate:this._draw, onUpdateScope:this});
	if(this._amount>0)
		timeline.append(TweenLite.to(this, 0.5, {amount:0, ease:Expo.easeInOut}));
	timeline.append(TweenLite.to(this, 0.001, {depth:0}));
	timeline.append(TweenLite.to(this, 0.75, {amount:num, ease:Cubic.easeInOut}));
	timeline.insert(TweenLite.to(this, 0.6, {depth:1, ease:Cubic.easeInOut}), timeline.duration()-0.5);
}

Fillbar.prototype._draw=function()
{
	this._render.context.clearRect(0,0,this._render.width(), this._render.height());
	this._buffer.context.clearRect(0,0,this._buffer.width(), this._buffer.height());
	this._buffer.context.drawImage(this._footprint.canvas,0,0);
	var ctx=this._buffer.context;
	this._buffer.context.fillStyle=this._gradient;
	var points=this._draw2DFill(ctx, this._amount);
	for(var i=0, iLen=points.length; i<iLen-1; i++)
	{
		ctx.beginPath();
		ctx.moveTo(points[i].x, points[i].y);
		ctx.lineTo(points[i].x-this._xOffset, points[i].y-this._yOffset);
		ctx.lineTo(points[i+1].x-this._xOffset, points[i+1].y-this._yOffset);
		ctx.lineTo(points[i+1].x, points[i+1].y);
		ctx.closePath();
		ctx.fillStyle=this._gradient;
		ctx.fill();
		ctx.fillStyle="rgba(0,0,0,"+((i+1)*0.2)+")";
		ctx.fill();
	}

	this._render.context.drawImage(this._buffer.canvas,0,0);
}
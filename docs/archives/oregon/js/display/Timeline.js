"use strict";
	
Timeline.CHANGE="change";
Timeline.CLICK_TOLERANCE=5;

function Timeline(element)
{
	this.element=element;
	this.indicator=element.querySelector(".indicator");
	this._progress=0;
	this._onMouseDownHandler=MyUtils.bind(this._onMouseDown,this);
	this._onMouseMoveHandler=MyUtils.bind(this._onMouseMove,this);
	this._onMouseUpHandler=MyUtils.bind(this._onMouseUp,this);

	this._onMouseUp();
}

Timeline.prototype.progress=function(num)
{
	if(num)
	{
		if(num!=this._progress)
		{
			this._progress=num;
			this.indicator.style.width=num*100+"%";
		}
	}	
	else
	{
		return this._progress;
	}
}

Timeline.prototype._onMouseDown=function(evt)
{
	if(MyUtils.hasClass(evt.target, 'point') || MyUtils.hasClass(evt.target, 'line') || MyUtils.hasClass(evt.target, 'dot'))
	{
		if(MyUtils.hasClass(evt.target, 'point'))
		{
			var hotspotToOpen = 'hotspot' + evt.target.dataset.hotspotPoint;
		}
		else
		{
			var hotspotToOpen = 'hotspot' + evt.target.parentNode.dataset.hotspotPoint
		}
		for(var i = 0, iLen = UnfoldingHotspot.instances.length; i < iLen; i++ )
		{
			if(UnfoldingHotspot.instances[i].element.id == hotspotToOpen)
			{
				UnfoldingHotspot.instances[i].open();
				UnfoldingHotspot.instances[i].db.over();
			}
		}
	}
	
	this.element.removeEventListener("mousedown", this._onMouseDownHandler);
			
	this._downX=evt.clientX;

	body().addEventListener("mousemove", this._onMouseMoveHandler);
	body().addEventListener("mouseup", this._onMouseUpHandler);
}

Timeline.prototype._onMouseMove=function(evt)
{
	evt.preventDefault();
	if(Math.abs(evt.clientX-this._downX)>Timeline.CLICK_TOLERANCE)
	{
		this.progress(evt.clientX/this.element.offsetWidth);
		this._dispatch();
	}
}

Timeline.prototype._dispatch=function()
{
	this.element.dispatchEvent(new Event(Timeline.CHANGE));
}

Timeline.prototype._onMouseUp=function(evt)
{
	body().removeEventListener("mousemove", this._onMouseMoveHandler);
	body().removeEventListener("mouseup", this._onMouseUpHandler);

	if(evt)
	{
		if(Math.abs(evt.clientX-this._downX)<Timeline.CLICK_TOLERANCE)
			TweenLite.to(this, 0.5, {progress:evt.clientX/this.element.offsetWidth, ease:Cubic.easeOut, onUpdate:this._dispatch, onUpdateScope:this});
	}

	this.element.addEventListener("mousedown", this._onMouseDownHandler);
}

Timeline.prototype.deactivate=function()
{
	body().removeEventListener("mousemove", this._onMouseMoveHandler);
	body().removeEventListener("mouseup", this._onMouseUpHandler);
	this.element.removeEventListener("mousedown", this._onMouseDownHandler);
}
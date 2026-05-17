"use strict";

//////////////////////////////////////////////////
//author:Dane Hansen/////////////////////////////
//www.danehansen.com////////////////////////////
///////////////////////////////////////////////

	//requires jQuery
	//requires TweenLite
	//requires Underscore

function bind(func, context)
{
	var slice=Array.prototype.slice;
	var proto=Function.prototype;
	if(func.bind===proto && proto)
		return proto.apply(func, slice.call(arguments, 1));
	var args=slice.call(arguments, 2);
	return function()
	{
		return func.apply(context, args.concat(slice.call(arguments)));
	};
}

function ScrollHijack(callback, leaveDefaults)
{
	this._touch='ontouchstart' in window;
	this._touchStart={x:0,y:0};
	this._momentum={x:0,y:0};
	//pass in a progress callback
		this._callback=typeof callback!=="undefined"?callback:null;
	//pass in jquery selector of items to have this functionality ignored
		this._leaveDefaults=[];
		if(this._touch)
		{
			if(typeof leaveDefaults!=="undefined")
			{
				var leaveDefaults=$(leaveDefaults);
				for(var i=0; i<leaveDefaults.length; i++)
				{
					this._leaveDefaults.push(leaveDefaults[i]);
				}
			}
			this._onTouchStartHandler=bind(this._onTouchStart,this);
			this._onTouchMoveHandler=bind(this._onTouchMove,this);
			this._onTouchEndHandler=bind(this._onTouchEnd,this);
			this._onMomentumHandler=bind(this._onMomentum,this);
		}
		else
		{
			this._onMouseWheelHandler=bind(this._onMouseWheel,this);
			this._onKeyPressHandler=bind(this._onKeyPress,this);
		}

	this._ARROW_AMOUNT=0.05;
	this._body=$("body")[0];
	this._scrollAmount={x:0,y:0};

	this.start();
}

ScrollHijack.prototype.start=function()
{
	this._momentum={x:0,y:0};
	this._touchStart={x:0,y:0};
	if(this._touch)
	{
		this._body.addEventListener('touchstart', this._onTouchStartHandler, true);
	}
	else
	{
		if(window.addEventListener)
			window.addEventListener('DOMMouseScroll', this._onMouseWheelHandler, false);
		window.onmousewheel=document.onmousewheel=this._onMouseWheelHandler;
		$(document).on("keydown", this._onKeyPressHandler);
	}
}

ScrollHijack.prototype.stop=function()
{
	if(this._touch)
	{
		this._body.removeEventListener('touchstart', this._onTouchStartHandler, true);
	}
	else
	{
		if(window.addEventListener)
			window.removeEventListener('DOMMouseScroll', this._onMouseWheelHandler, false);
		window.onmousewheel=document.onmousewheel=null;
		$(document).off("keydown", this._onKeyPressHandler);
	}
}

//scrollwheel

	ScrollHijack.prototype._onMouseWheel=function(evt)
	{
		evt=evt?evt:window.event;
		if(evt.preventDefault)
			evt.preventDefault();
		evt.returnValue=false;
		var delta=0;
		if(!evt)
			evt=window.event;
		if(evt.wheelDelta)
			delta=evt.wheelDelta/120; 
		else if(evt.detail)
			delta=-evt.detail/3;
		this._scroll({x:0,y:delta});
	}

//touch 

	ScrollHijack.prototype._onTouchStart=function(evt)
	{
		this._preventDefault(evt);
		this._body.removeEventListener('touchstart', this._onTouchStartHandler, true);

		this._removeMomentum();
		this._touchStart={x:evt.touches[0].pageX, y:evt.touches[0].pageY};
		
		this._body.addEventListener('touchmove', this._onTouchMoveHandler, true);
		this._body.addEventListener('touchend', this._onTouchEndHandler, true);
	}

	ScrollHijack.prototype._onTouchMove=function(evt)
	{
		evt.preventDefault();
		this._momentum={x:-(this._touchStart.x-evt.touches[0].pageX)/6,y:-(this._touchStart.y-evt.touches[0].pageY)/6};
		this._touchStart={x:evt.touches[0].pageX, y:evt.touches[0].pageY};
		this._scroll(this._momentum);
	}

	ScrollHijack.prototype._onTouchEnd=function(evt)
	{
		this._preventDefault(evt);
		this._body.removeEventListener('touchmove', this._onTouchMoveHandler, true);
		this._body.removeEventListener('touchend', this._onTouchEndHandler, true);

		TweenLite.ticker.addEventListener("tick", this._onMomentumHandler);
		this._body.addEventListener('touchstart', this._onTouchStartHandler, true);
	}

	ScrollHijack.prototype._onMomentum=function()
	{
		this._momentum.x-=this._momentum.x*0.1;
		this._momentum.y-=this._momentum.y*0.1;
		if(Math.abs(this._momentum.x)<0.025 && Math.abs(this._momentum.y)<0.025)
			this._removeMomentum();
		else
			this._scroll(this._momentum);
	}

	ScrollHijack.prototype._removeMomentum=function()
	{
		TweenLite.ticker.removeEventListener("tick", this._onMomentumHandler);
		this._momentum={x:0,y:0};
	}

	ScrollHijack.prototype._preventDefault=function(evt)
	{
		var kill=true;
		for(var i=0; i<this._leaveDefaults.length; i++)
		{
			if($.contains(this._leaveDefaults[i],evt.target) || this._leaveDefaults[i]==evt.target)
				kill=false;
		}
		if(kill)
			evt.preventDefault();
	}

//arrow keys
	ScrollHijack.prototype._onKeyPress=function(evt)
	{
		evt=evt?evt:window.event;
		if(evt.keyCode>=37 && evt.keyCode<=40)
		{
			if(evt.preventDefault)
				evt.preventDefault();
			evt.returnValue=false;
			switch(evt.keyCode)
			{
				//left
					case 37:
						TweenLite.to(this._scrollAmount, 0.5, {x:this._scrollAmount.x+this._ARROW_AMOUNT, ease:Cubic.easeOut, onUpdate:this._scroll, onUpdateScope:this});
						break;
				//up
					case 38:
						TweenLite.to(this._scrollAmount, 0.5, {y:this._scrollAmount.y-this._ARROW_AMOUNT, ease:Cubic.easeOut, onUpdate:this._scroll, onUpdateScope:this});
						break;
				//right
					case 39:
						TweenLite.to(this._scrollAmount, 0.5, {x:this._scrollAmount.x-this._ARROW_AMOUNT, ease:Cubic.easeOut, onUpdate:this._scroll, onUpdateScope:this});
						break;
				//down
					case 40:
						TweenLite.to(this._scrollAmount, 0.5, {y:this._scrollAmount.y+this._ARROW_AMOUNT, ease:Cubic.easeOut, onUpdate:this._scroll, onUpdateScope:this});
						break;
			}
		}
	}

	ScrollHijack.prototype._scroll=function(delta)
	{
		if(typeof delta!=='undefined')
		{
			this._scrollAmount.x-=delta.x;
			this._scrollAmount.y-=delta.y;
		}
		if(this._callback)
			this._callback(this._scrollAmount);
	}
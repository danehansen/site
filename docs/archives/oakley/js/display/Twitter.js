"use strict";

Twitter._TRANS=0.5;
function Twitter(element)
{
	Globals.twitter=this;
	this._ul=element.querySelector("ul");
	this._currentNum=null;
	this._prev=element.querySelector(".prev");
	this._next=element.querySelector(".next");
	this._prevShowing=true;
	this._nextShowing=false;
}

Twitter.prototype.init=function()
{
	this._lis=this._ul.querySelectorAll("li");
	this._total=this._lis.length;
	if(this._total<2)
	{
		this._nextShowing=false;
		this._next.disabled=true;
	}
	else
	{
		this._prev.addEventListener(Globals.CLICK_EVENT, this._onPrevClick.bind(this));
		this._next.addEventListener(Globals.CLICK_EVENT, this._onNextClick.bind(this));
	}
	this.currentNum(0);
}

Twitter.prototype.currentNum=function(num)
{
	if(typeof num=="number")
	{
		if(num!=this._currentNum && num>=0 && num<this._total)
		{
			this._currentNum=num;
			TweenLite.to(this._ul, Twitter._TRANS, {top:-23*num, ease:Expo.easeInOut});
			for(var i=0; i<this._total; i++)
			{
				if(i<num)
					Twitter.setClass(this._lis[i], "state-1");
				else if(i==num)
					Twitter.setClass(this._lis[i], "state0");
				else if(i==num+1)
					Twitter.setClass(this._lis[i], "state1");
				else if(i==num+2)
					Twitter.setClass(this._lis[i], "state2");
				else if(i==num+3)
					Twitter.setClass(this._lis[i], "state3");
				else
					Twitter.setClass(this._lis[i], "");
			}
			if(num==0 && this._prevShowing)
			{
				this._prevShowing=false;
				this._prev.disabled=true;
			}
			else if(num>0 && !this._prevShowing)
			{
				this._prevShowing=true;
				this._prev.disabled=false;
			}
			if(num==this._total-1 && this._nextShowing)
			{
				this._nextShowing=false;
				this._next.disabled=true;
			}
			else if(num<this._total-1 && !this._nextShowing)
			{
				this._nextShowing=true;
				this._next.disabled=false;
			}
		}
	}
	else
	{
		return this._currentNum;
	}
}

Twitter.setClass=function(element, className)
{
	if(element.__className!=className)
	{
		element.__className=className;
		element.className=className;
	}
}

Twitter.prototype._onPrevClick=function()
{
	this.currentNum(this._currentNum-1);
}

Twitter.prototype._onNextClick=function()
{
	this.currentNum(this._currentNum+1);
}
"use strict";

AmbassadorsTop._NAV_HEIGHT=83;
function AmbassadorsTop(element)
{
	this._headline=new ShatteringHeadline(element.querySelector(".shatteringHeadline"));
	this._sticker=element.querySelector(".ambassador_nav");
	var height=element.offsetHeight;
	var diff=STS.NAV_OPEN_HEIGHT/height;
	this._stickAmount=(height-AmbassadorsTop._NAV_HEIGHT-STS.NAV_CLOSED_HEIGHT)/(height);
	this._stickAmount=0.79;
	this._headerIsSticky=false;
	MyUtils.addEventListener(this._sticker.querySelectorAll("a"),"click",MyUtils.bind(this._onNavClick,this));
}

AmbassadorsTop.prototype.progress=function(num)
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
	if(num>this._stickAmount && !this._headerIsSticky)
	{
		this._headerIsSticky=true;	
		MyUtils.addClass(this._sticker,"sticky");
	}
	else if(num<this._stickAmount && this._headerIsSticky)
	{
		this._headerIsSticky=false;	
		MyUtils.removeClass(this._sticker,"sticky");
	}
}

AmbassadorsTop.prototype.activate=function()
{
	this._isActive=true;
	this._headline.play();
}

AmbassadorsTop.prototype.deactivate=function()
{
	this._isActive=false;
	this._headline.stop();
}

AmbassadorsTop.prototype._onNavClick=function(evt)
{
	evt.preventDefault();
	var id=evt.currentTarget.getAttribute('data-id');
	var element=document.getElementById(id);
	var top=element.offsetTop;
	var dest=top-STS.NAV_CLOSED_HEIGHT-AmbassadorsTop._NAV_HEIGHT;
	TweenLite.to(window, 1, {scrollTo:{y:dest}});
}
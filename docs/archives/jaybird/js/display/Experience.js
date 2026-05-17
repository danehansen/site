"use strict";

Experience._HEADER_HEIGHT=44;
function Experience(element)
{
	this._height=element.offsetHeight;
	this._sideNav=element.querySelector("nav");
	this._sideNavIsSticky=false;
	this._header=element.querySelector("header");
	this._headerIsSticky=false;
	this._headerAmount;
	MyUtils.addEventListener(this._sideNav.querySelectorAll("button"),"click",MyUtils.bind(this._onNavClick,this));
}

Experience.prototype.progress=function(num)
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
	if(num>0.5 && !this._sideNavIsSticky)
	{
		this._sideNavIsSticky=true;	
		this._sideNav.className="sticky";
	}
	else if(num<0.5 && this._sideNavIsSticky)
	{
		this._sideNavIsSticky=false;	
		this._sideNav.className="";
	}
	if(num>this._headerAmount && !this._headerIsSticky)
	{
		this._headerIsSticky=true;	
		this._header.className="sticky";
	}
	else if(num<this._headerAmount && this._headerIsSticky)
	{
		this._headerIsSticky=false;	
		this._header.className="";
	}
}

Experience.prototype.resize=function()
{
	this._headerAmount=(STS.height-STS.NAV_CLOSED_HEIGHT)/(this._height+STS.height);
}

Experience.prototype.activate=function()
{
	this._isActive=true;
}

Experience.prototype.deactivate=function()
{
	this._isActive=false;
}

Experience.prototype._onNavClick=function(evt)
{
	var id=evt.currentTarget.getAttribute('data-id');
	if(id=="productTop")
	{
		var dest=0;
	}
	else
	{
		var element=document.getElementById(id);
		var top=element.offsetTop;
		if(id=="experience")
			dest=top-STS.NAV_CLOSED_HEIGHT;
		else
			dest=top-STS.NAV_CLOSED_HEIGHT-Experience._HEADER_HEIGHT;
	}
	TweenLite.to(window, 1, {scrollTo:{y:dest}});
}
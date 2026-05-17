"use strict";
function EndPage(id)
{
	this._element=document.getElementById(id);
	this._buttons=this._element.querySelectorAll("a");
	var headlines=this._element.querySelectorAll(".headline");
	this._headlines=[];
	for(var i=0, iLen=headlines.length; i<iLen; i++)
	{
		this._headlines.push(new Headline(headlines[i]));
	}
	this._slits=new Slits(this._element, MyUtils.bind(this.positionCenters,this));
}

EndPage.prototype.activate=function()
{
	this._slits.activate();
	for(var i=0, iLen=this._headlines.length; i<iLen; i++)
	{
		this._headlines[i].play();
	}
}

EndPage.prototype.positionCenters=function(array)
{
	var width=array[0]*2;
	this._headlines[0].element.style.left=array[0]-width/2+"px";
	this._headlines[1].element.style.left=array[1]-width/2+"px";
	this._headlines[0].element.style.width=width+"px";
	this._headlines[1].element.style.width=width+"px";
	this._buttons[0].style.left=array[0]+"px";
	this._buttons[1].style.left=array[1]+"px";
}

EndPage.prototype.deactivate=function()
{
	this._slits.deactivate();
	for(var i=0, iLen=this._headlines.length; i<iLen; i++)
	{
		this._headlines[i].deactivate();
	}
}
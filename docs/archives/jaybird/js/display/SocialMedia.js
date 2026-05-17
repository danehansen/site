"use strict";

function SocialMedia(element)
{
	this._cubeAmounts=[];
	this._cubeIsShowing=[];
	this._element=element;
	this._cubes=element.querySelectorAll(".cube");
	this._iLen=this._cubes.length;
	for(var i=0; i<this._iLen; i++)
	{
		this._cubeIsShowing[i]=false;	
	}
}

SocialMedia.prototype.resize=function()
{
	var height=this._element.offsetHeight;
	var elementY=this._element.offsetTop;
	var divisor=height+STS.height;
	for(var i=0; i<this._iLen; i++)
	{
		if(i<this._iLen-1)
			var itemY=this._cubes[i].parentNode.offsetTop;
		this._cubeAmounts[i]=(itemY-elementY+42+50)/divisor;
	}
}

SocialMedia.prototype.progress=function(num)
{
	if(num>=0 && num<=1)
	{
		for(var i=0; i<this._iLen; i++)
		{
			if(!this._cubeIsShowing[i] && num>this._cubeAmounts[i])
			{
				this._cubeIsShowing[i]=true;
				MyUtils.addClass(this._cubes[i], "showing");
			}
			else if(this._cubeIsShowing[i] && num<this._cubeAmounts[i])
			{
				this._cubeIsShowing[i]=false;
				MyUtils.removeClass(this._cubes[i], "showing");	
			}
		}
	}
}
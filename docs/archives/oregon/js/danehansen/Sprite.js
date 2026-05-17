"use strict";
	
//////////////////////////////////////////////////
//author:Dane Hansen/////////////////////////////
//www.danehansen.com////////////////////////////
///////////////////////////////////////////////

	//requires greensock/TweenLite.js
	//requires danehansen/MyUtils.js

function Sprite(elementOrList, numColumns, totalFrames, frameRate)
{
	this._frameRate=frameRate||60;
	this.elements=[];
	if(elementOrList[0])
	{
		for(var i=0, iLen=elementOrList.length; i<iLen; i++)
		{
			this.elements[i]=elementOrList[i];
		}
	}
	else
	{
		this.elements.push(elementOrList);
	}
	this._currentFrame=0;
	this._destFrame=0;
	this._numColumns=numColumns;
	this._totalFrames=totalFrames;
	this._columnWidth=this.elements[0].offsetWidth;
	this._rowHeight=this.elements[0].offsetHeight;
}

Sprite.prototype.goto=function(num)
{
	if(this._destFrame!=num)
	{
		this._destFrame=num;
		TweenLite.killTweensOf(this);
		var dur=Math.abs(num-this.currentFrame())/this._frameRate;
		TweenLite.to(this, dur, {currentFrame:num, ease:Linear.easeNone, roundProps:"currentFrame"});
	}
}

Sprite.prototype.play=function()
{
	this.goto(this._totalFrames-1);
}

Sprite.prototype.rewind=function()
{
	this.goto(0);
}

Sprite.prototype.currentFrame=function(num)
{
	if(typeof num=="number")
	{
		this._currentFrame=num;
		var x=this._columnWidth*(this._currentFrame%this._numColumns);
		var y=this._rowHeight*Math.floor(this._currentFrame/this._numColumns);
		for(var i=0, iLen=this.elements.length; i<iLen; i++)
		{
			this.elements[i].style.backgroundPosition=-x+"px "+-y+"px";;
		}
	}
	else
	{
		return this._currentFrame;
	}
}
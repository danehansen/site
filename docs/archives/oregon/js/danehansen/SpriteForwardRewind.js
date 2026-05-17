"use strict";
	
//////////////////////////////////////////////////
//author:Dane Hansen/////////////////////////////
//www.danehansen.com////////////////////////////
///////////////////////////////////////////////

	//requires jQuery.js
	//requires greensock/TweenLite.js
	//requires danehansen/MyUtils.js
	//requires danehansen/Sprite.js

function SpriteForwardRewind(hoverElementOrList, numColumns, totalFrames, animateElementOrList)
{
	this.hoverElementOrList=hoverElementOrList;
	this._elementsToAnimate=animateElementOrList || hoverElementOrList;
	this._sprite=new Sprite(this._elementsToAnimate, numColumns, totalFrames);
	this._overHandler=MyUtils.bind(this._onRollOver,this);
	this._outHandler=MyUtils.bind(this._onRollOut,this);
	this.activate();
}

SpriteForwardRewind.prototype.activate=function()
{
	MyUtils.addMouseEnter(this.hoverElementOrList, this._overHandler);
	MyUtils.addMouseLeave(this.hoverElementOrList, this._outHandler);
}

SpriteForwardRewind.prototype.deactivate=function()
{
	MyUtils.removeMouseEnter(this.hoverElementOrList);
	MyUtils.removeMouseLeave(this.hoverElementOrList);
}

SpriteForwardRewind.prototype._onRollOver=function(evt)
{
	this._sprite.play();
}

SpriteForwardRewind.prototype._onRollOut=function(evt)
{
	this._sprite.rewind();
}

SpriteForwardRewind.prototype.destroy=function()
{
	this.deactivate();
	this._sprite.destroy();
}
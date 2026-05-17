"use strict";
	
function UnfoldingTextPage(id)
{
	this._id=id;
	this._titleCard=new TitleCard(document.querySelector("#"+id+" .titleCard"));
}

UnfoldingTextPage.prototype.activate=function()
{
	this._render=new MyCanvas(document.querySelector("#"+this._id+" .unfoldingText canvas"));
	this._unfoldingBackground=new UnfoldingBackground(this._render.width(),this._render.height(),{onUpdate:MyUtils.bind(this.draw,this)},true);
	this._unfoldingBackground.writeTimeline();
	this._unfoldingBackground.timeline.play();
	this._titleCard.play();
	
	TweenLite.to(document.querySelectorAll("#"+this._id+" h1"), 0.8, {autoAlpha:1, ease:Cubic.easeOut, delay:0.5, top:0});
	TweenLite.to(document.querySelectorAll("#"+this._id+" p"), 0.8, {autoAlpha:1, ease:Cubic.easeOut, delay:0.5, top:0});
}

UnfoldingTextPage.prototype.draw=function()
{
	this._render.context.clearRect(0,0,this._render.width(),this._render.height());
	this._render.context.drawImage(this._unfoldingBackground.canvas.canvas,0,0);
}

UnfoldingTextPage.prototype.deactivate=function()
{
	this._titleCard.deactivate();
}
"use strict";
	
function DiamondButton(element)
{
	this.element=element;
	this.isOpen=false;
	this.x=element.querySelector(".x");
	this.timeline=new TimelineLite({paused:true});
	var plus=element.querySelector(".plus");
	if(plus)
		this.timeline.insert(TweenLite.to(plus, 0.3, {autoAlpha:0, ease:Linear.easeNone}),0);
	this.timeline.insert(TweenLite.to(element.querySelector(".transGreen"), 0.53, {width:150, height:150, top:14, left:14, ease:Cubic.easeInOut}),0);
	this.timeline.insert(TweenLite.to(element.querySelector(".green"), 0.53, {width:150, height:150, top:0, left:0, ease:Cubic.easeInOut}),0);
	this.timeline.insert(TweenLite.to(element.querySelector(".black"), 0.53, {width:150, height:150, top:0, left:0, ease:Cubic.easeInOut}),0);
	this.timeline.insert(TweenLite.to([element.querySelector(".border.top.left"), element.querySelector(".border.bottom.right")], 0.3, {height:"100%", top:0, ease:Cubic.easeInOut}),0.2);
	this.timeline.insert(TweenLite.to([element.querySelector(".border.top.right"), element.querySelector(".border.bottom.left")], 0.47, {alpha:1, ease:Linear.easeNone}),0.27);
	this.timeline.insert(TweenLite.to(element.querySelector(".outerTitle"), 0.13, {autoAlpha:1, ease:Linear.easeNone}),0.5);
}

DiamondButton.prototype.over=function()
{
	if(this.timeline.progress()<1)
	{
		MySounds.play(FX.diamondOver);
		this.timeline.play();
	}
}

DiamondButton.prototype.out=function()
{
	if(!this.isOpen && this.timeline.progress()>0)
	{
		MySounds.play(FX.diamondOut);
		this.timeline.reverse();
	}
}

DiamondButton.prototype.open=function()
{
	this.isOpen=true;
	TweenLite.to(this.x, 0.3, {autoAlpha:1, ease:Linear.easeNone});
}

DiamondButton.prototype.close=function()
{
	this.isOpen=false;
	TweenLite.to(this.x, 0.3, {autoAlpha:0, ease:Linear.easeNone});
}

DiamondButton.prototype.click=function()
{
	if(this.isOpen)
		this.close();
	else
		this.open();
}
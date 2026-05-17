"use strict";

MainSlideshow._TRANS=1.0;
MainSlideshow._EASE=Expo.easeOut;

function MainSlideshow(element)
{
	this._isActive=false;
	this._timer=new MyTimer(10000);
	this._current=0;
	this._buttons=element.querySelectorAll("button");
	this._ahrefs=element.querySelectorAll("a, button");
	this._onOverHandler=MyUtils.bind(this._onOver,this);
	this._onOutHandler=MyUtils.bind(this._onOut,this);
	this._onClickHandler=MyUtils.bind(this._onClick,this);
	this._onTimerHandler=MyUtils.bind(this._onTimer,this);
	this._slides=element.querySelectorAll(".slides li");
	this._timeline;
	this._numSlides=this._slides.length;
	this._buttons[0].className="selected";
	this._headlines=[];
	this._shadows=[];
	for(var i=0; i<this._numSlides; i++)
	{
		this._headlines.push(new ShatteringHeadline(this._slides[i].querySelector(".shatteringHeadline")));
		this._shadows.push(new MovingShadow(this._slides[i].querySelector(".movingShadow")));
		if(i==0)
		{
			TweenLite.to(this._slides[i].querySelectorAll(".button"), 0.5, {autoAlpha:1, ease:Linear.easeNone, delay:0.5});
			this._buttons[i].upsideDown=true;
			this._slides[i].visible=true;
		}
		else
		{
			this._buttons[i].upsideDown=false;
			this._slides[i].visible=false;
		}
	}
	TweenLite.set(this._buttons[0].parentNode, {rotation:"180deg_cw"});
	TweenLite.to(element.querySelector(".buttons"), MainSlideshow._TRANS, {autoAlpha:1, delay:0.5});
}

MainSlideshow.prototype.progress=function(num)
{
	if(num>=0 && num<=1)
		this.activate();
	else
		this.deactivate();
}

MainSlideshow.prototype.activate=function()
{
	if(!this._isActive)
	{
		this._isActive=true;
		this._timer.reset();
		this._timer.start();
		this._headlines[this._current].play();
		this._shadows[this._current].activate();
		
		MyUtils.addEventListener(this._buttons, "click", this._onClickHandler);
		MyUtils.addMouseEnter(this._ahrefs, this._onOverHandler);
		MyUtils.addMouseLeave(this._ahrefs, this._onOutHandler);
		this._timer.addEventListener(MyTimerEvent.TIMER, this._onTimerHandler);
	}
}

MainSlideshow.prototype.deactivate=function()
{
	if(this._isActive)
	{
		this._timer.removeEventListener(MyTimerEvent.TIMER, this._onTimerHandler);
		MyUtils.removeEventListener(this._buttons, "click", this._onClickHandler);
		MyUtils.removeMouseEnter(this._ahrefs, this._onOverHandler);
		MyUtils.removeMouseLeave(this._ahrefs, this._onOutHandler);

		this._shadows[this._current].deactivate();
		this._headlines[this._current].stop();
		this._timer.stop();
		this._isActive=false;
	}
}

MainSlideshow.prototype._goto=function(num)
{
	num=num%this._numSlides;
	if(this._current!=num)
	{
		var dir=num>this._current?1:-1;
		if(this._timeline)
			this._timeline.kill();
		this._timeline=new TimelineLite({onComplete:this._gotoComplete, onCompleteParams:[this._slides[this._current]], onCompleteScope:this});
		
		this._buttons[this._current].className="";
		this._headlines[this._current].stop();
		this._shadows[this._current].deactivate();
		this._timeline.insert(TweenLite.fromTo(this._slides[this._current], MainSlideshow._TRANS, {left:0},{left:-dir*100+"%", ease:MainSlideshow._EASE}),0);
		this._timeline.insert(TweenLite.fromTo(this._slides[this._current].querySelector("h1"), MainSlideshow._TRANS, {left:0},{left:-dir*800, ease:MainSlideshow._EASE}),0);
		this._timeline.insert(TweenLite.fromTo(this._slides[this._current].querySelector(".button"), MainSlideshow._TRANS, {left:0},{left:-dir*400, ease:MainSlideshow._EASE}),0);

		this._slides[num].visible=true;
		this._slides[num].style.visibility="visible";
		this._buttons[num].className="selected";
		this._headlines[num].reset();
		this._timeline.insert(TweenLite.fromTo(this._slides[num], MainSlideshow._TRANS, {left:dir*100+"%"},{left:0, ease:MainSlideshow._EASE}),0);
		this._timeline.insert(TweenLite.fromTo(this._slides[num].querySelector("h1"), MainSlideshow._TRANS, {left:dir*800},{left:0, ease:MainSlideshow._EASE}),0);
		this._timeline.insert(TweenLite.fromTo(this._slides[num].querySelector(".button"), MainSlideshow._TRANS, {left:dir*400},{left:0, ease:MainSlideshow._EASE}),0);

		this._current=num;
		for(var i=0; i<this._numSlides; i++)
		{
			if(i==this._current && !this._buttons[i].upsideDown)
			{
				this._buttons[i].upsideDown=true;
				this._timeline.insert(TweenLite.to(this._buttons[i].parentNode, MainSlideshow._TRANS, {rotation:"180deg_cw", ease:Cubic.easeInOut}),0);
			}
			else if(i!=this._current && this._buttons[i].upsideDown)
			{
				this._buttons[i].upsideDown=false;
				this._timeline.insert(TweenLite.to(this._buttons[i].parentNode, MainSlideshow._TRANS, {rotation:"0deg_cw", ease:Cubic.easeInOut}),0);
			}
		}
	}
}

MainSlideshow.prototype._gotoComplete=function(last)
{
	this._timeline=null;
	for(var i=0; i<this._numSlides; i++)
	{
		if(this._slides[i].visible && i!=this._current)
		{
			this._slides[i].style.visibility="hidden";
			this._slides[i].visible=false;
		}
	}
	this._headlines[this._current].play();
	this._shadows[this._current].activate();
	this._shadows[this._current].activate();
}

MainSlideshow.prototype._onOver=function()
{
	this._timer.stop();
}

MainSlideshow.prototype._onOut=function()
{
	this._timer.start();
}

MainSlideshow.prototype._onClick=function(evt)
{
	MyUtils.removeMouseEnter(this._ahrefs, this._onOverHandler);
	MyUtils.removeMouseLeave(this._ahrefs, this._onOutHandler);
	evt.preventDefault();
	this._timer.stop();
	this._goto(MyUtils.indexOf(this._buttons,evt.currentTarget));
}

MainSlideshow.prototype._onTimer=function(evt)
{
	this._goto(this._current+1);
}
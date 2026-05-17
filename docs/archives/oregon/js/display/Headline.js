"use strict";
	
Headline.BORDER_MARGIN=120;
Headline._fuzz;

function Headline(element)
{
	this._fuzz;
	this._fuzzTimeout;
	this._playFuzzHandler=MyUtils.bind(this._playFuzz,this);
	this._killFuzzHandler=MyUtils.bind(this._killFuzz,this);
	this.element=element;
	var lines=this.element.innerHTML.split("<br>");
	this.element.innerHTML="";
	this._letters=[];
	this._positioner = document.createElement('div');
	this._top=document.createElement("div");
	this._bottom=document.createElement("div");
	this._positioner.className="positioner";
	this._top.className="top";
	this._bottom.className="bottom";
	this._totalWidths=[];
	this._showing=false;
	this._loaded=0;
	this._letterLoadedHandler=MyUtils.bind(this._letterLoaded,this);
	this._allLoaded=false;
	this._shouldPlay=false;
	this.element.appendChild(this._positioner);
	for(var i=0, iLen=lines.length; i<iLen; i++)
	{
		this._totalWidths[i]=0;
		var str=lines[i];
		for(var j=0, jLen=str.length; j<jLen; j++)
		{
			var letter=new Letter(str.charAt(j).toLowerCase(), this._letterLoadedHandler, i);
			if(str.charAt(j)!=" ")
			{
				this._nonSpaces++;
			}
			this._letters.push(letter);
			this.element.firstChild.appendChild(letter.element);
		}
		if(i<iLen-1)
		{
			this.element.firstChild.appendChild(document.createElement("br"));
		}
	}
	if(lines.length>1)
	{
		// var marginTop=parseFloat(getComputedStyle(this.element).marginTop);
		var marginTop=-70;
		// var lineHeight=this.element.querySelector("div").offsetHeight);
		var lineHeight=125;
		this.element.style.marginTop=marginTop-lineHeight*(lines.length-1)/2+"px";	
	}
	this.element.appendChild(this._top);
	this.element.appendChild(this._bottom);
}

Headline.prototype._letterLoaded=function(row, w)
{
	this._totalWidths[row]+=w;
	this._loaded++;
	if(this._loaded==this._letters.length)
	{
		if(this._totalWidths.length > 1)
			var widestLine = Math.max(this._totalWidths[0],this._totalWidths[1]);
		else
			var widestLine = this._totalWidths[0];
		
		this.element.firstChild.style.width = widestLine + 'px';
		this._allLoaded=true;
		if(this._shouldPlay)
			this.play();
	}
}

Headline.prototype.play=function()
{
	if(!this._showing)
	{
		if(this._allLoaded)
		{
			this._showing=true;
			this._lettersDone=0;
			for(var i=0, iLen=this._letters.length; i<iLen; i++)
			{
				this._letters[i].fadeIn(MyUtils.bind(this._letterDone,this));
			}
			var widest=0;
			for(var i=0, iLen=this._totalWidths.length; i<iLen; i++)
			{
				widest=Math.max(this._totalWidths[i],widest);
			}
			var startingMargin=-widest/2+Headline.BORDER_MARGIN+"px";
			this._top.style.marginLeft=startingMargin;
			this._bottom.style.marginRight=startingMargin;
			var w=widest-Headline.BORDER_MARGIN*2;
			TweenLite.to(this._top, 1, {width:w, ease:Cubic.easeInOut});
			TweenLite.to(this._bottom, 1, {width:w, ease:Cubic.easeInOut});
			this._playFuzz();
		}
		else
		{
			this._shouldPlay=true;
		}
	}
}

Headline.prototype._playFuzz=function()
{
	this._fuzz=MySounds.play(FX.buzz);
	this._fuzzTimeout=setTimeout(this._killFuzzHandler,Headline.randomDelay());
}

Headline.prototype._killFuzz=function()
{
	this._fuzzPlaying=false;
	this._fuzz.pause();
	this._full=null;
	if(this._lettersDone<this._letters.length)
		this._fuzzTimeout=setTimeout(this._playFuzzHandler,Headline.randomDelay());
	else
		this._fuzzTimeout=null;
}

Headline.randomDelay=function()
{
	return MyMath.random(10,200,true);
}

Headline.prototype.reset=function()
{
	if(this._showing)
	{
		this._showing=false;
		TweenLite.killTweensOf(this._top);
		TweenLite.killTweensOf(this._bottom);
		this._top.style.width=0;
		this._bottom.style.width=0;
		for(var i=0, iLen=this._letters.length; i<iLen; i++)
		{
			this._letters[i].reset();
		}
	}
}

Headline.prototype._letterDone=function()
{
	this._lettersDone++;
	if(this._lettersDone==this._letters.length)
	{
		for(var i=0, iLen=this._letters.length; i<iLen; i++)
		{
			this._letters[i].end();
		}
	}
}

Headline.prototype.deactivate=function()
{
	for(var i=0, iLen=this._letters.length; i<iLen; i++)
	{
		this._letters[i].deactivate();
	}
	if(this._fuzzTimeout)
	{
		clearTimeout(this._fuzzTimeout);
		this._fuzz.pause();
	}
}

Letter.SPACING=40;
Letter.SPACE_SPACING=50;
if(window.innerWidth < 1600)
{
	Letter.SPACING=25;
}
if(window.innerWidth < 1350)
{
	Letter.SPACING=15;
}

function Letter(char, callback, row)
{
	this._onOverHandler=MyUtils.bind(this._onOver,this);
	this._onOutHandler=MyUtils.bind(this._onOut,this);
	this._callback=callback;
	this._row=row;
	if(char==" ")
	{
		this.element=document.createElement("SPAN");
		this.element.style.width=Letter.SPACE_SPACING+"px";
		this._callback(this._row, Letter.SPACE_SPACING);
	}
	else
	{
		this._img=document.createElement("IMG");
		this._img.src="img/headline/"+char+(retina()?"@2x":"")+".png";
		this._onImgLoadedHandler=MyUtils.bind(this._onImgLoaded,this);
		this._img.addEventListener("load",this._onImgLoadedHandler);
		this.element=document.createElement("SPAN");
		var child=document.createElement("DIV");
		child.className="one";
		this.element.appendChild(child);
		child=document.createElement("DIV");
		child.className="two";
		this.element.appendChild(child);
		child=document.createElement("DIV");
		child.className="three";
		this.element.appendChild(child);
		child=document.createElement("DIV");
		child.className="four";
		this.element.appendChild(child);
		var divs=this.element.querySelectorAll("div");
		for(var i=0, iLen=divs.length; i<iLen; i++)
		{
			divs[i].style.backgroundImage='url("img/headline/'+char+(retina()?"@2x":"")+'.png")';
		}
		this._sprites=[this.element.querySelector(".one"),this.element.querySelector(".two"),this.element.querySelector(".three"),this.element.querySelector(".four")];
	}
 }

Letter.prototype._onImgLoaded=function(evt)
{
	this._img.removeEventListener("load",this._onImgLoadedHandler);
	var w=evt.target.naturalWidth/(retina()?2:1);
	this.element.style.width=w+Letter.SPACING+"px";
	var divs=this.element.querySelectorAll("div");
	for(var i=0, iLen=divs.length; i<iLen; i++)
	{
		divs[i].style.width=w+"px";
		divs[i].style.marginLeft=-w/2+"px";
	}
	this._callback(this._row, w+Letter.SPACING);
}

Letter.prototype.reset=function()
{
	if(this._sprites)
	{
		for(var i=0, iLen=this._sprites.length; i<iLen; i++)
		{
			TweenLite.killTweensOf(this._sprites[i]);
			this._sprites[i][0].style.opacity=0;
			this._sprites[i][0].style.visibility="hidden";
		}
	}
}

Letter.prototype.fadeIn=function(callback)
{
	if(this._sprites)
	{
		var timeline=new TimelineLite({onComplete:callback});
		timeline.append(TweenLite.to(this._sprites[0], MyMath.random(0.2,0.4), {autoAlpha:1, ease:Linear.easeNone, delay:MyMath.random(0.7)}));
		for(var i=1, iLen=this._sprites.length-1; i<iLen; i++)
		{
			var DUR=0.3;
			var DELAY=0.2;
			var randNum=Math.max(1,Math.abs(MyMath.random(-3,3,true,2)));
			for(var j=0; j<randNum; j++)
			{
				var insert=timeline.duration();
				insert+=MyMath.random(DELAY);
				var dur=MyMath.random(DUR);
				timeline.insert(TweenLite.to(this._sprites[i-1], dur, {autoAlpha:0, ease:Cubic.easeIn}),insert);
				timeline.insert(TweenLite.to(this._sprites[i], dur, {autoAlpha:1, ease:Cubic.easeOut}),insert);

				if(j<randNum-1)
				{
					insert=timeline.duration();
					insert+=MyMath.random(DELAY);
					dur=MyMath.random(DUR);
					timeline.insert(TweenLite.to(this._sprites[i-1], dur, {autoAlpha:1, ease:Cubic.easeOut}),insert);
					timeline.insert(TweenLite.to(this._sprites[i], dur, {autoAlpha:0, ease:Cubic.easeIn}),insert);
				}
			}
		}
	}
	else
	{
		callback();
	}
}

Letter.prototype._onOver=function()
{
	this._over=this._sprites[MyMath.random(0,1,true)];
	TweenLite.to(this._over, 0.2, {autoAlpha:1, ease:Linear.easeNone});
	TweenLite.to(this._sprites[3], 0.2, {autoAlpha:0, ease:Linear.easeNone});
}

Letter.prototype._onOut=function()
{
	if(this._over)
		TweenLite.to(this._over, 0.2, {autoAlpha:0, ease:Linear.easeNone, delay:1});
	TweenLite.to(this._sprites[3], 0.2, {autoAlpha:1, ease:Linear.easeNone, delay:1});
}

Letter.prototype.end=function()
{
	if(this._sprites)
	{
		var dur=0.5;
		var timeline=new TimelineLite({onComplete:this._addRollOver, onCompleteScope:this});
		timeline.insert(TweenLite.to(this._sprites[this._sprites.length-2], dur, {autoAlpha:0, ease:Cubic.easeIn}),0);
		timeline.insert(TweenLite.to(this._sprites[this._sprites.length-1], dur, {autoAlpha:1, ease:Cubic.easeOut}),0);
	}
}

Letter.prototype._addRollOver=function()
{
	this.element.addEventListener("mouseover",this._onOverHandler);
	this.element.addEventListener("mouseout",this._onOutHandler);
}

Letter.prototype.deactivate=function()
{
	this.element.removeEventListener("mouseover",this._onOverHandler);
	this.element.removeEventListener("mouseout",this._onOutHandler);
}
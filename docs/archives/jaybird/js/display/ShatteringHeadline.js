"use strict";
	
function ShatteringHeadline(element)
{
	this._element=element;
	this._letters=[];
	this._hasPlayed=false;
	this._lettersLoaded=0;

	var lines=element.innerHTML.split("<br>");
	element.innerHTML="";
	for(var i=0, iLen=lines.length; i<iLen; i++)
	{
		var str=lines[i];
		var callback=MyUtils.bind(this._onLetterLoaded,this);
		for(var j=0, jLen=str.length; j<jLen; j++)
		{
			if(i==0 && j==0)
				var letter=new ShatteringLetter(str.charAt(j).toUpperCase(), 1, callback);
			else if(i==iLen-1 && j==jLen-1)
				letter=new ShatteringLetter(str.charAt(j).toUpperCase(), -1, callback);
			else
				letter=new StaticLetter(str.charAt(j).toUpperCase(), callback);
			this._letters.push(letter);
			element.appendChild(letter.element);
		}
		if(iLen>i+1)
		{
			element.appendChild(document.createElement("br"));
		}
	}
}

ShatteringHeadline.prototype.progress=function(num)
{
	if(num>=0 && num<=1)
		this.play();
	else
		this.stop();
}

ShatteringHeadline.prototype.play=function()
{
	if(!this._hasPlayed)
	{
		this._hasPlayed=true;
		this._letters[0].play();
		this._letters[this._letters.length-1].play();
	}
}

ShatteringHeadline.prototype.stop=function()
{
	if(this._hasPlayed)
	{
		this._hasPlayed=false;
		this._letters[0].stop();
		this._letters[this._letters.length-1].stop();
	}
}

ShatteringHeadline.prototype.reset=function()
{
	this._letters[0].reset();
	this._letters[this._letters.length-1].reset();
}

ShatteringHeadline.prototype._onLetterLoaded=function()
{
	this._lettersLoaded++;
	if(this._lettersLoaded==this._letters.length)
		TweenLite.to(this._element, 0.5, {autoAlpha:1, ease:Linear.easeNone, delay:0.5});
}

//static letter
	
	function StaticLetter(char, callback)
	{
		if(arguments.length>0)
		{
			this.element=document.createElement("span");
			if(char==" ")
			{
				this.element.className="space";
				callback();
			}
			else
			{
				this._callback=callback;
				this._img=document.createElement("img");
				this._img.src=STS.ROOT+"images/shattering_headline/"+char+(STS.retina()?"@2x":"")+".png";
				this._onImgLoadedHandler=MyUtils.bind(this.onImgLoaded,this);
				MyUtils.addEventListener(this._img,"load",this._onImgLoadedHandler);
			}
		}
	}

	StaticLetter.prototype.onImgLoaded=function(evt)
	{
		MyUtils.removeEventListener(this._img,"load",this._onImgLoadedHandler);
		var w=evt.target.naturalWidth/(STS.retina()?2:1);
		var h=evt.target.naturalHeight/(STS.retina()?2:1);
		this.element.style.width=w+"px";
		this.segments=Math.floor(h/this.element.offsetHeight/2);
		this.onImgLoaded2(h);
		this._callback();
		this._callback=null;
	}

	StaticLetter.prototype.onImgLoaded2=function(h)
	{
		this.element.style.backgroundImage="url("+this._img.src+")";
		this.element.style.backgroundPosition="0 "+(-this.segments*this.element.offsetHeight)+"px";
	}

//shattering letter
	
	ShatteringLetter.prototype=new StaticLetter();
	ShatteringLetter.prototype.constructor=ShatteringLetter;
	function ShatteringLetter(char, relativePosition, callback)
	{
		this._loaded=false;
		this._shouldPlay=false;
		this._relativePosition=relativePosition;
		this._to=(50-this._relativePosition*25)+"% "+(50-this._relativePosition*43)+"%";
		this._fragments=[];
		this._fragmentsLength=0;
		StaticLetter.call(this, char, callback);
	}

	ShatteringLetter.prototype.onImgLoaded=function(evt)
	{
		StaticLetter.prototype.onImgLoaded.call(this,evt);
	}

	ShatteringLetter.prototype.onImgLoaded2=function(h)
	{
		var elementHeight=this.element.offsetHeight;
		for(var i=0, iLen=this.segments; i<iLen; i++)
		{
			var div=document.createElement("div");
			div.style.backgroundImage="url("+this._img.src+")";

			div.style.backgroundPosition="0 "+(-this.segments*elementHeight+(i+1)*this._relativePosition*elementHeight)+"px";
			this._fragments.push(div);
			this._fragmentsLength++;
			this.element.appendChild(div);
		}
		this._loaded=true;
		this.reset();
		if(this._shouldPlay)
			this.play();
	}

	ShatteringLetter.prototype.play=function()
	{
		if(this._loaded)
		{
			for(var i=1; i<this._fragmentsLength; i++)
			{
				var dist=Math.abs(MyMath.random(-i,i,false,2))*30;
				var dir=MyMath.random(-Math.PI/2,Math.PI/2,false,4)+Math.PI*7/8+Math.PI/2*this._relativePosition;
				var rot=MyMath.random(-180, 180, false, 3);
				TweenLite.fromTo(this._fragments[i], MyMath.random(20,30), {x:0,y:0, rotation:0}, {rotation:rot, x:Math.cos(dir)*dist, y:Math.sin(dir)*dist, ease:Sine.easeInOut, force3D:true, transformOrigin:this._to});
			}
		}
		else
		{
			this._shouldPlay=true;
		}
	}

	ShatteringLetter.prototype.stop=function()
	{
		for(var i=0; i<this._fragmentsLength; i++)
		{
			TweenLite.killTweensOf(this._fragments[i]);
		}
	}

	ShatteringLetter.prototype.reset=function()
	{
		for(var i=0; i<this._fragmentsLength; i++)
		{
			TweenLite.set(this._fragments[i], {x:0,y:0, force3D:true, rotation:0});
		}
	}
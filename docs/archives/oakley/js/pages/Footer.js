"use strict";

Footer._NUM_MOLECULES=10;
Footer._NUM_TRIANGLES=2;
function Footer()
{
	this._lastWidth=0;
	this._lastHeight=0;
	MyUtils.bindAll(this, "resize", "scroll", "tick", "_onSubmit");
	this.element=document.getElementById("footer");
	this._isActive=false;
	this._molecules=[];
	this._triangles=[];
	this._scrollAmount=null;
	this._moleculeRender=new MyCanvas(this.element.querySelector("canvas"));
	this._moleculeBuffer=new MyCanvas(this.element.offsetWidth, this.element.offsetHeight);
	this._button=this.element.querySelector("form button");
	this._input=this.element.querySelector("form input");
	this._mask=this.element.querySelector(".thanksMask");
	this._onSubmitDone();
	var logo=this.element.querySelector("figure");
	for(var i=0; i<Footer._NUM_TRIANGLES; i++)
	{
		this._triangles.push(new Triangle(logo, false));
	}
	this.element.querySelector(".exploding").addEventListener("click", Globals.scrollToZero);
}

Footer.prototype.resize=function()
{
	var h=this.element.offsetHeight;
	if(h!=this._lastHeight || this._lastWidth!=Globals.winWidth)
	{
		this._lastWidth=Globals.winWidth;
		this._lastHeight=h;
		this._moleculeBuffer.width(Globals.winWidth);
		this._moleculeBuffer.height(h);
		this._moleculeRender.width(Globals.winWidth);
		this._moleculeRender.height(h);
		this._molecules.length=0;
		for(var i=0; i<Footer._NUM_MOLECULES; i++)
		{
			var randScale=MyMath.random(0.3, 1.2);
			var radius=Molecule.getCanvasRadius(randScale);
			var molecule=new Molecule(MyMath.random(Globals.winWidth/2-300+radius, Globals.winWidth/2+300-radius, false, 2), MyMath.random(radius+90, 490-radius, false, 2), randScale, Molecule.WHITE);
			this._molecules.push(molecule);
			if(this._isActive)
				molecule.activate();

		}
		for(i=0; i<Footer._NUM_TRIANGLES; i++)
		{
			if(i==0)
				this._triangles[i].setTo(50, 155);
			else
				this._triangles[i].setTo(325, 140);
		}
	}
}

Footer.prototype.scroll=function(num)
{
	if(num==Number.MAX_VALUE)
	{
		this._isActive=false;
		for(var i=0; i<Footer._NUM_MOLECULES; i++)
		{
			this._molecules[i].deactivate();
		}
	}
	else
	{
		this._scrollAmount=1-num;
		if(!this._isActive)
		{
			this._isActive=true;
			for(i=0; i<Footer._NUM_MOLECULES; i++)
			{
				this._molecules[i].activate();
			}
		}
	}
}

Footer.prototype.tick=function()
{
	this._moleculeBuffer.context.clearRect(0,0,this._moleculeBuffer.width(), this._moleculeBuffer.height());
	this._moleculeRender.context.clearRect(0,0,this._moleculeRender.width(), this._moleculeRender.height());
	for(var i=0; i<Footer._NUM_MOLECULES; i++)
	{
		this._molecules[i].draw(this._moleculeBuffer, this._scrollAmount);
	}
	this._moleculeRender.context.drawImage(this._moleculeBuffer.canvas, 0, 0);
	for(var i=0; i<Footer._NUM_TRIANGLES; i++)
	{
		this._triangles[i].tick(this._scrollAmount);
	}
}

Footer.prototype._onSubmit=function(evt)
{
	evt.preventDefault();
	var value=this._input.value;
	if(value!="")
	{
		//put submission code here
		this._button.removeEventListener("click", this._onSubmit);
		var timeline=new TimelineLite({onComplete:this._onSubmitDone, onCompleteScope:this});
		timeline.append(TweenLite.to(this._mask, 0.5, {width:390, ease:Cubic.easeInOut}));
		timeline.call(this._inputClear, null, this);
		timeline.append(TweenLite.to(this._mask, 0.5, {width:0, ease:Cubic.easeInOut}));
	}
}

Footer.prototype._inputClear=function()
{
	this._input.value="";
}

Footer.prototype._onSubmitDone=function()
{
	this._button.addEventListener("click", this._onSubmit);
}
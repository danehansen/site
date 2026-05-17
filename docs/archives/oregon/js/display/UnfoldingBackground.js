"use strict";
	
UnfoldingBackground.POS=[[2,0],[3,0],[1,1],[2,1],[3,1],[4,1],[0,2],[1,2],[2,2],[3,2],[4,2],[0,3],[1,3],[2,3],[3,3],[1,4],[2,4]];

function UnfoldingBackground(width, height, timelineOptions, textPage)
{
	this.timelineOptions=timelineOptions || {};
	if(timelineOptions.onUpdate)
		this.onParentUpdate=timelineOptions.onUpdate;
	this.timelineOptions.paused=true;
	this.timelineOptions.onUpdate=this.drawBlacks;
	this.timelineOptions.onUpdateScope=this;
	this.width=width;
	this.height=height;
	this.canvas=new MyCanvas(this.width,this.height);
	this.blackDiamonds=[];
	this.len=UnfoldingBackground.POS.length;
	this.timeline=null;
	for(var i=0; i<this.len; i++)
	{
		this.blackDiamonds.push(new BlackDiamond(UnfoldingBackground.POS[i], textPage));
	}
	for(i=0; i<this.len-1; i++)
	{
		var current=UnfoldingBackground.POS[i];
		for(var j=i+1; j<this.len; j++)
		{
			if(i!=j)
			{
				var other=UnfoldingBackground.POS[j];
				if((current[0]==other[0] && Math.abs(current[1]-other[1])==1) || (current[1]==other[1] && Math.abs(current[0]-other[0])==1))
				{
					this.blackDiamonds[i].neighbors.push(this.blackDiamonds[j]);
					this.blackDiamonds[j].neighbors.push(this.blackDiamonds[i]);
				}
			}
		}
	}
}

UnfoldingBackground.prototype.writeTimeline=function()
{
	for(var i=0; i<this.len; i++)
	{
		this.blackDiamonds[i].tween.start=Number.MAX_VALUE;
	}
	this.blackDiamonds[2].decideTween(BlackDiamond.delay());
	this.timeline=new TimelineLite(this.timelineOptions);
	for(i=0; i<this.len; i++)
	{
		var targ=this.blackDiamonds[i];
		var dur=targ.tween.duration;
		var start=targ.tween.start;
		delete targ.tween.start;
		delete targ.tween.duration;
		if((Math.random()<0.3 && targ._dark) || i==0)
			this.timeline.call(MySounds.play,[MyMath.randomChoice([FX.page1,FX.page2,FX.page3])],null,start);
		this.timeline.insert(new TweenLite(targ, dur, targ.tween), start);
	}
}

UnfoldingBackground.prototype.drawBlacks=function()
{
	this.canvas.context.clearRect(0,0,this.width,this.height);
	this.canvas.context.save();
	this.canvas.context.rotate(Math.PI/4);
	for(var i=0; i<this.len; i++)
	{
		var bd=this.blackDiamonds[i];
		this.canvas.context.fillStyle="rgba(0,0,0,"+bd.alpha+")";
		this.canvas.context.fillRect(bd.x+BlackDiamond.SIZE*1,bd.y-BlackDiamond.SIZE*3,bd.width,bd.height);
	}
	this.canvas.context.restore();
	if(this.onParentUpdate)
		this.onParentUpdate();
}

//////////////////////////////////////////////////
//BlackDiamond///////////////////////////////////
////////////////////////////////////////////////

BlackDiamond.SIZE=162;
BlackDiamond.GUTTER=0;
BlackDiamond.GROWTH_CENTER={x:1,y:1};
BlackDiamond.OPAQUE_CENTER={x:2,y:2};

function BlackDiamond(pos, textPage)
{
	if(!textPage)
		this.hide=(pos[0]==BlackDiamond.GROWTH_CENTER.x && pos[1]==BlackDiamond.GROWTH_CENTER.y);
	this.endX=pos[0]*BlackDiamond.SIZE;
	this.endY=pos[1]*BlackDiamond.SIZE;
	this.endSize=BlackDiamond.SIZE-BlackDiamond.GUTTER;
	var dist=MyMath.distance({x:pos[0],y:pos[1]},BlackDiamond.OPAQUE_CENTER);
	if(dist<=1 || (pos[0]==3 && pos[1]==1) || (pos[0]==1 && pos[1]==3))
		this._dark=true;
	else
		this._dark=false;
	this.tween={};
	this.neighbors=[];
	this.alpha=0;
}

BlackDiamond.prototype.decideTween=function(start,before)
{
	if(start<this.tween.start)
	{
		this.tween.start=start;
		this.tween.duration=MyMath.random(0.05,0.1);
		var wiggle=0.15;
		if(this.hide)
		{
			this.tween.alpha=0;
		}
		else
		{
			if(this._dark)
				this.tween.alpha=MyMath.random(1-wiggle*2, 1);
			else
				this.tween.alpha=MyMath.random(0, wiggle*4);
		}
		if(!before)
			before={endX:BlackDiamond.SIZE,endY:BlackDiamond.SIZE};
		if(this.endX!=before.endX || (this.endX==before.endX && this.endY==before.endY && Math.random()>0.5))
		{
			this.width=0;
			this.height=this.endSize;
			this.tween.width=this.endSize;
			delete this.tween.height;
			if(this.endX<before.endX)
			{
				this.x=this.endX+this.endSize;
				this.tween.x=this.endX;
			}
			else
			{
				this.x=this.endX;
				delete this.tween.x;
			}
			this.y=this.endY;
			delete this.tween.y;
		}
		else
		{
			this.width=this.endSize;
			this.height=0;
			this.tween.height=this.endSize;
			delete this.tween.width;
			if(this.endY<before.endY)
			{
				this.y=this.endY+this.endSize;
				this.tween.y=this.endY;
			}
			else
			{
				this.y=this.endY;
				delete this.tween.y;
			}
			this.x=this.endX;
			delete this.tween.x;
		}
		var total=this.tween.start+this.tween.duration+BlackDiamond.delay();
		for(var i=0,len=this.neighbors.length; i<len; i++)
		{
			this.neighbors[i].decideTween(total,this);
		}
	}
}

BlackDiamond.delay=function()
{
	return MyMath.random(0.1);
}
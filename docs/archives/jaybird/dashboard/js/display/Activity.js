"use strict";

Activity.START_ANGLE=(13/4)*Math.PI;
Activity.END_ANGLE=(7/4)*Math.PI;
Activity.SPAN=Activity.START_ANGLE-Activity.END_ANGLE;
Activity.MAX_INTENSITY=15;
Activity._GRAPH_STROKE=8;
Activity._WEEKLY_OFFSET=5;
Activity._ACTIVITY_FADE=0.7;
function Activity()
{
	this._buttonHolder=document.querySelector("#fading .activity .buttons");
	this.dayElement=document.querySelector("#rotating .day .activity");;
	this._svgDefs=this.dayElement.querySelector("svg .curvedDefs");
	this._svgCurved=this.dayElement.querySelector("svg .curved");
	this._svgH2=this.dayElement.querySelector("svg .h2");
	this._big=this.dayElement.querySelector("svg .big");
	this._bigColor=this._big.querySelector(".color");
	this._bigShine=this._big.querySelector(".shine");
	this._bigShadow=this._big.querySelector(".shadow");
	this._shine=this.dayElement.querySelector("svg #activityShine");
	this._currentSlice=Number.MAX_VALUE;
	this._hasPointer=false;
	this._data=null;
	this._slices=[];
	this._goal=null;
	this._buttons=[];
	this._graphMax=null;
	this._initArc=new ActivitySlice();
	this._dailyRender=new MyCanvas(this.dayElement.querySelector("canvas"));
	this._dailyBuffer=new MyCanvas(Dashboard.WIDTH,Dashboard.HEIGHT);
	this._small=this.dayElement.querySelector(".data");

	var weekly=document.querySelector("#rotating .week .activity");
	this._weeklyRender=new MyCanvas(weekly.querySelector("canvas"));
	this._weeklyBuffer=new MyCanvas(this._weeklyRender.width(), this._weeklyRender.height());
	MyUtils.bindAll(this, "_onMouseMove", "_onClick", "_onButtonClick", "_drawWeekly");
	this._greenGraph=new Graph(this._weeklyRender, this._drawWeekly, 0,0,this._weeklyRender.width(), this._weeklyRender.height());
	this._greenGraph.buffer.context.strokeStyle="#D1EB24";
	this._greenGraph.buffer.context.lineWidth=Activity._GRAPH_STROKE;
	this._grayGraph=new Graph(this._weeklyRender, this._drawWeekly, 0,0,this._weeklyRender.width(), this._weeklyRender.height());
	this._grayGraph.buffer.context.strokeStyle="#DCDCDC";
	this._grayGraph.buffer.context.lineWidth=Activity._GRAPH_STROKE;

	this._activityGraph=new Graph(this._weeklyRender, this._drawWeekly, 0,0,this._weeklyRender.width(), this._weeklyRender.height(), true);
	this._activityGraph.buffer.context.fillStyle=this._activityGraph.buffer.context.createLinearGradient(0,0,0,this._activityGraph.buffer.height());
	this._activityGraph.buffer.context.fillStyle.addColorStop(0,"#8CD321");
	this._activityGraph.buffer.context.fillStyle.addColorStop(1,"#D1EB24");
	this._activityFade=0;
}

Activity._background=null;
Activity.background=function()
{
	if(!Activity._background)
	{
		var mc=new MyCanvas(Dashboard.WIDTH,Dashboard.HEIGHT);
		mc.context.strokeStyle=Dashboard.GRAY_LIGHT;
		Dashboard.drawTick(mc.context, Activity.START_ANGLE);
		Dashboard.drawArc(mc.context, Activity.START_ANGLE, Activity.END_ANGLE);
		Dashboard.drawTick(mc.context, Activity.END_ANGLE);
		Activity._background=mc.canvas;
	}
	return Activity._background;
}

Activity.prototype.activate=function()
{
	this.dayElement.addEventListener("mousemove", this._onMouseMove);
	this.dayElement.addEventListener("click", this._onClick);
}

Activity.prototype.deactivate=function()
{
	this.dayElement.removeEventListener("mousemove", this._onMouseMove);
	this.dayElement.removeEventListener("click", this._onClick);
}

Activity.prototype._drawDaily=function()
{
	this._dailyBuffer.context.clearRect(0,0,Dashboard.WIDTH,Dashboard.HEIGHT);
	this._dailyRender.context.clearRect(0,0,Dashboard.WIDTH,Dashboard.HEIGHT);
	this._dailyBuffer.context.drawImage(Activity.background(),0,0);
	for(var i=0, iLen=this._slices.length; i<iLen; i++)
	{
		if(this._slices[i].shouldDraw())
		{
			this._slices[i].draw();
			this._dailyBuffer.context.drawImage(this._slices[i].myCanvas.canvas,0,0);
		}
	}
	if(this._initArc.shouldDraw())
	{
		this._initArc.draw();
		this._dailyBuffer.context.drawImage(this._initArc.myCanvas.canvas,0,0);
	}
	this._dailyRender.context.drawImage(this._dailyBuffer.canvas,0,0);
}

Activity.prototype._drawWeekly=function()
{
	this._total++;
	this._weeklyBuffer.context.clearRect(0,0,this._weeklyBuffer.width(), this._weeklyBuffer.height());
	this._weeklyRender.context.clearRect(0,0,this._weeklyRender.width(), this._weeklyRender.height());
	this._weeklyBuffer.context.fillStyle="rgba(0,0,0,0.1)";
	
	this._weeklyBuffer.context.drawImage(this._grayGraph.buffer.canvas,0,Activity._WEEKLY_OFFSET);
	this._weeklyBuffer.context.globalCompositeOperation="source-atop";
	this._weeklyBuffer.context.fillRect(0,0,this._weeklyBuffer.width(),this._weeklyBuffer.height());
	this._weeklyBuffer.context.globalCompositeOperation="source-over";
	this._weeklyBuffer.context.drawImage(this._grayGraph.buffer.canvas,0,0);

	this._weeklyBuffer.context.drawImage(this._greenGraph.buffer.canvas,0,Activity._WEEKLY_OFFSET);
	this._weeklyBuffer.context.globalCompositeOperation="source-atop";
	this._weeklyBuffer.context.fillRect(0,0,this._weeklyBuffer.width(),this._weeklyBuffer.height());
	this._weeklyBuffer.context.globalCompositeOperation="source-over";
	this._weeklyBuffer.context.drawImage(this._greenGraph.buffer.canvas,0,0);

	// if(this._activityFade>0)
	// {
		this._weeklyBuffer.context.globalCompositeOperation="destination-out";
		this._weeklyBuffer.context.fillStyle="rgba(0,0,0,"+this._activityFade+")";
		this._weeklyBuffer.context.fillRect(0,0,this._weeklyBuffer.width(),this._weeklyBuffer.height());
		this._weeklyBuffer.context.globalCompositeOperation="source-over";
	// }
	
	this._weeklyBuffer.context.drawImage(this._activityGraph.buffer.canvas,0,0);
	this._weeklyRender.context.drawImage(this._weeklyBuffer.canvas,0,0);
}

Activity.prototype.displayData=function(data)
{
	this._data=data;
	if(this._activityFade!=0)
		TweenLite.to(this, 0.5, {_activityFade:0, ease:Linear.easeNone});
	if(data.days.length==1)
	{
		this._currentActivity=Number.MAX_VALUE;
		this._multiplier=Math.min(1,1/(data.days[0].activity.ratio));
		var timeline=new TimelineLite({onUpdate:this._drawDaily, onUpdateScope:this, onComplete:this._addSlices, onCompleteScope:this});
		for(var i=0, iLen=this._slices.length; i<iLen; i++)
		{
			timeline.insert(TweenLite.to(this._slices[i], 0.3, {intensity:0, tickLength:0, radius:Dashboard.RADIUS-1.5, ease:Cubic.easeOut}),0);
		}
		timeline.insert(TweenLite.to(this._svgCurved, 0.3, {opacity:0, ease:Linear.easeNone}),0);
		this._initArc.intensity(Activity.MAX_INTENSITY);
		this._initArc.radius(Dashboard.RADIUS-this._initArc.myCanvas.context.lineWidth/2-1.5);
		timeline.append(TweenLite.fromTo(this._initArc, 0.6, {end:Activity.START_ANGLE}, {end:Activity.START_ANGLE-data.days[0].activity.ratio*this._multiplier*Activity.SPAN, ease:Cubic.easeInOut}));
		this._changeText(Localization.OVERALL_PERCENTAGE, this._data.days[0].activity.ratioString, [{name:Localization.TOTAL_SCORE, value:data.days[0].activity.total+"<span>/"+data.days[0].activity.goal+"</span>"}]);
	}
	else
	{
		this._graphMax=0;
		if(data.months.length==12)
			var graphData=data.months;
		else
			graphData=data.days;
		for(i=0, iLen=graphData.length; i<iLen; i++)
		{
			var dayData=graphData[i].activity;
			this._graphMax=Math.max(this._graphMax, dayData.goal, dayData.total);
		}
		this._graphMax*=1.1;
		var greenData=[];
		var grayData=[];
		for(i=0, iLen=graphData.length; i<iLen; i++)
		{
			dayData=graphData[i].activity;
			var xPos=i/(iLen-1);
			greenData.push({x:xPos,y:MyMath.relativePercentage(0,this._graphMax,dayData.total)});
			grayData.push({x:xPos,y:MyMath.relativePercentage(0,this._graphMax,dayData.goal)});
		}
		greenData.unshift({x:-0.1,y:greenData[0].y});
		greenData.push({x:1.1,y:greenData[iLen-1].y});
		grayData.unshift({x:-0.1,y:grayData[0].y});
		grayData.push({x:1.1,y:grayData[iLen-1].y});
		this._grayGraph.plot(grayData);
		this._greenGraph.plot(greenData);
		this._activityGraph.plot([]);
	}
	this._addButtons();
}

Activity.prototype._addButtons=function()
{
	if(this._buttons.length>0)
	{
		var timeline=new TimelineLite({onComplete:this._addButtons2, onCompleteScope:this});
		for(var i=0, iLen=this._buttons.length; i<iLen; i++)
		{
			timeline.insert(TweenLite.to(this._buttons[i], 0.3, {opacity:0, ease:Linear.easeNone}),0);
		}
	}
	else
	{
		this._addButtons2();
	}
}

Activity.prototype._addButtons2=function()
{
	while(this._buttons.length>0)
	{
		var li=this._buttons.pop();
		li.removeEventListener("click", this._onButtonClick);
		this._buttonHolder.removeChild(li);
	}
	for(var i=0, iLen=this._data.activities.length; i<iLen; i++)
	{
		li=document.createElement("li");
		this._buttons.push(li);
		var button=document.createElement("button");
		li.appendChild(button);
		button.innerHTML=Localization.activityName(this._data.activities[i]);
		li.setAttribute("data-num",this._data.activities[i]);
		var svg=document.createElementNS(Dashboard.SVG_NAMESPACE, "svg");
		button.appendChild(svg);
		var use=document.createElementNS(Dashboard.SVG_NAMESPACE, "use");
		use.setAttributeNS(Dashboard.XLINK_NAMESPACE, "xlink:href", "#icon-"+Dashboard.activityName(this._data.activities[i]));
		svg.appendChild(use);
		this._buttonHolder.appendChild(li);
		li.addEventListener("click", this._onButtonClick);
		TweenLite.to(this._buttons[i], 0.3, {opacity:1, ease:Linear.easeNone});
	}
}

Activity.prototype._addSlices=function()
{
 	this._slices=[];
	while (this._svgDefs.firstChild)
	{
		this._svgDefs.removeChild(this._svgDefs.firstChild);
		this._svgCurved.removeChild(this._svgCurved.firstChild);
	}
	var current=Activity.START_ANGLE;
	var timeline=new TimelineLite({onUpdate:this._drawDaily, onUpdateScope:this});
	for(var i=0, iLen=this._data.days[0].activity.segments.length; i<iLen; i++)
	{
		var slice=new ActivitySlice(this._data.days[0].activity.segments[i]);
		this._slices.push(slice);
		slice.start(current);
		slice.start(slice.start()-Dashboard.SPACING);
		current-=(slice.data.amount/this._data.days[0].activity.goal)*this._multiplier*Activity.SPAN;
		this._svgDefs.appendChild(slice.path);
		this._svgCurved.appendChild(slice.textPath);
		slice.end(current);
		slice.end(slice.end()+Dashboard.SPACING);
		timeline.insert(TweenLite.to(slice, 0.3, {tickLength:Dashboard.TICK_LENGTH, ease:Cubic.easeInOut},0));
		slice.textRadius(slice.textRadius(),true);
	}
	timeline.insert(TweenLite.to(this._svgCurved, 0.3, {opacity:1, ease:Linear.easeNone}),0);
	timeline.insert(TweenLite.to(this._initArc, 0.3, {radius:Dashboard.RADIUS-1.5, ease:Cubic.easeOut, intensity:0},0));
}

Activity.prototype._onMouseMove=function(evt)
{
	var position=MyPoint.relativePosition(evt, this._dailyRender.canvas);
	position.subtract(Dashboard.CENTER);
	position.y*=-1;
	var dist=position.length();
	var angle=MyMath.modulo(position.angle(), Math.PI*2);
	if(angle<Activity.END_ANGLE)
		angle+=Math.PI*2;
	this._currentSlice=Number.MAX_VALUE;
	for(var i=0, iLen=this._slices.length; i<iLen; i++)
	{
		if(angle>=this._slices[i].end() && angle<=this._slices[i].start())
		{
			if(dist>=this._slices[i].radius()-this._slices[i].myCanvas.context.lineWidth/2 && dist<=this._slices[i].radius()+this._slices[i].myCanvas.context.lineWidth/2)
			{
				this._currentSlice=this._slices[i].data.num;
			}
		}
	}
	if(this._currentSlice<Number.MAX_VALUE && !this._hasPointer)
	{
		this.dayElement.style.cursor="pointer";
		this._hasPointer=true;
	}
	else if(this._currentSlice==Number.MAX_VALUE && this._hasPointer)
	{
		this.dayElement.style.cursor="default";
		this._hasPointer=false;	
	}
}

Activity.prototype._onClick=function(evt)
{
	if(this._currentSlice!=Number.MAX_VALUE)
		this._showActivity(this._currentSlice);
}

Activity.prototype._onButtonClick=function(evt)
{
	var list=this._buttonHolder.querySelectorAll("li");
	var num=MyUtils.indexOf(this._buttonHolder.querySelectorAll("li"), evt.currentTarget);
	this._showActivity(parseFloat(evt.currentTarget.getAttribute("data-num")));
}

Activity.prototype._showActivity=function(num)
{
	var selectedButton=this._buttonHolder.querySelector(".selected");
	if(selectedButton)
		selectedButton.className="";
	if(this._currentActivity!=num)
	{
		this._currentActivity=num;
		if(this._data.days.length==1)
		{
			this._changeText(this._data.days[0].activity.orderedSegments[num].name, Math.round(this._data.days[0].activity.orderedSegments[num].amount), this._data.days[0].activity.orderedSegments[num].data);
		}
		else
		{
			if(this._data.months.length==12)
				var graphData=this._data.months;
			else
				graphData=this._data.days;
			var activityData=[];
			for(i=0, iLen=graphData.length; i<iLen; i++)
			{
				var dayData=graphData[i].activity.orderedSegments[num];
				var xPos=i/(iLen-1);
				var segment=graphData[i].activity.orderedSegments[num];
				if(segment)
					activityData.push({x:xPos,y:MyMath.relativePercentage(0,this._graphMax,dayData.amount)});
				else
					activityData.push({x:xPos,y:0});
			}
			activityData.unshift({x:-0.1,y:activityData[0].y});
			activityData.push({x:1.1,y:activityData[iLen-1].y});
			this._activityGraph.plot(activityData);
			if(this._activityFade!=Activity._ACTIVITY_FADE)
				TweenLite.to(this, 0.5, {_activityFade:Activity._ACTIVITY_FADE, ease:Linear.easeNone});
		}
		this._buttonHolder.querySelector('[data-num="'+num+'"] button').className="selected";
	}
	else
	{
		this._currentActivity=Number.MAX_VALUE;
		if(this._data.days.length==1)
		{
			this._changeText(Localization.OVERALL_PERCENTAGE, this._data.days[0].activity.ratioString, [{name:Localization.TOTAL_SCORE, value:this._data.days[0].activity.total+"<span>/"+this._data.days[0].activity.goal+"</span>"}]);
		}
		else
		{
			this._activityGraph.plot([]);
		}
		if(this._activityFade!=0)
			TweenLite.to(this, 0.5, {_activityFade:0, ease:Linear.easeNone});
	}
	for(var i=0, iLen=this._slices.length; i<iLen; i++)
	{
		if(this._slices[i].data.num==this._currentActivity)
			this._slices[i].timeline.play();
		else
			this._slices[i].timeline.reverse();
	}
	TweenLite.ticker.addEventListener("tick", this._onTick, this);
}

Activity.prototype._onTick=function()
{
	var turnOff=true;
	for(var i=0, iLen=this._slices.length; i<iLen; i++)
	{
		if(this._slices[i].shouldRerender)
			turnOff=false;
	}
	this._drawDaily();
	if(turnOff)
		TweenLite.ticker.removeEventListener("tick", this._onTick, this);
}

Activity.prototype._changeText=function(title, big, small)
{
	var timeline=new TimelineLite({onComplete:this._changeText2, onCompleteScope:this, onCompleteParams:arguments});
	timeline.insert(TweenLite.to(this._small, 0.3, {opacity:0, ease:Linear.easeNone}),0);
	timeline.insert(TweenLite.to(this._svgH2, 0.3, {opacity:0, ease:Linear.easeNone}),0);
	timeline.insert(TweenLite.to(this._big, 0.3, {opacity:0, ease:Linear.easeNone}),0);
}

Activity.prototype._changeText2=function(title, big, small)
{
	while (this._svgH2.firstChild)
	{
		this._svgH2.removeChild(this._svgH2.firstChild);
	}
	while (this._bigColor.firstChild)
	{
		this._bigColor.removeChild(this._bigColor.firstChild);
		this._bigShine.removeChild(this._bigShine.firstChild);
		this._bigShadow.removeChild(this._bigShadow.firstChild);
	}

	var tspan=document.createElementNS(Dashboard.SVG_NAMESPACE, "tspan");
	tspan.appendChild(document.createTextNode(parseFloat(big)));
	this._bigColor.appendChild(tspan);
	this._bigShine.appendChild(tspan.cloneNode(true));
	this._bigShadow.appendChild(tspan.cloneNode(true));
	var offset=0;
	if(typeof big=="string")
	{
		var tspan2=document.createElementNS(Dashboard.SVG_NAMESPACE, "tspan");
		var tnode=document.createTextNode("%");
		tspan2.appendChild(tnode);
		tspan2.setAttribute("dy", "-64");
		this._bigColor.appendChild(tspan2);
		this._bigShine.appendChild(tspan2.cloneNode(true));
		this._bigShadow.appendChild(tspan2.cloneNode(true));
		offset=tspan2.getComputedTextLength()/2;
	}
	Dashboard.adjustShine(this._big, this._shine);
	title=title.split(" ");
	for(var i=0, iLen=title.length; i<iLen; i++)
	{
		tspan=document.createElementNS(Dashboard.SVG_NAMESPACE, "tspan");
		tspan.setAttribute("x", 250);
		if(i==0 && iLen>1)
			tspan.setAttribute("dy", -iLen/2*10);
		else if(iLen>1)
			tspan.setAttribute("dy", 20);
		tspan.appendChild(document.createTextNode(title[i]));
		this._svgH2.appendChild(tspan);
	}
	this._small.innerHTML="";
	for(var i=0, iLen=small.length; i<iLen; i++)
	{
		var li=document.createElement("li");
		li.innerHTML='<h3>'+small[i].name+'</h3><p>'+small[i].value+'</p>';
		this._small.appendChild(li);
	}
	TweenLite.to(this._small, 0.3, {opacity:1, ease:Linear.easeNone});
	TweenLite.to(this._svgH2, 0.3, {opacity:1, ease:Linear.easeNone});
	TweenLite.to(this._big, 0.3, {opacity:1, ease:Linear.easeNone});
}

//activity slice

ActivitySlice._gradient=null;
function ActivitySlice(data)
{
	this._checkedTextLength=false;
	this._textRadius=Dashboard.RADIUS+4.5;
	this._start=0;
	this._end=0;
	this._tickLength=0;
	this.shouldRerender=true;
	this.myCanvas=new MyCanvas(Dashboard.WIDTH, Dashboard.HEIGHT);
	this.data=data;
	this.myCanvas.context.strokeStyle=Dashboard.GRAY_LIGHT;
	if(data)
	{
		this.timeline=new TimelineLite({paused:true}); 
		this.timeline.append(TweenLite.to(this, 0.3, {radius:Dashboard.RADIUS-1.5, intensity:0, ease:Cubic.easeIn}));
		this.timeline.append(TweenLite.to(this, 0.3, {radius:Dashboard.RADIUS+1.5+ActivitySlice.toLineWidth(Activity.MAX_INTENSITY)/2, intensity:Activity.MAX_INTENSITY, textRadius:Dashboard.RADIUS+6+ActivitySlice.toLineWidth(Activity.MAX_INTENSITY), ease:Cubic.easeOut}));
		this.path=document.createElementNS(Dashboard.SVG_NAMESPACE,"path");
		this.path.setAttribute("id", data.nameNoSpace);
		this.textPath=document.createElementNS(Dashboard.SVG_NAMESPACE,"textPath");
		this.textPath.setAttributeNS(Dashboard.XLINK_NAMESPACE, "xlink:href", "#"+data.nameNoSpace);
		this.textPath.setAttribute("startOffset","100%");
		this.intensity(this.data.intensity);
		this.radius(Dashboard.RADIUS-this.myCanvas.context.lineWidth/2-1.5);
	}
	else
	{
		this.start(Activity.START_ANGLE);
		this.end(Activity.START_ANGLE);
	}
	this.draw();
}

ActivitySlice.gradient=function()
{
	if(!ActivitySlice._gradient)
	{
		var mc=new MyCanvas(Dashboard.WIDTH, Dashboard.HEIGHT);
		var ctx=mc.context;
		ctx.drawImage(GoZone.gradient(),0,0);
		var gradient=ctx.createRadialGradient(Dashboard.CENTER.x, Dashboard.CENTER.y, Dashboard.RADIUS, Dashboard.CENTER.x, Dashboard.CENTER.y, Dashboard.RADIUS+ActivitySlice.toLineWidth(Activity.MAX_INTENSITY+1.5));
		gradient.addColorStop(0,"rgba(0,0,0,0.3)");
		gradient.addColorStop(0.69,"rgba(0,0,0,0)");
		gradient.addColorStop(0.7,"rgba(255,255,255,0)");
		gradient.addColorStop(1,"rgba(255,255,255,0.3)");
		ctx.fillStyle=gradient;
		ctx.fillRect(0,0,Dashboard.WIDTH, Dashboard.HEIGHT);
		ActivitySlice._gradient=mc.canvas;
	}
	return ActivitySlice._gradient;
}

ActivitySlice.prototype.tickLength=function(num)
{
	if(typeof num!="number")
	{
		return this._tickLength;
	}
	else
	{
		this.shouldRerender=true;
		this._tickLength=num;
	}
}

ActivitySlice.prototype.start=function(num)
{
	if(typeof num!="number")
	{
		return this._start;
	}
	else
	{
		this.shouldRerender=true;
		this._start=num;
	}
}

ActivitySlice.prototype.end=function(num)
{
	if(typeof num!="number")
	{
		return this._end;
	}
	else
	{
		this.shouldRerender=true;
		this._end=num;
	}
}

ActivitySlice.prototype.intensity=function(num)
{
	if(typeof num!="number")
	{
		return this._intensity;
	}
	else
	{
		this.shouldRerender=true;
		this._intensity=num;
		this.myCanvas.context.lineWidth=ActivitySlice.toLineWidth(num);
	}
}

ActivitySlice.prototype.textRadius=function(num, force)
{
	if(typeof num!="number")
	{
		return this._textRadius;
	}
	else if(num!=this._textRadius || force==true)
	{
		this._textRadius=num;
		Dashboard.curveTextPath(this.path, this.start(), this.end(), num);
		if(!this._checkedTextLength)
		{
			this._checkTextLength();
			this._checkedTextLength=true;
		}
	}
}

ActivitySlice.prototype._checkTextLength=function()
{
	var length=this.data.name.length;
	var oldLength=0;
	for(var i=1; i<=length; i++)
	{
		this._setText(this.data.name.substring(0,i));
		var newLength=this.textPath.getComputedTextLength();
		if(!(newLength>oldLength+3))
		{
			// this._setText(this.data.name.substring(0,i-3)+"…");
			this.textPath.removeChild(this.textPath.firstChild);
			return;
		}
		oldLength=newLength;
	}
}

ActivitySlice.prototype._setText=function(str)
{
	if(this.textPath.firstChild)
		this.textPath.removeChild(this.textPath.firstChild);
	this.textPath.appendChild(document.createTextNode(str));
}

ActivitySlice.toLineWidth=function(num)
{
	return num*1.6;
}

ActivitySlice.prototype.radius=function(num)
{
	if(typeof num!="number")
	{
		return this._radius;
	}
	else
	{
		if(num>Dashboard.RADIUS-1.5)
			num=Math.max(Dashboard.RADIUS+this.myCanvas.context.lineWidth/2+1.5, num);
		this.shouldRerender=true;
		this._radius=num;
	}
}

ActivitySlice.prototype.draw=function()
{
	if(this.shouldRerender)
	{
		this.shouldRerender=false;
		this.myCanvas.context.clearRect(0,0,Dashboard.WIDTH,Dashboard.HEIGHT);
		if(this.radius()>Dashboard.RADIUS)
		{
			Dashboard.drawArc(this.myCanvas.context, this.start()-Dashboard.SPACING*2, this.end()+Dashboard.SPACING*2, this.radius());
			this.myCanvas.context.globalCompositeOperation="source-atop";
			this.myCanvas.context.drawImage(ActivitySlice.gradient(),0,0);
			this.myCanvas.context.globalCompositeOperation="source-over";
		}
		else
		{
			Dashboard.drawArc(this.myCanvas.context, this.start(), this.end(), this.radius());
		}
		var color=this.myCanvas.context.strokeStyle;
		var width=this.myCanvas.context.lineWidth;
		this.myCanvas.context.lineWidth=1;
		Dashboard.drawTick(this.myCanvas.context, this.end()-Dashboard.SPACING, this.tickLength());
		this.myCanvas.context.strokeStyle=color;
		this.myCanvas.context.lineWidth=width;
	}
}

ActivitySlice.prototype.shouldDraw=function()
{
	if(this.intensity()>0 && this.start()!=this.end())
		return true;
	else
		return false;
}
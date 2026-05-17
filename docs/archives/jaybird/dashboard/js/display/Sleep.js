"use strict";

Sleep._START_ANGLE=Math.PI*0.5;
Sleep._LINE_WIDTH=10;
function Sleep()
{
	this.dayElement=document.querySelector("#rotating .day .sleep");
	this._slept=0;
	this._ideal=this.dayElement.querySelector("p span");
	//canvas
		this._render=new MyCanvas(this.dayElement.querySelector("canvas"));
		
		this._static=new MyCanvas(Dashboard.WIDTH,Dashboard.HEIGHT);
		this._static.context.strokeStyle=Dashboard.GRAY_LIGHT;
		Dashboard.drawTick(this._static.context, Sleep._START_ANGLE);
		Dashboard.drawArc(this._static.context, Math.PI*2, 0);
		
		this._slice=new MyCanvas(Dashboard.WIDTH,Dashboard.HEIGHT);
		this._slice.context.lineWidth=Sleep._LINE_WIDTH;

		this._buffer=new MyCanvas(Dashboard.WIDTH,Dashboard.HEIGHT);
	//svg
		this._big=this.dayElement.querySelector("svg .big");
		this._shine=this.dayElement.querySelector("svg #sleepShine");
		this._bigs=this._big.querySelectorAll("tspan:first-child");
	this._fadeOuts=[this.dayElement.querySelector("h2"), this.dayElement.querySelector("p"), this._big];

	//bottom data
		//all
		var bottom=document.querySelector("#fading .sleep");
		var averages=bottom.querySelector(".averages");
		this._duration=averages.querySelector("em.time");
		this._sleep=averages.querySelector("em.sleep");
		this._wake=averages.querySelector("em.wake");
		this._goal=averages.querySelector("em.goal");
		this._allFadeouts=[this._duration, this._sleep, this._wake, this._goal];

		//info
		var information=bottom.querySelector(".information");
		this._sleep2=information.querySelector(".times .sleep");
		this._wake2=information.querySelector(".times .wake");
		this._duration2=information.querySelector(".bar.this em");
		
		this._overUnder=information.querySelector(".dualie em");
		this._span=information.querySelector(".dualie h2");
		this._lastDuration=information.querySelector(".bar.last em");
		this._infoFadeouts=[this._sleep2, this._wake2, this._span, this._overUnder, this._duration2, this._lastDuration];

		//report
		var report=bottom.querySelector(".report");
		this._averageThis=report.querySelector(".circle.this p");
		this._averageLast=report.querySelector(".circle.last p");
		this._totalThis=report.querySelector(".bar.this p");
		this._totalLast=report.querySelector(".bar.last p");
		this._totalOverUnder=report.querySelector(".doubleBar p");
		this._totalOverUnderSpan=report.querySelector(".doubleBar h2");
		this._reportFadeouts=[this._averageThis, this._averageLast, this._totalThis, this._totalLast, this._totalOverUnder, this._totalOverUnderSpan];

		var day=bottom.querySelector(".day");
		var week=bottom.querySelector(".week");
		MyUtils.addClass([bottom, day, week], "SHOW");
		this._fillbarToday=new Fillbar(information.querySelector(".bar.this .fillbar"), Fillbar.BLUE);
		this._fillbarYesterday=new Fillbar(information.querySelector(".bar.last .fillbar"), Fillbar.BLUE);
		this._fillbarThis=new Fillbar(report.querySelector(".bar.this .fillbar"), Fillbar.BLUE);
		this._fillbarLast=new Fillbar(report.querySelector(".bar.last .fillbar"), Fillbar.BLUE);
		MyUtils.removeClass([bottom, day, week], "SHOW");
}

Sleep.prototype.activate=function()
{

}

Sleep.prototype.deactivate=function()
{
	
}

Sleep.prototype.displayData=function(data)
{
	this._data=data;
	if(data.days.length==1)
	{
		//dial
		TweenLite.to(this, 1, {slept:data.days[0].sleep.duration/data.days[0].sleep.goal, ease:Cubic.easeInOut});
		TweenLite.to(this._fadeOuts, 0.3, {opacity:0, ease:Linear.easeNone, onComplete:this._changeDailyText, onCompleteScope:this});
	}
	else
	{
		//graph
	}
	if(Dashboard.currentDial==0)
	{
		var timeline=new TimelineLite({onComplete:this._changeBottomText, onCompleteScope:this});
		timeline.insert(TweenLite.to(this._allFadeouts, 0.2, {opacity:0, ease:Linear.easeNone}), 0);
		if(Dashboard.day)
			timeline.insert(TweenLite.to(this._infoFadeouts, 0.2, {opacity:0, ease:Linear.easeNone}), 0);
		else
			timeline.insert(TweenLite.to(this._reportFadeouts, 0.2, {opacity:0, ease:Linear.easeNone}), 0);
	}
	else
	{
		this._changeBottomText();
	}
}

Sleep.prototype._changeBottomText=function()
{
	var duration=FullData.secondsToTime(Math.round(this._data.average.sleep.duration/this._data.days.length));
	this._duration.innerHTML=duration;
	
	var sleep=FullData.dateToTime(this._data.average.sleep.sleep);
	this._sleep.innerHTML=sleep;
	this._sleep.className="moon sleep "+FullData.amOrPm(this._data.average.sleep.sleep);

	var wake=FullData.dateToTime(this._data.average.sleep.wake);
	this._wake.innerHTML=wake;
	this._wake.className="cloud wake "+FullData.amOrPm(this._data.average.sleep.wake);

	this._goal.innerHTML=FullData.secondsToTime(Math.round(this._data.average.sleep.goal/this._data.days.length));
	if(Dashboard.currentDial==0)
	{
		TweenLite.to(this._allFadeouts, 0.2, {opacity:1, ease:Linear.easeNone});
		if(Dashboard.day)
		{
			this._sleep2.innerHTML=sleep+FullData.amOrPm(this._data.average.sleep.sleep);
			this._wake2.innerHTML=wake+FullData.amOrPm(this._data.average.sleep.wake);
			this._duration2.innerHTML=duration;
			this._span.innerHTML=Localization.MONTHS[this._data.days[0].date.getMonth()].slice(0,3)+" "+this._data.days[0].date.getDate();
			var difference=this._data.average.sleep.duration-this._data.average.sleep.goal;
			if(difference>0)
				this._overUnder.className="over";
			else if(difference<0)
				this._overUnder.className="under";
			else
				this._overUnder.className="";
			this._overUnder.innerHTML=FullData.secondsToTime(Math.abs(difference));
			this._lastDuration.innerHTML=FullData.secondsToTime(this._data.lastSleep.duration);
			TweenLite.to(this._infoFadeouts, 0.2, {opacity:1, ease:Linear.easeNone});
			this._fillbarToday.show(this._data.days[0].sleep.duration/this._data.days[0].sleep.goal);
			this._fillbarYesterday.show(this._data.lastSleep.duration/this._data.lastSleep.goal);
		}
		else
		{
			console.log(this._data.average.sleep);
			this._averageThis.innerHTML=Math.round(this._data.average.sleep.duration/this._data.average.sleep.goal*100);
			this._averageLast.innerHTML=Math.round(this._data.lastSleep.duration/this._data.lastSleep.goal*100);
			this._totalThis.innerHTML=FullData.secondsToTime(this._data.average.sleep.duration);
			this._totalLast.innerHTML=FullData.secondsToTime(this._data.lastSleep.duration);
			difference=this._data.average.sleep.duration-this._data.average.sleep.goal;
			this._totalOverUnder.innerHTML=FullData.secondsToTime(Math.abs(difference));
			if(difference>0)
				this._totalOverUnder.className="over";
			else if(difference<0)
				this._totalOverUnder.className="under";
			else
				this._totalOverUnder.className="";
			// this._totalOverUnderSpan.innerHTML=;
			this._fillbarThis.show(this._data.average.sleep.duration/this._data.average.sleep.goal);
			this._fillbarLast.show(this._data.lastSleep.duration/this._data.lastSleep.goal);
			TweenLite.to(this._reportFadeouts, 0.2, {opacity:1, ease:Linear.easeNone});
		}
	}
}

Sleep.prototype._changeDailyText=function()
{
	for(var i=0, iLen=this._bigs.length; i<iLen; i++)
	{
		while (this._bigs[i].firstChild)
		{
			this._bigs[i].removeChild(this._bigs[i].firstChild);
		}
		this._bigs[i].appendChild(document.createTextNode(
			FullData.secondsToTime(this._data.days[0].sleep.duration)
			));
	}
	Dashboard.adjustShine(this._big, this._shine);
	this._ideal.innerHTML=FullData.secondsToTime(this._data.days[0].sleep.goal);
	TweenLite.to(this._fadeOuts, 0.3, {opacity:1, ease:Linear.easeNone});
}

Sleep.prototype._drawDaily=function()
{
	this._buffer.context.clearRect(0,0,Dashboard.WIDTH,Dashboard.HEIGHT);
	this._render.context.clearRect(0,0,Dashboard.WIDTH,Dashboard.HEIGHT);
	this._slice.context.clearRect(0,0,Dashboard.WIDTH,Dashboard.HEIGHT);
	this._buffer.context.drawImage(this._static.canvas,0,0);

	Dashboard.drawArc(this._slice.context, Sleep._START_ANGLE-Dashboard.SPACING*2, Sleep._START_ANGLE-Math.min(Math.PI*2, Math.PI*2*this.slept()), Dashboard.RADIUS+Sleep._LINE_WIDTH/2+1.5);
	if(this._slept>0.75)
	{
		this._slice.context.save();
		this._slice.context.translate(Dashboard.CENTER.x,Dashboard.CENTER.y);
		this._slice.context.rotate(Sleep._START_ANGLE+Math.PI*(2*this._slept+0.5));
		this._slice.context.globalCompositeOperation="destination-out";
		this._slice.context.drawImage(Sleep.fade().canvas,-Dashboard.CENTER.x,-Dashboard.CENTER.y);
		this._slice.context.restore();
		if(this._slept>1)
		{
			Dashboard.drawArc(this._slice.context, Sleep._START_ANGLE, Sleep._START_ANGLE-Math.PI*2*(this._slept%1), Dashboard.RADIUS+Sleep._LINE_WIDTH/2+1.5);
		}
	}
	this._slice.context.globalCompositeOperation="source-atop";
	this._slice.context.drawImage(Sleep.gradient(),0,0);
	this._slice.context.globalCompositeOperation="source-over";
	this._buffer.context.drawImage(this._slice.canvas,0,0);
	this._render.context.drawImage(this._buffer.canvas,0,0);
}

Sleep.prototype.slept=function(num)
{
	if(typeof num=="number")
	{
		if(num!=this._slept)
		{
			this._slept=num;
			this._drawDaily();
		}
	}
	else
	{
		return this._slept;
	}
}

Sleep._gradient=null;
Sleep.gradient=function()
{
	if(!Sleep._gradient)
	{
		var mc=new MyCanvas(Dashboard.WIDTH, Dashboard.HEIGHT);
		var ctx=mc.context;
		var gradient=ctx.createLinearGradient(0, 0, 0, Dashboard.HEIGHT);
		gradient.addColorStop(0,"#34E4F9");
		gradient.addColorStop(1,"#0C8DE6");
		ctx.fillStyle=gradient;
		ctx.fillRect(0,0,Dashboard.WIDTH, Dashboard.HEIGHT);
		gradient=ctx.createRadialGradient(Dashboard.CENTER.x, Dashboard.CENTER.y, Dashboard.RADIUS+0.5, Dashboard.CENTER.x, Dashboard.CENTER.y, Dashboard.RADIUS+Sleep._LINE_WIDTH+0.5);
		gradient.addColorStop(0,"rgba(0,0,0,0.3)");
		gradient.addColorStop(0.69,"rgba(0,0,0,0)");
		gradient.addColorStop(0.7,"rgba(255,255,255,0)");
		gradient.addColorStop(1,"rgba(255,255,255,0.3)");
		ctx.fillStyle=gradient;
		ctx.fillRect(0,0,Dashboard.WIDTH, Dashboard.HEIGHT);
		Sleep._gradient=mc.canvas;
	}
	return Sleep._gradient;
}

Sleep._fade=null;
Sleep.fade=function()
{
	if(!Sleep._fade)
	{
		Sleep._fade=new MyCanvas(Dashboard.WIDTH, Dashboard.HEIGHT);
		var ctx=Sleep._fade.context;
		var gradient=ctx.createLinearGradient(Dashboard.CENTER.x-Dashboard.RADIUS, 0, Dashboard.CENTER.x, 0);
		gradient.addColorStop(0,"rgba(0,0,0,0)");
		gradient.addColorStop(1,"#000");
		ctx.strokeStyle=gradient;
		ctx.lineWidth=Sleep._LINE_WIDTH+2;
		Dashboard.drawArc(ctx, Math.PI*1.5, Math.PI*1, Dashboard.RADIUS+Sleep._LINE_WIDTH/2+1.5);
	}
	return Sleep._fade;
}
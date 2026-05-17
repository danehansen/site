"use strict";

	Dashboard.GRAY_DARK="#4D4D4D";
	Dashboard.GRAY_LIGHT="#C4C4C4";
	Dashboard.GREEN="#D1EB24";
	Dashboard.RADIUS=200;
	Dashboard.CENTER={x:250,y:250};
	Dashboard.WIDTH=500;
	Dashboard.HEIGHT=500;
	Dashboard.SPACING=2*Math.PI/(2*200*Math.PI)*0.5;
	Dashboard._NUM_DAYS=5;
	Dashboard._MS_PER_DAY=1000*60*60*24;
	Dashboard.SVG_NAMESPACE="http://www.w3.org/2000/svg";
	Dashboard.XLINK_NAMESPACE="http://www.w3.org/1999/xlink";
	Dashboard.BIG_HEIGHT=96;
	Dashboard.SHINE_STOPS=[0.15, 0.1501, 0.5, 0.501, 0.85, 0.8501];
	Dashboard.TICK_LENGTH=50;
	Dashboard._BUTTON_MARGIN=32;
	Dashboard._ARROW_AMOUNT=Dashboard._NUM_DAYS;
	Dashboard.currentDial=Number.MAX_VALUE;
	Dashboard.day;
	function Dashboard()
	{
		MyCanvas.correctArcs();

		this._faderHolder=document.getElementById("fading");
		this._faders=document.querySelectorAll("#fading > li");

		this._currentDate=new Date(Date.now());
		this._currentDate.setHours(0);
		this._currentDate.setMinutes(0);
		this._currentDate.setSeconds(0);
		this._currentDate.setMilliseconds(0);

		this._tier1=document.getElementById("tier1");
		this._tier1s=this._tier1.querySelectorAll("button");
		this._tier1Span="";
		MyUtils.addEventListener(this._tier1s, "click", MyUtils.bind(this._onTier1Click, this));
		
		this._tier2s=[];
		this._tier2X=0;
		this._currentTier2Num=Number.MAX_VALUE;
		this._tier2=document.getElementById("tier2");
		this._tier2Window=this._tier2.querySelector("div");
		this._tier2Prev=this._tier2.querySelector(".prev");
		this._tier2Next=this._tier2.querySelector(".next");
		this._tier2=this._tier2Window.querySelector("div");
		this._tier2Prev.addEventListener("click", MyUtils.bind(this._onTier2PrevClick, this));
		this._tier2Next.addEventListener("click", MyUtils.bind(this._onTier2NextClick, this));
		this._tier2.addEventListener("click", MyUtils.bind(this._onTier2Click, this));

		this._currentDial=Number.MAX_VALUE;
		this._dialHolder=document.getElementById("rotating")
		this._dailyHolder=this._dialHolder.querySelector("ul.day");
		this._dialHolder.querySelector(".prev").addEventListener("click", MyUtils.bind(this._onDialsPrevClick, this));
		this._dialHolder.querySelector(".next").addEventListener("click", MyUtils.bind(this._onDialsNextClick, this));
		
		this._graphHolder=this._dialHolder.querySelector("ul.week");
		this._headlineHolder=this._dialHolder.querySelector("ul.headlines");
		this._headlines=this._headlineHolder.querySelectorAll("li");

		this._sleep=new Sleep(this._dailyHolder.querySelector(".sleep"));
		this._activity=new Activity(this._dailyHolder.querySelector(".activity"));
		this._goZone=new GoZone();
		this._dataSets=[this._sleep, this._activity, this._goZone];
		this._setTier1("week");
		this.currentDial(1);
	}

	Dashboard.prototype._onTier1Click=function(evt)
	{
		this._setTier1(evt.target.getAttribute("data-span"));
	}

	Dashboard.prototype._setTier1=function(str)
	{
		if(str!=this._tier1Span)
		{
			this._lastTier2Element=null;
			MyUtils.removeClass(this._tier1s, "selected");
			this._tier1.querySelector('button[data-span="'+str+'"]').className="selected";
			for(var i=0, iLen=this._tier2s.length; i<iLen; i++)
			{
				TweenLite.to(this._tier2s[i].element, 0.3, {opacity:0, ease:Linear.easeNone, onComplete:this._tier2.removeChild, onCompleteParams:[this._tier2s[i].element], onCompleteScope:this._tier2});
			}
			this._tier2s=[];
			this._currentTier2Num=Number.MAX_VALUE;
			// document.body.className=str=="day"?"daily":"week";
			document.body.className=str;
			if(str=="day")
			{
				var week=this._faders[this._currentDial].querySelector(".week");
				var daily=this._faders[this._currentDial].querySelector(".day");
				if(daily)
				{
					TweenLite.fromTo(daily, 1, {height:0}, {height:daily.offsetHeight, ease:Cubic.easeInOut, clearProps:"all"});
				}
				week.style.display="block";
				TweenLite.fromTo(week, 1, {height:week.offsetHeight}, {height:0, ease:Cubic.easeInOut, clearProps:"all"});
			}
			else if(this._tier1Span=="day")
			{
				week=this._faders[this._currentDial].querySelector(".week");
				daily=this._faders[this._currentDial].querySelector(".day");
				if(daily)
				{
					daily.style.display="block";
					TweenLite.fromTo(daily, 1, {height:daily.offsetHeight}, {height:0, ease:Cubic.easeInOut, clearProps:"all"});
				}
				TweenLite.fromTo(week, 1, {height:0}, {height:week.offsetHeight, ease:Cubic.easeInOut, clearProps:"all"});
			}
			this._tier1Span=str;
			Dashboard.day=str=="day";
			var width=this._tier2ButtonWidth()*Dashboard._NUM_DAYS;
			this._tier2Prev.style.marginLeft=-width/2-Dashboard._BUTTON_MARGIN-15+"px";
			this._tier2Next.style.marginLeft=width/2+Dashboard._BUTTON_MARGIN+"px";
			this._tier2Window.style.width=width+"px";
			this._populateTier2(-Dashboard._NUM_DAYS, true);
			this._setTier2(Dashboard._NUM_DAYS-1);
		}
	}

	Dashboard.prototype._onTier2Click=function(evt)
	{
		var num=this._indexOfTier2(evt.target);
		this._changeDate(num-this._currentTier2Num);
		this._setTier2(num);
	}

	Dashboard.prototype._onTier2PrevClick=function(evt)
	{
		this._changeDate(-1);
		var dest=this._currentTier2Num-1;
		if(dest<0)
		{
			this._populateTier2(-Dashboard._ARROW_AMOUNT);
			this._currentTier2Num=Number.MAX_VALUE;
			dest=Dashboard._ARROW_AMOUNT-1;
			this._tier2X+=(Dashboard._ARROW_AMOUNT*this._tier2ButtonWidth());
			TweenLite.to(this._tier2, 0.5, {left:this._tier2X, ease:Cubic.easeOut, onComplete:this._tier2Scooted, onCompleteScope:this});
		}
		this._setTier2(dest);
	}

	Dashboard.prototype._onTier2NextClick=function(evt)
	{
		this._changeDate(1);
		var dest=this._currentTier2Num+1;
		if(dest>Dashboard._NUM_DAYS-1)
		{
			this._populateTier2(Dashboard._ARROW_AMOUNT);
			this._currentTier2Num=Number.MAX_VALUE;
			dest=Dashboard._NUM_DAYS-Dashboard._ARROW_AMOUNT;
			this._tier2X-=(Dashboard._ARROW_AMOUNT*this._tier2ButtonWidth());
			TweenLite.to(this._tier2, 0.5, {left:this._tier2X, ease:Cubic.easeOut, onComplete:this._tier2Scooted, onCompleteScope:this});
		}
		this._setTier2(dest);
	}

	Dashboard.prototype._populateTier2=function(num, fade)
	{
		var direction=num>=0?1:-1;
		var abs=Math.abs(num);
		var lastElement;
		for(var i=0; i<abs; i++)
		{
			if(this._tier2s.length==0)
			{
				var date=new Date(this._currentDate.getTime());
				var left=-this._tier2X+(Dashboard._NUM_DAYS-1)*this._tier2ButtonWidth();
			}
			else if(direction>0)
			{
				date=new Date(this._tier2s[this._tier2s.length-1].end);
				left=this._tier2s[this._tier2s.length-1].left+this._tier2ButtonWidth();
			}
			else
			{
				date=new Date(this._tier2s[0].begin);
				this._changeDate(-1,date);
				left=this._tier2s[0].left-this._tier2ButtonWidth();
			}
			var tier2=this._createTier2Object(date, left);
			if(direction>0)
			{
				this._tier2.appendChild(tier2.element);
				this._tier2s.push(tier2);
				if(this._tier2s.length>Dashboard._NUM_DAYS)
					this._tier2s.shift();
			}
			else
			{
				this._tier2.insertBefore(tier2.element, this._tier2.firstChild);
				this._tier2s.unshift(tier2);
				if(this._tier2s.length>Dashboard._NUM_DAYS)
					this._tier2s.pop();
			}
			if(fade)
				TweenLite.from(tier2.element, 0.3, {opacity:0, ease:Linear.easeNone, delay:0.3});
		}
	}

	Dashboard.prototype._setTier2=function(num)
	{
		if(num!=this._currentTier2Num)
		{
			this._currentTier2Num=num;
			if(this._lastTier2Element)
				this._lastTier2Element.className="";
			this._tier2s[num].element.className="selected";
			this._lastTier2Element=this._tier2s[num].element;

			//request data here
				this._dataReceived(FullData.random(this._tier2s[num].begin,this._tier2s[num].end));
		}
	}

	Dashboard.prototype._createTier2Object=function(date, left)
	{
		var tier2=
			{
				element:document.createElement("button"),
				left:left,
			};
		tier2.element.style.width=this._tier2ButtonWidth()+"px";
		tier2.element.style.left=left+"px";
		switch(this._tier1Span)
		{
			case "day":
				tier2.begin=date.getTime();
				tier2.element.innerHTML=Localization.MONTHS[date.getMonth()].slice(0,3)+" "+date.getDate();
				date.setDate(date.getDate()+1);
				tier2.end=date.getTime();
				break;
			case "week":
				date.setDate(date.getDate()-date.getDay());
				tier2.begin=date.getTime();
				var html=Localization.MONTHS[date.getMonth()].slice(0,3)+" "+date.getDate();
				date.setDate(date.getDate()+7);
				tier2.end=date.getTime();
				date.setDate(date.getDate()-1);
				tier2.element.innerHTML=html+"-"+Localization.MONTHS[date.getMonth()].slice(0,3)+" "+date.getDate();
				break;
			case "month":
				date.setDate(1);
				tier2.begin=date.getTime();
				tier2.element.innerHTML=Localization.MONTHS[date.getMonth()].slice(0,3)+" "+date.getFullYear();
				date.setMonth(date.getMonth()+1);
				tier2.end=date.getTime();
				break;
			case "year":
				date.setDate(1);
				date.setMonth(0);
				tier2.begin=date.getTime();
				tier2.element.innerHTML=date.getFullYear();
				date.setYear(date.getFullYear()+1);
				tier2.end=date.getTime();
				break;
		}
		return tier2;
	}

	Dashboard.prototype._indexOfTier2=function(element)
	{
		for(var i=0, iLen=this._tier2s.length; i<iLen; i++)
		{
			if(element==this._tier2s[i].element)
				return i;
		}
		return -1;
	}

	Dashboard.prototype._tier2Scooted=function()
	{
		var toRemove=[];
		var tier2s=this._tier2.querySelectorAll("button");
		for(var i=0, iLen=tier2s.length; i<iLen; i++)
		{
			if(this._indexOfTier2(tier2s[i])<0)
				this._tier2.removeChild(tier2s[i]);
		}
	}

	Dashboard.prototype._dataReceived=function(data)
	{
		var data=new FullData(data);
		this._activity.displayData(data);
		this._sleep.displayData(data);
		this._goZone.displayData(data);
	}

	Dashboard.prototype._tier2ButtonWidth=function()
	{
		switch(this._tier1Span)
		{
			case "day":
				return 111;
				break;
			case "week":
				return 169;
				break;
			case "month":
				return 130;
				break;
			case "year":
				return 96 ;
				break;
		}
	}

	Dashboard.prototype._changeDate=function(num, date)
	{
		if(!date)
			date=this._currentDate;
		switch(this._tier1Span)
		{
			case "day":
				date.setDate(date.getDate()+num);
				break;
			case "week":
				date.setDate(date.getDate()+7*num);
				break;
			case "month":
				date.setMonth(date.getMonth()+num);
				break;
			case "year":
				date.setFullYear(date.getFullYear()+num);
				break;
		}
	}

	Dashboard.prototype._onDialsPrevClick=function(evt)
	{
		this.currentDial(this.currentDial()-1);
	}

	Dashboard.prototype._onDialsNextClick=function(evt)
	{
		this.currentDial(this.currentDial()+1);
	}

	Dashboard.prototype.currentDial=function(num)
	{
		if(typeof num=="number")
		{
			num=MyMath.modulo(num, 3);
			if(num!=this._currentDial)
			{
				var timeline=new TimelineLite({onComplete:this._currentDialComplete, onCompleteScope:this});
				var fromHeight=this._faderHolder.offsetHeight;
				this._faderHolder.className="transitioning";
				if(this._currentDial<Number.MAX_VALUE)
				{
					this._dataSets[this._currentDial].deactivate();
					timeline.insert(TweenLite.to([this._dataSets[this._currentDial].dayElement, this._headlines[this._currentDial]], 1, {opacity:0.15, ease:Linear.easeNone}),0);
					timeline.insert(TweenLite.to(this._faders[this._currentDial], 1, {className:"+=noneAlpha", ease:Linear.easeNone}),0);
				}
				timeline.insert(TweenLite.to([this._dataSets[num].dayElement, this._headlines[num]], 1, {autoAlpha:1, ease:Linear.easeNone}),0);
				timeline.insert(TweenLite.to(this._faders[num], 1, {className:"-=noneAlpha", ease:Linear.easeNone}),0);
				this._dataSets[num].activate();
				timeline.insert(TweenLite.to(this._dailyHolder, 1, {left:(num-1)*-700, ease:Cubic.easeInOut}),0);
				timeline.insert(TweenLite.to(this._graphHolder, 1, {left:(num-1)*-1200, ease:Cubic.easeInOut}),0);
				timeline.insert(TweenLite.to(this._headlineHolder, 1, {left:(num-1)*-400, ease:Cubic.easeInOut}),0);
				timeline.insert(TweenLite.fromTo(this._faderHolder, 1, {height:fromHeight}, {height:this._faders[num].offsetHeight, ease:Cubic.easeInOut}),0);
				this._currentDial=num;
				Dashboard.currentDial=num;
			}
		}
		else
		{
			return this._currentDial;
		}
	}

	Dashboard.prototype._currentDialComplete=function()
	{
		this._faderHolder.style.height="auto";
		this._faderHolder.className="";
	}

	Dashboard._tickGradient=null;
	Dashboard.tickGradient=function()
	{
		if(!Dashboard._tickGradient)
		{
			var mc=new MyCanvas(1, Dashboard.TICK_LENGTH);
			var ctx=mc.context;
			var gradient=ctx.createLinearGradient(0, 0, 0, Dashboard.TICK_LENGTH);
			gradient.addColorStop(0,"rgba(196,196,196,0");
			gradient.addColorStop(1,Dashboard.GRAY_LIGHT);
			ctx.fillStyle=gradient;
			ctx.fillRect(0, 0, 1, Dashboard.TICK_LENGTH);
			Dashboard._tickGradient=mc.canvas;
		}
		return Dashboard._tickGradient;
	}

	Dashboard.drawTick=function(ctx, angle, length)
	{
		if(typeof length!="number")
			length=Dashboard.TICK_LENGTH;
		ctx.save();
		ctx.translate(Dashboard.CENTER.x,Dashboard.CENTER.y);
		ctx.rotate(-angle+Math.PI/2);
		var gradient=ctx.createLinearGradient(0, -Dashboard.RADIUS-length, 0, -Dashboard.RADIUS);
		gradient.addColorStop(0,"rgba(196,196,196,0)");
		gradient.addColorStop(1,Dashboard.GRAY_LIGHT);
		ctx.strokeStyle=gradient;
		ctx.beginPath();
		ctx.moveTo(0, -Dashboard.RADIUS);
		ctx.lineTo(0, -Dashboard.RADIUS-length);
		ctx.stroke();
		ctx.restore();
	}

	Dashboard.drawArc=function(ctx, start, end, radius)
	{
		if(end<start)
		{
			radius=radius?radius:Dashboard.RADIUS;
			ctx.beginPath();
			ctx.arc(Dashboard.CENTER.x,Dashboard.CENTER.y,radius,-start, -end);
			ctx.stroke();
		}
	}

	Dashboard.adjustShine=function(big, gradient)
	{
		var allRect=big.querySelector(".color").getBBox();
		var square;
		var visualRect=
		{
			width:big.querySelector("tspan").getComputedTextLength(),
			height:Dashboard.BIG_HEIGHT,
			x:allRect.x,
			y:200
		};
		
		var size=Math.max(visualRect.width, Dashboard.BIG_HEIGHT);
		var offset=0;
		var offsetElement=big.querySelector("tspan + tspan");
		if(offsetElement)
			offset=offsetElement.getComputedTextLength()/2;
		var visualSquare=
		{
			width:size,
			height:size,
			x:250-size/2-offset,
			y:200+Dashboard.BIG_HEIGHT/2-size/2
		};

		var diff=Math.abs(visualRect.width-visualSquare.width)+Math.abs(visualRect.height-visualSquare.height)/2;
		var gradientSquare=
		{
			width:visualSquare.width-diff,
			height:visualSquare.height-diff,
			x:visualSquare.x+diff/2,
			y:visualSquare.y+diff/2
		};

		gradient.setAttribute("x1", gradientSquare.x);
		gradient.setAttribute("x2", gradientSquare.x+gradientSquare.width);
		gradient.setAttribute("y1", gradientSquare.y);
		gradient.setAttribute("y2", gradientSquare.y+gradientSquare.height);
		var proportion=Dashboard.BIG_HEIGHT/gradientSquare.height;
		var stop1=0.15*proportion;
		var stop2=stop1+0.001*proportion;
		var stop5=1-stop2;
		var stop6=1-stop1;
		var stops=gradient.querySelectorAll("stop");
		stops[1].setAttribute("offset", stop1);
		stops[2].setAttribute("offset", stop2);
		stops[5].setAttribute("offset", stop5);
		stops[6].setAttribute("offset", stop6);
	}

	Dashboard.curveTextPath=function(path, start, end, radius)
	{
		if(typeof radius!="number")
			radius=Dashboard.RADIUS+4.5;
		var margin=Dashboard.SPACING*20;
		var difference=Math.abs((start-margin)-(end+margin));
		var startX=Math.cos(start-margin)*radius+Dashboard.CENTER.x;
		var startY=-Math.sin(start-margin)*radius+Dashboard.CENTER.y;
		var largeArcFlag=difference<=Math.PI?0:1;
		var endX=Math.cos(end+margin)*radius+Dashboard.CENTER.x;
		var endY=-Math.sin(end+margin)*radius+Dashboard.CENTER.y;
		path.setAttribute("d", "M "+startX+" "+startY+" A "+radius+" "+radius+" 0 "+largeArcFlag+" 1 "+endX+" "+endY);
	}

	Dashboard.activityName=function(num)
	{
		switch (num)
		{
			case 1:
				return "walking";
				break;
			case 2:
				return "running";
				break;
			case 3:
				return "swimming";
				break;
			case 4:
				return "cycle";
				break;
			case 5:
				return "sports";
				break;
			case 6:
				return "general";
				break;
			case 7:
				return "sedentary";
				break;
			case 8:
				return "sleep";
				break;
		}
	};

//init

	new Dashboard();
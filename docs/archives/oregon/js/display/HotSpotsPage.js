"use strict";
	
HotSpotsPage._DURATION=250;
HotSpotsPage.instance=null;
HotSpotsPage._FACTS = [
	"Oregon has appeared in BCS Bowl games the last 4 seasons,<br/>the longest current streak in the nation.",
	"Oregon has ended the season in the BCS top 10 for the past 4 seasons,<br/>the longest current streak in college football.",
	"Oregon has collected a total of 10 conference<br/>titles, including 5 since 2000.",
	"Oregon‘s largest margin of victory came in 1910 when they<br/>defeated the University of Puget Sound 115–0.",
	"It’s a tradition for the announcer to call out, “It never rains at Autzen stadium”<br/>sometime during each home game.",
	"The in-state rivalry with Oregon State, known as the “Civil War”,<br/>is the 7th oldest rivalry in Division I FBS football.",
	"The Duck has been the Oregon mascot for decades, thanks to a handshake agreement<br/>made between then Athletic Director Leo Harris and Walt Disney in 1947.",
	"Autzen is notorious for its intimidating environment. On Oct 27, 2007 in a game against<br/>USC, the sell-out crowd hit 127.2 decibels—which is about as loud as a jet engine.",
	"“The Pick,” a play in which Kenny Wheaton intercepted a ball and took it 97-yards for a<br/>TD in a tight game against Washington, is replayed before each Oregon home game.",
	"Autzen’s official capacity is 54,000; however, attendance regularly reaches around<br/>59,000 and has exceeded capacity every game since the 2002 expansion.",
	"While recruited by Oregon, Coach Helfrich decided to play his college ball at Southern<br/>Oregon where he was an All-American QB and set several school passing records.",
	"The winningest coach in Oregon history, Coach Bellotti led the Ducks<br/>to a program best 116 wins and a total of 12 bowl games."
];
HotSpotsPage._ACADEMIC_FACTS = [
	"The U of O has students from all 50 states, the District of Columbia,<br/>two U.S. territories, and 89 countries around the world.",
	"74% of U of O graduates are employed or continuing their<br/>education within three months of graduation.",
	"Out-of-state and international students make up 45% of the student body.",
	"Median class size at the U of O is 20 students.",
	"The student to teacher ratio at the University of Oregon is 20:1.",
	"There are 269 academic programs at the U of O.",
	"University of Oregon alumni and staff include two Nobel Prize recipients, 10 Pulitzer Prize winners,<br/>19 Rhodes scholars, four Marshall scholars, 58 Guggenheim Fellows, and 129 Fulbright scholars.",
	"The undergraduate architecture program is currently ranked as the #1 public program for<br/>“Sustainable Design Practice and Principles” by DesignIntelligence magazine.",
	"The Warsaw Sports Marketing Center was one of the first programs to offer an M.B.A. in sports business<br/>and is noted as having the best sports business and marketing programs in the nation.",
	"Established in 1912, The School of Journalism and Communication<br/>is one of the oldest journalism schools in the US.",
	"The University of Oregon provides an abundance of educational opportunities with eight<br/>schools—six professional, an Arts and Sciences College and an Honors College.",
	"The University of Oregon boasts more than 250 student groups."
];

function HotSpotsPage(id, data, path, numImgs, xLoc, reverse, cycle)
{
	this._cycle=cycle;
	this._reverse=reverse;
	HotSpotsPage.instance=this;
	this._element=document.getElementById(id);
	this._xLoc=xLoc;
	this._id=id;
	this._path=path;
	this._numImgs=numImgs;
	this._lastPoint=0;
	this.easedProgress=0;
	this._progress=0;
	this._imgsLoaded=false;
	this._scrollAmount=0;
	this._tll;
	this._timeline;
	this._preloadTimeline = new TimelineLite({ paused: true });
	this._preloadTimeline.append(TweenLite.to(this._element.querySelector('.preloader_diamond_1'), 1, { width: 40, ease:Linear.easeNone }));
	this._preloadTimeline.append(TweenLite.to(this._element.querySelector('.preloader_diamond_2'), 1, { height: 40, ease:Linear.easeNone }));
	this._preloadTimeline.append(TweenLite.to(this._element.querySelector('.preloader_diamond_3'), 1, { width: 40, ease:Linear.easeNone }));
	this._preloadTimeline.append(TweenLite.to(this._element.querySelector('.preloader_diamond_4'), 1, { height: 40, ease:Linear.easeNone }));
	this._imgSequence=new ImgSequence(this._element.querySelector(".imgSequence"), this._path+"/lo/img", 1, this._numImgs, ".jpg", this._path+"/hi/img", {onProgress:MyUtils.bind(this._onPreloadProgress,this), onComplete:MyUtils.bind(this._onPreloadComplete,this), formatLength:3});
	
	this._onTimelineChangeHandler=MyUtils.bind(this._onTimelineChange,this);
	this._easePreloaderHandler=MyUtils.bind(this._easePreloader,this);
	TweenLite.ticker.addEventListener("tick", this._easePreloaderHandler, this);
	this._trackers=[];
	this._tll=new TimelineLite({paused:true});
	this._vidLocs=[];
	for(var i=0, iLen=data.length; i<iLen; i++)
	{
		if(HotSpotsPage.isVideo(data[i].content))
			this._vidLocs[i]=data[i].content;
		var tracker=this._element.querySelector("#hotspot"+i);
		this._trackers.push(tracker);
		var positions=data[i].positions;
		for(var j=0, jLen=positions.length-1; j<jLen; j++)
		{
			if(j==0)
				this._tll.insert(new TweenLite.fromTo(tracker,positions[j+1].progress-positions[j].progress,{left:positions[j].x+"%",top:positions[j].y+"%"},{left:positions[j+1].x+"%",top:positions[j+1].y+"%",ease:Linear.easeNone}),positions[j].progress);
			else
				this._tll.insert(new TweenLite.to(tracker,positions[j+1].progress-positions[j].progress,{left:positions[j+1].x+"%",top:positions[j+1].y+"%",ease:Linear.easeNone}),positions[j].progress);
		}
	}
	this._tll.progress(0.1);
	this._tll.progress(0);
	this._unfolders=[];
	this._onXClickHandler=MyUtils.bind(this._onXClick, this);
	topNavX().addEventListener("click",this._onXClickHandler);
	this._instructions();
}

HotSpotsPage.prototype._onXClick=function(evt)
{
	evt.preventDefault();
	window.location=this._xLoc;
}

HotSpotsPage.prototype._easePreloader=function()
{
	MyMath.ease(this, "easedProgress", this._progress, 0.1);
	if(this._imgsLoaded && this.easedProgress>=0.999)
		TweenLite.ticker.removeEventListener("tick", this._easePreloaderHandler);
}

HotSpotsPage.prototype._onPreloadProgress=function()
{
	this._progress=this._imgSequence.progress;
	this._preloadTimeline.progress(this._progress);
}

HotSpotsPage.prototype._onPreloadComplete=function()
{
	this._imgsLoaded=true;
	this._unloadTimeline = new TimelineLite({ onComplete: this._removePreloader, onCompleteScope: this});
	
	var greyDiamonds = this._element.querySelectorAll('.grey_diamond');
	MyUtils.addClass(greyDiamonds, 'no_more_grey');
	
	var diamond1 = this._element.querySelector('.preloader_diamond_1')
	diamond1.style.left = 'auto';
	diamond1.style.right = '47px';
	
	var diamond1 = this._element.querySelector('.preloader_diamond_2')
	diamond1.style.top = 'auto';
	diamond1.style.bottom = '47px';
	
	var diamond1 = this._element.querySelector('.preloader_diamond_3')
	diamond1.style.right = 'auto';
	diamond1.style.left = '47px';
	
	var diamond1 = this._element.querySelector('.preloader_diamond_4')
	diamond1.style.bottom = 'auto';
	diamond1.style.top = '47px';

	this._unloadTimeline.append(TweenLite.to(this._element.querySelector('.preloader_diamond_1'), 0.1, { width: 0, ease:Linear.easeNone }));
	this._unloadTimeline.append(TweenLite.to(this._element.querySelector('.preloader_diamond_2'), 0.1, { height: 0, ease:Linear.easeNone }));
	this._unloadTimeline.append(TweenLite.to(this._element.querySelector('.preloader_diamond_3'), 0.1, { width: 0, ease:Linear.easeNone }));
	this._unloadTimeline.append(TweenLite.to(this._element.querySelector('.preloader_diamond_4'), 0.24, { height: 0, ease:Cubic.easeOut }));
}

HotSpotsPage.prototype._preloaderGone=function()
{
	TweenLite.to(this._element.querySelectorAll(".diamondButton"), 0.5, {autoAlpha:1, ease:Linear.easeNone});
	var diamonds=this._element.querySelectorAll(".unfoldingHotspot");
	var winHeight=window.innerHeight/2;
	for(var i=0, iLen=diamonds.length; i<iLen; i++)
	{
		var hotspot=new UnfoldingHotspot(diamonds[i])
		this._unfolders.push(hotspot);
		hotspot.upsideDown(hotspot.element.offsetTop>winHeight);
		if(this._vidLocs[i])
			hotspot.loadVideo(this._vidLocs[i]);
	}
	this._timeline=new Timeline(this._element.querySelector(".timeline"));
	TweenLite.to(this._timeline.element, 0.5, {bottom:0, ease:Cubic.easeOut});
	this._timeline.element.addEventListener(Timeline.CHANGE, this._onTimelineChangeHandler);
	this._hjs=new ScrollHijack(MyUtils.bind(this._onScroll,this), leaveDefaults(), this._element);
	this._onScroll(this._lastPoint);
	TweenLite.from(this._element.querySelector(".spriteHolder"), 0.5, {alpha:0, ease:Linear.easeNone});
	showTopNav(true);
}

HotSpotsPage.prototype._removePreloader=function()
{
	this._instructionsTimeline.pause();
	TweenLite.to(this._element.querySelector('.loading_information'), 0.5, { autoAlpha:0, ease:Linear.easeNone, onComplete: this._preloaderGone, onCompleteScope: this });
}

HotSpotsPage.prototype._onScroll=function(point)
{
	var sum=point.x||0+point.y||0;
	var difference=sum-this._lastPoint;
	this._lastPoint=sum;
	if(this._cycle)
		this.moveTo(MyMath.modulo(this._scrollAmount+difference/HotSpotsPage._DURATION, 1));
	else
		this.moveTo(Math.max(Math.min(1,this._scrollAmount+difference/HotSpotsPage._DURATION),0))
}

HotSpotsPage.prototype.currentPos=function()
{
	console.log(this._scrollAmount);
}

HotSpotsPage.prototype.pointObject=function(hotSpotId)
{
	var targ=document.getElementById("#hotspot" + hotSpotId);
	var size=document.querySelector(".size");
	var xPos = (targ.offsetLeft / size.offsetWidth * 100).toFixed(2);
	var yPos = (targ.offsetTop / size.offsetHeight * 100).toFixed(2);
	var progress =this._scrollAmount.toFixed(3);
	console.log('{x:' + xPos + ',	y:' + yPos + ',	progress:' + progress + '},')
}

HotSpotsPage.prototype.moveTo=function(num)
{
	this._scrollAmount=num;
	this._timeline.progress(num);
	this._tll.progress(num);
	this._imgSequence.set(this._reverse?(1-num):num);
}

HotSpotsPage.prototype._onTimelineChange=function()
{
	this.moveTo(this._timeline.progress());
}

HotSpotsPage.prototype.deactivate=function()
{
	if(this._timeline)
	{
		this._timeline.deactivate();
		this._timeline.element.removeEventListener(Timeline.CHANGE, this._onTimelineChangeHandler);
		this._hjs.stop();
	}
	this._instructionsTimeline.pause();
	topNavX().removeEventListener("click",this._onXClickHandler);
	TweenLite.ticker.removeEventListener("tick", this._easePreloaderHandler);
	this._imgSequence.deactivate();
	for(var i=0, iLen=this._unfolders.length; i<iLen; i++)
	{
		this._unfolders[i].deactivate();
	}
}

HotSpotsPage.prototype.destroy=function()
{
	HotSpotsPage.instance=null;
}

HotSpotsPage.prototype._instructions=function()
{
	TweenLite.to(this._element.querySelector('.loading_information .instructions_and_factoids'), 0.5, {autoAlpha:1, ease:Cubic.easeOut, top:0, delay:0.2, onComplete: this._instructions2, onCompleteScope: this });
	
	var copy = this._element.querySelectorAll(".instructions_and_factoids li");
	this._instructionsTimeline = new TimelineLite({ onComplete: this._loopInstructions, onCompleteScope: this, paused: true });
	for(var i = 0, iLen = copy.length; i < iLen; i++)
	{
		var position=5*(i+1);
		var duration=0.3;
		this._instructionsTimeline.call(this._imgSequence.loadQueue.setPaused,[true],this._imgSequence.loadQueue,position);
		this._instructionsTimeline.insert(TweenLite.to(copy[i], duration, {autoAlpha:0, ease:Cubic.easeIn }), position+0.1);
		this._instructionsTimeline.insert(TweenLite.to(copy[(i+1)%iLen], duration, {autoAlpha:1, ease:Cubic.easeOut }), position+0.1);
		this._instructionsTimeline.call(this._imgSequence.loadQueue.setPaused,[false],this._imgSequence.loadQueue,position+duration+0.2);
	}
	this._imgSequence.load();
}

HotSpotsPage.prototype._instructions2=function()
{
	this._instructionsTimeline.play();
}

HotSpotsPage.prototype._loopInstructions = function()
{
	this._instructionsTimeline.play(0);
}

HotSpotsPage.isText=function(str)
{
	if(str.split(" ").length>1)
		return true;
	else
		return false;
}

HotSpotsPage.isImg=function(str)
{
	if(str.split(" ").length==1 && str.split(".").length==2)
		return true;
	else
		return false;
}

HotSpotsPage.isVideo=function(str)
{
	if(str.split(" ").length==1 && str.split(".").length==1)
		return true;
	else
		return false;
}
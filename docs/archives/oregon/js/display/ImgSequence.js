"use strict";
	
function ImgSequence(element, srcPrefix, startNum, endNum, srcSuffix, hiResPrefix, options)
{
	this._startNum=startNum;
	this._hiRes=null;
	this._hiResTimeout=null;
	this._hiResPrefix=hiResPrefix;
	this._suffix=srcSuffix;
	this.progress=0;
	this._visibleNum=Number.MAX_VALUE;
	this._element=element.querySelector(".size");
	this._hiResHolder=element.querySelector(".hiResHolder");
	this._img=element.querySelector(".spriteHolder img");
	this._manifest=[];
	this._totalFrames=endNum-startNum+1;
	this._formatLength=options.formatLength || 0;
	if(options)
	{
		if(options.onProgress)
			this._onProgressCallback=options.onProgress;
		if(options.onComplete)
			this._onCompleteCallback=options.onComplete;
		if(options.onFileLoad)
		{
			this._onFileLoadHandler=options.onFileLoad;
			this.loadQueue.addEventListener("fileload",this._onFileLoadHandler);
		}
	}
	for(var i=0, limit=endNum-startNum; i<=limit; i++)
	{
		this._manifest.push({src:srcPrefix+ImgSequence._formatLength(i+startNum, this._formatLength)+srcSuffix, id:"sequence"+i});
	}
	this.loadQueue = new createjs.LoadQueue();
	this._onProgressHandler=MyUtils.bind(this._onProgress,this);
	this._onCompleteHandler=MyUtils.bind(this._onComplete,this);
	this.loadQueue.addEventListener("progress",this._onProgressHandler);
	this.loadQueue.addEventListener("complete",this._onCompleteHandler);
	this.loadQueue.setMaxConnections(10);
}

ImgSequence.prototype.load=function()
{
	this.loadQueue.loadManifest(this._manifest);
}

ImgSequence.prototype._onProgress=function(evt)
{
	this.progress=evt.loaded;
	if(this._onProgressCallback)
		this._onProgressCallback();
}

ImgSequence.prototype._removeListeners=function()
{
	this.loadQueue.removeEventListener("progress",this._onProgressHandler);
	this.loadQueue.removeEventListener("complete",this._onCompleteHandler);
	if(this._onFileLoadHandler)
		this.loadQueue.removeEventListener("fileload",this._onFileLoadHandler);
}

ImgSequence.prototype._onComplete=function(evt)
{
	this._removeListeners();
	this._imgWidth=this._manifest[0].tag.width;
	this._imgHeight=this._manifest[0].tag.height;
	this._onResize();
	this.windowResizeHandler=MyUtils.bind(this._onResize,this);
	window.addEventListener("resize",this.windowResizeHandler);
	if(this._onCompleteCallback)
		this._onCompleteCallback();
}

ImgSequence.prototype._onResize=function()
{
	var w=window.innerWidth;
	var h=window.innerHeight;
	var endHeight=w/this._imgWidth*this._imgHeight;
	if(endHeight>h)
	{
		MyUtils.css(this._element,{top:-(endHeight-h)/2+"px", left:0, width:w+"px",height:endHeight+"px"});
	}
	else
	{
		var endWidth=h/this._imgHeight*this._imgWidth;
		MyUtils.css(this._element,{top:0, left:-(endWidth-w)/2+"px", width:endWidth+"px",height:h+"px"});
	}
}

ImgSequence.prototype.set=function(amount)
{
	var newVisibleNum=Math.min(Math.floor(this._totalFrames*amount),this._totalFrames-1);
	if(newVisibleNum!=this._visibleNum)
	{
		this._visibleNum=newVisibleNum;
		if(this._hiRes)
		{	
			this._hiRes.removeEventListener("load",this.onHiResLoadedHandler);
			this._hiResHolder.removeChild(this._hiRes);
			this._hiRes=null;
		}
		this._img.src=this._manifest[this._visibleNum].src;
		this._setHiResTimeout();
	}
}

ImgSequence.prototype.deactivate=function()
{
	if(this.loadQueue.progress<1)
	{
		this.loadQueue.close();	
		this._removeListeners();
	}
	if(this.windowResizeHandler)
		window.removeEventListener("resize",this.windowResizeHandler);
	if(this._hiResTimeout)
		clearInterval(this._hiResTimeout);
	if(this._hiRes)
		this._hiRes.removeEventListener("load",this.onHiResLoadedHandler);
}

ImgSequence.prototype._setHiResTimeout=function()
{
	if(!this._hiResTimeout)
		this._hiResTimeout=setInterval(MyUtils.bind(this._onHiResInterval,this), 50);
	this._hiResCounter=0;
}

ImgSequence.prototype._onHiResInterval=function()
{
	this._hiResCounter++;
	if(this._hiResCounter>=5)
	{
		clearInterval(this._hiResTimeout);
		this._loadHiRes();
		this._hiResTimeout=null;
	}
}

ImgSequence.prototype._loadHiRes=function()
{
	this._hiRes=document.createElement("img");
	this._hiRes.src=this._hiResPrefix+ImgSequence._formatLength(this._startNum+this._visibleNum,this._formatLength)+this._suffix;
	this.onHiResLoadedHandler=MyUtils.bind(this._onHiResLoaded,this);
	this._hiRes.addEventListener("load",this.onHiResLoadedHandler);
	this._hiResHolder.appendChild(this._hiRes);
	MyUtils.css(this._hiRes,{opacity:0,visibility:"hidden"});
}

ImgSequence.prototype._onHiResLoaded=function()
{
	TweenLite.to(this._hiRes, 0.5, {autoAlpha:1, ease:Linear.easeNone});
}

ImgSequence._formatLength=function(num, len)
{
	var str=num.toString();
	while(str.length<len)
	{
		str="0"+str;
	}
	return str;
}
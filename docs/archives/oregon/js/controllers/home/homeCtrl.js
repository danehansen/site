"use strict";

function homeCtrl($scope)
{
	$scope.id="home";
	var element;
	var titleCard;
	var button;

	var videoHolder;
	var video;
	var videoIsOpen=false;

	var cursorTimer;

	$scope.init=function()
	{
		element=document.getElementById($scope.id);
		titleCard=new TitleCard(element.querySelector(".titleCard"));
	}

	$scope.activate=function()
	{
		var h2=element.querySelector("h2");
		h2.style.display="block";
		var str=h2.innerHTML;
		h2.innerHTML="";
		for(var i=0, iLen=str.length; i<iLen; i++)
		{
			var letter=document.createElement("div");
			if(str[i]==" ")
				letter.innerHTML="&nbsp;";
			else
				letter.innerHTML=str[i];
			h2.appendChild(letter);
			letter.style.width=letter.offsetWidth+10+"px";
			TweenLite.set(letter, {transformPerspective:500});
			TweenLite.from(letter, 0.5, {rotationY:90, delay:i*0.1+0.5, ease:Cubic.easeInOut});
		}
		titleCard.play();
		button=element.querySelector("a");
		MySounds.playLoop(LOOPS.home);
		videoHolder=document.getElementById("videoHolder");
		video=videoHolder.querySelector("video");

		button.addEventListener("click",onButtonClick);
	}

	function onButtonClick(evt)
	{
		videoIsOpen=true;
		MySounds.play(FX.click);
		onResize();
		TweenLite.to(videoHolder,0.5,{autoAlpha:1,ease:Linear.easeNone});
		if(video.currentTime!=0)
			video.currentTime=0;
		video.play();
		MySounds.playLoop();
		if(timer)
			stopTimer();
		cursor().currentFrame(19);
		MyUtils.autoAlpha(cursor().elements, 1);
		cursor().elements[0].style.zIndex=1001;

		if(!cursorTimer)
		{
			cursorTimer=new MyTimer(1000,1);
			cursorTimer.addEventListener(MyTimerEvent.TIMER, onTimer);
		}
		onCursorMove(evt);
		cursorTimer.start();

		window.addEventListener("resize", onResize);
		videoHolder.addEventListener("click", mainVidClose);
		video.addEventListener("ended", mainVidClose);
		document.addEventListener("mousemove", onCursorMove);
	}

	function onCursorMove(evt)
	{
		cursor().elements[0].style.left=evt.clientX+"px";
		cursor().elements[0].style.top=evt.clientY+"px";
		if(!cursorTimer.running())
			MyUtils.autoAlpha(cursor().elements, 1);
		cursorTimer.reset();
		cursorTimer.start();
	}

	function onResize()
	{
		MyMath.cover(video,videoHolder);
	}

	function mainVidClose()
	{
		videoIsOpen=false;
		removeListeners();
		MySounds.playLoop(LOOPS.home);
	}

	function onTimer(evt)
	{
		MyUtils.autoAlpha(cursor().elements, 0);
	}

	function removeListeners()
	{
		videoHolder.removeEventListener("click", mainVidClose);
		window.removeEventListener("resize", onResize);
		video.removeEventListener("ended", mainVidClose);
		document.removeEventListener("mousemove", onCursorMove);
		MyUtils.autoAlpha(cursor().elements, 0);
		video.pause();
		TweenLite.to(videoHolder,0.5,{autoAlpha:0,ease:Linear.easeNone});
	}

	$scope.deactivate=function()
	{
		button.removeEventListener("click",onButtonClick);
		if(videoIsOpen)
			removeListeners();
		titleCard.deactivate();
	}

	$scope.destroy=function()
	{
	}

	setCurrentScope($scope, $scope.id);
}
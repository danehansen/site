"use strict";

function AppCtrl($scope)
{
	$scope.name="app";
	$scope.NAV=NAV;
	rootScope=$scope;
	var topNavAngledMask=document.querySelector("#rightNav .angledMask");
	var mute;
	var oldHeight=Number.MAX_VALUE;
	var maskee;
	var scrollbar;
	var mask;
	var maskHeight;
	var maskeeHeight;
	var scrollDownY;

	function init()
	{
		var m=document.querySelector("#leftNav .sound");
		mute=new Sprite([m, m.querySelector(".white")],4,20);
		mask=document.querySelector("#leftNav .mask");
		maskee=mask.querySelector(".maskee");
		scrollbar=document.querySelector("#leftNav .scrollbar");
		onResize();
		window.addEventListener("resize", onResize);
	}
	setTimeout(init,1);

	function onResize()
	{
		var newHeight=window.innerHeight;
		if(newHeight!=oldHeight)
		{
			maskHeight=mask.offsetHeight;
			maskeeHeight=maskee.offsetHeight;
			if(maskeeHeight>maskHeight)
			{
				scrollbar.style.height=maskHeight/maskeeHeight*maskHeight+"px";
				scrollbar.addEventListener("mousedown", onScrollDown);
				mask.addEventListener("scroll", onScroll);
			}
			else
			{
				mask.removeEventListener("scroll", onScroll);
				scrollbar.removeEventListener("mousedown", onScrollDown);
				scrollbar.style.height=0;
			}
		}
		oldHeight=newHeight;
		onScroll();
	}

	function onScroll()
	{
		scrollbar.style.top=91+mask.scrollTop*(maskHeight/maskeeHeight)+"px";
	}

	function onScrollDown(evt)
	{
		scrollbar.removeEventListener("mousedown", onScrollDown);
		scrollDownY=evt.clientY;
		document.addEventListener("mousemove", onScrollMove);
		document.addEventListener("mouseup", onScrollUp);
	}

	function onScrollMove(evt)
	{
		var difference=(evt.clientY-scrollDownY);
		mask.scrollTop+=difference;
		scrollDownY=evt.clientY;
	}

	function onScrollUp()
	{
		document.removeEventListener("mouseup", onScrollUp);
		document.removeEventListener("mousemove", onScrollMove);
		scrollbar.addEventListener("mousedown", onScrollDown);
	}

	$scope.onLiOver=function(evt)
	{
		MySounds.play(FX.over);
		if(!MyUtils.hasClass(evt.currentTarget,"selected"))
			evt.currentTarget.querySelector("video").play();
	}

	$scope.onLiOut=function(evt)
	{
		evt.currentTarget.querySelector("video").pause();
	}

	$scope.onMuteClick=function(evt)
	{
		MySounds.play(FX.click);
		if(MySounds.volume()==0)
		{
			mute.rewind();
			MySounds.unMute();
		}
		else
		{
			mute.play();
			MySounds.mute();
		}
	}

	$scope.onUpClick=function()
	{
		if(currentTier2>=0)
			window.location="#!/"+noSpace(NAV[currentTier1].title)+(currentTier2==0?"":"/"+noSpace(NAV[currentTier1].subsections[currentTier2-1].title));
	}

	$scope.onDownClick=function()
	{
		if(currentTier2<NAV[currentTier1].subsections.length-1)
			window.location="#!/"+noSpace(NAV[currentTier1].title)+"/"+noSpace(NAV[currentTier1].subsections[currentTier2+1].title);
	}

	$scope.onLeftClick=function()
	{
		if(currentTier1>0)
			window.location="#!/"+(currentTier1==1?"":noSpace(NAV[currentTier1-1].title));
	}

	$scope.onRightClick=function()
	{
		if(currentTier1<NAV.length-1)
			window.location="#!/"+noSpace(NAV[currentTier1+1].title);
	}

	$scope.onBottomSquaresClick=function(evt)
	{
		var title=noSpace(NAV[MyUtils.indexOf(bottomSquares,evt.currentTarget)].title);
		window.location="#!/"+(title=="home"?"":title);
	}

	$scope.onShareOver=function()
	{
		TweenLite.to(topNavAngledMask, 0.5, {height:225, ease:Cubic.easeInOut});
		$scope.onTitleButtonOver();
	}

	$scope.onStraightOut=function()
	{
		TweenLite.to(topNavAngledMask, 0.5, {height:0, ease:Cubic.easeInOut});
		$scope.onTitleButtonOut();
	}

	$scope.onTitleButtonOver=function(evt)
	{
		MySounds.play(FX.diamondOver);
	}

	$scope.onTitleButtonOut=function(evt)
	{
		MySounds.play(FX.diamondOut);
	}

	$scope.onArrowOver=function(evt)
	{
		MySounds.play(FX.arrowOver);
	}

	$scope.onArrowOut=function(evt)
	{
		MySounds.play(FX.arrowOut);
	}

	$scope.onClick=function(evt)
	{
		MySounds.play(FX.click);
	}

	$scope.onOver=function(evt)
	{
		MySounds.play(FX.over);
	}

	$scope.removeSpaces=function(str)
	{
		return str.split("<br/>").join(" ").split(" ").join("&nbsp;");
	}
}
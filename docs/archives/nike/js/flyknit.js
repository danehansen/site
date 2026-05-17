"use strict";

//vars
	var sec4Inited=false;
	var sec6Timeline;
	var vidLines;
	var ratio=1280/720;
	var lastDiamondShown=false;
	
function pageInit()
{
	if(touch)
		$("#flyknit #sec2 > div").css("display","none");
}

function pageResize()
{
	if(!touch && (!ie || (ie && version>8)))
	{
		var h=$("#showMoreShoe").height();
		var winRatio=winWidth/h;
		if(winRatio>=ratio)
		{
			$("video").css(
				{
					width:winWidth,
					height:winWidth/ratio,
					left:0,
					top:(h-winWidth/ratio)/2
				});
		}
		else
		{
			$("video").css(
				{
					width:h*ratio,
					height:h,
					left:(winWidth-h*ratio)/2,
					top:0
				});
		}
	}
}

function scrollSec1(sec,perc)
{
	if(ends)
		sec.css("background-position","center "+perc*sec.outerHeight()+"px");
}

function scrollSec2(sec,perc)
{
	TweenLite.set($("#sec2 img:first-child"), {bottom:(perc*winHeight*-0.2)});
	TweenLite.set($("#sec2 img + img"), {bottom:(perc*winHeight*-0.4+200)});
}

function scrollSec4(sec,perc)
{
	if(!sec4Inited && perc > 0.5)
	{
		sec4Inited=true;
		var divs=$("#sec4 li div");
		for(var i=0; i<divs.length; i++)
		{
			TweenLite.to(divs[i], 0.5, {width:0, ease:Cubic.easeInOut, delay:i*0.1});
		}
	}
}

function scrollSec13(sec,perc)
{
	if(perc>0.5 && !lastDiamondShown)
	{
		$("#sec13 .diamond").css("display","block");
		animateDiamond($("#sec13 .diamond"),0.5);
		lastDiamondShown=true;	
	}
	if(ends)
		sec.css("background-position","center "+((1-perc)*-(sec.outerHeight()))+"px");
}
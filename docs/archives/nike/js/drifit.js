"use strict";

//vars
var ratio=1280/720;
var lastDiamondShown=false;

function pageInit()
{
	if(touch)
		$("video").css("display","none");
}

function pageResize()
{
	if(!touch && (!ie || (ie && version>8)))
	{
		var h=$("#sec2").outerHeight();
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
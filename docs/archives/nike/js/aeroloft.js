"use strict";

//vars
	var vidLines;
	var ratio=1280/720;
	var lastDiamondShown=false;

function pageInit()
{
}

function pageResize()
{
}

function scrollSec1(sec,perc)
{
	if(ends)
		sec.css("background-position","center "+perc*sec.outerHeight()+"px");
}

function scrollSec14(sec,perc)
{
	if(perc>0.5 && !lastDiamondShown)
	{
		$("#sec14 .diamond").css("display","block");
		animateDiamond($("#sec14 .diamond"),0.5);
		lastDiamondShown=true;	
	}
	if(ends)
		sec.css("background-position","center "+((1-perc)*-(sec.outerHeight()))+"px");
}
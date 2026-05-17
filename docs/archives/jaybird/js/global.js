"use strict";

//vars
	var STS=
	{
		ROOT:"",
		width:null,
		height:null,
		NAV_CLOSED_HEIGHT:46,
		NAV_OPEN_HEIGHT:84,
		docHeight:null,
		FOOTER_HEIGHT:42,
		onResize:null
	};

//functions

	STS.retina=function()
	{
		if(!STS._retina)
			STS._retina=window.devicePixelRatio>1;
		return STS._retina;
	}

	STS.transform=function()
	{
		if(!STS._transform)
		{
			var body=document.querySelector("body");
			if(body.style.webkitTransform=="")
				STS._transform="webkitTransform";
			else if(body.style.msTransform=="")
				STS._transform="msTransform";
			else
				STS._transform="transform";
		}
		return STS._transform;
	}
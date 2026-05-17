"use strict";

(function()
{
	var fpsLastTime=0;
	var fpsTimes=[];
	var element=document.createElement("div");
	var style=element.style;
	style.position="fixed";
	style.top=0;
	style.left=0;
	style.backgroundColor="#000";
	style.color="#0F0";
	style.fontFamily="courier";
	style.fontSize="10px";
	style.zIndex=999999;
	document.body.appendChild(element);

	function onTick()
	{
		var currentTime=TweenLite.ticker.time;
		var diff=currentTime-fpsLastTime;
		if(diff>0)
		{
			var num=1/diff;
			fpsTimes.push(num);
			while(fpsTimes.length>50)
			{
				fpsTimes.shift();
			}
			element.innerHTML=Math.round(MyMath.average(fpsTimes))+"fps";
			fpsLastTime=currentTime;
		}
	}

	TweenLite.ticker.addEventListener("tick",onTick);
})();
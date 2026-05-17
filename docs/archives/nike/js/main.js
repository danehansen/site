"use strict";

//vars
	var lis;
	var win;
	var headerHeight;
	var winHeight;
	var winWidth;
	var touch;
	var Event;
	var ie;
	var version;
	var ends

//functions

	function init()
	{
		ends=BrowserDetect.browser=="Firefox" || BrowserDetect.browser=="Chrome";
		if(ends)
			$(".end").css("background-attachment","scroll");
		ie=BrowserDetect.browser=="Explorer";
		version=BrowserDetect.version;
		touch=('ontouchstart' in window);
		win=$(window);
		lis=$("body > header li");
		headerHeight=parseFloat($("body").css("padding-top"));
		
		if(touch)
		{
			$(".end, .headline").css("background-attachment","scroll");
			$("body > header > div a").click(onHeaderOpen);
			$("body > section").click(onHeaderClose);
			Event=
			{
				MOUSE_DOWN:"touchstart",
				MOUSE_MOVE:"touchmove",
				MOUSE_UP:"touchend"
			};
		}
		else
		{
			Event=
			{
				MOUSE_DOWN:"mousedown",
				MOUSE_MOVE:"mousemove",
				MOUSE_UP:"mouseup"
			};
			$("body > header > div a").mouseover(onHeaderOpen);
			$("body > section").mousemove(onHeaderClose);
		}
		$("body > header li + li").mouseover(onHeaderOver);
		$("body > header li + li").mouseout(onHeaderOut);
		win.scroll(onScroll);
		win.resize(onResize);
		$("body > footer a").click(onFooterClick);

		pageInit();
		onResize();

		animateDiamond($("#sec1 .diamond"),1);
		$("section + section .diamond").hover(onDiamondOver, onDiamondOut);
	}

	function onHeaderOpen(evt)
	{
		var targ=$("body > header > div a");
		$("body > header").addClass("open");

		if(touch)
			$("body > section").click(onHeaderClose);
	}

	function onHeaderClose(evt)
	{
		if(touch)
			$("body > section").off("click");
		$("body > header").removeClass("open");
		lis.removeClass("open");
	}

	function onHeaderOver(evt)
	{
		var below=true;
		lis.removeClass("open");
		for(var i=0; i<lis.length; i++)
		{
			TweenLite.to(lis[i], 0.5, {width:lis[i]==evt.currentTarget?"28%":"18%", ease:Cubic.easeInOut, left:i*18+(below?0:10)+"%"});
			if(lis[i]==evt.currentTarget)
			{
				below=false;
				$(lis[i]).addClass("open");
			}
		}
	}

	function onHeaderOut(evt)
	{
		for(var i=0; i<lis.length; i++)
		{
			TweenLite.to(lis[i], 0.5, {width:"20%", ease:Cubic.easeInOut, left:i*20+"%"});
		}
	}

	function onFooterClick(evt)
	{
		evt.preventDefault();
		var footers=$("body > footer a");
		var num=$.inArray(evt.currentTarget, footers);
		var y=$(".bottomNav"+num).offset().top;
		TweenLite.to(window, 1, {scrollTo:{y:y}, ease:Cubic.easeOut});
	}

	function onResize()
	{
		winWidth=win.width();
		winHeight=win.height();
		var winRatio=winWidth/winHeight;
		
		//headlines
			/*var headlines=$(".headline");
			for(var i=0; i<headlines.length; i++)
			{
				var headline=$(headlines[i]);
				var ratio=1464/headline.height();
				if(ratio<=winRatio)
					headline.css("background-size",winWidth+"px auto");
				else
					headline.css("background-size","auto "+Math.max(headline.outerHeight(),winHeight)+"px");
			}
*/
		pageResize();
		onScroll();
	}

	function onScroll()
	{
		var top=win.scrollTop();
		for(var i=1; i<=14; i++)
		{
			var func=window["scrollSec"+i];
			if(func)
			{
				var sec=$("#sec"+i);
				var h=sec.outerHeight();
				var secTop=sec.offset().top;
				var beginY=Math.max(secTop,winHeight)-winHeight;
				var endY=Math.min($(document).outerHeight()-winHeight,h+secTop-headerHeight);
				var perc=MyMath.relativePercentage(beginY,endY,top);
				if(perc>=0 && perc<=1)
					func(sec,perc);
			}
		}
	}

	function animateDiamond(element, pause)
	{
		if(!ie || (ie && version>8))
		{
			var timeline=new TimelineLite();
			timeline.insert(TweenLite.from($(" .back" , element), 0.7, {width:0, height:0, left:0, top:0, ease:Back.easeOut}),pause);
			timeline.insert(TweenLite.from($(" .ghost" , element), 0.5, {autoAlpha:0, top:-40, left:-40, ease:Cubic.easeInOut}),pause+0.5);
			timeline.insert(TweenLite.from($(" p" , element), 0.5, {autoAlpha:0, top:"+=20", ease:Cubic.easeInOut}),pause+0.75);
			timeline.insert(TweenLite.from($(" .arrow" , element), 0.5, {autoAlpha:0, ease:Linear.easeNone}),pause+1);
		}
	}

	function onDiamondOver(evt)
	{
		var targ=$(".back", evt.currentTarget);
		TweenLite.to(targ, 0.2, {width:90, height:90, left:-45, top:-45, ease:Cubic.easeOut});
	}

	function onDiamondOut(evt)
	{
		var targ=$(".back", evt.currentTarget);
		TweenLite.to(targ, 0.2, {width:80, height:80, left:-40, top:-40, ease:Cubic.easeOut});
	}

//init

	$(document).ready(init);

var BrowserDetect = {
	init: function () {
		this.browser = this.searchString(this.dataBrowser) || "An unknown browser";
		this.version = this.searchVersion(navigator.userAgent)
			|| this.searchVersion(navigator.appVersion)
			|| "an unknown version";
		this.OS = this.searchString(this.dataOS) || "an unknown OS";
	},
	searchString: function (data) {
		for (var i=0;i<data.length;i++)	{
			var dataString = data[i].string;
			var dataProp = data[i].prop;
			this.versionSearchString = data[i].versionSearch || data[i].identity;
			if (dataString) {
				if (dataString.indexOf(data[i].subString) != -1)
					return data[i].identity;
			}
			else if (dataProp)
				return data[i].identity;
		}
	},
	searchVersion: function (dataString) {
		var index = dataString.indexOf(this.versionSearchString);
		if (index == -1) return;
		return parseFloat(dataString.substring(index+this.versionSearchString.length+1));
	},
	dataBrowser: [
		{
			string: navigator.userAgent,
			subString: "Chrome",
			identity: "Chrome"
		},
		{ 	
			string: navigator.userAgent,
			subString: "OmniWeb",
			versionSearch: "OmniWeb/",
			identity: "OmniWeb"
		},
		{
			string: navigator.vendor,
			subString: "Apple",
			identity: "Safari",
			versionSearch: "Version"
		},
		{
			prop: window.opera,
			identity: "Opera",
			versionSearch: "Version"
		},
		{
			string: navigator.vendor,
			subString: "iCab",
			identity: "iCab"
		},
		{
			string: navigator.vendor,
			subString: "KDE",
			identity: "Konqueror"
		},
		{
			string: navigator.userAgent,
			subString: "Firefox",
			identity: "Firefox"
		},
		{
			string: navigator.vendor,
			subString: "Camino",
			identity: "Camino"
		},
		{		// for newer Netscapes (6+)
			string: navigator.userAgent,
			subString: "Netscape",
			identity: "Netscape"
		},
		{
			string: navigator.userAgent,
			subString: "MSIE",
			identity: "Explorer",
			versionSearch: "MSIE"
		},
		{
			string: navigator.userAgent,
			subString: "Gecko",
			identity: "Mozilla",
			versionSearch: "rv"
		},
		{ 		// for older Netscapes (4-)
			string: navigator.userAgent,
			subString: "Mozilla",
			identity: "Netscape",
			versionSearch: "Mozilla"
		}
	],
	dataOS : [
		{
			string: navigator.platform,
			subString: "Win",
			identity: "Windows"
		},
		{
			string: navigator.platform,
			subString: "Mac",
			identity: "Mac"
		},
		{
			string: navigator.userAgent,
			subString: "iPhone",
			identity: "iPhone/iPod"
		},
		{
			string: navigator.platform,
			subString: "Linux",
			identity: "Linux"
		}
	]

};
BrowserDetect.init();
"use strict";

//vars
	var sec4Inited=false;
	var slideMeX=0;
	var slideMeDownX;
	var slideMeWidth;
	var sec6Timeline;
	var vidLines;
	var ratio=1280/720;
	var follower;
	var lastDiamondShown=false;

function pageInit()
{
	//secVid
		vidLines=$("#secVid div h1").html().split("<br/>").join("<br>").split("<br>");
		$("#secVid").click(onVidSpanClick);
		if(touch)
			$("video").css("display","none");
		follower=$("#secVid > p");
	//sec6
		slideMeWidth=parseFloat($("#sec6 nav").width()-$("#sec6 a").width());

		sec6Timeline=new TimelineLite({paused:true});
		sec6Timeline.insert(TweenLite.to($("#sec6 #insole"), 1, {left:374, ease:Linear.easeNone}),0);
		sec6Timeline.insert(TweenLite.to($("#sec6 #clear"), 1, {left:374, ease:Linear.easeNone}),0);
		sec6Timeline.insert(TweenLite.to($("#sec6 #upper"), 1, {left:374, ease:Linear.easeNone}),0);
		sec6Timeline.insert(TweenLite.to($("#sec6 #sole"), 1, {left:374, ease:Linear.easeNone}),0);
		$("#sec6 a").click(onSlideMeClick);

	onSlideMeUp();
}

function pageResize()
{
	//secVid
		if(!touch && (!ie || (ie && version>8)))
		{
			follower.css("display","block");
			$("#secVid").mousemove(onMouseMove);

			var h=$("#secVid").outerHeight();
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

			var html="";
			var div=$("#secVid > div");
			var rows=$("#secVid").height()/70;
			var columns=Math.ceil(winWidth/70);
			var leftEmpties=Math.floor((columns-10)/2);
			var leftOffset=(columns*70-winWidth)/2;
			div.empty();
			for(var i=0; i<rows; i++)
			{
				for(var j=0; j<columns; j++)
				{
					var span=$("<span></span>");
					span.css({top:i*70, left:j*70-leftOffset});
					if(vidLines[i-2])
					{
						if(vidLines[i-2][j-leftEmpties])
							span.html(vidLines[i-2][j-leftEmpties]);
					}
					div.append(span);
				}
			}
			$(" span",  div).hover(onVidSpanOver, onVidSpanOut);
		}
		else
		{
			$("#secVid .diamond").click(onVidClick);
		}
		if(touch)
		{
			$("#secVid > div").css("display","none");
			$("#secVid .diamond").css({opacity:1,display:"block"});
		}
}

function scrollSec1(sec,perc)
{
	if(ends)
		sec.css("background-position","center "+perc*sec.outerHeight()+"px");
}

function scrollSec2(sec,perc)
{
	TweenLite.set($("#sec2 img:first-child"), {top:(perc*winHeight*0.2)-100});
	TweenLite.set($("#sec2 img+img"), {bottom:(perc*winHeight*-0.4+200)});
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

function onMouseMove(evt)
{
	follower.css({top:$(window).scrollTop()+evt.clientY-$("#secVid").offset().top+20, left:evt.clientX-follower.width()/2-6});
}

	function onVidSpanOver(evt)
	{
		TweenLite.to(evt.currentTarget, 0.1, {backgroundColor:"rgba(233,233,233,0)", ease:Linear.easeNone});
	}

	function onVidSpanOut(evt)
	{
		TweenLite.to(evt.currentTarget, 5, {backgroundColor:"rgba(233,233,233,1)", ease:Linear.easeNone});
	}

	function onVidSpanClick(evt)
	{
		var spans=$(" span", $("#secVid"));
		for(var i=0; i<spans.length; i++)
		{
			var span=$(spans[i]);
			span.off("mouseenter");
			span.off("mouseleave");
			TweenLite.to(span, 0.3, {autoAlpha:0, ease:Linear.easeNone, delay:MyMath.random(1.5)});
		}
		var button=$(" .diamond", $("#secVid"))
		button.css("display", "block");
		animateDiamond(button,1);
		TweenLite.to(follower, 1, {autoAlpha:0, ease:Linear.easeNone});
		button.click(onVidClick);
		$(" > div", $("#secVid")).css('cursor',"auto");
		$("#secVid").off("mousemove");
	}

	function onVidClick(evt)
	{
		evt.preventDefault();
		var modalContent = '<iframe class="youtube-player" type="text/html" width="560" height="315" src="http://www.youtube.com/embed/' + "HU_tqJAto5o" + '" frameborder="0" allowfullscreen></iframe>';
		$.modal(modalContent, {
			closeHTML:'<a href="#">X</a>',
			containerCss:{ 
				height:330, 
				paddingLeft:20,
				paddingTop:35,
				width:580
			},
			onOpen: function (dialog) {
				dialog.data.hide();
				dialog.overlay.fadeIn('fast', function () {
					dialog.container.fadeIn('fast')
					dialog.data.fadeIn('fast');
				});
			},
			//animate closing
			onClose: function (dialog) {
				dialog.container.fadeOut('fast', function(){
					dialog.overlay.fadeOut('fast', function(){
						$.modal.close();    
					});
				});
			},
			overlayClose:true
		});
	}

	function onSlideMeClick(evt)
	{
		evt.preventDefault();
	}

	function onSlideMeUp(evt)
	{
		$(document).off(Event.MOUSE_UP, onSlideMeUp);
		$(document).off(Event.MOUSE_MOVE, onSlideMeMove);
		
		if(evt)
			evt.preventDefault();
		
		$("#sec6 a").on(Event.MOUSE_DOWN, onSlideMeDown);
	}

	function onSlideMeDown(evt)
	{
		$("#sec6 a").off(Event.MOUSE_DOWN, onSlideMeDown);
		evt.preventDefault();
		
		slideMeDownX=touch?evt.originalEvent.touches[0].pageX:evt.clientX;

		$(document).on(Event.MOUSE_UP, onSlideMeUp);
		$(document).on(Event.MOUSE_MOVE, onSlideMeMove);
	}

	function onSlideMeMove(evt)
	{
		var x=touch?evt.originalEvent.touches[0].pageX:evt.clientX;
		slideMeX=Math.min(Math.max(0,slideMeX+(x-slideMeDownX)),slideMeWidth);
		var perc=slideMeX/slideMeWidth;
		sec6Timeline.progress(perc);
		$("#sec6 a").css("left", slideMeX);
		slideMeDownX=x;
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
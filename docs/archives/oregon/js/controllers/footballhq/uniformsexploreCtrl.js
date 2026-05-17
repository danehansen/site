"use strict";
	
function uniformsexploreCtrl($scope)
{
	$scope.id="uniformsexplore";
	$scope.uniforms=
	[
		{
			title:"2013 uniform system",
			img:"img/uniforms/1.png",
			progress:0,
			hotspots:
			[
				{x:43,	y:399,	img:"img/uniforms/1.3.jpg", title:"gloves"},
				{x:283,	y:249,	img:"img/uniforms/1.2.jpg", title:"base layer"},
				{x:52,	y:153,	img:"img/uniforms/1.1.jpg", title:"wing design"}
			]
		},
		{
			title:"2013 spring game home",
			img:"img/uniforms/5.png",
			progress:0.135,
			hotspots:
			[
				{x:126,	y:489,	img:"img/uniforms/5.5.jpg", title:"deflex padding"},
				{x:128,	y:183,	img:"img/uniforms/5.1.jpg", title:"patch detail"},
				{x:258,	y:169,	img:"img/uniforms/5.4.jpg", title:"badge details"},
				{x:45,	y:149,	img:"img/uniforms/5.2.jpg", title:"flag detail"},
				{x:133,	y:19,	img:"img/uniforms/5.3.jpg", title:"helmet"}
			]
		},
		{
			title:"2013 spring game away",
			img:"img/uniforms/6.png",
			progress:0.277,
			hotspots:
			[
				{x:284,	y:373,	img:"img/uniforms/6.1.jpg", title:"glove detail"},
				{x:149,	y:279,	img:"img/uniforms/6.3.jpg", title:"number system"},
				{x:183,	y:167,	img:"img/uniforms/6.2.jpg", title:"support badge"},
				{x:133,	y:25,	img:"img/uniforms/6.4.jpg", title:"helmet"}
			]
		},
		{
			title:"2012 integrated uniform system",
			img:"img/uniforms/2.png",
			progress:0.42,
			hotspots:
			[
				{x:178,	y:384,	img:"img/uniforms/2.1.jpg", title:"buckle"},
				{x:132,	y:224,	img:"img/uniforms/2.2.jpg", title:"number system"},
				{x:271,	y:149,	img:"img/uniforms/2.3.jpg", title:"seam detail"}
			]
		},
		{
			title:"2012 season opener",
			img:"img/uniforms/4.png",
			progress:0.564,
			hotspots:
			[
				{x:223,	y:752,	img:"img/uniforms/4.4.jpg", title:"cleat detail"},
				{x:263,	y:266,	img:"img/uniforms/4.3.jpg", title:"chain maille mesh"},
				{x:176,	y:184,	img:"img/uniforms/4.1.jpg", title:"flywire collar"},
				{x:124,	y:42,	img:"img/uniforms/4.2.jpg", title:"helmet"}
			]
		},
		{
			title:"2011 fighting ducks",
			img:"img/uniforms/7.png",
			progress:0.707,
			hotspots:
			[
				{x:293,	y:327,	img:"img/uniforms/7.2.jpg", title:"action shot"},
				{x:175,	y:127,	img:"img/uniforms/7.1.jpg", title:"base layer"}
			]
		},
		{
			title:"2011 pro combat",
			img:"img/uniforms/8.png",
			progress:0.847,
			hotspots:
			[
				{x:122,	y:757,	img:"img/uniforms/8.1.jpg", title:"cleat bottom"},
				{x:77,	y:429,	img:"img/uniforms/8.2.jpg", title:"glove detail"},
				{x:309,	y:249,	img:"img/uniforms/8.3.jpg", title:"pro combat layer"},
				{x:233,	y:27,	img:"img/uniforms/8.4.jpg", title:"matte helmet"}
			]
		},
		{
			title:"2010 national championship",
			img:"img/uniforms/9.png",
			progress:0.99,
			hotspots:
			[
				{x:217,	y:749,	img:"img/uniforms/9.2.jpg", title:"cleat detail"},
				{x:143,	y:23,	img:"img/uniforms/9.1.jpg", title:"carbon fiber helmet"}
			]
		}
	];
	for(var i=0, iLen=$scope.uniforms.length; i<iLen; i++)
	{
		for(var j=0, jLen=$scope.uniforms[i].hotspots.length; j<jLen; j++)
		{
			$scope.uniforms[i].hotspots[j].x/=3.6;
			$scope.uniforms[i].hotspots[j].y/=8.2;
		}
	}

	$scope.uniformWidth=770;
	$scope.margin=205;
	var section;
	var uniformChild;
	var uniformContainer;
	var uniformTimeline = new TimelineLite({ paused: true });
	var lastPoint=0;
	var scrollAmount=0;
	var SPEED=600; // lower is faster
	var left;
	var leftTarget;
	var leftWing;
	var rightWing;
	var endMargin=0;
	var winWidth;
	var lis=[];
	var mesh;
	var hijackedScroll;
	var UNIFORM_WIDTH = 360;
	var MAX_HEIGHT = 820;
	var MIN_HEIGHT = 500;
	var scrubTimeline;
	var timelineIndicator = document.querySelector('.indicator');

	$scope.init=function()
	{
		section=document.getElementById($scope.id);
		uniformContainer=section.querySelector('#uniformHolder');
		uniformChild=section.querySelector("#uniformHolder > div");
		leftWing=uniformChild.querySelector(".wing.left");
		rightWing=uniformChild.querySelector(".wing.right");
		hijackedScroll=new ScrollHijack(hjScrolled, leaveDefaults(), section);
		scrubTimeline=new Timeline(document.querySelector(".timeline"));
		TweenLite.to(scrubTimeline.element, 0.5, {bottom:0, ease:Cubic.easeOut});
		scrubTimeline.element.addEventListener(Timeline.CHANGE, onTimelineChangeHandler);
		onResize();
	}

	$scope.activate=function()
	{
		showTopNav(true);
		topNavX().addEventListener("click",onXClick);
		lis=section.querySelectorAll("#uniformHolder > div > ul > li");
		var winHeight=window.innerHeight/2;
		for(var i=0, iLen=lis.length; i<iLen; i++)
		{
			var li=lis[i];
			li.hotspots=[];
			var diamonds=li.querySelectorAll(".unfoldingHotspot");
			for(var j=0, jLen=diamonds.length; j<jLen; j++)
			{
				var unfolder=new UnfoldingHotspot(diamonds[j]);
				li.hotspots.push(unfolder);
				var perc=parseFloat(unfolder.element.style.top);
				unfolder.upsideDown(perc>50);
			}
		}
		window.addEventListener("resize",onResize);
		var meshHolder=section.querySelector("#meshHolder");
		mesh=new MeshBackground(meshHolder);
		onResize();
		TweenLite.to(meshHolder, 0.5, {autoAlpha:1, ease:Linear.easeNone});
		MySounds.playLoop(LOOPS.footballhq);
		helpScroll();	
	}
	
	function hjScrolled(point)
	{
		if(uniformTimeline.progress())
			scrollAmount = uniformTimeline.progress();
		var sum=point.x||0+point.y||0;
		var difference=sum-lastPoint;
		lastPoint=sum;
		scrollAmount = Math.max(Math.min(1,scrollAmount+difference/SPEED),0);
		uniformTimeline.progress(scrollAmount);
		scrubTimeline.progress(scrollAmount);
		helpScroll();
	}
	
	function helpScroll()
	{
		left=Math.abs(parseFloat(uniformChild.style.left));
		if(isNaN(left))
			left=0;
		var leftMin=left-$scope.margin-endMargin+endMargin;
		var leftMax=left+winWidth-$scope.uniformWidth+$scope.margin-endMargin-endMargin;		
		for(var i=0, iLen=lis.length; i<iLen; i++)
		{
			var liX=i*$scope.uniformWidth;
			if(liX>leftMin && liX<leftMax)
			{
				if(!lis[i].fadedIn)
				{
					lis[i].fadedIn=true;
					TweenLite.to(lis[i], 0.5, {autoAlpha:1, ease:Linear.easeNone});
					var hotspots=lis[i].querySelectorAll(".unfoldingHotspot");
					for(var j=0, jLen=hotspots.length; j<jLen; j++)
						TweenLite.to(hotspots[j], 0.3, {autoAlpha:1, ease:Linear.easeNone, delay:j*0.2});
					if(i==0)
						TweenLite.to([leftWing,rightWing], 0.5, {ease:Cubic.easeInOut, rotation:0});
				}
			}
			else
			{
				if(lis[i].fadedIn)
				{
					lis[i].fadedIn=false;
					TweenLite.to(lis[i], 0.5, {autoAlpha:0.2, ease:Linear.easeNone});
					TweenLite.to(lis[i].querySelectorAll(".unfoldingHotspot"), 0.5, {autoAlpha:0, ease:Linear.easeNone});
					for(j=0, jLen=lis[i].hotspots.length; j<jLen; j++)
					{
						var hotspot=lis[i].hotspots[j];
						if(hotspot.isOpen)
							hotspot.close();
					}
					if(i==0)
					{
						TweenLite.to(leftWing, 0.5, {ease:Cubic.easeInOut, rotation:-115});
						TweenLite.to(rightWing, 0.5, {ease:Cubic.easeInOut, rotation:115});
					}
				}
			}
		}
	}
	
	function onTimelineChangeHandler(evt)
	{
		uniformTimeline.progress(scrubTimeline._progress);
		helpScroll();
	}
	
	function onResize()
	{
		winWidth=window.innerWidth;
		endMargin=Math.max(0,(winWidth-$scope.uniformWidth)/2);
		uniformChild.style.paddingLeft=endMargin+"px";
		uniformChild.style.paddingRight=endMargin+"px";
		if(mesh)
			mesh.onResize();
		leftTarget = 0 - uniformChild.offsetWidth + uniformContainer.offsetWidth;
		var currentProgress = uniformTimeline.progress();
		uniformTimeline.clear();
		uniformTimeline.append(TweenLite.fromTo(uniformChild, 1, {left: 0 }, {left: leftTarget, ease: Linear.easeNone }));
		uniformTimeline.progress(currentProgress);
		var scale=section.querySelector(".scaler").offsetHeight/820;
		var scalers=section.querySelectorAll(".scaler");
		MyUtils.css(scalers,{width:scale*360+"px", marginLeft:-scale*180+"px"});
		if(scale==1)
		{
			var lis=uniformChild.querySelectorAll(".uniformAndHeadline");
			MyUtils.css(lis,{marginTop:(uniformChild.offsetHeight-900)/2+"px"});
		}
	}

	function onXClick(evt)
	{
		window.location="#!/footballhq/uniforms";
	}
	
	$scope.deactivate=function()
	{
		topNavX().removeEventListener("click",onXClick);
		mesh.deactivate();
		for(var i=0, iLen=lis.length; i<iLen; i++)
		{
			for(var j=0, jLen=lis[i].hotspots.length; j<jLen; j++)
			{
				lis[i].hotspots[j].deactivate();
			}
		}
		window.removeEventListener("resize",onResize);
		scrubTimeline.element.removeEventListener(Timeline.CHANGE, onTimelineChangeHandler);
		scrubTimeline.deactivate();
		hijackedScroll.stop();
	}

	$scope.destroy=function()
	{
	}

	setCurrentScope($scope, $scope.id);
}
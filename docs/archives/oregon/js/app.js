"use strict";

(function(){
	var isKeyboardListening=false;
	var TRANS=1;
	var TRANS_EASE=Cubic.easeInOut;
	var timerIsRunning=false;
	var _currentScope;
	var _lastScope;
	var _currentCSS;
	var _lastCSS;
	var leftNavOpen=false;
	var leftNavSlider;
	var linesNormal;
	var linesHover;
	var openClose;
	var lastTier1=Number.MAX_VALUE;
	var lastTier2=Number.MAX_VALUE;
	var upArrow;
	var downArrow;
	var leftArrow;
	var rightArrow;
	var leftNavButtons;
	var bottomSquareHolder;
	var bottomSquaresIsOpen=false;
	var numSideSquares=0;
	var sideSquares;
	var sideSquareHolder;
	var sideSquaresIsOpen=false;

	var module=angular.module('app', ['angulartics', 'angulartics.google.analytics', 'ngRetina']).config(['$routeProvider', '$locationProvider',appRouter]);

	module.animation('intro', function(){
				return {
					start : function(element, done, memo) {
						if(!timer)
							closeMenu();
						if(!_lastCSS)
						{
							document.querySelector("body > div > section").style.display="block";
							_currentScope.init();
							_currentScope.activate();
						}
					}
				}
			});
	module.animation('outro', function(){
				return {
					start : function(element, done, memo) {
						MySounds.play(FX.click);
						var dir=findDirection();
						var timeline=new TimelineLite({onComplete:done});
						var winHeight=window.innerHeight;
						var winWidth=window.innerWidth;
						var last=document.getElementById(_lastCSS);
						var current=document.getElementById(_currentCSS);
						if(dir=="up")
						{
							if(_lastScope)
							{
								_lastScope.deactivate();
								timeline.insert(TweenLite.to(last, TRANS, {top:-winHeight, ease:TRANS_EASE, onComplete:pageTransitioned}),0);
							}
							_currentScope.init();
							timeline.insert(TweenLite.from(current, TRANS, {top:winHeight, ease:TRANS_EASE, onComplete:_currentScope.activate}),0);
						}
						else if(dir=="down")
						{
							if(_lastScope)
							{
								_lastScope.deactivate();
								timeline.insert(TweenLite.to(last, TRANS, {top:winHeight, ease:TRANS_EASE, onComplete:pageTransitioned}),0);
							}
							_currentScope.init();
							timeline.insert(TweenLite.from(current, TRANS, {top:-winHeight, ease:TRANS_EASE, onComplete:_currentScope.activate}),0);
						}
						else if(dir=="left")
						{
							if(_lastScope)
							{
								_lastScope.deactivate();
								timeline.insert(TweenLite.to(last, TRANS, {left:-winWidth, ease:TRANS_EASE, onComplete:pageTransitioned}),0);
							}
							_currentScope.init();
							timeline.insert(TweenLite.from(current, TRANS, {left:winWidth, ease:TRANS_EASE, onComplete:_currentScope.activate}),0);
						}
						else if(dir=="right")
						{
							if(_lastScope)
							{
								_lastScope.deactivate();
								timeline.insert(TweenLite.to(last, TRANS, {left:winWidth, ease:TRANS_EASE, onComplete:pageTransitioned}),0);
							}
							_currentScope.init();
							timeline.insert(TweenLite.from(current, TRANS, {left:-winWidth, ease:TRANS_EASE, onComplete:_currentScope.activate}),0);
						}
						else
						{
							if(_lastScope)
							{
								_lastScope.deactivate();
								timeline.insert(TweenLite.to(last, TRANS, {alpha:0, ease:Cubic.easeIn, onComplete:pageTransitioned}),0);
							}
							_currentScope.init();
							timeline.insert(TweenLite.from(current, TRANS, {alpha:0, ease:Cubic.easeOut, onComplete:_currentScope.activate}),0);
						}
						current.style.display="block";
					}
				}
			});
	module.filter('nospace', function() {
		return noSpace;
	});
	module.filter('omitfirst', function() {
		return function(input) {
			return input.slice(1,input.length);
		};
	});
	module.filter('twodigits', function() {
		return function(num) {
			return ((num+1)/100).toFixed(2).split(".")[1];
		};
	});
	module.filter('rightside', function() {
		return function(num) {
			return num>(2/3)?" right_side":"";
		};
	});
	module.filter('times100', function() {
		return function(num) {
			return num*100;
		};
	});
	module.filter('numlines', function() {
		return function(str) {
			var lines=str.split("<br/>").length;
			if(lines==2)
				return " twoLines";
			else
				return "";
		};
	});
	module.filter('multiply', function() {
		return function(num1, num2) {
			return num1*num2;
		};
	});
	module.filter('multiplyPlus', function() {
		return function(num1, num2, num3) {
			return num1*num2+num3;
		};
	});
	module.filter('twodigitsminusone', function() {
		return function(num) {
			return ((num)/100).toFixed(2).split(".")[1];
		};
	});
	
	function appRouter($routeProvider,$locationProvider)
	{
		$locationProvider.hashPrefix('!');
		for(var i=0, iLen=NAV.length; i<iLen; i++)
		{
			var tier1=NAV[i];
			var tier1Title=noSpace(tier1.title);
			$routeProvider.when("/"+(i==0?"":tier1Title),{templateUrl:"partials/"+tier1Title+"/index.html",controller:tier1Title+"Ctrl"});
			for(var j=0, jLen=tier1.subsections.length; j<jLen; j++)
			{
				var tier2=tier1.subsections[j];
				var tier2Title=noSpace(tier2.title);
				$routeProvider.when("/"+tier1Title+"/"+tier2Title,{templateUrl:"partials/"+tier1Title+"/"+tier2Title+"/index.html",controller:(tier2Title=="end"?tier1Title:"")+tier2Title+"Ctrl"});

				for(var k=0, kLen=tier2.subsections.length; k<kLen; k++)
				{
					var tier3=tier2.subsections[k];
					$routeProvider.when("/"+tier1Title+"/"+tier2Title+"/"+tier3.url,{templateUrl:"partials/"+tier1Title+"/"+tier2Title+"/"+tier3.templateUrl,controller:tier3.controller});
				}
			}
		}
		$routeProvider.otherwise({redirectTo:"#!/"});
	}

	function init()
	{
		document.removeEventListener( "DOMContentLoaded", init);
		var fps=document.getElementById("fps");
		if(fps)
		{
			var fpsLastTime=0;
			var fpsTimes=[];
			TweenLite.ticker.addEventListener("tick",onTick);
		}
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
				fps.innerHTML=Math.round(MyMath.average(fpsTimes))+"fps";
				fpsLastTime=currentTime;
			}
		}
		MySounds.preload(FX);
		new SpriteForwardRewind(document.querySelector("#leftNav .oh"),5,22);

		openClose=document.querySelector("#leftNav .openClose");
		openClose.addEventListener("click",onOpenCloseClick);
		leftNavSlider=document.querySelector("#leftNav > .slider");
		linesNormal=new Sprite(openClose.querySelector(".normal"),4,20);
		linesHover=new Sprite(openClose.querySelector(".hover"),4,20);
		var blackCover=document.getElementById("blackCover");
		blackCover.addEventListener("click",closeMenu);
		

		var sharingButtons = document.querySelector("#rightNav .angledMask");
		sharingButtons.addEventListener("click", shareButtonClicked);
		function shareButtonClicked(evt)
		{
			var shareServiceClicked;
			var shareURL;

			if(evt.target.className && evt.target.className != 'envelope')
				shareServiceClicked = evt.target.className;
			else
				shareServiceClicked = evt.target.firstChild.className;

			if(evt.target.className == 'hover' || evt.target.className == 'env_img')
				shareServiceClicked = 'email';

			switch(shareServiceClicked)
			{
				case "icon-twitter" :
					MySounds.play(FX.click);
					window.open('https://twitter.com/intent/tweet?text=Welcome+to+the+Future+of+Football.+Check+out+www.oregongridiron.com+and+learn+how+Oregon+is+leading+the+way.','twitter-share-dialog','width=626,height=436');
					break;
				case "icon-facebook" :
					MySounds.play(FX.click);
					window.open('https://www.facebook.com/sharer/sharer.php?u=http://oregongridiron.com','facebook-share-dialog','width=626,height=436');
					break;
				case "icon-gplus" :
					MySounds.play(FX.click);
					window.open('https://plus.google.com/share?url=http://oregongridiron.com/','_blank', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600')
					break;
				case "email" :
					MySounds.play(FX.click);
					break;
				default : 
					break;
			}
		}
		
		upArrow=document.querySelector("body > .up");
		new SpriteForwardRewind(upArrow, 3,20, [upArrow.querySelector(".green"), upArrow.querySelector(".white")]);
		upArrow.alphaTracker=0;
		upArrow.addEventListener('click', upArrowClicked);
		function upArrowClicked()
		{
			if(upArrow.alphaTracker==1)
				rootScope.onUpClick();
		}
		downArrow=document.querySelector("body > .down");
		new SpriteForwardRewind(downArrow, 3,20, [downArrow.querySelector(".green"), downArrow.querySelector(".white")]);
		downArrow.alphaTracker=0;
		downArrow.addEventListener('click', downArrowClicked);
		function downArrowClicked()
		{
			if(downArrow.alphaTracker==1)
				rootScope.onDownClick();
		}
		leftArrow=document.querySelector("body > .left");
		new SpriteForwardRewind(leftArrow, 6,20, [leftArrow.querySelector(".green"), leftArrow.querySelector(".white")]);
		leftArrow.alphaTracker=0;
		leftArrow.addEventListener('click', leftArrowClicked);
		function leftArrowClicked()
		{
			if(leftArrow.alphaTracker==1)
				rootScope.onLeftClick();
		}
		rightArrow=document.querySelector("body > .right");
		new SpriteForwardRewind(rightArrow, 6,20,[rightArrow.querySelector(".green"), rightArrow.querySelector(".white")]);
		rightArrow.alphaTracker=0;
		rightArrow.addEventListener('click', rightArrowClicked);
		function rightArrowClicked()
		{
			if(rightArrow.alphaTracker==1)
				rootScope.onRightClick();
		}
				
		leftNavButtons=document.querySelectorAll("#leftNav .mask a");
		bottomSquareHolder=document.getElementById("bottomSquares");
		bottomSquares=bottomSquareHolder.querySelectorAll("a");
		sideSquareHolder=document.getElementById("sideSquares");
		addScrollListener();
	}
	
	function onSideSquaresClick(evt)
	{
		evt.preventDefault();
		var num=MyUtils.indexOf(sideSquareHolder.querySelectorAll("a"),evt.currentTarget);
		window.location="#!/"+noSpace(NAV[currentTier1].title)+"/"+noSpace(NAV[currentTier1].subsections[num].title);
	}

	function onInterval(evt)
	{
		timerIsRunning=true;
		var title=noSpace(NAV[(currentTier1+1)%NAV.length].title);
		window.location="#!/"+(title=="home"?"":title);
	}

	function onOpenCloseClick(evt)
	{
		if(evt)
		{
			MySounds.play(FX.click);
			evt.preventDefault();
		}
		TweenLite.to(blackCover, 0.5, {autoAlpha:leftNavOpen?0:1, ease:Linear.easeNone});
		TweenLite.to(leftNavSlider, 0.5, {left:leftNavOpen?-320:0, ease:leftNavOpen?Cubic.easeIn:Cubic.slideOut, onComplete:leftNavOpen?onOpenCloseDone:null});
		TweenLite.to(openClose, 0.3, {left:leftNavOpen?117:270, ease:Cubic.easeInOut, delay:leftNavOpen?0:0.2});
		if(leftNavOpen)
		{
			linesNormal.rewind();
			linesHover.rewind();
		}
		else
		{
			leftNavSlider.style.visibility="visible";
			linesNormal.play();
			linesHover.play();
		}
		leftNavOpen=!leftNavOpen;
		
		function onOpenCloseDone()
		{
			leftNavSlider.style.visibility="hidden";
		}
	}

	function closeMenu()
	{
		if(leftNavOpen)
			onOpenCloseClick();
	}

	function setCurrentScopeAnon(scope, css)
	{
		if(timer)
		{
			if(!timerIsRunning)
				stopTimer();
			timerIsRunning=false;
		}
		_lastScope=_currentScope;
		_lastCSS=_currentCSS;
		_currentScope=scope;
		_currentCSS=css;
		lastTier1=currentTier1;
		lastTier2=currentTier2;
		currentTier1=Number.MAX_VALUE;
		currentTier2=Number.MAX_VALUE;
		for(var i=0, iLen=NAV.length; i<iLen; i++)
		{
			var tier1Title=noSpace(NAV[i].title);
			if(_currentCSS==tier1Title)
			{
				currentTier1=i;
				currentTier2=-1;
				if(!_lastScope && currentTier1==0 && currentTier2==-1)
				{
					startTimer();
					timer.addEventListener(MyTimerEvent.TIMER, onInterval);
				}
				highlightNav(tier1Title);
				var bottomSquare=bottomSquares[i];
				MyUtils.removeClass(bottomSquares,"selected");
				MyUtils.addClass(bottomSquare,"selected");
			}
			else
			{
				for(var j=0, jLen=NAV[i].subsections.length; j<jLen; j++)
				{
					var tier2Title=noSpace(NAV[i].subsections[j].title)
					if(_currentCSS==tier2Title || _currentCSS==tier1Title+tier2Title)
					{
						currentTier1=i;
						currentTier2=j;
						highlightNav(tier2Title);
						var diff=NAV[currentTier1].subsections.length-numSideSquares;
						if(diff!=0)
						{
							if(diff>0)
							{
								for(var k=0; k<diff; k++)
								{
									var li=document.createElement("li");
									var a=document.createElement("a");
									var span=document.createElement("span")
									var title = NAV[currentTier1].subsections[k].title
									if(title == "end")
										title="see more"
									a.href="";
									span.innerHTML = title;
									li.appendChild(span);
									li.appendChild(a);
									a.addEventListener("mouseover", onSideSquaresOver);
									a.addEventListener("mouseout", onSideSquaresOut);
									a.addEventListener("click", onSideSquaresClick);
									sideSquareHolder.appendChild(li);
									TweenLite.to(a, 0.3, {top:0, left:0, width:8, height:8, autoAlpha:1, delay:k*0.1, ease:Linear.easeNone});
								}
							}
							else if(diff<0)
							{
								for(k=0; k<-diff; k++)
								{
									var deadBaby=sideSquareHolder.querySelectorAll("li")[numSideSquares-1-k];
									var a=deadBaby.querySelector("a");
									a.removeEventListener("mouseover", onSideSquaresOver);
									a.removeEventListener("mouseout", onSideSquaresOut);
									a.removeEventListener("click", onSideSquaresClick);
									TweenLite.to(a, 0.3, {top:4, left:4, width:0, height:0, autoAlpha:0, delay:k*0.1, onComplete:deadBaby.remove, onCompleteScope:deadBaby, ease:Linear.easeNone});
								}	
							}
							sideSquares=sideSquareHolder.querySelectorAll("a");
							numSideSquares=NAV[currentTier1].subsections.length;
							var endHeight=28*numSideSquares+18;
							TweenLite.to(sideSquareHolder, Math.abs(diff)*0.3, {height:endHeight, marginTop:-endHeight/2, ease:Cubic.easeInOut});
						}
						var sideSquare=sideSquares[j];
						if(!MyUtils.hasClass(sideSquare,"selected"))
						{
							MyUtils.removeClass(sideSquares,"selected");
							MyUtils.addClass(sideSquare,"selected");
						}
					}
				}
			}
		}
		if(currentTier1==Number.MAX_VALUE)
			deactivateKeyboardNav();
		else
			activateKeyboardNav();
		showSideSquares(currentTier2<Number.MAX_VALUE && currentTier2>=0);
		if(currentTier2==-1)
		{
			if(!bottomSquaresIsOpen)
			{
				TweenLite.to(bottomSquareHolder, 0.5, {bottom:"10%",display:"block",ease:Cubic.easeInOut});
				bottomSquaresIsOpen=true;
			}
		}
		else
		{
			if(bottomSquaresIsOpen)
			{
				TweenLite.to(bottomSquareHolder, 0.5, {bottom:-30,display:"none",ease:Cubic.easeInOut});
				bottomSquaresIsOpen=false;		
			}
		}
		checkMenuVisibility();
	}
	setCurrentScope=setCurrentScopeAnon;

	function highlightNav(str)
	{
		var targ=document.querySelector("#leftNav li ."+str);
		if(targ)
		{
			if(!MyUtils.hasClass(targ,"selected"))
			{
				MyUtils.removeClass(leftNavButtons,"selected");
				MyUtils.addClass(targ,"selected");
			}
		}
	}

	function checkMenuVisibility()
	{
		var upAlpha=0;
		var downAlpha=0;
		var leftAlpha=0;
		var rightAlpha=0;
		if(currentTier1<Number.MAX_VALUE)
		{
			if(currentTier2>=0)
			{
				upAlpha=1;
				changeArrowText(upArrow, currentTier2==0?NAV[currentTier1].title:NAV[currentTier1].subsections[currentTier2-1].title);
			}
			if(currentTier2<NAV[currentTier1].subsections.length-1)
			{
				downAlpha=1
				changeArrowText(downArrow, NAV[currentTier1].subsections[currentTier2+1].title);
			}
			if(currentTier2==-1)
			{
				if(currentTier1>0)
				{
					leftAlpha=1;
					changeArrowText(leftArrow, NAV[currentTier1-1].title);
				}
				if(currentTier1<NAV.length-1)
				{
					rightAlpha=1;
					changeArrowText(rightArrow, NAV[currentTier1+1].title);
				}
			}
		}
		if(currentTier1<Number.MAX_VALUE && currentTier2<Number.MAX_VALUE)
			showTopNav(false);
		if(upArrow.alphaTracker!=upAlpha)
		{
			upArrow.alphaTracker=upAlpha;
			TweenLite.to(upArrow, 0.5, {autoAlpha:upAlpha, ease:Linear.easeNone});
		}
		if(downArrow.alphaTracker!=downAlpha)
		{
			downArrow.alphaTracker=downAlpha;
			TweenLite.to(downArrow, 0.5, {autoAlpha:downAlpha, ease:Linear.easeNone});
		}
		if(leftArrow.alphaTracker!=leftAlpha)
		{
			leftArrow.alphaTracker=leftAlpha;
			TweenLite.to(leftArrow, 0.5, {autoAlpha:leftAlpha, ease:Linear.easeNone});
		}
		if(rightArrow.alphaTracker!=rightAlpha)
		{
			rightArrow.alphaTracker=rightAlpha;
			TweenLite.to(rightArrow, 0.5, {autoAlpha:rightAlpha, ease:Linear.easeNone});
		}
	}

	function showSideSquares(open)
	{
		if(open!=sideSquaresIsOpen)
		{
			TweenLite.to(sideSquareHolder, 0.5, {left:(open?20:-30),ease:Cubic.easeInOut});
			sideSquaresIsOpen=open;
		}
		if(open)
		{
			var sideNav = document.querySelectorAll("#sideSquares li");
			for(var i = 0, iLen = NAV[currentTier1].subsections.length; i < iLen; i++)
			{
				var title = NAV[currentTier1].subsections[i].title;
				if(title == "end")
					title="see more"

				sideNav[i].firstChild.innerHTML = title;
			}
		}
	}

	function findDirection()
	{
		if(lastTier1==currentTier1)
		{
			if(currentTier2==lastTier2+1)
				return "up";
			else if(currentTier2==lastTier2-1)
				return "down";
		}
		else if(currentTier1==lastTier1+1)
		{
			if(currentTier2==-1 && lastTier2==-1)
				return "left";
		}
		else if(currentTier1==lastTier1-1)
		{
			if(currentTier2==-1 && lastTier2==-1)
				return "right";
		}
		return "fade";
	}

	function changeArrowText(arrow, str)
	{
		if(str=="end")
			str="see more";
		var span=arrow.querySelector("p span");
		var timeline=new TimelineLite();
		timeline.append(TweenLite.to(span, TRANS/2, {alpha:0, onComplete:changeArowText2, onCompleteParams:[span, str.split(" ").join("&nbsp;")], onCompleteScope:this, ease:Linear.easeNone}));
		timeline.append(TweenLite.to(span, TRANS/2, {alpha:1, ease:Linear.easeNone}));
	}

	function changeArowText2(targ, str)
	{
		targ.innerHTML=str;
	}

	function onSideSquaresOver(evt)
	{
		MySounds.play(FX.over);
		if(evt.target.nodeName == 'SPAN')
			var slideMe = evt.target;
		else
			slideMe = evt.target.previousSibling;
		TweenLite.to(slideMe, 0.3, {autoAlpha: 1, left: 30});
	}

	function onSideSquaresOut(evt)
	{
		if(evt.target.nodeName == 'SPAN')
			var slideMe = evt.target;
		else
			slideMe = evt.target.previousSibling;
		TweenLite.to(slideMe, 0.3, {autoAlpha: 0, left: 10});
	}

	function pageTransitioned()
	{
		_lastScope.destroy;
		addScrollListener();
	}

	function addScrollListener()
	{
		var contentArea = document.getElementById('realContentContainer');
		contentArea.addEventListener('mousewheel', documentScroll, false);
	}

	function removeScrollListener()
	{
		var contentArea = document.getElementById('realContentContainer');
		contentArea.removeEventListener('mousewheel', documentScroll, false);
	}

	function documentScroll(evt)
	{
		if(!mapActivated)
		{
			var yDelta = evt.wheelDeltaY;
			var xDelta = evt.wheelDeltaX;
			if(Math.abs(evt.wheelDelta) > 15)
			{
				if(Math.abs(yDelta) > 15)
				{
					if(yDelta < 0)
					{
						if(downArrow.alphaTracker==1)
						{
							removeScrollListener();
							rootScope.onDownClick();
						}
					}
					else
					{
						if(upArrow.alphaTracker==1)
						{
							removeScrollListener();
							rootScope.onUpClick();
						}
					}
				}
				else if(Math.abs(xDelta) > 15) 
				{
					if(xDelta < 0)
					{
						if(rightArrow.alphaTracker==1)
						{
							removeScrollListener();
							rootScope.onRightClick();
						}
					}
					else
					{
						if(leftArrow.alphaTracker==1)
						{
							removeScrollListener();
							rootScope.onLeftClick();
						}
					}
				}
			}
		}
	}

	function activateKeyboardNav()
	{
		if(!isKeyboardListening)
		{
			isKeyboardListening=true;
			document.addEventListener(KEYBOARD_EVENT, keyPressed);
		}
	}

	function deactivateKeyboardNav()
	{
		if(isKeyboardListening)
		{
			isKeyboardListening=false;
			document.removeEventListener(KEYBOARD_EVENT, keyPressed);
		}
	}

	function keyPressed(evt)
	{
		switch(evt.keyCode)
		{
			case 37 :
				evt.preventDefault();
				if(leftArrow.alphaTracker==1)
					rootScope.onLeftClick();
				break;
			case 38 :
				evt.preventDefault();
				if(upArrow.alphaTracker==1)
					rootScope.onUpClick();
				break;
			case 39 :
				evt.preventDefault();
				if(rightArrow.alphaTracker==1)
					rootScope.onRightClick();
				break;
			case 40 :
				evt.preventDefault();
				if(downArrow.alphaTracker==1)
					rootScope.onDownClick();
				break;
			default :
				break;
		}
	}

	document.addEventListener( "DOMContentLoaded", init);
})();

window.addEventListener("load", onWindowLoad);
function onWindowLoad(evt)
{
	window.removeEventListener("load", onWindowLoad);
	onWindowLoad=null;
	var tier1s=document.querySelectorAll("#leftNav .maskee > li");
	for(var i=0, iLen=tier1s.length; i<iLen; i++)
	{
		tier1s[i].querySelector("video").src="vid/leftnav/"+noSpace(NAV[i+1].title)+vidExt();
		var tier2s=tier1s[i].querySelectorAll("ul li");
		for(var j=0, jLen=tier2s.length; j<jLen; j++)
		{
			tier2s[j].querySelector("video").src="vid/leftnav/"+noSpace(NAV[i+1].subsections[j].title)+vidExt();
		}
	}
}
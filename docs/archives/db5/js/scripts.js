var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-8415539-1']);
_gaq.push(['_trackPageview']);

(function() {
var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();

//vars
	var SCROLL_WIDTH=0;
	var MULTIPLIER=0.0005;
	var shj;
	var scrollProgress={x:0,y:0};
	var timeline;
	var scrollAmount=0;
	var navHeight;
	var currentNav=0;
	var navRed;
	var maxScroll;
	var touch;
	var navItems;
	var navLabels;

	var ROLL_OVER_TIME=0.3;
	var ROLL_OVER_EASE=Expo.easeOut;
	var thanksTimeline;
	var width;
	var height;
	var scrollbar;
	var thumb;
	var thumbHeight;

//functions

	function init()
	{
		touch='ontouchstart' in window;
		navHeight=$("body > nav").height();
		navRed=$("body > nav div div");
		navItems=$("body > nav a");
		scrollbar=$("#scrollbar");
		thumb=$("#thumb");
		shj=new ScrollHijack(onScroll, "a, #icons li, #pics li, #logos li, input");
		$.address.strict(false);
		//nav
			$("body > nav li:first-child").mouseover(onLogoOver);

		//thank you
			thanksTimeline=new TimelineLite({paused:false});
			var dist=79.1;
			var trans=2;
			var pause=2;
			var len=$("#thankYou li").length;
			for(var i=3; i<len-4; i++)
			{
				var time=(i-3)*pause;
				thanksTimeline.insert(TweenLite.fromTo($("#thankYou ul"), trans, {top:(i)*-dist},{top:(i+1)*-dist, ease:Linear.easeNone}), time);
				for(var j=Math.max(i-3,0); j<Math.min(i+4,len); j++)
				{
					var from=1-Math.abs(j-i)/3;
					var to=Math.max(0,1-Math.abs(j-(i+1))/3);
					thanksTimeline.insert(TweenLite.fromTo($("#thankYou li")[j], trans, {autoAlpha:from},{autoAlpha:to, ease:Linear.easeNone}), time);
				}
			}
			thanksTimeline.eventCallback("onComplete", thanksTimeline.play, [0]);
			resetThankYou();

		//contact
			if(!touch)
				$("#con div.left, #con div.right").hover(onContactOver, onContactOut);

		//sign up
			TweenLite.to($("form, #signUp div div p, #deadFish article div p"), 0, {autoAlpha:0});
			$("#signUp a").click(onSignUpClick);
			$("#signUp input[type=submit]").click(onSignUpSubmitClick);
			$("#deadFish .left a").click(onDeadFishClick);
			$("#deadFish input[type=submit]").click(onDeadFishSubmitClick);
		
		if(touch)
		{
			$("#icons li").click(onIconsClick);
			$("#pics li").click(onPicsClick);
			$("#logos li").click(onLogosClick);
			scrollbar.css("display","none");
		}	
		else
		{
			$("#icons li").hover(onIconsOver,onIconsOut);
			$("#pics li").hover(onPicsOver,onPicsOut);
			$("#logos li").hover(onLogosOver,onLogosOut);
			onScrollUp();
		}
		onResize();
		onScroll(scrollProgress);
		$.address.externalChange(onURLChange);
		$(window).resize(onResize);
	}

	function onURLChange(evt)
	{
		str=evt.value.split("/").join("").split("#").join("");
		var num=0;
		for(var i=0; i<navItems.length; i++)
		{
			var a=$(navItems[i]);
			if(a.attr("href").split("/").join("").split("#").join("")==str)
				num=i;
		}
		var dest=Math.min(navLabels[num]/timeline.duration(),maxScroll);
		TweenLite.to(window, 1, {scrollAmount:navLabels[num]/timeline.duration(), onUpdate:onScroll, ease:Cubic.easeOut});
	}

	function navSelect(num)
	{
		currentNav=num;
		var targ=$($("body > nav li")[num]);
		TweenLite.to(navRed, 1, {width:targ.width(), left:targ.offset().left+31-parseFloat($("body").css("left")), ease:Elastic.easeOut});
		
		var cur=$.address.value().split("/").join("");
		var shouldBe=$(navItems[num]).attr("href").split("#")[1];
		
		if(cur!=shouldBe)
		{
			console.log("here", shouldBe);
			$.address.value(shouldBe);
		}
	}

	function initTimeline()
	{
		if(timeline)
			timeline.kill();
		timeline=new TimelineLite({paused:true, onUpdate:onTimelineUpdate});
		navLabels=[];

		//thank you
			navLabels.push(0);
			var startTime=0;
			var secHeight=$("#thankYou").height();
			timeline.insert(TweenLite.fromTo($("#thankYou"), secHeight/height, {top:0}, {top:-secHeight, ease:Linear.easeNone}), startTime);
			timeline.insert(TweenLite.fromTo($("#thankYou img"), secHeight/height, {top:270, marginLeft:-29}, {top:1390, marginLeft:-1143, ease:Linear.easeNone}), startTime);
			navLabels.push(700/height);
			timeline.call(navSelect, [0], null, 350/height-0.001);
			timeline.call(navSelect, [1], null, 350/height);

		//what we do
			var newHeight=$("#whatWeDo").height();
			timeline.insert(TweenLite.fromTo($("#whatWeDo"), (secHeight+newHeight)/height, {top:secHeight}, {top:-newHeight, ease:Linear.easeNone}), startTime);

			timeline.insert(TweenLite.fromTo($("#whatWeDo li:first-child *"), 0.2, {left:240}, {left:0, ease:Cubic.easeOut}), (secHeight-height)/height+0.0+newHeight/2/height);
			timeline.insert(TweenLite.fromTo($("#whatWeDo li:first-child + li *"), (secHeight+newHeight)/height*0.2, {left:240}, {left:0, ease:Cubic.easeOut}), (secHeight-height)/height+0.05+newHeight/2/height);
			timeline.insert(TweenLite.fromTo($("#whatWeDo li:first-child + li + li *"), (secHeight+newHeight)/height*0.2, {left:240}, {left:0, ease:Cubic.easeOut}), (secHeight-height)/height+0.1+newHeight/2/height);
			timeline.insert(TweenLite.fromTo($("#whatWeDo li:first-child + li + li + li *"), (secHeight+newHeight)/height*0.2, {left:240}, {left:0, ease:Cubic.easeOut}), (secHeight-height)/height+0.15+newHeight/2/height);
		
		//combine bleeding
			startTime=timeline.duration();
			timeline.call(navSelect, [1], null, startTime-0.501);
			timeline.call(navSelect, [2], null, startTime-0.5);
			navLabels.push(startTime);
			secHeight=$("#combineBleeding").height();
			timeline.insert(TweenLite.fromTo($("#combineBleeding"), (secHeight+height)/height, {top:height}, {top:-secHeight, ease:Linear.easeNone}), startTime-1);

		//we enjoy
			startTime=timeline.duration();
			secHeight=$("#weEnjoy").height();
			timeline.insert(TweenLite.fromTo($("#weEnjoy"), (secHeight+height)/height, {top:height}, {top:-secHeight, ease:Linear.easeNone}), startTime-1.01);
			
			timeline.insert(TweenLite.fromTo($("#weEnjoy div:first-child"), secHeight/height*0.3, {top:-1222}, {top:-670, ease:Cubic.easeOut}), startTime-1.01);
			
			timeline.insert(TweenLite.fromTo($("#weEnjoy div:first-child + div"), secHeight/height*0.3, {top:-670}, {top:10, ease:Cubic.easeOut}), startTime-1.01+secHeight/height*0.5+0.01);
			timeline.insert(TweenLite.fromTo($("#weEnjoy div:first-child + div"), 0, {top:-1222}, {top:-1222}), startTime-1.01+secHeight/height*0.5);

		//our business
			startTime=timeline.duration();
			secHeight=$("#ourBusiness").height();
			timeline.insert(TweenLite.fromTo($("#ourBusiness"), (secHeight+height)/height, {top:height}, {top:-secHeight, ease:Linear.easeNone}), startTime-1);

		//icons
			startTime=timeline.duration();
			secHeight=$("#icons").height();
			timeline.insert(TweenLite.fromTo($("#icons"), (secHeight+height)/height, {top:height}, {top:-secHeight, ease:Linear.easeNone}), startTime-1);

		//dangerous minds
			startTime=timeline.duration();
			timeline.call(navSelect, [2], null, startTime-0.501);
			timeline.call(navSelect, [3], null, startTime-0.5);
			navLabels.push(startTime);
			secHeight=$("#dangerousMinds").outerHeight();
			timeline.insert(TweenLite.fromTo($("#dangerousMinds"), (secHeight+height)/height, {top:height}, {top:-secHeight, ease:Linear.easeNone}), startTime-1);

		//pics
			startTime=timeline.duration();
			secHeight=$("#pics").height();
			timeline.insert(TweenLite.fromTo($("#pics"), (secHeight+height)/height, {top:height}, {top:-secHeight, ease:Linear.easeNone}), startTime-1);

		//silicon valley
			startTime=timeline.duration();
			timeline.call(navSelect, [3], null, startTime-0.501);
			timeline.call(navSelect, [4], null, startTime-0.5);
			navLabels.push(startTime);
			secHeight=$("#siliconValley").height();
			timeline.insert(TweenLite.fromTo($("#siliconValley"), (secHeight+height)/height, {top:height}, {top:-secHeight, ease:Linear.easeNone}), startTime-1);

		//logos
			startTime=timeline.duration();
			secHeight=$("#logos").height();
			timeline.insert(TweenLite.fromTo($("#logos"), (secHeight+height)/height, {top:height}, {top:-secHeight, ease:Linear.easeNone}), startTime-1);

		//research and destroy
			startTime=timeline.duration();
			timeline.call(navSelect, [4], null, startTime-0.501);
			timeline.call(navSelect, [5], null, startTime-0.5);
			navLabels.push(startTime);
			secHeight=$("#researchAndDestroy").height();
			timeline.insert(TweenLite.fromTo($("#researchAndDestroy"), (secHeight+height)/height, {top:height}, {top:-secHeight, ease:Linear.easeNone}), startTime-1);

		//sign up
			startTime=timeline.duration();
			secHeight=$("#signUp").height();
			timeline.insert(TweenLite.fromTo($("#signUp"), (secHeight+height)/height, {top:height}, {top:-secHeight, ease:Linear.easeNone}), startTime-1);

		//sushi
			startTime=timeline.duration();
			timeline.call(navSelect, [5], null, startTime-0.501);
			timeline.call(navSelect, [6], null, startTime-0.5);
			navLabels.push(startTime);
			secHeight=$("#sushi").height();
			timeline.insert(TweenLite.fromTo($("#sushi"), (secHeight+height)/height, {top:height}, {top:-secHeight, ease:Linear.easeNone}), startTime-1);

		//dead fish
			startTime=timeline.duration();
			secHeight=$("#deadFish").height();
			timeline.insert(TweenLite.fromTo($("#deadFish"), (secHeight+height)/height, {top:height}, {top:-secHeight, ease:Linear.easeNone}), startTime-1);
			timeline.call(endFish, null, null, startTime-1-0.01);
			timeline.call(startFish, null, null, startTime-1);

		//contact
			startTime=timeline.duration();
			timeline.call(startFish, null, null, startTime);
			timeline.call(endFish, null, null, startTime+0.01);
			timeline.call(navSelect, [6], null, startTime-0.501);
			timeline.call(navSelect, [7], null, startTime-0.5);
			secHeight=$("#con").height();
			navLabels.push(startTime+secHeight/2/height-0.5);
			timeline.insert(TweenLite.fromTo($("#con"), (secHeight+height)/height, {top:height}, {top:-secHeight, ease:Linear.easeNone}), startTime-1);

		//footer
			startTime=timeline.duration();
			secHeight=$("body > div > footer").height();
			timeline.insert(TweenLite.fromTo($("body > div > footer"), (secHeight+height)/height, {top:height}, {top:-secHeight, ease:Linear.easeNone}), startTime-1);


			maxScroll=(timeline.duration()-1)/timeline.duration();
			navLabels[navLabels.length-1]=Math.min(navLabels[navLabels.length-1],maxScroll*timeline.duration());

		onScroll();
	}

	//nav
		function onLogoOver()
		{
			var fives=$(".five");
			if(!fives.data().going)
			{
				fives.data().going=true;
				var tll=new TimelineLite({onComplete:onLogoDone});
				var dest=MyMath.randomChoice()*20;
				tll.append(TweenLite.to(fives, 0.2, {rotation:dest, ease:Cubic.easeOut, transformOrigin:"40px 40px"}));
				tll.append(TweenLite.to(fives, Math.abs(dest)*0.1, {rotation:0, ease:Elastic.easeOut.config(1,0.15), transformOrigin:"40px 40px"}));
			}
		}

		function onLogoDone()
		{
			$(".five").data().going=false;
		}

	//thank you
		function resetThankYou()
		{
			var len=$("#thankYou li").length;
			for(var i=0; i<len; i++)
			{
				var dist=Math.abs(i-3);
				TweenLite.to($("#thankYou li")[i], 0, {autoAlpha:Math.max(0,1-dist/3)});
			}
			$("#thankYou ul").css("top",79.4*-3);
		}

	//icons

		function onIconsClick(evt)
		{
			var targ=$(evt.currentTarget);
			if(!targ.data().open)
			{
				iconOpen($(evt.currentTarget));
				targ.data().open=true;
			}
			else
			{
				iconClose($(evt.currentTarget));
				targ.data().open=false;
			}
		}

		function onIconsOver(evt)
		{
			iconOpen($(evt.currentTarget));
		}

		function onIconsOut(evt)
		{
			iconClose($(evt.currentTarget));
		}

		function iconOpen(targ)
		{
			TweenLite.to($(" h1 + div",targ), ROLL_OVER_TIME, {left:-320, ease:ROLL_OVER_EASE}); 
			TweenLite.to($(" div + div",targ), ROLL_OVER_TIME, {left:0, ease:ROLL_OVER_EASE}); 
		}

		function iconClose(targ)
		{
			TweenLite.to($(" h1 + div",targ), ROLL_OVER_TIME, {left:0, ease:ROLL_OVER_EASE}); 
			TweenLite.to($(" div + div",targ), ROLL_OVER_TIME, {left:320, ease:ROLL_OVER_EASE}); 
		}

	//pics

		function onPicsClick(evt)
		{
			var targ=$(evt.currentTarget);
			if(!targ.data().open)
			{
				picOpen($(evt.currentTarget));
				targ.data().open=true;
			}
			else
			{
				picClose($(evt.currentTarget));
				targ.data().open=false;
			}
		}

		function onPicsOver(evt)
		{
			picOpen($(evt.currentTarget));
		}

		function onPicsOut(evt)
		{
			picClose($(evt.currentTarget));
		}

		function picOpen(targ)
		{
			TweenLite.to($(" img",targ), ROLL_OVER_TIME, {left:-426, ease:ROLL_OVER_EASE}); 
			TweenLite.to($(" p",targ), ROLL_OVER_TIME, {left:0, ease:ROLL_OVER_EASE});
		}

		function picClose(targ)
		{
			TweenLite.to($(" img",targ), ROLL_OVER_TIME, {left:0, ease:ROLL_OVER_EASE}); 
			TweenLite.to($(" p",targ), ROLL_OVER_TIME, {left:426, ease:ROLL_OVER_EASE}); 
		}

	//logos

		function onLogosClick(evt)
		{
			var targ=$(evt.currentTarget);
			if(!targ.data().open)
			{
				logoOpen($(evt.currentTarget));
				targ.data().open=true;
			}
			else
			{
				logoClose($(evt.currentTarget));
				targ.data().open=false;
			}
		}

		function onLogosOver(evt)
		{
			logoOpen($(evt.currentTarget));
		}

		function onLogosOut(evt)
		{
			logoClose($(evt.currentTarget));
		}

		function logoOpen(targ)
		{
			TweenLite.to($(" .out",targ), ROLL_OVER_TIME, {left:-426, ease:ROLL_OVER_EASE}); 
			TweenLite.to($(" .over",targ), ROLL_OVER_TIME, {left:0, ease:ROLL_OVER_EASE}); 
			if(!targ.data().img)
			{
				var imgs=$(" .over img", targ);
				targ.data().imgs=imgs;
				targ.data().stock=$(" .stock", targ)[0];
			}	
			
			imgs=targ.data().imgs;
			var children=[];
			for(var i=0; i<imgs.length; i++)
			{
				children.push(imgs[i]);
			}
			MyMath.shuffle(children);
			if(targ.data().stock)
				children.splice(1,0,targ.data().stock);
			targ.data().timeline=new TimelineLite();
			targ.data().timeline.eventCallback("onComplete", targ.data().timeline.play, [0]);
			for(i=0; i<children.length; i++)
			{
				targ.data().timeline.insert(TweenLite.to(children[i], 0.2, {autoAlpha:0, ease:Linear.easeNone}), 2*(i+1));
				targ.data().timeline.insert(TweenLite.to(children[(i+1)%children.length], 0.2, {autoAlpha:1, ease:Linear.easeNone}), 2*(i+1));
				TweenLite.to(children[i], 0, {autoAlpha:0});
			}
			TweenLite.to(children[0], 0, {autoAlpha:1});
			if(targ.data().timeline)
				targ.data().timeline.play(0);
		}

		function logoClose(targ)
		{
			TweenLite.to($(" .out",targ), ROLL_OVER_TIME, {left:0, ease:ROLL_OVER_EASE}); 
			TweenLite.to($(" .over",targ), ROLL_OVER_TIME, {left:426, ease:ROLL_OVER_EASE});
			if(targ.data().timeline)
				targ.data().timeline.pause();
		}

	// dead fish

		function startFish()
		{
			var ease=Elastic.easeOut.config(1, 0.03);
			TweenLite.fromTo($("#fish1")[0], $("#fish1").height()*0.1, {rotation:MyMath.random(-30,30)}, {transformOrigin:"50% 0%", rotation:0, ease:ease});
			TweenLite.fromTo($("#fish2")[0], $("#fish2").height()*0.1, {rotation:MyMath.random(-30,30)}, {transformOrigin:"50% 0%", rotation:0, ease:ease});
			TweenLite.fromTo($("#fish3")[0], $("#fish3").height()*0.1, {rotation:MyMath.random(-30,30)}, {transformOrigin:"50% 0%", rotation:0, ease:ease});
			TweenLite.fromTo($("#fish4")[0], $("#fish4").height()*0.1, {rotation:MyMath.random(5,-5)}, {transformOrigin:"50% 0%", rotation:0, ease:ease});
			
			TweenLite.fromTo($("#fish1 img")[0], $("#fish1 img").width()*0.2, {rotation:MyMath.random(-30,30)}, {transformOrigin:"50% 30%", rotation:0, ease:ease});
			TweenLite.fromTo($("#fish2 img")[0], $("#fish2 img").width()*0.2, {rotation:MyMath.random(-30,30)}, {transformOrigin:"50% 30%", rotation:0, ease:ease});
			TweenLite.fromTo($("#fish3 img")[0], $("#fish3 img").width()*0.2, {rotation:MyMath.random(-30,30)}, {transformOrigin:"50% 30%", rotation:0, ease:ease});
			TweenLite.fromTo($("#fish4 img")[0], $("#fish4 img").width()*0.2, {rotation:MyMath.random(-30,30)}, {transformOrigin:"50% 30%", rotation:0, ease:ease});
		}

		function endFish()
		{
			TweenLite.killTweensOf($("#fish1")[0]);
			TweenLite.killTweensOf($("#fish2")[0]);
			TweenLite.killTweensOf($("#fish3")[0]);
			TweenLite.killTweensOf($("#fish4")[0]);
			TweenLite.killTweensOf($("#fish1 img")[0]);
			TweenLite.killTweensOf($("#fish2 img")[0]);
			TweenLite.killTweensOf($("#fish3 img")[0]);
			TweenLite.killTweensOf($("#fish4 img")[0]);
		}

	//sign up

		function onSignUpClick(evt)
		{
			evt.preventDefault();
			TweenLite.fromTo($("#signUp a"), 0.5, {autoAlpha:1, rotationX:0, transformPerspective:1000}, {autoAlpha:0, ease:Cubic.easeInOut, rotationX:-90, transformOrigin:"50% 50% -33px", transformPerspective:1000});
			TweenLite.fromTo($("#signUp form"), 0.5, {autoAlpha:0, rotationX:90, transformPerspective:1000}, {autoAlpha:1, ease:Cubic.easeInOut, rotationX:0, transformOrigin:"50% 50% -33px", transformPerspective:1000});
		}

		function onSignUpSubmitClick(evt)
		{
			evt.preventDefault();
			var email = $("#signUp input[type=text]").val();
			if(email!="")
				$.post("php/contact.php", {email:email}, emailSent);
			var tll=new TimelineLite();
			tll.insert(TweenLite.fromTo($("#signUp form"), 0.5, {autoAlpha:1, rotationX:0}, {autoAlpha:0, ease:Cubic.easeInOut, rotationX:90, transformOrigin:"50% 50% -33px", transformPerspective:1000, onComplete:onSignUpSubmitClick2}),0);
			tll.insert(TweenLite.fromTo($("#signUp div div p"), 0.5, {autoAlpha:0, rotationX:-90}, {autoAlpha:1, ease:Cubic.easeInOut, rotationX:0, transformOrigin:"50% 50% -33px", transformPerspective:1000}),0);
			
			tll.insert(TweenLite.fromTo($("#signUp div div p"), 0.5, {autoAlpha:1, rotationX:0}, {autoAlpha:0, ease:Cubic.easeInOut, rotationX:90, transformOrigin:"50% 50% -33px", transformPerspective:1000, onComplete:onSignUpSubmitClick2}),2.5);
			tll.insert(TweenLite.fromTo($("#signUp a"), 0.5, {autoAlpha:0, rotationX:-90}, {autoAlpha:1, ease:Cubic.easeInOut, rotationX:0, transformOrigin:"50% 50% -33px", transformPerspective:1000}),2.5);
		}

			function onSignUpSubmitClick2()
			{
				$("#signUp input[type=text]").val("");
			}

		function onDeadFishClick(evt)
		{
			evt.preventDefault();
			TweenLite.fromTo($("#deadFish .left a"), 0.5, {autoAlpha:1, rotationX:0, transformPerspective:1000}, {autoAlpha:0, ease:Cubic.easeInOut, rotationX:-90, transformOrigin:"50% 50% -32.5px", transformPerspective:1000});
			TweenLite.fromTo($("#deadFish form"), 0.5, {autoAlpha:0, rotationX:90, transformPerspective:1000}, {autoAlpha:1, ease:Cubic.easeInOut, rotationX:0, transformOrigin:"50% 50% -32.5px", transformPerspective:1000});
		}

		function onDeadFishSubmitClick(evt)
		{
			evt.preventDefault();
			var email = $("#deadFish input[type=text]").val();
			if(email!="")
				$.post("php/contact.php", {email:email}, emailSent);
			var tll=new TimelineLite;
			tll.insert(TweenLite.fromTo($("#deadFish form"), 0.5, {autoAlpha:1, rotationX:0, transformPerspective:1000}, {autoAlpha:0, ease:Cubic.easeInOut, rotationX:90, transformOrigin:"50% 50% -32.5px", transformPerspective:1000, onComplete:onDeadFishSubmitClick2}),0);
			tll.insert(TweenLite.fromTo($("#deadFish article div p"), 0.5, {autoAlpha:0, rotationX:-90, transformPerspective:1000}, {autoAlpha:1, ease:Cubic.easeInOut, rotationX:0, transformOrigin:"50% 50% -32.5px", transformPerspective:1000}),0);
			
			tll.insert(TweenLite.fromTo($("#deadFish article div p"), 0.5, {autoAlpha:1, rotationX:0, transformPerspective:1000}, {autoAlpha:0, ease:Cubic.easeInOut, rotationX:90, transformOrigin:"50% 50% -32.5px", transformPerspective:1000, onComplete:onDeadFishSubmitClick2}),2.5);
			tll.insert(TweenLite.fromTo($("#deadFish .left a"), 0.5, {autoAlpha:0, rotationX:-90, transformPerspective:1000}, {autoAlpha:1, ease:Cubic.easeInOut, rotationX:0, transformOrigin:"50% 50% -32.5px", transformPerspective:1000}),2.5);
		}

			function onDeadFishSubmitClick2()
			{
				$("#deadFish input[type=text]").val("");
			}

		function emailSent()
		{
			// console.log("email was sent");
		}

	//contact
		var currentContact;
		var contactPos={x:0,y:0,destX:-30,destY:-30};

		function onContactOver(evt)
		{
			currentContact=$(evt.currentTarget);
			var bgPos=currentContact.css("background-position");
			contactPos.x=parseFloat(bgPos.split(" ")[0]);
			contactPos.y=parseFloat(bgPos.split(" ")[1]);
			TweenLite.ticker.addEventListener("tick", onTick);
			currentContact[0].addEventListener("mousemove", onContactMove);
		}

		function onContactOut(evt)
		{
			TweenLite.ticker.removeEventListener("tick", onTick);
			currentContact[0].removeEventListener("mousemove", onContactMove);
		}

		function onContactMove(evt)
		{
			contactPos.destX=(evt.clientX-currentContact.offset().left)/(width/2)*-60;
			contactPos.destY=(evt.clientY-currentContact.offset().top)/948*-60;
		}

		function onTick()
		{
			MyMath.ease(contactPos, "x", contactPos.destX);
			MyMath.ease(contactPos, "y", contactPos.destY);
			currentContact.css("background-position", contactPos.x+"px "+contactPos.y+"px");
		}

	//scrollbar

		function onTimelineUpdate()
		{
			if(!touch)
				thumb.css("top", (height)*timeline.progress());
		}

		function onScrollDown(evt)
		{
			scrollbar[0].removeEventListener("mousedown", onScrollDown);
			
			onScrollMove(evt);

			$("body")[0].addEventListener("mousemove", onScrollMove);
			$("body")[0].addEventListener("mouseup", onScrollUp);
		}

		function onScrollUp(evt)
		{
			$("body")[0].removeEventListener("mousemove", onScrollMove);
			$("body")[0].removeEventListener("mouseup", onScrollUp);

			scrollbar[0].addEventListener("mousedown", onScrollDown);
		}

		function onScrollMove(evt)
		{
			evt.preventDefault();
			scrollAmount=Math.max(Math.min(maxScroll,(evt.clientY-scrollbar.offset().top-thumbHeight/2)/(height-thumbHeight)*maxScroll),0);
			timeline.progress(scrollAmount);
		}

	function onResize(evt)
	{
		width=$(window).width();
		$("#con div.left, #con div.right").css("background-size", Math.max(1280,width)/2+60+"px auto");
		$("#icons, #pics, #logos").width(width);
		height=$(window).height()-navHeight;
		$("body > div").height(height);
		initTimeline();
		$("body").css("left",Math.min((width-1280)/2,0));
		if(!touch)
		{
			thumbHeight=height/timeline.duration();
			thumb.height(thumbHeight);
			scrollbar.css("right",Math.max((1280-width)/2,0));
		}
		$("#icons, #pics, #logos").css("left",Math.max((1280-width)/2,0));
		navSelect(currentNav);
	}

	function onScroll(point)
	{
		if(point)
		{
			var deltaY=(point.y-scrollProgress.y)*MULTIPLIER;
			scrollProgress.y=point.y;
			scrollAmount+=deltaY;
			scrollAmount=Math.max(0,Math.min(scrollAmount,maxScroll));
		}
		timeline.progress(scrollAmount);
	}

//init

	$(document).ready(init);
	$(window).load(onResize);

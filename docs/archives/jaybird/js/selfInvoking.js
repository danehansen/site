"use strict";

(function()
{
	function init()
	{
		MyUtils.addClass(document.body, MyUtils.browser().name);
		footerInit();
		navInit();
		sizingInit();
		scrollingInit();
		formInit();
	}

	//page sizing

		var maxScroll;
		var $doc=$(document);

		function sizingInit()
		{
			sections=MyUtils.toArray($("body > section, body > footer"));
			numSections=sections.length;
			STS.onResize();
			MyUtils.addEventListener(window, "resize", STS.onResize);
		}

		STS.onResize=function()
		{
			STS.width=window.innerWidth;
			STS.height=window.innerHeight;
			STS.docHeight=$doc.height();
			maxScroll=STS.docHeight-STS.height;
			for(var i=0; i<numSections; i++)
			{
				var sec=sections[i];
				sec.top=sec.offsetTop;
				sec.height=sec.offsetHeight;
				if(sec.top<=84)
					sec.start=0;
				else
					sec.start=sec.top-STS.height;
				sec.end=Math.min(STS.docHeight-STS.height,sec.height+sec.top);
				if(sec.resize)
					sec.resize();
			}
			onScroll();
		}

	//scrolling

		var sections;
		var numSections;

		function scrollingInit()
		{
			onScroll();
			MyUtils.addEventListener(window, "scroll", onScroll);
		}

		function onScroll()
		{
			var pageYOffset=window.pageYOffset;
			var top=Math.min(maxScroll,Math.max(0,pageYOffset));
			for(var i=0; i<numSections; i++)
			{
				if(sections[i].scroll)
				{
					var sec=sections[i];
					var perc=MyMath.relativePercentage(sec.start,sec.end,top);
					if(perc<0)
						perc=-Number.MAX_VALUE;
					else if(perc>1)
						perc=Number.MAX_VALUE;
					if(sec.progress!=perc)
					{
						sec.progress=perc;
						sec.scroll({top: perc});
					}
				}
			}
			navScroll(pageYOffset);
		}

	//nav shrinking

		var navTimeline=new TimelineLite({paused:true});
		var NAV_DIFF=38;
		var currentScrollAmount=0;
		function navInit()
		{
			var $header=$("body > header");
			var headerHeight=$header.height();
			navTimeline.insert(TweenLite.fromTo($header[0],1,{height:headerHeight},{height:headerHeight-NAV_DIFF,ease:Linear.easeNone}),0);

			var $nav=$("nav",$header);
			navTimeline.insert(TweenLite.fromTo($nav[0],1,{top:0},{top:-NAV_DIFF/2,ease:Linear.easeNone}),0);

				var $imgs=$("> ul > li > img", $nav);
				navTimeline.insert(TweenLite.fromTo($imgs,1,{top:0},{top:-NAV_DIFF/2,ease:Linear.easeNone}),0);

				var $dropdown=$("> ul li ul",$nav);
				var dropdownTop=parseInt($dropdown.css("top"));
				navTimeline.insert(TweenLite.fromTo($dropdown[0],1,{top:dropdownTop},{top:dropdownTop-NAV_DIFF,ease:Linear.easeNone}),0);

			var $form=$("form",$header);
			var formTop=parseInt($form.css("top"));
			navTimeline.insert(TweenLite.fromTo($form[0],1,{top:formTop},{top:formTop-NAV_DIFF/2,ease:Linear.easeNone}),0);

			var $div=$("> div",$header);
			var divTop=parseInt($div.css("top"));
			navTimeline.insert(TweenLite.fromTo($div[0],1,{top:divTop},{top:divTop-NAV_DIFF/2,ease:Linear.easeNone}),0);

				var $cart=$("#dd_cart");
				var cartTop=parseInt($cart.css("top"));
				navTimeline.insert(TweenLite.fromTo($cart[0],1,{top:cartTop},{top:cartTop-NAV_DIFF,ease:Linear.easeNone}),0);

			var tip=$("ul li .tip", $nav)[0];
			navTimeline.insert(TweenLite.fromTo(tip,1,{marginBottom:0},{marginBottom:NAV_DIFF/3,ease:Linear.easeNone}),0);

			var otherTip=$("> div > .tip", $header);
			navTimeline.insert(TweenLite.fromTo(otherTip,1,{marginBottom:0},{marginBottom:NAV_DIFF/3,ease:Linear.easeNone}),0);
		}

		function navScroll(amount)
		{
			amount=Math.max(0,Math.min(NAV_DIFF,amount));
			if(amount!=currentScrollAmount)
			{
				navTimeline.progress(amount/NAV_DIFF);
				currentScrollAmount=amount;
			}
		}

	//search bar

		function searchTextEntered()
		{
			if($(this).val() != '')
			{
				$('body > header form button').addClass('focused');
			}
		}
		function blurredSearch()
		{
			if($(this).val() == '')
			{
				$('body > header form button.focused').removeClass('focused');
			}
		}

	//Handle lower case form fields

		function formInit()
		{
			$('body > header input[type=text]').keyup(searchTextEntered);
			$('body > header input[type=text]').blur(blurredSearch);
			$('input[type=text], textarea, input[type=search]').keyup(formTextInput);
		}

		function formTextInput()
		{
			var inputVal = $(this).val();
			if(inputVal != '')
			{
				$(this).css('text-transform','none');
			}
			else
			{
				$(this).css('text-transform','uppercase');
			}
		}

	//footer init

		var footerSticker=document.getElementById("login_and_help");
		var footerIsSticky=false;
		var footerAmount;

		function footerInit()
		{
			var footer=document.querySelector("body > footer");
			footer.scroll=footerScroll;
			footerAmount=STS.FOOTER_HEIGHT/footer.offsetHeight;
		}

		function footerScroll(num)
		{
			if(num>footerAmount && footerIsSticky)
			{
				footerIsSticky=false;
				footerSticker.className="";
			}
			else if(num<footerAmount && !footerIsSticky)
			{
				footerIsSticky=true;
				footerSticker.className="sticky";
			}
		}

	//initialize

		init();
})();

//vars
var STICKY_TOLLERANCE = 0.03;
var SCROLL_MULTIPLIER = 100;
var NAV_HEIGHT = 36;
var MIN_HEIGHT = 750;

var body;
var navItems;
var height;

var touch;
var momentum = 0;
var touchStart = { x: 0 };
var leaveDefaults;

var mainTimeline;
var mainScrollAmount = 0;
var stickyPoints;
var stickyTimer;
var currentSection = Number.MAX_VALUE;
var navLabels;

var direction = [];
var lastScrollAmount = 0;

//functions

function init() {
	//setup scrolling
	touch = 'ontouchstart' in window;
	body = $("body")[0];
	if (touch) {
		body.addEventListener('touchstart', touchStartHandler, true);
		leaveDefaults = [];
		var forms = $("input, textarea, a");
		for (var i = 0; i < forms.length; i++) {
			leaveDefaults.push(forms[i]);
		}
	}
	else {
		if (window.addEventListener)
			window.addEventListener('DOMMouseScroll', onMouseWheel, false);
		window.onmousewheel = document.onmousewheel = onMouseWheel;
		$(document).keydown(onKeyPress);
	}
	//set vars
	navItems = $("nav > div > ul > li");
	//init
	$.address.strict(false);
	if ($.address.value() == "")
		changeNav(0);
	onResize();
	$.address.externalChange(onURLChange);
	$(window).resize(onResize);
	$("#sec9 input[type=submit]").click(onSubmitContactClick);

	$("#sec9 textarea").focus(onTextareaFocus);
	TweenLite.to($("#sec9 form > p + p"), 0, { css: { autoAlpha: 0 } });
}

function onResize(evt) {
	height = $(window).height() - NAV_HEIGHT;
	$("body > div").height(height);
	$("#sec5b > div").css("left", Math.max(0, ($(window).width() - 960) / 2));
	/*if(height<MIN_HEIGHT-240)
		$("#sec7 img").css("bottom", height-MIN_HEIGHT+240);*/
	if (height < MIN_HEIGHT - 80)
		$("#sec7 img").css("bottom", height - MIN_HEIGHT + 80);
	/*if(height<MIN_HEIGHT)
		$("h2, h3").addClass("tiny");
	else
		$("h2, h3").removeClass("tiny");*/
	initTimeline();
}

function findDirection() {
	direction = (mainScrollAmount - lastScrollAmount > 0) ? 1 : -1;
	lastScrollAmount = mainScrollAmount;
}

function initTimeline() {
	if (mainTimeline)
		mainTimeline.kill();

	mainTimeline = new TimelineLite({ paused: true, onUpdate: findDirection });
	stickyPoints = [0];
	navLabels = [];

	var perc = Math.max(MIN_HEIGHT / height * 100, 100);
	//one
	mainTimeline.insert(function () { changeNav(0); }, 0);
	var startTime = 0;
	mainTimeline.insert(TweenLite.fromTo($("#sec1"), $("#sec1").height() / height, { css: { top: "0%" } }, { css: { top: "-" + 100 * ($("#sec1").height() / height) + "%" }, ease: Linear.easeNone }), 0);
	mainTimeline.insert(TweenLite.fromTo($("#sec1 > div:first-child"), $("#sec1").height() / height, { css: { left: -500 } }, { css: { left: -1500 }, ease: Linear.easeNone }), 0);
	//mainTimeline.insert(TweenLite.fromTo($("#sec1 div + div img"), $("#sec1").height()/height, {css:{top:54}}, {css:{top:-50}, ease:Linear.easeNone}), 0);
	navLabels.push(0);
	//two
	stickyPoints.push(mainTimeline.duration());
	startTime = mainTimeline.duration() + 0.25;
	navLabels.push(startTime - 0.25);
	mainTimeline.insert(function () { changeNav(0); }, startTime - 0.5);
	mainTimeline.insert(function () { changeNav(1); }, startTime - 0.49);

	TweenLite.to($("#sec2 h3 + h3"), 0, { css: { autoAlpha: 0 } });
	TweenLite.to($("#sec2 > div > h3 + div > article"), 0, { css: { autoAlpha: 0 } });
	TweenLite.to($("#sec2 > div > h3 + div + div > article"), 0, { css: { autoAlpha: 0 } });
	TweenLite.to($("#sec2 > div > h3 + div + div + div > article"), 0, { css: { autoAlpha: 0 } });
	if (perc > 100) {
		$("#sec2 > div > div + div").css("top", perc + "%");
		TweenLite.to($("#sec2 > div > h3 + div"), 0, { css: { top: perc - 100 + "%" } });
		mainTimeline.insert(TweenLite.fromTo($("#sec2 > div > h3 + div"), 1, { css: { top: perc - 100 + "%" } }, { css: { top: "0%" }, ease: Linear.easeNone }), startTime - 1);
		mainTimeline.insert(TweenLite.fromTo($("#sec2 > div > h3 + div + div + div"), 1, { css: { top: "0%" } }, { css: { top: -perc + 100 + "%" }, ease: Linear.easeNone }), startTime + 2);
	}

	mainTimeline.insert(TweenLite.fromTo($("#sec2"), 4, { css: { backgroundPosition: "-100% bottom" } }, { css: { backgroundPosition: "100% bottom" }, ease: Linear.easeNone }), startTime - 1);
	mainTimeline.insert(TweenLite.fromTo($("#sec2 > div > h2"), 1, { css: { top: 70 } }, { css: { top: 70 - height }, ease: Linear.easeNone }), startTime - 0.25);
	mainTimeline.insert(TweenLite.fromTo($("#sec2 > div > h3"), 1, { css: { top: 116 } }, { css: { top: 116 - height }, ease: Linear.easeNone }), startTime - 0.25);

	//first part moving in to view
	mainTimeline.insert(TweenLite.fromTo($("#sec2"), 1, { css: { top: "100%" } }, { css: { top: "0%" }, ease: Linear.easeNone }), startTime - 1 - 0.25);

	mainTimeline.insert(TweenLite.fromTo($("#sec2 > div > h3 + div > article"), 0.25, { css: { autoAlpha: 0 } }, { css: { autoAlpha: 1 }, ease: Linear.easeNone }), startTime - 0.25);
	mainTimeline.insert(TweenLite.fromTo($("#sec2 > div > h3 + div > article"), 0.25, { css: { autoAlpha: 1 } }, { css: { autoAlpha: 0 }, ease: Linear.easeNone }), startTime);

	mainTimeline.insert(TweenLite.fromTo($("#sec2 > div > h3 + div"), 1, { css: { top: "0%" } }, { css: { top: -perc + "%" }, ease: Linear.easeNone }), startTime);
	mainTimeline.insert(TweenLite.fromTo($("#sec2 > div > h2 + h3"), 0.1, { css: { autoAlpha: 1 } }, { css: { autoAlpha: 0 } }), startTime + 0.5);

	//second stuff moving in to view
	mainTimeline.insert(TweenLite.fromTo($("#sec2 > div > h3 + div + div"), 1, { css: { top: perc + "%" } }, { css: { top: "0%" }, ease: Linear.easeNone }), startTime);
	stickyPoints.push(startTime + 1);
	mainTimeline.insert(TweenLite.fromTo($("#sec2 > div > h3 + div + div > article"), 0.25, { css: { autoAlpha: 0 } }, { css: { autoAlpha: 1 }, ease: Linear.easeNone }), startTime + 0.75);
	mainTimeline.insert(TweenLite.fromTo($("#sec2 > div > h3 + div + div > article"), 0.25, { css: { autoAlpha: 1 } }, { css: { autoAlpha: 0 }, ease: Linear.easeNone }), startTime + 1);

	mainTimeline.insert(TweenLite.fromTo($("#sec2 > div > h3 + div + div"), 1, { css: { top: "0%" } }, { css: { top: -perc + "%" }, ease: Linear.easeNone }), startTime + 1);
	mainTimeline.insert(TweenLite.fromTo($("#sec2 > div > h2 + h3 + h3"), 0.1, { css: { autoAlpha: 0 } }, { css: { autoAlpha: 1 } }), startTime + 0.5);
	mainTimeline.insert(TweenLite.fromTo($("#sec2 > div > h2 + h3 + h3"), 0.1, { css: { autoAlpha: 1 } }, { css: { autoAlpha: 0 } }), startTime + 1.5);

	//thrid stuff coming in
	mainTimeline.insert(TweenLite.fromTo($("#sec2 > div > h3 + div + div + div"), 1, { css: { top: perc + "%" } }, { css: { top: "0%" }, ease: Linear.easeNone }), startTime + 1);
	mainTimeline.insert(TweenLite.fromTo($("#sec2 > div > h3 + div + div + div > article"), 0.25, { css: { autoAlpha: 0 } }, { css: { autoAlpha: 1 }, ease: Linear.easeNone }), startTime + 1.75);
	mainTimeline.insert(TweenLite.fromTo($("#sec2 > div > h3 + div + div + div > article"), 0.25, { css: { autoAlpha: 1 } }, { css: { autoAlpha: 0 }, ease: Linear.easeNone }), startTime + 2);

	stickyPoints.push(startTime + 2);
	mainTimeline.insert(TweenLite.fromTo($("#sec2 > div > h2 + h3 + h3 + h3"), 0.1, { css: { autoAlpha: 0 } }, { css: { autoAlpha: 1 } }), startTime + 1.5);

	mainTimeline.insert(TweenLite.fromTo($("#sec2"), 1, { css: { top: "0%" } }, { css: { top: "-100%" }, ease: Linear.easeNone }), startTime + 2);

	//three
	var pushback = 0.4;

	stickyPoints.push(mainTimeline.duration());
	startTime = mainTimeline.duration() + pushback;
	navLabels.push(startTime - pushback);
	mainTimeline.insert(function () { changeNav(1); }, startTime - 0.5);
	mainTimeline.insert(function () { changeNav(2); }, startTime - 0.49);

	if (perc > 100) {
		$("#sec3 > div > div + div").css("top", perc + "%");

		mainTimeline.insert(TweenLite.fromTo($("#sec3 > div > h3 + div"), 1, { css: { top: perc - 100 + "%" } }, { css: { top: "0%" }, ease: Linear.easeNone }), startTime - 1);
		TweenLite.to($("#sec3 > div > h3 + div"), 0, { css: { top: perc - 100 + "%" } });
		mainTimeline.insert(TweenLite.fromTo($("#sec3 > div > h3 + div + div"), 1, { css: { top: "0%" } }, { css: { top: -perc + 100 + "%" }, ease: Linear.easeNone }), startTime + 4.1);
	}


	TweenLite.to($("#sec3 h3 + h3, #sec3 h3 + div + div img"), 0, { css: { autoAlpha: 0 } });
	TweenLite.to($("#sec3 h3 + div + div img:first-child + img + img"), 0, { css: { autoAlpha: 1 } });
	TweenLite.to($("#sec3 h3 + div + div h4, #sec3 h3 + div + div article"), 0, { css: { autoAlpha: 0 } });
	TweenLite.to($("#sec3 h3 + div + div + div"), 0, { css: { autoAlpha: 0 } });
	// TweenLite.to($("#sec3 h3 + div + div > article, #sec3 h3 + div + div > h4"), 0, {css:{autoAlpha:0}});

	mainTimeline.insert(TweenLite.fromTo($("#sec3"), 1, { css: { top: "100%" } }, { css: { top: "0%" }, ease: Linear.easeNone }), startTime - 1 - pushback);
	mainTimeline.insert(TweenLite.fromTo($("#sec3 > div > h2"), 1, { css: { top: 70 } }, { css: { top: 70 - height }, ease: Linear.easeNone }), startTime - pushback);
	mainTimeline.insert(TweenLite.fromTo($("#sec3 > div > h3"), 1, { css: { top: 116 } }, { css: { top: 116 - height }, ease: Linear.easeNone }), startTime - pushback);

	mainTimeline.insert(TweenLite.fromTo($("#sec3 > div > h3 + div"), 1, { css: { top: "0%" } }, { css: { top: -perc + "%" }, ease: Linear.easeNone }), startTime);
	mainTimeline.insert(TweenLite.fromTo($("#sec3 h2 + h3"), 0.1, { css: { autoAlpha: 1 } }, { css: { autoAlpha: 0 } }), startTime + 0.5);

	mainTimeline.insert(TweenLite.fromTo($("#sec3 h3 + h3"), 0.1, { css: { autoAlpha: 0 } }, { css: { autoAlpha: 1 } }), startTime + 0.5);
	mainTimeline.insert(TweenLite.fromTo($("#sec3 > div > h3 + div + div"), 1, { css: { top: perc + "%" } }, { css: { top: "0%" }, ease: Linear.easeNone }), startTime);
	stickyPoints.push(startTime + 1);
	mainTimeline.insert(TweenLite.fromTo($("#sec3 > div > h3 + div + div + div"), 1, { css: { top: perc + "%" } }, { css: { top: "0%" }, ease: Linear.easeNone }), startTime);
	mainTimeline.insert(TweenLite.fromTo($("#sec3 > div > h3 + div + div + div"), 0.25, { css: { autoAlpha: 0 } }, { css: { autoAlpha: 1 }, ease: Linear.easeNone }), startTime + 0.75);

	mainTimeline.insert(TweenLite.fromTo($("#sec3 > div > h3 + div + div + div"), 0.1, { css: { autoAlpha: 1 } }, { css: { autoAlpha: 0 }, ease: Linear.easeNone }), startTime + 1);
	mainTimeline.insert(TweenLite.fromTo($("#sec3 > div > h3 + div + div + div + div"), 1, { css: { top: perc + "%" } }, { css: { top: "0%" }, ease: Linear.easeNone }), startTime + 1);
	stickyPoints.push(startTime + 2);

	mainTimeline.insert(TweenLite.fromTo($("#sec3 > div > h3 + div + div + div + div"), 1, { css: { top: "0%" } }, { css: { top: -perc + "%" }, ease: Linear.easeNone }), startTime + 2);

	//mainTimeline.insert(TweenLite.fromTo($("#sec3 h3 + div + div h4, #sec3 h3 + div + div article"), 0.1, {css:{autoAlpha:0}}, {css:{autoAlpha:1}, ease:Linear.easeNone}), startTime+2.5);
	mainTimeline.insert(TweenLite.fromTo($("#sec3 h3 + div + div > div img:first-child, #sec3 h3 + div + div > div img:first-child + img, #sec3 h3 + div + div > div img + img + img + img"), 0.1, { css: { autoAlpha: 0 } }, { css: { autoAlpha: 1 }, ease: Linear.easeNone }), startTime + 2.5);
	mainTimeline.insert(TweenLite.fromTo($("#sec3 h3 + div + div > div img:first-child, #sec3 h3 + div + div > div img:first-child + img + img + img"), 1, { css: { left: -10 } }, { css: { left: 290 }, ease: Linear.easeNone }), startTime + 2.5);
	mainTimeline.insert(TweenLite.fromTo($("#sec3 h3 + div + div > div img:first-child + img, #sec3 h3 + div + div > div img:first-child + img + img + img + img"), 1, { css: { left: 590 } }, { css: { left: 290 }, ease: Linear.easeNone }), startTime + 2.5);
	mainTimeline.insert(TweenLite.fromTo($("#sec3 h3 + div + div h4 + article > div"), 1, { css: { width: 140 } }, { css: { width: 240 }, ease: Linear.easeNone }), startTime + 2.5);
	mainTimeline.insert(TweenLite.fromTo($("#sec3 h3 + div + div h4 + article + article > div"), 1, { css: { width: 80 } }, { css: { width: 180 }, ease: Linear.easeNone }), startTime + 2.5);

	mainTimeline.insert(TweenLite.fromTo($("#sec3 h3 + div + div > article, #sec3 h3 + div + div > h4"), 0.25, { css: { autoAlpha: 0 } }, { css: { autoAlpha: 1 }, ease: Linear.easeNone }), startTime + 3.5);
	mainTimeline.insert(TweenLite.fromTo($("#sec3 h3 + div + div > article, #sec3 h3 + div + div > h4"), 0.25, { css: { autoAlpha: 1 } }, { css: { autoAlpha: 0 }, ease: Linear.easeNone }), startTime + 4.25);

	//mainTimeline.insert(TweenLite.fromTo($("#sec3 h3 + div + div > div img"), 0.1, {css:{autoAlpha:1}}, {css:{autoAlpha:0}, ease:Linear.easeNone}), startTime+4);
	//mainTimeline.insert(TweenLite.fromTo($("#sec3 h3 + div + div > img"), 0.1, {css:{autoAlpha:0}}, {css:{autoAlpha:1}, ease:Linear.easeNone}), startTime+4);

	mainTimeline.insert(TweenLite.fromTo($("#sec3"), $("#sec3").height() / height, { css: { top: "0%" } }, { css: { top: "-100%" }, ease: Linear.easeNone }), startTime + 4.1);

	//four
	startTime = mainTimeline.duration() + 0.25;
	stickyPoints.push(startTime - 0.25);


	TweenLite.to($("#sec4 h3 + div + div > article, #sec4 h3 + div + div > h4"), 0, { css: { autoAlpha: 0 } });
	if (perc > 100) {
		$("#sec4 h3 + div + div").css("top", perc + "%");

		mainTimeline.insert(TweenLite.fromTo($("#sec4 h3 + div"), 1, { css: { top: perc - 100 + "%" } }, { css: { top: "0%" }, ease: Linear.easeNone }), startTime - 1);
		mainTimeline.insert(TweenLite.fromTo($("#sec4 h3 + div + div"), 1, { css: { top: "0%" } }, { css: { top: -perc + 100 + "%" }, ease: Linear.easeNone }), startTime + 1);
	}
	mainTimeline.insert(TweenLite.fromTo($("#sec4"), 3, { css: { backgroundPosition: "100% bottom" } }, { css: { backgroundPosition: "-100% bottom" }, ease: Linear.easeNone }), startTime - 1);
	mainTimeline.insert(TweenLite.fromTo($("#sec4 > div > h2"), 1, { css: { top: 70 } }, { css: { top: 70 - height }, ease: Linear.easeNone }), startTime - 0.25);
	mainTimeline.insert(TweenLite.fromTo($("#sec4 > div > h3"), 1, { css: { top: 116 } }, { css: { top: 116 - height }, ease: Linear.easeNone }), startTime - 0.25);

	mainTimeline.insert(TweenLite.fromTo($("#sec4"), 1, { css: { top: "100%" } }, { css: { top: "0%" }, ease: Linear.easeNone }), startTime - 1 - 0.25);


	mainTimeline.insert(TweenLite.fromTo($("#sec4 h3 + div"), 1, { css: { top: "0%" } }, { css: { top: -perc + "%" }, ease: Linear.easeNone }), startTime);
	mainTimeline.insert(TweenLite.fromTo($("#sec4 h3 + div + div"), 1, { css: { top: perc + "%" } }, { css: { top: "0%" }, ease: Linear.easeNone }), startTime);
	stickyPoints.push(startTime + 1);

	mainTimeline.insert(TweenLite.fromTo($("#sec4 h3 + div + div > article, #sec4 h3 + div + div > h4"), 0.25, { css: { autoAlpha: 0 } }, { css: { autoAlpha: 1 }, ease: Linear.easeNone }), startTime + 0.75);
	mainTimeline.insert(TweenLite.fromTo($("#sec4 h3 + div + div > article, #sec4 h3 + div + div > h4"), 0.25, { css: { autoAlpha: 1 } }, { css: { autoAlpha: 0 }, ease: Linear.easeNone }), startTime + 1.25);

	mainTimeline.insert(TweenLite.fromTo($("#sec4 h3 + div + div img + img"), 2, { css: { marginTop: -120, left: 220, width: 456 } }, { css: { marginTop: -20, left: 245, width: 430 }, ease: Linear.easeNone }), startTime);
	mainTimeline.insert(TweenLite.fromTo($("#sec4 h3 + div + div h4 + article"), 2, { css: { marginTop: 0 } }, { css: { marginTop: 100 }, ease: Linear.easeNone }), startTime);
	mainTimeline.insert(TweenLite.fromTo($("#sec4 h3 + div + div h4 + article + article"), 2, { css: { marginTop: -50 } }, { css: { marginTop: 50 }, ease: Linear.easeNone }), startTime);

	mainTimeline.insert(TweenLite.fromTo($("#sec4"), $("#sec4").height() / height, { css: { top: "0%" } }, { css: { top: "-" + 100 * ($("#sec4").height() / height) + "%" }, ease: Linear.easeNone }), startTime + 1);

	//five
	startTime = mainTimeline.duration();

	if (perc > 100) {
		TweenLite.to($("#sec5 > div, #sec5b > div"), 0, { css: { top: perc + "%" } });
		mainTimeline.insert(TweenLite.fromTo($("#sec5 > div, #sec5b > div"), 2, { css: { top: perc + "%" } }, { css: { top: -perc + "%" }, ease: Linear.easeNone }), startTime);
		// mainTimeline.insert(TweenLite.fromTo($("#sec5c > div"), 2, {css:{top:"0%"}}, {css:{top:"-100%"}, ease:Linear.easeNone}), startTime-1);
	}
	stickyPoints.push(startTime);

	//moving into view
	mainTimeline.insert(TweenLite.fromTo($("#sec5"), 1, { css: { top: "100%" } }, { css: { top: "0%" }, ease: Linear.easeNone }), startTime - 1);
	mainTimeline.insert(TweenLite.fromTo($("#sec5b"), 1, { css: { top: "100%" } }, { css: { top: "0%" }, ease: Linear.easeNone }), startTime - 1);
	mainTimeline.insert(TweenLite.fromTo($("#sec5c"), 1, { css: { top: "100%" } }, { css: { top: "0%" }, ease: Linear.easeNone }), startTime - 1);

	//moving headline out
	mainTimeline.insert(TweenLite.fromTo($("#sec5c"), 1, { css: { top: "0%" } }, { css: { top: "-100%" }, ease: Linear.easeNone }), startTime);

	mainTimeline.insert(TweenLite.fromTo($("#sec5b"), 2, { css: { width: "100%" } }, { css: { width: "0%" }, ease: Cubic.easeInOut }), startTime);

	mainTimeline.insert(TweenLite.fromTo($("#sec5"), 1, { css: { top: "0%" } }, { css: { top: "-100%" }, ease: Linear.easeNone }), startTime + 2);
	mainTimeline.insert(TweenLite.fromTo($("#sec5b"), 1, { css: { top: "0%" } }, { css: { top: "-100%" }, ease: Linear.easeNone }), startTime + 2);
	// mainTimeline.insert(TweenLite.fromTo($("#sec5c"), 1, {css:{top:"0%"}}, {css:{top:"-100%"}, ease:Linear.easeNone}), startTime);

	//six
	startTime = mainTimeline.duration() + 0.25;
	stickyPoints.push(startTime - 0.25);
	navLabels.push(startTime - 0.25);
	mainTimeline.insert(function () { changeNav(2); }, startTime - 0.5);
	mainTimeline.insert(function () { changeNav(3); }, startTime - 0.49);

	if (perc > 100) {
		$("#sec6 > div > div + div").css("top", perc + "%");

		TweenLite.to($("#sec6 img"), 0, { css: { top: "100%" } });
		mainTimeline.insert(TweenLite.fromTo($("#sec6 img + div"), 1, { css: { top: perc - 100 + "%" } }, { css: { top: "0%" }, ease: Linear.easeNone }), startTime - 1);
		mainTimeline.insert(TweenLite.fromTo($("#sec6 img + div + div"), 1, { css: { top: "0%" } }, { css: { top: -perc + 100 + "%" }, ease: Linear.easeNone }), startTime + 1);
		mainTimeline.insert(TweenLite.fromTo($("#sec6 img"), 3, { css: { top: "100%" } }, { css: { top: "0%" }, ease: Linear.easeNone }), startTime - 1);
	}

	mainTimeline.insert(TweenLite.fromTo($("#sec6"), 1, { css: { top: "100%" } }, { css: { top: "0%" }, ease: Linear.easeNone }), startTime - 1 - 0.25);
	mainTimeline.insert(TweenLite.fromTo($("#sec6 > div > h2"), 1, { css: { top: 70 } }, { css: { top: 70 - height }, ease: Linear.easeNone }), startTime - 0.25);

	mainTimeline.insert(TweenLite.fromTo($("#sec6 img + div"), 1, { css: { top: "0%" } }, { css: { top: -perc + "%" }, ease: Linear.easeNone }), startTime);
	mainTimeline.insert(TweenLite.fromTo($("#sec6 img + div + div"), 1, { css: { top: perc + "%" } }, { css: { top: "0%" }, ease: Linear.easeNone }), startTime);
	stickyPoints.push(startTime + 1);

	mainTimeline.insert(TweenLite.fromTo($("#sec6"), $("#sec6").height() / height, { css: { top: "0%" } }, { css: { top: "-" + 100 * ($("#sec6").height() / height) + "%" }, ease: Linear.easeNone }), startTime + 1);

	//seven
	startTime = mainTimeline.duration();
	stickyPoints.push(startTime);
	navLabels.push(startTime);
	mainTimeline.insert(function () { changeNav(3); }, startTime - 0.5);
	mainTimeline.insert(function () { changeNav(4); }, startTime - 0.49);

	if (perc > 100) {
		$("#sec7 > div > div + div").css("top", perc + "%");

		mainTimeline.insert(TweenLite.fromTo($("#sec7 img + div"), 1, { css: { top: perc - 100 + "%" } }, { css: { top: "0%" }, ease: Linear.easeNone }), startTime - 1);
		mainTimeline.insert(TweenLite.fromTo($("#sec7 img + div + div"), 1, { css: { top: "0%" } }, { css: { top: -perc + 100 + "%" }, ease: Linear.easeNone }), startTime - 0.25);
	}
	if (height < MIN_HEIGHT - 80) {
		mainTimeline.insert(TweenLite.fromTo($("#sec7 h2 + img"), 0.75, { css: { bottom: height - MIN_HEIGHT + 80 } }, { css: { bottom: 0 }, ease: Linear.easeNone }), startTime);
	}
	mainTimeline.insert(TweenLite.fromTo($("#sec7"), 2.5, { css: { backgroundPosition: "-100% bottom" } }, { css: { backgroundPosition: "100% bottom" }, ease: Linear.easeNone }), startTime - 1);
	mainTimeline.insert(TweenLite.fromTo($("#sec7 > div > h2"), 1, { css: { top: 70 } }, { css: { top: 70 - height }, ease: Linear.easeNone }), startTime);

	mainTimeline.insert(TweenLite.fromTo($("#sec7"), 1, { css: { top: "100%" } }, { css: { top: "0%" }, ease: Linear.easeNone }), startTime - 1);

	mainTimeline.insert(TweenLite.fromTo($("#sec7 img + div"), 1, { css: { top: "0%" } }, { css: { top: -perc + "%" }, ease: Linear.easeNone }), startTime);
	mainTimeline.insert(TweenLite.fromTo($("#sec7 img + div + div"), 1, { css: { top: perc + "%" } }, { css: { top: "0%" }, ease: Linear.easeNone }), startTime - 0.25);
	stickyPoints.push(startTime + 0.75);

	mainTimeline.insert(TweenLite.fromTo($("#sec7"), $("#sec7").height() / height, { css: { top: "0%" } }, { css: { top: "-" + 100 * ($("#sec7").height() / height) + "%" }, ease: Linear.easeNone }), startTime + 0.75);

	//eight
	startTime = mainTimeline.duration();
	stickyPoints.push(startTime);
	navLabels.push(startTime);
	mainTimeline.insert(function () { changeNav(4); }, startTime - 0.5);
	mainTimeline.insert(function () { changeNav(5); }, startTime - 0.49);
	mainTimeline.insert(TweenLite.fromTo($("#sec8"), $("#sec8").height() / height + 1, { css: { backgroundPosition: "100% bottom" } }, { css: { backgroundPosition: "-100% bottom" }, ease: Linear.easeNone }), startTime - 1);

	mainTimeline.insert(TweenLite.fromTo($("#sec8"), 1, { css: { top: "100%" } }, { css: { top: "0%" }, ease: Linear.easeNone }), startTime - 1);

	mainTimeline.insert(TweenLite.fromTo($("#sec8"), $("#sec8").height() / height, { css: { top: "0%" } }, { css: { top: "-" + 100 * ($("#sec8").height() / height) + "%" }, ease: Linear.easeNone }), startTime);

	//nine
	var bottom = " bottom";
	if (height < 600)
		bottom = " " + (height - 600) + "px";
	startTime = mainTimeline.duration();
	stickyPoints.push(startTime);
	navLabels.push(startTime);
	mainTimeline.insert(function () { changeNav(5); }, startTime - 0.5);
	mainTimeline.insert(function () { changeNav(6); }, startTime - 0.49);
	mainTimeline.insert(TweenLite.fromTo($("#sec9"), $("#sec9").height() / height, { css: { backgroundPosition: "50% " + height + "px" } }, { css: { backgroundPosition: "50% " + Math.max(height - 819, 0) + "px" }, ease: Linear.easeNone }), startTime - 1);

	mainTimeline.insert(TweenLite.fromTo($("#sec9"), 1, { css: { top: "100%" } }, { css: { top: "0%" }, ease: Linear.easeNone }), startTime - 1);
	if (height < $("#sec9").height())
		mainTimeline.insert(TweenLite.fromTo($("#sec9"), $("#sec9").height() / height - 1, { css: { top: "0%" } }, { css: { top: "-" + (($("#sec9").height() / height - 1) * 100) + "%" }, ease: Linear.easeNone }), startTime);

	stickyPoints.sort(function (a, b) { return a - b });
	for (var i = 0; i < stickyPoints.length; i++) {
		stickyPoints[i] /= mainTimeline.duration();
	}

	scroll();
}

//scrollwheel

function onMouseWheel(evt) {
	evt = evt ? evt : window.event;
	if (evt.preventDefault)
		evt.preventDefault();
	evt.returnValue = false;

	var delta = 0;
	if (!evt)
		evt = window.event;
	if (evt.wheelDelta)
		delta = evt.wheelDelta / 120;
	else if (evt.detail)
		delta = -evt.detail / 3;
	scroll(delta);
}

//touch 

function touchStartHandler(evt) {
	preventDefault(evt);
	body.removeEventListener('touchstart', touchStartHandler, true);

	removeMomentum();
	touchStart.y = evt.touches[0].pageY;

	body.addEventListener('touchmove', touchMoveHandler, true);
	body.addEventListener('touchend', touchEndHandler, true);
}

function touchMoveHandler(evt) {
	evt.preventDefault();
	momentum = -(touchStart.y - evt.touches[0].pageY) / 6;
	touchStart.y = evt.touches[0].pageY;
	scroll(momentum);
}

function touchEndHandler(evt) {
	preventDefault(evt);
	body.removeEventListener('touchmove', touchMoveHandler, true);
	body.removeEventListener('touchend', touchEndHandler, true);

	TweenLite.ticker.addEventListener("tick", onMomentum);
	body.addEventListener('touchstart', touchStartHandler, true);
}

function onMomentum() {
	momentum -= momentum * 0.1;
	if (Math.abs(momentum) < 0.025) {
		removeMomentum();
	}
	else {
		scroll(momentum);
	}
}

function removeMomentum() {
	TweenLite.ticker.removeEventListener("tick", onMomentum);
	momentum = 0;
}

function preventDefault(evt) {
	var kill = true;
	for (var i = 0; i < leaveDefaults.length; i++) {
		if (leaveDefaults[i] == evt.target)
			kill = false;
	}
	if (kill)
		evt.preventDefault();
}

//arrow keys
function onKeyPress(evt) {
	evt = evt ? evt : window.event;
	if (evt.keyCode == 38 || evt.keyCode == 40) {
		if (evt.preventDefault)
			evt.preventDefault();
		evt.returnValue = false;
		var arrowAmount = 0.05;
		TweenLite.to(window, 0.5, { mainScrollAmount: evt.keyCode == 38 ? Math.max(0, mainScrollAmount - arrowAmount) : Math.min(1, mainScrollAmount + arrowAmount), ease: Cubic.easeOut, onUpdate: scroll })
	}
}

function scroll(delta) {
	var str = "main";
	if (typeof delta !== 'undefined') {
		window[str + "ScrollAmount"] -= delta / (SCROLL_MULTIPLIER * window[str + "Timeline"].duration());
		if (window[str + "ScrollAmount"] < 0)
			window[str + "ScrollAmount"] = 0;
		else if (window[str + "ScrollAmount"] > 1)
			window[str + "ScrollAmount"] = 1;
	}
	window[str + "Timeline"].progress(window[str + "ScrollAmount"]);
	if (typeof delta !== 'undefined')
		setStickyTimer();
	$("body").css("background-position", "0 " + mainTimeline.time() * -100 + "px");
}

function setStickyTimer() {
	killStickyTimer();
	stickyTimer = setTimeout(onStickyTimer, 300);
}

function killStickyTimer() {
	if (stickyTimer)
		clearTimeout(stickyTimer);
}

function onStickyTimer() {
	var closest;
	var closestIndex;
	var newSection = 0;
	for (var i = 0; i < stickyPoints.length; i++) {
		if ((direction == 1 && stickyPoints[i] > mainScrollAmount) || (direction == -1 && stickyPoints[i] < mainScrollAmount)) {
			var diff = Math.abs(mainScrollAmount - stickyPoints[i]);
			if (diff <= STICKY_TOLLERANCE) {
				if (closest) {
					if (diff < Math.abs(mainScrollAmount - closest)) {
						closest = stickyPoints[i];
						closestIndex = i;
					}
				}
				else {
					closest = stickyPoints[i];
					closestIndex = i;
				}
			}
		}
	}
	if (closest)
		TweenLite.to(window, Math.abs(closest - mainScrollAmount) * 20, { mainScrollAmount: closest, ease: Sine.easeOut, onUpdate: scroll });
	else
		killStickyTimer();
}

//nav
function changeNav(num) {
	if (num != currentSection) {
		currentSection == num;
		for (var i = 0; i < navItems.length; i++) {
			var li = $(navItems[i]);
			var a = $(" > a", li);
			if (i != 0) {
				if (i == num)
					TweenLite.to(a, 0.2, { css: { className: "+=selected" }, ease: Linear.easeNone });
				else
					TweenLite.to(a, 0.2, { css: { className: "-=selected" }, ease: Linear.easeNone });
			}
		}
		var li = $(navItems[num]);
		var a = $(" > a", li);
		$.address.value(a.attr("href").split("#")[1]);
	}
}

function onURLChange(evt) {
	gotoURL(evt.value);
}

function gotoURL(str) {
	var num = 0;
	for (var i = 0; i < navItems.length; i++) {
		var li = $(navItems[i]);
		var a = $(" > a", li);
		if (a.attr("href").split("#")[1] == str)
			num = i;
	}
	TweenLite.to(window, 1, { mainScrollAmount: navLabels[num] / mainTimeline.duration(), onUpdate: scroll, ease: Cubic.easeOut });
}

//contact
function onSubmitContactClick(evt) {
	evt.preventDefault();
	var firstName = $("#sec9 form input:first-child").val();
	var lastName = $("#sec9 form input:first-child + input").val();
	var email = $("#sec9 form input:first-child + input + input").val();
	var message = $("#sec9 textarea").val();
	if (message != "") {
		alert('contact disabled');
	}
	$("#sec9 input[type=text], #sec9 textarea").val("");
	TweenLite.to($("#sec9 form > p"), 0, { css: { autoAlpha: 1 } });
}

function emailSent(evt) {
	TweenLite.to($("#sec9 form > p + p"), 1, { css: { autoAlpha: 0 }, delay: 5 });
	// console.log("emailSent",evt);
}

function onTextareaFocus() {
	TweenLite.to($("#sec9 form > p"), 0, { css: { autoAlpha: 0 } });
}

//init

$(document).ready(init);
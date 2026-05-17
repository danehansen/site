//vars
var STICKY_TOLLERANCE = 0.05;
var SCROLL_MULTIPLIER = 100;
var NAV_HEIGHT = 54;
var PIN_LOW = 15;
var PIN_CLOSED = 25;
var PIN_OPEN = 37;
var PIN_TILT = 40;
var PIN_HIGH = 50;

var body;
var navItems;
var height;

var touch;
var momentum = 0;
var touchStart = { x: 0 };
var pinImg = PIN_LOW;
var leaveDefaults;

var mainTimeline;
var privacyTimeline;
var termsTimeline;
var mainScrollAmount = 0;
var privacyScrollAmount = 0;
var termsScrollAmount = 0;
var stickyPoints;
var stickyTimer;
var currentSection = Number.MAX_VALUE;
var carrot;
var navLabels;

var fact1Progress = 0;
var fact2Progress = 0;
var info1Progress = 0;
var ring;

var privacyOpen = false;
var termsOpen = false;

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
		$("#sec4 iframe")[0].width = 480;
		$("#sec4 iframe")[0].height = 270;
		$("#sec4 iframe").css("margin-left", 240);
	}
	else {
		if (window.addEventListener)
			window.addEventListener('DOMMouseScroll', onMouseWheel, false);
		window.onmousewheel = document.onmousewheel = onMouseWheel;
		$(document).keydown(onKeyPress);
	}
	//set vars
	navItems = $("nav > div > ul > li");
	carrot = $("nav > div > ul + img");
	//init
	$.address.strict(false);
	if ($.address.value() == "")
		changeNav(0);
	onPinProgress();
	onResize();
	$(".close").click(onCloseClick);
	$("#sec5 > div > form > textarea + input").click(onSubmitContactClick);
	$("#sec5 > div > form + form > input + input").click(onSubmitNewsletterClick);
	$("#sec7 > div > section > ul > li:first-child > a").click(onPrivacyClick);
	$("#sec7 > div > section > ul > li:first-child + li + li > a").click(onTermsClick);
	$.address.externalChange(onURLChange);
	$(window).resize(onResize);

	//prettyphoto
	$("a[rel^='prettyPhoto']").prettyPhoto({ theme: 'light_square', deeplinking: false, social_tools: false, default_width: 853, default_height: 480, });

	//ga
	var _gaq = _gaq || [];
	_gaq.push(['_setAccount', 'UA-36472165-1']);
	_gaq.push(['_setDomainName', 'solarstash.com']);
	_gaq.push(['_trackPageview']);
	(function () {
		var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
		ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
		var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
	})();
}

function onResize(evt) {
	height = $(window).height() - NAV_HEIGHT;
	$("body > div").height(height);
	initTimeline();
}

function findDirection() {
	direction = (mainScrollAmount - lastScrollAmount > 0) ? 1 : -1;
	lastScrollAmount = mainScrollAmount;
}

function initTimeline() {
	if (mainTimeline) {
		mainTimeline.kill();
		privacyTimeline.kill();
		termsTimeline.kill();
	}
	mainTimeline = new TimelineLite({ paused: true, onUpdate: findDirection });
	privacyTimeline = new TimelineLite({ paused: true });
	termsTimeline = new TimelineLite({ paused: true });
	stickyPoints = [0];
	navLabels = [];

	privacyTimeline.insert(TweenLite.fromTo($("#sec8"), ($("#sec8").height() - height) / height, { css: { top: "0%" } }, { css: { top: "-" + 100 * (($("#sec8").height() - height) / height) + "%" }, ease: Linear.easeNone }), 0);
	termsTimeline.insert(TweenLite.fromTo($("#sec9"), ($("#sec9").height() - height) / height, { css: { top: "0%" } }, { css: { top: "-" + 100 * (($("#sec9").height() - height) / height) + "%" }, ease: Linear.easeNone }), 0);

	//one
	var startTime = 0;
	mainTimeline.insert(TweenLite.fromTo($("#sec1"), $("#sec1").height() / height, { css: { top: "0%" } }, { css: { top: "-" + 100 * ($("#sec1").height() / height) + "%" }, ease: Linear.easeNone }), 0);
	mainTimeline.insert(TweenLite.fromTo($("#sec1 > div > article"), $("#sec1").height() / height, { css: { top: 147, autoAlpha: 1 } }, { css: { top: -53, autoAlpha: 0 }, ease: Sine.easeIn }), 0);
	mainTimeline.insert(TweenLite.fromTo($("#sec1 > div > article > p + p"), $("#sec1").height() / height, { css: { top: 0 } }, { css: { top: -200 }, ease: Sine.easeIn }), 0);
	mainTimeline.insert(TweenLite.fromTo($("#sec1 > div > article > h1 + p"), $("#sec1").height() / height, { css: { top: 0 } }, { css: { top: -400 }, ease: Sine.easeIn }), 0);
	mainTimeline.insert(TweenLite.fromTo($("#sec1 > div > article > h1"), $("#sec1").height() / height, { css: { top: 0 } }, { css: { top: -600 }, ease: Sine.easeIn }), 0);
	mainTimeline.insert(function () { changeNav(0); }, 0);
	navLabels.push(0);
	//two
	startTime = $("#sec1").height() / height;
	mainTimeline.insert(TweenLite.fromTo($("#sec2"), 1, { css: { top: "100%" } }, { css: { top: "0%" }, ease: Linear.easeNone }), startTime - 1);
	mainTimeline.insert(function () { changeNav(1); }, startTime);
	navLabels.push(startTime);
	mainTimeline.insert(TweenLite.fromTo($("#pin"), 1, { css: { marginLeft: -2000, autoAlpha: 0 } }, { css: { marginLeft: 0, autoAlpha: 1 }, ease: Sine.easeOut }), startTime - 1);
	var duration = 0.25;
	var articleEase = Sine;
	//to solar panel frame
	mainTimeline.insert(TweenLite.fromTo(window, duration, { pinImg: PIN_LOW }, { pinImg: PIN_OPEN, ease: Linear.easeNone, onUpdate: onPinProgress }), startTime);
	var articleDest = (height - $("#article1").height()) / 2;
	mainTimeline.insert(TweenLite.fromTo($("#article1"), duration, { css: { top: "100%", left: "100%" } }, { css: { top: Math.max(0, articleDest), left: 635 }, ease: articleEase.easeOut }), startTime);
	if (articleDest < 0)
		mainTimeline.insert(TweenLite.fromTo($("#article1"), duration * 2, { css: { top: Math.max(0, articleDest) } }, { css: { top: articleDest * 2 }, ease: articleEase.easeOut }), startTime + duration);
	stickyPoints.push(mainTimeline.duration());
	//pause for solar panel
	//solar panel pause
	mainTimeline.insert(TweenLite.fromTo(window, duration, { pinImg: PIN_OPEN }, { pinImg: PIN_TILT, ease: Linear.easeNone, onUpdate: onPinProgress }), duration * 3 + startTime);
	stickyPoints.push(duration * 2 + startTime);
	mainTimeline.insert(TweenLite.fromTo($("#article1"), duration, { css: { top: Math.min(articleDest * 2, articleDest), left: 635 } }, { css: { top: -$("#article1").height(), left: "100%" }, ease: articleEase.easeIn }), duration * 3 + startTime);
	//show meter	
	articleDest = (height - $("#article2").height()) / 2;
	mainTimeline.insert(TweenLite.fromTo($("#article2"), duration, { css: { top: "100%", left: "100%" } }, { css: { top: Math.max(0, articleDest), left: 635 }, ease: articleEase.easeOut }), duration * 3 + startTime);
	if (articleDest < 0)
		mainTimeline.insert(TweenLite.fromTo($("#article2"), duration * 4, { css: { top: Math.max(0, articleDest) } }, { css: { top: articleDest * 2 }, ease: articleEase.easeOut }), startTime + duration * 4);
	stickyPoints.push(mainTimeline.duration());
	mainTimeline.insert(TweenLite.fromTo($("#sec2 > div:first-child"), duration * 2, { css: { top: "100%" } }, { css: { top: "0%" }, ease: Linear.easeNone, onUpdate: onSunshineMove }), duration * 2 + startTime);
	//to begin tilt frame
	mainTimeline.insert(TweenLite.fromTo(window, duration, { pinImg: PIN_TILT }, { pinImg: PIN_HIGH, ease: Linear.easeNone, onUpdate: onPinProgress }), duration * 4 + startTime);
	mainTimeline.insert(TweenLite.fromTo($("#article2 > div > div > img:first-child"), duration / 5, { css: { top: 65 } }, { css: { top: 56 }, ease: Cubic.easeInOut }), duration * 4 + startTime);
	mainTimeline.insert(TweenLite.fromTo($("#article2 > div > div > img:first-child + img"), duration / 5, { css: { top: 65 } }, { css: { top: 46 }, ease: Cubic.easeInOut }), duration * 4 + duration / 5 + startTime);
	mainTimeline.insert(TweenLite.fromTo($("#article2 > div > div > img:first-child + img + img"), duration / 5, { css: { top: 65 } }, { css: { top: 36 }, ease: Cubic.easeInOut }), duration * 4 + duration / 5 * 2 + startTime);
	mainTimeline.insert(TweenLite.fromTo($("#article2 > div > div > img:first-child + img + img + img"), duration / 5, { css: { top: 65 } }, { css: { top: 26 }, ease: Cubic.easeInOut }), duration * 4 + duration / 5 * 3 + startTime);
	mainTimeline.insert(TweenLite.fromTo($("#article2 > div > div > img:first-child + img + img + img + img"), duration / 5, { css: { top: 65 } }, { css: { top: 16 }, ease: Cubic.easeInOut }), duration * 4 + duration / 5 * 4 + startTime);
	//meter pause
	//solar signal
	mainTimeline.insert(TweenLite.fromTo(window, duration, { pinImg: PIN_HIGH }, { pinImg: PIN_TILT, ease: Linear.easeNone, onUpdate: onPinProgress }), duration * 7 + startTime);
	mainTimeline.insert(TweenLite.fromTo($("#article2 > div > div > img:first-child + img + img + img + img"), duration / 5, { css: { top: 16 } }, { css: { top: 65 }, ease: Cubic.easeInOut }), duration * 7 + startTime);
	mainTimeline.insert(TweenLite.fromTo($("#article2 > div > div > img:first-child + img + img + img"), duration / 5, { css: { top: 26 } }, { css: { top: 65 }, ease: Cubic.easeInOut }), duration * 7 + duration / 5 + startTime);
	mainTimeline.insert(TweenLite.fromTo($("#article2 > div > div > img:first-child + img + img"), duration / 5, { css: { top: 36 } }, { css: { top: 65 }, ease: Cubic.easeInOut }), duration * 7 + duration / 5 * 2 + startTime);
	mainTimeline.insert(TweenLite.fromTo($("#article2 > div > div > img:first-child + img"), duration / 5, { css: { top: 46 } }, { css: { top: 65 }, ease: Cubic.easeInOut }), duration * 7 + duration / 5 * 3 + startTime);
	mainTimeline.insert(TweenLite.fromTo($("#article2 > div > div > img:first-child"), duration / 5, { css: { top: 56 } }, { css: { top: 65 }, ease: Cubic.easeInOut }), duration * 7 + duration / 5 * 4 + startTime);
	//hide meter			
	mainTimeline.insert(TweenLite.fromTo($("#article2"), duration, { css: { top: Math.min(articleDest * 2, articleDest), left: 635 } }, { css: { top: -$("#article2").height() * 1.4, left: "100%" }, ease: articleEase.easeIn }), duration * 8 + startTime);
	stickyPoints.push(duration * 7 + startTime);
	mainTimeline.insert(TweenLite.fromTo($("#sec2 > div:first-child"), duration * 2, { css: { top: "0%" } }, { css: { top: "-100%" }, ease: Linear.easeNone, onUpdate: onSunshineMove }), duration * 8 + startTime);
	//to pocket frame
	mainTimeline.insert(TweenLite.fromTo(window, duration, { pinImg: PIN_TILT }, { pinImg: PIN_CLOSED, ease: Linear.easeNone, onUpdate: onPinProgress }), duration * 8 + startTime);
	//unzip
	mainTimeline.insert(TweenLite.fromTo($("#pull"), duration, { css: { top: 0, left: 0 } }, { css: { top: -235, left: -35 }, ease: Sine.easeInOut }), duration * 9 + startTime);
	mainTimeline.insert(TweenLite.fromTo($("#closedLeft, #closedRight"), duration, { css: { height: 320 } }, { css: { height: 85 }, ease: Sine.easeInOut }), duration * 9 + startTime);
	mainTimeline.insert(TweenLite.fromTo($("#openLeft, #openRight"), duration, { css: { height: 230 } }, { css: { height: 465 }, ease: Sine.easeInOut }), duration * 9 + startTime);
	mainTimeline.insert(TweenLite.fromTo($("#openLeft > img, #openRight > img"), duration, { css: { top: -320 } }, { css: { top: -85 }, ease: Sine.easeInOut }), duration * 9 + startTime);
	//iphone out
	mainTimeline.insert(TweenLite.fromTo($("#phone"), duration, { css: { left: 110 } }, { css: { left: 310 }, ease: Sine.easeInOut }), duration * 10 + startTime);
	articleDest = (height - $("#article3").height()) / 2;
	mainTimeline.insert(TweenLite.fromTo($("#article3"), duration, { css: { top: "100%", left: "100%" } }, { css: { top: Math.max(0, articleDest), left: 635 }, ease: articleEase.easeOut }), duration * 10 + startTime);
	if (articleDest < 0)
		mainTimeline.insert(TweenLite.fromTo($("#article3"), duration * 4, { css: { top: Math.max(0, articleDest) } }, { css: { top: articleDest * 2 }, ease: articleEase.easeOut }), startTime + duration * 11);
	stickyPoints.push(mainTimeline.duration());
	//protection pause
	//iphone in
	mainTimeline.insert(TweenLite.fromTo($("#phone"), duration, { css: { left: 310 } }, { css: { left: 110 }, ease: Sine.easeInOut }), duration * 13 + startTime);
	//zip
	mainTimeline.insert(TweenLite.fromTo($("#pull"), duration, { css: { top: -235, left: -35 } }, { css: { top: 0, left: 0 }, ease: Sine.easeInOut }), duration * 14 + startTime);
	mainTimeline.insert(TweenLite.fromTo($("#closedLeft, #closedRight"), duration, { css: { height: 85 } }, { css: { height: 320 }, ease: Sine.easeInOut }), duration * 14 + startTime);
	mainTimeline.insert(TweenLite.fromTo($("#openLeft, #openRight"), duration, { css: { height: 465 } }, { css: { height: 230 }, ease: Sine.easeInOut }), duration * 14 + startTime);
	mainTimeline.insert(TweenLite.fromTo($("#openLeft > img, #openRight > img"), duration, { css: { top: -85 } }, { css: { top: -320 }, ease: Sine.easeInOut }), duration * 14 + startTime);
	//back to beginning frame
	mainTimeline.insert(TweenLite.fromTo(window, duration, { pinImg: PIN_CLOSED }, { pinImg: PIN_LOW, ease: Linear.easeNone, onUpdate: onPinProgress }), duration * 15 + startTime);
	mainTimeline.insert(TweenLite.fromTo($("#article3"), duration, { css: { top: Math.min(articleDest * 2, articleDest), left: 635 } }, { css: { top: -$("#article3").height(), left: "100%" }, ease: articleEase.easeIn }), duration * 15 + startTime);
	stickyPoints.push(duration * 14 + startTime);
	mainTimeline.insert(TweenLite.fromTo($("#sec2"), 1, { css: { top: "0%" } }, { css: { top: "-100%" }, ease: Linear.easeNone }), startTime + 16 * duration);
	mainTimeline.insert(TweenLite.fromTo($("#pin"), 1, { css: { marginLeft: 0, autoAlpha: 1 } }, { css: { marginLeft: 2000, autoAlpha: 0 }, ease: Sine.easeIn }), startTime + 16 * duration);

	//three
	stickyPoints.push(mainTimeline.duration());
	startTime = startTime + 16 * duration + 1;
	mainTimeline.insert(TweenLite.fromTo($("#sec3"), 1, { css: { top: "100%" } }, { css: { top: "0%" }, ease: Linear.easeNone }), startTime - 1);
	mainTimeline.insert(initRing, startTime - 1);
	mainTimeline.insert(TweenLite.fromTo($("#sec3 > div > section:first-child > section:first-child > div:first-child + div"), 1, { css: { top: 219 } }, { css: { top: 81 }, ease: Linear.easeNone }), startTime - 1);
	mainTimeline.insert(TweenLite.fromTo($("#sec3 > div > section:first-child > section:first-child > div:first-child + div + div"), 1, { css: { top: 384 } }, { css: { top: 331 }, ease: Linear.easeNone }), startTime - 1);
	mainTimeline.insert(TweenLite.fromTo($("#sec3 > div > section:first-child > section:first-child + section > div + div"), 1, { css: { top: 424, height: 0 } }, { css: { top: 340, height: 85 }, ease: Linear.easeNone }), startTime - 1);
	mainTimeline.insert(TweenLite.fromTo(window, 1, { info1Progress: 0 }, { info1Progress: 1, ease: Linear.easeNone, onUpdate: info1Update }), startTime - 1);
	mainTimeline.insert(function () { changeNav(2); }, startTime);
	navLabels.push(startTime);
	mainTimeline.insert(TweenLite.fromTo($("#sec3"), $("#sec3").height() / height, { css: { top: "0%" } }, { css: { top: "-" + 100 * ($("#sec3").height() / height) + "%" }, ease: Linear.easeNone }), startTime);

	//four
	stickyPoints.push(mainTimeline.duration());
	startTime = startTime + $("#sec3").height() / height;
	// stickyPoints.push(startTime-1);
	mainTimeline.insert(TweenLite.fromTo($("#sec4"), 1, { css: { top: "100%" } }, { css: { top: "0%" }, ease: Linear.easeNone }), startTime - 1);
	mainTimeline.insert(function () { changeNav(3); }, startTime);
	navLabels.push(startTime);
	mainTimeline.insert(TweenLite.fromTo($("#sec4"), $("#sec4").height() / height, { css: { top: "0%" } }, { css: { top: "-" + 100 * ($("#sec4").height() / height) + "%" }, ease: Linear.easeNone }), startTime);

	//five
	stickyPoints.push(mainTimeline.duration());
	startTime = startTime + $("#sec4").height() / height;
	// stickyPoints.push(startTime-1);
	mainTimeline.insert(TweenLite.fromTo($("#sec5"), 1, { css: { top: "100%" } }, { css: { top: "0%" }, ease: Linear.easeNone }), startTime - 1);
	mainTimeline.insert(function () { changeNav(4); }, startTime);
	navLabels.push(startTime);
	mainTimeline.insert(TweenLite.fromTo($("#sec5"), $("#sec5").height() / height, { css: { top: "0%" } }, { css: { top: "-" + 100 * ($("#sec5").height() / height) + "%" }, ease: Linear.easeNone }), startTime);

	//six
	stickyPoints.push(mainTimeline.duration());
	startTime = startTime + $("#sec5").height() / height;
	// stickyPoints.push(startTime-1);
	mainTimeline.insert(TweenLite.fromTo($("#sec6"), 1, { css: { top: "100%" } }, { css: { top: "0%" }, ease: Linear.easeNone }), startTime - 1);
	mainTimeline.insert(function () { changeNav(5); }, startTime);
	navLabels.push(startTime);
	mainTimeline.insert(TweenLite.fromTo($("#sec6"), ($("#sec7").height() + Math.max(0, $("#sec6").height() - height)) / height, { css: { top: "0%" } }, { css: { top: "-" + 100 * (($("#sec7").height() + Math.max(0, $("#sec6").height() - height)) / height) + "%" }, ease: Linear.easeNone }), startTime);

	//seven
	stickyPoints.push(mainTimeline.duration());
	startTime = startTime + $("#sec6").height() / height;
	// stickyPoints.push(startTime-1);
	mainTimeline.insert(TweenLite.fromTo($("#sec7"), $("#sec7").height() / height, { css: { top: "100%" } }, { css: { top: 100 - $("#sec7").height() / height * 100 + "%" }, ease: Linear.easeNone }), startTime - 1);

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
		if (privacyOpen)
			TweenLite.to(window, 0.5, { privacyScrollAmount: evt.keyCode == 38 ? Math.max(0, privacyScrollAmount - arrowAmount) : Math.min(1, privacyScrollAmount + arrowAmount), ease: Cubic.easeOut, onUpdate: scroll })
		if (termsOpen)
			TweenLite.to(window, 0.5, { termsScrollAmount: evt.keyCode == 38 ? Math.max(0, termsScrollAmount - arrowAmount) : Math.min(1, termsScrollAmount + arrowAmount), ease: Cubic.easeOut, onUpdate: scroll })
		else
			TweenLite.to(window, 0.5, { mainScrollAmount: evt.keyCode == 38 ? Math.max(0, mainScrollAmount - arrowAmount) : Math.min(1, mainScrollAmount + arrowAmount), ease: Cubic.easeOut, onUpdate: scroll })
	}
}

function scroll(delta) {
	var str;
	if (privacyOpen)
		str = "privacy";
	else if (termsOpen)
		str = "terms";
	else
		str = "main";
	if (typeof delta !== 'undefined')
		window[str + "ScrollAmount"] -= delta / (SCROLL_MULTIPLIER * window[str + "Timeline"].duration());
	if (window[str + "ScrollAmount"] < 0)
		window[str + "ScrollAmount"] = 0;
	else if (window[str + "ScrollAmount"] > 1)
		window[str + "ScrollAmount"] = 1;
	window[str + "Timeline"].progress(window[str + "ScrollAmount"]);
	if (typeof delta !== 'undefined')
		setStickyTimer();
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
			if (i == num) {
				TweenLite.to(carrot, 0.3, { css: { left: li.position().left + li.width() / 2 - carrot.width() / 2 }, ease: Cubic.easeInOut });
				TweenLite.to(a, 0.3, { css: { className: "selected" }, ease: Linear.easeNone });
			}
			else {
				TweenLite.to(a, 0.3, { css: { className: "-=selected" }, ease: Linear.easeNone });
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
	if (privacyOpen)
		onPrivacyClick();
	if (termsOpen)
		onTermsClick();
}

//section 2

function onPinProgress() {
	var progress = (pinImg - PIN_LOW) / (PIN_HIGH - PIN_LOW);
	var pinChildren = $("#pin > div");
	for (var i = 0; i < pinChildren.length; i++) {
		var child = $(pinChildren[i]);
		var dest = Math.floor(Math.min(progress, 0.999) * pinChildren.length) == i ? "visible" : "hidden";
		if (child.css("visibility") != dest)
			child.css("visibility", dest);
	}
}

function onSunshineMove() {
	var sunshine = $("#sec2 > div:first-child");
	sunshine.css("background-position", "center " + (-(1500 - height) / 2 - sunshine.position().top) + "px");
}

function initRing() {
	if (!ring) {
		ring = new Ring("#sec3 > div > section:first-child > section + section > canvas", { num: 85 });
		ring.execute();
	}
}

function info1Update() {
	$("#sec3 > div > section:first-child > section:first-child > img + p > strong").html(Math.round(10 * info1Progress) + "x");
	$("#sec3 > div > section:first-child > section:first-child > img + p + p > strong").html(MyText.addDecimalPlaces(58.3 * info1Progress, 1));
	$("#sec3 > div > section:first-child > section:first-child > img + p + p + p > strong:first-child").html("$" + MyText.addDecimalPlaces(8.2 * info1Progress, 1));

	var perPhone = 54.75 * info1Progress;
	if (perPhone % 0.1 == 0)
		perPhone += 0.001;
	perPhone = perPhone.toString();
	$("#perPhone .tens").html(perPhone.charAt(0));
	$("#perPhone .ones").html(perPhone.charAt(1));
	$("#perPhone .tenths").html(perPhone.charAt(3));
	$("#perPhone .hundredths").html(perPhone.charAt(4));

	$("#sec3 > div > section:first-child > section:first-child + section > img + p + p").html(Math.round(53 * info1Progress) + "%");

	var kWhr = (24000 * info1Progress).toString();
	$("#kWhr .tenThousand").html(kWhr.charAt(0));
	$("#kWhr .thousand").html(kWhr.charAt(1));
	$("#kWhr .hundred").html(kWhr.charAt(2));
	$("#kWhr .ten").html(kWhr.charAt(3));
	$("#kWhr .one").html(kWhr.charAt(4));
	if (ring)
		ring.percent(Math.round(info1Progress * 85));
}

//text areas
function onPrivacyClick(evt) {
	if (evt)
		evt.preventDefault();
	TweenLite.to($("#sec8"), 1, { css: { left: privacyOpen ? "100%" : 0 }, ease: Cubic.easeInOut });
	privacyOpen = !privacyOpen;
}

function onTermsClick(evt) {
	if (evt)
		evt.preventDefault();
	TweenLite.to($("#sec9"), 1, { css: { left: termsOpen ? "100%" : 0 }, ease: Cubic.easeInOut });
	termsOpen = !termsOpen;
}

function onCloseClick(evt) {
	if (evt)
		evt.preventDefault();
	if (termsOpen)
		onTermsClick();
	if (privacyOpen)
		onPrivacyClick();
}

//contact
function onSubmitContactClick(evt) {
	evt.preventDefault();
	var fullName = $("#sec5 > div > p + form > input:first-child").val();
	var email = $("#sec5 > div > p + form > input:first-child + input").val();
	var message = $("#sec5 > div > p + form > textarea").val();
	if (message != "") {
		alert('contact disabled');
	}
	$("#sec5 > div > p + form > input:first-child").val("");
	$("#sec5 > div > p + form > input:first-child + input").val("");
	$("#sec5 > div > p + form > textarea").val("");
}

function emailSent(evt) {
	// console.log("emailSent",evt);
}

function onSubmitNewsletterClick(evt) {
	evt.preventDefault();
	var email = $("#sec5 > div > form + form > input:first-child").val();
	if (email != "") {
		alert('sign up disabled')
	}
	$("#sec5 > div > form + form > input:first-child").val("");
}

//init

$(document).ready(init);
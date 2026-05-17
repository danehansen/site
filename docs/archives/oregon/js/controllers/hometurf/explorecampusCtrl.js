"use strict";

// this needs to be in the global scope
var mapActivated = false;

function explorecampusCtrl($scope)
{
	$scope.id="explorecampus";
	$scope.locations=[];
	$scope.locations.push({ 
		id: "autzen-field",
		image: "autzen-field.jpg",
		left: 2880,
		paragraph: "Autzen Stadium is the home field of our Oregon Ducks. Though official capacity is 54,000, attendance has exceeded capacity at every home game since 2002 and regularly reaches close to 60,000 fans. Autzen is notorious for its crowd noise and is consistently ranked among the nation's top venues to watch a college football game.",
		title: "Autzen Stadium",
		target: "_self",
		top: 610,
		url: "#!/footballhq/autzenstadium"
	});
	$scope.locations.push({ 
		id: "erb-memorial-union",
		image: "erb-memorial-union.jpg",
		left: 2582,
		paragraph: "The EMU has been the gathering place for campus activities and student life since 1950. Along with the renovation to the student rec center, the EMU will be undergoing a renovation that will result in a new EMU that is approximately 20% larger and utilizes space more efficiently. The new EMU will have expanded lounges and new study spaces, state of the art conference facilities, a performing arts hall, and a multi-purpose theater.",
		title: "Erb Memorial Union",
		target: "_blank",
		top: 1415,
		url: "http://emu.uoregon.edu"
	});
	$scope.locations.push({ 
		id: "hatfield-dowlin",
		image: "hatfield-dowlin-complex.jpg",
		left: 2782,
		paragraph: "The 145,000 square-foot Hatfield-Dowlin Complex houses the University of Oregon’s Football Operations Center. This innovative six-story facility features a 170-seat theater, a weight room, a cafeteria, a barbershop, locker rooms, lounges and more. The innovative football complex is unmatched by any facility in college sports.",
		target: "_self",
		title: "Hatfield-Dowlin Complex",
		top: 520,
		url: "#!/footballhq/facilities/explore"
	});
	$scope.locations.push({ 
		id: "hayward-field",
		image: "hayward-field.jpg",
		left: 2758,
		paragraph: "Historic Hayward Field looms as one of the world’s most famous track and field venues. Hayward field was initially constructed for football in 1919, but since has been used for track and field and has been home to more NCAA Outdoor Championships than any other venue in modern history. Hayward Field has been host to the past two Olympic trials in 2008 and 2012 as well as hosting the Olympic trials in 1972, 1976, and 1980.  The centerpiece of “Track Town, USA” includes a new track surface permanent lights, video board, and newly configured infield. ",
		title: "Hayward Field",
		target: "_blank",
		top: 1606,
		url: "http://www.eugenecascadescoast.org/university-oforegon/venues/hayward-field"
	});
	$scope.locations.push({ 
		id: "jaqua-academic-center",
		image: "jaqua-academic-center.jpg",
		left: 2849,
		paragraph: "Built in 2010, the John E. Jaqua Center is a 40,000 square foot, state-of-the-art academic learning center that accommodates student athletes here at the University of Oregon. The first floor includes a café, auditorium, and atrium that are open to the public. The Jaqua Center includes a 114 seat auditorium, 35 tutor rooms, 2 faculty/advising offices, conference room, flexible classroom, computer lab with 54 computer stations, graphics lab, 3 teaching labs, library, separate lounges for student athletes, tutors, and staff. ",
		title: "Jaqua Academic Center",
		target: "_self",
		top: 1399,
		url: "#!/academics"
	});
	$scope.locations.push({ 
		id: "jordan-schnitzer-moa",
		image: "jordan-schnitzer-moa.jpg",
		left: 2498,
		paragraph: "The only academic museum in Oregon accredited by the American Alliance of Museums, the University of Oregon’s Jordan Schnitzer Museum of Art features engaging exhibitions, significant collections of historic and contemporary art, and exciting educational programs that support the university’s academic mission as well as the diverse interests of its off-campus communities.",
		title: "Jordan Schnitzer Museum of Art",
		target: "_blank",
		top: 1487,
		url: "http://jsma.uoregon.edu"
	});
	$scope.locations.push({ 
		id: "knight-library",
		image: "knight-library.jpg",
		left: 2449,
		paragraph: "The Knight Library is the largest library facility in the state of Oregon. Renovations to the library have kept the building up to date and it has continued to be a daily hub of learning and research to the University’s more than 20,000 students.",
		title: "Knight Library",
		target: "_blank",
		top: 1566,
		url: "http://library.uoregon.edu/knight/index.html"
	});
	$scope.locations.push({ 
		id: "lewis-integrative-science-building",
		image: "lewis-integrative-science-building.jpg",
		left: 2760,
		paragraph: "Building on a proud tradition of interdisciplinary research at the University of Oregon, the Robert and Beverly Lewis Integrative Science Building, which opened in fall of 2012, is home to strategic research clusters centered around interdisciplinary and integrative research missions that are not defined by departmental boundaries. U of O biologists, chemists, psychologists and other researchers work alongside one another to tackle society’s grand challenges—from cellular processes to improving communities.",
		title: "Lewis Integrative Science Building",
		target: "_blank",
		top: 1354,
		url: "http://uoresearch.uoregon.edu/content/lewis-integrative-science-building-high-performance-hub-sciences"
	});
	$scope.locations.push({ 
		id: "lillis-business-complex",
		image: "lillis-business-complex.jpg",
		left: 2459,
		paragraph: "Lillis Hall opened in 2003 and was architecturally designed to facilitate and encourage interaction between students and faculty, and to maximize educational resources. These resources include: wired and wireless computing connectivity, audio-visual advances, innovative classroom designs, group work spaces, and ample informal seating and study areas. All of these resources make the Lillis Business Complex a superior learning environment. ",
		target: "_blank",
		title: "Lillis Business Complex",
		top: 1379,
		url: "http://lcb.uoregon.edu/App_Aspx/LcbLillis.aspx"
	});
	$scope.locations.push({ 
		id: "matt-arena",
		image: "matt-arena.jpg",
		left: 3016,
		paragraph: "Matthew Knight Arena seats over 12,300 people and is a multi-purpose arena that is home to the University’s basketball teams. The arena was named after Phil and Penny’s son, Matthew, who passed away at age 34. The arena opened in January of 2011 and has since been home to popular events like Cirque du Soleil, Tim McGraw, Macklemore, and the Professional Bull Riding Tour. ",
		title: "Matthew Knight Arena",
		target: "_blank",
		top: 1468,
		url: "http://www.matthewknightarena.com"
	});
	$scope.locations.push({ 
		id: "recreation-center",
		image: "recreation-center.jpg",
		left: 2652,
		paragraph: "The student rec center will be undergoing a renovation which began in August of 2013. There will be a new aquatics center that will include a 12 lane lap pool, leisure pool, and whirlpool spa.  A significant amount of space will be dedicated to weight training and cardio. Currently the rec center is home to multiple indoor and outdoor basketball courts, two weight rooms, multiple racquetball and pickleball courts, a 6 lane lap pool, and a variety of multi-purpose rooms. ",
		title: "Recreation Center",
		target: "_blank",
		top: 1574,
		url: "http://uorec.uoregon.edu"
	});
	$scope.locations.push({ 
		id: "thirteenth-street",
		image: "13th-street.jpg",
		left: 2364,
		paragraph: "13th Street goes straight through the heart of the University of Oregon Campus and features many assets to everyday student life. 13th street features two barber shops, a variety of food and coffee shops, multiple banks, clothing outfitters such as American Apparel, the campus bookstore, and a few bars and grills that are hubs of student activity. ",
		title: "13th Street",
		target: "_blank",
		top: 1413,
		url: "http://www.yelp.com/list/13th-street-of-faded-dreams-eugene"
	});
	var draggableMap;
	var exploreCampus = {};
	var currentPointOfInterest;
	var poiToTween;
	var theMapContainer;
	var titleCardButton;
	var render;
	var unfoldingBackground;
	var theMap = document.getElementById('the_map');
	var clickedThing;
	var diamondButtons;
	var closeButtons;

	$scope.init=function()
	{
		theMapContainer = document.getElementById('the_map');

		var windowWidth = window.innerWidth;
		var windowHeight = window.innerHeight;

		var mapWidth = 5388;
		var mapHeight = 3118;
		
		exploreCampus.x = ((mapWidth + 100) - windowWidth) / 2 * -1;
		exploreCampus.y = ((mapHeight - 100) - windowHeight) / 2 * -1;

		theMapContainer.style.left = exploreCampus.x + 'px';
		theMapContainer.style.top = exploreCampus.y + 'px';

		titleCardButton = document.querySelector('#explorecampus .titleCardButton');
	}

	$scope.activate=function()
	{
		TweenLite.to(titleCardButton, 0.8, { autoAlpha: 1, ease: Linear.easeNone, delay: 0.6 });
		titleCardButton.addEventListener("click", exploreClicked);

		render=new MyCanvas(document.querySelector("#"+$scope.id+" .unfoldingText canvas"));
		unfoldingBackground=new UnfoldingBackground(render.width(),render.height(),{onUpdate: draw},true);
		unfoldingBackground.writeTimeline();
		unfoldingBackground.timeline.play();
		
		TweenLite.to(document.querySelectorAll("#"+$scope.id+" h1"), 0.8, {autoAlpha:1, ease:Cubic.easeOut, delay:0.5, top:0});
		TweenLite.to(document.querySelectorAll("#"+$scope.id+" p"), 0.8, {autoAlpha:1, ease:Cubic.easeOut, delay:0.5, top:0});
		/* button here with fade in */

		MySounds.playLoop(LOOPS.explorecampus);
	}
	
	function draw()
	{
		render.context.clearRect(0,0,render.width(),render.height());
		render.context.drawImage(unfoldingBackground.canvas.canvas,0,0);
	}
	function mapClicked(evt)
	{
		if(evt.target.id == "the_map" && poiToTween)
		{
			TweenLite.to(poiToTween, 0.3, { autoAlpha: 0, ease: Cubic.easeIn, top: -217 });
			poiToTween = null;
			currentPointOfInterest = null;
		}
	}
	function mapGrabbed(evt)
	{
		var eleClass = evt.target.className;
		if(eleClass != 'map_poi_link' && eleClass != 'close_btn')
		{
			MyUtils.addClass(theMapContainer, 'active');
		}
	}
	function mapReleased(evt)
	{
		var eleClass = evt.target.className;
		MyUtils.removeClass(theMapContainer, 'active');
	}
	function exploreClicked(evt)
	{
		MySounds.play(FX.click);

		draggableMap = new Draggable(theMap, {zIndexBoost: false, type:"x,y", edgeResistance:0.85, bounds:document.getElementById("the_map_holder"), throwProps:true, resistance:9999, force3d:false, cursor: 'notavalidcursorvalue'});

		mapActivated = true;

		diamondButtons = document.querySelectorAll("#explorecampus .diamondButton");
		MyUtils.addEventListener(diamondButtons,'click',onDiamondClick);

		closeButtons = document.querySelectorAll("#explorecampus .close_btn");
		MyUtils.addEventListener(closeButtons,'click',onCloseLocationClick);

		theMapContainer.addEventListener("click", mapClicked);
		theMapContainer.addEventListener("mousedown", mapGrabbed);
		theMapContainer.addEventListener("mouseup", mapReleased);
		TweenLite.to(document.querySelector('#explorecampus .map_overlay'), 0.8, { autoAlpha: 0, ease: Linear.easeNone });
		titleCardButton.removeEventListener("click", exploreClicked);
	}
	function onDiamondClick(evt)
	{
		MySounds.play(FX.click);
		evt.preventDefault();

		if(currentPointOfInterest != evt.currentTarget)
		{
			if(poiToTween)
			{
				TweenLite.to(poiToTween, 0.3, { autoAlpha: 0, ease: Cubic.easeIn, top: -217 });
			}	
			currentPointOfInterest = evt.currentTarget;
			poiToTween = evt.currentTarget.nextElementSibling;
			TweenLite.to(poiToTween, 0.3, { autoAlpha: 1, ease: Cubic.easeOut, top: -241 });
		}	

	}
	function onCloseLocationClick(evt)
	{
		MySounds.play(FX.click);
		evt.preventDefault();
		TweenLite.to(poiToTween, 0.3, { autoAlpha: 0, ease: Cubic.easeIn, top: -217 });
		currentPointOfInterest = null;
		poiToTween = null;
	}
	$scope.deactivate=function()
	{
		if(draggableMap)
			draggableMap.disable();
		mapActivated = false;
		if(mapActivated)
		{
			
		MyUtils.removeEventListener(diamondButtons,'click',onDiamondClick);
		MyUtils.removeEventListener(closeButtons,'click',onCloseLocationClick);
		theMapContainer.removeEventListener("click", mapClicked);
		theMapContainer.removeEventListener("mousedown", mapGrabbed);
		theMapContainer.removeEventListener("mouseup", mapReleased);
		}
		titleCardButton.removeEventListener("click", exploreClicked);
		//remove all functionality/listeners to get ready for the transition out but dont do anything that effects the page visually
	}

	$scope.destroy=function()
	{
		//if there is anything left to do to free up memory do it here. not necessary though.
	}

	setCurrentScope($scope, $scope.id);
}
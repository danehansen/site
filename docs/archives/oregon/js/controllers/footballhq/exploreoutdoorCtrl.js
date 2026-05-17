"use strict";

function exploreoutdoorCtrl($scope)
{
	//call HotSpotsPage.instance.moveTo(decimal between 0 and 1) in console
	$scope.id="exploreoutdoor";
	$scope.xLoc="#!/footballhq/practicefields";
	$scope.path="img/sequence/practicefields/outdoor";
	$scope.totalImgs=232;
	$scope.hotspots=
	[
		{
			title:"Field Sizes",
			content:"Step out of the football complex and directly onto the practice fields, which include two 100-yard UBU artificial turf fields and an 80-yard natural grass turf field.",
			progress:0.066,
			positions:
			[
				{x:66.17,	y:69.80,	progress:0},
				{x:71.26,	y:70.30,	progress:0.09},
				{x:82.98,	y:71.10,	progress:0.237},
				{x:97.71,	y:73.29,	progress:0.359},
				{x:105.0,	y:74.29,	progress:0.396},
				{x:150.0,	y:74.29,	progress:1}
			]
		},
		{
			title:"Crowd Noise",
			content:"Crowd noise and music are pumped right on to the practice fields to simulate real game intensity.",
			progress:0.141,
			positions:
			[
				{x:34.00,	y:30.50,	progress:0},
				{x:37.89,	y:30.33,	progress:0.07},
				{x:44.57,	y:30.15,	progress:0.168},
				{x:68.33,	y:29.67,	progress:0.404},
				{x:80.33,	y:29.51,	progress:0.482},
				{x:96.56,	y:29.338,	progress:0.567},
				{x:102.56,	y:29.338,	progress:0.59},
				{x:150.0,	y:29.338,	progress:0.61},
				{x:150.0,	y:29.338,	progress:1}
			]
		},
		{
			title:"Cryo Access",
			content:"PracticeOutdoors_CryoChutes",
			progress:0.653,
			positions:
			[
				{x:-150,	y:56.26,	progress:0},
				{x:-3.0,	y:56.26,	progress:0.385},
				{x:3.09,	y:55.77,	progress:0.426},
				{x:31.86,	y:53.63,	progress:0.591},
				{x:65.88,	y:53.28,	progress:0.787},
				{x:81.9,	y:54.28,	progress:0.919},
				{x:88.5,	y:55.00,	progress:1}
			]
		},
		{
			title:"Mayan Pyramid",
			content:"Mayan style pyramids on the sideline of our practice field feature 5% and 3% graded inclines for intensified training.",
			progress:0.888,
			positions:
			[
				{x:-100,	y:67.00,	progress:0},
				{x:-100,	y:67.00,	progress:0.68},
				{x:-3.0,	y:67.60,	progress:0.7},
				{x:2.10,	y:67.60,	progress:0.73},
				{x:17.29,	y:65.00,	progress:0.803},
				{x:27.06,	y:63.30,	progress:0.88},
				{x:36.0,	y:63.00,	progress:1}
			]
		}
	];
	$scope.isText=HotSpotsPage.isText;
	$scope.isImg=HotSpotsPage.isImg;
	$scope.isVideo=HotSpotsPage.isVideo;
	$scope.hotspotsPage;
	$scope.timeout;
	$scope.pageTitle="Outdoor Practice Fields";
	var footballFacts = HotSpotsPage._FACTS;
	$scope.facts = MyMath.shuffle(footballFacts);
	
	$scope.hotspots.reverse();
	for(var i=0, iLen=$scope.hotspots.length; i<iLen; i++)
	{
		var hotspot=$scope.hotspots[i];
		hotspot.progress=1-hotspot.progress;
		hotspot.positions.reverse();
		for(var j=0, jLen=hotspot.positions.length; j<jLen; j++)
		{
			var position=hotspot.positions[j];
			position.progress=1-position.progress;
		}
	}

	$scope.init=function()
	{
	}

	$scope.activate=function()
	{
		if(document.querySelectorAll("#"+$scope.id+" .preloader").length>0)
		{
			$scope.hotspotsPage=new HotSpotsPage($scope.id, $scope.hotspots, $scope.path, $scope.totalImgs, $scope.xLoc, true);
		}
		else
		{
			setTimeout($scope.activate,10);
		}
		MySounds.playLoop(LOOPS.footballhq);
	}
	
	$scope.deactivate=function()
	{
		$scope.hotspotsPage.deactivate();
	}

	$scope.destroy=function()
	{
	}

	setCurrentScope($scope, $scope.id);
}
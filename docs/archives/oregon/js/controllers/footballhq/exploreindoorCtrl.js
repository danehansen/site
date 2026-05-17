"use strict";

function exploreindoorCtrl($scope)
{
	//call HotSpotsPage.instance.moveTo(decimal between 0 and 1) in console
	$scope.id="exploreindoor";
	$scope.xLoc="#!/footballhq/practicefields";
	$scope.path="img/sequence/practicefields/indoor";
	$scope.totalImgs=85;
	$scope.hotspots=
	[
		{
			title:"Ceiling Height",
			content:"70 feet tall at the highest point, the Moshofsky Center affords zero practice limitations.",
			progress:0.05,
			positions:
			[
				{x:48.70,	y:49.99,	progress:0},
				{x:48.70,	y:22.00,	progress:0.53},
				{x:48.70,	y:16.80,	progress:0.60},
				{x:48.70,	y:14.30,	progress:0.64},
				{x:48.70,	y:10.50,	progress:0.70},
				{x:48.70,	y:-10.0,	progress:1}
			]
		},
		{
			title:"Exterior",
			content:"PracticeIndoors_Exterior",
			progress:0.323,
			positions:
			[
				{x:59.3,	y:110.0,	progress:0},
				{x:59.3,	y:100.0,	progress:0.1},
				{x:59.3,	y:88.00,	progress:0.19},
				{x:59.3,	y:65.02,	progress:0.47},
				{x:59.3,	y:31.00,	progress:0.97},
				{x:59.3,	y:30.50,	progress:1}
			]
		},
		{
			title:"Climate Control",
			content:"Our indoor practice facilities feature full climate control to allow for simulated heat, humidity and wind to replicate the environment of upcoming road games.",
			progress:0.417,
			positions:
			[
				{x:24.00,	y:100.0,	progress:0},
				{x:24.00,	y:89.00,	progress:0.19},
				{x:24.00,	y:74.20,	progress:0.38},
				{x:24.00,	y:59.00,	progress:0.59},
				{x:24.00,	y:47.90,	progress:0.76},
				{x:24.00,	y:34.00,	progress:0.96},
				{x:24.00,	y:32.60,	progress:1}
			]
		},
		{
			title:"Motivation",
			content:"PracticeIndoors_Billboards",
			progress:0.615,
			positions:
			[
				{x:83.0,	y:105.0,	progress:0},
				{x:83.0,	y:93.90,	progress:0.2},
				{x:83.0,	y:87.30,	progress:0.31},
				{x:83.0,	y:81.30,	progress:0.38},
				{x:83.0,	y:79.40,	progress:0.4},
				{x:83.0,	y:50.00,	progress:0.84},
				{x:83.0,	y:43.10,	progress:0.93},
				{x:83.0,	y:40.13,	progress:1}
			]
		},
		{
			title:"Field Size",
			content:"The 117,000 square foot Moshofsky Center features a full 100-yard UBU artificial turf field, the same surface used in many NFL stadiums.",
			progress:0.784,
			positions:
			[
				{x:50.51,	y:150.0,	progress:0},
				{x:50.51,	y:150.0,	progress:0.323},
				{x:50.51,	y:105.01,	progress:0.333},
				{x:50.51,	y:103.01,	progress:0.353},
				{x:50.51,	y:101.01,	progress:0.373},
				{x:50.56,	y:97.87,	progress:0.410},
				{x:50.60,	y:95.00,	progress:0.441},
				{x:50.68,	y:63.68,	progress:0.892},
				{x:50.69,	y:60.25,	progress:0.934},
				{x:50.70,	y:57.40,	progress:1}
			]
		},
		{
			title:"Packed House",
			content:"Crowd noise and music are pumped in during practice to simulate real game intensity.",
			progress:0.895,
			positions:
			[
				{x:35.31,	y:150.0,	progress:0.53},
				{x:35.31,	y:103.2,	progress:0.541},
				{x:35.31,	y:99.20,	progress:0.587},
				{x:35.3,	y:94.20,	progress:0.64},
				{x:35.3,	y:94.00,	progress:0.68},
				{x:35.3,	y:86.50,	progress:0.75},
				{x:35.3,	y:85.80,	progress:0.77},
				{x:35.3,	y:74.10,	progress:0.93},
				{x:35.3,	y:71.00,	progress:1}
			]
		}
	];
	$scope.isText=HotSpotsPage.isText;
	$scope.isImg=HotSpotsPage.isImg;
	$scope.isVideo=HotSpotsPage.isVideo;
	$scope.hotspotsPage;
	$scope.timeout;
	$scope.pageTitle="Indoor Practice Field";
	var footballFacts = HotSpotsPage._FACTS;
	$scope.facts = MyMath.shuffle(footballFacts);

	$scope.init=function()
	{
	}

	$scope.activate=function()
	{
		if(document.querySelectorAll("#"+$scope.id+" .preloader").length>0)
			$scope.hotspotsPage=new HotSpotsPage($scope.id, $scope.hotspots, $scope.path, $scope.totalImgs, $scope.xLoc);
		else
			setTimeout($scope.activate,10);
		MySounds.playLoop(LOOPS.moshofsky);
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
"use strict";

function autzenstadiumexploreCtrl($scope)
{
	//call HotSpotsPage.instance.moveTo(decimal between 0 and 1) in console
	$scope.id="autzenstadiumexplore";
	$scope.xLoc="#!/footballhq/autzenstadium";
	$scope.path="img/sequence/autzenstadium";
	$scope.totalImgs=570;
	$scope.hotspots=
	[
		{
			title:"Phil’s Suite",
			content:"Autzen_PhilsSuite",
			progress:0.06,
			positions:
			[
				{x:49.5,	y:31.3,	progress:0.0},
				{x:38.6,	y:30.1,	progress:0.04},
				{x:23.48,	y:25.7,	progress:0.09},
				{x:18.4,	y:24.0,	progress:0.11},
				{x:9.30,	y:21.3,	progress:0.13},
				{x:-2.0,	y:16,	progress:0.16},
				{x:-100,	y:-100,	progress:0.2},
				{x:-100,	y:-100,	progress:0.2},
				{x: 150,	y:-100,	progress:0.81},
				{x: 102,	y:17.5,	progress:0.82},
				{x: 103,	y:17.9,	progress:0.87},
				{x: 68.1,	y:29,	progress:0.95},
				{x:53.0,	y:31.3,	progress:1}
			]
		},
		{
			title:"See The Crowd",
			content:"Autzen_CrowdVideo",
			progress:0.180,
			positions:
			[
				{x:150.0,	y:55,	progress:0.0},
				{x:150.0,	y:55,	progress:0.02},
				{x:103.2,	y:55,	progress:0.03},
				{x:99.7,	y:55,	progress:0.04},
				{x:90.7,	y:57.2,	progress:0.06},
				{x:79.14,	y:57.5,	progress:0.085},
				{x:71.2,	y:57.8,	progress:0.11},
				{x:67.0,	y:56.9,	progress:0.12},
				{x:63.2,	y:57.5,	progress:0.14},
				{x:56.0,	y:57.3,	progress:0.16},
				{x:29.8,	y:56.3,	progress:0.26},
				{x:19.9,	y:56,	progress:0.29},
				{x:12.6,	y:55.5,	progress:0.31},
				{x:0.70,	y:55.5,	progress:0.33},
				{x:-4.0,	y:55.5,	progress:0.34},
				{x:-100,	y:55.5,	progress:0.36},
				{x:-100,	y:57.2,	progress:1},
			]
		},
		{
			title:"Sound Off",
			content:"Autzen Stadium is notorious for its intimidating crowds, with decibel levels consistently approaching 130.",
			progress:0.352,
			positions:
			[
				{x:150.0,	y:56,	progress:0},
				{x:150,		y:55.7,	progress:0.19},
				{x:101,		y:56,	progress:0.2},
				{x:95.9,	y:56,	progress:0.21},
				{x:82.1,	y:56.3,	progress:0.24},
				{x:54.7,	y:57.2,	progress:0.33},
				{x:37.7,	y:56.7,	progress:0.39},
				{x:28.4,	y:56.4,	progress:0.42},
				{x:16.7,	y:55.2,	progress:0.45},
				{x:7.00,	y:54.1,	progress:0.469},
				{x:1.00,	y:54,	progress:0.48},
				{x:-1.6,	y:53,	progress:0.485},
				{x:-100,	y:-100,	progress:0.49},
				{x:-100,	y:56,	progress:1}
			]
		},
		{
			title:"Capacity",
			content:"Considered one of the most intimidating college football stadiums in the nation, the Ducks often draw nearly 60,000 fans to their home games.",
			progress:0.684,
			positions:
			[
				{x:150.0,	y:55,	progress:0},
				{x:150.0,	y:54.5,	progress:0.53},
				{x:103.0,	y:54.5,	progress:0.54},
				{x:102.0,	y:54.5,	progress:0.55},
				{x:94.0,	y:55,	progress:0.56},
				{x:63.5,	y:55.6,	progress:0.64},
				{x:24.0,	y:55.4,	progress:0.77},
				{x:17.8,	y:55.3,	progress:0.79},
				{x:8.84,	y:55.3,	progress:0.8},
				{x:-1.00,	y:54,	progress:0.82},
				{x:-100,	y:54,	progress:1},
			]
		},
		{
			title:"Packed House",
			content:"Oregon fans come out in force, with our current home sellout streak approaching 100 straight games.",
			progress:0.851,
			positions:
			[
				{x:150.0,	y:55,	progress:0},
				{x:150.0,	y:55.8,	progress:0.69},
				{x:102.5,	y:55.8,	progress:0.70},
				{x:99.5,	y:55.8,	progress:0.71},
				{x:97.6,	y:56,	progress:0.72},
				{x:87.1,	y:56.2,	progress:0.74},
				{x:67.3,	y:57.2,	progress:0.79},
				{x:28.4,	y:56.7,	progress:0.91},
				{x:13.22,	y:55.2,	progress:0.945},
				{x:5.35,	y:54,	progress:0.96},
				{x:-1.0,	y:53,	progress:0.97},
				{x:-150.0,	y:55,	progress:1},
			]
		}
	];
	$scope.isText=HotSpotsPage.isText;
	$scope.isImg=HotSpotsPage.isImg;
	$scope.isVideo=HotSpotsPage.isVideo;
	$scope.timeout;
	$scope.pageTitle="Autzen Stadium";
	var footballFacts = HotSpotsPage._FACTS;
	$scope.facts = MyMath.shuffle(footballFacts);

	$scope.init=function()
	{
	}

	$scope.activate=function()
	{
		if(document.querySelectorAll("#"+$scope.id+" .preloader").length>0)
			$scope.hotspotsPage=new HotSpotsPage($scope.id, $scope.hotspots, $scope.path, $scope.totalImgs, $scope.xLoc, false, true);
		else
			setTimeout($scope.activate,10);
		MySounds.playLoop(LOOPS.autzen);
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
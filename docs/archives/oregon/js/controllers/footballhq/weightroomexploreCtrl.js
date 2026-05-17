"use strict";

function weightroomexploreCtrl($scope)
{
	//call HotSpotsPage.instance.moveTo(decimal between 0 and 1) in console
	$scope.id="weightroomexplore";
	$scope.xLoc="#!/footballhq/weightroom";
	$scope.path="img/sequence/weightroom";
	$scope.totalImgs=247;
	$scope.hotspots=
	[
		{
			title:"Field Proximity",
			content:"WeightRoom_Proximity",
			progress:0.208,
			positions:
			[
				{x:47.3,	y:23.5,	progress:0},
				{x:74.6,	y:24.54,	progress:0.508},
				{x:83.06,	y:27.17,	progress:0.644},
				{x:93.43,	y:35.67,	progress:0.858},
				{x:98,		y:39.5,	progress:1}
			]
		},
		{
			title:"Flooring",
			content:"WeightRoom_Wood",
			progress:0.545,
			positions:
			[
				{x:35.31,	y:52.5,	progress:0},
				{x:46.75,	y:49.27,	progress:0.264},
				{x:61.27,	y:50.9,	progress:0.6},
				{x:64.46,	y:51.54,	progress:0.64},
				{x:72.5,	y:64.13,	progress:0.89},
				{x:75.2,		y:66.5,	progress:1}
			]
		},
		{
			title:"Weights",
			content:"WeightRoom_Rack",
			progress:0.714,
			positions:
			[
				{x:1.7,		y:77.1,	progress:0},
				{x:4.2,		y:72.6,	progress:0.1},
				{x:8.1,		y:68.8,	progress:0.2},
				{x:10.0,	y:67.2,	progress:0.25},
				{x:15.1,	y:63.2,	progress:0.4},
				{x:18.8,	y:60.7,	progress:0.5},
				{x:23.4,	y:59.0,	progress:0.6},
				{x:27.3,	y:61.7,	progress:0.7},
				{x:29.0,	y:63.4,	progress:0.75},
				{x:30.5,	y:64.4,	progress:0.8},
				{x:33.5,	y:64.0,	progress:0.9},
				{x:35.8,	y:62.7,	progress:1}
			]
		},
		{
			title:"Track",
			content:"WeightRoom_Track",
			progress:0.890,
			positions:
			[
				{x:-100,	y:0,	progress:0},
				{x:-3,	y:11.6,	progress:0.28},
				{x:2.8,	y:11.6,	progress:0.338},
				{x:22.6,	y:8.99,	progress:0.604},
				{x:41.74,	y:21,	progress:0.915},
				{x:46,		y:21.5,	progress:1}
			]
		}
	];
	$scope.isText=HotSpotsPage.isText;
	$scope.isImg=HotSpotsPage.isImg;
	$scope.isVideo=HotSpotsPage.isVideo;
	$scope.hotspotsPage;
	$scope.timeout;
	$scope.pageTitle="Weight Room";
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
		MySounds.playLoop(LOOPS.weightroom);
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
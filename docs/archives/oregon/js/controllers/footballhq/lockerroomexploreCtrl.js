"use strict";

function lockerroomexploreCtrl($scope)
{
	//call HotSpotsPage.instance.moveTo(decimal between 0 and 1) in console
	//HotSpotsPage.instance.moveTo(0.1)
	$scope.id="lockerroomexplore";
	$scope.xLoc="#!/footballhq/lockerroom";
	$scope.path="img/sequence/lockerroom";
	$scope.totalImgs=277;
	$scope.hotspots=
	[
		{
			title:"Locker Access",
			content:"LockerRoom_Ipad",
			progress:0.184,
			positions:
			[
				{x:44.5,	y:37.4,	progress:0},
				{x:46.3,	y:35.8,	progress:0.075},
				{x:50.1,	y:33.5,	progress:0.171},
				{x:56.2,	y:31.7,	progress:0.249},
				{x:63.4,	y:27.4,	progress:0.329},
				{x:70.0,	y:23.2,	progress:0.384},
				{x:79.0,	y:18.1,	progress:0.428},
				{x:85.53,	y:16.7,	progress:0.457},
				{x:103.0,	y:12.7,	progress:0.496},
				{x:103.0,	y:12.7,	progress:0.5},
				{x:150.0,	y:30,	progress:1}
			]
		},
		{
			title:"Barber Shop",
			content:"LockerRoom_BarberShop",
			progress:0.545,
			positions:
			[
				{x:38.5,	y:55.6,	progress:0},
				{x:38.18,	y:55.6,	progress:0.02},
				{x:35.42,	y:55.6,	progress:0.12},
				{x:35.16,	y:55.73,progress:0.135},
				{x:34.9,	y:55.73,progress:0.152},
				{x:29.14,	y:56.2,	progress:0.53},
				{x:27.5,	y:56.2,	progress:0.59},
				{x:20.39,	y:56.2,	progress:0.66},
				{x:14.8,	y:56.2,	progress:0.7},
				{x:2.00,	y:58,	progress:0.76},
				{x:-2.0,	y:58,	progress:0.776},
				{x:-100,	y:58,	progress:0.8},
				{x:-100,	y:58,	progress:1}
			]
		},
		{
			title:"Open Locker",
			content:"LockerRoom_LockerOpening",
			progress:0.812,
			positions:
			[
				{x:150.0,	y:41,	progress:0},
				{x:103.0,	y:41,	progress:0.643},
				{x:98.64,	y:41,	progress:0.644},
				{x:95.16,	y:41,	progress:0.665},
				{x:77.67,	y:42,	progress:0.765},
				{x:63.72,	y:39,	progress:0.846},
				{x:54.24,	y:38,	progress:1}
			]
		},
		{
			title:"Lounge Area",
			content:"/img/lockerroom/LockerRoom_Lounge.jpg",
			progress:0.89,
			positions:
			[
				{x:150.0,	y:0,	progress:0},
				{x:101.52,	y:49.6,	progress:0.736},
				{x:97.5,	y:49.6,	progress:0.748},
				{x:87.78,	y:49.6,	progress:0.789},
				{x:81.92,	y:49.6,	progress:0.830},
				{x:77.5,	y:49.6,	progress:0.882},
				{x:69.8,	y:50.1,	progress:1}
			]
		},
		{
			title:"Bathrooms",
			content:"LockerRoom_Bathroom",
			progress:0.925,
			positions:
			[
				{x:150.0,	y:58.50,	progress:0},
				{x:150.0,	y:58.50,	progress:0.76},
				{x:100.52,	y:58.50,	progress:0.786},
				{x:97.5,	y:58.90,	progress:0.796},
				{x:91.9,	y:58.80,	progress:0.83},
				{x:88.27,	y:59.00,	progress:0.856},
				{x:84.61,	y:59.00,	progress:0.896},
				{x:76.8,	y:59.00,	progress:1}
			]
		},
		{
			title:"Showers",
			content:"LockerRoom_Shower",
			progress:0.96,
			positions:
			[
				{x:150.0,	y:0,	progress:0},
				{x:150.0,	y:0,	progress:0.76},
				{x:101.32,	y:44.5,	progress:0.786},
				{x:98.3,	y:44,	progress:0.796},
				{x:92.7,	y:44.8,	progress:0.83},
				{x:89.07,	y:45,	progress:0.856},
				{x:85.41,	y:45,	progress:0.896},
				{x:78.00,	y:45,	progress:1}
			]
		}	
	];
	$scope.isText=HotSpotsPage.isText;
	$scope.isImg=HotSpotsPage.isImg;
	$scope.isVideo=HotSpotsPage.isVideo;
	$scope.hotspotsPage;
	$scope.timeout;
	$scope.pageTitle="Locker Room";
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
		MySounds.playLoop(LOOPS.lockerroom);
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
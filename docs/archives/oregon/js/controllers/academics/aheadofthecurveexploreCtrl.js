"use strict";

function aheadofthecurveexploreCtrl($scope)
{
	//call HotSpotsPage.instance.moveTo(decimal between 0 and 1) in console
	
	$scope.id="aheadofthecurveexplore";
	$scope.xLoc="#!/academics/aheadofthecurve";
	$scope.path="img/sequence/aheadofthecurve";
	$scope.totalImgs=549;
	$scope.hotspots=
	[
		{
			title:"Tech Support",
			content:"Jaqua_ItStaff",
			progress:0,
			positions:
			[
				{x:81.44,	y:42.00,	progress:0},
				{x:98.00,	y:41.96,	progress:0.038},
				{x:102.0,	y:41.96,	progress:0.055},
				{x:150.0,	y:41.96,	progress:0.06},
				{x:150.0,	y:42.00,	progress:1}
			]
		},
		{
			title:"Cafe",
			content:"Jaqua_RobinsNest",
			progress:0.006,
			positions:
			[
				{x:80.5,	y:65.60,	progress:0.0},
				{x:89.68,	y:66.29,	progress:0.02},
				{x:99.20,	y:67.40,	progress:0.05},
				{x:102.0,	y:67.40,	progress:0.07},
				{x:150.0,	y:67.40,	progress:0.08},
				{x:150.0,	y:71.99,	progress:1}
			]
		},
		{
			title:"Frosh Hall",
			content:"Jaqua_FroshHall",
			progress:0.03,
			positions:
			[
				{x:70.0,	y:44.00,	progress:0.0},
				{x:78.15,	y:42.60,	progress:0.02},
				{x:86.00,	y:42.52,	progress:0.051},
				{x:98.36,	y:42.42,	progress:0.088},
				{x:102.0,	y:40.23,	progress:0.10},
				{x:150.0,	y:32.00,	progress:1}
			]
		},
		{
			title:"Signage",
			content:"Jaqua_Signage",
			progress:0.221,
			positions:
			[
				{x:13.0,	y:38.00,	progress:0.0},
				{x:21.2,	y:36.72,	progress:0.026},
				{x:24.09,	y:35.87,	progress:0.052},
				{x:30.35,	y:34.73,	progress:0.088},
				{x:31.92,	y:32.79,	progress:0.108},
				{x:28.83,	y:29.05,	progress:0.143},
				{x:28.19,	y:28.82,	progress:0.188},
				{x:21.05,	y:27.21,	progress:0.304},
				{x:8.72,	y:30.02,	progress:0.372},
				{x:0.03,	y:24.52,	progress:0.457},
				{x:-1.6,	y:24.52,	progress:0.474},
				{x:-6.0,	y:24.52,	progress:0.49},
				{x:-100.0,	y:24.52,	progress:0.51},
				{x:-3.0,	y:20.52,	progress:0.81},
				{x:-1.50,	y:20.52,	progress:0.818},
				{x:7.57,	y:26.00,	progress:0.910},
				{x:10.82,	y:24.02,	progress:0.949},
				{x:12.8,	y:19.50,	progress:1.000}
			]
		},
		{
			title:"Lounge",
			content:"Jaqua_Lounge",
			progress:0.530,
			positions:
			[
				{x:53.0,	y:71.00,	progress:0.0},
				{x:58.73,	y:71.00,	progress:0.018},
				{x:73.16,	y:72.50,	progress:0.088},
				{x:76.3,	y:71.00,	progress:0.11},
				{x:75.11,	y:68.47,	progress:0.137},
				{x:83.10,	y:71.10,	progress:0.278},
				{x:82.36,	y:74.74,	progress:0.317},
				{x:75.56,	y:75.62,	progress:0.387},
				{x:67.41,	y:70.80,	progress:0.5},
				{x:49.56,	y:63.87,	progress:0.66},
				{x:44.87,	y:62.55,	progress:0.74},
				{x:37.90,	y:66.47,	progress:0.914},
				{x:38.00,	y:54.00,	progress:1.0}
			]
		},
		{
			title:"Study Rooms",
			content:"Jaqua_StudyRoom",
			progress:0.682,
			positions:
			[
				{x:55.52,	y:41.00,	progress:0},
				{x:64.03,	y:41.00,	progress:0.026},
				{x:79.66,	y:39.00,	progress:0.106},
				{x:79.33,	y:34.97,	progress:0.144},
				{x:84.66,	y:34.00,	progress:0.200},
				{x:88.51,	y:34.51,	progress:0.294},
				{x:87.94,	y:34.59,	progress:0.309},
				{x:81.24,	y:36.24,	progress:0.364},
				{x:78.03,	y:35.50,	progress:0.404},
				{x:68.07,	y:28.50,	progress:0.513},
				{x:48.65,	y:20.00,	progress:0.650},
				{x:40.04,	y:20.00,	progress:0.742},
				{x:36.91,	y:23.86,	progress:0.819},
				{x:34.03,	y:31.20,	progress:0.889},
				{x:33.32,	y:30.84,	progress:0.923},
				{x:33.74,	y:26.60,	progress:0.971},
				{x:32.52,	y:23.00,	progress:1}
			]
		},
		{
			title:"Reader Board",
			content:"Jaqua_Readerboard",
			progress:0.835,
			positions:
			[
				{x:150.0,	y:90.00,	progress:0},
				{x:109.0,	y:82.10,	progress:0.30},
				{x:104.0,	y:82.10,	progress:0.32},
				{x:102.0,	y:82.10,	progress:0.34},
				{x:100.0,	y:82.10,	progress:0.37},
				{x:97.9,	y:84.10,	progress:0.39},
				{x:95.0,	y:82.50,	progress:0.48},
				{x:83.3,	y:79.40,	progress:0.62},
				{x:80.43,	y:79.40,	progress:0.656},
				{x:73.0,	y:87.00,	progress:0.8},
				{x:68.0,	y:93.00,	progress:0.86},
				{x:66.4,	y:95.00,	progress:0.88},
				{x:64.82,	y:95.00,	progress:0.9},
				{x:62.0,	y:91.77,	progress:0.94},
				{x:58.0,	y:82.00,	progress:1}
			]
		},
		{
			title:"Conference Room",
			content:"Jaqua_ConferenceRoom",
			progress:0.922,
			positions:
			[
				{x:46.57,	y:150,		progress:0.0},
				{x:46.57,	y:150,		progress:0.858},
				{x:46.57,	y:103.13,	progress:0.859},
				{x:43.40,	y:98.54,	progress:0.895},
				{x:42.40,	y:99.00,	progress:0.89},
				{x:41.95,	y:97.02,	progress:0.91},
				{x:40.75,	y:94.64,	progress:0.93},
				{x:39.00,	y:79.60,	progress:1.0}
			]
		},
		{
			title:"Classroom",
			content:"Jaqua_Classrooms",
			progress:0.964,
			positions:
			[
				{x:-150.0,	y:70.40,	progress:0},
				{x:-150.0,	y:71.40,	progress:0.77},
				{x:-2.0,	y:71.40,	progress:0.792},
				{x:0.00,	y:67.60,	progress:0.81},
				{x:2.75,	y:67.60,	progress:0.827},
				{x:6.82,	y:68.75,	progress:0.893},
				{x:8.00,	y:68.00,	progress:0.91},
				{x:13.8,	y:59.20,	progress:0.971},
				{x:14.6,	y:53.50,	progress:1}
			]
		},
		{
			title:"Lobby",
			content:"Jaqua_BottomFloor",
			progress:0.986,
			positions:
			[
				{x:87.44,	y:150.00,	progress:0},
				{x:32.10,	y:150.00,	progress:0.937},
				{x:32.10,	y:103.26,	progress:0.947},
				{x:31.40,	y:100.51,	progress:0.959},
				{x:30.99,	y:100.66,	progress:0.966},
				{x:29.01,	y:90.00,	progress:1},
			]
		}
	];
	$scope.isText=HotSpotsPage.isText;
	$scope.isImg=HotSpotsPage.isImg;
	$scope.isVideo=HotSpotsPage.isVideo;
	$scope.hotspotsPage;
	$scope.timeout;
	$scope.pageTitle="Jaqua Interior";
	var academicFacts = HotSpotsPage._ACADEMIC_FACTS;
	$scope.facts = MyMath.shuffle(academicFacts);

	$scope.init=function()
	{
	}

	$scope.activate=function()
	{
		if(document.querySelectorAll("#"+$scope.id+" .preloader").length>0)
			$scope.hotspotsPage=new HotSpotsPage($scope.id, $scope.hotspots, $scope.path, $scope.totalImgs, $scope.xLoc);
		else
			setTimeout($scope.activate,10);
		MySounds.playLoop(LOOPS.aheadofthecurve);
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

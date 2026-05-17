"use strict";

function treatmentcenterexploreCtrl($scope)
{
	$scope.id="treatmentcenterexplore";
	$scope.imgPath="img/treatmentcenter/";
	$scope.xLoc="#!/footballhq/treatmentcenter";
	$scope.videos=true;
	$scope.vidPath="vid/treatmentcenter/";
	$scope.items=
	[
		{
			title:"Tape Benches",
			assetName:"TapeBench",
			copy:"Our tape benches are located between the locker room and showers for easy athlete access."
		},
		{
			title:"Underwater<br/>Treadmills",
			assetName:"UnderwaterTreadmill",
			copy:'Equipped with underwater cameras to track and display an athlete’s range of motion, our submerged treadmills dramatically reduce injury recovery time.'
		},
		{
			title:"Cryo Chutes",
			assetName:"CryoChute",
			copy:"Our cryo chutes leverage a cold water system to rid the body of metabolic waste products. A method dating back to Roman times, their use has been shown to alleviate soreness and accelerate recovery."
		},
		{
			title:"Health Care",
			assetName:"MedicalRoom",
			copy:"Within our treatment center athletes have convenient access to our full-service pharmacy, dentist, and optometrist, ensuring all health care needs are taken care of."
		}
	];
	var gallery;

	$scope.init=function()
	{
		var vidLocs=[];
		for(var i=0, iLen=$scope.items.length; i<iLen; i++)
		{
			vidLocs.push($scope.vidPath+$scope.items[i].assetName+vidExt());
		}
		gallery=new Gallery($scope.id, $scope.xLoc, vidLocs);		
	}

	$scope.activate=function()
	{
		gallery.activate();
		MySounds.playLoop(LOOPS.footballhq);
	}

	$scope.deactivate=function()
	{
		gallery.deactivate();
	}

	$scope.destroy=function()
	{
	}

	setCurrentScope($scope, $scope.id);
}
"use strict";

function treatmentcenterCtrl($scope)
{
	$scope.id="treatmentcenter";
	var titleCard;

	$scope.init=function()
	{
		titleCard=new TitleCard(document.querySelector("#"+$scope.id+" .titleCard"));
	}

	$scope.activate=function()
	{
		titleCard.play();
		MySounds.playLoop(LOOPS.footballhq);
	}

	$scope.deactivate=function()
	{
		titleCard.deactivate();
	}

	$scope.destroy=function()
	{
	}

	setCurrentScope($scope, $scope.id);
}
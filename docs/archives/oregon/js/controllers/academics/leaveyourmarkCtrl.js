"use strict";

function leaveyourmarkCtrl($scope)
{
	$scope.id="leaveyourmark";
	var titleCard;

	$scope.init=function()
	{
		titleCard=new TitleCard(document.querySelector("#"+$scope.id+" .titleCard"));
	}

	$scope.activate=function()
	{
		titleCard.play();
		MySounds.playLoop(LOOPS.academics);
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
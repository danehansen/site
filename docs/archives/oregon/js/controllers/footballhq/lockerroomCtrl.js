"use strict";

function lockerroomCtrl($scope)
{
	$scope.id="lockerroom";
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
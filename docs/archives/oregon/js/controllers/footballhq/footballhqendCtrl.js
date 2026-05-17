"use strict";

function footballhqendCtrl($scope)
{
	$scope.id="footballhqend";
	var endPage;

	$scope.init=function()
	{
		endPage=new EndPage($scope.id);		
	}

	$scope.activate=function()
	{
		endPage.activate();
		MySounds.playLoop(LOOPS.footballhq);
	}

	$scope.deactivate=function()
	{
		endPage.deactivate();
	}

	$scope.destroy=function()
	{
	}

	setCurrentScope($scope, $scope.id);
}
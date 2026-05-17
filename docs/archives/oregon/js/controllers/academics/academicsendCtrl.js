"use strict";

function academicsendCtrl($scope)
{
	$scope.id="academicsend";
	var endPage;

	$scope.init=function()
	{
		endPage=new EndPage($scope.id);		
	}

	$scope.activate=function()
	{
		endPage.activate();
		MySounds.playLoop(LOOPS.academics);
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
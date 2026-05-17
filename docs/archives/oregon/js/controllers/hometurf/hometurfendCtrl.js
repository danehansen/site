"use strict";

function hometurfendCtrl($scope)
{
	$scope.id="hometurfend";
	var endPage;

	$scope.init=function()
	{
		endPage=new EndPage($scope.id);		
	}

	$scope.activate=function()
	{
		endPage.activate();
		MySounds.playLoop(LOOPS.hometurf);
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
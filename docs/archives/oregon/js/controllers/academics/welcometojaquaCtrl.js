"use strict";

function welcometojaquaCtrl($scope)
{
	$scope.id="welcometojaqua";
	var page;

	$scope.init=function()
	{
		page=new UnfoldingTextPage($scope.id);
	}

	$scope.activate=function()
	{
		page.activate();
		MySounds.playLoop(LOOPS.academics);
	}

	$scope.deactivate=function()
	{
		page.deactivate();
	}

	$scope.destroy=function()
	{
	}

	setCurrentScope($scope, $scope.id);
}
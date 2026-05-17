"use strict";

function leaveyourmarkexploreCtrl($scope)
{
	$scope.id="leaveyourmarkexplore";
	$scope.xLoc="#!/academics/leaveyourmark";
	$scope.imgPath="img/leaveyourmark/";
	$scope.videos=false;
	$scope.items=
	[
		{
			title:"Just did it",
			assetName:"JustDidIt",
			copy:"The “A Few Who Just Did It” wall celebrates former Oregon Ducks whose post-graduate achievements transcend the realm of sports. 8x8” oak engravings immortalize everyone from Ann Bancroft to Phil Knight."
		},
		{
			title:"statuesque",
			assetName:"EmeraldHigdon",
			copy:'Recently redesigned by Spanish sculptor Rosa Serra, the Emerald, Higdon, and Jackson awards are the most prestigious in the athletic department. They are awarded annually to students for their accomplishments both in sports and in the community. Winners are enshrined on this wall with name and trophy.'
		},
		{
			title:"all academics",
			assetName:"WallColors",
			copy:"Oregon athletes named to the Pac-12 All-Academic team are commemorated on this sandblasted and color coded glass wall."
		},
		{
			title:"floor engraving",
			assetName:"AcademicAllAmerican",
			copy:"Every Academic All-American honoree is commemorated with their name engraved into the floor of the Jaqua Center’s main lobby."
		},
		{
			title:"letterman staircase",
			assetName:"LettermanStaircase",
			copy:"Located in a private entrance near the back of the building, the walls of this staircase are filled with the names of the more than 4,000 lettermen who’ve graduated since 1945."
		},
		{
			title:"chi alpha sigma",
			assetName:"Bench",
			copy:"Inscribed on this bench are the names of every Oregon athlete recognized by Chi Alpha Sigma—a national honor society for student athletes."
		},
		{
			title:"National<br/>Academic Awards",
			assetName:"FloorLights",
			copy:"These floor panels highlight notable national academic awards earned by University of Oregon student athletes, including the prestigious National Football Foundation Scholar-Athlete Award."
		}
	];
	var gallery;

	$scope.init=function()
	{
		gallery=new Gallery($scope.id, $scope.xLoc);		
	}

	$scope.activate=function()
	{
		gallery.activate();
		MySounds.playLoop(LOOPS.academics);
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
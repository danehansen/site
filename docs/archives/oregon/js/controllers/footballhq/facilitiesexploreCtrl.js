"use strict";

function facilitiesexploreCtrl($scope)
{
	$scope.id="facilitiesexplore";
	$scope.imgPath="img/facilities/";
	$scope.xLoc="#!/footballhq/facilities";
	$scope.videos=true;
	$scope.vidPath="vid/facilities/";
	$scope.items=
	[
		{
			title:"Hatfield Dowlin",
			assetName:"HatfieldDowlin",
			copy:"The 145,000 square-foot Hatfield-Dowlin Complex houses the University of Oregon’s Football Operations Center. This groundbreaking, six-story facility features a 170-seat theater, a weight room, a cafeteria, a barbershop, locker rooms, lounges, and more. It’s an innovative football complex that’s entirely unmatched by any facility in college sports."
		},
		{
			title:"Football Lobby",
			assetName:"Lobby",
			copy:'Featuring 64 x 55" interconnected TV screens that can project a single image or 64 individual feeds, as well as the same 3-D sound used in the Pro Football Hall of Fame—our lobby was built to inspire.'
		},
		{
			title:"Media Room",
			assetName:"MediaRoom",
			copy:"Designed to capture high quality media footage during postgame and press conferences, our media room features Nike Football leather-wrapped walls and a player area for conducting one-on-one interviews."
		},
		{
			title:"Player Lounge",
			assetName:"PlayersLounge",
			copy:'With four 55” TVs, two gaming walls and custom pool and foosball tables–the player lounge is a great place to take a break and hang out with friends.'
		},
		{
			title:"Theater",
			assetName:"Theater",
			copy:"Our theater seats up to 170 players and personnel, and features Ferrari leather upholstered and climate controlled seats for the ultimate game tape viewing experience."
		},
		{
			title:"Skybridge",
			assetName:"Skybridge",
			copy:"Our Skybridge installation features a formation of flying ducks, each of which represents a former player drafted into the NFL."
		},
		{
			title:"Cafeteria",
			assetName:"Cafeteria",
			copy:"With a full service salad bar, an athlete performance focused menu and a to-go refrigerator, our cafeteria was designed to accommodate players’ dietary needs and busy schedules."
		},
		{
			title:"Dining Room",
			assetName:"DiningRoom",
			copy:'Our dining area contains seating for 200+ players and personnel, family-style walnut tables and booths, and a total of six 55" TVs.'
		},
		{
			title:"Barbershop",
			assetName:"BarberShop",
			copy:"Staffed by a local barber for onsite haircuts, our barbershop features a custom-built barber’s chair and a mirrored wall with a recessed TV."
		},
		{
			title:"Ring Room",
			assetName:"RingRoom",
			copy:"Built in the shape of the Oregon ‘O’ and fitted with 3D sound, our ring room is home to our Bowl and Championship rings."
		},
		{
			title:"Family Lounge",
			assetName:"FamilyLounge",
			copy:'Our family lounge is designed to be a space where visiting families can relax comfortably. The lounge features floor-to-ceiling laser engraved walnut paneling, leather couches, two 55” TVs and hand-woven Nepalese rugs.'
		},
		{
			title:"Trophy Case",
			assetName:"TrophyCase",
			copy:"From our first Rose Bowl victory in 1917 to our most recent BCS Bowl triumph in 2013, this is home to our most prestigious hardware."
		},
		{
			title:"Scout Room",
			assetName:"ScoutRoom",
			copy:"Our scout room provides professional  scouts a dedicated space with access to practice and game archive footage."
		},
		{
			title:"Player<br/>Meeting Rooms",
			assetName:"PlayersMeetingRoom",
			copy:'Featuring a 90" TV screen, Axion Cognitive Development monitors and magnetic writable surfaces, our player meeting rooms set-up our success on both sides of the ball.'
		},
		{
			title:"Maquettes",
			assetName:"MiniMannequins",
			copy:"Our history of Oregon Football uniforms exhibit displays miniature statuettes outfitted in game gear dating from 1894 to present."
		},
		{
			title:"The Eternal Flame",
			assetName:"Torch",
			copy:"The eternal flame outside the Hatfield-Dowlin complex represents the athletes from the past, future, and present."
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
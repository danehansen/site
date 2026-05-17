"use strict";

function amenitiesCtrl($scope)
{
	$scope.id="amenities";
	$scope.items=
	[
		{
			title:"laptops",
			greenImg:"img/amenities/laptop_green.png",
			grayImg:"img/amenities/laptop_gray.png",
			video:"vid/amenities/laptop",
			copy:"All athletes are issued their own MacBook Pro laptop computer, leather carrying case and iPad all custom etched with the Oregon ‘O’."
		},
		{
			title:"computer labs",
			greenImg:"img/amenities/computer_green.png",
			grayImg:"img/amenities/computer_gray.png",
			video:"vid/amenities/computer_lab",
			copy:"The Jaqua center has 54 computer stations, divided between group and silent study rooms. Six additional stations equipped with the latest creative software can be found in a graphics lab located on the 3rd floor."
		},
		{
			title:"it staff",
			greenImg:"img/amenities/wrench_green.png",
			grayImg:"img/amenities/wrench_gray.png",
			video:"vid/amenities/it_staff",
			copy:"The IT staff will help you through any complications you may have with technical equipment in the Jaqua Center. They will also be your first stop should you encounter any issues with your laptop or iPad."
		},
		{
			title:"study areas",
			greenImg:"img/amenities/paper_green.png",
			grayImg:"img/amenities/paper_gray.png",
			video:"vid/amenities/study_room",
			copy:"All 35 tutor rooms in the Jaqua Center are setup with wall-mounted monitors that can be easily connected to your computer and large dry erase boards. Communal study spaces like the library, athlete lounge, and classrooms are also available."
		},
		{
			video:"vid/amenities/landing",
			copy:"The Jaqua Center is setup to take care of anything that might slow down the academic process, allowing athletes to focus on what matters when it’s time to work. Click the icons above to learn about a few of the features that make this facility so functional."
		}
	];
	$scope.loopLength=$scope.items.length-1;
	var titleCards=[];
	var element;
	var diamonds;
	var currentlyPlaying=$scope.loopLength;
	var copy;

	$scope.init=function()
	{
		element=document.getElementById($scope.id)
		copy=element.querySelectorAll(".copy li");
		var tcs=element.querySelectorAll(".titleCard");
		for(var i=0, iLen=tcs.length; i<iLen; i++)
		{
			var titleCard=new TitleCard(tcs[i]);
			titleCards.push(titleCard);
		}
	}

	$scope.activate=function()
	{
		titleCards[titleCards.length-1].play();
		TweenLite.to(copy[copy.length-1], 0.5, {autoAlpha:1, ease:Cubic.easeOut, top:0, delay:0.2});
		diamonds=element.querySelectorAll("li a");
		for(var i=0, iLen=diamonds.length; i<iLen; i++)
		{
			TweenLite.to(diamonds[i], 0.5, {autoAlpha:1, ease:Cubic.easeOut, delay:0.2+i*0.1, top:0});
		}
		MyUtils.addEventListener(diamonds,"click",onDiamondClick);
		MySounds.playLoop(LOOPS.academics);
	}
	
	function onDiamondClick(evt)
	{
		MySounds.play(FX.click);
		var num=MyUtils.indexOf(diamonds,evt.currentTarget);
		if(num!=currentlyPlaying)
		{
			if(currentlyPlaying<diamonds.length)
				diamonds[currentlyPlaying].className="";
			evt.currentTarget.className="selected";
			playVideo(num);
			currentlyPlaying=num;
		}
	}

	function playVideo(num)
	{
		if(currentlyPlaying!=num)
		{
			titleCards[currentlyPlaying].pause();
			TweenLite.to(titleCards[currentlyPlaying].element, 0.5, {autoAlpha:0, ease:Cubic.easeIn});
			TweenLite.to(copy[currentlyPlaying], 0.3, {autoAlpha:0, ease:Cubic.easeIn});
			currentlyPlaying=num;
			TweenLite.to(copy[currentlyPlaying], 0.3, {autoAlpha:1, ease:Cubic.easeOut});
			TweenLite.to(titleCards[currentlyPlaying].element, 0.5, {autoAlpha:1, ease:Cubic.easeOut, onComplete:titleCards[currentlyPlaying].play, onCompleteScope:titleCards[currentlyPlaying]});
		}
	}

	$scope.deactivate=function()
	{
		MyUtils.removeEventListener(diamonds,"click",onDiamondClick);
		for(var i=0, iLen=titleCards.length; i<iLen; i++)
		{
			titleCards[i].deactivate();
		}
	}

	$scope.destroy=function()
	{
	}

	setCurrentScope($scope, $scope.id);
}
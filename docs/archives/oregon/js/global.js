"use strict";

var NAV=
[
	{
		title:"home",
		subsections:[]
	},
	{
		title:"football hq",
		subsections:
		[
			{
				title:"facilities",
				subsections:
				[
					{
						url:"explore",
						templateUrl:"explore.html",
						controller:"facilitiesexploreCtrl"
					}
				]
			},
			{
				title:"uniforms",
				subsections:
				[
					{
						url:"explore",
						templateUrl:"explore.html",
						controller:"uniformsexploreCtrl"
					}
				]
			},
			{
				title:"locker room",
				subsections:
				[
					{
						url:"explore",
						templateUrl:"explore.html",
						controller:"lockerroomexploreCtrl"
					}
				]
			},
			{
				title:"weight room",
				subsections:
				[
					{
						url:"explore",
						templateUrl:"explore.html",
						controller:"weightroomexploreCtrl"
					}
				]
			},
			{
				title:"treatment center",
				subsections:
				[
					{
						url:"explore",
						templateUrl:"explore.html",
						controller:"treatmentcenterexploreCtrl"
					}
				]
			},
			{
				title:"practice fields",
				subsections:
				[
					{
						url:"exploreoutdoor",
						templateUrl:"exploreoutdoor.html",
						controller:"exploreoutdoorCtrl"
					},
					{
						url:"exploreindoor",
						templateUrl:"exploreindoor.html",
						controller:"exploreindoorCtrl"
					}
				]
			},
			{
				title:"autzen stadium",
				subsections:
				[
					{
						url:"explore",
						templateUrl:"explore.html",
						controller:"autzenstadiumexploreCtrl"
					}
				]
			},
			{
				title:"end",
				subsections:[]
			}
		]
	},
	{
		title:"academics",
		subsections:
		[
			{
				title:"welcome to jaqua",
				subsections:[]
			},
			{
				title:"tutoring",
				subsections:[]
			},
			{
				title:"amenities",
				subsections:[]
			},
			{
				title:"ahead of the curve",
				subsections:
				[
					{
						url:"explore",
						templateUrl:"explore.html",
						controller:"aheadofthecurveexploreCtrl"
					}
				]
			},
			{
				title:"leave your mark",
				subsections:
				[
					{
						url:"explore",
						templateUrl:"explore.html",
						controller:"leaveyourmarkexploreCtrl"
					}
				]
			},
			{
				title:"end",
				subsections:[]
			}
		]
	},
	{
		title:"home turf",
		subsections:
		[
			{
				title:"explore campus",
				subsections:[]
			},
			{
				title:"end",
				subsections:[]
			}
		]
	}
];

var LOOPS=
{
	home:"aud/loops/FOOTBALL_THROB",
	footballhq:"aud/loops/FOOTBALL_SECTION_LOST",
	academics:"aud/loops/LANDING_PAGE_SETUP",
	hometurf:"aud/loops/LANDING_VIBRATING",
	autzen:"aud/loops/OREGON_AUTZEN_RING_AUDIO",
	lockerroom:"aud/loops/OREGON_LOCKER_ROOM",
	moshofsky:"aud/loops/OREGON_PRACTICE_FIELD",
	weightroom:"aud/loops/OREGON_WEIGHT_ROOM",
	aheadofthecurve:"aud/loops/Jaqua_audio",
	explorecampus:"aud/loops/Lookout_Audio"
};

var FX=
{
	arrowOver:{path:"aud/fx/EFX_INT_Ratchet_Wrench_01_over",volume:0.02},
	arrowOut:{path:"aud/fx/EFX_INT_Ratchet_Wrench_01_out",volume:0.02},
	buzz:{path:"aud/fx/Street_light_buzz_with_city_drone2",volume:0.02},
	click:{path:"aud/fx/Switch_01",volume:0.2},
	diamondOver:{path:"aud/fx/Bongo_Reverse_Hits_1_1",volume:0.05},
	diamondOut:{path:"aud/fx/Bongo_Reverse_Hits_11_1",volume:0.05},
	over:{path:"aud/fx/Small_Clock_Tick_Loop",volume:0.01},
	page1:{path:"aud/fx/Hardcover_book_page_turn_BLASTWAVEFX_22785",volume:0.1},
	page2:{path:"aud/fx/Paperback_novel_turn_page_BLASTWAVEFX_22842",volume:0.1},
	page3:{path:"aud/fx/Paperback_turn_page_fast_BLASTWAVEFX_22876",volume:0.1}
};

var KEYBOARD_EVENT="keydown";

var bottomSquares;
var currentTier1=Number.MAX_VALUE;
var currentTier2=Number.MAX_VALUE;
var rootScope;
var setCurrentScope;

var _body
	function body()
	{
		if(!_body)
			_body=document.querySelector("body");
		return _body;
	}

var _retina
	function retina()
	{
		if(!_retina)
			_retina=window.devicePixelRatio>1;
		return _retina;
	}

var _topNav;
	function topNav()
	{
		if(!_topNav)
			_topNav=document.getElementById("topNav");
		return _topNav;
	}
	var _topNavIsOpen=false;
	function showTopNav(open)
	{
		if(open!=_topNavIsOpen)
		{
			TweenLite.to(topNav(), 0.5, {top:(open?0:-90),ease:Cubic.easeInOut});
			_topNavIsOpen=open;
		}
	}
	var _topNavRight;
	function topNavRight()
	{
		if(!_topNavRight)
		{
			_topNavRight=topNav().querySelector(".right");
			_topNavRight.alphaTracker=0;
			new SpriteForwardRewind(_topNavRight, 6,20, [_topNavRight.querySelector(".green"), _topNavRight.querySelector(".white")]);
		}
		return _topNavRight;
	}
	var _topNavX;
	function topNavX()
	{
		if(!_topNavX)
		{
			_topNavX=topNav().querySelector(".x");
			new SpriteForwardRewind(_topNavX, 6,20, [_topNavX.querySelector(".green"), _topNavX.querySelector(".white")]);
		}
		return _topNavX;
	}
	var _topNavLeft;
	function topNavLeft()
	{
		if(!_topNavLeft)
		{
			_topNavLeft=topNav().querySelector(".left");
			_topNavLeft.alphaTracker=0;
			new SpriteForwardRewind(_topNavLeft, 6,20, [_topNavLeft.querySelector(".green"), _topNavLeft.querySelector(".white")]);
		}
		return _topNavLeft;
	}

var _transform;
	function transform()
	{
		if(!_transform)
		{
			var body=document.querySelector("body");
			if(body.style.webkitTransform=="")
				_transform="webkitTransform";
			else if(body.style.msTransform=="")
				_transform="msTransform";
			else if(body.style.transform=="")
				_transform="transform";
		}
		return _transform;
	}

var timer;
	function startTimer()
	{
		timer=new MyTimer(10000);
		timer.start();
		body().addEventListener("mouseover",_onTimerOver);
		body().addEventListener("mouseout",_onTimerOut);
	}
	function stopTimer()
	{
		body().removeEventListener("mouseover",_onTimerOver);
		body().removeEventListener("mouseout",_onTimerOut);
		timer.stop();
		timer=null;
	}
		function _onTimerOver(evt)
		{
			if(MyUtils.hasClass(evt.target, "pause"))
				timer.stop();
		}
		function _onTimerOut(evt)
		{
			if(MyUtils.hasClass(evt.target, "pause"))
				timer.start();
		}

var _cursor;
	function cursor()
	{
		if(!_cursor)
			_cursor=new Sprite(document.getElementById("cursor"), 6, 39);
		return _cursor;
	}

var _vidExt;
	function vidExt()
	{
		if(!_vidExt)
		{
			var video=document.createElement("video");
			if(video.canPlayType("video/mp4")!="")
				_vidExt=".mp4";
			else if(video.canPlayType("video/webm")!="")
				_vidExt=".webm";
		}
		return _vidExt;
	}

var _leaveDefaults;
	function leaveDefaults()
	{
		if(!_leaveDefaults)
		{
			var divs=document.querySelectorAll("#leftNav li a div");
			var pees=document.querySelectorAll("#leftNav li a p");
			divs=MyUtils.toArray(divs);
			pees=MyUtils.toArray(pees);
			_leaveDefaults=divs.concat(pees);
		}
		return _leaveDefaults;
	}

function noSpace(str)
{
	return str.split(" ").join("");
}
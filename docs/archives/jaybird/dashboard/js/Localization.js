"use strict";

var Localization=
	{
		MONTHS:
		[
			"january",
			"february",
			"march",
			"april",
			"may",
			"june",
			"july",
			"august",
			"september",
			"october",
			"november",
			"december"
		],
		DAYS:
		[
			"sunday",
			"monday",
			"tuesday",
			"wednesday",
			"thursday",
			"friday",
			"saturday"
		],
		OVERALL_PERCENTAGE:"overall percentage",
		TOTAL_SCORE:"total score",
		AM:"am",
		PM:"pm"
	};

Localization.activityName=function(num)
{
	switch (num)
	{
		case 1:
			return "walking";
			break;
		case 2:
			return "running";
			break;
		case 3:
			return "swimming";
			break;
		case 4:
			return "cycle";
			break;
		case 5:
			return "sports";
			break;
		case 6:
			return "general";
			break;
		case 7:
			return "sedentary";
			break;
		case 8:
			return "sleep";
			break;
	}
};
"use strict";

FullData._MS_PER_MINUTE=1000*60;
FullData._MS_PER_HOUR=FullData._MS_PER_MINUTE*60;
FullData._MS_PER_DAY=FullData._MS_PER_HOUR*24;
FullData._OFFSET=new Date().getTimezoneOffset()*FullData._MS_PER_MINUTE;
function FullData(data)
{
	this.days=[];
	var months=[];
	this.months=[];
	this.activities=[];
	this.lastSleep=data.lastSleep;
	for(var i=0, iLen=data.days.length; i<iLen; i++)
	{
		var dayData=new DayData(data.days[i]);
		this.days.push(dayData);
		if(!months[dayData.date.getMonth()])
			months[dayData.date.getMonth()]=[]
		months[dayData.date.getMonth()].push(dayData);
	}
	for(i=0, iLen=months.length; i<iLen; i++)
	{
		if(months[i])
		{
			var month=new AverageData(months[i]);
			this.months.push(month);
			for(var j=0, jLen=month.activity.segments.length; j<jLen; j++)
			{
				if(this.activities.indexOf(month.activity.segments[j].num)<0)
					this.activities.push(month.activity.segments[j].num);
			}
		}
	}
	this.activities.sort(MyMath.sortAscending);
	this.average=new AverageData(this.days);
}

	FullData.secondsToTime=function(num)
	{
		var hrs=Math.floor(num/(60*60));
		if(hrs<10)
			hrs="0"+hrs;
		var mins=Math.round((num%(60*60))/60);
		if(mins<10)
			mins="0"+mins;
		return hrs+":"+mins;
	}

	FullData.dateToTime=function(date)
	{
		var hrs=date.getHours()%12;
		if(hrs<10)
			hrs="0"+hrs;
		var mins=date.getMinutes();
		if(mins<10)
			mins="0"+mins;
		return hrs+":"+mins;
	}

	FullData.amOrPm=function(date)
	{
		if(date.getHours()>=12)
			return Localization.PM;
		else
			return Localization.AM;
	}
	
	FullData.random=function(beginStamp, endStamp)
	{
		var days=(endStamp-beginStamp)/FullData._MS_PER_DAY;
		var lastSleep={duration:SleepData.randomDuration(days), goal:SleepData.randomDuration(days)};
		var days=[];
		while(beginStamp<endStamp)
		{
			days.push(DayData.random(beginStamp));
			beginStamp+=FullData._MS_PER_DAY;
		}
		return {days:days,lastSleep:lastSleep};
	}

	function AverageData(dayDatas)
	{
		this.goZone=0;
		this.sleep=SleepData.total(dayDatas);
		this.activity={goal:0, total:0, segments:[]};
		var segments=[];
		for(var i=0, iLen=dayDatas.length; i<iLen; i++)
		{
			var data=dayDatas[i];
			
			this.goZone+=data.goZone;
			
			this.activity.goal+=data.activity.goal;
			for(var j=0, jLen=data.activity.segments.length; j<jLen; j++)
			{
				if(!segments[data.activity.segments[j].num])
					segments[data.activity.segments[j].num]={num:data.activity.segments[j].num, intensity:0, amount:0, data:[]};
				segments[data.activity.segments[j].num].intensity+=(data.activity.segments[j].intensity*data.activity.segments[j].amount);
				segments[data.activity.segments[j].num].amount+=data.activity.segments[j].amount;
			}
		}
		for(i=0, iLen=segments.length; i<iLen; i++)
		{
			if(segments[i])
			{
				this.activity.segments.push(segments[i]);
				segments[i].intensity/=segments[i].amount;
			}
		}
		this.goZone=new GoZoneData(this.goZone/iLen);
		this.activity=new ActivityData(this.activity);
	}

		function DayData(data)
		{
			this.date=new Date(data.timestamp);
			this.goZone=new GoZoneData(data.goZone);
			this.sleep=new SleepData(data.sleep);
			this.activity=new ActivityData(data.activity);
		}

		DayData._RANDOM_DAYS={};
		DayData.random=function(timestamp)
		{
			if(!DayData._RANDOM_DAYS[timestamp])
				DayData._RANDOM_DAYS[timestamp]={
					timestamp:timestamp, 
					goZone:GoZoneData.random(), 
					sleep:SleepData.random(), 
					activity:ActivityData.random()
				};
			return DayData._RANDOM_DAYS[timestamp];
		}

			function GoZoneData(data)
			{
				this.num=data;
				this.string=String(Math.round(data*100));
				while(this.string.length<3)
				{
					this.string="0"+this.string;
				}
			}

			GoZoneData.random=function()
			{
				return Math.random();
			}

			function SleepData(data)
			{
				this.wake=new Date(data.wake);
				this.duration=data.duration;
				this.sleep=new Date(data.sleep);
				this.goal=data.goal;
				this.movement=[];
				for(var i=0, iLen=data.movement.length; i<iLen; i++)
				{
					this.movement.push({x:MyMath.relativePercentage(data.sleep, data.wake, data.movement[i].time), y:MyMath.relativePercentage(0, Activity.MAX_INTENSITY, data.movement[i].intensity)});
				}
			}

			SleepData.random=function()
			{
				var obj=
				{
					wake:FullData._OFFSET+FullData._MS_PER_DAY+MyMath.random(FullData._MS_PER_HOUR*6, FullData._MS_PER_HOUR*10, true, 2),
					duration:SleepData.randomDuration(1),
					sleep:FullData._OFFSET+MyMath.random(FullData._MS_PER_HOUR*21, FullData._MS_PER_HOUR*24, true, 2),
					goal:SleepData.randomDuration(1),
					movement:[]
				};
				for(var i=0, iLen=MyMath.random(10,50,true); i<iLen; i++)
				{
					obj.movement.push({time:MyMath.random(obj.sleep, obj.wake, true),intensity:MyMath.random(1,Activity.MAX_INTENSITY)});
				}
				return obj;
			}

			SleepData.randomDuration=function(num)
			{
				var total=0;
				for(var i=0; i<num; i++)
				{
					total+=MyMath.random(21600, 36000, true, 2);
				}
				return total;
			}

			SleepData.total=function(dayDatas)
			{
				var wakes=[];
				var duration=0;
				var sleeps=[];
				var goal=0;
				for(var i=0, iLen=dayDatas.length; i<iLen; i++)
				{
					var sleepData=dayDatas[i].sleep;
					wakes.push(sleepData.wake.getTime()%FullData._MS_PER_DAY);
					duration+=sleepData.duration;
					sleeps.push(sleepData.sleep.getTime()%FullData._MS_PER_DAY);
					goal+=sleepData.goal;
				}
				return new SleepData({wake:MyMath.average(wakes), duration:duration, sleep:MyMath.average(sleeps), goal:goal, movement:[]});
			}

			function ActivityData(data)
			{
				this.goal=data.goal;
				this.segments=[];
				this.orderedSegments=[];
				this.total=0;
				for(var i=0, iLen=data.segments.length; i<iLen; i++)
				{
					var segment=new ActivitySegmentData(data.segments[i]);
					this.segments.push(segment);
					this.orderedSegments[segment.num]=segment;
					this.total+=segment.amount;
				}
				this.ratio=this.total/this.goal;
				this.ratioString=Math.round(this.ratio*100)+'%';
			}

			ActivityData.random=function()
			{
				var randomNums=[7];
				var randomLength=MyMath.random(0,6,true);
				for(var i=0; i<randomLength; i++)
				{
					do
					{
						var num=MyMath.random(1,6,true);
					}
					while(randomNums.indexOf(num)!=-1)
					randomNums.push(num);
				}
				var segments=[];
				for(var i=0, iLen=randomNums.length; i<iLen; i++)
				{
					segments.push(ActivitySegmentData.random(randomNums[i]));
				}
				return {
					goal:MyMath.random(2000,8000,true,2),
					segments:segments
				};
			}

				function ActivitySegmentData(data)
				{
					this.num=data.num;
					this.name=Localization.activityName(data.num);
					this.nameNoSpace=this.name.split(" ").join("");
					this.intensity=data.intensity;
					this.amount=data.amount;
					this.data=data.data;
					this.english=Dashboard.activityName(data.num);
				}

				ActivitySegmentData._DATAS=[{name:"calories",value:"0"}, {name:"time",value:"01:40:06"}, {name:"sports",value:"1252"}, {name:"steps",value:"848"}];
				ActivitySegmentData.random=function(num)
				{
					var numDatas=MyMath.random(1,3,true);
					var datas=[];
					for(var i=0; i<numDatas; i++)
					{
						datas.push(MyMath.randomChoice(ActivitySegmentData._DATAS));
					}
					return {
						num:num,
						intensity:MyMath.random(1,Activity.MAX_INTENSITY,true,2),
						amount:Math.abs(MyMath.random(0,2000,true)),
						data:datas
					};
				}
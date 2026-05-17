var instagram_source   = document.getElementById("instagram-template").innerHTML;
var instagram_template = Handlebars.compile(instagram_source);
var twitter_source   = document.getElementById("twitter-template").innerHTML;
var twitter_template = Handlebars.compile(twitter_source);
var twitter_image_source   = document.getElementById("twitter-image-template").innerHTML;
var twitter_image_template = Handlebars.compile(twitter_image_source);
var facebook_source   = document.getElementById("facebook-template").innerHTML;
var facebook_template = Handlebars.compile(facebook_source);
var html = "";
// var rss_source   = document.getElementById("rss-template").innerHTML;
// var rss_template = Handlebars.compile(rss_source);

// #disruptivebydesign all networks
/*JSONP('http://api.massrelevance.com/oakley/global-campaign_dbdhub_allhashtag.json','jsoncallback',function(json){
	html     = '';
	for(var i = 0; i < json.length; i++) {
	    var obj = json[i];
	    switch(obj.network) {
	    case "instagram":
	        html += instagram_template(obj);
	        break;
	    case "twitter":
	    	if (obj.entities.media)
    			html += twitter_template(obj);
	        break;
	    case "facebook":
	    	if (obj.kind == "photo")
	        	html +=  facebook_template(obj);
	    	break;
	    }
	}
	document.getElementById('all-mr').innerHTML = html;
});*/

// @oakley Instagram
/*JSONP('http://api.massrelevance.com/oakley/global-campaign_dbdhub_ourinstagram.json','jsoncallback',function(json){
	html     = '';
	for(var i = 0; i < json.length; i++) {
	    var obj = json[i];
	    if (obj.type=='image') {
	    	html += instagram_template(obj);
	    }
	}
	document.getElementById('instagram-mr').innerHTML = html;
});*/

// Facebook
// To be a bigger picture we need to change the end of the picture name to _b instead of _s
/*JSONP('http://api.massrelevance.com/oakley/global-campaign_dbdhub_ourfacebook.json','jsoncallback',function(json){
	var html     = '';
	for(var i = 0; i < json.length; i++) {
	    var obj = json[i];
    	console.log(obj);
    	if (obj.kind=='photo') {
    		html += facebook_template(obj);
    	}
	}
	document.getElementById('facebook-mr').innerHTML = html;
});*/

//Twitter Images
/*JSONP('http://api.massrelevance.com/oakley/global-campaign_dbdhub_ourtwitter.json','jsoncallback',function(json){
	var html     = '';
	for(var i = 0; i < json.length; i++) {
	    var obj = json[i];
    	console.log(obj);
    	if (obj.entities.media) {
    		html += twitter_image_template(obj);
    	}
	}
	document.getElementById('twitter-images-mr').innerHTML = html;
});*/
//Twitter Text Only
/*JSONP('http://api.massrelevance.com/oakley/global-campaign_dbdhub_ourtwitter.json','jsoncallback',function(json){
	var html     = '';
	for(var i = 0; i < json.length; i++) {
	    var obj = json[i];
    	// if (!obj.entities.media) {
    		html += twitter_template(obj);
    	// }
	}
	document.getElementById('twitter-mr').innerHTML = html;
});*/
// RSS Wired

 // IN PROGRESS
JSONP('http://api.massrelevance.com/oakley/global-campaign_dbdhub_wiredrss.json','jsoncallback',function(json){
	var html     = '';
	for(var i = 0; i < json.length; i++) {
	    var obj = json[i];
    	console.log(obj);
    	if (obj.kind=='photo') {
    		html += rss_template(obj);
    	}
	}
	// document.getElementById('rss-mr').innerHTML = html;
});


// http://api.massrelevance.com/oakley/global-campaign_dbdhub_ourtwitter.json
// 
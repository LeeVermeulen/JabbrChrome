function timeSince(date) {

    var seconds = Math.floor((new Date() - date) / 1000);

    var interval = Math.floor(seconds / 31536000);

    if (interval > 1) {
        return interval + " years";
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
        return interval + " months";
    }
    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
        return interval + " days";
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
        return interval + " hours";
    }
    interval = Math.floor(seconds / 60);
    if (interval > 1) {
        return interval + " minutes";
    }
    return Math.floor(seconds) + " seconds";
}

var filetime_to_unixtime = function(ft) {
    epoch_diff = 116444736000000000;
    rate_diff = 10000000;
    return parseInt((ft - epoch_diff)/rate_diff);
}

var filetime_as_string = function(ft) {
    var ut = filetime_to_unixtime(ft);
    var d = new Date(ut * 1000);
    return timeSince(d) + " ago"; //d.toLocaleString();
}

var jabbrGenerator = {

  requestJabbr: function() 
  {
    chrome.tabs.query({ 'active': true, 'lastFocusedWindow': true }, function (tabs) {
		var JabbrURL = "http://seekr.azurewebsites.net";
		//var JabbrURL = "http://localhost:54673";
		var displayURL = tabs[0].url;
		if (displayURL.length > 47)
			displayURL = displayURL.substring(0,47) + "...";
		document.getElementById("Title").innerHTML += "Searching: " + displayURL;
		
		document.getElementById("Main").innerHTML = "";
		var sites = ["Reddit", "Facebook", "GooglePlus", "Twitter", "Hackernews", "Tools"];
		var i = 0;
		var j = 0;
		
		var reqOther = new XMLHttpRequest();
		var getOther = JabbrURL + '/Search/GetOther?URL=' + tabs[0].url;
		console.log(getOther);
		reqOther.open("GET", getOther, true);
		reqOther.onload = function (res) 
		{
			var otherlist = JSON.parse(res.target.responseText);
			var HTML = "";
			otherlist.forEach(function(entry) {
				HTML += '<div class="container" score="0"><div class="well">';
				HTML += entry;
				HTML += "</div></div>";
			});
			document.getElementById("Main").innerHTML += HTML;
			$('.container').tsort('',{order:'desc',attr:'score'});
		}
		reqOther.send(null);
		
		sites.forEach(function(entry) 
		{
			var searchOnJabbr = JabbrURL + '/Search?URL=' + tabs[0].url + "&App=Chrome&Sites=" + entry;
			console.log(searchOnJabbr);
			var req = new XMLHttpRequest();
			req.open("GET", searchOnJabbr, true);
			req.onload = function (e) 
			{
				var myObject = JSON.parse(e.target.responseText);
				var total = 0;
				if (myObject != null) {
				  var ResultTypes = myObject.JSON_Result_Types;
				  var HTML = "";
				  ResultTypes.forEach(function (result) {
					  var SiteResults = result.Site_Results;
					  if (SiteResults.length > 0 || (result.Extra != "" && result.Extra != null))
					  {
						  var image = "jabbr_tools";
						  if (result.SiteName == "Reddit" || result.SiteName == "Facebook" || result.SiteName == "Twitter" || result.SiteName == "Hackernews")
						  	image = result.SiteName;
						
						  HTML += '<div class="container" score="' + result.TotalScore + '"><div class="well">';
						  if (SiteResults.length > 0)
						  {
						  	HTML += '<a href="#" data-toggle="collapse" class="head active" data-target="#tar' + j + '">';
						  	HTML += '<i class="caret"></i><i class="right-caret"></i>';
						  }
						  HTML += " <img class='siteimage' src='" + image + ".png' \> ";
						  HTML += result.SiteName;
						  if (SiteResults.length > 0)
						  	HTML += " <span class='amount'> (" + SiteResults.length + ")</span></a>";
						  if (result.Extra != "" && result.Extra != null)
						  	HTML += " " + result.Extra;
					   	  HTML += "<div id='tar" + j + "' class='collapse'>";
						  HTML += '<ul class="nav nav-list">';
						  //HTML += "<div class='sitegroup'><img class='siteimage' src='" + image + ".png' \> <span class='sitelabel'>" + result.SiteName + " (" + SiteResults.length + ")</span></div>";
						  SiteResults.forEach(function (site) {
							  var title = site.Title;
							  if (title == "" || title == null)
							  	return;
							  if (title.length > 47)
							  	title = title.substring(0,47);
							  HTML += "<li><a target='_blank' href='" + site.URL + "'>" + title + "</a>";
							  if (site.Score > 0)
							  	HTML += "<div style='display:inline' class='points sub'>" + site.Score + "</div>";
							  if (site.Comments > 0)
							  	HTML += "<div style='display:inline' class='comments sub'> " + site.Comments + " comments </div>";
							  if (site.subtitle)
							  {
							    var subtitle = site.subtitle;
								  if (subtitle.length > 45)
									subtitle = subtitle.substring(0,45);
							  	HTML += "<div style='display:inline' class='subtitle sub'> - " + subtitle + "</div>";
							  }
							  HTML += "</li>";
							  total++;
						  });
						  
						  var Time = new Date().getTime() / 1000;
				  		  var Time2 = filetime_to_unixtime(result.LastUpated);
						  if ((Time - Time2) > 60)
						  {
						  	HTML += "<li>Last updated " + filetime_as_string(result.LastUpated) + "</li>";
						  }
						  
						  HTML += "</ul></div></div></div>";
						  j++;
					  }
					  else
					  {
						  if (document.getElementById("NoResults").innerHTML == "")
						  	document.getElementById("NoResults").innerHTML += "No Results: ";
						  else
				  		  	document.getElementById("NoResults").innerHTML += ", ";
				  		  document.getElementById("NoResults").innerHTML += result.SiteName;
					  }
				  });
				  
				  document.getElementById("Main").innerHTML += HTML;
				  $('.container').tsort('',{order:'desc',attr:'score'});
				  
				  i++;
				  if (i == sites.length)
				  {
				  	document.getElementById("Loading").innerHTML = "";
				  	document.getElementById("Title").innerHTML = "";
					
					var reqfinal = new XMLHttpRequest();
					var getFinalOnJabbr = JabbrURL + '/Search/GetFinal?URL=' + tabs[0].url;
					console.log(getFinalOnJabbr);
					reqfinal.open("GET", getFinalOnJabbr, true);
					reqfinal.onload = function (res) 
					{
						var finalcount = JSON.parse(res.target.responseText);
						var count = finalcount[0];
						finalcount.forEach(function(entry) {
				  			document.getElementById("Title").innerHTML += entry + "<BR>";
						});
						
					    chrome.browserAction.setBadgeText ({"text": count.toString(), tabId: tabs[0].id});
					    chrome.browserAction.setBadgeBackgroundColor({"color": [0, 0, 0, 100]}); 
					}
					reqfinal.send(null);
				  }
				  
					$(".head").click(function(){
					  $(this).toggleClass('active, inactive');
					})
				}
				else
				{
				  document.getElementById("Other").innerHTML += "<BR>Connection to " + entry + " failed";
				  i++;
				}
			};
			req.send(null);
		});
    });
  },
};

document.addEventListener('DOMContentLoaded', function () {
    jabbrGenerator.requestJabbr();
});
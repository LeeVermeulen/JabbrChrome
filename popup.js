
var jabbrGenerator = {

  requestJabbr: function() 
  {
    chrome.tabs.query({ 'active': true, 'lastFocusedWindow': true }, function (tabs) {
		document.getElementById("Main").innerHTML = "";
		var sites = ["Reddit", "Facebook", "GooglePlus", "Twitter", "Hackernews"];
		var i = 0;
		sites.forEach(function(entry) 
		{
			var searchOnJabbr = 'http://jabbrv1.azurewebsites.net/Search?URL=' + tabs[0].url + "&App=Chrome&Sites=" + entry;
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
					  if (SiteResults.length > 0)
					  {
						  var image = "jabbr_tools";
						  if (result.SiteName == "Reddit" || result.SiteName == "Facebook" || result.SiteName == "Twitter" || result.SiteName == "Hackernews")
						  	image = result.SiteName;
						
						  HTML += '<div class="container"><div class="well">';
						  HTML += '<a href="#" data-toggle="collapse" class="head active" data-target="#tar' + i + '">';
						  HTML += '<i class="caret"></i><i class="right-caret"></i>';
						  HTML += " <img class='siteimage' src='" + image + ".png' \> ";
						  HTML += result.SiteName + " (" + SiteResults.length + ") </a>";
					   	  HTML += "<div id='tar" + i + "' class='collapse'>";
						  HTML += '<ul class="nav nav-list">';
						  //HTML += "<div class='sitegroup'><img class='siteimage' src='" + image + ".png' \> <span class='sitelabel'>" + result.SiteName + " (" + SiteResults.length + ")</span></div>";
						  SiteResults.forEach(function (site) {
							  var title = site.Title;
							  if (title == "")
							  	return;
							  if (title.length > 47)
							  	title = title.substring(0,47);
							  HTML += "<li><a target='_blank' href='" + site.URL + "'>" + title + "</a>";
							  if (site.Score > 0)
							  	HTML += "<div style='display:inline' class='points sub'>" + site.Score + "</div>";
							  if (site.Comments > 0)
							  	HTML += "<div style='display:inline' class='comments sub'> " + site.Comments + " comments </div>";
							  if (site.subtitle)
							  	HTML += "<div style='display:inline' class='subtitle sub'> - " + site.subtitle + "</div>";
							  HTML += "</li>";
							  total++;
						  });
						  HTML += "</ul></div></div></div>";
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
				  i++;
				  if (i == sites.length)
				  {
				  	document.getElementById("Loading").innerHTML = "";
				  }
				  chrome.browserAction.setBadgeText ({"text": total.toString(), tabId: tabs[0].id});
				  chrome.browserAction.setBadgeBackgroundColor({"color": [0, 0, 0, 100]}); 
				  
					$(".head").click(function(){
					  $(this).toggleClass('active, inactive');
					})
				}
				else
				{
				  document.getElementById("Main").innerHTML += "<BR>Connection to " + entry + " failed";
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
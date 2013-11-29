
var jabbrGenerator = {

  requestJabbr: function() 
  {
    chrome.tabs.query({ 'active': true, 'lastFocusedWindow': true }, function (tabs) {
		document.getElementById("Main").innerHTML = "";
		var sites = ["Reddit", "Facebook", "GooglePlus", "Twitter", "Hackernews"];
		var i = 0;
		sites.forEach(function(entry) 
		{
			var searchOnJabbr = 'http://jabbrv1.azurewebsites.net/Search?URL=' + tabs[0].url + "&Sites=" + entry;
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
						  HTML += "<div class='sitegroup'><img src='jabbr_tools.png' \> " + result.SiteName + "(" + SiteResults.length + ")</div>";
						  SiteResults.forEach(function (site) {
							  HTML += "<div class='result'>";
							  HTML += "<a target='_blank' href='" + site.URL + "'>" + site.Title + "</a><BR>";
							  HTML += "</div>";
							  total++;
						  });
					  }
				  });
				  document.getElementById("Main").innerHTML += HTML;
				  i++;
				  if (i == sites.length)
				  {
				  	document.getElementById("Loading").innerHTML = "";
					if (total == 0)
				  		document.getElementById("Main").innerHTML = "No Results";
				  }
				  chrome.browserAction.setBadgeText ({"text": total.toString(), tabId: tabs[0].id});
				}
				else
				{
				  document.getElementById("Main").innerHTML += "<BR>Connection to " + entry + " failed";
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
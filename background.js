

var settings;
settings = new Store('settings', {
	'Reddit': 'true',
	'Twitter': 'true',
	'Facebook': 'true',
	'Hackernews': 'true',
	'GooglePlus': 'true',
	'excludedRegex': 'chrome://.*\nchrome-extension://.*\nview-source://.*\nftp://.*\nhttps?://www\\.google\\.com/search.*\nhttps?://search\\.yahoo\\.com/search.*\nhttps?://www\\.bing\\.com/search.*\nhttps?://www\\.reddit\\.com/(?:r/(?:\\w|\\+)+/?)?(?:$|\\?count)'
});

var selectedId = -1;

var totals = new Array();
var url_current = new Array();

function refreshBadge() 
{
	if (selectedId != -1)
	chrome.tabs.get(selectedId, function (tab) 
	{
		if (tab)
		if (!totals[selectedId] || url_current[selectedId] != tab.url) // if new tab or new URL
		{
			url_current[selectedId] = tab.url;			
			
			var excludedRegex, match;
			if (settings.get('excludedRegex'))
			{
				excludedRegex = settings.get('excludedRegex').split('\n');
				match = false;
				for (var i = 0; i < excludedRegex.length; i++) {
					if (tab.url.match(new RegExp(excludedRegex[i], "i")) !== null) {
						match = true;
						break;
					}
				}
			}
			
			totals[tab.id] = 0;
			
			if (settings.get('ShowCached'))
			if (!match)
			{
				var searchOnJabbr = 'http://jabbrv1.azurewebsites.net/Search/GetNumber?URL=' + tab.url;
				searchOnJabbr += "&Sites=";
				if (settings.get('Reddit'))
					searchOnJabbr += "Reddit,";
				if (settings.get('Twitter'))
					searchOnJabbr += "Twitter,";
				if (settings.get('Facebook'))
					searchOnJabbr += "Facebook,";
				if (settings.get('Hackernews'))
					searchOnJabbr += "Hackernews,";
				if (settings.get('GooglePlus'))
					searchOnJabbr += "GooglePlus,";
				console.log(searchOnJabbr);
				var req = new XMLHttpRequest();
				req.open("GET", searchOnJabbr, true);
				req.onload = function(e)
				{
					var total = e.target.responseText;
					totals[tab.id] = total;
					if (totals[selectedId] == 0)
						chrome.browserAction.setBadgeText({"text": "", tabId: selectedId});
					else
					{
						chrome.browserAction.setBadgeBackgroundColor({"color": [0, 0, 0, 100]}); 
						chrome.browserAction.setBadgeText({"text": totals[selectedId].toString(), tabId: selectedId});
					}
					console.log("Recieved from Jabbr: " + totals[selectedId].toString());
				};
				req.send(null);
			}
		}
		else
		{
			if (totals[selectedId] == 0)
				chrome.browserAction.setBadgeText({"text": "", tabId: selectedId});
			else
			{
				chrome.browserAction.setBadgeBackgroundColor({"color": [0, 0, 0, 100]}); 
				chrome.browserAction.setBadgeText({"text": totals[selectedId].toString(), tabId: selectedId});
			}
			console.log("Set: " + totals[selectedId].toString());
		}
	});
}

chrome.tabs.onUpdated.addListener(function(tabId, props) {
  if (props.status == "complete" && tabId == selectedId)
    refreshBadge();
});

chrome.tabs.onSelectionChanged.addListener(function(tabId, props) {
  selectedId = tabId;
  refreshBadge();
});

chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
	if (selectedId != tabs[0].id)
	{
		selectedId = tabs[0].id;
		refreshBadge();
	}
});

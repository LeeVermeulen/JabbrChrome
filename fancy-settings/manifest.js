// SAMPLE
this.manifest = {
    "name": "Seekr Settings",
    "icon": "/icon_large.png",
    "settings": [
        {
        	"tab": chrome.i18n.getMessage('tab_preferences'),
        	"group": "Options",
        	"name": "ShowCached",
        	"type": "checkbox",
        	"label": "Check for Cached Results for all web sites visited"
        },
        {
        	"tab": chrome.i18n.getMessage('tab_preferences'),
        	"group": "Include Services",
        	"name": "Reddit",
        	"type": "checkbox",
        	"label": "Reddit"
        },
        {
        	"tab": chrome.i18n.getMessage('tab_preferences'),
        	"group": "Include Services",
        	"name": "Twitter",
        	"type": "checkbox",
        	"label": "Twitter"
        },
        {
        	"tab": chrome.i18n.getMessage('tab_preferences'),
        	"group": "Include Services",
        	"name": "Facebook",
        	"type": "checkbox",
        	"label": "Facebook"
        },
        {
        	"tab": chrome.i18n.getMessage('tab_preferences'),
        	"group": "Include Services",
        	"name": "Hackernews",
        	"type": "checkbox",
        	"label": "Hackernews"
        },
        {
        	"tab": chrome.i18n.getMessage('tab_preferences'),
        	"group": "Include Services",
        	"name": "GooglePlus",
        	"type": "checkbox",
        	"label": "Google+"
        },
        {
        	"tab": chrome.i18n.getMessage('tab_preferences'),
        	"group": chrome.i18n.getMessage('excluded_regex'),
        	"name": "excludedRegex",
        	"type": "text",
        	"label": chrome.i18n.getMessage('excluded_regex'),
        },
        {
        	"tab": chrome.i18n.getMessage('tab_preferences'),
        	"group": chrome.i18n.getMessage('excluded_regex'),
        	"name": "excludedRegexDescription",
        	"type": "description",
        	"text": chrome.i18n.getMessage('excluded_regex_description')
        }
    ]
};

var ALL_TLDS = Object.freeze({
  "com": { "text": "USA - Amazon.com", "tld": "com" },
  "ca": { "text": "Canada - Amazon.ca", "tld": "ca" },
  "com.mx": { "text": "Mexico - Amazon.com.mx", "tld": "com.mx" },
  "fr": { "text": "France - Amazon.fr", "tld": "fr" },
  "de": { "text": "Germany - Amazon.de", "tld": "de" },
  "it": { "text": "Italy - Amazon.it", "tld": "it" },
  "nl": { "text": "Netherlands - Amazon.nl", "tld": "nl" },
  "es": { "text": "Spain - Amazon.es", "tld": "es" },
  "co.uk": { "text": "UK - Amazon.co.uk", "tld": "co.uk" },
  "cn": { "text": "China - Amazon.cn", "tld": "cn" },
  "in": { "text": "India - Amazon.cn", "tld": "in" },
  "co.jp": { "text": "Japan - Amazon.co.jp", "tld": "co.jp" },
  "com.au": { "text": "Australia - Amazon.com.au", "tld": "com.au" },
  "com.br": { "text": "Brazil - Amazon.com.br", "tld": "com.br" }
})

var DEFAULT_OPTIONS = Object.freeze({
  openInNewTab: true,
  enabledTlds: Object.keys(ALL_TLDS)
})

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  /* The sendResponse function becomes invalid when the event listener returns,
   * unless you return true from the event listener to indicate you wish to send a response asynchronously
   *
   * https://developer.chrome.com/extensions/runtime#event-onMessage
   */
  if (message == 'getAllTlds') {
    sendResponse(ALL_TLDS)
  } else if (message == 'getOptions') {
    chrome.storage.sync.get(null, function(options) {
      sendResponse(options)
    })
    return true
  } else if (message == 'getDefaultOptions') {
    sendReponse(DEFAULT_OPTIONS)
  } else {
    sendResponse({})
  }
})

chrome.runtime.onInstalled.addListener(function(details) {
  //store the default options when installed
  if (details.reason == 'install') {
    chrome.storage.sync.set(DEFAULT_OPTIONS)
  }
})

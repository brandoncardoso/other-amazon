chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message == 'getAllTlds') {
    var request = new XMLHttpRequest()
    var url = chrome.runtime.getURL('/data/tlds.json')
    request.open('GET', url, true)
    request.send(null)
    request.onreadystatechange = function() {
      if (request.readyState == 4) {
        sendResponse(JSON.parse(request.responseText))
      }
    }
    /* This function becomes invalid when the event listener returns,
     * unless you return true from the event listener to indicate you wish to send a response asynchronously
     *
     * https://developer.chrome.com/extensions/runtime#event-onMessage
     */
    return true 
  } else  {
    sendResponse({})
  }
})

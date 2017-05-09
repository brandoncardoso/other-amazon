var ALL_TLDS = {}

var request = new XMLHttpRequest()
var url = chrome.runtime.getURL('/data/tlds.json')
request.open("GET", url, true)
request.send(null)
request.onreadystatechange = function() {
  if (request.readyState != 4) {
    return
  }
  ALL_TLDS = Object.freeze(JSON.parse(request.responseText))
  injectForm()
}

/////

function getTld() {
  return window.location.hostname.replace('www.amazon.', '')
}

function getAsin() {
  var asin = null
  var asin_elem = document.getElementById('ASIN')

  if (asin_elem) {
    asin = asin_elem.getAttribute('value')
  }

  return asin
}

function createForm(currentTld) {
  var form = document.createElement('form')
  var asin = getAsin()

  if (asin) {
    var select = document.createElement('select')
    for (var key in ALL_TLDS) {
      if (ALL_TLDS[key].tld !== currentTld) {
        var option = document.createElement('option')
        option.value = ALL_TLDS[key].tld
        option.text = ALL_TLDS[key].text
        select.appendChild(option)
      }
    }
    form.appendChild(select)
  }

  return form
}

function insertForm(form) {
  var centerCol = document.querySelector('#centerCol')
  var firstHr = centerCol.querySelector('hr')

  centerCol.insertBefore(form, firstHr)
}

function injectForm() {
  var currentTld = getTld()
  var form = createForm(currentTld)
  insertForm(form)
}

var ALL_TLDS = {}
var OPTIONS = {}

chrome.runtime.sendMessage('getAllTlds', function(allTlds) {
  ALL_TLDS = allTlds
  chrome.runtime.sendMessage('getOptions', function(options) {
    OPTIONS = options
    injectForm()
  })
})

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

function openOtherAmazon(form) {
  var otherAmazonUrl = '//www.amazon.' +
    form.querySelector('#tld-select').value +
    window.location.pathname +
    window.location.search

  if (OPTIONS.openInNewTab) {
    window.open(otherAmazonUrl, '_blank')
  } else {
    window.location.href = otherAmazonUrl
  }
}

function createForm(currentTld) {
  var form = document.createElement('form')
  form.name = 'other-amazon-form'

  var asin = getAsin()

  if (!asin) {
    return
  }

  var tldSelectElemId = 'tld-select'

  var label = document.createElement('label')
  label.setAttribute('for', tldSelectElemId)
  label.innerHTML = 'Check another Amazon for more reviews and to compare prices.'
  form.appendChild(label)

  var tldSelect = document.createElement('select')
  tldSelect.id = tldSelectElemId
  for (var i in OPTIONS.enabledTlds) {
    if (OPTIONS.enabledTlds[i] !== currentTld) {
      var option = document.createElement('option')
      option.value = ALL_TLDS[OPTIONS.enabledTlds[i]].tld
      option.text = ALL_TLDS[OPTIONS.enabledTlds[i]].text
      tldSelect.appendChild(option)
    }
  }
  form.appendChild(tldSelect)

  var submitButton = document.createElement('input')
  submitButton.type = 'button'
  submitButton.name = 'other-amazon-submit-button'
  submitButton.value = 'Go'
  submitButton.onclick = function () { openOtherAmazon(form) }
  form.appendChild(submitButton)

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

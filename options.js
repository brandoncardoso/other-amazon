var ALL_TLDS = {}
var DEFAULT_OPTIONS = {}

document.addEventListener('DOMContentLoaded', init)
function init() {
  chrome.runtime.sendMessage('getAllTlds', function(allTlds) {
    chrome.runtime.sendMessage('getDefaultOptions', function(defaultOptions) {
      ALL_TLDS = Object.freeze(allTlds)
      DEFAULT_OPTIONS = Object.freeze(defaultOptions)
      generateForm()
      restoreOptions()
    })
  })
}

/////

function addEnabledTldsOptionInputs(form) {
  var container = form.querySelector('#enabled-tlds-options')

  for (var key in ALL_TLDS) {
    var label = document.createElement('label')
    label.setAttribute('for', key)
    label.innerText = ALL_TLDS[key].text

    var checkbox = document.createElement('input')
    checkbox.type = 'checkbox'
    checkbox.id = key
    checkbox.name = 'enabled-tlds'
    checkbox.value = key

    label.appendChild(checkbox)
    container.appendChild(label)
  }
}

function generateForm() {
  var form = document.getElementById('options') 

  addEnabledTldsOptionInputs(form)

  var saveButton = document.getElementById('save-button')
  saveButton.onclick = saveOptions
}

function saveOptions() {
  var openInNewTab = document.getElementById('open-in-new-tab-option').checked
  var enabledTlds = []
  var tldCheckboxes = document.getElementsByName('enabled-tlds')
  for (var i in tldCheckboxes) {
    if (tldCheckboxes[i].checked) {
      enabledTlds.push(tldCheckboxes[i].value)
    }
  }

  var status = document.getElementById('save-status')
  status.innerText = 'Saving...'

  chrome.storage.sync.set({
    openInNewTab: openInNewTab,
    enabledTlds: enabledTlds
  }, function() {
    status.innerText = 'Saved'
    setTimeout(function() {
      status.innerText = null
    }, 1000)
  })
}

function restoreOptions() {
  chrome.storage.sync.get(DEFAULT_OPTIONS, function(options) {
    document.getElementById('open-in-new-tab-option').checked = options.openInNewTab
    for (var i in options.enabledTlds) {
      document.querySelector('input[name="enabled-tlds"][value="' + options.enabledTlds[i] + '"]').checked = true
    }
  })
}

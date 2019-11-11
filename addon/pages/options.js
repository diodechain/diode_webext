const diodeNodesInput = document.querySelector('#diode-nodes')
const diodeCertInput = document.querySelector('#diode-cert')
const diodePrivKeyInput = document.querySelector('#diode-privkey')
const diodeWebextBtn = document.querySelector('#diode-webext-option-button')
const msgBox = document.querySelector('#diode-webext-option-msgbox')

function readSettings () {
  return browser.runtime.sendMessage('get.settings')
}

function storeSettings () {
  var newSettings = {
    nodes: [],
    certPath: '',
    privKeyPath: ''
  }
  return browser.storage.local.set({
    diode: newSettings
  })
}

function handleClick () {
  // e.preventDafault()
  // e.stopPropagation()
  storeSettings()
    .then(updateMsg.bind(this, 'Update settings successfully!', false))
    .catch(updateMsg.bind(this, 'Update settings failed!', true))
}

function updateMsg (msg, isError) {
  msgBox.textContent = msg
  let removedClass = 'text-success'
  let addedClass = 'text-warning'
  if (!isError) {
    removedClass = 'text-warning'
    addedClass = 'text-success'
  }
  msgBox.classList.remove('hidden')
  msgBox.classList.remove(removedClass)
  msgBox.classList.add(addedClass)
}

function updateUI (settings) {
  diodeNodesInput.value = settings.nodes.join(';')
  diodeCertInput.value = settings.certPath
  diodePrivKeyInput.value = settings.privKeyPath
}

function onError (e) {
  console.error(e)
}

readSettings()
  .then(updateUI)
  .catch(onError)

diodeWebextBtn.addEventListener('click', handleClick)

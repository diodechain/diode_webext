const diodeNodesInput = document.querySelector('#diode-nodes')
const diodeCertInput = document.querySelector('#diode-cert')
const diodePrivKeyInput = document.querySelector('#diode-privkey')
const diodeWebextBtn = document.querySelector('#diode-webext-option-button')
const msgBox = document.querySelector('#diode-webext-option-msgbox')
const { Utils } = browser.extension.getBackgroundPage()
let diodeSettings = {}

function readSettings () {
  return browser.runtime.sendMessage('get.settings')
}

async function storeSettings () {
  if (diodeSettings.dirty === true) {
    return browser.storage.local.set({
      diode: diodeSettings
    })
  }
  throw new Error('Nothing had updated')
}

function handleClick () {
  storeSettings()
    .then(() => {
      updateMsg('Update settings successfully!', false)
      // read file
      return browser.runtime.sendMessage('read.setting.files')
    })
    .catch((err) => {
      console.warn(err)
      updateMsg('Update settings failed!', true)
    })
}

function handleCertChange (e) {
  const path = e.target.value
  if (Utils.isValidFilePath(path)) {
    const { certPath } = diodeSettings
    if (certPath.path !== path) {
      certPath.path = path
      diodeSettings.certPath = certPath
      diodeSettings.dirty = true
    }
    console.log(path, Utils.dirname(path))
  }
}

function handlePrivKeyChange (e) {
  const path = e.target.value
  if (Utils.isValidFilePath(path)) {
    const { privKeyPath } = diodeSettings
    if (privKeyPath.path !== path) {
      privKeyPath.path = path
      diodeSettings.privKeyPath = privKeyPath
      diodeSettings.dirty = true
    }
    console.log(path, Utils.dirname(path))
  }
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
  diodeSettings = settings
  diodeSettings.dirty = false
  diodeNodesInput.value = settings.nodes.join(';')
  diodeCertInput.value = settings.certPath.path
  diodePrivKeyInput.value = settings.privKeyPath.path
}

function onError (e) {
  console.error(e)
}

readSettings()
  .then(updateUI)
  .catch(onError)

diodeCertInput.addEventListener('change', handleCertChange)
diodePrivKeyInput.addEventListener('change', handlePrivKeyChange)
diodeWebextBtn.addEventListener('click', handleClick)

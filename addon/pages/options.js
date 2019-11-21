const diodeNodesInput = document.querySelector('#diode-nodes')
const diodeWebextBtn = document.querySelector('#diode-webext-option-button')
const msgBox = document.querySelector('#diode-webext-option-msgbox')
const { Utils } = browser.extension.getBackgroundPage()
let diodeSettings = {}

function readSettings () {
  return browser.runtime.sendMessage({
    cmd: 'get.settings'
  })
}

async function storeSettings () {
  if (diodeSettings.dirty === true) {
    const settings = {
      nodes: diodeSettings.nodes
    }
    return browser.runtime.sendMessage({
      cmd: 'set.settings',
      settings
    })
  }
  throw new Error('Nothing had updated')
}

function handleClick () {
  storeSettings()
    .then(() => {
      updateMsg('Update settings successfully!', false)
    })
    .catch((err) => {
      console.warn(err)
      updateMsg('Update settings failed!', true)
    })
}

function handleNodesChange (e) {
  const snodes = e.target.value
  const nodes = snodes.split(Utils.separator)
  for (let i = 0; i < nodes.length; i++) {
    if (!Utils.isValidNodeURL(nodes[i])) {
      updateMsg('Invalid node url!', true)
      return
    }
  }
  diodeSettings.nodes = nodes
  diodeSettings.dirty = true
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
  diodeNodesInput.value = settings.nodes.join(Utils.separator)
}

function onError (e) {
  console.error(e)
}

readSettings()
  .then(updateUI)
  .catch(onError)

diodeNodesInput.addEventListener('change', handleNodesChange)
diodeWebextBtn.addEventListener('click', handleClick)

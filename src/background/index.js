'use strict'

const Crypto = require('./Crypto')
const DiodeProtocol = require('./DiodeProtocol')
const Utils = require('./Utils')

const crypto = new Crypto()
const utils = new Utils()
const protocol = new DiodeProtocol(utils)
let diodeSettings = {
  nodes: [
    'seed-alpha.diode.io:41043',
    'seed-beta.diode.io:41043',
    'seed-gamma.diode.io:41043'
  ],
  certPath: {
    path: '',
    requested: false,
    fileData: ''
  },
  privKeyPath: {
    path: '',
    requested: false,
    fileData: ''
  },
  requestedDirs: []
}
const filePermissions = {
  read: true,
  write: false,
  watch: false
}

function initializePageAction (tab) {
  if (utils.isDiodeURL(tab.url)) {
    browser.pageAction.setIcon({ tabId: tab.id, path: '../icons/diode.png' })
    browser.pageAction.setTitle({ tabId: tab.id, title: 'diode connected' })
    browser.pageAction.show(tab.id)
  }
}

// handle runtime message
async function handleMessage (message, sender) {
  if (message === 'get.settings') {
    const storedSettings = await browser.storage.local.get()
    if (typeof storedSettings.diode !== 'undefined') {
      return storedSettings.diode
    }
    return diodeSettings
  } else if (message === 'read.setting.files') {
    const storedSettings = await browser.storage.local.get()
    if (typeof storedSettings.diode !== 'undefined') {
      const { FileSystem } = browser
      const decoder = new TextDecoder('utf8')
      diodeSettings = storedSettings.diode
      // read cert
      const certDir = utils.dirname(diodeSettings.certPath.path)
      if (diodeSettings.requestedDirs.indexOf(certDir) < 0) {
        const certVolume = await FileSystem.mount(Object.assign(filePermissions, { url: certDir }))
        diodeSettings.requestedDirs.push(certDir)
      }
      const certData = await FileSystem.readFile(diodeSettings.certPath.path)
      console.log('cert', decoder.decode(new Uint8Array(certData)))
      // read privkey
      const privKeyDir = utils.dirname(diodeSettings.privKeyPath.path)
      if (diodeSettings.requestedDirs.indexOf(privKeyDir) < 0) {
        const privKeyVolume = await FileSystem.mount(Object.assign(filePermissions, { url: privKeyDir }))
        diodeSettings.requestedDirs.push(privKeyDir)
      }
      const privKeyData = await FileSystem.readFile(diodeSettings.certPath.path)
      console.log('privkey', decoder.decode(new Uint8Array(privKeyData)))
    }
  }
}
browser.runtime.onMessage.addListener(handleMessage)

// handle page action
// async function handlePageActionClicked(tab) {
// }
// browser.pageAction.onClicked.addListener(handlePageActionClicked);

function handleTabsUpdated (id, changeInfo, tab) {
  initializePageAction(tab)
}
browser.tabs.onUpdated.addListener(handleTabsUpdated)

browser.storage.local.get()
  .then((storedSettings) => {
    if (!storedSettings.diode) {
      browser.storage.local.set({ diode: diodeSettings })
    }
  })

browser.tabs.query({}).then((tabs) => {
  for (const tab of tabs) {
    initializePageAction(tab)
  }
})

browser.protocol.registerProtocol('web3', function (request) {
  return protocol.handleRequest(request)
})

window.addEventListener('beforeunload', () => {
  crypto.destroy()
})

crypto.init()

window.Crypto = crypto
window.Utils = utils

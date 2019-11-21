'use strict'

const Crypto = require('./Crypto')
const DiodeProtocol = require('./DiodeProtocol')
const Utils = require('./Utils')
const KeyStore = require('./Keystore')

const crypto = new Crypto()
const utils = new Utils()
const protocol = new DiodeProtocol(utils)
const keystore = new KeyStore(utils)

const diodeSettings = {
  nodes: [
    'seed-alpha.diode.io:41043',
    'seed-beta.diode.io:41043',
    'seed-gamma.diode.io:41043'
  ],
  wallet: {
    v3: ''
  }
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
  if (typeof message !== 'object' || !message || typeof message.cmd === 'undefined') {
    console.warn('Unknown message: ', message)
    return
  }
  const { cmd } = message
  if (cmd === 'get.settings') {
    const storedSettings = await browser.storage.local.get()
    if (utils.isArray(storedSettings.nodes)) {
      diodeSettings.nodes = storedSettings.nodes
    }
    const returnedSettings = {}
    returnedSettings.nodes = diodeSettings.nodes
    return returnedSettings
  } else if (cmd === 'set.settings') {
    const { settings } = message
    if (!utils.isObject(settings) || !utils.isArray(settings.nodes)) {
      return
    }
    return browser.storage.local.set({ nodes: settings.nodes })
  } else if (cmd === 'read.wallet') {
    const { password } = message
    if (!Utils.isString(password) || password.length < 1) {
      return
    }
    if (diodeSettings.wallet.v3.length < 1) {
      return
    }
    keystore.fromV3(diodeSettings.wallet.v3, password)
    return keystore
  } else if (cmd === 'save.wallet') {
    const { password } = message
    if (!Utils.isString(password) || password.length < 1) {
      return
    }
    if (diodeSettings.wallet.v3.length > 0) {
      return
    }
    diodeSettings.wallet.v3 = keystore.toV3(diodeSettings.wallet.v3, password)
    console.log(diodeSettings.wallet.v3)
    // return browser.storage.set({ wallet: diodeSettings.wallet })
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

browser.storage.local.get().then((storedSettings) => {
  if (!utils.isArray(storedSettings.nodes)) {
    browser.storage.local.set({ nodes: diodeSettings.nodes })
  }
  if (!utils.isObject(storedSettings.wallet)) {
    browser.storage.local.set({ wallet: diodeSettings.wallet })
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
// window.Keystore = keystore

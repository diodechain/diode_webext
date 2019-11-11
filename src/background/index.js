'use strict'

const Crypto = require('./Crypto')
const DiodeProtocol = require('./DiodeProtocol')
const Utils = require('./Utils')

const crypto = new Crypto()
const utils = new Utils()
const protocol = new DiodeProtocol(utils)
const defaultDiode = {
  nodes: [
    'seed-alpha.diode.io:41043',
    'seed-beta.diode.io:41043',
    'seed-gamma.diode.io:41043'
  ],
  certPath: '',
  privKeyPath: ''
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
    return defaultDiode
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
      browser.storage.local.set({ diode: defaultDiode })
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

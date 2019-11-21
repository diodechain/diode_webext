'use strict'

const diodePasswordInput = document.querySelector('#diode-password')
const diodeWebextBtn = document.querySelector('#diode-webext-popup-button')

async function handleClick (e) {
  e.preventDefault()
  const keystore = await browser.runtime.sendMessage({
    cmd: 'read.wallet'
  })
  console.log(keystore)
}
diodeWebextBtn.addEventListener('click', handleClick)

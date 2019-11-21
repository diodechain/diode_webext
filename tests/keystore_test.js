const test = require('tape')
const Utils = require('../src/background/Utils')
const Keystore = require('../src/background/Keystore')
const Constants = require('../src/background/Constants')

test('Test keystore module in background', async (t) => {
  const keystore = new Keystore(new Utils())
  let wMnemonic = ''
  let wAddress = ''
  let wChecksumAddress = ''
  let wPublicKey = ''
  let wv3Wallet = ''

  t.test('Throw ERR_NO_WALLET_IN_KEYSTORE because there is no wallet', (st) => {
    st.throws(keystore.getPublicKey, Constants.ERR_NO_WALLET_IN_KEYSTORE)
    st.throws(keystore.getAddress, Constants.ERR_NO_WALLET_IN_KEYSTORE)
    st.throws(keystore.getChecksumAddressString, Constants.ERR_NO_WALLET_IN_KEYSTORE)
    st.throws(keystore.toV3, Constants.ERR_NO_WALLET_IN_KEYSTORE)
    st.throws(keystore.decodeV3, Constants.ERR_NO_WALLET_IN_KEYSTORE)
    st.end()
  })

  t.test('Should generate a wallet and return mnemonic', (st) => {
    st.throws(keystore.generate, Constants.ERR_PASSWORD_IS_REQUIRED)
    const { mnemonic } = keystore.generate('diodechain')
    st.ok(keystore.validMnemonic(mnemonic))
    wMnemonic = mnemonic
    wAddress = keystore.getAddress()
    wChecksumAddress = keystore.getChecksumAddressString()
    wPublicKey = keystore.getPublicKey()
    wv3Wallet = keystore.v3Wallet
    st.end()
  })

  t.test('Should clean keystore, and keep v3wallet', (st) => {
    keystore.clearWallet()
    st.throws(keystore.getPublicKey, Constants.ERR_NO_WALLET_IN_KEYSTORE)
    st.throws(keystore.getAddress, Constants.ERR_NO_WALLET_IN_KEYSTORE)
    st.throws(keystore.getChecksumAddressString, Constants.ERR_NO_WALLET_IN_KEYSTORE)
    st.throws(keystore.toV3, Constants.ERR_NO_WALLET_IN_KEYSTORE)
    st.end()
  })

  t.test('Should not decode v3wallet in keystore', (st) => {
    st.throws(keystore.decodeV3.bind(keystore, 'diodechain2'), new Error('Key derivation failed - possibly wrong passphrase'))
    st.end()
  })

  t.test('Should decode v3wallet in keystore', (st) => {
    keystore.decodeV3('diodechain')
    st.equal(wAddress, keystore.getAddress())
    st.equal(wChecksumAddress, keystore.getChecksumAddressString())
    st.equal(wPublicKey, keystore.getPublicKey())
    st.end()
  })

  t.test('Should generate same wallet from mnemonic', (st) => {
    const keystore2 = new Keystore(new Utils())
    keystore2.generate('hellofromdiodechain', wMnemonic)
    st.equal(wAddress, keystore2.getAddress())
    st.equal(wChecksumAddress, keystore2.getChecksumAddressString())
    st.equal(wPublicKey, keystore2.getPublicKey())
    st.end()
  })

  t.test('Should generate same wallet from v3wallet', (st) => {
    const keystore3 = new Keystore(new Utils())
    keystore3.fromV3(wv3Wallet, 'diodechain')
    st.equal(wAddress, keystore3.getAddress())
    st.equal(wChecksumAddress, keystore3.getChecksumAddressString())
    st.equal(wPublicKey, keystore3.getPublicKey())
    st.end()
  })
  t.end()
})

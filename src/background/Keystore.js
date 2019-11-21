'use strict'
const EthjsWallet = require('ethereumjs-wallet')
const HDKey = require('ethereumjs-wallet/hdkey')
const BIP39 = require('bip39')
const Wordlist = BIP39.wordlists.EN
const Constants = require('./Constants')

// TODO: check seed length (12, 24?)
// encrypt v3 wallet?
class Keystore {
  constructor (utils) {
    this.utils = utils
    this.v3Wallet = ''
    this.wallet = undefined
    this.hdkey = undefined
    this.defaultHDPath = 'm/44\'/60\'/0\'0'
  }

  generate (password, mnemonic) {
    if (!this.utils.isString(password)) {
      throw Constants.ERR_PASSWORD_IS_REQUIRED
    }
    if (!mnemonic || !this.validMnemonic(mnemonic)) {
      mnemonic = BIP39.generateMnemonic()
    }
    // const randomSeed = BIP39.mnemonicToSeedSync(mnemonic, password)
    const randomSeed = BIP39.mnemonicToSeedSync(mnemonic)
    const hdKey = HDKey.fromMasterSeed(randomSeed)
    const _hdKey = hdKey.derivePath(this.defaultHDPath)
    this.wallet = _hdKey.getWallet()
    this.v3Wallet = JSON.stringify(this.toV3(password))
    return { mnemonic }
  }

  getPublicKey () {
    if (!this.utils.isWallet(this.wallet)) {
      throw Constants.ERR_NO_WALLET_IN_KEYSTORE
    }
    return this.wallet.getPublicKey().toString('hex')
  }

  getAddress () {
    if (!this.utils.isWallet(this.wallet)) {
      throw Constants.ERR_NO_WALLET_IN_KEYSTORE
    }
    return this.wallet.getAddress().toString('hex')
  }

  getChecksumAddressString () {
    if (!this.utils.isWallet(this.wallet)) {
      throw Constants.ERR_NO_WALLET_IN_KEYSTORE
    }
    return this.wallet.getChecksumAddressString()
  }

  toV3 (password) {
    if (!this.utils.isWallet(this.wallet)) {
      throw Constants.ERR_NO_WALLET_IN_KEYSTORE
    }
    if (!this.utils.isString(password)) {
      throw Constants.ERR_PASSWORD_IS_REQUIRED
    }
    // TODO check options:
    // const v3Defaults: V3ParamsStrict = {
    //   cipher: 'aes-128-ctr',
    //   kdf: 'scrypt',
    //   salt: randomBytes(32),
    //   iv: randomBytes(16),
    //   uuid: randomBytes(16),
    //   dklen: 32,
    //   c: 262144,
    //   n: 262144,
    //   r: 8,
    //   p: 1,
    // }
    return this.wallet.toV3(password)
  }

  fromV3 (v3Wallet, password) {
    if (!this.utils.isString(v3Wallet)) {
      throw Constants.ERR_V3WALLET_IS_REQUIRED
    }
    if (!this.utils.isString(password)) {
      throw Constants.ERR_PASSWORD_IS_REQUIRED
    }
    this.v3Wallet = v3Wallet
    this.wallet = EthjsWallet.fromV3(v3Wallet, password, false)
  }

  // remove wallet periodically if there is a v3 wallet
  clearWallet () {
    if (this.utils.isString(this.v3Wallet)) {
      this.wallet = undefined
    }
  }

  decodeV3 (password) {
    if (!this.utils.isString(this.v3Wallet)) {
      throw Constants.ERR_NO_V3WALLET_IN_KEYSTORE
    }
    if (!this.utils.isString(password)) {
      throw Constants.ERR_PASSWORD_IS_REQUIRED
    }
    this.wallet = EthjsWallet.fromV3(this.v3Wallet, password, false)
  }

  // TODO:
  // verify (sig) {}
  // sign (msg) {}
  // getCert (certOptions) {
  //   return certOptions
  // }

  validMnemonic (mnemonic) {
    if (!this.utils.isString(mnemonic)) {
      return false
    }
    return BIP39.validateMnemonic(mnemonic, Wordlist)
  }
}

module.exports = Keystore

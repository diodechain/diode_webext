const Secp256k1 = require('js-secp256k1/dist/node-bundle');
const KeccakTiny = require('js-keccak-tiny/dist/node-bundle');
const Constants = require('./Constants');

class Crypto {
  constructor () {
    this.secp256k1_initialized = false;
    this.keccakTiny_initialized = false;
    this.secp256k1 = {};
    this.keccakTiny = {};
  }

  async init() {
    try {
      this.secp256k1 = await Secp256k1();
      this.secp256k1_initialized = true;
      this.keccakTiny = await KeccakTiny();
      this.keccakTiny_initialized = true;
    } catch (err) {
      this.destroy()
    }
  }

  sign (msg, privkey) {
    if (this.secp256k1_initialized === false) {
      throw Constants.ERR_SECP256K1_NOT_INITIALIZED;
    }
    return this.secp256k1.sign(msg, privkey);
  }

  recover (msg, sig, recid) {
    if (this.secp256k1_initialized === false) {
      throw Constants.ERR_SECP256K1_NOT_INITIALIZED;
    }
    return this.secp256k1.recover(msg, sig, recid);
  }

  verify (msg, sig, pubkey) {
    if (this.secp256k1_initialized === false) {
      throw Constants.ERR_SECP256K1_NOT_INITIALIZED;
    }
    return this.secp256k1.recover(msg, sig, pubkey);
  }

  privToPub (privkey) {
    if (this.secp256k1_initialized === false) {
      throw Constants.ERR_SECP256K1_NOT_INITIALIZED;
    }
    return this.secp256k1.privkeyToPubkey(privkey);
  }

  sha3 (msg) {
    if (this.keccakTiny_initialized === false) {
      throw Constants.ERR_KECCAKTINY_NOT_INITIALIZED;
    }
    return this.keccakTiny.keccak256(msg);
  }

  destroy () {
    if (this.secp256k1_initialized) {
      this.secp256k1.destroy();
      this.secp256k1 = {};
      this.secp256k1_initialized = false;
    }
    if (this.keccakTiny_initialized) {
      // this.sha3.destroy();
      this.keccakTiny = {};
      this.keccakTiny_initialized = false;
    }
  }
}

module.exports = Crypto;
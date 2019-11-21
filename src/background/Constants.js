'use strict'

module.exports = {
  ERR_SECP256K1_NOT_INITIALIZED: new Error('Secp256k1 was not initialized'),
  ERR_KECCAKTINY_NOT_INITIALIZED: new Error('Keccak tiny was not initialized'),
  ERR_KEYSTORE_NOT_DECRYPTED: new Error('Keystore was not decrypted'),
  ERR_NO_WALLET_IN_KEYSTORE: new Error('There is no wallet in keystore'),
  ERR_NO_V3WALLET_IN_KEYSTORE: new Error('There is no wallet v3 in keystore'),
  ERR_V3WALLET_IS_REQUIRED: new Error('Wallet V3 is required'),
  ERR_PASSWORD_IS_REQUIRED: new Error('Password is required')
}

'use strict'

const path = require('path')

// TODO: Add address checksum
// TODO: validate different os file path?
class Utils {
  constructor () {
    this.hexPattern = /^(0x)?[0-9a-fA-F]+/
    this.diodeAddressPattern = /^(0x)?[0-9a-fA-F]{40}/
    this.diodeURLPattern = /^web3:\/\/([rws]{1,3}.)?(0x[0-9a-fA-F]{40}).diode(.ws)?(:[\d]{0,5})?/
    this.filePathPattern = /^file:\/\/[\w/]+/
    // this.uriPattern = /(?:([^:\/?#]+):)?(?:\/\/([^\/?#]*))?([^?#]*)(?:\?([^#]*))?(?:#(.*))?/
    this.uriPattern = /^([\w]+:\/\/)?(.+):([\d]{0,5})$/
    this.separator = ';'
  }

  isNumber (src) {
    const srcType = typeof src
    return (srcType !== 'undefined') && (srcType === 'number') && (src.toString() !== 'NaN')
  }

  isString (src) {
    const srcType = typeof src
    return (srcType !== 'undefined') && (srcType === 'string')
  }

  isObject (src) {
    const srcType = typeof src
    return (srcType === 'object') && (src !== null) && (src.constructor.name === 'Object')
  }

  isArray (src) {
    const srcType = typeof src
    return (srcType === 'object') && (src !== null) && (src.constructor.name === 'Array')
  }

  isWallet (src) {
    const srcType = typeof src
    return (srcType === 'object') && (src !== null) && (src.constructor.name === 'Wallet')
  }

  isHex (src) {
    if (!this.isString(src)) {
      return false
    }
    return this.hexPattern.test(src)
  }

  isDiodeAddress (src) {
    if (!this.isString(src)) {
      return false
    }
    return this.diodeAddressPattern.test(src)
  }

  isDiodeURL (src) {
    if (!this.isString(src)) {
      return false
    }
    return this.diodeURLPattern.test(src)
  }

  parseDiodeURL (src) {
    if (!this.isString(src)) {
      return false
    }
    const parsed = this.diodeURLPattern.exec(src)
    const res = {
      // default mode is rw
      mode: 'rw',
      address: '',
      isWS: false,
      port: 0
    }
    // null
    if (!parsed) {
      return false
    }
    const mode = parsed[1]
    const address = parsed[2]
    const ws = parsed[3]
    const port = parsed[4]
    if (this.isString(mode)) {
      if (mode.length > 1) {
        res.mode = mode.substr(0, mode.length - 1)
      }
    }
    if (this.isString(address)) {
      res.address = address
    }
    if (this.isString(ws)) {
      res.isWS = true
    }
    if (this.isString(port)) {
      if (port.length > 1) {
        res.port = parseInt(port.substr(1))
      }
    }
    return res
  }

  isValidFilePath (src) {
    if (!this.isString(src)) {
      return false
    }
    return this.filePathPattern.test(src)
  }

  isValidNodeURL (src) {
    if (!this.isString(src)) {
      return false
    }
    const splitted = this.uriPattern.exec(src)
    if (!this.isArray(splitted)) {
      return false
    }
    const authority = splitted[2]
    const port = splitted[3]
    return this.isString(authority) && this.isString(port)
  }

  dirname (src) {
    return path.dirname(src)
  }
}

module.exports = Utils

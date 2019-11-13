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
  }

  isNumber (src) {
    const srcType = typeof src
    return (srcType !== 'undefined') && (srcType === 'number') && (src.toString() !== 'NaN')
  }

  isString (src) {
    const srcType = typeof src
    return (srcType !== 'undefined') && (srcType === 'string')
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
    if (this.isString(parsed[1])) {
      if (parsed[1].length > 1) {
        res.mode = parsed[1].substr(0, parsed[1].length - 1)
      }
    }
    if (this.isString(parsed[2])) {
      res.address = parsed[2]
    }
    if (this.isString(parsed[3])) {
      res.isWS = true
    }
    if (this.isString(parsed[4])) {
      if (parsed[4].length > 1) {
        res.port = parseInt(parsed[4].substr(1))
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

  dirname (src) {
    return path.dirname(src)
  }
}

module.exports = Utils

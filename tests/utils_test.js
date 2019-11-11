const test = require('tape')
const Utils = require('../src/background/Utils')

test('Test utils module in background', (t) => {
  const utils = new Utils()

  t.test('isNumber', (st) => {
    const tests = [{
      src: '',
      res: false
    }, {
      src: undefined,
      res: false
    }, {
      src: NaN,
      res: false
    }, {
      src: null,
      res: false
    }, {
      src: {},
      res: false
    }, {
      src: [],
      res: false
    }, {
      src: 0,
      res: true
    }, {
      src: -1.1,
      res: true
    }]
    for (let i = 0; i < tests.length; i++) {
      st.equal(utils.isNumber(tests[i].src), tests[i].res)
    }
    st.end()
  })

  t.test('isString', (st) => {
    const tests = [{
      src: '',
      res: true
    }, {
      src: undefined,
      res: false
    }, {
      src: NaN,
      res: false
    }, {
      src: null,
      res: false
    }, {
      src: {},
      res: false
    }, {
      src: [],
      res: false
    }, {
      src: 0,
      res: false
    }]
    for (let i = 0; i < tests.length; i++) {
      st.equal(utils.isString(tests[i].src), tests[i].res)
    }
    st.end()
  })

  t.test('isHex', (st) => {
    const tests = [{
      src: 'gg',
      res: false
    }, {
      src: '0xaB',
      res: true
    }, {
      src: 'abCD',
      res: true
    }]
    for (let i = 0; i < tests.length; i++) {
      st.equal(utils.isHex(tests[i].src), tests[i].res)
    }
    st.end()
  })

  t.test('isDiodeAddress', (st) => {
    const tests = [{
      src: '0xgg08db74162847051c30084f316ef482954ec224',
      res: false
    }, {
      src: '0x0808db74162847051c30084f316ef482954ec224',
      res: true
    }, {
      src: '0808db74162847051c30084f316ef482954ec224',
      res: true
    }]
    for (let i = 0; i < tests.length; i++) {
      st.equal(utils.isDiodeAddress(tests[i].src), tests[i].res)
    }
    st.end()
  })

  t.test('isDiodeURL', (st) => {
    const tests = [{
      src: 'web3://rw.0xgg08db74162847051c30084f316ef482954ec224',
      res: false
    }, {
      src: 'web3://r.0x0808db74162847051c30084f316ef482954ec224.diode/index',
      res: true
    }, {
      src: 'web3://0x0808db74162847051c30084f316ef482954ec224.diode:8080/index',
      res: true
    }, {
      src: 'web3://rws.0x0808db74162847051c30084f316ef482954ec224.diode.ws/index',
      res: true
    }, {
      src: 'web3://0x0808db74162847051c30084f316ef482954ec224.diode.ws:8080/index',
      res: true
    }]
    for (let i = 0; i < tests.length; i++) {
      st.equal(utils.isDiodeURL(tests[i].src), tests[i].res)
    }
    st.end()
  })

  t.test('parseDiodeURL', (st) => {
    const tests = [{
      src: 'web3://rw.0xgg08db74162847051c30084f316ef482954ec224',
      res: false
    }, {
      src: 'web3://r.0x0808db74162847051c30084f316ef482954ec224.diode/index',
      res: {
        mode: 'r',
        address: '0x0808db74162847051c30084f316ef482954ec224',
        isWS: false,
        port: 0
      }
    }, {
      src: 'web3://0x0808db74162847051c30084f316ef482954ec224.diode:8080/index',
      res: {
        mode: 'rw',
        address: '0x0808db74162847051c30084f316ef482954ec224',
        isWS: false,
        port: 8080
      }
    }, {
      src: 'web3://rws.0x0808db74162847051c30084f316ef482954ec224.diode.ws/index',
      res: {
        mode: 'rws',
        address: '0x0808db74162847051c30084f316ef482954ec224',
        isWS: true,
        port: 0
      }
    }, {
      src: 'web3://0x0808db74162847051c30084f316ef482954ec224.diode.ws:8080/index',
      res: {
        mode: 'rw',
        address: '0x0808db74162847051c30084f316ef482954ec224',
        isWS: true,
        port: 8080
      }
    }]
    for (let i = 0; i < tests.length; i++) {
      st.deepEqual(utils.parseDiodeURL(tests[i].src), tests[i].res)
    }
    st.end()
  })

  t.end()
})

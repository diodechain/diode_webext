'use strict'

class DiodeProtocol {
  constructor (utils) {
    this.utils = utils
  }

  handleRequest (request) {
    switch (request.url) {
      case 'web3://diode.io': {
        return fetch('https://diode.io')
          .then((res) => {
            const reader = res.body.getReader()
            const body = new ReadableStream({
              start (controller) {
                function readStream () {
                  return reader.read().then(({ done, value }) => {
                    if (done) {
                      return controller.close()
                    }
                    controller.enqueue(value)
                    readStream()
                  }).catch((err) => {
                    console.log(err)
                    return controller.close()
                  })
                }
                return readStream()
              }
            })
            return new Response(body, {
              headers: { 'content-type': 'text/html;charset=utf-8' }
            })
          })
          .catch((err) => {
            const body = new ReadableStream({
              start (controller) {
                controller.enqueue('<h1>Error</h1>\n')
                controller.enqueue(`<p>${err.message}<p>`)
                controller.close()
              }
            })

            return new Response(body, {
              headers: {
                'content-type': 'text/html'
              }
            })
          })
      }
      default: {
        const res = this.utils.parseDiodeURL(request.url)
        let data = `<div><h1>Test for experimental diodechain protocol!</h1></div>
        <p>You are visiting <strong>${
          request.url
        }</strong></p>`
        if (res !== false) {
          data += `<p><strong>mode: ${res.mode}</strong></p><p><strong>address: ${res.address}</strong></p><p><strong>Is ws: ${res.isWS}</strong></p><p><strong>port: ${res.port}</strong></p>`
        }
        const body = new ReadableStream({
          start (controller) {
            controller.enqueue(data)
            controller.close()
          }
        })

        return new Response(body, {
          headers: {
            'content-type': 'text/html'
          }
        })
      }
    }
  }
}

module.exports = DiodeProtocol

window.addEventListener('load', init, false)


let socket = require('./../socket-client')

function init() {

    try {
        // Fix up for prefixing
        window.AudioContext = window.AudioContext || window.webkitAudioContext
        context = new AudioContext()
    } catch (e) {
        alert('Web Audio API is not supported in this browser')
    }

    let page = require('./demo-chat-test/simple/index.js')
    page.start(context, socket)
  }

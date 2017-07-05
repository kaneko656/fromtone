// init.js

const express = require('express')
const bodyParser = require('body-parser')

let app
let server
let defaultPort = 8000

let api = null
let webhook = null
let socket = null

let init = {
    server: false,
    api: false,
    webhook: false,
    socket: false
}
// server初期化
exports.initialize = (port) => {
    init.server = true
    app = express()
    server = app.listen(process.env.PORT || port || defaultPort, () => {
        console.log('start server listening')
    })

    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({
        extended: true
    }))
}

exports.app = () => {
    return app
}

exports.server = () => {
    return server
}

// API
exports.api = () => {
    if (!init.server) {
        module.exports.initialize()
        init.server = true
    }

    if (!init.api) {
        api = require('./caller/api.js')
        api.init(app)
        init.api = true
    }
    return api.Call()
}

// Webhook
exports.webhook = () => {
    if (!init.server) {
        module.exports.initialize()
        init.server = true
    }

    if (!init.webhook) {
        webhook = require('./caller/webhook.js')
        webhook.init(app)
        init.webhook = true
    }
    return webhook.Call()
}

// socket
exports.socket = () => {
    if (!init.server) {
        module.exports.initialize()
        init.server = true
    }

    if (!init.socket) {
        socket = require('./caller/socket.js')
        socket.init(server)
        init.socket = true
    }
    return socket
}

// init.js

const express = require('express')
const bodyParser = require('body-parser')

// server初期化
exports.initialize = (port) => {
    app = express()
    server = app.listen(process.env.PORT || port || defaultPort, () => {
        console.log('start server listening')
    })

    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({
        extended: true
    }))

    return {
        app: app,
        server: server
    }
}

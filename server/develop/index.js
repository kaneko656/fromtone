const app = require('./app.js')
const socketio = require('socket.io')
const ntp = require('./ntp.js')
const page = require('./../../server-module/page/index.js')
const localAddress = require('./localAddress.js')

let server = app.initialize(8001)
let io = socketio.listen(server.server)
page.init(server.app)
console.log(localAddress.toURL(8001))
console.log('ngrok', 'https://ad44ac79.ngrok.io')


io.sockets.on('connection', (clientSocket) => {
    const develop = require('./develop.js')

    // callback when disconnect
    let disconnectEvent = []
    clientSocket.on('disconnect', () => {
        disconnectEvent.forEach((e) => {
            e('disconnect')
        })
    })
    // function
    let disconnect = (callback = () => {}) => {
        disconnectEvent.push(callback)
    }

    // server-client時刻同期
    clientSocket.on('ntp_server', (body) => {
        body.st = serverTime()
        clientSocket.emit('ntp_server', body)
    })

    // main
    develop.start(clientSocket, disconnect, serverTime)
})

// server時刻と標準時刻との同期
let dateDiff = 0
ntp((diff) => {
    dateDiff = diff
})

let serverTime = () => {
    return Date.now() + dateDiff
}

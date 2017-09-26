const appjs = require('./app.js')
const socketio = require('socket.io')
const ntp = require('./ntp.js')
const page = require('./../../server-module/page/index.js')
const localAddress = require('./localAddress.js')

// WebRTC  peerjs
const ExpressPeerServer = require('./peer').ExpressPeerServer

let appInit = appjs.initialize(8001)
let server = appInit.server
let app = appInit.app


page.init(app)
console.log(localAddress.toURL(8001))
let ngrokID = process.argv[2] || '::'
console.log('ngrok', 'http://' + ngrokID + '.ngrok.io')

// app.use('/peer', ExpressPeerServer(server, {
//     debug: 2
// }))

let io = socketio.listen(server)
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

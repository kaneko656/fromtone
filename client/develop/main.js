// サーバ
let socket = require('./webSocket/socketClient.js')

// 共有
// データ共有
let shareData = require('./../connect.js')
// イベント共有
let eventListener = require('./Call').Call()

let socketRoot = 'develop/'

exports.start = (clientData) => {
    socket.ntp.repeat(60000)

    let updater = socket.initRegister(socketRoot, clientData)

    socket.connect(() => {
        console.log('connect')
    })

    setTimeout(() => {
        clientData.value = Math.floor(Math.random() * 10)
        updater(clientData)
    }, 2000)


}

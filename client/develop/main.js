// サーバ
let socket = require('./webSocket/socketClient.js')

// 共有
// データ共有
let shareData = require('./../connect.js')
// イベント共有
let eventListener = require('./Call').Call()

let socketRoot = 'develop/'
let group = 'Serval'

let syncTone = require('./SyncTone/soundManager.js')

exports.start = (clientData) => {
    socket.ntp.repeat(60000)

    let updater = socket.initRegister(socketRoot, group, clientData)

    socket.connecting((url) => {
        console.log('connecting: ' + url)
    })

    socket.connect((url) => {
        console.log('connect: ' + url)
    })

    socket.disconnect((url) => {
        console.log('disconnect: ' + url)
    })

    setTimeout(() => {
        clientData.value = Math.floor(Math.random() * 10)
        updater(clientData)
    }, 2000)

    socket.receiveSyncObject(socketRoot, (syncObjects) => {
        console.log(syncObjects)
    })

    let syncObject = {
        time: new Date(Date.now() + 1000).getTime(),
        events: ['serval'],
        position: {
            x: 0,
            y: 0
        }
    }
    socket.sendSyncObject(socketRoot, syncObject)
}

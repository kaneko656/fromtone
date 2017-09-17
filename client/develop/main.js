// サーバ
let socketClient = require('./webSocket/socketClient.js')

// 共有
// データ共有
let shareData = require('./../connect.js')
// イベント共有
let eventListener = require('./Call').Call()

let socketRoot = 'develop/'
let group = 'Serval'

let syncTone = require('./SyncTone/soundManager.js')

exports.start = (clientData) => {

    // socketClient.ntp.repeat(60000)
    let updater = socketClient.initRegister(socketRoot, group, clientData)

    socketClient.connecting((url) => {
        console.log('connecting... ' + url)
    })

    socketClient.connect((url) => {
        console.log('connect: ' + url)
    })

    socketClient.disconnect((url) => {
        console.log('disconnect: ' + url)
    })

    setTimeout(() => {
        clientData.value = Math.floor(Math.random() * 10)
        updater(clientData)
        socketClient.sendSyncObject(socketRoot, syncObject)
    }, 2000)

    socketClient.receiveSyncObject(socketRoot, (syncObjects) => {
        console.log(syncObjects)
        socketClient.log(socketRoot, syncObjects)
    })

    let syncObject = {
        time: new Date(Date.now() + 1000).getTime(),
        events: ['serval'],
        position: {
            x: 0,
            y: 0
        }
    }

}

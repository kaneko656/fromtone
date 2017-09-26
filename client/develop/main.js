// サーバ
const client = require('./webSocket/socketClient.js')

// Sound
const sound = require('./SyncTone/soundManager.js')

// 共有
// データ共有
let shareData = require('./../connect.js')
// イベント共有
let eventListener = require('./Call').Call()

let socketRoot = 'develop/'
let group = 'Serval'

let Job = require('./Job/cron.js')

let webAR = require('./webAR')
let clientID = ''

let audioList = {
    '３音': 'lib/sound/notification-common.mp3',
    '和風メロディ': 'lib/sound/wafuringtone.mp3',
    'wind': 'lib/sound/wind8.mp3',
    'pizz_melody': 'lib/sound/pizz2_melody.mp3',
    'pizz_7': 'lib/sound/tone/pizz_C.mp3',
}

exports.start = (clientData) => {


    // client.ntp.repeat(60000)
    let updater = client.initRegister(socketRoot, group, clientData)
    client.data = clientData


    let socketConnect = {
        connect: false
    }
    let socketConnectGui

    client.connecting((url, thisClientID) => {
        console.log('connecting... ' + url)
        if (thisClientID) {
            clientID = thisClientID
            eventListener.emit('setClientID')
        }
    })

    client.connect((url, thisClientID) => {
        console.log('connect: ' + url)
        socketConnect.connect = true
        if (socketConnectGui) {
            socketConnectGui.updateDisplay()
        }
        if (thisClientID) {
            clientID = thisClientID
            eventListener.emit('setClientID')
        }
    })

    client.disconnect((url, thisClientID) => {
        console.log('disconnect: ' + url)
        socketConnect.connect = false
        if (socketConnectGui) {
            socketConnectGui.updateDisplay()
        }
    })

    // ? 非同期にすると入る
    setTimeout(() => {
        client.gui = new dat.GUI() // {width: 300}
        socketConnectGui = client.gui.add(socketConnect, 'connect')
    }, 1)

    if (clientData.user == 'debug') {
        return
    }

    // Responsive AR and VR
    webAR.start(client, sound)

    // client.gui = gui

    sound.setAudioList(audioList)
    sound.finishLoad('pizz_7', () => {
        sound.play('pizz_7')
    })

    sound.setSpeakerPosition(clientData.user, {})

    client.receiveSyncObject((syncObjects) => {
        receive(syncObjects)
    })

    client.getSyncObjectBuffer((syncObjects) => {
        receive(syncObjects)
    })

    function receive(syncObjects) {
        syncObjects.forEach((syncObject) => {
            // client.log(syncObject)
        })
    }



}

eventListener.on('setClientID', () => {})

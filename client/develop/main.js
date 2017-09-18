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

let proto = require('./webAR/proto.js')
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

    sound.setAudioList(audioList)
    sound.finishLoad('pizz_7', () => {
        sound.play('pizz_7')
    })

    proto.start(client, sound)

    sound.setSpeakerPosition(clientData.user, {})



    client.connecting((url, thisClientID) => {
        console.log('connecting... ' + url)
        if (thisClientID) {
            clientID = thisClientID
            eventListener.emit('setClientID')
        }
    })

    client.connect((url, thisClientID) => {
        console.log('connect: ' + url)
        if (thisClientID) {
            clientID = thisClientID
            eventListener.emit('setClientID')
        }
    })

    client.disconnect((url, thisClientID) => {
        console.log('disconnect: ' + url)
    })


    client.receiveSyncObject((syncObjects) => {
        receive(syncObjects)
    })

    client.getSyncObjectBuffer((syncObjects) => {
        console.log('buffer', syncObjects)
        receive(syncObjects)
    })

    function receive(syncObjects) {
        syncObjects.forEach((syncObject) => {
            client.log(syncObject)
            if ('clientPosition' in syncObject.events) {
                sound.updateSpeakerPosition(syncObject.clientData.user, syncObject.position)
            }
        })
    }
}

eventListener.on('setClientID', () => {
})

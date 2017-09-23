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
    client.data = clientData

    if(clientData.user == 'debug'){
      return
    }

  
    // client.gui = gui

    sound.setAudioList(audioList)
    sound.finishLoad('pizz_7', () => {
        sound.play('pizz_7')
    })

    proto.start(client, sound)


    sound.setSpeakerPosition(clientData.user, {})

    // ? 非同期にすると入る
    setTimeout(() => {
        let data = {
            x: 0,
            y: 0,
            z: 0
        }
        let gui = new dat.GUI() // {width: 300}
        client.gui = gui
        // let folder = gui.addFolder('position')
        //folder.add( データを保持するインスタンス, 'インスタンスのプロパティ名', 最小値, 最大値 ).onChange( 変更時のイベント);
        // folder.add(data, 'x', -10.0, 10.0).step(0.001).onChange(generate)
        // folder.add(data, 'y', -100, 100).step(5).onChange(generate)
        // folder.add(data, 'z', -50, 50).options(0, 10, 20).onChange(generate)
        // folder.open()
        // console.log(folder)

        function generate() {
            let position = {
                x: data.x,
                y: data.y,
                z: data.z
            }
            console.log(position)
        }
    }, 10)



    // proto.start(client, sound)



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
        receive(syncObjects)
    })


    function receive(syncObjects) {
        syncObjects.forEach((syncObject) => {
            // client.log(syncObject)
        })
    }
}

eventListener.on('setClientID', () => {})

let uuid = require('node-uuid')
// let job = require('./../Job/cron.js')

// let Canvas = require('./canvas/canvas.js')
let Field = require('./canvas/field.js')
let NoteIcon = require('./canvas/icon-note.js')
let SpeakerIcon = require('./canvas/icon-speaker.js')
let SyncPlay = require('./sync-play.js')
let NotificationButton = require('./../demo-common/html/button-notification.js')
let RadioButton = require('./../demo-common/html/radio-button.js')
let Slider = require('./../demo-common/html/slider.js')
let SliderSingle = require('./../demo-common/html/slider-single.js')
let HtmlText = require('./html/html-text.js')
let SelectList = require('./../demo-common/html/select-list.js')
let gyro = require('./gyro.js')
let SwitchButton = require('./html/switchButton.js')
let graph = require('./graph/index.js')
let connect = require('./graph/connect.js')

// let Biquad = require('./biquad.js')

let socketDir = 'demo_orchestra_'
let socketType = 'demo_orchestra'

let config = require('./../exCall-module/config')

let homeButton = require('./../demo-common/html/homeButton.js')

// let Voice = require('./createVoice.js')(config.VOICE_TEXT_API)
// let Slack = require('./slack.js')
let soundList = {
    '３音': 'lib/sound/notification-common.mp3',
    'Violin1': 'lib/sound/orchestra/beethoven/No5_Mov3_Violin1.mp3',
    'Violin2': 'lib/sound/orchestra/beethoven/No5_Mov3_Violin2.mp3',
    'Viola': 'lib/sound/orchestra/beethoven/No5_Mov3_Viola.mp3',
    'Cello': 'lib/sound/orchestra/beethoven/No5_Mov3_Cello.mp3',
    'DoubleBass': 'lib/sound/orchestra/beethoven/No5_Mov3_DoubleBass.mp3'
    // '和風メロディ': 'lib/sound/wafuringtone.mp3',
    // 'ウィンドチャイム': 'lib/sound/windchime.mp3',
    // 'music': 'lib/sound/clock3.mp3',
    // 'voice': 'lib/sound/voice.mp3',
    // '太鼓': 'lib/sound/taiko.mp3',
    // 'コーリング': 'lib/sound/emargency_calling.mp3',
    // 'アラーム': 'lib/sound/clockbell.mp3',
    // '掃除機': 'lib/sound/cleaner.mp3',
    // '電子レンジ': 'lib/sound/microwave.mp3',
    // '扇風機': 'lib/sound/fan.mp3',
    // '洗濯機': 'lib/sound/washing.mp3',
    // 'プリンタ': 'lib/sound/printer.mp3',
    // 'ポッド注ぐ': 'lib/sound/pod.mp3',
    // '炒める': 'lib/sound/roasting.mp3',
    // '足音（走る）': 'lib/sound/dashing.mp3',
    // '足音（スリッパ）': 'lib/sound/walking.mp3',
    // '雨音': 'lib/sound/rain.mp3'
}

let soundNameList = []
for (let name in soundList) {
    soundNameList.push(name)
}

exports.start = (element, context, socket, clientTime, config) => {
    element.style.margin = '30px'

    console.log(config)

    let clientID = uuid.v4() // This is temporary. When websocket connected, this is replaced new id


    let htmlText = HtmlText(element)
    let fromList = SelectList(element, 'from', 'From')
    let toList = SelectList(element, 'to', 'To')

    let notificationButton = NotificationButton(element)

    /*
     *  SwitchButton
     */

    let switchButton = SwitchButton(element)
    switchButton.onGyroSwitch((toggle) => {
        if (!canUse) {
            switchButton.gyroButton.innerHTML = 'Can not use Gyro Sensor'
            return
        }
        gyroSwitch = toggle
    })


    let dopplerSwitch = true
    switchButton.onDopplerSwitch((toggle) => {
        dopplerSwitch = toggle
    })

    let radioButton = RadioButton(element, 'tone', 'Tone Select')
    radioButton.setList(soundNameList)
    radioButton.onSelect((name) => {
        console.log(name)
        let name2 = radioButton.getSelected()
        console.log(name == name2)
    })

    homeButton(element, config.user)
    // let canvas = Canvas(element)
    // let field = Field(canvas)

    socket.on(socketDir + 'user_list', (list) => {
        toList.setList(list)
        fromList.setList(list)
        fromList.check(config.user)
    })

    socket.on(socketDir + 'user_add', (user) => {
        toList.addUser(user)
        fromList.addUser(user)
    })

    socket.on(socketDir + 'user_remove', (user) => {
        toList.removeUser(user)
        fromList.removeUser(user)
    })

    let syncPlay = SyncPlay(context)
    let syncNoteList = {}
    let pannerList = {}
    let isPlaying = false

    // 人固定
    context.listener.setPosition(0, 0, -0.1)

    let createSyncNote = (bufferName, time, offset, duration) => {
        let music_offset = offset || 0
        duration = duration || null
        let correctionTime = clientTime.correctionServerTime(time)
        let left = correctionTime - Date.now()

        // htmlText.log.innerHTML = 'start playback after: ' + left.toFixed(4) + 'ms'

        return syncPlay.createSyncNote(bufferName, correctionTime, music_offset, duration)
    }

    /*
     * Evary EventLister are in this Method
     * socket
     * canvas
     * button
     */

    // socket

    syncPlay.loadBuffer(soundList, () => {

    })

    socket.call.on('connect', () => {
        clientID = uuid.v4()

        // field.setClientID(clientID)

        socket.emit(socketDir + 'register', {
            type: socketType,
            id: clientID,
            user: config.user
        })

        socket.on(socketDir + 'register', (body) => {
            if (body.id === clientID && body.name) {
                clientName = body.name
            }

            htmlText.status.innerHTML = 'user: ' + clientName
        })


        socket.on(socketDir + 'notification_common', (body) => {
            console.log(body)
            let from = body.from.indexOf(config.user) >= 0 ? true : false
            let to = body.to.indexOf(config.user) >= 0 ? true : false

            let fromText = ''
            body.from.forEach((n) => {
                fromText += n + ' '
            })
            let toText = ''
            body.to.forEach((n) => {
                toText += n + ' '
            })
            htmlText.log.innerHTML = 'From: ' + fromText + '　To: ' + toText
            if (!from && !to) {
                return
            }

            body.notes.forEach((note) => {
                play(body, note, from, to)
            })
        })
    })

    function play(body, note, from, to) {
        syncNote = createSyncNote(note.sound, note.time, note.offset, note.duration)
        let ev = body.editer || connect.get('editerValue')
        if (!ev) {
            ev = []
        }

        let gainNode = context.createGain()
        gainNode.connect(context.destination)

        let doppler = body.doppler

        let consol = (t, duration) => {
            htmlText.log.innerHTML = 'Volume[0-1]: ' + gainNode.gain.value.toFixed(4) + ',  Doppler: ' + syncNote.source.playbackRate.value.toFixed(4)
            // gyroLog.innerHTML = gainNode.gain.value.toFixed(4) + ', ' + syncNote.source.playbackRate.value.toFixed(4)
            setTimeout(() => {
                t += 100
                if (t < duration) {
                    consol(t, duration)
                }
            }, 100)
        }

        if (from) {
            // 別楽器を鳴らす
            for (let name in soundList) {
                if (name == note.sound || name == '３音') {
                    continue
                }
                let syncNote = createSyncNote(name, note.time, note.offset, note.duration)
                syncPlay.play(gainNode, syncNote)
            }
        }

        syncNote.started((leftTime) => {

            // ms -> s
            let duration = syncNote.duration / 1000
            // ms -> s
            let st = syncPlay.getCurrentTime() + leftTime / 1000
            consol(0, syncNote.duration + leftTime)

            // viewStart
            connect.set('viewStart', {
                duration: syncNote.duration,
                leftTime: leftTime
            })

            let position = body.position || {}

            ev.forEach((d, i) => {
                let v = d.value
                let t = d.div
                if (from) {
                    v = v
                } else if (to) {
                    v = 1 - v
                }
                if (i == 0) {
                    gainNode.gain.value = v
                }
                gainNode.gain.linearRampToValueAtTime(v, st + duration * t)

                // s
                // 0 - 1 -> 0.1
                let interT = i >= 1 ? ev[i].div - ev[i - 1].div : ev[i].div
                // 0 - duration -> duration * 0.1
                interT *= duration
                // m
                let dist = position.d || 1


                // m/s fromからtoに向かうときプラス方向
                let vs = d.velocity * dist / duration
                // km/h
                // vs = vs * 60 * 60 / 1000
                vs = vs * 3.6

                // vcos
                // 音源位置
                // from 0[m] - dist[m] to
                let meter = (1 - d.value) * dist
                let ang = 0
                let px = meter
                let py = 0
                if (position.target == 'from') {
                    let lx = position.offsetX
                    let ly = position.offsetY
                    ang = Math.atan2(ly - py, lx - px)
                }
                if (position.target == 'to') {
                    let lx = dist + position.offsetX
                    let ly = position.offsetY
                    ang = Math.atan2(ly - py, lx - px)
                }

                let rate = 340 / (340 - vs * Math.cos(ang))
                if (i == 0) {
                    gainNode.gain.value = rate
                }
                if (doppler && !isNaN(vs)) {
                    syncNote.source.playbackRate.linearRampToValueAtTime(rate, st + duration * t)
                } else {
                    syncNote.source.playbackRate.value = 1
                }
                // fromを自分とすると
                // from 1 to 0
                // マイナス方向が離れる
                // v0 = 0 観測者は静止
                // V = 340
                // let rate = 340 / (340 - vs)
                //
                // // 加速度のデータ転送がsocketなのでずれる　-> 時間差がシビアな音では厳しい
                // // あらかじめ動きのセットを送るのならセーフだけど，インタラクティブにやるのは厳しい？
            })
        })
        syncPlay.play(gainNode, syncNote)

        syncNote.finished(() => {
            notificationButton.notificationText.innerHTML = '　'
        })
    }


    // button

    notificationButton.test.onclick = () => {

        console.log('Test Play')

        // ios対策
        context.createBufferSource().start(0)

        let soundName = radioButton.getSelected()

        let note = syncPlay.createSyncNote(soundName, Date.now())
        syncPlay.play(context.destination, note)

        // htmlText.status.innerHTML = 'volume on'
    }

    notificationButton.notification.onclick = () => {
        context.createBufferSource().start(0)
        notificationButton.notificationText.innerHTML = '♪'
        let toUserList = toList.getSelectUser()
        let fromUserList = fromList.getSelectUser()
        let soundName = radioButton.getSelected()
        // let pannerValues = pannerSlider.getValues()
        // let pannerDistance = distanceSlider.getValue()
        let doppler = dopplerSwitch
        let editer = connect.get('editerValue')
        let position = connect.get('positionValue')
        console.log(position)

        console.log(toUserList)
        console.log(fromUserList)
        let body = {
            id: clientID,
            type: socketType,
            user: config.user,
            from: fromUserList,
            to: toUserList,
            sound: soundName,
            // panner: pannerValues,
            // distance: pannerDistance,
            doppler: doppler,
            editer: editer,
            position: position
        }
        console.log(body)
        socket.emit(socketDir + 'notification_common', body)
    }
}

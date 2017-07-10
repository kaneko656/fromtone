let uuid = require('node-uuid')
let job = require('./../Job/cron.js')

let Canvas = require('./canvas.js')
let Field = require('./field.js')
let SyncPlay = require('./sync-play.js')
let NoteIcon = require('./icon-note.js')
let SpeakerIcon = require('./icon-speaker.js')
let Button = require('./button.js')
let HtmlText = require('./html-text.js')

let Biquad = require('./biquad.js')

let socketDir = 'demo_accel_sensor_'
let socketType = 'demo_accel_sensor'

let homeButton = require('./../demo-common/html/homeButton.js')

let RadioButton = require('./../demo-common/html/radio-button.js')

let audioUrlList = {
    'music': 'lib/sound/clock3.mp3',
    '３音': 'lib/sound/notification-common.mp3',
    '和風メロディ': 'lib/sound/wafuringtone.mp3',
    'ウィンドチャイム': 'lib/sound/windchime.mp3',
    '太鼓': 'lib/sound/taiko.mp3',
    'コーリング': 'lib/sound/emargency_calling.mp3',
    'アラーム': 'lib/sound/clockbell.mp3',
    '掃除機': 'lib/sound/cleaner.mp3',
    '電子レンジ': 'lib/sound/microwave.mp3',
    '扇風機': 'lib/sound/fan.mp3',
    '洗濯機': 'lib/sound/washing.mp3',
    'プリンタ': 'lib/sound/printer.mp3',
    'ポッド注ぐ': 'lib/sound/pod.mp3',
    '炒める': 'lib/sound/roasting.mp3',
    '足音（走る）': 'lib/sound/dashing.mp3',
    '足音（スリッパ）': 'lib/sound/walking.mp3',
    '雨音': 'lib/sound/rain.mp3'
}

let soundList = []
for (let name in audioUrlList) {
    soundList.push(name)
}


exports.start = (element, context, socket, clientTime, user) => {
    let clientID = uuid.v4() // This is temporary. When websocket connected, this is replaced new id


    let htmlText = HtmlText(element)
    let canvas = Canvas(element)
    let field = Field(canvas)
    let button = Button(element)
    let noteIconList = []

    // Sound Select
    let soundRadioButton = RadioButton(element, 'sound', 'Sound Select')
    soundRadioButton.setList(soundList)
    // soundRadioButton.onSelect((name)=>{
    //   console.log(name)
    // })

    // Icon
    let speakerIcon = new Image(300, 300)
    speakerIcon.src = 'lib/image/speaker.png'
    field.setThisSpeaker(SpeakerIcon(speakerIcon))

    let noteIconImage = new Image(300, 300)
    noteIconImage.src = 'lib/image/note.svg'
    noteIcon = NoteIcon(noteIconImage)
    noteIcon.name = 'music'
    noteIcon.x = 0.5
    noteIcon.y = 0.5
    noteIcon.canvasW = field.w
    noteIcon.canvasH = field.h

    // let noteNoiseIcon = NoteIcon(noteIconImage)
    // noteNoiseIcon.name = 'music_noise'
    // noteNoiseIcon.x = 0.4
    // noteNoiseIcon.y = 0.4
    // noteNoiseIcon.canvasW = field.w
    // noteNoiseIcon.canvasH = field.h
    // noteNoiseIcon.setParentNote(noteIcon, {
    //     x: -0.2,
    //     y: 0
    // })

    field.setNote(noteIcon)
    // field.setNote(noteNoiseIcon)
    noteIconList.push(noteIcon)
    // noteIconList.push(noteNoiseIcon)

    homeButton(element, user)




    let syncPlay = SyncPlay(context)
    let syncNoteList = {}
    let pannerList = null
    let isPlaying = false

    let allowPlay = true
    let isStop = false
    let tempPannerPosition = {}

    // 人固定
    context.listener.setPosition(0, 0, -0.1)

    let createSyncNote = (body, bufferName, oscillator) => {
        let time = body.time
        let music_offset = body.offset
        let duration = body.duration
        let correctionTime = clientTime.correctionServerTime(time)
        let date = new Date(correctionTime)
        let left = correctionTime - Date.now()

        htmlText.log.innerHTML = 'start playback after: ' + left.toFixed(4) + 'ms'

        return syncPlay.createSyncNote(bufferName, correctionTime, music_offset, duration, oscillator)
    }

    let setCommonSyncNote = (syncNote, noteName) => {
        syncNote.started(() => {
            console.log('syncPlay: start')
            syncNoteList[noteName] = syncNote
        })

        syncNote.stoped(() => {
            console.log('syncPlay: stop')
            if (syncNoteList[noteName]) {
                delete syncNoteList[noteName]
            }
        })

        syncNote.finished(() => {
            console.log('syncPlay: finish')
            if (!isStop) {
                allowPlay = true
            }
            if (noteName in syncNoteList) {
                isPlaying = false
                syncNoteList[noteName].stop()
                field.toStopStatus(noteName)
                delete syncNoteList[noteName]
                htmlText.status.innerHTML = 'finish'
            }
        })

        return syncNote
    }

    let createIndividualPanner = (name) => {
        // if (name == 'music') {
        let gainNode = context.createGain()
        gainNode.gain.value = 6.0
        gainNode.connect(context.destination)
        let panner = createPanner(true)
        console.log(panner)
        panner.connect(gainNode)
        pannerList = panner
        return panner
        // }
        // if (name == 'music_noise') {
        //     let gainNode = context.createGain()
        //     gainNode.gain.value = 5.0
        //     gainNode.connect(context.destination)
        //     let biquad = Biquad.create(context, gainNode)
        //     let panner = createPanner(true)
        //     panner.connect(biquad)
        //     pannerList[name] = panner
        //     return panner
        // } else {
        //     let gainNode = context.createGain()
        //     gainNode.gain.value = 5.0
        //     gainNode.connect(context.destination)
        //     let panner = createPanner(true)
        //     console.log(panner)
        //     panner.connect(gainNode)
        //     pannerList[name] = panner
        //     return panner
        // }
    }

    /*
     * Evary EventLister are in this Method
     * socket
     * canvas
     * button
     */

    // socket

    syncPlay.loadBuffer(audioUrlList, () => {
        socket.on(socketDir + 'play', (body) => {
            if (!allowPlay) {
                return
            }
            allowPlay = false
            isStop = false

            htmlText.status.innerHTML = 'Playing'
            console.log('syncPlay')
            console.log(body)
            let notes = body.notes
            notes.forEach((nt) => {
                // let oscillator = null
                // if (nt.name == 'music_noise') {
                //     oscillator = BiquidOscillator.create(context, context.destination)
                // }
                syncNote = createSyncNote(body, nt.bufferName)
                syncNote = setCommonSyncNote(syncNote, nt.name)
                let panner = createIndividualPanner(nt.name)

                htmlText.log.innerHTML = 'x: 0 y:0 z:0'
                if ('x' in tempPannerPosition) {
                    htmlText.log.innerHTML = 'x:' + tempPannerPosition.x.toFixed(2) + '　y:' + tempPannerPosition.y.toFixed(2)　 + '　z:' + tempPannerPosition.z.toFixed(2)
                    panner.setPosition(tempPannerPosition.x, tempPannerPosition.y, tempPannerPosition.z)
                }

                syncPlay.play(panner, syncNote)
                field.toPlayStatus(nt.name)
                console.log(nt.name)

                syncNote.finished(() => {

                })
            })
        })

        socket.on(socketDir + 'stop', (body) => {
            for (let name in syncNoteList) {
                syncNoteList[name].stop()
                field.toStopStatus(name)
            }
            allowPlay = true
            isStop = true

            htmlText.status.innerHTML = 'Stop・・・'
        })
    })

    // noteIcon

    noteIconList.forEach((icon) => {
        icon.clicked((name) => {
            console.log('click', name)
            socket.emit(socketDir + 'surround_note_click', {
                type: socketType,
                id: clientID,
                name: name
            })
        })
    })


    socket.call.on('connect', () => {
        clientID = uuid.v4()

        field.setClientID(clientID)

        socket.emit(socketDir + 'register', {
            type: socketType,
            id: clientID
        })

        socket.on(socketDir + 'register', (body) => {
            if (body.id === clientID && body.name) {
                clientName = body.name
            }

            htmlText.log.innerHTML = 'user: ' + user
        })

        socket.on(socketDir + 'surround_speaker', (speakerList) => {
            field.setOtherSpeaker(SpeakerIcon, speakerList)
        })

        socket.on(socketDir + 'surround_note', (note) => {
            console.log(note)
            if (note.id !== clientID) {
                field.updateNote(note)
            }
        })

        socket.on(socketDir + 'surround_note_click', (body) => {
            let name = body.name || 'default'
            if (body.id == clientID) {
                if (field.notes[name].isSync) {
                    field.notes[name].isMove = true
                } else {
                    // release
                    // field.sendNoteInfoToServer(field.notes[name], true)
                }
            }
        })

        field.sendSpeakerInfo((speaker) => {
            socket.emit(socketDir + 'surround_speaker', {
                type: socketType,
                id: clientID,
                speaker: speaker
            })
        })

        field.sendNoteInfo((note) => {
            socket.emit(socketDir + 'surround_note', {
                type: socketType,
                id: clientID,
                note: note,
            })
        })

        field.pannerPosition((body) => {
            let name = body.name
            let p = body.position
            tempPannerPosition = {
                x: p.x * 20,
                y: p.y * 20,
                z: p.z
            }
            if (pannerList) {
                htmlText.log.innerHTML = 'x:' + tempPannerPosition.x.toFixed(2) + '　y:' + tempPannerPosition.y.toFixed(2)　 + '　z:' + tempPannerPosition.z.toFixed(2)

                console.log(pannerList.positionX, pannerList.positionY, pannerList.positionZ)
                pannerList.setPosition(p.x * 20, p.y * 20, p.z)
            }
        })

    })

    // canvas

    canvas.addEventListener('mousemove', function(e) {
        field.mouseMoved(e.offsetX, e.offsetY)
    })

    canvas.addEventListener('touchmove', function(e) {
        e.preventDefault()
        var rect = e.target.getBoundingClientRect()
        var x = e.changedTouches[0].clientX - rect.left
        var y = e.changedTouches[0].clientY - rect.top
        field.mouseMoved(x, y)
        return false
    })

    canvas.addEventListener('mousedown', function(e) {
        field.mousePressed(e.offsetX, e.offsetY)
    })

    canvas.addEventListener('touchstart', function(e) {
        e.preventDefault()
        var rect = e.target.getBoundingClientRect()
        var x = e.changedTouches[0].clientX - rect.left
        var y = e.changedTouches[0].clientY - rect.top
        field.mousePressed(x, y)
        return false
    })

    canvas.addEventListener('mouseup', function(e) {
        field.mouseReleased(e.offsetX, e.offsetY)
    })

    canvas.addEventListener('touchend', function(e) {
        e.preventDefault()
        var rect = e.target.getBoundingClientRect()
        var x = e.changedTouches[0].clientX - rect.left
        var y = e.changedTouches[0].clientY - rect.top
        field.mouseReleased(x, y)
        return false
    })

    // button

    button.start.onclick = () => {

        // ios対策
        context.createBufferSource().start(0)

        let name = soundRadioButton.getSelected()
        socket.emit(socketDir + 'play', {
            type: socketType,
            id: clientID,
            // duration: syncPlay.buffer['music'].duration * 1000,
            notes: [{
                bufferName: name,
                name: name
                // duration: syncPlay.buffer['music'].duration * 1000
            }]
        })

        htmlText.status.innerHTML = 'Playing'
    }

    button.stop.onclick = () => {
        // for (let name in syncNoteList) {
        //     syncNoteList[name].stop()
        //     field.toStopStatus(name)
        // }
        //
        // htmlText.status.innerHTML = 'stop・・・'
        socket.emit(socketDir + 'stop', {})

    }

    button.test.onclick = () => {

        // ios対策
        context.createBufferSource().start(0)

        let syncNote = syncPlay.createSyncNote('３音', Date.now(), 0)
        syncPlay.play(context.destination, syncNote)
    }
}


let createPanner = () => {
    var panner = context.createPanner()

    // 指向性  Gainは減衰率  InterAngleは減衰しない範囲
    panner.coneOuterGain = 0.1
    panner.coneOuterAngle = 180
    panner.coneInnerAngle = 30

    // "linear" "inverse" "exponential"
    panner.distanceModel = 'exponential'

    // 基準距離
    panner.refDistance = 1.0

    // 最大距離
    panner.maxDistance = 10000

    panner.panningModel = 'HRTF'

    // x: 左右
    // y: 上下  +が上
    // z: 奥と手前  +が手前

    // 音源　向かい合っている
    // 音源の向き
    // 音源の位置
    panner.setPosition(0, 0, 0)
    panner.setOrientation(0, 0, 1)

    return panner
}

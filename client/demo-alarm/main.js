let uuid = require('node-uuid')
let job = require('./../Job/cron.js')

let Canvas = require('./canvas.js')
let Field = require('./field.js')
let SyncPlay = require('./sync-play.js')
let NoteIcon = require('./icon-note.js')
let SpeakerIcon = require('./icon-speaker.js')
let Button = require('./button.js')
let HtmlText = require('./html-text.js')

let socketDir = 'alarm_'


exports.start = (element, context, socket, clientTime) => {
    let clientID = uuid.v4() // This is temporary. When websocket connected, this is replaced new id

    let button = Button(element)
    let htmlText = HtmlText(element)
    let canvas = Canvas(element)
    let field = Field(canvas)

    // Icon
    let speakerIcon = new Image(300, 300)
    speakerIcon.src = 'lib/image/speaker.png'
    field.setThisSpeaker(SpeakerIcon(speakerIcon))

    let noteIcon = new Image(300, 300)
    noteIcon.src = 'lib/image/note.svg'
    noteIcon = NoteIcon(noteIcon)
    noteIcon.name = 'music'
    noteIcon.x = 0.5
    noteIcon.y = 0.5
    field.setNote(noteIcon)

    let audioUrlList = {
        'music': 'lib/sound/clock3.mp3'
    }

    let syncPlay = SyncPlay(context)
    let syncNoteList = {}
    let pannerList = {}
    let isPlaying = false

    // 人固定
    context.listener.setPosition(0, 0, -0.1)


    /*
     * Evary EventLister are in this Method
     * socket
     * canvas
     * button
     */

     // socket

    syncPlay.loadBuffer(audioUrlList, () => {
        socket.on(socketDir + 'play', (body) => {
            console.log('syncPlay')
            console.log(body)
            let time = body.time
            let music_offset = body.offset
            let duration = body.duration
            let correctionTime = clientTime.correctionServerTime(time)
            let date = new Date(correctionTime)
            let left = correctionTime - Date.now()

            let noteName = 'music'
            let syncNote = syncPlay.createSyncNote(noteName, correctionTime, music_offset, duration)

            let gainNode = context.createGain()
            gainNode.gain.value = 2.0
            gainNode.connect(context.destination)
            let panner = createPanner(true)
            panner.connect(gainNode)
            pannerList['music'] = panner

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
                if (isPlaying && syncNoteList[noteName]) {
                    isPlaying = false
                    syncNoteList[noteName].stop()
                    field.toStopStatus(noteName)
                    delete syncNoteList[noteName]

                    htmlText.status.innerHTML = 'finish'
                }
            })

            syncPlay.play(panner, syncNote)
            field.toPlayStatus('music')

            htmlText.log.innerHTML = 'start playback after: ' + left.toFixed(4) + 'ms'
        })
    })

    socket.call.on('connect', () => {
        clientID = uuid.v4()

        field.setClientID(clientID)

        socket.emit(socketDir + 'register', {
            type: 'syncmusic',
            id: clientID
        })

        socket.on(socketDir + 'register', (body) => {
            if (body.id === clientID && body.name) {
                clientName = body.name
            }

            htmlText.log.innerHTML = 'username: ' + clientName
        })

        socket.on(socketDir + 'surround_speaker', (speakerList) => {
            if (field && field.setOtherSpeaker) {
                field.setOtherSpeaker(SpeakerIcon, speakerList)
            }
        })

        socket.on(socketDir + 'surround_note', (note) => {
            if (field && field.setNote && field.note && note.id !== clientID) {
                field.updateNote(note)
            }
        })

        socket.on(socketDir + 'surround_note_click', (body) => {
            if (field && field.note && body.id == clientID) {
                if (field.note.isSync) {
                    field.note.isMove = true
                } else {
                    // release
                    field.sendNoteInfoToServer(field.note, true)
                }
            }
        })

        field.sendSpeakerInfo((speaker) => {
            socket.emit(socketDir + 'surround_speaker', {
                id: clientID,
                speaker: speaker
            })
        })

        field.sendNoteInfo((note) => {
            socket.emit(socketDir + 'surround_note', {
                id: clientID,
                note: note,
            })
        })

        field.pannerPosition((body) => {
            let name = body.name
            if (pannerList[name]) {
                let p = body.position
                pannerList[name].setPosition(p.x * 10, p.y *10, p.z)
            }
        })

        noteIcon.clicked((name) => {
            socket.emit(socketDir + 'surround_note_click', {
                id: clientID,
                name: name
            })
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
        if (!isPlaying) {
            isPlaying = true

            // ios対策
            context.createBufferSource().start(0)

            socket.emit(socketDir + 'play', {
                type: 'syncmusic',
                id: clientID,
                duration: syncPlay.buffer['music'].duration * 1000
            })

            htmlText.status.innerHTML = 'playing music！'
        }

    }

    button.stop.onclick = () => {
        if (isPlaying) {
            isPlaying = false
            if (syncNoteList['music']) {
                syncNoteList['music'].stop()
                field.toStopStatus('music')
            }

            htmlText.status.innerHTML = 'stop・・・'
        }
    }
}


let createPanner = (side = 'from') => {
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

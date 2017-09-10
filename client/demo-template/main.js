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

let socketDir = 'demo_motivation_'
let socketType = 'demo_motivation'


exports.start = (element, context, socket, clientTime) => {
    let clientID = uuid.v4() // This is temporary. When websocket connected, this is replaced new id

    let button = Button(element)
    let htmlText = HtmlText(element)
    let canvas = Canvas(element)
    let field = Field(canvas)
    let noteIconList = []

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
    let noteNoiseIcon = NoteIcon(noteIconImage)
    noteNoiseIcon.name = 'music_noise'
    noteNoiseIcon.x = 0.4
    noteNoiseIcon.y = 0.4

    field.setNote(noteIcon)
    field.setNote(noteNoiseIcon)
    noteIconList.push(noteIcon)
    noteIconList.push(noteNoiseIcon)


    let audioUrlList = {
        'music': 'lib/sound/clock3.mp3'
    }

    let syncPlay = SyncPlay(context)
    let syncNoteList = {}
    let pannerList = {}
    let isPlaying = false

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
            if (isPlaying && syncNoteList[noteName]) {
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
        if (name == 'music') {
            let gainNode = context.createGain()
            gainNode.gain.value = 2.0
            gainNode.connect(context.destination)
            let panner = createPanner(true)
            console.log(panner)
            panner.connect(gainNode)
            pannerList[name] = panner
            return panner
        }
        if (name == 'music_noise') {
            let gainNode = context.createGain()
            gainNode.gain.value = 2.0
            gainNode.connect(context.destination)
            let biquad = Biquad.create(context, gainNode)
            let panner = createPanner(true)
            panner.connect(biquad)
            pannerList[name] = panner
            return panner
        }
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
            console.log('syncPlay')
            console.log(body)
            let notes = body.notes
            console.log(notes)
            notes.forEach((nt) => {
                // let oscillator = null
                // if (nt.name == 'music_noise') {
                //     oscillator = BiquidOscillator.create(context, context.destination)
                // }
                syncNote = createSyncNote(body, nt.bufferName)
                syncNote = setCommonSyncNote(syncNote, nt.name)
                let panner = createIndividualPanner(nt.name)
                syncPlay.play(panner, syncNote)
                field.toPlayStatus(nt.name)
                console.log(nt.name)
            })
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

            htmlText.log.innerHTML = 'username: ' + clientName
        })

        socket.on(socketDir + 'surround_speaker', (speakerList) => {
            field.setOtherSpeaker(SpeakerIcon, speakerList)
        })

        socket.on(socketDir + 'surround_note', (note) => {
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
            if (pannerList[name]) {
                let p = body.position
                pannerList[name].setPosition(p.x * 10, p.y * 10, p.z)
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

        socket.emit(socketDir + 'play', {
            type: socketType,
            id: clientID,
            duration: syncPlay.buffer['music'].duration * 1000,
            notes: [{
                bufferName: 'music',
                name: 'music',
                duration: syncPlay.buffer['music'].duration * 1000
            }, {
                bufferName: 'music',
                name: 'music_noise',
                duration: syncPlay.buffer['music'].duration * 1000
            }]
        })

        htmlText.status.innerHTML = 'volume on'
    }

    button.stop.onclick = () => {
        for (let name in syncNoteList) {
            syncNoteList[name].stop()
            field.toStopStatus(name)
        }

        htmlText.status.innerHTML = 'stop・・・'

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

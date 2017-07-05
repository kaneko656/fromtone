let clientList = {}
let speakerList = {}
let socketDir = 'demo_mention_'
let socketType = 'demo_mention'

let noteClient = {}
let tempNote = {}

let musicStartTime = 0
let musicDuration = 60000
let resTime = 800

let config = require('./../exCall-module/config')
let Voice = require('./createVoice.js')(config.VOICE_TEXT_API)

let call = require('./../exCall-module/Call').Call()
let myBot = require('./../exCall-module/exBot')({
    team: 'keitalab',
    pass: '1108'
})

let serverTime

let emitAllClient = (key, body) => {
    for (let id in clientList) {
        if (clientList[id].socket) {
            clientList[id].socket.emit(key, body)
        }
    }
}

let getClientList = () => {
    let list = []
    for (let id in clientList) {
        let c = clientList[id]
        if (list.indexOf(c.name) == -1) {
            list.push(c.name)
        }
    }
    return list
}

let voiceReady = {}

// myBot.connect((exBot) => {
//     // test
//     exBot.on('slack/event/message', (operator, context) => {
//
//         let text = context.text
//         let body = {
//             text: text
//         }
//         let voiceName = 'voice'
//         Voice.create(body, (buffer) => {
//             console.log(buffer)
//             voiceReady[voiceName] = []
//             emitAllClient(socketDir + 'voice', buffer)
//         })
//         let st = serverTime()
//         call.on('change_voiceReady', (operator) => {
//             if (voiceReady[voiceName].length >= Object.keys(clientList).length) {
//                 emitAllClient(socketDir + 'voice_play', {
//                     st: st,
//                     time: st + 500,
//                     offset: 0,
//                     duration: 10000,
//                     notes: [{
//                         bufferName: voiceName,
//                         name: 'voice',
//                         duration: 10000,
//                         time: st + 500,
//                         offset: 0
//                     }]
//                 })
//                 operator.Call.remove()
//             }
//         })
//     })
// })

exports.start = (socket, disconnect, _serverTime) => {
    serverTime = _serverTime



    let id = ''
    socket.on(socketDir + 'register', (body) => {
        console.log(body)
        id = body.id || 'null'
        clientList[id] = {
            id: id,
            socket: socket,
            name: body.user
        }
        socket.emit(socketDir + 'register', {
            id: id,
            name: body.user
        })
        let list = getClientList()
        console.log(list)
        socket.emit(socketDir + 'user_list', list)

        emitAllClient(socketDir + 'user_add', body.user)
    })

    disconnect(() => {
        if (id in clientList) {
            let name = clientList[id].name
            emitAllClient(socketDir + 'user_remove', name)
            delete clientList[id]
        }

        for (let name in noteClient) {
            if (tempNote[name] && id === noteClient[name]) {
                tempNote[name].isOtherMove = false
                tempNote[name].ovre = false
                emitAllClient(socketDir + 'surround_note', Object.assign({}, tempNote[name]))
                delete noteClient[name]
                delete tempNote[name]

            }
        }


        if (id in speakerList) {
            delete speakerList[id]
        }
    })

    socket.on(socketDir + 'voice', (body) => {
        console.log(body)
        Voice.create(body, (buffer) => {
            console.log(buffer)
            socket.emit(socketDir + 'voice', buffer)
        })
    })

    socket.on(socketDir + 'voice_ready', (body) => {
        console.log(body)
        let name = body.voiceName
        if (!voiceReady[name]) {
            voiceReady[name] = []
        }
        voiceReady[name].push({
            id: body.id,
            user: body.user
        })
        call.emit('change_voiceReady')
    })

    socket.on(socketDir + 'notification_common', (body) => {
        console.log(body)
        if (!Array.isArray(body.to)) {
            let ar = []
            ar.push(body.to)
            body.to = ar
        }
        if (!Array.isArray(body.from)) {
            let ar = []
            ar.push(body.from)
            body.from = ar
        }
        let st = serverTime()
        emitAllClient(socketDir + 'notification_common', {
            from: body.from,
            to: body.to,
            notes: [{
                st: st,
                time: st + 1500,
                sound: body.sound,
                panner: body.panner
                // offset
                // duration: 10000
            }]
        })
    })

    socket.on(socketDir + 'play', (body) => {

        let st = serverTime()
        let time = st + resTime
        let offset = 0
        if (time - musicStartTime > musicDuration) {
            if (body.duration) {
                musicDuration = body.duration
            }
            musicStartTime = time
            offset = 0
        } else {
            offset = time - musicStartTime
        }
        socket.emit(socketDir + 'play', {
            st: serverTime(),
            time: time,
            offset: offset,
            duration: musicDuration,
            notes: body.notes
        })
    })


    socket.on(socketDir + 'surround_speaker', (body) => {
        if (body.id && body.speaker) {
            speakerList[body.id] = body.speaker
            id = body.id
        }
        emitAllClient(socketDir + 'surround_speaker', Object.assign({}, speakerList))
    })

    socket.on(socketDir + 'surround_note_click', (body) => {
        if (noteClient == null) {
            noteClient = {}
        }
        if (body.id && body.name && typeof noteClient[body.name] == 'undefined') {
            noteClient[body.name] = body.id
            socket.emit(socketDir + 'surround_note_click', body)
        }
    })

    socket.on(socketDir + 'surround_note', (body) => {
        if (body.id && body.note && body.note.name) {
            if (body.id === noteClient[body.note.name]) {
                emitAllClient(socketDir + 'surround_note', Object.assign({}, body.note))
                tempNote[body.note.name] = body.note
            }
        }
        let release = (body.note && typeof body.note.release != 'undefined') ? body.note.release : body.release
        if (release) {
            noteClient = null
        }
    })

    // socket.on(socketDir + 'surround_reset', (body) => {
    //     speakerList = {}
    //     noteClient = {}
    //     tempNote = {}
    //     console.log('reset')
    // })
}

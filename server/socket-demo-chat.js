let clientList = {}
let clientNameToID = {}
let speakerList = {}
let socketDir = 'demo_chat_'
let socketType = 'demo_chat'

let noteClient = {}
let tempNote = {}

let musicStartTime = 0
let musicDuration = 60000
let resTime = 800

let serverTime

let config = require('./../exCall-module/config')
let Voice = require('./createVoice.js')(config.VOICE_TEXT_API)

let call = require('./../exCall-module/Call').Call()
let myBot = require('./../exCall-module/exBot')({
    team: 'keitalab',
    pass: '1108'
})

let voiceReady = {}

myBot.connect((exBot) => {
    // test
    exBot.on('slack/event/message', (operator, context) => {

        let from = context.user.name
        if (!clientNameToID[from]) {
            return
        }
        let fromID = clientNameToID[from]
        let toMatch = context.text.match(/@(\S+)/g)
        let toList = []
        let toIDList = []
        let text = context.text
        if (toMatch) {
            toMatch.forEach((name) => {
                let n = name.substring(1, name.length)
                if (clientNameToID[n]) {
                    toList.push(n)
                    toIDList.push(clientNameToID[n])
                }
                text = text.replace(name, ' ')
            })
        }

        console.log(from, toList, text)
        // let text = context.text
        let body = {
            text: text
        }
        let voiceName = 'voice'
        Voice.create(body, (buffer) => {
            voiceReady[voiceName] = []
            emitFromToClient(socketDir + 'voice', fromID, toIDList, buffer)
        })
        let st = serverTime()
        call.on('change_voiceReady', (operator) => {
            if (voiceReady[voiceName].length >= toList.length + 1) {
                if (clientList[fromID] && clientList[fromID].socket) {
                    let fromList = []
                    fromList.push(from)
                    clientList[fromID].socket.emit(socketDir + 'voice_from', {
                        from: fromList,
                        to: toList,
                        voiceName: voiceName
                    })
                }
                operator.Call.remove()
            }
        })
    })
})


let emitAllClient = (key, body) => {
    for (let id in clientList) {
        if (clientList[id].socket) {
            clientList[id].socket.emit(key, body)
        }
    }
}

let emitFromToClient = (key, from, to, body) => {
    if (clientList[from].socket) {
        clientList[from].socket.emit(key, body)
    }
    if (Array.isArray(to)) {
        to.forEach((t) => {
            if (clientList[t].socket) {
                clientList[t].socket.emit(key, body)
            }
        })
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

exports.start = (socket, disconnect, _serverTime) => {
    serverTime = _serverTime

    socket.on(socketDir + 'voicetext', (body) => {
        Voice.create(body, (buffer) => {
            console.log(buffer)
            socket.emit(socketDir + 'voicetext', buffer)
        })
    })

    let id = ''
    socket.on(socketDir + 'register', (body) => {
        console.log(body)
        id = body.id || 'null'
        clientList[id] = {
            id: id,
            socket: socket,
            name: body.user
        }
        clientNameToID[body.user] = id
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
            delete clientNameToID[name]
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
        Voice.create(body, (buffer) => {
            socket.emit(socketDir + 'voice', buffer)
        })
    })

    socket.on(socketDir + 'voice_ready', (body) => {
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
            doppler: body.doppler || false,
            editer: body.editer,
            position: body.position,
            notes: [{
                st: st,
                time: st + 1500,
                sound: body.sound,
                panner: body.panner,
                distance: body.distance,
                notification: body.notification
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
}

let clientList = {}
let speakerList = {}
let socketDir = 'demo_motivation_'

let noteClient = {}
let tempNote = {}

let musicStartTime = 0
let musicDuration = 60000
let resTime = 500

let emitAllClient = (key, body) => {
    for (let id in clientList) {
        if (clientList[id].socket) {
            clientList[id].socket.emit(key, body)
        }
    }
}

exports.start = (socket, disconnect, serverTime) => {

    let id = ''
    socket.on(socketDir + 'register', (body) => {
        console.log(body)
        id = body.id || 'null'
        clientList[id] = {
            id: id,
            socket: socket,
            name: 'test'
        }
        socket.emit(socketDir + 'register', {
            id: id,
            name: 'test'
        })
    })

    disconnect(() => {
        if (id in clientList) {
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
        emitAllClient(socketDir + 'play', {
            st: serverTime(),
            time: time,
            offset: 0,
            // duration: musicDuration,
            notes: body.notes
        })
    })

    socket.on(socketDir + 'stop', (body) => {
        emitAllClient(socketDir + 'stop', body)
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

    socket.on(socketDir + 'surround_reset', (body) => {
        speakerList = {}
        noteClient = {}
        tempNote = {}
        console.log('reset')
    })
}

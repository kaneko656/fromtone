let clientList = {}

let musicStartTime = 0
let musicDuration = 60000
let resTime = 1000

exports.emitAllClient = (key, body) => {
    for (let id in clientList) {
        if (clientList[id].socket) {
            clientList[id].socket.emit(key, body)
        }
    }
}

exports.start = (socket, disconnect, serverTime) => {
    let id
    socket.on('syncmusic_register', (body) => {
        console.log(body)
        id = body.id || 'null'
        clientList[id] = {
            id: id,
            socket: socket,
            name: 'test'
        }
        socket.emit('syncmusic_register', {
            id: id,
            name: 'test'
        })
    })

    disconnect(() => {
        if (id in clientList) {
            delete clientList[id]
        }
    })

    socket.on('syncmusic_play', (body) => {

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
        socket.emit('syncmusic_play', {
            st: serverTime(),
            time: time,
            offset: offset,
            duration: musicDuration
        })
    })
}

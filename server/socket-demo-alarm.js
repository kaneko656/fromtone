let socketDir = 'test_'

let clientList = {}

let delayTime = 500
let musicStartTime = 0
let musicDuration = 60000

exports.start = (socket, disconnect, serverTime) => {

    let id
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
    })

    socket.on(socketDir + 'play', (body) => {

        let st = serverTime()
        let time = st + delayTime
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
            duration: musicDuration
        })
    })

}

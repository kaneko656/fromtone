let clientList = {}
let speakerList = {}
let socketDir = 'board_game_'
let socketType = 'board_game'

let noteClient = {}
let tempNote = {}

let musicStartTime = 0
let musicDuration = 60000
let resTime = 800

let serverTime

const CronJob = require('cron').CronJob

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
        socket.emit(socketDir + 'user_list', list)
        emitAllClient(socketDir + 'user_add', body.user)
    })

    socket.on(socketDir + 'gyro', (body) => {
        // console.log(body)
        emitAllClient(socketDir + 'gyro_value', body)
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

    let objectInfoBuffer = []
    let bufferTime = 30

    let newJob = (onTick, callback, start = true) => {
        let job = new CronJob({
            cronTime: onTick,
            onTick: () => {
                callback()
            },
            start: true,
            timeZone: 'Asia/Tokyo'
        })
    }

    socket.on(socketDir + 'sendObjectInfo', (body) => {
        let start = (objectInfoBuffer.length == 0)
        objectInfoBuffer.push(body)
        body.time = body.timestamp ? body.timestamp : serverTime()
        console.log(body.timestamp, serverTime()) 
        body.time += bufferTime
        let now = new Date()
        let date1 = new Date(Math.floor(now.getTime() / bufferTime) * bufferTime + bufferTime)
        let date2 = new Date(Math.floor(now.getTime() / bufferTime) * bufferTime + bufferTime * 2)
        if (start) {
            newJob(date1, () => {

                if (objectInfoBuffer.length >= 1) {
                    emitAllClient(socketDir + 'sendObjectInfo', objectInfoBuffer)
                    objectInfoBuffer = []
                }
            })

            newJob(date2, () => {
                if (objectInfoBuffer.length >= 1) {
                    emitAllClient(socketDir + 'sendObjectInfo', objectInfoBuffer)
                    objectInfoBuffer = []
                }
            })
        }
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

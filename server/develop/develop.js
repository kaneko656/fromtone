let clientList = {}
let speakerList = {}
let socketRoot = 'develop/'
let socketDir = 'develop_'
let socketType = 'develop'

let noteClient = {}
let tempNote = {}

let musicStartTime = 0
let musicDuration = 60000
let resTime = 800

let serverTime

const CronJob = require('cron').CronJob

const clientRegister = require('./register.js')
const common = require('./common.js')


exports.start = (socket, disconnect, _serverTime) => {
    serverTime = _serverTime

    let client = {}

    clientRegister.init(socket, disconnect, socketRoot, (_client) => {
        client.id = _client.id
        client.group = _client.group
        client.data = _client.data
    })

    common.init(socket, clientRegister, socketRoot, client)

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

    socket.on(socketDir + 'game_start', (body) => {
        // console.log(body)
        emitAllClient(socketDir + 'game_start', body)
    })

    let objectStartTime = {}
    let objectLastTime = {}
    let timeout = 15000

    socket.on(socketDir + 'sendObjectInfo', (bodys) => {
        if (!Array.isArray(bodys)) {
            let temp = bodys
            bodys = []
            bodys.push(temp)
        }

        let start = (objectInfoBuffer.length == 0)

        bodys.forEach((body) => {
            objectInfoBuffer.push(body)
            body.time = body.timestamp ? Math.floor(body.timestamp) : serverTime()
            body.time += bufferTime

            // startTime
            if (!objectStartTime[body.id] || !objectLastTime[body.id] || (body.events && body.events == 'sound_start')) {
                objectStartTime[body.id] = body.time
                objectLastTime[body.id] = body.time
                body.startTime = body.time
            } else if (objectLastTime[body.id] - serverTime() > timeout) {
                objectStartTime[body.id] = body.time
                objectLastTime[body.id] = body.time
                body.startTime = body.time
            } else {
                objectLastTime[body.id] = body.time
                body.startTime = objectStartTime[body.id]
            }
        })


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

    socket.on(socketDir + 'sendObjectCaseInfo', (body) => {
        emitAllClient(socketDir + 'sendObjectCaseInfo', body)
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

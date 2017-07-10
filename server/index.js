const app = require('./../server-module/index.js')
const ntpClock = require('./../ntp-clock/for-server.js')

const webaudio = require('./webaudio.js')
const syncmusic = require('./socket-syncmusic.js')
const syncmusic_surround = require('./socket-syncmusic-surround.js')
const touch_surround = require('./socket-touch-surround.js')
const demo_motivation = require('./socket-demo-motivation.js')
const demo_mention = require('./socket-demo-mention.js')
const demo_alarm = require('./socket-demo-alarm.js')
const demo_simple_notification = require('./socket-demo-simple-notification.js')
const demo_chat = require('./socket-demo-chat.js')
const demo_accel_sensor = require('./socket-demo-accel-sensor.js')
const demo_task_notification = require('./socket-demo-task-notification.js')
const demo_accel_notification = require('./socket-demo-accel-notification.js')
const demo_doppler_notification = require('./socket-demo-doppler-notification.js')


let socket_io = app.socket()

let dateDiff = 0
ntpClock((diff) => {
    dateDiff = diff
})

let serverTime = () => {
    return Date.now() + dateDiff
}

socket_io.connect((obj) => {
    let socket = obj.socket
    let connect = obj.connect
    let disconnect = obj.disconnect

    // webaudio.start(socket, disconnect, serverTime)
    syncmusic.start(socket, disconnect, serverTime)
    // syncmusic_surround.start(socket, disconnect, syncmusic.emitAllClient)
    // touch_surround.start(socket, disconnect, serverTime, syncmusic.emitAllClient)
    demo_motivation.start(socket, disconnect, serverTime)
    // demo_mention.start(socket, disconnect, serverTime)
    // demo_alarm.start(socket, disconnect, serverTime)
    demo_simple_notification.start(socket, disconnect, serverTime)
    demo_task_notification.start(socket, disconnect, serverTime)
    demo_chat.start(socket, disconnect, serverTime)
    demo_accel_sensor.start(socket, disconnect, serverTime)
    demo_accel_notification.start(socket, disconnect, serverTime)
    demo_doppler_notification.start(socket, disconnect, serverTime)

    socket.on('test', (body) => {
        console.log('test', body)
        socket.emit('test', {
            test: 'ok'
        })
    })

    // 時刻同期
    socket.on('ntp_server', (body) => {
        body.st = serverTime()
        socket.emit('ntp_server', body)
    })
})

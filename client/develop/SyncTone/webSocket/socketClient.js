/**
 * @overview socketを接続 config.json - socketUrl
 * @author {@link https://github.com/kaneko656 Shoma Kaneko}
 * @version 1.0.0
 * @module socketClient
 */

let url = require('./../config.json').socketUrl || 'http://192.168.144.142:8001'
let socket = io.connect(url)
let call = require('./../../exCall-module/Call').Call()
let isConnect = false
let ntp = require('./ntp-client')

socket.call = {
    on: (key, callback = () => {}) => {
        if (key == 'connect' && isConnect) {
            callback(null, url)
        }
        if (key == 'disconnect' && !isConnect) {
            callback(null, url)
        }
        call.on(key, callback)
    }
}
module.exports = socket

socket.on('connect', () => {
    isConnect = true

    // ntp
    ntp.setSocket(socket)
    ntp.autoCorrection(60000)
    ntp.getDiff((dif) => {
        let text = 'offset time: ' + (dif.offset).toFixed(1) + 'ms  　trans delay: ' + (dif.delay).toFixed(1) + 'ms<br>'
        text += 'correctionTime: ' + (dif.correctionTime).toFixed(1) + 'ms ==? ' + (dif.temp_delay).toFixed(1) + 'ms  (temporary delay)'
        dif.text = text
        shareData.set('ntp_status', dif)
    })

    call.emit('connect', url)
    console.log('Socket: connect', url)
})

socket.on('disconnect', () => {
    isConnect = false
    call.emit('disconnect', url)
    console.log('Socket: disconnect', url)
})

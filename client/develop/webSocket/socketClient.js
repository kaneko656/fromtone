/**
 * @overview このファイルがwebSocket全体のモジュールとなっている
 * @author {@link https://github.com/kaneko656 Shoma Kaneko}
 * @version 1.0.0
 * @module webSocket/socketClient
 * @see {@link module:webSocket/register}
 * @see {@link module:webSocket/ntpClient}
 */

let ntp = require('./ntp-client')
let register = require('./register')
let call = require('./../Call').Call()

let url = require('./../config.json').socketUrl || 'http://192.168.144.142:8001'
let socket = io.connect(url)
let isConnect = false

// module: ntp

/**
 * setSocketはこのファイル（socketClient.js）がrequireされたタイミングで実行する
 * @see {@link module:webSocket/ntpClient}
 * @type webSocket/ntpClient
 */

exports.ntp = ntp

// module: register

/**
 *
 * @see {@link module:webSocket/register}
 * @type register
 */

exports.register = register

/**
 * {@link module:webSocket/register} init()
 * @see {@link module:webSocket/register} init()
 * @param  {String} [socketRoot=''] [description]
 * @param  {Object} [clinetData={}]
 * @return {function} updater
 */

exports.initRegister = (socketRoot = '', clientData = {}) => {
    return register.init(socket, connect, disconnect, socketRoot, clientData)
}



/**
 * @param  {callback}
 */

let connect = exports.connect = (callback = () => {}) => {
    if (isConnect) {
        callback(url)
    }
    call.on('connect', () => {
        callback(url)
    })
}


/**
 * @param  {callback}
 */

let disconnect = exports.disconnect = (callback = () => {}) => {
    if (!isConnect) {
        callback(url)
    }
    call.on('disconnect', () => {
        callback(url)
    })
}


socket.on('connect', () => {
    isConnect = true

    // ntp
    ntp.setSocket(socket)

    // デバック
    // ntp.checkShiftTime((dif) => {
    //     let text = 'offset time: ' + (dif.offset).toFixed(1) + 'ms  　trans delay: ' + (dif.delay).toFixed(1) + 'ms<br>'
    //     text += 'correctionTime: ' + (dif.correctionTime).toFixed(1) + 'ms ==? ' + (dif.temp_delay).toFixed(1) + 'ms  (temporary delay)'
    //     dif.text = text
    //     shareData.set('ntp_status', dif)
    // })

    call.emit('connect', url)
    // console.log('Socket: connect', url)
})

socket.on('disconnect', () => {
    isConnect = false
    call.emit('disconnect', url)
    // console.log('Socket: disconnect', url)
})

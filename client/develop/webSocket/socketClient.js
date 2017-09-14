/**
 * @overview このファイルがwebSocket全体のモジュールとなっている
 * @author {@link https://github.com/kaneko656 Shoma Kaneko}
 * @version 1.0.0
 * @module webSocket/socketClient
 * @see {@link module:webSocket/register}
 * @see {@link module:webSocket/ntpClient}
 * @see {@link module:webSocket/sync}
 */

let ntp = require('./ntp-client')
let register = require('./register')
let sync = require('./sync')
let call = require('./../Call').Call()

let url = require('./../config.json').socketUrl || 'http://192.168.144.142:8001'
let socket = io.connect(url)
let isConnect = false
let isConnecting = true

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
 * @see {@link module:webSocket/register} init()
 * @param  {String} [socketRoot=''] [description]
 * @param  {String} [group]  グループごとにデータを共有範囲を区切る
 * @param  {Object} [clinetData={}]
 * @return {function} updater
 */

exports.initRegister = (socketRoot = '', group, clientData = {}) => {
    return register.init(socket, connect, disconnect, socketRoot, group, clientData)
}


// module: sync

/**
 * @see {@link module:webSocket/sync} sendSyncObject()
 * @param  {string} socketRoot
 * @param  {syncObject} syncObject [description]
 * @param  {Object} [options]     現在，未使用
 */
exports.sendSyncObject = (socketRoot = '', syncObject, options = {}) => {
    sync.sendSyncObject(socket, ntp, socketRoot, syncObject, options = {})
}

/**
 * @param  {string} socketRoot
 * @param  {callback} callback syncObject[]
 */
exports.receiveSyncObject = (socketRoot = '', callback) => {
    sync.receiveSyncObject(socket, ntp, socketRoot, callback)
}



// socket

/**
 * @param  {callback}
 */

exports.connecting = (callback = () => {}) => {
    if (isConnecting) {
        callback(url)
    }
}

/**
 * @param  {callback}
 */

let connect = exports.connect = (callback = () => {}) => {
    if (isConnect) {
        callback(url)
    }
    call.on('connect', () => {
        isConnecting = false
        callback(url)
    })
}


/**
 * @param  {callback}
 */

let disconnect = exports.disconnect = (callback = () => {}) => {
    if (!isConnect && !isConnecting) {
        callback(url)
    }
    call.on('disconnect', () => {
        callback(url)
    })
}


socket.on('connect', () => {
    isConnect = true

    // callback
    call.emit('connect', url)

    // ntp
    ntp.setSocket(socket)

    // デバック
    // ntp.checkShiftTime((dif) => {
    //     let text = 'offset time: ' + (dif.offset).toFixed(1) + 'ms  　trans delay: ' + (dif.delay).toFixed(1) + 'ms<br>'
    //     text += 'correctionTime: ' + (dif.correctionTime).toFixed(1) + 'ms ==? ' + (dif.temp_delay).toFixed(1) + 'ms  (temporary delay)'
    //     dif.text = text
    //     shareData.set('ntp_status', dif)
    // })
})

socket.on('disconnect', () => {
    isConnect = false
    call.emit('disconnect', url)
})

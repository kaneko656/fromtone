/**
 * @overview このファイルがwebSocket全体のモジュールとなっている
 * @author {@link https://github.com/kaneko656 Shoma Kaneko}
 * @version 1.0.0
 * @module webSocket/socketClient
 * @see {@link module:webSocket/register}
 * @see {@link module:webSocket/ntpClient}
 * @see {@link module:webSocket/sync}
 * @see {@link module:webSocket/property}
 */

let ntp = require('./ntp-client')
let register = require('./register')
let sync = require('./sync')
let call = require('./eventCall')
let property = require('./property') // server.startTime
let syncParser = require('./syncParser')
let syncParserReceive = require('./syncParserReceive')

let url = 'http://192.168.144.142:8001'
try {
    url = require('./../config.json').socketUrl
} catch (e) {}

let socket
if (!window.io) {
    socket = require('socket.io-client')(url)
} else {
    socket = io.connect(url)
}
let socketRoot = ''
let thisClientID

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

exports.initRegister = (_socketRoot = '', group, clientData = {}) => {
    socketRoot = _socketRoot
    let updater = register.init(socket, connect, disconnect, socketRoot, group, clientData)
    thisClientID = register.getClientID()
    return updater
}


// module: sync

/**
 * @see {@link module:webSocket/sync} sendSyncObject()
 * @param  {syncObject} syncObject [description]
 * @param  {Object} [options]     現在，未使用
 */
exports.sendSyncObject = (syncObject, options = {}) => {
    sync.sendSyncObject(socket, ntp, socketRoot, syncObject, options = {})
}

/**
 * @param  {callback} callback syncObject[]
 */
exports.receiveSyncObject = (callback) => {
    sync.receiveSyncObject(socket, ntp, socketRoot, callback)
}

/**
 * @param  {callback} callback syncObject[]
 */
exports.getSyncObjectBuffer = (callback) => {
    sync.getSyncObjectBuffer(socket, ntp, socketRoot, callback)
}

/**
 * sendSyncObjectをparseする関数群
 * @type {Object}
 */
exports.send = {}

/**
 * receiveSyncObjectをparseする関数群
 * @type {Object}
 */
exports.receive = {}


// module: syncParse
syncParser.parseList().forEach((parseKey) => {
    exports.send[parseKey] = (...arg) => {
        arg.unshift(this)
        syncParser[parseKey].apply(this, arg)
    }
})


// module: syncParseReceive
syncParserReceive.parseList().forEach((parseKey) => {
    exports.receive[parseKey] = syncParserReceive[parseKey]
})


// module: property

/**
 * @see {@link module:webSocket/property}
 */

exports.property = property



// socket

/**
 * @param  {callback}
 */

exports.connecting = (callback = () => {}) => {
    if (isConnecting) {
        callback(url, thisClientID)
    }
}

/**
 * @param  {callback}
 */

exports.connect = (callback = () => {}) => {
    if (isConnect) {
        callback(url)
    }
    call.on('connect', () => {
        isConnecting = false
        callback(url, thisClientID)
    })
}
let connect = exports.connect


/**
 * @param  {callback}
 */

exports.disconnect = (callback = () => {}) => {
    if (!isConnect && !isConnecting) {
        callback(url, thisClientID)
    }
    call.on('disconnect', () => {
        callback(url, thisClientID)
    })
}
let disconnect = exports.disconnect


/**
 * serverにlogを送る  connectされていない間はbufferに入れ, connect後に送る
 * @param  {} logData    [description]
 */
exports.log = (logData) => {
    if (isConnect) {
        socket.emit(socketRoot + 'log', logData)
    } else {
        logBuffer.push(logData)
    }
    call.on('connect', () => {
        setTimeout(() => {
            if (logBuffer.length >= 1) {
                logBuffer.forEach((log) => {
                    socket.emit(socketRoot + 'log', log)
                })
                logBuffer = []
            }
        }, 500)
    })
}
let log = exports.log
let logBuffer = []


socket.on('connect', () => {
    isConnect = true

    // callback
    call.emit('connect', url)

    // ntp
    ntp.setSocket(socket)

    // server startTime
    socket.on(socketRoot + 'system/time/receive', (time) => {
        if ('startTime' in time) {
            let st = time.startTime
            property.set('startTime', ntp.toClientTime(st))
            ntp.checkShiftTime(() => {
                property.set('startTime', ntp.toClientTime(st))
            })
        }
    })
    // デバック
    // ntp.checkShiftTime((dif) => {
    //     let text = 'offset time: ' + (dif.offset).toFixed(1) + 'ms  　trans delay: ' + (dif.delay).toFixed(1) + 'ms<br>'
    //     text += 'correctionTime: ' + (dif.correctionTime).toFixed(1) + 'ms ==? ' + (dif.temp_delay).toFixed(1) + 'ms  (temporary delay)'
    //     dif.text = text
    //     shareData.set('ntp_status', dif)
    // })
})

/**
 * 自由にデータ
 * @type {Object}
 */
exports.data = {}

socket.on('disconnect', () => {
    isConnect = false
    call.emit('disconnect', url)
})

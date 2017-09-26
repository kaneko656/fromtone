/**
 * @overview webRTC接続
 * <br>接続先　config.json - socketUrl
 * <br>使える場合にwebSocketと併用して使う．データはwebSocketでも送るが早く届いた場合に採用される．
 * <br>register.jsからIDをもらう
 * <br>sync.js内でparseする
 * @author {@link https://github.com/kaneko656 Shoma Kaneko}
 * @version 1.0.0
 * @module webSocket/webRTC
 * @see {@link module:webSocket/register}
 * @see {@link module:webSocket/syncParser}
 * @see {@link module:webSocket/syncParserReceive}
 */

let isUse = false

let host = 'localhost'
let port = ''
let path = '/peer'
let peerServerKey = 'keitalab'
let PeerClient
try {
    PeerClient = Peer
} catch (e) {}
try {
    host = require('./../../config.json').socketUrl
} catch (e) {}

let sp = host.split(':')
if (sp.length >= 3) {
    host = sp[1].replace('//', '') // https://aaa:8000 -> ~ aaa
    port = sp[2] // https://aaa:8000 -> ~ 8000
}
if (sp.length >= 2) {
    host = sp[1].replace('//', '') // https://aaa -> ~ aaa
}

console.log('webRTC >> ', host, port, path)

const events = require('events')
const eventEmitter = new events.EventEmitter()

const parserReceive = require('../syncParserReceive')
let parseList = parserReceive.parseList()

let ntp

let createPeer = (id, socket) => {
    return new PeerClient(id, {
        host: host,
        port: port,
        path: path,
        key: peerServerKey, // server側で設定したkey
        debug: 1
        // debug Defaults to 0.
        // 0Prints no logs.
        // 1Prints only errors.
        // 2Prints errors and warnings.
        // 3Prints all logs.
    })
}

let myPeer
let peers = {}


exports.isSupport = null
let connected = false


/**
 * setMyID createMyPeer of webRTC and receive on data
 * @param {string} id [description]
 */
exports.setMyID = (id, socket) => {
    if (!isUse) {
        return
    }
    myPeer = createPeer(id, socket)
    exports.isSupport = true
    myPeer.on('connection', function(connection) {
        exports.isSupport = true
        connected = true
        eventEmitter.emit('connect')
        connection.serialization = 'json'
        connection.on('data', function(data) {
            try {
                data = JSON.parse(data)
            } catch (e) {
                return
            }
            eventEmitter.emit('receive', data)
        })
    })


    myPeer.on('close', () => {

    })

    // サーバとの接続が切れたとき 現在のconnectionはまだ使える
    myPeer.on('disconnect', (err) => {

    })

    myPeer.on('error', (err) => {
        if (err == 'browser-incompatible') {
            exports.isSupport = false
            connected = false
            console.log('notSupportWebRTC')
        } else {
            exports.isSupport = false
            connected = false
            console.log('webRTC myConnection:' + err)
        }
    })
}

eventEmitter.on('receive', (syncObject) => {
    if (syncObject.events) {
        if (ntp && syncObject.time) {
            syncObject.time = ntp.toClientTime(syncObject.time)
        }
        syncObject.webRTC = true
        parseList.forEach((parseKey) => {
            if ('parse/' + parseKey in syncObject.events) {
                parserReceive.emit('parse/' + parseKey, syncObject)
            }
        })
    }
})


/**
 * [setAnotherID description]
 * @param {string} id [description]
 */
exports.setAnotherID = (id) => {
    if (!isUse) {
        return
    }
    if (!connected || !module.exports.isSupport || !myPeer) {
        if (!connected) {
            eventEmitter.on('connect', () => {
                module.exports.setAnotherID(id)
            })
        }
        return
    }
    if (id in peers) {
        return
    }
    let connection = myPeer.connect(id)
    if (!connection) {
        return
    }
    let send = (data) => {
        if (connection.open) {
            connection.send(JSON.stringify(data))
        }
    }
    peers[id] = {
        connection: connection,
        send: send
    }
    // connection.on('open', () => {
    //     eventEmitter.emit(id + '/open')
    // })
    peers[id].connection.on('close', () => {
        removeAnotherID(id)
    })
    peers[id].connection.on('error', (err) => {
        console.log('webRTC anotherConnection:' + err)
    })
    peers[id].connection.serialization = 'json'
}


/**
 * register.js
 * @param  {string} id
 */

exports.removeAnotherID = (id) => {
    if (id in peers) {
        delete peers[id]
    }
}

let removeAnotherID = exports.removeAnotherID


/**
 * register.js
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */

exports.sendToAllConnection = (data) => {
    if (!isUse) {
        return
    }
    if (!connected || !module.exports.isSupport || !myPeer) {
        return
    }
    if (ntp && data.time) {
        data.time = ntp.toServerTime(data.time)
    }
    for (let key in peers) {
        peers[key].send(data)
    }
}

let sendToAllClient = exports.sendToAllClient

/**
 * socketClient
 * @param {object} ntp
 */
exports.setNTP = (_ntp) => {
    ntp = _ntp
}

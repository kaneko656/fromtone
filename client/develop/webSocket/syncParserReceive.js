/**
 * @overview
 * @author {@link https://github.com/kaneko656 Shoma Kaneko}
 * @version 1.0.0
 * @module webSocket/syncParserReceive
 * @see {@link module:webSocket/socketClient}
 * @see {@link module:webSocket/sync}
 * @see {@link module:webSocket/webRTC}
 */

const events = require('events')
let eventEmitter = new events.EventEmitter()

// exports.~~
let parseList = ['position']

// socketでは parse/~~とする

let checkIdentifierList = {}
let idListNumber = 0
checkIdentifierList[0] = {}
checkIdentifierList[1] = {}

let idListSwitch = () => {
    setTimeout(() => {
        let lastNumber = idListNumber
        idListNumber = (idListNumber + 1) % 2
        checkIdentifierList[lastNumber] = {}
        idListSwitch()
    }, 10000)
}

/**
 * speakerPositino callback({id, time, position, rotation, orientation}) timeは補正済み
 * @param  {callback} callback [description]
 */
exports.position = (callback = () => {}) => {

    // from sync.js or webRTC
    eventEmitter.on('parse/position', (syncObject) => {
        if (syncObject.identifier) {
            let id = syncObject.identifier
            let n = idListNumber
            // console.log(id, syncObject.webRTC)
            if (id in checkIdentifierList[n]) {
                let delay = Date.now() - checkIdentifierList[n][id]
                // callback({
                //     id: syncObject.clientData.user,
                //     position: syncObject.data.position || {},
                //     rotation: syncObject.data.rotation || {},
                //     orientation: syncObject.data.orientation || {},
                //     time: syncObject.time,
                //     webRTC: syncObject.webRTC
                // })
                return
            } else {
                checkIdentifierList[n][id] = Date.now()
            }
        }
        callback({
            // id: syncObject.clientData.user,
            id: syncObject.data.id,
            position: syncObject.data.position || {},
            rotation: syncObject.data.rotation || {},
            orientation: syncObject.data.orientation || {},
            time: syncObject.time,
            webRTC: syncObject.webRTC
        })
    })
}


// to sync.js

exports.parseList = () => {
    return parseList
}


exports.emit = (parseKey, syncObject) => {
    eventEmitter.emit(parseKey, syncObject)
}

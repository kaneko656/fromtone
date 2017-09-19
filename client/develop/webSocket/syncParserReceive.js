/**
 * @overview 
 * @author {@link https://github.com/kaneko656 Shoma Kaneko}
 * @version 1.0.0
 * @module webSocket/syncParserReceive
 * @see {@link module:webSocket/socketClient}
 * @see {@link module:webSocket/sync}
 */


let eventCall = require('./eventCall')

// exports.~~
let parseList = ['position']

// socketでは parse/~~とする

/**
 * callback({id, position, time})
 * @param  {callback} callback [description]
 */
exports.position = (callback = () => {}) => {
    eventCall.on('parse/position', (operator, syncObject) => {
        callback({
            id: syncObject.clientData.user,
            position: syncObject.position,
            time: syncObject.time
        })
    })
}


// to sync.js

exports.parseList = () => {
    return parseList
}


exports.emit = (parseKey, syncObject) => {
    eventCall.emit(parseKey, syncObject)
}

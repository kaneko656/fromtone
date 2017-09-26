/**
 * @overview
 * @author {@link https://github.com/kaneko656 Shoma Kaneko}
 * @version 1.0.0
 * @module webSocket/syncParser
 * @see {@link module:webSocket/socketClient}
 * @see {@link module:webSocket/sync}
 * @see {@link module:webSocket/webRTC}
 */

const webRTC = require('./webRTC')
const uuid = require('node-uuid')

// exports.~~
let parseList = ['position']

exports.parseList = () => {
    return parseList
}


/**
 * [position description]
 * @param  {object} body {id, position, rotation, [time]}
 */

exports.position = (client, body = {}) => {
    let defaultPosition = {
        x: 0,
        y: 0,
        z: 0
    }
    let defaultRotation = {
        x: 0,
        y: 0,
        z: 0
    }
    let sendObj = {
        time: body.time || Date.now(),
        timestamp: Date.now(),
        identifier: uuid.v4(),
        data: {
            id: body.id,
            position: body.position || defaultPosition,
            rotation: body.rotation || defaultRotation,
            orientation: body.orientation || {}
        },
        events: {
            // buffer: 'position/' + body.id,
            'parse/position': true
        },
        clientData: true
    }
    client.sendSyncObject(sendObj)
    if(webRTC.isSupport){
        webRTC.sendToAllConnection(sendObj)
    }
}

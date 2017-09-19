/**
 * @overview
 * @author {@link https://github.com/kaneko656 Shoma Kaneko}
 * @version 1.0.0
 * @module webSocket/syncParser
 * @see {@link module:webSocket/socketClient}
 * @see {@link module:webSocket/sync}
 */


// exports.~~
let parseList = ['position']

exports.parseList = () => {
    return parseList
}


/**
 * [position description]
 * @param  {object} client   [description]
 * @param  {object} position [description]
 * @param  {string|number} time   [description]
 */

exports.position = (client, position, time) => {
    let defaultPosition = {
        x: 0,
        y: 0,
        z: 0
    }
    client.sendSyncObject({
        time: time || Date.now(),
        position: position || defaultPosition,
        events: {
            buffer: true,
            'parse/position': true
        },
        clientData: true
    })
}

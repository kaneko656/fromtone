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
 * @param  {object} body {user, position, [time]}
 */

exports.position = (client, body = {}) => {
    let defaultPosition = {
        x: 0,
        y: 0,
        z: 0
    }
    client.sendSyncObject({
        time: body.time || Date.now(),
        position: body.position || defaultPosition,
        events: {
            buffer: 'position/' + body.user,
            'parse/position': true
        },
        clientData: true
    })
}

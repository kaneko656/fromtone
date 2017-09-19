
// exports.~~
let parseList = ['position']

exports.parseList = () => {
    return parseList
}


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

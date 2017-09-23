let host = 'localhost'
let port = ''
let path = '/peer'
let peerServerKey = 'keitalab'
try {
    host = require('./../config.json').socketUrl
} catch (e) {}

let PeerClient
try{
    PeerClient = Peer
    console.log('script peer')
}catch(e){
    PeerClient = require('peerjs-client')
    console.log('peerjs-client')
}

let sp = host.split(':')

if (sp.length >= 3) {
    host = sp[1] // https://aaa:8000 -> ~ aaa
    port = sp[2] // https://aaa:8000 -> ~ 8000
}
if (sp.length >= 2) {
    host = sp[1] // https://aaa -> ~ aaa
}

// 現在のURLが　httpsだったらpeerのSocketもhttps？
// なんか全部いける感じだ

console.log('webRTC >> ', host, port, path)

// debug Defaults to 0.
// 0Prints no logs.
// 1Prints only errors.
// 2Prints errors and warnings.
// 3Prints all logs.

let createPeer = (id) => {
    return new PeerClient(id, {
        host: host,
        port: port,
        path: path,
        key: peerServerKey, // server側で設定したkey
        debug: 2
    })
}

let myPeer = createPeer('fff')

myPeer.on('connection', function(connection) {
    connection.on('data', function(data) {
        console.log('receive', data)
    })
})

let testPeer = createPeer('ppp')
var connection = testPeer.connect('fff')
connection.on('open', function() {
    connection.send({
        a: 'a',
        b: [1,3,4]
    })
})


exports.setMyID = () => {

}


exports.setAnotherID = () => {

}

exports.removeAnotherID = () => {

}

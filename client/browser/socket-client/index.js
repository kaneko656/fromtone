const io = require('socket.io-client')
// let url = 'http://192.168.144.126:8001'
// let url = 'http://192.168.100.16:8001'
// let url = 'http://133.26.45.88:8001'
// let url = 'http://localhost:8001'
//
// demo5  demoでも一緒
// let url = 'http://192.168.10.14:8001'


let url = 'https://fromtone.herokuapp.com'


let socket = io.connect(url)
let call = require('./../../../exCall-module/simpleCall')
let isConnect = false

socket.call = {
    on: (key, callback = () => {}) => {
        if (key == 'connect' && isConnect) {
            callback(null, url)
        }
        if (key == 'disconnect' && !isConnect) {
            callback(null, url)
        }
        call.on(key, callback)
    }
}
module.exports = socket

socket.on('connect', () => {
    isConnect = true

    socket.emit('client', {
        from: 'client'
    })

    socket.on('client', (res) => {
        console.log(res)
    })

    call.emit('connect', url)
})

socket.on('disconnect', () => {
    isConnect = false
    call.emit('disconnect', url)
})

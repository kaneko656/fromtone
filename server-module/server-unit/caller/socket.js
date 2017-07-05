const socketio = require('socket.io')
const Call = require('./Call')

exports.init = (server) => {
    let io = socketio.listen(server)

    io.sockets.on('connection', (socket) => {
        let e = Call.Call()
        socket.on('connect', () => {
            e.emit('connect')
        })
        socket.on('disconnect', () => {
            e.emit('disconnect')
        })

        call.forEach((c) => {
            let obj = {
                socket: socket,
                connect: (callback = () => {}) => {
                    e.on('connect', callback)
                },
                disconnect: (callback = () => {}) => {
                    e.on('disconnect', callback)
                }
            }
            c(obj)
        })
    })
}

let call = []
exports.connect = (callback = () => {}) => {
    call.push(callback)
}

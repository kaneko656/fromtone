const socketio = require('socket.io')
let Call = require('./Call').Call('socket')

exports.init = (server) => {
    let io = socketio.listen(server)

    io.sockets.on('connection', (socket) => {

        // connect
        Call.emit('connect', socket)

        // disconnect
        socket.on('disconnect', () => {
            Call.emit('disconnect')
        })
    })
}

exports.Call = () => {
  return Call
}

const io = require('socket.io-client')
const uuid = require('node-uuid')

module.exports = () => {
    return new Socket()
}

function Socket() {

    let socket = this.socket

    return socket
}

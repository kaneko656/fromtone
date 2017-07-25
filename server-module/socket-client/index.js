// const io = require('socket.io-client')
let socket = io.connect('http://localhost:8001')

socket.on('connect', () => {

    socket.emit('client', {
      from: 'client'
    })

    socket.on('client', (res) => {
        console.log(res)
    })
})

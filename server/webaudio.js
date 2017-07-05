let clientSocket = {}
let button = {}
let buttonList = []


let allSocketEmit = (key, body) => {
    for (let id in clientSocket) {
        clientSocket[id].emit(key, body)
    }
}

exports.start = (socket, disconnect, serverTime) => {

    let id
    disconnect(() => {
        if (id in clientSocket) {
            delete clientSocket[id]
        }
        if (id in button) {
            delete button[id]
        }
        buttonList.forEach((b, i) => {
            if (id === b.id) {
                buttonList.splice(i, 1)
            }
        })
    })

    socket.on('webaudio_setButton', (body) => {
        id = body.id
        button[body.id] = {
            id: body.id,
            name: body.name
        }
        buttonList.push(body)
        clientSocket[body.id] = socket
        allSocketEmit('webaudio_addButton', body)
    })

    if (buttonList.length >= 1) {
        socket.emit('webaudio_addButton', buttonList)
    }

    socket.on('webaudio_position', (body) => {
        console.log(body)
        allSocketEmit('webaudio_position', body)
    })

    socket.on('webaudio_play', (body) => {
        console.log(body)
        let time = serverTime() + 2000
        allSocketEmit('webaudio_play', {
            time: time
        })
    })

    socket.on('webaudio_triggerPlay', (body) => {
        let from = body.from
        let to = body.to

        let time = serverTime() + 1000

        if (from in clientSocket) {
            clientSocket[from].emit('webaudio_syncPlay', {
                time: time,
                side: 'from'
            })
        }
        if (from !== to && to in clientSocket) {
            clientSocket[to].emit('webaudio_syncPlay', {
                time: time,
                side: 'to'
            })
        }
    })

    socket.on('webaudio_buttonReset', (body) => {
        buttonList = []
        clientSocket = {}
    })
}

// socket.on(socketDir + 'user_list', (list) => {
// })
//
// socket.on(socketDir + 'user_add', (user) => {
// })
//
// socket.on(socketDir + 'user_remove', (user) => {
// })

socket.call.on('connect', () => {
    clientID = uuid.v4()
    // field.setClientID(clientID)

    socket.emit(socketDir + 'register', {
        type: socketType,
        id: clientID,
        user: config.user
    })

    // socket.on(socketDir + 'register', (body) => {
    //     if (body.id === clientID && body.name) {
    //         clientName = body.name
    //     }
    //
    //     htmlText.status.innerHTML = 'user: ' + clientName
    // })


    socket.on(socketDir + 'notification_common', (body) => {
        console.log(body)
        let from = body.from.indexOf(config.user) >= 0 ? true : false
        let to = body.to.indexOf(config.user) >= 0 ? true : false

        let fromText = ''
        body.from.forEach((n) => {
            fromText += n + ' '
        })
        let toText = ''
        body.to.forEach((n) => {
            toText += n + ' '
        })
        htmlText.log.innerHTML = 'From: ' + fromText + '　To: ' + toText
        if (!from && !to) {
            return
        }

        body.notes.forEach((note) => {
            play(body, note, from, to)
        })
    })
})

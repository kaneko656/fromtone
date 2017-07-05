let resTime = 1000

exports.start = (socket, disconnect, serverTime, emitAllClient) => {

    socket.on('touch_surround_note', (body) => {
        let st = serverTime()
        let time = st + resTime
        console.log(body)

        socket.emit('touch_surround_note', {
            st: serverTime(),
            time: time,
            note: body
        })
    })
    disconnect(() => {})

}

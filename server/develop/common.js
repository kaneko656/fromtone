let clientSpec = {}

exports.init = (socket, clientRegister, socketRoot, client) => {

    // sync
    socket.on(socketRoot + 'sync/send', (syncObjects) => {
        if (typeof syncObjects == 'object' && syncObjects.array) {
            syncObjects = syncObjects.array
        }
        clientRegister.emitGroupClient(client.group, socketRoot + 'sync/receive', {
            array: syncObjects
        })
    })

    // log
    socket.on(socketRoot + 'log', (log) => {
        console.log('>>> ' + socketRoot + 'log', client.group, client.id.substring(0, 5), client.data)
        console.log(log)
        console.log('')
    })


    // spec
    socket.on(socketRoot + 'system/spec', (spec) => {
        console.log(spec)
    })



}

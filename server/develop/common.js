let clientSpec = {}
let clientProperty = {}
let clientBuffer = {}

exports.init = (socket, disconnect, clientRegister, socketRoot, client) => {

    // sync
    socket.on(socketRoot + 'sync/send', (syncObjects) => {
        if (typeof syncObjects == 'object' && syncObjects.array) {
            syncObjects = syncObjects.array
        }
        syncObjects.forEach((syncObject) => {
            if (typeof syncObject == 'object') {
                if (!syncObject.clientID) {
                    syncObject.clientID = client.id
                }
                if(syncObject.clientData){
                    syncObject.clientData = client.data || {}
                }
                if (syncObject.events && syncObject.events.buffer && client.group) {
                    if (!clientBuffer[client.group]) {
                        clientBuffer[client.group] = []
                    }
                    clientBuffer[client.group].push(syncObject)
                    console.log('buffer', clientBuffer[client.group].length)
                }
            }
        })

        clientRegister.emitGroupClient(client.group, socketRoot + 'sync/receive', {
            array: syncObjects
        })
    })

    // buffer
    socket.on(socketRoot + 'sync/buffer/get', (syncObjects) => {
        console.log('on buffer')
        if (client.group && clientBuffer[client.group] && clientBuffer[client.group].length >= 1) {
            socket.emit(socketRoot + 'sync/buffer/receive', {
                array: clientBuffer[client.group]
            })
        }
    })

    // log
    socket.on(socketRoot + 'log', (log) => {
        let text = '>>> ' + socketRoot + 'log'
        if (client && client.group && client.id && client.data) {
            text += '  ' + client.group + '  ' + String(client.id).substring(0, 5)
            console.log(text, client.data)
        } else {
            console.log(text)
        }
        console.log(log)
        console.log('')
    })


    // spec
    socket.on(socketRoot + 'system/spec', (spec) => {
        console.log(spec)
        setProperty({
            groupMainClient: true
        })
    })

    let setProperty = (prop) => {
        for (let key in prop) {
            clientProperty[key] = prop[key]
        }
        socket.emit(socketRoot + 'system/property/receive', clientProperty)
    }
}

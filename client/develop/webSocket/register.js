/**
 * @overview socketを接続 config.json - socketUrl
 * @author {@link https://github.com/kaneko656 Shoma Kaneko}
 * @version 1.0.0
 * @module webSocket/register
 * @see {@link module:webSocket/socketClient}
 */

const uuid = require('node-uuid')
let isLock = false
let clientListEvent = () => {}
let addClientEvent = () => {}
let removeClientEvent = () => {}
let user = {}
let registrationConfirm = false


/**
 * @see {@link module:webSocket/socketClient} initRegister()にexports
 * @param  {socket} socket
 * @param  {function} connect
 * @param  {function} disconnect
 * @param  {string} socketRoot
 * @param  {Object} [clientData={}]
 * @return {function} updater()
 */

exports.init = (socket, connect, disconnect, socketRoot, clientData = {}) => {
    let clientID = uuid.v4()

    console.log(clientID)

    socket.on(socketRoot + 'register/confirm', (response) => {
        console.log('confirm', response)
        if (response.ok) {
            registrationConfirm = true
        }
    })

    // 初回に現在のリストが送られてくる それ以降の差分はadd, removeで取得
    socket.on(socketRoot + 'register/group_client_list', (list) => {
        console.log('list', list)
        if (isLock) {
            return
        }
        user = list
        clientListEvent(list)
    })

    socket.on(socketRoot + 'register/event/add_client', (list) => {
        console.log('add', list)
        if (isLock) {
            return
        }
        for (let id in list) {
            user[id] = list[id]
        }
        addClientEvent(list)
    })

    socket.on(socketRoot + 'register/event/remove_client', (list) => {
        console.log('remove', list)
        if (isLock) {
            return
        }
        for (let id in list) {
            if (user[id]) {
                delete user[id]
            }
        }
        removeClientEvent(list)
    })

    socket.on(socketRoot + 'register/event/update', (list) => {
        for (let id in list) {
            if (id in user) {
                user[id] = list[id]
            }
        }
        console.log('update', list)

    })


    connect(() => {
        console.log(socketRoot + 'register')
        socket.emit(socketRoot + 'register', {
            id: clientID,
            data: clientData
        })
    })

    let updater = (data) => {
        console.log(socketRoot + 'register/update')
        socket.emit(socketRoot + 'register/update', data)
    }
    return updater
}


/**
 * @see {@link module:webSocket/socketClient} socketClient.register
 * @param  {callback} [callback=(] {...clientID: clientData}
 */
exports.clientListEvent = (callback = () => {}) => {
    userClientEvent = callback
}

/**
 * @see {@link module:webSocket/socketClient} socketClient.register
 * @param  {callback} [callback=(] {...clientID: clientData}
 */
exports.addClientEvent = (callback = () => {}) => {
    addClientrEvent = callback
}

/**
 * @see {@link module:webSocket/socketClient} socketClient.register
 * @param  {callback} [callback=(] {...clientID: clientData}
 */
exports.removeClientEvent = (callback = () => {}) => {
    removeClientEvent = callback
}

/**
 * @see {@link module:webSocket/socketClient} socketClient.register
 * @param  {callback} [callback=(] {...clientID: clientData}
 */
exports.updateClientEvent = (callback = () => {}) => {
    updateClientEvent = callback
}

/**
 * @overview socketを接続 clientをグループ登録  emit[All/Group]Client, get[All/Group]ClientData
 * @author {@link https://github.com/kaneko656 Shoma Kaneko}
 * @version 1.0.0
 * @module server/register
 */

// {group: id: {socket. id, group, data}}
let clientList = {}
// {group: id: {data}}
let clientData = {}
// {group: {start, }}
let groupTime = {}
let socket
let registerEvent = () => {}



/**
 * clientList[group][id] = {socket, id, group, data}
 * <br><br>on<ul>
 *   <li>register
 *   <li>register/update
 * </ul>
 * emit<ul>
 *   <li>register/confirm
 *   <li>register/group_client_list  registerしたclientに一度だけ送る
 *   <li>register/event/add_client
 *   <li>register/event/remove_client
 *   <li>register/event/update
 * </ul>
 * @param  {Object} socket 各CilentごとのSocket
 * @param {funtion} disconnect callback
 * @param {string} socketRoot socketKeyのルート ex. root = aa/bb/
 * @param {callback} callback param {id, group, data}
 */

// sokcet.on() の中でclientIDを宣言する
// そうしないとどうにも書き換えられてしまう
// スコープの仕組みのせいなのかな
exports.init = (socket, disconnect, socketRoot, callback = () => {}) => {

    socket.on(socketRoot + 'register', (body) => {

        let clientID = body.id || 'default'
        clientID = String(clientID)
        let clientGroup = body.group || 'default'
        let id = clientID
        let group = clientGroup
        let data = body.data || {}
        let startTime = (groupTime[group] && groupTime[group].startTime) || Date.now()

        callback({
            id: clientID,
            group: clientGroup,
            data: data
        })

        // init
        if (!(group in clientList)) {
            clientList[group] = {}
        }
        if (!(group in clientData)) {
            clientData[group] = {}
        }
        if (!(group in groupTime)) {
            groupTime[group] = {
                startTime: startTime
            }
        }

        clientList[group][id] = {
            socket: socket,
            id: id,
            group: group,
            data: data
        }
        clientData[group][id] = data

        // 登録によるデータをClientへ送る

        // to Client
        // response
        socket.emit(socketRoot + 'register/confirm', {
            id: id,
            group: group,
            ok: true,
        })

        socket.emit(socketRoot + 'system/time/receive', {
            startTime: startTime
        })

        // groupClientData
        let groupClientData = getGroupClientData(group)
        if (groupClientData) {
            socket.emit(socketRoot + 'register/group_client_list', groupClientData)
        }

        // to GroupClient
        // addClient
        let addClientData = {}
        addClientData[id] = data
        emitGroupClient(group, socketRoot + 'register/event/add_client', addClientData, {
            removeClient: [id]
        })

        // serverEvent
        registerEvent({
            type: 'add',
            data: addClientData
        })

        // update
        socket.on(socketRoot + 'register/update', (data = {}) => {
            if (clientData[clientGroup] && clientData[clientGroup][clientID]) {
                clientData[clientGroup][clientID] = data
            }
            if (clientList[clientGroup] && clientList[clientGroup][clientID]) {
                clientList[clientGroup][clientID].data = data
                emitGroupClient(clientGroup, socketRoot + 'register/event/update', getClientData(clientGroup, clientID))
            }
        })

        disconnect(() => {

            // to GroupClient
            let removeData = {}
            removeData[clientID] = {}
            emitGroupClient(clientGroup, socketRoot + 'register/event/remove_client', removeData)

            // serverEvent
            registerEvent({
                type: 'remove',
                data: removeData
            })

            removeClient(clientGroup, clientID)
        })
    })
}


let removeClient = (group, id) => {
    if (group in clientData) {
        if (id in clientData[group]) {
            delete clientData[group][id]
        }
    }
    if (group in clientList) {
        if (id in clientList[group]) {
            delete clientList[group][id]
        }
    }
    if (!(group in clientData)) {
        if (group in groupTime) {
            delete groupTime[group]
        }
    }
}


exports.registerEvent = (callback = () => {}) => {
    registerEvent = callback
}



/**
 * clientList
 * @param  {string} emitKey
 * @param  {Object} emitData
 * @param  {Object} [options={}] removeClient/Group [...id]
 */

exports.emitAllClient = (emitKey, emitData, options = {}) => {
    for (let group in clientList) {
        if (options.removeGroup && options.removeGroup.indexOf(group) >= 0) {
            continue
        }
        for (let id in clientList[group]) {
            let client = clientList[group][id]
            if (options.removeClient && options.removeClient.indexOf(id) >= 0) {
                continue
            }
            clientList.socket.emit(emitKey, emitData)
        }
    }
}
let emitAllClient = exports.emitAllClient


/**
 * clientList
 * @param  {string} group        [description]
 * @param  {string} emitKey      [description]
 * @param  {Object} emitData     [description]
 * @param  {Object} [options={}] removeClient[...id]
 */

exports.emitGroupClient = (group, emitKey, emitData, options = {}) => {
    // console.log(emitKey, group, emitData)
    if (group in clientList) {
        for (let id in clientList[group]) {
            let client = clientList[group][id]
            if (options.removeClient && options.removeClient.indexOf(id) >= 0) {
                continue
            }
            clientList[group][id].socket.emit(emitKey, emitData)
        }
    }
}
let emitGroupClient = exports.emitGroupClient

/**
 * clientList
 * @param  {string} group        [description]
 * @param  {string} name        client.data.user
 * @param  {string} emitKey      [description]
 * @param  {Object} emitData     [description]
 */

exports.emitToClient = (group, name, emitKey, emitData) => {
    // console.log(emitKey, group, emitData)
    if (group in clientList) {
        for(let id in clientList[group]) {
            let client = clientList[group][id]
            if(client.data && client.data.user == name){
                client.socket.emit(emitKey, emitData)
            }
        }
    }
}
let emitToClient = exports.emitToClient

/**
 * clientData
 * [getAllClientData description]
 * @param  {Object} [options={}] removeClient/Group [...id]
 * @return {object|null}       [description]
 */

exports.getAllClientData = (options) => {
    if (!options.removeGroup && !options.removeClient) {
        if (Object.keys(clientData).length == 0) {
            return null
        }
        return clientData
    }
    let tempData = {}
    for (let group in clientData) {
        if (options.removeGroup && options.removeGroup.indexOf(group) >= 0) {
            continue
        }
        if (!options.removeClient) {
            tempData[group] = clientData[group]
        }
        for (let id in clientData[group]) {
            let data = clientData[group][id]
            if (options.removeClient && options.removeClient.indexOf(id) >= 0) {
                continue
            }
            // init
            if (!tempData[group][id]) {
                tempData[group][id] = {}
            }
            tempData[group][id] = data
        }
    }
    if (Object.keys(tempData).length == 0) {
        return null
    }
    return tempData
}
let getAllClientData = exports.getAllClientData


/**
 * clientData
 * @param  {stirng} group [description]
 * @param  {Object} [options={}] removeClient
 * @return {object|null}       [description]
 */

exports.getGroupClientData = (group, options = {}) => {
    if (group in clientData) {
        if (!options.removeClient) {
            return clientData[group]
        } else {
            let tempData = {}
            for (let id in clientData[group]) {
                let data = clientData[group][id]
                if (options.removeClient && options.removeClient.indexOf(id) >= 0) {
                    continue
                }
                tempData[id] = data
            }
            if (Object.keys(tempData).length == 0) {
                return null
            }
            return tempData
        }
    }
    return null
}
let getGroupClientData = exports.getGroupClientData


/**
 * clientData
 * @param  {stirng} group [description]
 * @param  {string} id    [description]
 * @return {object|null}       [description]
 */

exports.getClientData = (group, id) => {
    if (group in clientData) {
        if (id in clientData[group]) {
            let tempData = {}
            tempData[id] = clientData[group][id]
            return tempData
        }
    }
    return null
}
let getClientData = exports.getClientData

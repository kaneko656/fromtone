/**
 * @overview webSocket経由でデータ共有する処理
 * @author {@link https://github.com/kaneko656 Shoma Kaneko}
 * @version 1.0.0
 * @module webSocket/sync
 * @see {@link module:webSocket/socketClient}
 */

const Job = require('./cron.js')
const parserReceive = require('./syncParserReceive.js')
let bufferTime = 33
let lastTime = 0
let jobTimes = 10
let syncObjectBuffer = []

/**
 * syncObject
 * @typedef {Object} syncObject
 * @property {stirng|number} time
 * @property {Object} [events]
 * @property {Object} [types]
 * @property {Object} [position]
 * @property {Object} [data]
 */

let syncObjectTemplate = {
    time: 'UTCmillis',
    events: {},
    types: {},
    position: {
        x: 0,
        y: 0,
        z: 0
    },
    data: {}
}

/**
 * @param  {Object} socket
 * @param  {Object} ntp        [description]
 * @param  {string} socketRoot
 * @param  {syncObject} syncObject [description]
 * @param  {Object} [options]     現在，未使用
 */

exports.sendSyncObject = (socket, ntp, socketRoot, syncObject, options = {}) => {

    // objectの定義にそっているか判定と変換
    checkSyncObject(syncObject)
    if (syncObject) {
        // server時刻に補正
        syncObject.time = ntp.toServerTime(syncObject.time)
        // 例外
        if (isNaN(syncObject.time)) {
            return
        }

        syncObjectBuffer.push(syncObject)

        // eventsがあればそれまでのbuffer含めてすぐに送る
        // if (Object.keys(syncObject.events).length >= 1) {
        //     socket.emit(socketRoot + 'sync/send', {
        //         array: syncObjectBuffer
        //     })
        //     syncObjectBuffer = []
        // }

        // startJob
        let now = Date.now()
        if (now > lastTime + bufferTime * jobTimes) {
            lastTime = now
            require('./socketClient.js').log('send Buffer start' + lastTime)
            for (let n = 1; n <= jobTimes; n++) {
                let date = new Date(now + bufferTime * n)
                Job(date, () => {
                    if (syncObjectBuffer.length >= 1) {
                        socket.emit(socketRoot + 'sync/send', {
                            array: syncObjectBuffer
                        })
                        syncObjectBuffer = []
                    }
                })
            }
        }


        // そうでなければbufferTime後にまとめて送る
        // let startJob = (syncObjectBuffer.length <= 1)
        // if (startJob) {
        //     let date1 = new Date(Date.now() + bufferTime)
        //     let date2 = new Date(Date.now() + bufferTime * 2)
        //     Job(date1, () => {
        //         require('./socketClient.js').log('send Buffer' + syncObjectBuffer.length)
        //         if (syncObjectBuffer.length >= 1) {
        //             socket.emit(socketRoot + 'sync/send', {
        //                 array: syncObjectBuffer
        //             })
        //             syncObjectBuffer = []
        //         }
        //     })
        // }
    }
}


/**
 * callback(syncObject[]) (client時刻に補正済み)
 * @param  {Object} socket
 * @param  {Object} ntp          [description]
 * @param  {string} socketRoot
 * @param  {callback} callback   param syncObject[]
 */

exports.receiveSyncObject = (socket, ntp, socketRoot, callback = () => {}) => {

    let parseList = parserReceive.parseList()

    socket.on(socketRoot + 'sync/receive', (syncObjects) => {
        syncObjects = syncObjects.array || syncObjects
        // check
        let remove = []
        syncObjects.forEach((syncObject, i) => {
            checkSyncObject(syncObject)
            if (!syncObject) {
                remove.unshift(i)
                return
            } else {
                syncObject.time = ntp.toClientTime(syncObject.time)
                if (isNaN(syncObject.time)) {
                    remove.unshift(i)
                }
            }
        })
        // remove
        remove.forEach((n) => {
            syncObjects.splice(n, 1)
        })

        // callback
        if (syncObjects.length >= 1) {

            // parseReceive
            syncObjects.forEach((syncObject) => {
                if (syncObject.events) {
                    parseList.forEach((parseKey) => {
                        if ('parse/' + parseKey in syncObject.events) {
                            parserReceive.emit('parse/' + parseKey, syncObject)
                        }
                    })
                }
            })

            callback(syncObjects)
        }
    })
}

/**
 * [getSyncObjectBuffer description]
 * @param  {Object} socket
 * @param  {Object} ntp          [description]
 * @param  {string} socketRoot
 * @param  {callback} callback   param syncObject[]
 */
exports.getSyncObjectBuffer = (socket, ntp, socketRoot, callback = () => {}) => {

    let parseList = parserReceive.parseList()

    socket.emit(socketRoot + 'sync/buffer/get')
    socket.on(socketRoot + 'sync/buffer/receive', (syncObjects) => {
        syncObjects = syncObjects.array || syncObjects
        // check
        let remove = []
        syncObjects.forEach((syncObject, i) => {
            checkSyncObject(syncObject)
            if (!syncObject) {
                remove.unshift(i)
                return
            } else {
                syncObject.time = ntp.toClientTime(syncObject.time)
                if (isNaN(syncObject.time)) {
                    remove.unshift(i)
                }
            }
        })
        // remove
        remove.forEach((n) => {
            syncObjects.splice(n, 1)
        })

        // callback
        if (syncObjects.length >= 1) {

            // parseReceive
            syncObjects.forEach((syncObject) => {
                if (syncObject.events) {
                    parseList.forEach((parseKey) => {
                        if ('parse/' + parseKey in syncObject.events) {
                            parserReceive.emit('parse/' + parseKey, syncObject)
                        }
                    })
                }
            })


            callback(syncObjects)
        }
    })
}

let checkSyncObject = (syncObject) => {
    if (!syncObject || !syncObject.time) {
        return false
    }

    if (typeof syncObject.events != 'object') {
        syncObject.events = {}
    }

    if (typeof syncObject.types != 'object') {
        syncObject.types = {}
    }

    if (typeof syncObject.position != 'object') {
        syncObject.position = {}
    }

    if (typeof syncObject.data != 'object') {
        syncObject.data = {}
    }
    return syncObject
}

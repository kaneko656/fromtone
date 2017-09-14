/**
 * @overview webSocket経由でデータ共有する処理
 * @author {@link https://github.com/kaneko656 Shoma Kaneko}
 * @version 1.0.0
 * @module webSocket/sync
 * @see {@link module:webSocket/socketClient}
 */

const Job = require('./../Job/cron.js')
let bufferTime = 30
let syncObjectBuffer = []

/**
 * syncObject
 * @typedef {Object} syncObject
 * @property {stirng|number} time
 * @property {string[]} [events]
 * @property {string[]} [types]
 * @property {Object} [position]
 * @property {Object} [data]
 */

let syncObjectTemplate = {
    time: 'UTCmillis',
    events: [],
    types: [],
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
        if (syncObject.events.length >= 1) {
            socket.emit(socketRoot + 'sync/send', syncObjectBuffer)
            syncObjectBuffer = []
        }

        // そうでなければbufferTime後にまとめて送る
        let startJob = (syncObjectBuffer.length == 1)
        if (startJob) {
            let date = new Date(Date.now() + bufferTime)
            Job(date, () => {
                if (syncObjectBuffer.length >= 1) {
                    socket.emit(socketDir + 'sync/send', syncObjectBuffer)
                    syncObjectBuffer = []
                }
            })
        }
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
    socket.on(socketRoot + 'sync/receive', (syncObjects) => {

        // check
        let remove = []
        syncObjects.forEach((syncObject, i) => {
            checkSyncObject(checkSyncObject)
            if (!checkSyncObject) {
                remove.unshift(i)
                return
            } else {
                checkSyncObject.time = ntp.toClientTime(checkSyncObject.time)
                if (isNaN(checkSyncObject.time)) {
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
            callback(syncObjects)
        }
    })
}

let checkSyncObject = (syncObject) => {
    if (!syncObject || !syncObject.time) {
        return false
    }
    if (!Array.isArray(syncObject.events)) {
        if (typeof syncObject.events == 'string') {
            syncObject.events = [syncObject.events]
        } else {
            syncObject.events = []
        }
    }
    if (!Array.isArray(syncObject.types)) {
        if (typeof syncObject.types == 'string') {
            syncObject.types = [syncObject.types]
        } else {
            syncObject.types = []
        }
    }
    if (typeof syncObject.position != 'object') {
        syncObject.position = {}
    }
    if (typeof syncObject.data != 'object') {
        syncObject.data = {}
    }
    return syncObject
}

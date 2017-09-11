/**
 * @overview 時刻同期処理 socketを使用
 * @author {@link https://github.com/kaneko656 Shoma Kaneko}
 * @version 1.0.0
 * @module socketClient
 */

let socket
let dateDiff = 0
let call = []

/**
 * @param {Object} socket
 */
exports.setSocket = (_socket) => {
    socket = _socket
    on()
    emit()

    // 初回
    let send = Date.now()
    socket.emit('ntp_server', {
        send: send
    })
}

/**
 * @param  {callback} callback
 */
exports.getDiff = (callback = () => {}) => {
    call.push(callback)
}

// +2sずれ　サーバが送ってくる時刻に +2s した時刻　と内部時刻で整合性
// 家の時計 5分進んでいる
// 10時集合と言われたら10時5分に集合すればいい

/**
 * @param  {number} time
 * @return {number} correctionTime
 */
exports.correctionServerTime = (time) => {
    return Math.round(time + dateDiff)
}

/**
 * @param  {number} time
 * @return {number} correctionTime
 */
exports.correctionToServerTime = (time) => {
    return Math.round(time - dateDiff)
}

/**
 * @return
 */
exports.dateDiff = () => {
    return dateDiff
}

/**
 * @return
 */
exports.correctionTime = () => {
    return -dateDiff
}

/**
 * @param  {number} intervalMillis
 */
exports.autoCorrection = (intervalMillis) => {
    let setRestart = () => {
        setTimeout(() => {
            module.exports.restart()
            setRestart()
        }, intervalMillis)
    }
    setRestart()
}

/**
 * Restart
 */
exports.restart = () => {
    isRestart = true
    buffer = []
    buffer_head = 0
    isFirstBuffer = true
    average_delay = 0
    average_offset = 0
    stableCheckNum = 0
    emit()
}


// 最初の10回は平均を取る
// 以降は平均よりdelayが大きい値は無視
//

let buffer = []
let buffer_head = 0
let buffer_max = 10
let isFirstBuffer = true
let average_delay = 0
let average_offset = 0
let stableCheckNum = 0
let stopCheckNum = 10
let isRestart = false
let smoothing = (obj) => {
    if (isFirstBuffer && buffer_head < buffer_max) {
        buffer.push(obj)
        buffer_head++
        if (buffer_head == buffer_max - 1) {
            isFirstBuffer = false
        }
    }
    if (!isFirstBuffer) {
        if (obj.delay < average_delay) {
            buffer[buffer_head] = obj
            buffer_head++
        } else {
            stableCheckNum++
            if (isRestart && stableCheckNum == stopCheckNum) {
                dateDiff = average_offset
            }
            if (stableCheckNum == stopCheckNum) {
                console.log('ntp stable', dateDiff)
            }
            return
        }
    }

    if (buffer_head >= buffer_max) {
        buffer_head = 0
    }
    setAverage(buffer)

    call.forEach((callback) => {
        callback({
            temp_offset: obj.offset,
            temp_delay: obj.delay,
            offset: average_offset,
            delay: average_delay,
            correctionTime: obj.catchTime - module.exports.correctionServerTime(obj.st)
        })
    })
}

let setAverage = (buf) => {
    let offset = 0
    let delay = 0
    let length = buf.length
    buf.forEach((b) => {
        offset += b.offset
        delay += b.delay
    })
    if (length >= 1) {
        average_offset = offset / length
        average_delay = delay / length
    }
    if (!isRestart) {
        dateDiff = average_offset
    }
}


let on = () => {
    socket.on('ntp_server', (body) => {
        let catchTime = Date.now()
        let diff = (body.send + catchTime) / 2 - body.st
        let delay = (catchTime - body.send) / 2


        smoothing({
            offset: diff,
            delay: delay,
            st: body.st,
            catchTime: catchTime
        })
    })

}

let emit = () => {
    setTimeout(() => {
        let send = Date.now()
        socket.emit('ntp_server', {
            send: send
        })
        if (stableCheckNum < stopCheckNum) {
            emit()
        }
    }, 300 * 1 + Math.floor((Math.random() * 200)))
}

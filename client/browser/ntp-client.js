let socket
let dateDiff = 0

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

let call = []
exports.getDiff = (callback = () => {}) => {
    call.push(callback)
}

// +2sずれ　サーバが送ってくる時刻に +2s した時刻　と内部時刻で整合性
// 家の時計 5分進んでいる
// 10時集合と言われたら10時5分に集合すればいい
exports.correctionServerTime = (time) => {
    return time + dateDiff
}

exports.correctionToServerTime = (time) => {
    return time - dateDiff
}

exports.dateDiff = () => {
    return dateDiff
}

exports.correctionTime = () => {
    return -dateDiff
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
        }else{
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
    dateDiff = average_offset
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
        emit()
    }, 1000 * 1 + Math.floor((Math.random() * 500)))
}

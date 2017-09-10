let uuid = require('node-uuid')
let job = require('./../Job/cron.js')

let socket
let clientID
let clientName = ''

let isPlaying = false
// exports.button = (element) => {
//     let name = Math.floor((Math.random() * 100))
//     let id = uuid.v4()
//     clientID = id
//     button(element, id, 'this: ' + name)
//
//     socket.emit('setButton', {
//         id: id,
//         name: name
//     })
//
//     socket.on('addButton', (add) => {
//         if (Array.isArray(add)) {
//             add.forEach((a) => {
//                 if (a.id != id) {
//                     button(element, a.id, a.name)
//                 }
//             })
//         } else if (add.id != id) {
//             button(element, add.id, add.name)
//         }
//     })
// }

exports.setSocket = (_socket) => {
    socket = _socket
}

exports.connectSocket = () => {
    let id = uuid.v4()
    clientID = id

    socket.emit('syncmusic_register', {
        type: 'syncmusic',
        id: id
    })

    socket.on('syncmusic_register', (body) => {
        console.log(body)
        if (body.id === id && body.name) {
            clientName = body.name
        }
        log.innerHTML = 'username: ' + clientName
    })
}

let log
let status
exports.setButton = (element) => {
    let b_start = document.createElement('button')
    b_start.setAttribute('class', 'button')
    b_start.innerHTML = 'START'

    let b_stop = document.createElement('button')
    b_stop.setAttribute('class', 'button')
    b_stop.innerHTML = 'STOP'

    element.appendChild(b_start)
    element.appendChild(b_stop)

    b_start.onclick = () => {
        if (!isPlaying) {
            isPlaying = true
            status.innerHTML = 'playing music！'

            // ios対策
            context.createBufferSource().start(0)

            socket.emit('syncmusic_play', {
                type: 'syncmusic',
                id: clientID,
                duration: buffer['music'].duration * 1000
            })
        }

    }

    b_stop.onclick = () => {
        if (isPlaying) {
            status.innerHTML = 'stop・・・'
            isPlaying = false
            musicStop()
        }

    }

    status = document.createElement('p')
    status.innerHTML = 'press START!'
    element.appendChild(status)

    log = document.createElement('p')
    log.innerHTML = ''
    element.appendChild(log)
}



// canvas
// let button = (element, id, name) => {
//     let button = document.createElement('button')
//     button.setAttribute('class', 'button')
//     button.innerHTML = name
//     element.appendChild(button)
//
//     button.onclick = () => {
//
//         // ios対策
//         // window.AudioContext = window.AudioContext || window.webkitAudioContext;
//         // let context = new AudioContext()
//         context.createBufferSource().start(0)
//
//         console.log('click')
//         // play()
//         triggerPlay(id)
//     }
// }

let context
// let panner
let buffer = {}
let source = {}

let audioUrlList = {
    'music': 'lib/sound/clock3.mp3'
}

exports.webAudioAPI = (_context, clientTime) => {
    context = _context

    load(audioUrlList, (bufferList) => {
        buffer = bufferList

        socket.on('syncmusic_play', (body) => {
            console.log('syncPlay')
            console.log(body)
            let time = body.time
            let music_offset = body.offset
            let duration = body.duration
            let correctionTime = clientTime.correctionServerTime(time)
            let date = new Date(correctionTime)
            let left = correctionTime - Date.now()
            log.innerHTML = 'start playback after: ' + left.toFixed(4) +'ms'
            // log.innerHTML =
            job(date, () => {
                if (isPlaying) {
                    console.log('start play')
                    musicPlay(music_offset, duration)
                }
            })
        })

    })
}


let musicPlay = (offset, duration, side = 'from') => {
    let panner = createPanner(side)
    panner.connect(context.destination)

    source = createSource(buffer)
    for (let key in source) {
        source[key].connect(panner)
    }
    let ct = context.currentTime

    source['music'].start(ct, offset / 1000)

    let leftTime = duration - offset
    console.log(leftTime)
    setTimeout(() => {
        if (isPlaying) {
            isPlaying = false
            status.innerHTML = 'finish'
            musicStop()
        }
    }, leftTime)

    context.listener.setPosition(0, 0, 0)
}

let musicStop = () => {
    source['music'].stop()
}

let load = (urlList, callback = () => {}) => {
    let bufferList = {}
    let cnt = 0
    let length = Object.keys(urlList).length
    for (let key in urlList) {
        loadSound(urlList[key], (buf) => {
            bufferList[key] = buf
            cnt++
            if (cnt == length) {
                callback(bufferList)
            }
        })
    }
}

let loadSound = (url, callback = () => {}) => {
    let request = new XMLHttpRequest()
    request.open('GET', url, true)
    request.responseType = 'arraybuffer'
    request.onload = function() {
        console.log('load')
        context.decodeAudioData(request.response, function(buffer) {
            callback(buffer)
        }, (err) => {
            console.log(err)
        })
    }
    request.send()
}



let startSource = (source, time) => {
    setTimeout(() => {
        source.start()
    }, time)
}

let changePositionOut = (t, dif, max) => {
    setTimeout(() => {
        // イーズを緩やかに
        let v = (t * (2 - t)) / 2 + t / 2
        context.listener.setPosition(0, 0, v * max)
        t += dif
        console.log(v * max)
        if (t < 1) {
            changePosition(t, dif, max)
        }
    }, 10)
}

let changePositionIn = (t, dif, max) => {
    setTimeout(() => {
        // イーズを緩やかに
        let v = (t * t) / 2 + t / 2
        context.listener.setPosition(0, 0, v * max)
        t += dif
        console.log(v * max)
        if (t < 1) {
            changePosition(t, dif, max)
        }
    }, 10)
}

let changePosition = (t, dif, max) => {
    setTimeout(() => {
        let v = -2 * t * t * t + 3 * t * t
        context.listener.setPosition(0, 0, v * max)
        t += dif
        console.log(v * max)
        if (t < 1) {
            changePosition(t, dif, max)
        }
    }, 10)
}

let createSource = (bufferList) => {
    let sourceList = {}

    for (let key in bufferList) {
        let source = context.createBufferSource()
        source.buffer = bufferList[key]
        sourceList[key] = source
    }
    return sourceList
}

let createPanner = (side = 'from') => {
    var panner = context.createPanner();

    // 指向性
    panner.coneOuterGain = 0.1;
    panner.coneOuterAngle = 180;
    panner.coneInnerAngle = 0;

    // "linear" "inverse" "exponential"
    panner.distanceModel = 'exponential'

    // 基準距離
    panner.refDistance = 1.0

    // 最大距離
    panner.maxDistance = 100

    // x: 左右
    // y: 上下  +が上
    // z: 奥と手前  +が手前

    // 音源　向かい合っている
    // 音源の向き
    // 音源の位置

    if (side == 'from') {
        panner.setOrientation(0, 0, 1)
        panner.setPosition(0, 0, -0.1)
    } else if (side == 'to') {
        panner.setOrientation(0, 0, -1)
        panner.setPosition(0, 0, 30.1)
    }

    return panner
}

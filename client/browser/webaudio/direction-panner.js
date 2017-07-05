let uuid = require('node-uuid')
let job = require('./../Job/cron.js')

let socket
let clientID
exports.button = (element) => {
    let name = Math.floor((Math.random() * 100))
    let id = uuid.v4()
    clientID = id
    button(element, id, 'this: ' + name)

    socket.emit('webaudio_setButton', {
        id: id,
        name: name
    })

    socket.on('webaudio_addButton', (add) => {
        if (Array.isArray(add)) {
            add.forEach((a) => {
                if (a.id != id) {
                    button(element, a.id, a.name)
                }
            })
        } else if (add.id != id) {
            button(element, add.id, add.name)
        }
    })
}

let log
exports.resetButton = (element) => {
    let button = document.createElement('button')
    button.setAttribute('class', 'button')
    button.innerHTML = 'RESET'
    element.appendChild(button)
    button.onclick = () => {
        socket.emit('webaudio_buttonReset', {})
    }

    log = document.createElement('p')
    log.innerHTML = 'LOG'
    element.appendChild(log)
}


exports.setSocket = (_socket) => {
    socket = _socket
}

// canvas
let button = (element, id, name) => {
    let button = document.createElement('button')
    button.setAttribute('class', 'button')
    button.innerHTML = name
    element.appendChild(button)

    button.onclick = () => {

        // ios対策
        // window.AudioContext = window.AudioContext || window.webkitAudioContext;
        // let context = new AudioContext()
        context.createBufferSource().start(0)

        // play()
        triggerPlay(id)
    }
}



let triggerPlay = (id) => {
    socket.emit('webaudio_triggerPlay', {
        from: clientID,
        to: id
    })
}


let context
let panner
let buffer = {}
let source = {}

let audioUrlList = {
    'C3': 'lib/sound/melodius-scale-piano-C3.mp3',
    'D3': 'lib/sound/melodius-scale-piano-D3.mp3',
    'E3': 'lib/sound/melodius-scale-piano-E3.mp3',
    'F3': 'lib/sound/melodius-scale-piano-F3.mp3',
    'G3': 'lib/sound/melodius-scale-piano-G3.mp3',
    'A3': 'lib/sound/melodius-scale-piano-A3.mp3',
    'B3': 'lib/sound/melodius-scale-piano-B3.mp3',
    'C4': 'lib/sound/melodius-scale-piano-C4.mp3',
    'vi-sus-C3': 'lib/sound/melodius-scale-string-sus-C3.mp3',
    'vi-sus-D3': 'lib/sound/melodius-scale-string-sus-D3.mp3',
    'vi-sus-E3': 'lib/sound/melodius-scale-string-sus-E3.mp3',
    'vi-sus-F3': 'lib/sound/melodius-scale-string-sus-F3.mp3',
    'vi-sus-G3': 'lib/sound/melodius-scale-string-sus-G3.mp3',
    'vi-sus-A3': 'lib/sound/melodius-scale-string-sus-A3.mp3',
    'vi-sus-B3': 'lib/sound/melodius-scale-string-sus-B3.mp3',
    'vi-sus-C4': 'lib/sound/melodius-scale-string-sus-C4.mp3',
    'vi-sus-D3': 'lib/sound/melodius-scale-string-sus-D4.mp3',
    'vi-sus-E4': 'lib/sound/melodius-scale-string-sus-E4.mp3',
    'vi-sus-F4': 'lib/sound/melodius-scale-string-sus-F4.mp3',
    'vi-sus-G4': 'lib/sound/melodius-scale-string-sus-G4.mp3',
    'vi-sus-A4': 'lib/sound/melodius-scale-string-sus-A4.mp3',
    'vi-sus-B4': 'lib/sound/melodius-scale-string-sus-B4.mp3',
    'vi-sus-C5': 'lib/sound/melodius-scale-string-sus-C5.mp3',
    'voice': 'lib/sound/voice.mp3',
}

exports.panner = (_context, clientTime) => {
    context = _context

    load(audioUrlList, (bufferList) => {
        buffer = bufferList

        socket.on('webaudio_syncPlay', (body) => {
            console.log('syncPlay')
            let time = body.time
            let side = body.side
            let correctionTime = clientTime.correctionServerTime(time)
            let date = new Date(correctionTime)
            let left = correctionTime - Date.now()
            log.innerHTML = 'start playback after: ' + left.toFixed(4) +'ms'

            job(date, () => {
                console.log('start play')
                play(side)
            })
        })

    })
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


let play = (side = 'from') => {
    let panner = createPanner(side)
    panner.connect(context.destination)

    let source = createSource(buffer)
    for (let key in source) {
        source[key].connect(panner)
    }

    let ct = context.currentTime

    source['C3'].start(ct + 0)
    source['D3'].start(ct + 0.500)
    source['E3'].start(ct + 1.000)
    source['F3'].start(ct + 1.500)
    source['G3'].start(ct + 2.000)
    source['A3'].start(ct + 2.500)
    source['B3'].start(ct + 3.000)
    source['C4'].start(ct + 4.000)

    // source['vi-sus-C4'].start(ct + 0)
    // source['vi-sus-A3'].start(ct + 1.000)
    // source['vi-sus-E4'].start(ct + 1.500)
    // source['vi-sus-G3'].start(ct + 2.250)
    // source['vi-sus-B3'].start(ct + 2.500)
    // source['vi-sus-G4'].start(ct + 3.250)
    // source['vi-sus-C5'].start(ct + 3.500)

    // source['voice'].start()

    // 人の位置を変える
    context.listener.setPosition(0, 0, 0)
    if (side == 'from') {
        setTimeout(() => {
            changePositionIn(0, 0.01 / 7, 30)
        }, 600)
    }
    if (side == 'to') {
        setTimeout(() => {
            changePositionOut(0, 0.05 / 7, 30)
        }, 600)
    }
    // changePosition(-3, 0.5, 20)
}


let changePositionOut = (t, dif, max) => {
    setTimeout(() => {
        // イーズを緩やかに
        let v = (t * (2 - t)) / 2 + t / 2
        context.listener.setPosition(0, 0, v * max)
        t += dif
        // console.log(v * max)
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
        // console.log(v * max)
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
        // console.log(v * max)
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

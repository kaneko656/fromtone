let uuid = require('node-uuid')
let job = require('./../Job/cron.js')

let socket
let clientID
let clientName = ''

let isPlaying = false

let homeButton = require('./../demo-common/html/homeButton.js')

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
        if (body.id === id && body.name) {
            clientName = body.name
        }
        log.innerHTML = 'username: ' + clientName
    })

    socket.on('syncmusic_surround_speaker', (speakerList) => {
        if (field && field.setOtherSpeaker) {
            field.setOtherSpeaker(speakerList)
        }
    })

    socket.on('syncmusic_surround_note', (note) => {
        if (field && field.setNote && field.note && note.id !== clientID) {
            field.setNote(note)
        }
    })

    socket.on('syncmusic_surround_note_click', (body) => {
        if (field && field.note && body.id == clientID) {
            if (field.note.isSync) {
                field.note.isMove = true
            } else {
                // release
                field.sendNoteInfoToServer(field.note, true)
            }
        }
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

let context
// let panner
let buffer = {}
let source = {}
let panner = {}

let audioUrlList = {
    'music': 'lib/sound/clock3.mp3'
}

exports.webAudioAPI = (_context, clientTime) => {
    context = _context

    // 人固定
    context.listener.setPosition(0, 0, -0.1)

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
            log.innerHTML = 'start playback after: ' + left.toFixed(4) + 'ms'
            // log.innerHTML =
            job(date, () => {
                console.log('start play')
                isPlaying = true
                musicPlay(music_offset, duration)
            })
        })

    })
}


let musicPlay = (offset, duration, side = 'from') => {

    let gainNode = context.createGain()
    gainNode.gain.value = 2.0
    gainNode.connect(context.destination)

    panner = createPanner(side)
    panner.connect(gainNode)

    source = createSource(buffer)
    for (let key in source) {
        source[key].connect(panner)
    }
    let ct = context.currentTime

    source['music'].start(ct, offset / 1000)

    let leftTime = duration - offset
    setTimeout(() => {
        if (isPlaying) {
            isPlaying = false
            status.innerHTML = 'finish'
            musicStop()
        }
    }, leftTime)

    // Filed

    if (field && field.speaker && field.note) {
        field.speaker.isPlay = true
        field.note.isPlay = true
        field.render()
        field.updatePannerPosition(field.note, field.speaker)
        field.sendSpeakerInfoToServer(field.speaker)
    }
}

let musicStop = () => {
    source['music'].stop()
    if (field && field.speaker) {
        field.speaker.isPlay = false
        field.note.isPlay = false
        field.render()
        field.sendSpeakerInfoToServer(field.speaker)
    }
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

    // 指向性  Gainは減衰率  InterAngleは減衰しない範囲
    panner.coneOuterGain = 0.1
    panner.coneOuterAngle = 180
    panner.coneInnerAngle = 30

    // "linear" "inverse" "exponential"
    panner.distanceModel = 'exponential'

    // 基準距離
    panner.refDistance = 1.0

    // 最大距離
    panner.maxDistance = 10000

    panner.panningModel = 'HRTF'

    // x: 左右
    // y: 上下  +が上
    // z: 奥と手前  +が手前

    // 音源　向かい合っている
    // 音源の向き
    // 音源の位置
    panner.setPosition(0, 0, 0)
    panner.setOrientation(0, 0, 1)

    return panner
}

let pannerPosition = (dx, dy) => {
    if (panner && panner.setPosition) {
        panner.setPosition(dx, dy, 0)
    }
}

let field
exports.setCanvas = (el) => {
    var canvas = document.createElement('canvas')
    let width = window.innerWidth - 120 > 500 ? window.innerWidth - 120 : 500
    let height = window.innerHeight > 500 ? window.innerHeight : 500
    let size = width < height ? width : height
    log.innerHTML = width + '  ' + height
    canvas.setAttribute('width', size)
    canvas.setAttribute('height', size)
    el.appendChild(canvas)
    field = new Field(canvas)
}

function Field(canvas) {
    this.canvas = canvas
    this.center = {
        x: canvas.width / 2,
        y: canvas.height / 2
    }
    this.w = canvas.width
    this.h = canvas.height
    this.size = this.w / 2

    this.otherSpeakers = []

    // 四分音符
    let noteIcon = new Image(300, 300)
    noteIcon.src = 'lib/image/note.svg'
    this.note = this.createNote(noteIcon)

    let speakerIcon = new Image(300, 300)
    speakerIcon.src = 'lib/image/speaker.png'
    this.speaker = this.createSpeaker(speakerIcon)


    let field = this
    canvas.addEventListener('mousemove', function(e) {
        field.mouseMoved(e.offsetX, e.offsetY)
    })

    canvas.addEventListener('touchmove', function(e) {
        e.preventDefault()
        var rect = e.target.getBoundingClientRect()
        var x = e.changedTouches[0].clientX - rect.left
        var y = e.changedTouches[0].clientY - rect.top
        field.mouseMoved(x, y)
        return false
    })

    canvas.addEventListener('mousedown', function(e) {
        field.mousePressed(e.offsetX, e.offsetY)
    })

    canvas.addEventListener('touchstart', function(e) {
        e.preventDefault()
        var rect = e.target.getBoundingClientRect()
        var x = e.changedTouches[0].clientX - rect.left
        var y = e.changedTouches[0].clientY - rect.top
        field.mousePressed(x, y)
        return false
    })

    canvas.addEventListener('mouseup', function(e) {
        field.mouseReleased(e.offsetX, e.offsetY)
    })

    canvas.addEventListener('touchend', function(e) {
        e.preventDefault()
        var rect = e.target.getBoundingClientRect()
        var x = e.changedTouches[0].clientX - rect.left
        var y = e.changedTouches[0].clientY - rect.top
        field.mouseReleased(x, y)
        return false
    })


    // Render the scene when the icon has loaded.
    var ctx = this
    this.note.icon.onload = function() {
        ctx.render()
        field.sendSpeakerInfoToServer(field.speaker)
    }
}

Field.prototype.render = function() {
    // Draw points onto the canvas element.
    var ctx = this.canvas.getContext('2d');
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // grid
    let size = this.size
    let cnt = 0
    ctx.strokeStyle = 'rgba(0,0,0,0.1)'
    for (let r = 0; r <= size; r += size / 4) {
        let alpha = 0.5 - cnt * 0.1
        ctx.strokeStyle = 'rgba(0,0,0,' + alpha + ')'
        cnt++
        ctx.beginPath()
        ctx.arc(this.center.x, this.center.y, r, 0, Math.PI * 2)
        ctx.stroke()
        ctx.strokeStyle = 'rgba(0,0,0,' + alpha + ')'

        line(ctx, 0, this.center.y - r, this.w, this.center.y - r)
        if (cnt > 1) {
            line(ctx, 0, this.center.y + r, this.w, this.center.y + r)
            line(ctx, this.center.x - r, 0, this.center.x - r, this.h)
        }
        line(ctx, this.center.x + r, 0, this.center.x + r, this.h)
    }

    this.speaker.draw(ctx)
    if (this.otherSpeakers) {
        this.otherSpeakers.forEach((sp) => {
            sp.draw(ctx)
        })
    }
    this.note.draw(ctx)
}

let line = (ctx, x1, y1, x2, y2) => {
    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.stroke()
}

Field.prototype.mousePressed = function(x, y) {
    if (this.speaker.isOver(x, y)) {
        this.speaker.isMove = true
        this.speaker.over = true
        this.speaker.x = x
        this.speaker.y = y
    } else if (!this.note.isOtherMove && this.note.isOver(x, y)) {
        this.note.isSync = true
        socket.emit('syncmusic_surround_note_click', {
            id: clientID
        })
    }
    this.updatePannerPosition(this.note, this.speaker)
    this.render()
}


Field.prototype.mouseReleased = function(x, y) {
    if (this.speaker.isMove) {
        this.speaker.x = x
        this.speaker.y = y
        this.speaker.isMove = false
        this.speaker.over = false
    }
    if (!this.note.isOtherMove && this.note.isMove) {
        this.note.x = x
        this.note.y = y
        this.note.isMove = false
        this.note.over = false
        this.note.isSync = false
        this.sendNoteInfoToServer(this.note, true)
    }
    this.updatePannerPosition(this.note, this.speaker)
    this.sendSpeakerInfoToServer(this.speaker)
    this.render()
}

Field.prototype.mouseMoved = function(x, y) {
    if (this.speaker.isMove) {
        this.speaker.x = x
        this.speaker.y = y - 2
        this.sendSpeakerInfoToServer(this.speaker)
    }
    if (!this.note.isOtherMove && this.note.isMove) {
        this.note.over = true
        this.note.x = x
        this.note.y = y - 2
        this.sendNoteInfoToServer(this.note, false)
    }
    this.updatePannerPosition(this.note, this.speaker)
    this.render()
}

Field.prototype.updatePannerPosition = function(note, speaker) {
    // 音源が原点
    let x = note.x - speaker.x
    let y = note.y - speaker.y
    let dx = x / this.size
    let dy = y / this.size
    pannerPosition(dx, dy)
}

Field.prototype.createSpeaker = function(speakerIcon) {
    let speaker = {
        icon: speakerIcon,
        size: Math.round(this.w / 15),
        w: speakerIcon.width,
        h: speakerIcon.height,
        x: this.center.x,
        y: this.center.y,
        over: false,
        isMove: false,
        isThis: true,
        isPlay: false,
        isOver: (x, y) => {
            let dx = speaker.x - x
            let dy = speaker.y - y
            let d = speaker.size * 0.8
            return (dx * dx + dy * dy < d * d)
        },
        draw: (ctx) => {
            let rate = speaker.size / speaker.w
            ctx.save()
            ctx.translate(speaker.x, speaker.y)
            // circle
            if (speaker.over) {
                ctx.fillStyle = speaker.isThis ? 'rgba(0,100,100,0.3)' : 'rgba(150,0,0,0.3)'
                ctx.beginPath()
                ctx.arc(0, 0, speaker.size * 0.7, 0, Math.PI * 2, true)
                ctx.fill()
            }
            // circle
            if (speaker.isThis) {
                let alpha = speaker.isPlay ? 0.7 : 0.5
                let r = speaker.isPlay ? 0.6 : 0.7
                ctx.lineWidth = 2

                ctx.beginPath()
                ctx.strokeStyle = 'rgba(0,150,100,' + alpha + ')'
                ctx.arc(0, 0, speaker.size * r, 0, Math.PI * 2, true)
                ctx.stroke()

                alpha -= 0.2
                r += speaker.isPlay ? 0.3 : 0.15
                ctx.beginPath()
                ctx.strokeStyle = 'rgba(0,150,100,' + alpha + ')'
                ctx.arc(0, 0, speaker.size * r, 0, Math.PI * 2, true)
                ctx.stroke()

                if (speaker.isPlay) {
                    alpha -= 0.2
                    r += 0.3
                    ctx.beginPath()
                    ctx.strokeStyle = 'rgba(0,150, 100,' + alpha + ')'
                    ctx.arc(0, 0, speaker.size * r, 0, Math.PI * 2, true)
                    ctx.stroke()
                }
            } else if (speaker.isPlay) {
                ctx.lineWidth = 2
                ctx.beginPath()
                ctx.strokeStyle = 'rgba(150,0,0,0.5)'
                ctx.arc(0, 0, speaker.size * 0.6, 0, Math.PI * 2, true)
                ctx.stroke()

                ctx.beginPath()
                ctx.strokeStyle = 'rgba(150,0,0,0.3)'
                ctx.arc(0, 0, speaker.size * 0.7, 0, Math.PI * 2, true)
                ctx.stroke()
            }
            // image
            ctx.scale(rate, rate)
            ctx.drawImage(speaker.icon, -150, -150, 300, 300)
            ctx.restore()
        }
    }
    return speaker
}

Field.prototype.createNote = function(noteIcon) {
    let note = {
        icon: noteIcon,
        size: Math.round(this.w / 15),
        w: noteIcon.width,
        h: noteIcon.height,
        x: this.center.x,
        y: this.center.y,
        over: false,
        isMove: false,
        isOtherMove: false,
        isPlay: false,
        isSync: false,
        isOver: (x, y) => {
            let dx = note.x - x
            let dy = note.y - y
            let d = note.size * 0.8
            return (dx * dx + dy * dy < d * d)
        },
        draw: (ctx) => {
            let rate = note.size / note.w
            ctx.save()
            ctx.translate(note.x, note.y)
            // circle
            if (note.over) {

                ctx.fillStyle = note.isOtherMove ? 'rgba(150,0,0,0.3)' : 'rgba(0,100,100,0.3)'
                ctx.beginPath()
                ctx.arc(0, 0, note.size * 0.7, 0, Math.PI * 2, true)
                ctx.fill()
            }
            // circle
            if (note.isPlay) {
                ctx.beginPath()
                ctx.strokeStyle = 'rgba(0,0,200,0.9)'
                ctx.arc(0, 0, note.size * 0.6, 0, Math.PI * 2, true)
                ctx.stroke()

                ctx.beginPath()
                ctx.strokeStyle = 'rgba(0,0,200,0.7)'
                ctx.arc(0, 0, note.size * 0.9, 0, Math.PI * 2, true)
                ctx.stroke()

                ctx.beginPath()
                ctx.strokeStyle = 'rgba(0,0,200,0.5)'
                ctx.arc(0, 0, note.size * 1.2, 0, Math.PI * 2, true)
                ctx.stroke()

            }
            // image
            ctx.scale(rate, rate)
            ctx.drawImage(note.icon, -150, -150, 300, 300)
            ctx.restore()
        }
    }
    return note
}

Field.prototype.setOtherSpeaker = function(speakers) {
    let speakerArray = []
    if (typeof speakers == 'object') {
        for (let id in speakers) {
            if (id === clientID) {
                continue
            }
            let sp = speakers[id]
            let speaker = this.createSpeaker(this.speaker.icon)
            speaker.x = sp.x * this.w
            speaker.y = sp.y * this.h
            speaker.over = sp.over
            speaker.isMove = sp.isMove
            speaker.isThis = false
            speaker.isPlay = sp.isPlay
            speakerArray.push(speaker)
        }
    }
    this.otherSpeakers = speakerArray
    this.render()
}

Field.prototype.setNote = function(note) {
    this.note.x = note.x * this.w
    this.note.y = note.y * this.h
    this.note.over = note.over
    this.note.isMove = note.isMove
    this.note.isOtherMove = note.isOtherMove
    this.updatePannerPosition(this.note, this.speaker)
    this.render()
}

Field.prototype.sendSpeakerInfoToServer = function(speaker) {
    let s = Object.assign({}, speaker)
    s.icon = null
    s.draw = null
    s.isOver = null
    s.x = s.x / this.w
    s.y = s.y / this.h
    socket.emit('syncmusic_surround_speaker', {
        id: clientID,
        speaker: s
    })
}

Field.prototype.sendNoteInfoToServer = function(note, release) {
    let n = Object.assign({}, note)
    n.icon = null
    n.draw = null
    n.isOver = null
    n.idMove = false
    n.isOtherMove = release ? false : true
    n.x = n.x / this.w
    n.y = n.y / this.h
    n.id = clientID
    socket.emit('syncmusic_surround_note', {
        id: clientID,
        note: n,
        release: release
    })
}

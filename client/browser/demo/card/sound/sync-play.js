let log = require('./../../player/log.js')

module.exports = (context) => {
    return new SyncPlay(context)
}

function SyncPlay(context, clientTime) {
    this.context = context
    this.buffer = {}
    this.source = {}
    this.panner = {}
    this.audioUrlList = {}
}


/**
 * @param {Object.<string, string>} audioUrlList - key: audioName value: audioUrl
 */

SyncPlay.prototype.setAudioList = function(audioUrlList) {
    this.audioUrlList = audioUrlList
}


SyncPlay.prototype.getCurrentTime = function() {
    return this.context.currentTime
}

let finishLoad = () => {}
SyncPlay.prototype.loadBuffer = function(audioUrlList, callback = () => {}) {
    audioUrlList = audioUrlList || this.audioUrlList
    load(audioUrlList, (bufferList) => {
        this.buffer = bufferList
        callback()
        finishLoad()
    })
}

SyncPlay.prototype.createSyncSound = function(sourceName, startDate, offset, call = () => {}) {
    let leftTime = startDate - Date.now()
    let call_start = []
    let call_finish = []
    let call_stop = []
    let syncPlay = this
    let syncSound = {
        sourceName: sourceName,
        startDate: startDate, // UTC millis
        startTime: 0, //  time of context(ms)   Rewrite the value in this method
        offset: offset || 0, // (ms) If offset > duration, rewrite the value in this method
        duration: null, //  (ms) If undefined, rewrite the value in this method
        buffer: null, // Rewrite the value in this method
        source: null, // Rewrite the value in this method
        isPlaying: false,
        // oscillator: oscillator || null,
        start: () => {
            if (!syncSound.buffer) {
                return
            }
            syncSound.offset = syncSound.offset % syncSound.duration
            // console.log(syncSound)
            let currentTime = syncPlay.context.currentTime
            // ms
            let leftStartTime = syncSound.startTime - currentTime * 1000
            console.log('leftStartTime', leftStartTime)
            let delayOffset = leftStartTime < 0 ? -leftStartTime : 0
            leftStartTime = leftStartTime < 0 ? 0 : leftStartTime
            // sec
            log.text((syncSound.startTime / 1000) + '  off' + (syncSound.offset / 1000) + '   ' + (delayOffset) / 1000 + '  ct: ' + currentTime)
            syncSound.source.start(syncSound.startTime / 1000, (syncSound.offset + delayOffset) / 1000)

            let leftTime = leftStartTime + syncSound.duration - (syncSound.offset + delayOffset)

            syncSound.isPlaying = true
            syncSound.fireStart(leftStartTime)

            setTimeout(() => {
                if (!syncSound.source.loop) {
                    syncSound.isPlaying = false
                    syncSound.fireFinish()
                }
            }, leftTime)
        },
        connect: (destination) => {
            syncSound.source.connect(destination)
        },
        stop: () => {
            if (syncSound.isPlaying) {
                syncSound.source.stop()
                syncSound.source.disconnect()
                syncSound.fireStop()
            }
        },
        fireStart: (leftTime) => {
            call_start.forEach((c) => {
                c(leftTime)
            })
        },
        fireFinish: () => {
            call_finish.forEach((c) => {
                c()
            })
        },
        fireStop: () => {
            call_stop.forEach((c) => {
                c()
            })
        },
        started: (callback = () => {}) => {
            call_start.push(callback)
        },
        finished: (callback = () => {}) => {
            call_finish.push(callback)
        },
        stoped: (callback = () => {}) => {
            call_stop.push(callback)
        }
    }

    // set buffer & source
    let source = context.createBufferSource()
    let buffer = this.buffer[sourceName] || null

    let sourceProcess = function() {
        source.buffer = buffer
        syncSound.buffer = buffer
        syncSound.source = source

        // set startTime
        let ct = this.context.currentTime * 1000 // sec -> ms
        syncSound.startTime = ct + leftTime

        // If undefined, set duration
        if (!syncSound.duration) {
            syncSound.duration = syncSound.buffer.duration * 1000 // sec -> ms
        }
        syncSound.offset = syncSound.offset % syncSound.duration
        call(syncSound)
    }

    if (!buffer) {
        console.log('error this.buffer[sourceName] sync-play.js')
        finishLoad = () => {
            buffer = this.buffer[sourceName] || null
            sourceProcess()
        }
    } else {
        sourceProcess()
    }

    // return syncSound
}

SyncPlay.prototype.preConnect = function(destination, syncSound) {
    // to array
    if (!Array.isArray(syncSound)) {
        let temp = syncSound
        syncSound = []
        syncSound.push(temp)
    }

    // play
    syncSound.forEach((note) => {
        note.connect(destination)
        note.start()
    })
}

SyncPlay.prototype.speedPlay = function(syncSound) {
    // to array
    syncSound.start()
}


SyncPlay.prototype.play = function(destination, syncSound) {
    // to array
    if (!Array.isArray(syncSound)) {
        let temp = syncSound
        syncSound = []
        syncSound.push(temp)
    }

    // play
    syncSound.forEach((note) => {
        note.connect(destination)
        note.start()
    })
}


SyncPlay.prototype.addBuffer = function(name, buffer, callback = () => {}) {
    let syncPlay = this
    context.decodeAudioData(buffer, function(decodedBuffer) {
        syncPlay.buffer[name] = decodedBuffer
        callback()
    }, (err) => {
        console.log(err)
    })
}



/**
 * load Audio File
 * load() -> loadSound()
 * -> return
 * @param {string[]|string} urlList -
 * @return {Object[]} - buffer[]
 */

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

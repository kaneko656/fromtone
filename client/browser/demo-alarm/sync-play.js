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

SyncPlay.prototype.loadBuffer = function(audioUrlList, callback = () => {}) {
    audioUrlList = audioUrlList || this.audioUrlList
    load(audioUrlList, (bufferList) => {
        this.buffer = bufferList
        callback()
    })
}

SyncPlay.prototype.createSyncNote = function(sourceName, startDate, offset, duration) {
    let call_start = []
    let call_finish = []
    let call_stop = []
    let syncNote = {
        sourceName: sourceName,
        startDate: startDate, // UTC millis
        startTime: 0, //  time of context(ms)   Rewrite the value in this method
        offset: offset, // (ms)
        duration: duration, //  (ms) If undefined, rewrite the value in this method
        buffer: null, // Rewrite the value in this method
        source: null, // Rewrite the value in this method
        isPlaying: false,
        start: () => {
            syncNote.source.start(syncNote.startTime / 1000, syncNote.offset / 1000, syncNote.duration / 1000)
            syncNote.isPlaying = true
            syncNote.fireStart()

            let leftTime = syncNote.duration - syncNote.offset
            setTimeout(() => {
                syncNote.isPlaying = false
                syncNote.fireFinish()
            }, leftTime)
        },
        connect: (destination) => {
            syncNote.source.connect(destination)
        },
        stop: () => {
            if (syncNote.isPlaying) {
                syncNote.source.stop()
                syncNote.fireStop()
            }
        },
        fireStart: () => {
            call_start.forEach((c) => {
                c()
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
    let buffer = this.buffer[sourceName]
    source.buffer = buffer
    syncNote.buffer = buffer
    syncNote.source = source

    // set startTime
    let ct = this.context.currentTime * 1000 // sec -> ms
    let leftTime = syncNote.startDate - Date.now()
    syncNote.startTime = ct + leftTime

    // If undefined, set duration
    if (!syncNote.duration) {
        syncNote.duration = syncNote.buffer.duration * 1000 // sec -> ms
    }

    return syncNote
}


SyncPlay.prototype.play = (destination, syncNote) => {
    // to array
    if (!Array.isArray(syncNote)) {
        let temp = syncNote
        syncNote = []
        syncNote.push(temp)
    }

    // play
    syncNote.forEach((note) => {
        note.connect(destination)
        note.start()
    })
}

SyncPlay.prototype.pannerPosition = (dx, dy) => {
    if (panner && panner.setPosition) {
        panner.setPosition(dx * 10, dy * 10, 0)
    }
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

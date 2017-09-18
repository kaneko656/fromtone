/**
 * @overview  一つのAudio Bufferに対しての同期再生処理を行うSoundManagerの内部クラス
 * @author {@link https://github.com/kaneko656 Shoma Kaneko}
 * @version 1.0.0
 * @module soundManager/SyncAudio
 * @see {@link module:soundManager}
 */

/**
 * SyncAudioコンストラクタ
 * @param       {Object} webAudio     WebAudioAPI -> AudioContext
 * @param       {Object} buffer       audio buffer of WebAudioAPI
 * @param       {Object} [options={}] name, destination,  loop(boolean), startDateTime(UTCmillis), offset(sec), duration(sec)
 * @return {SyncAudio}           SyncAudioインスタンス
 *
 */
module.exports = (webAudio, buffer, options = {}) => {
    return new SyncAudio(webAudio, buffer, options)
}

/**
 * @class SyncAudio
 * @param       {Object} webAudio     WebAudioAPI -> AudioContext
 * @param       {Object} buffer       buffer of WebAudioAPI
 * @param       {Object} [options={}] name, destination,  loop(boolean), startDateTime(UTCmillis), offset(sec), duration(sec)
 * @constructor
 */

function SyncAudio(webAudio, buffer, options = {}) {
    this.webAudio = webAudio
    this.name = options.name || ''
    this.startDate = options.startDateTime || Date.now() // UTC millis
    this.startTime = webAudio.currentTime + (this.startDate - Date.now()) / 1000 // sec
    this.duration = options.duration || buffer.duration //  (sec)
    this.offset = (options.offset % this.duration) || 0 // (sec)
    this.buffer = buffer
    this.source = webAudio.createBufferSource()
    this.source.buffer = buffer
    this.source.loop = options.loop || false
    this.source.connect(options.destination || webAudio.destination)
    if(this.startTime < 0){
        this.offset += Math.abs(this.startTime)%this.duration
        this.startTime = 0
    }

    let leftTime = this.startTime - webAudio.currentTime
    let leftTimeToFinish = leftTime + this.duration - this.offset
    // delay
    let my = this
    if (leftTime < 0) {
        let delayedOffset = (this.offset - leftTime) % this.duration
        let st = this.startTime > 0 ? this.startTime : 0
        this.source.start(this.startTime, delayedOffset)
        this.isPlaying = true
        console.log('SyncAudio ' + this.name + ' delay: ' + delayedOffset)
        leftTimeToFinish += delayedOffset
    } else {
        this.source.start(this.startTime, this.offset)
        setTimeout(() => {
            my.isPlaying = true
        }, leftTime * 1000)
    }

    setTimeout(() => {
        if (!my.source.loop) {
            my.isPlaying = false
            my.finished('end')
        }
    }, leftTimeToFinish * 1000)
}

/**
 * 再生終了時に呼ばれるイベント
 * @event
 * @param {string} status 終了条件（end, stop）
 */
SyncAudio.prototype.finished = function(){
  console.log('ff')
}

/**
 * 途中で再生を終了する
 */
SyncAudio.prototype.stop = function(){
    if(this.isPlaying){
        this.source.stop()
        this.source.disconnect()
        this.finished('stop')
    }
}




SyncAudio.prototype.createSyncSound = function(sourceName, startDate, offset, call = () => {}) {
    let leftTime = startDate - Date.now()
    let call_start = []
    let call_finish = []
    let call_stop = []
    let syncAudio = this
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
            let currentTime = syncAudio.context.currentTime
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

    return syncSound
}

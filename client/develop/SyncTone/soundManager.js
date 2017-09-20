/**
 * @overview このファイルが音関係の処理を行うモジュールとなる．WebAudioAPIを使用．
 * @author {@link https://github.com/kaneko656 Shoma Kaneko}
 * @version 1.0.0
 * @module soundManager
 * @see {@link module:soundManager/SyncAudio}
 * @see {@link module:soundManager/TimeValue}
 */

const TimeValue = require('./TimeValue.js')
const SyncAudio = require('./SyncAudio.js')
let syncAudios = {}
let soundList = {}
let soundNameList = []

let speakerPosition = {
    default: {
        x: 0,
        y: 0,
        z: 0
    }
}
let mySpeakerID = 'default'
let listenerPosition = {
    x: 0,
    y: 0,
    z: 0
}
// 1.0 が何mに相当するか
let areaScale = 1

let finishInit = false

// WebAudioAPI
let webAudio = null
let buffer = {}
let bufferLoadCall = {}

try {
    window.AudioContext = window.AudioContext || window.webkitAudioContext
    webAudio = new AudioContext()
} catch (e) {
    webAudio = null
    console.log('Web Audio API is not supported in this browser')
}

let canUseModules = () => {
    if (webAudio) {
        return true
    }
    return false
}

exports.interactionStart = () => {
    webAudio.createBufferSource().start(0)
}


/**
 * audioデータをロードする．このモジュールで利用できるように準備する．
 * @param {object} audioUrlList { keyName: url }
 */
// this.buffer[keyName] = decodedBuffer

exports.setAudioList = (audioUrlList) => {
    if (!canUseModules) {
        return
    }

    // url -> audio buffer
    let requestSound = (url, callback = () => {}) => {
        let request = new XMLHttpRequest()
        request.open('GET', url, true)
        request.responseType = 'arraybuffer'
        request.onload = function() {
            callback(request.response)
        }
        request.send()
    }

    // urlList -> (each) key, audio buffer
    let requestAllSound = (audioUrlList, callback = () => {}) => {
        let bufferList = {}
        let cnt = 0
        let length = Object.keys(audioUrlList).length
        for (let key in audioUrlList) {
            requestSound(audioUrlList[key], (buffer) => {
                callback(key, buffer)
                cnt++
                if (cnt == length) {
                    // loadFinish
                }
            })
        }
    }

    // aduio buffer -> decodedBuffer
    let decodeAudioData = (buffer, callback = () => {}) => {
        webAudio.decodeAudioData(buffer, function(decodedBuffer) {
            callback(decodedBuffer)
        }, (err) => {
            console.log(err)
        })
    }

    // AllProcess
    requestAllSound(audioUrlList, (key, buf) => {
        decodeAudioData(buf, (decodedBuffer) => {
            console.log('load: ' + key)
            buffer[key] = decodedBuffer
            if (key in bufferLoadCall && typeof bufferLoadCall[key] == 'function') {
                bufferLoadCall[key]()
            }
        })
    })
}

/**
 * bufferのロードが終わったとき呼ばれる　すでにロードされているときはすぐにコールバックする
 * @param  {string} audioName    [description]
 * @param  {callback} [callback=(] [description]
 */
exports.finishLoad = (audioName, callback = () => {}) => {
    if (buffer[audioName]) {
        callback()
    }
    bufferLoadCall[audioName] = callback
}

/**
 * 共有されている全スピーカの位置をセットする
 * @param {string} id このスピーカのID
 * @param {speakerPosition} speakerPosition { speakerID: { x, y, z } }
 */
exports.setSpeakerPosition = (id, _speakerPosition) => {
    speakerPosition = _speakerPosition
    if (id) {
        mySpeakerID = id
    }
    console.log(mySpeakerID, speakerPosition)
}

/**
 * 共有されている全スピーカの位置をセットする
 * @param {string} id このスピーカのID
 * @param {speakerPosition} speakerPosition { speakerID: { x, y, z } }
 */
exports.updateSpeakerPosition = (id, position) => {
    speakerPosition[id] = position
    console.log(speakerPosition)
}

/**
 * 再生
 * @param  {string} audioName    keyName of setAudioList
 * @param  {Object} [audioOptions={}] options of SyncAudio > name, destination, loop(boolean), startDateTime(UTCmillis), offset(sec), duration(sec)
 * @param  {Object} [syncOptions={}]
 * @return {AudioSyncController} functions  applyDBAP, applyDoppler, update
 */

exports.play = (audioName, audioOptions = {}, syncOptions = {}) => {
    if (!canUseModules) {
        return
    }
    if (!buffer[audioName]) {
        console.log(audioName + 'がありません SoundManager.js - play()')
        return
    }

    let gainNode = webAudio.createGain()
    gainNode.connect(webAudio.destination)
    gainNode.gain.value = 1.0
    audioOptions.destination = gainNode

    let soundManager = this
    let useDBAP = false
    let useDoppler = false
    let syncAudio = SyncAudio(webAudio, buffer[audioName], audioOptions)
    let timeValue = TimeValue()
    timeValue.updateEvent = (pre, next) => {
        let atNextTime = webAudio.currentTime + (next.time - Date.now()) / 1000
        if (useDBAP) {
            let nextDBAP = DBAP(next.value)
            let power = nextDBAP[mySpeakerID]
            // console.log(power)
            if (power) {
                // gainNode.gain.linearRampToValueAtTime(power, atNextTime)
                gainNode.gain.value = power
                // console.log('DBAP', 'power:', power.toFixed(3), 'time:', atNextTime.toFixed(3))
                // require('./../webSocket/socketClient').log(power)
            }
        }
        if (useDoppler) {
            let rate = Doppler(pre.time, pre.value, next.time, next.value)
            if (rate) {
                syncAudio.source.playbackRate.linearRampToValueAtTime(rate, atNextTime)
                console.log('Doppler', 'rate:', rate.toFixed(3), 'time:', atNextTime.toFixed(3))
            }
        }
    }

    /**
     * AudioSyncController
     * @class
     */
    let AudioSyncController = {

        /**
         * AudioSyncController
         * @param  {boolean} apply DBAPを適応(defalut=false)
         */
        applyDBAP: (apply) => {
            useDBAP = apply
        },

        /**
         * AudioSyncController
         * @param  {boolean} apply Dopplerを適応(defalut=false)
         */
        applyDoppler: (apply) => {
            useDoppler = apply
        },

        /**
         * AudioSyncController
         * @param  {Object} updateValue { time: {x, y} }
         */
        update: (updateValue) => {
            timeValue.update(updateValue)
        }
    }
    return AudioSyncController
}


/**
 * DBAP法
 * @param {object} soundPosition {x, y}
 * @param {number} [rolloff=6.02 * 10]
 * @return {object} { speakerID: powerBalance(0.0-1.0) }
 */

let DBAP = exports.DBAP = (soundPosition, rolloff = 6.02 * 10) => {
    // console.log(speakerPosition, soundGx, soundGy)
    if (!speakerPosition) {
        return null
    }
    // スピーカの半径　無限大発散を防ぐ
    let speakerRadius = 0.00001
    let powerSum = 0
    let power = {}
    for (let name in speakerPosition) {
        let spX = speakerPosition[name].x
        let spY = speakerPosition[name].y
        let spZ = speakerPosition[name].z || 0
        let aX = soundPosition.x
        let aY = soundPosition.y
        let aZ = soundPosition.z || 0
        let dist = Math.sqrt((aX - spX) * (aX - spX) + (aY - spY) * (aY - spY) + (aZ - spZ) * (aZ - spZ) + speakerRadius * speakerRadius)
        let rDist = Math.pow(dist, -rolloff / 20 * Math.log10(2))
        let p = rDist * rDist
        // エネルギーなので２乗
        power[name] = p
        powerSum += p
    }
    let result = {}
    if (powerSum != 0) {
        for (let name in power) {
            result[name] = power[name] / powerSum
        }
        // console.log('power', power / powerSum, ' = ', power, ' / ', powerSum)
        // console.log('power', power, ' = ', power, ' / ', powerSum)
    }
    return result
}

let Doppler = exports.Doppler = (preTime, prePosition, nextTime, nextPosition) => {

    let diffDist = culculateDist(listenerPosition, nextPosition) - culculateDist(listenerPosition, prePosition)
    let diffTime = nextTime - preTime
    if (diffTime == 0) {
        return
    }
    // m / ms
    let vs = areaScale * diffDist / diffTime
    // km/h
    vs = vs * 3600

    let rate = 340 / (340 - vs)
    return rate
}

let culculateDist = (a, b) => {
    return Math.sqrt((a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y))
}

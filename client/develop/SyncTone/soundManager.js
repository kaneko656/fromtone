/**
 * @overview このファイルが音関係の処理を行うモジュールとなる．WebAudioAPIを使用．
 * @author {@link https://github.com/kaneko656 Shoma Kaneko}
 * @version 1.0.0
 * @module SoundManager
 */

const TimeValue = require('./TimeValue.js')
const SyncAudio = require('./SyncAudio.js')
const socket = require('./webSocket/socketClient.js')
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
let areaDist = 5

let finishInit = false

// WebAudioAPI
let webAudio = null
let buffer = {}

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
        })
    })

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
}

/**
 * 再生
 * @param  {string} audioName    keyName of setAudioList
 * @param  {Object} [audioOptions={}] options of SyncAudio > name, destination, loop(boolean), startDateTime(UTCmillis), offset(sec), duration(sec)
 * @param  {Object} [syncOptions={}]
 * @return {AudioSyncController} functions  applyDBAP, applyDoppler, uypdate
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
            gainNode.gain.linearRampToValueAtTime(power, atNextTime)
            console.log('DBAP', 'power:', power.toFixed(3), 'time:', atNextTime.toFixed(3))
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


    // return positionUpdate

    syncPlay.createSyncSound(bufferName, time, offset, (syncSound) => {

        let gainNode = webAudio.createGain()
        gainNode.connect(webAudio.destination)
        gainNode.gain.value = 0

        syncSound.started((leftTime) => {})

        let lastGainValue = null
        let lastDoppler = null
        let stoppingTime = Date.now()
        let isStart = false
        let effectTime = 0
        let getEffectTimes = () => {
            return effectTime
        }

        let positionEffect = (p) => {
            value = DBAP(mySpeakerID, p.gx, p.gy)
            console.log('positionEffect', value)

            gainNode.gain.value = value
            if (!isStart && value > 0) {
                let plus = Date.now() - stoppingTime
                syncSound.offset += plus
                syncPlay.play(gainNode, syncSound)
                isStart = true
            }
        }

        let setEffect = (p) => {
            effectTime++

            let dist = Math.sqrt(p.gx * p.gx + p.gy * p.gy)

            let st = syncSound.startTime
            let soundTargetTime = p.time - syncSound.startDate
            soundTargetTime = soundTargetTime > 0 ? soundTargetTime : 0

            let diffDist = 0
            let diffTime = 0
            if (!lastDoppler) {
                diffDist = 0
                diffTime = soundTargetTime
                lastDoppler = {
                    time: p.time,
                    dist: dist,
                    velocity: 0,
                    diffTime: diffTime,
                    diffDist: 0,
                    rate: 1.0
                }
            } else {
                // 平滑化
                diffDist = (dist - lastDoppler.dist) / 2 + diffDist / 2
                diffTime = p.time - lastDoppler.time
                if (diffTime == 0) {
                    return
                }
                // m
                let areaDist = p.areaDist || 3
                // m / ms
                let vs = areaDist * diffDist / diffTime

                // km/h
                // vs = vs * 60 * 60 * 1000 / 1000
                vs = vs * 3600

                let rate = 340 / (340 - vs)

                // console.log(diffDist.toFixed(5), diffTime.toFixed(1), 'rate', rate.toFixed(4), 'vs', vs.toFixed(4))

                // 平滑化
                rate = rate * 0.5 + lastDoppler.rate * 0.5
                // console.log(rate)
                if (!option.noDoppler) {
                    syncSound.source.playbackRate.linearRampToValueAtTime(rate, st / 1000 + soundTargetTime / 1000)
                }
                lastDoppler = {
                    time: p.time,
                    dist: dist,
                    velocity: vs,
                    diffTime: diffTime,
                    diffDist: diffDist,
                    rate: rate
                }
            }

            let vs = Math.abs(lastDoppler.velocity)
            vs = vs > 3 ? 3 : vs
            let targetVelocityVolume = vs / 3
            // dist
            // maxDist
            // time
            let value = 0
            let velocityVolume = lastGainValue ? lastGainValue.velocityVolume : 0
            let velocityVolumeRate = option.velocityVolumeRate || 0
            let valueRate = 1 - velocityVolumeRate
            if (!lastGainValue) {
                value = DBAP(mySpeakerID, p.gx, p.gy)

                // console.log(value)
                value = value * (valueRate + velocityVolumeRate * velocityVolume)
            } else {
                if (velocityVolume < targetVelocityVolume) {
                    velocityVolume += 0.03
                    velocityVolume = velocityVolume >= targetVelocityVolume ? targetVelocityVolume : velocityVolume
                } else if (velocityVolume > targetVelocityVolume) {
                    velocityVolume -= 0.03
                    velocityVolume = velocityVolume <= targetVelocityVolume ? targetVelocityVolume : velocityVolume
                }

                value = DBAP(mySpeakerID, p.gx, p.gy)
                // console.log(value)
                value = value / 2 + lastGainValue.value / 2
                value = value * (valueRate + velocityVolumeRate * velocityVolume)
                console.log(value)
            }
            // console.log(Math.abs(lastDoppler.velocity), volumeRate, value)

            lastGainValue = {
                time: p.time,
                value: value,
                soundTargetTime: soundTargetTime,
                valueRate: valueRate,
                velocityVolumeRate: velocityVolumeRate,
                velocityVolume: velocityVolume,
                targetVelocityVolume: targetVelocityVolume
            }

            let velocityVolumeUpdate = (interval, lastTime) => {
                let l = lastGainValue
                l.targetVelocityVolume = 0
                if (l.velocityVolume == l.targetVelocityVolume) {
                    return
                }
                if (l.time != lastTime) {
                    return
                }
                l.value = l.value * (l.valueRate + 0)
                let startT = st / 1000 + (l.soundTargetTime + interval) / 1000
                // console.log('Job', l.value, st / 1000 + l.soundTargetTime / 1000)
                if (startT <= syncPlay.context.currentTime) {
                    gainNode.gain.value = value
                    syncSound.source.playbackRate.value = 1.0
                } else {
                    gainNode.gain.linearRampToValueAtTime(l.value, startT)
                    syncSound.source.playbackRate.linearRampToValueAtTime(1.0, startT)
                }
                // gainNode.gain.linearRampToValueAtTime(l.value, startT)
                // syncSound.source.playbackRate.linearRampToValueAtTime(1.0, startT)
            }
            let lastTime = lastGainValue.time
            Job(new Date(lastTime + 300), () => {
                velocityVolumeUpdate(400, lastTime)
            })
            // setTimeout(() => {
            //     gainNode.gain.linearRampToValueAtTime(0, st / 1000 + (soundTargetTime + 30) / 1000)
            // }, 30)


            // console.log(value.toFixed(4))
            let startT = st / 1000 + soundTargetTime / 1000
            // console.log('lastValue ',value)
            if (startT <= syncPlay.context.currentTime) {
                gainNode.gain.value = value
            } else {
                gainNode.gain.linearRampToValueAtTime(value, st / 1000 + soundTargetTime / 1000)
            }

            if (!isStart && value > 0) {
                let plus = Date.now() - stoppingTime
                syncSound.offset += plus
                syncPlay.play(gainNode, syncSound)
                isStart = true
            }
        }

        if (option.start) {
            gainNode.gain.value = 1
            syncPlay.play(gainNode, syncSound)
            isStart = true
        }

        let stop = () => {
            let ct = syncPlay.getCurrentTime()
            gainNode.gain.linearRampToValueAtTime(0, ct + 0.2)
            setTimeout(() => {
                syncSound.stop()
                gainNode.disconnect()
            }, 200)
        }

        // let DBAP = (id, soundGx, soundGy, rolloff = 6.02 * 10) => {
        //     // console.log(speakerPosition, soundGx, soundGy)
        //     if (!speakerPosition) {
        //         return 0
        //     }
        //     // スピーカの半径　無限大発散を防ぐ
        //     let speakerRadius = 0.00001
        //     let power = 0
        //     let powerSum = 0
        //     console.log('\r\n')
        //     for (let name in speakerPosition) {
        //         console.log('\r\n')
        //
        //         let gx = speakerPosition[name].gx
        //         let gy = speakerPosition[name].gy
        //         let dist = Math.sqrt((soundGx - gx) * (soundGx - gx) + (soundGy - gy) * (soundGy - gy) + speakerRadius * speakerRadius)
        //         let rDist = Math.pow(dist, -rolloff / 20 * Math.log10(2))
        //         // エネルギーなので２乗
        //         console.log(name, gx, gy)
        //         console.log('dist', dist)
        //         console.log('rDist', rDist)
        //         powerSum += rDist * rDist
        //         console.log('power', rDist * rDist)
        //         if (name == id) {
        //             power = rDist * rDist
        //             // console.log('this power',power)
        //         }
        //     }
        //     if (powerSum != 0) {
        //         console.log('power', power / powerSum, ' = ', power, ' / ', powerSum)
        //         power = power / powerSum
        //         // console.log('power', power, ' = ', power, ' / ', powerSum)
        //         return power
        //     }
        //     return 0
        // }

        // syncPlay.play(gainNode, syncSound)
        let returnObj = {
            bufferName: bufferName,
            gainNode: gainNode,
            time: time,
            syncSound: syncSound,
            setEffect: setEffect,
            positionEffect,
            stop: stop
        }
        call(returnObj)
    })
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
        let aX = soundPosition.x
        let aY = soundPosition.y
        let dist = Math.sqrt((aX - spX) * (aX - spX) + (aY - spY) * (aY - spY) + speakerRadius * speakerRadius)
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
    let vs = areaDist * diffDist / diffTime
    // km/h
    vs = vs * 3600

    let rate = 340 / (340 - vs)
    return rate
}

let culculateDist = (a, b) => {
    return Math.sqrt((a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y))
}
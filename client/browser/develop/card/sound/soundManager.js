const SyncPlay = require('./sync-play.js')
let syncPlay
let log = require('./../../player/log.js')
let Job = require('./../../Job/cron.js')
let soundList = {
    '３音': 'lib/sound/notification-common.mp3',
    // 'Violin1': 'lib/sound/orchestra/beethoven/No5_Mov3_Violin1.mp3',
    // 'Violin2': 'lib/sound/orchestra/beethoven/No5_Mov3_Violin2.mp3',
    // 'Viola': 'lib/sound/orchestra/beethoven/No5_Mov3_Viola.mp3',
    // 'wind': 'lib/sound/orchestra/beethoven/No5_Mov3_Cello.mp3',
    // 'DoubleBass': 'lib/sound/orchestra/beethoven/No5_Mov3_DoubleBass.mp3'
    '和風メロディ': 'lib/sound/wafuringtone.mp3',
    // 'wind': 'lib/sound/windchime.mp3',
    'wind': 'lib/sound/wind8.mp3',
    // 'wind': 'lib/sound/天人の音楽.mp3',
    // 'wind': 'lib/sound/風のとおり道.mp3',
    // 'wind': 'lib/sound/竜の少年.mp3',
    'pizz_melody': 'lib/sound/pizz2_melody.mp3',
    'pizz_7': 'lib/sound/tone/pizz_C.mp3',
    'pizz_6': 'lib/sound/tone/pizz_D.mp3',
    'pizz_5': 'lib/sound/tone/pizz_E.mp3',
    'pizz_4': 'lib/sound/tone/pizz_F.mp3',
    'pizz_3': 'lib/sound/tone/pizz_G.mp3',
    'pizz_2': 'lib/sound/tone/pizz_A.mp3',
    'pizz_1': 'lib/sound/tone/pizz_B.mp3',
    'pizz_0': 'lib/sound/tone/pizz_hC.mp3',
    'marimba_7': 'lib/sound/tone/marimba_C.mp3',
    'marimba_6': 'lib/sound/tone/marimba_D.mp3',
    'marimba_5': 'lib/sound/tone/marimba_E.mp3',
    'marimba_4': 'lib/sound/tone/marimba_F.mp3',
    'marimba_3': 'lib/sound/tone/marimba_G.mp3',
    'marimba_2': 'lib/sound/tone/marimba_A.mp3',
    'marimba_1': 'lib/sound/tone/marimba_B.mp3',
    'marimba_0': 'lib/sound/tone/marimba_hC.mp3',
    'piano_7': 'lib/sound/tone/piano_C.mp3',
    'piano_6': 'lib/sound/tone/piano_D.mp3',
    'piano_5': 'lib/sound/tone/piano_E.mp3',
    'piano_4': 'lib/sound/tone/piano_F.mp3',
    'piano_3': 'lib/sound/tone/piano_G.mp3',
    'piano_2': 'lib/sound/tone/piano_A.mp3',
    'piano_1': 'lib/sound/tone/piano_B.mp3',
    'piano_0': 'lib/sound/tone/piano_hC.mp3',
    'guita_7': 'lib/sound/tone/guita_C.mp3',
    'guita_6': 'lib/sound/tone/guita_D.mp3',
    'guita_5': 'lib/sound/tone/guita_E.mp3',
    'guita_4': 'lib/sound/tone/guita_F.mp3',
    'guita_3': 'lib/sound/tone/guita_G.mp3',
    'guita_2': 'lib/sound/tone/guita_A.mp3',
    'guita_1': 'lib/sound/tone/guita_B.mp3',
    'guita_0': 'lib/sound/tone/guita_hC.mp3',
    'xylophone_7': 'lib/sound/tone/xylophone_C.mp3',
    'xylophone_6': 'lib/sound/tone/xylophone_D.mp3',
    'xylophone_5': 'lib/sound/tone/xylophone_E.mp3',
    'xylophone_4': 'lib/sound/tone/xylophone_F.mp3',
    'xylophone_3': 'lib/sound/tone/xylophone_G.mp3',
    'xylophone_2': 'lib/sound/tone/xylophone_A.mp3',
    'xylophone_1': 'lib/sound/tone/xylophone_B.mp3',
    'xylophone_0': 'lib/sound/tone/xylophone_hC.mp3'



    // 'pizz_7': 'lib/sound/tone/pizz_C.mp3',
    // 'pizz_6': 'lib/sound/tone/pizz_D.mp3',
    // 'pizz_5': 'lib/sound/tone/pizz_E.mp3',
    // 'pizz_4': 'lib/sound/tone/pizz_F.mp3',
    // 'pizz_3': 'lib/sound/tone/pizz_C.mp3',
    // 'pizz_2': 'lib/sound/tone/pizz_E.mp3',
    // 'pizz_1': 'lib/sound/tone/pizz_G.mp3',
    // 'pizz_0': 'lib/sound/tone/pizz_hC.mp3',
    // 'marimba_7': 'lib/sound/tone/marimba_C.mp3',
    // 'marimba_6': 'lib/sound/tone/marimba_D.mp3',
    // 'marimba_5': 'lib/sound/tone/marimba_E.mp3',
    // 'marimba_4': 'lib/sound/tone/marimba_F.mp3',
    // 'marimba_3': 'lib/sound/tone/marimba_C.mp3',
    // 'marimba_2': 'lib/sound/tone/marimba_E.mp3',
    // 'marimba_1': 'lib/sound/tone/marimba_G.mp3',
    // 'marimba_0': 'lib/sound/tone/marimba_hC.mp3',
    // 'piano_7': 'lib/sound/tone/piano_C.mp3',
    // 'piano_6': 'lib/sound/tone/piano_D.mp3',
    // 'piano_5': 'lib/sound/tone/piano_E.mp3',
    // 'piano_4': 'lib/sound/tone/piano_F.mp3',
    // 'piano_3': 'lib/sound/tone/piano_C.mp3',
    // 'piano_2': 'lib/sound/tone/piano_E.mp3',
    // 'piano_1': 'lib/sound/tone/piano_G.mp3',
    // 'piano_0': 'lib/sound/tone/piano_hC.mp3',
    // 'guita_7': 'lib/sound/tone/guita_C.mp3',
    // 'guita_6': 'lib/sound/tone/guita_D.mp3',
    // 'guita_5': 'lib/sound/tone/guita_E.mp3',
    // 'guita_4': 'lib/sound/tone/guita_F.mp3',
    // 'guita_3': 'lib/sound/tone/guita_C.mp3',
    // 'guita_2': 'lib/sound/tone/guita_E.mp3',
    // 'guita_1': 'lib/sound/tone/guita_G.mp3',
    // 'guita_0': 'lib/sound/tone/guita_hC.mp3',
    // 'xylophone_7': 'lib/sound/tone/xylophone_C.mp3',
    // 'xylophone_6': 'lib/sound/tone/xylophone_D.mp3',
    // 'xylophone_5': 'lib/sound/tone/xylophone_E.mp3',
    // 'xylophone_4': 'lib/sound/tone/xylophone_F.mp3',
    // 'xylophone_3': 'lib/sound/tone/xylophone_C.mp3',
    // 'xylophone_2': 'lib/sound/tone/xylophone_E.mp3',
    // 'xylophone_1': 'lib/sound/tone/xylophone_G.mp3',
    // 'xylophone_0': 'lib/sound/tone/xylophone_hC.mp3'
    // 'music': 'lib/sound/clock3.mp3',
    // 'voice': 'lib/sound/voice.mp3',
    // '太鼓': 'lib/sound/taiko.mp3',
    // 'wind': 'lib/sound/emargency_calling.mp3'
    // 'アラーム': 'lib/sound/clockbell.mp3',
    // '掃除機': 'lib/sound/cleaner.mp3',
    // '電子レンジ': 'lib/sound/microwave.mp3',
    // '扇風機': 'lib/sound/fan.mp3',
    // '洗濯機': 'lib/sound/washing.mp3',
    // 'プリンタ': 'lib/sound/printer.mp3',
    // 'wind': 'lib/sound/pod.mp3',
    // '炒める': 'lib/sound/roasting.mp3',
    // '足音（走る）': 'lib/sound/dashing.mp3',
    // '足音（スリッパ）': 'lib/sound/walking.mp3',
    // '雨音': 'lib/sound/rain.mp3'
}
let soundNameList = []
for (let name in soundList) {
    soundNameList.push(name)
}

let speakerPosition = {}
let mySpeakerID = ''
let finishInit = false

exports.init = (context) => {
    if (!finishInit) {
        syncPlay = SyncPlay(context)
        syncPlay.loadBuffer(soundList, () => {})
        finishInit = true
    }
    return syncPlay
}

exports.setSpeakerPosition = (_speakerPosition, id) => {
    speakerPosition = _speakerPosition
    mySpeakerID = id
}

// option.loop
// option.velocityVolumeRate
// option.limitEffectTimes
exports.play = (bufferName, time, offset, option = {}, call = () => {}) => {
    syncPlay.createSyncSound(bufferName, time, offset, (syncSound) => {
        if (option.loop) {
            syncSound.source.loop = true
        }

        let gainNode = context.createGain()
        gainNode.connect(context.destination)
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

        // setTimeout(() => {
        //     speakerPosition = {
        //         'field': {
        //             gx: 0,
        //             gy: 0
        //         },
        //         'left': {
        //             gx: -0.4,
        //             gy: -0.4
        //         },
        //         'up': {
        //             gx: -0.2,
        //             gy: 0.5
        //         },
        //         'right': {
        //             gx: 0.6,
        //             gy: 0.1
        //         }
        //     }
        //
        //     // DBAP('field', 0.4, 0.3)
        //
        //     for (let name in speakerPosition) {
        //         console.log(name)
        //         DBAP(name, 0.3, 0.1)
        //     }
        //
        // }, 100)

        // let setOption = (_option) => {

        //     option = Object.assign({}, _option)
        // }
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
            if (option.limitEffectTimes && option.limitEffectTimes > effectTime) {
                return
            }

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

        let DBAP = (id, soundGx, soundGy, rolloff = 6.02 * 10) => {
            // console.log(speakerPosition, soundGx, soundGy)
            if (!speakerPosition) {
                return 0
            }
            // スピーカの半径　無限大発散を防ぐ
            let speakerRadius = 0.00001
            let power = 0
            let powerSum = 0
            console.log('\r\n')
            for (let name in speakerPosition) {
                console.log('\r\n')

                let gx = speakerPosition[name].gx
                let gy = speakerPosition[name].gy
                let dist = Math.sqrt((soundGx - gx) * (soundGx - gx) + (soundGy - gy) * (soundGy - gy) + speakerRadius * speakerRadius)
                let rDist = Math.pow(dist, -rolloff / 20 * Math.log10(2))
                // エネルギーなので２乗
                console.log(name, gx, gy)
                console.log('dist', dist)
                console.log('rDist', rDist)
                powerSum += rDist * rDist
                console.log('power', rDist * rDist)
                if (name == id) {
                    power = rDist * rDist
                    // console.log('this power',power)
                }
            }
            if (powerSum != 0) {
                console.log('power', power / powerSum, ' = ', power, ' / ', powerSum)
                power = power / powerSum
                // console.log('power', power, ' = ', power, ' / ', powerSum)
                return power
            }
            return 0
        }

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

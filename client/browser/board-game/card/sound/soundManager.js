const SyncPlay = require('./sync-play.js')
let syncPlay
let log = require('./../../player/log.js')

let soundList = {
    '３音': 'lib/sound/notification-common.mp3',
    // 'Violin1': 'lib/sound/orchestra/beethoven/No5_Mov3_Violin1.mp3',
    // 'Violin2': 'lib/sound/orchestra/beethoven/No5_Mov3_Violin2.mp3',
    // 'Viola': 'lib/sound/orchestra/beethoven/No5_Mov3_Viola.mp3',
    // 'Cello': 'lib/sound/orchestra/beethoven/No5_Mov3_Cello.mp3',
    // 'DoubleBass': 'lib/sound/orchestra/beethoven/No5_Mov3_DoubleBass.mp3'
    '和風メロディ': 'lib/sound/wafuringtone.mp3',
    'ウィンドチャイム': 'lib/sound/windchime.mp3',
    'カード': 'lib/sound/wind1.mp3',
    // 'music': 'lib/sound/clock3.mp3',
    // 'voice': 'lib/sound/voice.mp3',
    // '太鼓': 'lib/sound/taiko.mp3',
    // 'コーリング': 'lib/sound/emargency_calling.mp3',
    // 'アラーム': 'lib/sound/clockbell.mp3',
    // '掃除機': 'lib/sound/cleaner.mp3',
    // '電子レンジ': 'lib/sound/microwave.mp3',
    // '扇風機': 'lib/sound/fan.mp3',
    // '洗濯機': 'lib/sound/washing.mp3',
    // 'プリンタ': 'lib/sound/printer.mp3',
    // 'ポッド注ぐ': 'lib/sound/pod.mp3',
    // '炒める': 'lib/sound/roasting.mp3',
    // '足音（走る）': 'lib/sound/dashing.mp3',
    // '足音（スリッパ）': 'lib/sound/walking.mp3',
    // '雨音': 'lib/sound/rain.mp3'
}
let soundNameList = []
for (let name in soundList) {
    soundNameList.push(name)
}

exports.init = (context) => {
    syncPlay = SyncPlay(context)
    syncPlay.loadBuffer(soundList, () => {})
    return syncPlay
}


exports.play = (bufferName, time, offset, option = {}, call = () => {}) => {
    syncPlay.createSyncSound(bufferName, time, offset, (syncSound) => {
        if (option.loop) {
            syncSound.source.loop = true
        }

        let gainNode = context.createGain()
        gainNode.connect(context.destination)

        syncSound.started((leftTime) => {})

        let lastGainValue = null
        let lastDoppler = null
        let setEffect = (p) => {

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
                syncSound.source.playbackRate.linearRampToValueAtTime(rate, st / 1000 + soundTargetTime / 1000)
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
            let volumeRate = vs / 3
            // dist
            // maxDist
            // time
            //
            let value = 0
            if (!lastGainValue) {
                value = p.dist < p.maxDist ? 1.0 - p.dist / p.maxDist : 0
                value = value * 0.1 + value * 0.9 * volumeRate
            } else {
                value = p.dist < p.maxDist ? 1.0 - p.dist / p.maxDist : 0
                value = value / 2 + lastGainValue.value / 2
                value = value * 0.3 + value * 0.7 * volumeRate
            }
            // console.log(Math.abs(lastDoppler.velocity), volumeRate, value)

            lastGainValue = {
                value: value,
                time: soundTargetTime
            }
            gainNode.gain.linearRampToValueAtTime(value, st / 1000 + soundTargetTime / 1000)
        }

        let stop = () => {
            let ct = syncPlay.getCurrentTime()
            gainNode.gain.linearRampToValueAtTime(0, ct + 0.2)
            setTimeout(() => {
                syncSound.stop()
            }, 200)
        }

        syncPlay.play(gainNode, syncSound)
        let returnObj = {
            bufferName: bufferName,
            gainNode: gainNode,
            time: time,
            syncSound: syncSound,
            setEffect: setEffect,
            stop: stop
        }
        call(returnObj)
    })
}
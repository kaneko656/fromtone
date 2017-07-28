const SyncPlay = require('./sync-play.js')
let syncPlay

let soundList = {
    '３音': 'lib/sound/notification-common.mp3',
    // 'Violin1': 'lib/sound/orchestra/beethoven/No5_Mov3_Violin1.mp3',
    // 'Violin2': 'lib/sound/orchestra/beethoven/No5_Mov3_Violin2.mp3',
    // 'Viola': 'lib/sound/orchestra/beethoven/No5_Mov3_Viola.mp3',
    // 'Cello': 'lib/sound/orchestra/beethoven/No5_Mov3_Cello.mp3',
    // 'DoubleBass': 'lib/sound/orchestra/beethoven/No5_Mov3_DoubleBass.mp3'
    '和風メロディ': 'lib/sound/wafuringtone.mp3',
    'ウィンドチャイム': 'lib/sound/windchime.mp3'
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
}


exports.play = (bufferName, time, offset, option = {}, call = () => {}) => {
    // let correctionTime = clientTime.correctionServerTime(time)
    syncPlay.createSyncSound(bufferName, time, offset, (syncSound) => {
        if (option.loop) {
            syncSound.source.loop = true
        }

        //
        offset = offset%syncSound.duration

        let gainNode = context.createGain()
        gainNode.connect(context.destination)

        // let doppler = body.doppler

        // let consol = (t, duration) => {
        //     htmlText.log.innerHTML = 'Volume[0-1]: ' + gainNode.gain.value.toFixed(4) + ',  Doppler: ' + syncNote.source.playbackRate.value.toFixed(4)
        //     // gyroLog.innerHTML = gainNode.gain.value.toFixed(4) + ', ' + syncNote.source.playbackRate.value.toFixed(4)
        //     setTimeout(() => {
        //         t += 100
        //         if (t < duration) {
        //             consol(t, duration)
        //         }
        //     }, 100)
        // }

        syncSound.started((leftTime) => {})

        let lastGain = {}
        let setGain = (p) => {
            // dist
            // maxDist
            // time
            let value = p.dist < p.maxDist ? 1.0 - p.dist / p.maxDist : 0

            let st = syncSound.startTime
            let startDate = syncSound.startDate
            let t = p.time - startDate
            let soundTime = st / 1000 + t / 1000
            soundTime = soundTime > 0 ? soundTime : 0
            lastGainValue = {
                value: value,
                time: soundTime
            }
            gainNode.gain.linearRampToValueAtTime(value, soundTime)

            // console.log(value)
            // let position = body.position || {}
            // objects.forEach((obj, i) => {
            //     let v = d.value
            //     let t = d.div
            //     if (from) {
            //         v = v
            //     } else if (to) {
            //         v = 1 - v
            //     }
            //     if (i == 0) {
            //         gainNode.gain.value = v
            //     }
            //     gainNode.gain.linearRampToValueAtTime(v, st + duration * t)
            // })
        }

        let lastDoppler = null
        let setDoppler = (p) => {
            // dist
            // maxDist
            // clipX
            // clipY
            // time
            // gx
            // gy
            // 単位時間あたりのDistの変化でいい？

            let st = syncSound.startTime
            let soundTargetTime = p.time - syncSound.startDate

            let diffDist = 0
            let diffTime = 0
            if (!lastDoppler) {
                diffDist = 0
                diffTime = soundTargetTime
                lastDoppler = {
                    time: p.time,
                    dist: p.dist,
                    diffTime: diffTime,
                    diffDist: 0,
                    rate: 1.0
                }
            } else {
                diffDist = p.dist - lastDoppler.dist
                diffTime = p.time - lastDoppler.time
                // m
                let areaDist = p.areaDist || 3
                // m / ms
                let vs = areaDist * diffDist / diffTime

                // km/h
                // vs = vs * 60 * 60 * 1000 / 1000
                vs = vs * 3600

                let rate = 340 / (340 - vs)

                console.log(diffDist.toFixed(5), diffTime.toFixed(1), 'rate', rate.toFixed(4), 'vs', vs.toFixed(4))
                syncSound.source.playbackRate.linearRampToValueAtTime(rate, st / 1000 + soundTargetTime / 1000)
                lastDoppler = {
                    time: p.time,
                    dist: p.dist,
                    diffTime: diffTime,
                    diffDist: diffDist,
                    rate: rate
                }

            }



            // let position = body.position || {}

            // let v = d.value
            // let t = d.div
            //
            // // s
            // // 0 - 1 -> 0.1
            // let interT = i >= 1 ? ev[i].div - ev[i - 1].div : ev[i].div
            // // 0 - duration -> duration * 0.1
            // interT *= duration
            // // m
            // let dist = position.d || 1
            //
            //
            // // m/s fromからtoに向かうときプラス方向
            // let vs = d.velocity * dist / duration
            // // km/h
            // // vs = vs * 60 * 60 / 1000
            // vs = vs * 3.6
            //
            // // vcos
            // // 音源位置
            // // from 0[m] - dist[m] to
            // let meter = (1 - d.value) * dist
            // let ang = 0
            // let px = meter
            // let py = 0
            // if (position.target == 'from') {
            //     let lx = position.offsetX
            //     let ly = position.offsetY
            //     ang = Math.atan2(ly - py, lx - px)
            // }
            // if (position.target == 'to') {
            //     let lx = dist + position.offsetX
            //     let ly = position.offsetY
            //     ang = Math.atan2(ly - py, lx - px)
            // }
            //
            // let rate = 340 / (340 - vs * Math.cos(ang))
            // if (i == 0) {
            //     gainNode.gain.value = rate
            // }
            // if (doppler && !isNaN(vs)) {
            //     syncSound.source.playbackRate.linearRampToValueAtTime(rate, st + duration * t)
            // } else {
            //     syncSound.source.playbackRate.value = 1
            // }
            // fromを自分とすると
            // from 1 to 0
            // マイナス方向が離れる
            // v0 = 0 観測者は静止
            // V = 340
            // let rate = 340 / (340 - vs)
            //
            // // 加速度のデータ転送がsocketなのでずれる　-> 時間差がシビアな音では厳しい
            // // あらかじめ動きのセットを送るのならセーフだけど，インタラクティブにやるのは厳しい？

        }
        syncPlay.play(gainNode, syncSound)
        let returnObj = {
            bufferName: bufferName,
            gainNode: gainNode,
            time: time,
            syncSound: syncSound,
            setGain: setGain,
            setDoppler: setDoppler
        }
        call(returnObj)
    })



}

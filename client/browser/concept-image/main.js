let uuid = require('node-uuid')
let job = require('./../Job/cron.js')

let Canvas = require('./canvas/canvas.js')
let Field = require('./canvas/field.js')
let NoteIcon = require('./canvas/icon-note.js')
let SpeakerIcon = require('./canvas/icon-speaker.js')
let SyncPlay = require('./sync-play.js')
let Button = require('./html/button.js')
let HtmlText = require('./html/html-text.js')
let SelectList = require('./html/select-list.js')

let Biquad = require('./biquad.js')

let socketDir = 'demo_mention_'
let socketType = 'demo_mention'

let config = require('./../exCall-module/config')

// let Voice = require('./createVoice.js')(config.VOICE_TEXT_API)
// let Slack = require('./slack.js')


exports.start = (element, context, socket, clientTime, config) => {
    // element.setAttribute()margin : 30px ;
    element.style.margin = '30px'

    console.log(config)

    let clientID = uuid.v4() // This is temporary. When websocket connected, this is replaced new id


    let htmlText = HtmlText(element)
    let fromList = SelectList('from')
    fromList.init(element, 'From')
    let toList = SelectList('to')
    toList.init(element, 'To')

    let button = Button(element)
    let canvas = Canvas(element)
    // let field = Field(canvas)
    fromList.setList(['Kaneko'])
    toList.addUser(['Yagi', 'Watanabe', 'Printer'])
    // toList.addUser(['Watanabe', 'Yagi', 'Printer'])


    htmlText.title.innerHTML = 'FromTone'

    // socket.on(socketDir + 'user_list', (list) => {
    //     let idx = list.indexOf(config.user)
    //     if (idx >= 0) {
    //         list = list.splice(idx, 1)
    //         toList.addUser(list)
    //     }
    //     toList.setList(list)
    //     fromList.setList(list)
    //     fromList.check(config.user)
    // })
    //
    // socket.on(socketDir + 'user_add', (user) => {
    //     let idx = user.indexOf(config.user)
    //     if (idx >= 0) {
    //         if (Array.isArray(user)) {
    //             user = user.splice(idx, 1)
    //             toList.addUser(user)
    //         } else {
    //             // return
    //         }
    //     }
    //
    //     fromList.addUser(user)
    // })
    //
    // socket.on(socketDir + 'user_remove', (user) => {
    //     // toList.removeUser(user)
    //     // fromList.removeUser(user)
    // })


    let audioUrlList = {
        'music': 'lib/sound/clock3.mp3',
        'notification_common': 'lib/sound/notification-common.mp3'
    }

    let syncPlay = SyncPlay(context)
    let syncNoteList = {}
    let pannerList = {}
    let isPlaying = false

    // 人固定
    context.listener.setPosition(0, 0, -0.1)

    let createSyncNote = (bufferName, time, offset, duration) => {
        let music_offset = offset || 0
        duration = duration || null
        let correctionTime = clientTime.correctionServerTime(time)
        let left = correctionTime - Date.now()

        // htmlText.log.innerHTML = 'start playback after: ' + left.toFixed(4) + 'ms'

        return syncPlay.createSyncNote(bufferName, correctionTime, music_offset, duration)
    }

    let setCommonSyncNote = (syncNote, noteName) => {
        syncNote.started(() => {
            console.log('syncPlay: start')
            syncNoteList[noteName] = syncNote
        })

        syncNote.stoped(() => {
            console.log('syncPlay: stop')
            if (syncNoteList[noteName]) {
                delete syncNoteList[noteName]
            }
        })

        syncNote.finished(() => {
            console.log('syncPlay: finish')
            if (isPlaying && syncNoteList[noteName]) {
                isPlaying = false
                syncNoteList[noteName].stop()
                // field.toStopStatus(noteName)
                delete syncNoteList[noteName]

                // htmlText.status.innerHTML = 'finish'
            }
        })

        return syncNote
    }

    let createIndividualPanner = (name) => {
        if (name == 'music') {
            let gainNode = context.createGain()
            gainNode.gain.value = 20.0
            gainNode.connect(context.destination)
            let panner = createPanner(true)
            panner.connect(gainNode)
            pannerList[name] = panner
            return panner
        }
        if (name == 'music_noise') {
            let gainNode = context.createGain()
            gainNode.gain.value = 20.0
            gainNode.connect(context.destination)
            let biquad = Biquad.create(context, gainNode)
            let panner = createPanner(true)
            panner.connect(biquad)
            pannerList[name] = panner
            return panner
        } else {
            let gainNode = context.createGain()
            gainNode.gain.value = 20.0
            gainNode.connect(context.destination)
            let panner = createPanner(true)
            panner.connect(gainNode)
            pannerList[name] = panner
            return panner
        }
    }

    /*
     * Evary EventLister are in this Method
     * socket
     * canvas
     * button
     */

    // socket

    syncPlay.loadBuffer(audioUrlList, () => {

    })
    // socket.on(socketDir + 'play', (body) => {
    //     console.log('syncPlay')
    //     console.log(body)
    //     let notes = body.notes
    //     notes.forEach((nt) => {
    //         syncNote = createSyncNote(nt.bufferName, body.time, body.offset, body.duration)
    //         syncNote = setCommonSyncNote(syncNote, nt.name)
    //         let panner = createIndividualPanner(nt.name)
    //         syncPlay.play(panner, syncNote)
    //         field.toPlayStatus(nt.name)
    //     })
    // })


    socket.call.on('connect', () => {
        clientID = uuid.v4()

        // field.setClientID(clientID)

        socket.emit(socketDir + 'register', {
            type: socketType,
            id: clientID,
            user: config.user
        })

        socket.on(socketDir + 'register', (body) => {
            if (body.id === clientID && body.name) {
                clientName = body.name
            }

            // htmlText.status.innerHTML = 'user: ' + clientName
        })


        // voice
        //
        socket.on(socketDir + 'voice', (buffer) => {
            console.log('getBuffer  ' + 'voice')

            syncPlay.addBuffer('voice', buffer, () => {
                socket.emit(socketDir + 'voice_ready', {
                    id: clientID,
                    user: config.user,
                    type: socketType,
                    voiceName: 'voice'
                })
                console.log('set Buffer')
            })
        })

        socket.on(socketDir + 'voice_play', (body) => {
            let notes = body.notes
            console.log(body)
            notes.forEach((nt) => {
                syncNote = createSyncNote(nt.bufferName, nt.time, nt.offset || 0, nt.duration || null)
                syncNote = setCommonSyncNote(syncNote, nt.name)
                let panner = createIndividualPanner(nt.name)
                syncPlay.play(panner, syncNote)
                // field.toPlayStatus(nt.name)
                console.log(nt.name)
            })
        })

        socket.on(socketDir + 'notification_common', (body) => {
            console.log(body)
            let from = body.from.indexOf(config.user) >= 0 ? true : false
            let to = body.to.indexOf(config.user) >= 0 ? true : false

            let fromText = ''
            body.from.forEach((n) => {
                fromText += n + ' '
            })
            let toText = ''
            body.to.forEach((n) => {
                toText += n + ' '
            })
            // htmlText.log.innerHTML = 'From: ' + fromText + '　To: ' + toText
            if (!from && !to) {
                return
            }

            body.notes.forEach((nt) => {

                let con = (t) => {
                    htmlText.log.innerHTML = panner.positionY.value
                    console.log(panner.positionY)

                    setTimeout(() => {
                        t += 100
                        if (t < 3000) {
                            con(t)
                        }
                    }, 100)
                }
                let linearRamp = (fromValue, toValue, time, callback, value, dif, passTime) => {
                    value = value ? value : fromValue
                    dif = dif ? dif : (toValue - fromValue) / (time / 10)
                    passTime = passTime ? passTime : 0
                    setTimeout(() => {
                        callback(value)
                        value += dif
                        passTime += 10
                        if (passTime < time) {
                            linearRamp(fromValue, toValue, time, callback, value, dif, passTime)
                        }
                    }, 10)
                }

                if (from) {
                    syncNote = createSyncNote(nt.bufferName, nt.time, nt.offset, nt.duration)
                    let panner = createIndividualPanner(nt.name)
                    panner.setPosition(0, 0, 0)
                    syncNote.started((leftTime) => {
                        let ct = syncPlay.getCurrentTime() + leftTime / 1000
                        // example,  safari for ios
                        if (typeof panner.positionY == 'undefined') {
                            setTimeout(() => {
                                linearRamp(0, 10, 0.6, (value) => {
                                    panner.setPosition(0, value, 0)
                                })
                            }, leftTime)
                        } else {
                            panner.positionY.linearRampToValueAtTime(0, ct + 0)
                            panner.positionY.linearRampToValueAtTime(10, ct + 0.6)
                        }
                    })
                    syncPlay.play(panner, syncNote)
                }
                if (to) {
                    syncNote = createSyncNote(nt.bufferName, nt.time, nt.offset, nt.duration)
                    let panner = createIndividualPanner(nt.name)
                    panner.setPosition(0, 10, 0)
                    syncNote.started((leftTime) => {
                        // htmlText.log.innerHTML = 'to started  ' + leftTime + (typeof panner.positionY)
                        let ct = syncPlay.getCurrentTime() + leftTime / 1000
                        if (typeof panner.positionY == 'undefined') {
                            setTimeout(() => {
                                linearRamp(10, 0, 600, (value) => {
                                    panner.setPosition(0, value, 0)
                                })
                            }, leftTime)
                        } else {
                            panner.positionY.linearRampToValueAtTime(10, ct + 0)
                            panner.positionY.linearRampToValueAtTime(0, ct + 0.6)
                        }
                    })
                    syncPlay.play(panner, syncNote)
                }
            })
        })


    })


    // button

    button.start.onclick = () => {

        // ios対策
        context.createBufferSource().start(0)

        let note = syncPlay.createSyncNote('notification_common', Date.now())
        syncPlay.play(context.destination, note)

        // htmlText.status.innerHTML = 'volume on'
    }

    button.notification.onclick = () => {
        context.createBufferSource().start(0)
        let toUserList = toList.getSelectUser()
        let fromUserList = fromList.getSelectUser()
        console.log(toUserList)
        console.log(fromUserList)
        let body = {
            id: clientID,
            type: socketType,
            user: config.user,
            from: fromUserList,
            to: toUserList
        }
        console.log(body)
        socket.emit(socketDir + 'notification_common', body)
    }
}


let createPanner = (side = 'from') => {
    var panner = context.createPanner()

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

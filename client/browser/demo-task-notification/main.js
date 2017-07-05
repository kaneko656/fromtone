let uuid = require('node-uuid')
// let job = require('./../Job/cron.js')

// let Canvas = require('./canvas/canvas.js')
let Field = require('./canvas/field.js')
let NoteIcon = require('./canvas/icon-note.js')
let SpeakerIcon = require('./canvas/icon-speaker.js')
let SyncPlay = require('./sync-play.js')
let NotificationButton = require('./../demo-common/html/button-notification.js')
let RadioButton = require('./../demo-common/html/radio-button.js')
let Slider = require('./../demo-common/html/slider.js')
let SliderSingle = require('./../demo-common/html/slider-single.js')

let Switch = require('./../demo-common/html/switch.js')
let HtmlText = require('./html/html-text.js')
let SelectList = require('./../demo-common/html/select-list.js')

let randomNotification = require('./random-notification.js')

let accel = require('./accel.js')


// let Biquad = require('./biquad.js')

let socketDir = 'demo_task_notification_'
let socketType = 'demo_task_notification'

let config = require('./../exCall-module/config')

let homeButton = require('./../demo-common/html/homeButton.js')

// let Voice = require('./createVoice.js')(config.VOICE_TEXT_API)
// let Slack = require('./slack.js')
let soundList = {
    '３音': 'lib/sound/notification-common.mp3',
    '和風メロディ': 'lib/sound/wafuringtone.mp3',
    'ウィンドチャイム': 'lib/sound/windchime.mp3',
    'アラーム': 'lib/sound/clockbell.mp3',
    '掃除機': 'lib/sound/cleaner.mp3',
    '水道で注ぐ': 'lib/sound/pouring_water.mp3',
    'コップ注ぐ': 'lib/sound/pouring_Japanese_tea.mp3',
    'ポッド': 'lib/sound/pod.mp3'
}

let soundNameList = []
for (let name in soundList) {
    soundNameList.push(name)
}

let notificationTypeList = ['Thing -> User（Single Move）', 'User -> Thing（Single Move）', 'Thing -> User -> Thing', 'User -> Thing -> User']

exports.start = (element, context, socket, clientTime, config) => {
    element.style.margin = '30px'

    console.log(config)

    let clientID = uuid.v4() // This is temporary. When websocket connected, this is replaced new id

    /**
     * create HTML
     */

    let htmlText = HtmlText(element)
    let thingList = SelectList(element, 'thing', 'Thing')
    let userList = SelectList(element, 'user', 'User')

    let notificationButton = NotificationButton(element)

    // Accel
    let accelLog = document.createElement('p')
    element.appendChild(accelLog)
    accel.moved(accelLog, () => {
        if (config.user == 'Thing-Pot') {
            notification(config.user, 'Thing-Cup')
        }
        if (config.user == 'Thing-Cup') {
            notification(config.user, 'Thing-Pot')
        }
    })

    // Switch
    let notificationRandomSwitch = SelectList(element, 'random', 'Random Notification')
    notificationRandomSwitch.setList(['on'])
    notificationRandomSwitch.onChange(() => {
        let select = notificationRandomSwitch.getSelectUser()
        if (select.indexOf('on') >= 0) {
            randomNotification.on(() => {
                let list = thingList.getUserList()
                let thing = list
                if (list.length >= 1) {
                    thing = list[Math.floor(Math.random() * list.length)]
                }
                notification(thing, config.user)
            })
        } else {
            randomNotification.off()
        }
    })

    // Notification Type
    let notificationType = RadioButton(element, 'notification_type', 'Notification Type')
    notificationType.setList(notificationTypeList)


    // Tone Select
    let radioButton = RadioButton(element, 'tone', 'Tone Select')
    radioButton.setList(soundNameList)

    // panner - slider
    let pannerSlider = Slider(element, 'panner', 'Panner Time')
    pannerSlider.setList()
    let p = document.createElement('p')
    p.innerHTML = '音像移動（開始点　終了点）<br>←音の開始　　→音の終了'
    element.appendChild(p)

    // panner - distance
    let distanceSlider = SliderSingle(element, 'distance', 'Panner Distance')
    distanceSlider.setList()
    let p_d = document.createElement('p')
    p_d.innerHTML = '←近い　→遠い'
    element.appendChild(p_d)

    // home button
    homeButton(element, config.user)

    /**
     * selectList - socket
     */

    let listSelection = (list) => {
        if (!Array.isArray(list) && list) {
            let temp = list
            list = []
            list.push(temp)
        }

        let thing = []
        let user = []
        list.forEach((name) => {
            if (name.indexOf('Thing') >= 0) {
                thing.push(name)
            } else {
                user.push(name)
            }
        })

        return {
            thing: thing,
            user: user
        }
    }

    socket.on(socketDir + 'user_list', (list) => {
        let selection = listSelection(list)
        thingList.setList(selection.thing)
        userList.setList(selection.user)
        userList.check(config.user)
    })

    socket.on(socketDir + 'user_add', (list) => {
        let selection = listSelection(list)
        thingList.addUser(selection.thing)
        userList.addUser(selection.user)
    })

    socket.on(socketDir + 'user_remove', (list) => {
        let selection = listSelection(list)
        thingList.removeUser(selection.thing)
        userList.removeUser(selection.user)
    })

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

    syncPlay.loadBuffer(soundList, () => {

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

            htmlText.status.innerHTML = 'user: ' + clientName
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
            htmlText.log.innerHTML = 'From: ' + fromText + '　To: ' + toText
            if (!from && !to) {
                return
            }



            body.notes.forEach((nt) => {
                console.log(nt.notification)
                let nIdx = notificationTypeList.indexOf(nt.notification)
                nIdx = nIdx <= 0 ? 0 : nIdx
                if (nIdx == 0) {
                    let syncNote = playNotification(nt, from, to)
                    syncNote.finished(() => {
                        notificationButton.notificationText.innerHTML = '　'
                    })
                }

                if (nIdx == 1) {
                    from = !from
                    to = !to
                    let syncNote = playNotification(nt, from, to)
                    syncNote.finished(() => {
                        notificationButton.notificationText.innerHTML = '　'
                    })
                }


                if (nIdx == 2) {
                    let syncNote = playNotification(nt, from, to)
                    syncNote.finished(() => {
                        from = !from
                        to = !to
                        nt.time += syncNote.duration
                        syncNote2 = playNotification(nt, from, to)
                        syncNote2.finished(() => {
                            notificationButton.notificationText.innerHTML = '　'
                        })
                    })
                }

                if (nIdx == 3) {
                    from = !from
                    to = !to
                    let syncNote = playNotification(nt, from, to)
                    syncNote.finished(() => {
                        from = !from
                        to = !to
                        nt.time += syncNote.duration
                        syncNote2 = playNotification(nt, from, to)
                        syncNote2.finished(() => {
                            notificationButton.notificationText.innerHTML = '　'
                        })
                    })
                }
            })
        })
    })

    let con = (t) => {
        htmlText.log.innerHTML = panner.positionY.value

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

    let playNotification = (nt, from, to) => {
        if (from) {
            syncNote = createSyncNote(nt.sound, nt.time, nt.offset, nt.duration)
            let panner = createIndividualPanner(nt.name)

            let dist = nt.distance || 30
            panner.setPosition(0, 0, 0)

            syncNote.started((leftTime) => {

                let ct = syncPlay.getCurrentTime() + leftTime / 1000
                let startValue = Array.isArray(nt.panner) && nt.panner.length == 2 ? nt.panner[0] / 100 : 0.2
                let start = startValue * syncNote.duration
                let endValue = Array.isArray(nt.panner) && nt.panner.length == 2 ? nt.panner[1] / 100 : 0.8
                let end = endValue * syncNote.duration
                console.log('from', 'start', start, 'end', end, 'dist', dist)

                // example,  safari for ios
                if (typeof panner.positionY == 'undefined') {
                    setTimeout(() => {
                        linearRamp(0, dist, end - start, (value) => {
                            panner.setPosition(0, value, 0)
                        })
                    }, leftTime + start)
                } else {
                    panner.positionY.linearRampToValueAtTime(0, ct + start / 1000)
                    panner.positionY.linearRampToValueAtTime(dist, ct + end / 1000)
                }
            })
            syncPlay.play(panner, syncNote)
            return syncNote
        }

        if (to) {
            syncNote = createSyncNote(nt.sound, nt.time, nt.offset, nt.duration)
            let panner = createIndividualPanner(nt.name)

            let dist = nt.distance || 30
            panner.setPosition(0, dist, 0)

            syncNote.started((leftTime) => {
                let ct = syncPlay.getCurrentTime() + leftTime / 1000
                let startValue = Array.isArray(nt.panner) && nt.panner.length == 2 ? nt.panner[0] / 100 : 0.2
                let start = startValue * syncNote.duration
                let endValue = Array.isArray(nt.panner) && nt.panner.length == 2 ? nt.panner[1] / 100 : 0.8
                let end = endValue * syncNote.duration

                console.log('from', 'start', start, 'end', end, 'dist', dist)

                if (typeof panner.positionY == 'undefined') {
                    setTimeout(() => {
                        linearRamp(dist, 0, end - start, (value) => {
                            panner.setPosition(0, value, 0)
                        })
                    }, leftTime + start)
                } else {
                    panner.positionY.linearRampToValueAtTime(dist, ct + start / 1000)
                    panner.positionY.linearRampToValueAtTime(0, ct + end / 1000)
                }
                // con(0)
            })
            syncPlay.play(panner, syncNote)

            return syncNote
        }
    }


    /**
     * Button click
     */

    notificationButton.test.onclick = () => {

        console.log('Test Play')

        // ios対策
        context.createBufferSource().start(0)

        let soundName = radioButton.getSelected()

        let note = syncPlay.createSyncNote(soundName, Date.now())
        syncPlay.play(context.destination, note)

        // htmlText.status.innerHTML = 'volume on'
    }

    notificationButton.notification.onclick = () => {
        notificationButton.notificationText.innerHTML = '♪'
        context.createBufferSource().start(0)
        notification()
    }

    let notification = (from, to) => {
        let fromList = from || thingList.getSelectUser()
        let toList = to || userList.getSelectUser()
        let soundName = radioButton.getSelected()
        let pannerValues = pannerSlider.getValues()
        let pannerDistance = distanceSlider.getValue()
        let nType = notificationType.getSelected()
        let body = {
            id: clientID,
            type: socketType,
            user: config.user,
            from: fromList,
            to: toList,
            sound: soundName,
            panner: pannerValues,
            distance: pannerDistance,
            notification: nType
        }
        console.log(body)
        socket.emit(socketDir + 'notification_common', body)
    }
}


let createPanner = () => {
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

    // default equalpower
    panner.panningModel = 'equalpower'
    // panner.panningModel = 'HRTF'

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

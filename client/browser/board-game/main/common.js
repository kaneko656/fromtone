const uuid = require('node-uuid')

const Canvas = require('./../canvas/canvas.js')
const CardField = require('./../card/objectField.js')
const Card = require('./../card/cardList.js')

const loginWindow = require('./loginWindow.js')
const Job = require('./../Job/cron.js')

let socketDir = 'board_game_'
let socketType = 'board_game'

let log = require('./../player/log.js')
// const cardList = {
//     'アリバイ': 'lib/image/card/アリバイ.png',
//     'いぬ': 'lib/image/card/いぬ.png',
//     'うわさ': 'lib/image/card/うわさ.png',
//     'たくらみ': 'lib/image/card/たくらみ.png',
//     '一般人': 'lib/image/card/一般人.png',
//     '取り引き': 'lib/image/card/取り引き.png',
//     '情報交換': 'lib/image/card/情報交換.png',
//     '第一発見者': 'lib/image/card/第一発見者.png',
//     '犯人': 'lib/image/card/犯人.png',
//     '目撃者': 'lib/image/card/アリバイ.png',
//     '裏': 'lib/image/card/裏.png'
// }

exports.start = (canvas, context, socket, clientTime, config) => {

    /**
     * init
     */

    let clientID = uuid.v4()

    socket.emit(socketDir + 'register', {
        type: socketType,
        id: clientID,
        user: config.user
    })

    let field = CardField(canvas, context)
    field.setClientID(clientID)
    // field.setClip(0, 0.3, 0.8, 0.8)


    /**
     * send object
     */

    let bufferTime = 30
    let sendObjectBuffer = []
    field.sendObjectInfo((sendObj, option) => {
        let start = (sendObjectBuffer.length == 0)
        if (sendObj.events.length >= 1) {
            start = true
        }
        if (!start) {
            return
        }

        sendObj.timestamp = Math.floor(clientTime.correctionToServerTime(sendObj.timestamp))
        sendObjectBuffer.push(sendObj)

        // 自分の描画を高速に
        if (field.objects[sendObj.id]) {
            field.updateObjects(sendObj)
        }
        let now = Date.now()
        let date1 = new Date(Math.floor(now / bufferTime) * bufferTime + bufferTime)
        let date2 = new Date(Math.floor(now / bufferTime) * bufferTime + bufferTime * 2)
        if (start) {
            Job(date1, () => {
                if (sendObjectBuffer.length >= 1) {
                    socket.emit(socketDir + 'sendObjectInfo', sendObjectBuffer)
                    sendObjectBuffer = []
                }
            })
            Job(date2, () => {
                if (sendObjectBuffer.length >= 1) {
                    socket.emit(socketDir + 'sendObjectInfo', sendObjectBuffer)
                    sendObjectBuffer = []
                }
            })
        }
    })

    /**
     * catch Object
     */

    socket.on(socketDir + 'sendObjectInfo', (objects) => {
        objects.forEach((obj) => {
            // remove myObject
            if (field.objects[obj.id] && obj.clientID == clientID) {
                return
            }

            // card set
            if (!field.isObject(obj.id)) {
                let card = Card(obj.name)
                card.id = obj.id
                field.setObject(card)
            }

            // time correction
            obj.time = clientTime.correctionServerTime(obj.time)
            obj.startTime = clientTime.correctionServerTime(obj.startTime)

            // update at time
            let date = new Date(obj.time)
            if (date <= Date.now()) {
                field.updateObjects(obj)
            } else {
                Job(date, () => {
                    field.updateObjects(obj)
                })
            }
        })

        // sound Update
        field.updateSounds(objects)
    })


    /**
     * Key
     */

    let moved = (x, y) => {
        field.mouseMoved(x, y)
    }

    let clicked = (x, y) => {
        // ios対策
        context.createBufferSource().start(0)
        field.mousePressed(x, y)
    }

    let released = (x, y) => {
        field.mouseReleased(x, y)
    }


    canvas.addEventListener('mousemove', function(e) {
        moved(e.offsetX, e.offsetY)
    })

    canvas.addEventListener('touchmove', function(e) {
        e.preventDefault()
        let rect = e.target.getBoundingClientRect()
        let x = e.changedTouches[0].clientX - rect.left
        let y = e.changedTouches[0].clientY - rect.top
        moved(x, y)
        return false
    })

    canvas.addEventListener('mousedown', function(e) {
        clicked(e.offsetX, e.offsetY)
    })

    canvas.addEventListener('touchstart', function(e) {
        e.preventDefault()
        let rect = e.target.getBoundingClientRect()
        let x = e.changedTouches[0].clientX - rect.left
        let y = e.changedTouches[0].clientY - rect.top
        clicked(x, y)
        return false
    })

    canvas.addEventListener('mouseup', function(e) {
        released(e.offsetX, e.offsetY)
    })

    canvas.addEventListener('touchend', function(e) {
        e.preventDefault()
        let rect = e.target.getBoundingClientRect()
        let x = e.changedTouches[0].clientX - rect.left
        let y = e.changedTouches[0].clientY - rect.top
        released(x, y)
        return false
    })

    return {
        socketDir: socketDir,
        socketType: socketType,
        clientID: clientID,
        canvas: canvas,
        field: field
    }
}

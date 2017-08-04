const uuid = require('node-uuid')

const Canvas = require('./../canvas/canvas.js')
const CardField = require('./../card/objectField.js')
const Card = require('./../card/cardList.js')
const CardCase = require('./../card/objectCase.js')

const loginWindow = require('./loginWindow.js')
const Job = require('./../Job/cron.js')

let socketDir = 'demo_'
let socketType = 'demo'

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

let clientID = null
exports.register = (canvas, context, socket, clientTime, config) => {
    clientID = uuid.v4()

    socket.emit(socketDir + 'register', {
        type: socketType,
        id: clientID,
        user: config.user
    })
}

exports.start = (canvas, context, socket, clientTime, config) => {

    /**
     * init
     */

    if (!clientID) {
        clientID = uuid.v4()
        socket.emit(socketDir + 'register', {
            type: socketType,
            id: clientID,
            user: config.user
        })
    }

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
        if (sendObjectBuffer.length > 0 && sendObj.events.length == 0) {
            return
        }

        // 自分の描画を高速に
        // if (field.objects[sendObj.id]) {
        //     let date = new Date(sendObj.timestamp)
        //     if (date <= Date.now()) {
        //         field.updateObjects(sendObj)
        //     } else {
        //         Job(date, () => {
        //             field.updateObjects(sendObj)
        //         })
        //     }
        // }
        // update at time
        sendObj.timestamp = Math.floor(clientTime.correctionToServerTime(sendObj.timestamp))
        sendObjectBuffer.push(sendObj)


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
        updateObjects(objects)
    })

    let updateObjects = (objects) => {
        if (!Array.isArray(objects)) {
            let temp = objects
            objects = []
            objects.push(temp)
        }
        objects.forEach((obj) => {
            // remove myObject
            // if (field.objects[obj.id] && obj.clientID == clientID) {
            //     return
            // }

            // card set
            if (!field.isObject(obj.id)) {
                let card = Card(obj.name)
                card.id = obj.id
                card.types = obj.types
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
            field.updateSounds(obj)
        })
    }

    field.sendObjectCaseInfo((sendObj, option) => {
        socket.emit(socketDir + 'sendObjectCaseInfo', sendObj)
    })

    socket.on(socketDir + 'sendObjectCaseInfo', (upObj) => {
        // updateObjects(objects)
        let id = upObj.id
        if (!field.objectCase[id]) {
            let cardCase = CardCase()
            cardCase.id = id
            cardCase.update(upObj)
            field.setObjectCase(cardCase)
            field.render()
        } else {
            field.objectCase[id].update(upObj)
            field.render()
        }
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
        field: field,
        updateObjects: updateObjects
    }
}

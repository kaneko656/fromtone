const uuid = require('node-uuid')

const Canvas = require('./../canvas/canvas.js')
const CardField = require('./../card/objectField.js')
const Card = require('./../card/cardList.js')

const loginWindow = require('./loginWindow.js')
const Job = require('./../Job/cron.js')

let socketDir = 'board_game_'
let socketType = 'board_game'


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

exports.start = (element, context, socket, clientTime, config) => {
    // element.style.margin = '30px'

    let clientID = uuid.v4()

    socket.emit(socketDir + 'register', {
        type: socketType,
        id: clientID,
        user: config.user
    })

    // loginWindow.start(element, context, socket, clientTime, config)
    let canvas = Canvas(element)
    let field = CardField(canvas, context)
    let card = Card()
    card['アリバイ'].scale = 0.5
    field.setObject(card['アリバイ'])
    field.setClientID(clientID)

    // sound
    setTimeout(() => {
        field.startSound(card['アリバイ'].id)
    }, 3000)

    let timeout = 10
    let lastEmitTime = 0
    field.sendObjectInfo((sendObj) => {
        if (Date.now() - lastEmitTime > timeout) {
            sendObj.timestamp = Math.floor(clientTime.correctionToServerTime(sendObj.timestamp))
            socket.emit(socketDir + 'sendObjectInfo', sendObj)
            field.updateObjects(sendObj)
            lastEmitTime = Date.now()
        }
    })

    socket.on(socketDir + 'sendObjectInfo', (objects) => {
        objects.forEach((obj) => {
            obj.time = clientTime.correctionServerTime(obj.time)
            if (obj.clientID == clientID) {
                return
            }
            let date = new Date(obj.time)
            Job(date, () => {
                field.updateObjects(obj)
            })
        })
        field.updateSounds(objects)
    })


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

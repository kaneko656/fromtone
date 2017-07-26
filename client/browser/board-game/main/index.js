const Canvas = require('./../canvas/canvas.js')
const CardField = require('./../card/objectField.js')
const Card = require('./../card/cardList.js')

const loginWindow = require('./loginWindow.js')

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
    //
    // loginWindow.start(element, context, socket, clientTime, config)
    let canvas = Canvas(element)
    let field = CardField(canvas)
    let card = Card()
    card['アリバイ'].scale = 0.5
    field.setObject(card['アリバイ'])

    // let globalPosition = GlobalPositon()
    // 中心 0.5, 0.6 halfW 0.3 halfH 0.2
    // Main
    // let area1 = globalPosition.clip(0, 0, 0.4, 0.3)
    // let area2 = globalPosition.clip(0.7, 0.7, 0.15, 0.3)

    // socket.on(socketDir + '', () => {
    //
    // })
    field.sendObjectInfo((sendObj) => {
        console.log(sendObj)
        let cards = []
        cards.push(sendObj)
        field.updateObjects(cards)
    })



    let moved = (x, y) => {
        field.mouseMoved(x, y)
        // var ctx = canvas.getContext('2d')
        // let gx = (x / canvas.width) * 2 - 1
        // let gy = (y / canvas.height) * 2 - 1
        // area1.render(ctx, canvas.width, canvas.height, gx, gy)
    }

    let clicked = (x, y) => {
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
}

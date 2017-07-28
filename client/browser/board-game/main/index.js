const uuid = require('node-uuid')

const Canvas = require('./../canvas/canvas.js')
const CardField = require('./../card/objectField.js')
const Card = require('./../card/cardList.js')
const CardCase = require('./../card/objectCase.js')

const Job = require('./../Job/cron.js')

// const loginWindow = require('./loginWindow.js')

let socketDir = 'board_game_'
let socketType = 'board_game'

const Main = require('./common.js')

exports.start = (element, context, socket, clientTime, config) => {
    // element.style.margin = '30px'
    //
    let canvas = Canvas(element)

    let main = Main.start(canvas, context, socket, clientTime, config)
    let field = main.field

    let cardCase = CardCase()
    cardCase.id = config.user + '_case'
    cardCase.area.y = 100
    cardCase.area.w = canvas.width
    cardCase.push(Card('たくらみ'))
    cardCase.push(Card('探偵'))
    cardCase.push(Card('うわさ'), 50)
    cardCase.render = (ctx) => {
        cardCase.objects.forEach((object) => {
            let obj = object.object
            let posX = object.posX
            let posY = object.posY
            let temp = obj.icon
            obj.x = posX
            obj.y = posY
            obj.icon = Card('裏').icon
            obj.scale = 0.3
            obj.draw(ctx)
        })
    }
    field.setObjectCase(cardCase)

    console.log(cardCase.objects)

    let card = Card('アリバイ')


    card.x = canvas.width / 2
    card.y = canvas.height / 2
    card.scale = 0.5
    field.sendObjectInfoToServer(card.output())
    field.setClip(0, 0, 0.5, 0.5)
    // field.setLocalPosition(0, 0, canvas.width, canvas.height)
    // field.rotate(Math.PI)
}

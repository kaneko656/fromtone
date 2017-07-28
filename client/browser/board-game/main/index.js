const uuid = require('node-uuid')

const Canvas = require('./../canvas/canvas.js')
const CardField = require('./../card/objectField.js')
const Card = require('./../card/cardList.js')

const Job = require('./../Job/cron.js')

// const loginWindow = require('./loginWindow.js')

let socketDir = 'board_game_'
let socketType = 'board_game'

const Main = require('./common.js')

exports.start = (element, context, socket, clientTime, config) => {
    // element.style.margin = '30px'
    let main = Main.start(element, context, socket, clientTime, config)
    let field = main.field
    let canvas = main.canvas
    let card = Card('アリバイ')

    card.scale = 0.5
    field.sendObjectInfoToServer(card.output())
    // field.setClip(0, -0.5, 0.2, 0.2)
    // field.setLocalPosition(0, 0, canvas.width, canvas.height)
    // field.rotate(Math.PI)
}

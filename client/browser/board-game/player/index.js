const Canvas = require('./../canvas/canvas.js')
const CardField = require('./../card/field.js')
const Card = require('./../card/cardList.js')


exports.start = (element, context, socket, clientTime, config) => {
    // element.style.margin = '30px'
    let canvas = Canvas(element)
    let cardField = CardField(canvas)
    let card = Card()
    cardField.setCard(card['アリバイ'])
}

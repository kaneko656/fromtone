const uuid = require('node-uuid')

const player = require('./player.js')

exports.start = (element, context, socket, clientTime, config) => {
    // element.style.margin = '30px'


    player.start(element, context, socket, clientTime, config)
}

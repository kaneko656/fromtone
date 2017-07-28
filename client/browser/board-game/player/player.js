const uuid = require('node-uuid')

const Canvas = require('./../canvas/canvas.js')
const CardField = require('./../card/objectField.js')
const Card = require('./../card/cardList.js')
const CardCase = require('./../card/objectCase.js')

const Job = require('./../Job/cron.js')

// const loginWindow = require('./loginWindow.js')

let socketDir = 'board_game_'
let socketType = 'board_game'

const Main = require('./../main/common.js')
const log = require('./log.js')


exports.start = (element, context, socket, clientTime, config) => {
    // element.style.margin = '30px'
    log.set(element)

    let canvas = Canvas(element)

    let start = false
    // let button = document.createElement('button')
    // button.setAttribute('class', 'btn btn-info')
    // button.innerHTML = 'start'
    // element.appendChild(button)


    let loadSound = (url, callback = () => {}) => {
        let request = new XMLHttpRequest()
        request.open('GET', url, true)
        request.responseType = 'arraybuffer'
        request.onload = function() {
            context.decodeAudioData(request.response, function(buffer) {
                callback(buffer)
            }, (err) => {
                console.log(err)
            })
        }
        request.send()
    }

    canvas.addEventListener('mousedown', function(e) {
        // context.createBufferSource().start(0)
        if (!start) {
            let url = 'lib/sound/notification-common.mp3'
            loadSound(url, (buffer) => {
                let source = context.createBufferSource()
                source.buffer = buffer
                source.connect(context.destination)
                source.start(0)

                let main = Main.start(canvas, context, socket, clientTime, config)
                let field = main.field

                if (config.user == 'up') {
                    field.setClip(0, -0.5, 0.5, 0.5)
                    field.rotate(Math.PI)
                }
                if (config.user == 'down') {
                    field.setClip(0, 0.5, 0.5, 0.5)
                }
                if (config.user == 'left') {
                    field.setClip(-0.5, 0, 0.5, 0.5)
                    field.rotate(Math.PI/2)
                }
                if (config.user == 'right') {
                    field.setClip(0.5, 0, 0.5, 0.5)
                    field.rotate(-Math.PI/2)
                }
                field.setLocalPosition(0, 0, canvas.width, canvas.height)
            })
        }
    })

}

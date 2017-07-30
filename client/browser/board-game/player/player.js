const uuid = require('node-uuid')

const Canvas = require('./../card/canvas.js')
const CardField = require('./../card/objectField.js')
const Card = require('./../card/cardList.js')
const CardCase = require('./../card/objectCase.js')

const Job = require('./../Job/cron.js')

// const loginWindow = require('./loginWindow.js')

let socketDir = 'board_game_'
let socketType = 'board_game'

const Main = require('./../main/common.js')
const log = require('./log.js')

let ToolField = require('./../card/tool/toolField.js')


exports.start = (element, context, socket, clientTime, config) => {
    // element.style.margin = '200px'
    // element.style.width = window.innerWidth + 'px'
    // element.style.height = window.innerHeight + 'px'
    element.style.position = 'fixed'
    element.style.width = window.innerWidth + 'px';
    element.style.height = window.innerHeight + 'px';
    element.style.overflow = 'hidden'
    // log.set(element)

    function enterFullscreen() {
        let x = element
        if (x.webkitRequestFullScreen) {
            x.webkitRequestFullScreen()
        } else if (x.mozRequestFullScreen) {
            x.mozRequestFullScreen()
        } else {
            x.requestFullScreen()
        }
    }


    //フルスクリーンを解除
    function exitFullscreen() {
        if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen()
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen()
        } else {
            document.exitFullscreen()
        }
    }


    element.style.width = document.documentElement.clientWidth
    element.style.height = document.documentElement.clientHeight


    let canvas = Canvas(element, 1.0 * 1.1, 0.9 * 1.1)

    let isStart = false

    // 描画
    let startDraw = () => {
        let ctx = canvas.getContext('2d')
        let font = ctx.font.split(' ')
        let fontSize = window.devicePixelRatio * 15
        ctx.font = fontSize + "px '" + font[1] + "'"
        ctx.textAlign = 'center'
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.save()
        ctx.beginPath()
        ctx.fillStyle = 'rgba(0,0,0,0.9)'
        ctx.fillText('Start :  Please Touch !', canvas.width / 2, canvas.height / 2)
        ctx.restore()
    }
    let waitDraw = () => {
        let ctx = canvas.getContext('2d')
        let font = ctx.font.split(' ')
        let fontSize = window.devicePixelRatio * 15
        ctx.font = fontSize + "px '" + font[1] + "'"
        ctx.textAlign = 'center'
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.save()
        ctx.beginPath()
        ctx.fillStyle = 'rgba(0,0,0,0.9)'
        ctx.fillText('Please wait until the game starts', canvas.width / 2, canvas.height / 2)
        ctx.restore()
    }

    // 開始時
    startDraw()

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

    canvas.addEventListener('mousedown', firstClick)
    canvas.addEventListener('touchstart', firstClick)

    function firstClick() {

        if (!isStart) {
            let url = 'lib/sound/notification-common.mp3'
            loadSound(url, (buffer) => {
                let source = context.createBufferSource()
                source.buffer = buffer
                source.connect(context.destination)
                source.start(0)
            })
            waitDraw()
            Main.register(canvas, context, socket, clientTime, config)
            isStart = true
        }
        // enterFullscreen()
        // setTimeout(() => {
        //     exitFullscreen()
        // }, 10000)
    }

    socket.on(socketDir + 'game_start', (body) => {
        console.log(body)
        // user{}
        // gx, gy
        start()
    })

    let start = () => {
        let main = Main.start(canvas, context, socket, clientTime, config)
        let field = main.field
        field.user = config.user

        let toolCanvas = Canvas(element, 1.0 * 1.1, 0.1 * 1.1)
        let tool = ToolField(toolCanvas)
        tool.render()

        if (config.user == 'up') {
            field.setClip(0, -0.5, 0.3, 0.3)
            field.rotate(Math.PI)
        }
        if (config.user == 'down') {
            field.setClip(0, 0.5, 0.3, 0.3)
        }
        if (config.user == 'left') {
            field.setClip(-0.5, 0, 0.3, 0.3)
            field.rotate(Math.PI / 2)
        }
        if (config.user == 'right') {
            field.setClip(0.5, 0, 0.3, 0.3)
            field.rotate(-Math.PI / 2)
        }
        field.setLocalPosition(0, 0, canvas.width, canvas.height)

        let cardCase = CardCase()
        cardCase.id = config.user
        cardCase.area.x = 0
        cardCase.area.y = canvas.height - 150
        cardCase.area.h = 150
        cardCase.area.w = canvas.width
        cardCase.render = (ctx) => {
            let a = cardCase.area
            ctx.beginPath()
            ctx.rect(a.x, a.y, a.w, a.h)
            ctx.stroke()
            cardCase.objects.forEach((object) => {
                let obj = object.object
                let posX = object.posX
                let posY = object.posY
                let temp = obj.icon
                obj.x = posX
                obj.y = posY
                obj.icon = Card(obj.name).icon
                obj.scale = 0.3
                obj.draw(ctx)
            })
        }
        field.setObjectCase(cardCase)

    }

}

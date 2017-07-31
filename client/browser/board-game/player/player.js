const uuid = require('node-uuid')

const Canvas = require('./../card/canvas.js')
const CardField = require('./../card/objectField.js')
const Card = require('./../card/cardList.js')
const CardCase = require('./../card/objectCase.js')
const connect = require('./../../connect.js')
const SoundManager = require('./../card/sound/soundManager.js')

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

    // loadをする
    SoundManager.init(context)

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


    let canvas = Canvas(element, 1.0, 0.9)

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

    let source = context.createBufferSource()
    let url = 'lib/sound/notification-common.mp3'
    loadSound(url, (buffer) => {
        source.buffer = buffer
        let gainNode = context.createGain()
        gainNode.connect(context.destination)
        gainNode.gain.value = 0.5
        source.connect(context.destination)
    })

    function firstClick() {
        if (!isStart) {
            source.start(0)
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
        if (config.user in body) {
            let b = body[config.user]
            let pos = Object.assign({}, body)
            start(body, b.gx, b.gy)
            console.log(pos)
            pos['Field'] = {
                gx: 0,
                gy: 0
            }
            SoundManager.setSpeakerPosition(pos, config.user)
        }
        // user{}
        // gx, gy

    })

    let start = (list, gx, gy) => {
        let main = Main.start(canvas, context, socket, clientTime, config)
        let field = main.field
        field.user = config.user
        let pos = Object.assign({}, list)
        pos['Field'] = {
            gx: 0,
            gy: 0
        }
        field.setPositionDistObject(pos)
        field.setPositionDistFromTo(config.user, 'Field')

        let toolCanvas = Canvas(element, 1.0, 0.1)
        let tool = ToolField(toolCanvas)
        tool.render()

        field.setClip(gx, gy, 0.1, 0.1)
        let angle = Math.atan2(0 - gy, 0 - gx) + Math.PI / 2
        field.rotate(angle)

        field.setLocalPosition(0, 0, canvas.width, canvas.height)

        let cardCase = CardCase()
        cardCase.id = config.user
        cardCase.area.x = 0
        cardCase.area.w = canvas.width
        cardCase.area.h = canvas.height * 0.2
        cardCase.area.y = canvas.height - cardCase.area.h

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
                obj.scale = cardCase.area.h / obj.h * 0.9
                obj.draw(ctx)
            })
        }
        field.setObjectCase(cardCase)

        delete list[config.user]

        tool.setUser('Field')
        for (let user in list) {
            tool.setUser(user)
        }
        tool.render()

        connect.on('toolMode', (id) => {
            if (id == 'pointMove') {
                field.setClip(gx, gy, 0.3, 0.3, angle, true)
                field.setPositionDistFromTo(config.user, 'Field')
                console.log(gx, gy, 0.3, 0.3)
            }
            if (id == 'separate') {

            }
            if (id == 'Field') {
                let otherGx = 0
                let otherGy = 0

                let dist = Math.sqrt((otherGx - gx) * (otherGx - gx) + (otherGy - gy) * (otherGy - gy))
                let cx = gx + (otherGx - gx) / 2
                let cy = gy + (otherGy - gy) / 2
                let angleToOther = Math.atan2(otherGy - gy, otherGx - gx) + Math.PI / 2
                field.setClip(cx, cy, dist * 0.6, dist * 0.6, angleToOther, true)
                field.setPositionDistFromTo(config.user, 'Field')
                for (let id in field.objectCase) {
                    if (id != config.user) {
                        field.objectCase[id].noDraw = true
                        field.objectCase[id].noOperation = true
                    }
                }
            } else if (id in list) {
                let user = id
                let otherUser = user
                let otherGx = list[user].gx
                let otherGy = list[user].gy

                let dist = Math.sqrt((otherGx - gx) * (otherGx - gx) + (otherGy - gy) * (otherGy - gy))
                let cx = gx + (otherGx - gx) / 2
                let cy = gy + (otherGy - gy) / 2
                let angleToOther = Math.atan2(otherGy - gy, otherGx - gx) + Math.PI / 2
                field.setClip(cx, cy, dist * 0.6, dist * 0.6, angleToOther, true)
                field.setPositionDistFromTo(config.user, id)

                if (field.objectCase[user]) {
                    field.objectCase[user].area.w = field.w
                    field.objectCase[user].area.h = canvas.height * 0.15
                    field.objectCase[user].sort()
                    field.objectCase[user].noDraw = false
                    field.objectCase[user].noOperation = false
                }
                for (let id in field.objectCase) {
                    if (id != user && id != config.user) {
                        field.objectCase[id].noDraw = true
                        field.objectCase[id].noOperation = true
                    }
                }
                console.log(cx, cy, dist * 0.6, dist * 0.6)
            }
            field.render()

        })

    }

}

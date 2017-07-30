const uuid = require('node-uuid')

const Canvas = require('./../card/canvas.js')
const CardField = require('./../card/objectField.js')
const Card = require('./../card/cardList.js')
const CardCase = require('./../card/objectCase.js')

const Job = require('./../Job/cron.js')

// const loginWindow = require('./loginWindow.js')

let socketDir = 'board_game_'
let socketType = 'board_game'

const Main = require('./common.js')
const PlayRoom = require('./playRoom.js')
let ToolField = require('./../card/tool/toolField.js')

const cardDistribution = require('./../card/cardDistribution.js')

exports.start = (element, context, socket, clientTime, config) => {
    // element.style.margin = '30px'
    config.socketDir = socketDir
    config.socketType = socketType
    //
    element.style.width = window.innerWidth + 'px'
    element.style.height = window.innerHeight + 'px'
    // element.style.width = '100%'
    // element.style.height = '100%'
    // console.log(element)
    // element.style.overflow = 'hidden'
    // console.log(width, height, document.body.clientHeight)
    let canvas = Canvas(element, 1.0, 0.9)
    let main = Main.start(canvas, context, socket, clientTime, config)
    let field = main.field

    let toolCanvas = Canvas(element, 1.0, 0.1)
    let tool = ToolField(toolCanvas)
    tool.render()

    let playRoom = PlayRoom.start(canvas, field, socket, clientTime, config, (list) => {
        phase1(list)
    })



    // field.setLocalPosition(0, 0, canvas.width, canvas.height)
    // field.rotate(Math.PI)
    //
    let phase1 = (list) => {
        let cards = cardDistribution.distribution(Object.keys(list).length)
        let n = 0
        for (let user in list) {
            list[user].cards = cards[n]
            n++
            console.log(list[user])
        }

        let userNum = 0
        let userMaxNum = Object.keys(list).length
        for (let user in list) {
            let x = list[user].x
            let y = list[user].y
            list[user].cards.forEach((card, i) => {
                card.x = canvas.width / 2
                card.y = canvas.height / 2
                card.events.push('initial')
                setTimeout(() => {
                    field.sendObjectInfoToServer(card.output())
                }, userNum * 1000 + i * userMaxNum * 1000)
                setTimeout(() => {
                    let obj = field.getObject(card.id)
                    field.autoMove(obj, x, y, {
                        duration: 1000,
                        delay: 1000
                    })
                }, userNum * 1000 + i * userMaxNum * 1000 + 1500)
            })
            userNum++
        }
        // setTimeout(() => {
        //     for (let user in list) {
        //         let x = list[user].x
        //         let y = list[user].y
        //         list[user].cards.forEach((card) => {
        //             let obj = field.getObject(card.id)
        //             field.autoMove(obj, x, y, {
        //                 duration: 3000
        //             })
        //         })
        //     }
        // }, 1500)
        // move

    }
    let phase2 = () => {
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
    }
}

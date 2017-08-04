const uuid = require('node-uuid')
let HtmlText = require('./../html/html-text.js')
let SelectList = require('./../../demo-common/html/select-list.js')
let NotificationButton = require('./../../demo-common/html/button-notification.js')
let SwitchButton = require('./../html/switchButton.js')
let homeButton = require('./../../demo-common/html/homeButton.js')


let socketDir = 'demo_'
let socketType = 'demo'

exports.start = (element, context, socket, clientTime, config) => {

    let clientID = uuid.v4() // This is temporary. When websocket connected, this is replaced new id


    let htmlText = HtmlText(element)
    let fromList = SelectList(element, 'from', 'From')
    let toList = SelectList(element, 'to', 'To')

    let notificationButton = NotificationButton(element)

    /*
     *  SwitchButton
     */

    let switchButton = SwitchButton(element)
    switchButton.onGyroSwitch((toggle) => {
        if (!canUse) {
            switchButton.gyroButton.innerHTML = 'Can not use Gyro Sensor'
            return
        }
        gyroSwitch = toggle
    })

    homeButton(element, config.user)

    socket.on(socketDir + 'user_list', (list) => {
        toList.setList(list)
        fromList.setList(list)
        fromList.check(config.user)
    })

    socket.on(socketDir + 'user_add', (user) => {
        toList.addUser(user)
        fromList.addUser(user)
    })

    socket.on(socketDir + 'user_remove', (user) => {
        toList.removeUser(user)
        fromList.removeUser(user)
    })

    socket.call.on('connect', () => {
        clientID = uuid.v4()
        // field.setClientID(clientID)

        socket.emit(socketDir + 'register', {
            type: socketType,
            id: clientID,
            user: config.user
        })

        socket.on(socketDir + 'register', (body) => {
            if (body.id === clientID && body.name) {
                clientName = body.name
            }

            htmlText.status.innerHTML = 'user: ' + clientName
        })


        socket.on(socketDir + 'notification_common', (body) => {
            console.log(body)
            let from = body.from.indexOf(config.user) >= 0 ? true : false
            let to = body.to.indexOf(config.user) >= 0 ? true : false

            let fromText = ''
            body.from.forEach((n) => {
                fromText += n + ' '
            })
            let toText = ''
            body.to.forEach((n) => {
                toText += n + ' '
            })
            htmlText.log.innerHTML = 'From: ' + fromText + '　To: ' + toText
            if (!from && !to) {
                return
            }

            body.notes.forEach((note) => {
                play(body, note, from, to)
            })
        })
    })
}

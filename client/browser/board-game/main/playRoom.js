const myObject = require('./../card/object.js')

exports.start = (canvas, field, socket, clientTime, config, callback = () => {}) => {
    let socketDir = config.socketDir
    let socketType = config.socketType

    let list = {}
    socket.on(socketDir + 'user_list', (list) => {
        list.forEach((user) => {
            setUser(user)
        })
    })

    socket.on(socketDir + 'user_add', (user) => {
        setUser(user)
    })

    let setUser = (user) => {
        let icon = {
            width: 50,
            height: 50
        }
        if (user == config.user) {
            icon.width = canvas.width / 10
            icon.height = canvas.height / 10
        }
        // console.log(user, icon)
        let obj = myObject(icon)
        obj.icon = null
        obj.id = user

        // 初期ポジション
        if (user == config.user) {
            obj.x = canvas.width / 2
            obj.y = canvas.height / 2
        } else {
            let rand = Math.random() * Math.PI * 2
            obj.x = canvas.width / 2 + canvas.width / 6 * Math.sin(rand)
            obj.y = canvas.height / 2 + canvas.width / 6 * Math.cos(rand)
        }

        setting()
        obj.released((x, y) => {
            setting()
        })

        // Player or MainField
        obj.flexibleDraw = (ctx, obj) => {
            let font = ctx.font.split(' ')
            ctx.font = "15px '" + font[1] + "'"
            ctx.textAlign = 'center'
            ctx.beginPath()
            ctx.strokeStyle = 'rgba(0,0,0,0.8)'
            ctx.fillText(user, 0, -obj.h / 2 - 10)

            // player
            if (obj.w == obj.h) {
                ctx.fillStyle = 'rgba(11,90,150,0.5)'
                ctx.arc(0, 0, obj.w / 2, 0, Math.PI * 2)
                ctx.fill()
            }

            // Main Field
            else {
                ctx.fillStyle = 'rgba(234,80,68,0.5)'
                ctx.rect(-obj.w / 2, -obj.h / 2, obj.w, obj.h)
                ctx.fill()
                ctx.fillStyle = 'rgba(0,0,0,0.8)'
                ctx.fillText('Main Field', 0, 0)
            }
        }

        // setting
        field.setLocalObject(obj)

        function setting() {
            let gPos = field.clip.encodeToGloval(obj.x, obj.y)
            if (user != config.user) {
                list[user] = {
                    user: user,
                    x: obj.x,
                    y: obj.y,
                    gx: gPos.x,
                    gy: gPos.y
                }
            }
        }
    }

    // 開始ボタン
    field.flexibleDraw = (ctx, field) => {
        // ctx.fillStyle = 'rgba(234,247,247,' + (0.8 - 0.1 * r) + ')'
        let font = ctx.font.split(' ')
        ctx.font = "15px '" + font[1] + "'"
        ctx.textAlign = 'center'

        // Circle
        for (let r = 1; r <= 3; r++) {
            ctx.beginPath()
            ctx.strokeStyle = 'rgba(0,0,0,' + (0.5 - 0.1 * r) + ')'
            ctx.fillStyle = 'rgba(0,0,0,0.8)'
            ctx.arc(field.w / 2, field.h / 2, field.w / 6 * r, 0, Math.PI * 2)
            ctx.fillText(r + 'm', field.w / 2 - field.w / 6 * r + 20, field.h / 2)
            ctx.stroke()
        }

        // 中心十字
        ctx.save()
        ctx.translate(field.w / 2, field.h / 2)
        field.line(ctx, -field.w / 60, 0, field.w / 60, 0)
        field.line(ctx, 0, -field.w / 60, 0, field.w / 60)
        ctx.restore()

        // 開始ボタン
        ctx.beginPath()
        // ctx.rect(0, 0, field.w, field.h)
        if (Object.keys(list).length >= 3) {
            ctx.strokeStyle = 'rgba(11,90,150,1.0)'
            ctx.rect(field.w / 8 * 3, field.h - 80, field.w / 8 * 2, 50)
            ctx.fillText('GAME START', field.w / 2, field.h - 50)
        } else {
            ctx.strokeStyle = 'rgba(11,90,150,0.3)'
            ctx.rect(field.w / 8 * 3, field.h - 80, field.w / 8 * 2, 50)
            ctx.fillText('3 or more players', field.w / 2, field.h - 50)
        }
        ctx.stroke()
    }

    socket.on(socketDir + 'user_remove', (user) => {
        field.removeLocalObject(user)
        if (list[user]) {
            delete list[user]
        }
    })


    field.flexibleReleased = (x, y, field) => {
        if (field.w / 4 <= x && x <= field.w / 4 + field.w / 2 && field.h - 80 <= y && y <= field.h - 80 + 50) {
            console.log('startup')
            // デバックモード
            if (Object.keys(list).length >= 1) {
                field.flexibleDraw = () => {}
                field.removeLocalObject(config.user)
                for (let user in list) {
                    field.removeLocalObject(user)
                }
                callback(list)
            }
        }
    }


}

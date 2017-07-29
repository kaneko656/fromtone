const myObject = require('./../card/object.js')

exports.start = (canvas, field, socket, clientTime, config, callback = () => {}) => {
    let socketDir = config.socketDir
    let socketType = config.socketType

    let list = {}
    socket.on(socketDir + 'user_list', (list) => {})

    socket.on(socketDir + 'user_add', (user) => {
        let icon = {
            width: 50,
            height: 50
        }
        let obj = myObject(icon)
        obj.icon = null
        obj.id = user
        obj.x = canvas.width / 2
        obj.y = canvas.height / 2
        obj.flexibleDraw = (ctx, obj) => {
            let font = ctx.font.split(' ')
            ctx.font = "15px '" + font[1] + "'"
            ctx.textAlign = 'center'
            ctx.beginPath()
            ctx.strokeStyle = 'rgba(0,0,0,0.8)'
            ctx.fillText(user, 0, -30)
            ctx.arc(0, 0, 25, 0, Math.PI * 2)
            ctx.stroke()
        }
        field.setLocalObject(obj)
        let gPos = field.clip.encodeToGloval(obj.x, obj.y)
        list[user] = {
            user: user,
            x: obj.x,
            y: obj.y,
            gx: gPos.x,
            gy: gPos.y
        }
    })

    socket.on(socketDir + 'user_remove', (user) => {
        field.removeLocalObject(user)
    })

    field.flexibleDraw = (ctx, field) => {
        ctx.beginPath()
        ctx.rect(0, 0, field.w, field.h)
        ctx.rect(field.w / 4, field.h - 80, field.w / 2, 50)
        ctx.stroke()
    }

    field.flexibleReleased = (x, y, field) => {
        if(field.w / 4 <= x && x <= field.w / 4 + field.w / 2 && field.h - 80 <= y && y <= field.h - 80 + 50){
            console.log('startup')
        }
    }


}

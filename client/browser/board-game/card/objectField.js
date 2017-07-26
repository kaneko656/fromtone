const GlobalPosition = require('./position.js')

module.exports = (canvas) => {
    return new Field(canvas)
}

function Field(canvas) {
    this.canvas = canvas
    this.clientID = ''
    this.center = {
        x: canvas.width / 2,
        y: canvas.height / 2
    }
    this.w = canvas.width
    this.h = canvas.height

    this.globalPosition = GlobalPosition()
    this.clip = this.globalPosition.clip(0, 0, 1, 1)
    this.clip.setLocalPosition(0, 0, this.w, this.h)

    this.objects = {}

    this.callStart = () => {}
    this.callSendSpeakerInfo = () => {}
    this.callSendNoteInfo = () => {}
    this.callUpdatePannerPosition = () => {}

    this.callSendObjectInfo = () => {}
}

Field.prototype.setClip = function(cx, cy, halfW, halfH) {
    this.clip = this.globalPosition.clip(cx, cy, halfW, halfH)
}

Field.prototype.setClientID = function(clientID) {
    this.clientID = clientID
}


Field.prototype.setObject = function(obj) {
    let id = obj.id
    this.objects[id] = obj
    let encodePosition = this.clip.encodeToLocal(obj.x, obj.y)
    this.objects[id].x = encodePosition.x
    this.objects[id].y = encodePosition.y

    this.render()
    let field = this
    this.objects[id].icon.onload = function() {
        field.render()
    }
}

Field.prototype.updateObjects = function(objects) {
    objects.forEach((obj) => {
        let id = obj.id
        if (this.objects[id]) {
            let encodePosition = this.clip.encodeToLocal(obj.x, obj.y)
            obj.x = encodePosition.x
            obj.y = encodePosition.y
            this.objects[id].update(obj)
            console.log(id, obj.name, 'update')
        }
    })
    this.render()
}


Field.prototype.render = function() {
    // Draw points onto the canvas element.
    var ctx = this.canvas.getContext('2d')
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    ctx.save()

    for (let id in this.objects) {
        this.objects[id].draw(ctx)
    }
    ctx.restore()
}


Field.prototype.mousePressed = function(x, y) {
    for (let id in this.objects) {
        let obj = this.objects[id]
        if (!obj.isOtherMove && obj.isOver(x, y)) {
            obj.isSync = true
            obj.click()
            break
        }
    }
}


Field.prototype.mouseReleased = function(x, y) {
    for (let id in this.objects) {
        let obj = this.objects[id]
        if (!obj.isOtherMove && obj.isSync) {
            // obj.x = x
            // obj.y = y
            obj.isMove = false
            obj.over = false
            obj.isSync = false
            // this.sendObjectInfoToServer(obj, true)
        }
        // this.updatePannerPosition(obj, this.speaker)
    }
    // this.sendSpeakerInfoToServer(this.speaker)
    this.render()
}

Field.prototype.mouseMoved = function(x, y) {
    for (let id in this.objects) {
        if (this.objects[id].isSync) {
            let obj = this.objects[id]
            let out = this.objects[id].output()
            obj.over = true
            out.x = x
            out.y = y - 2
            this.sendObjectInfoToServer(out, true)
        }
    }
    this.render()
}


Field.prototype.sendObjectInfo = function(callback = () => {}) {
    this.callSendObjectInfo = callback
}

Field.prototype.sendObjectInfoToServer = function(sendObj, release) {
    let globalPos = this.clip.encodeToGloval(sendObj.x, sendObj.y)
    sendObj.x = globalPos.x
    sendObj.y = globalPos.y
    // console.log(sendObj)
    this.callSendObjectInfo(sendObj)
}


Field.prototype.line = (ctx, x1, y1, x2, y2) => {
    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.stroke()
}

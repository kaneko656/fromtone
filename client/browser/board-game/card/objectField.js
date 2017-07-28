const GlobalPosition = require('./position.js')
const SoundManager = require('./../sound/soundManager.js')
const Card = require('./../card/cardList.js')

let log = require('./../player/log.js')

module.exports = (canvas, context) => {
    return new Field(canvas, context)
}

function Field(canvas, context) {
    this.canvas = canvas
    this.context = context
    this.clientID = ''
    this.center = {
        x: canvas.width / 2,
        y: canvas.height / 2
    }
    this.w = canvas.width
    this.h = canvas.height
    this.areaDist = 3

    this.globalPosition = GlobalPosition()
    this.clip = this.globalPosition.clip(0, 0, 1, 1)
    this.clip.setLocalPosition(0, 0, this.w, this.h)

    this.sounds = {}
    this.objects = {}

    this.syncPlay = SoundManager.init(context)

    this.callStart = () => {}
    this.callSendSpeakerInfo = () => {}
    this.callSendNoteInfo = () => {}
    this.callUpdatePannerPosition = () => {}

    this.callSendObjectInfo = () => {}
}

Field.prototype.setClip = function(cx, cy, halfW, halfH) {
    this.clip = this.globalPosition.clip(cx, cy, halfW, halfH)
    this.clip.setLocalPosition(0, 0, this.w, this.h)
}

Field.prototype.rotate = function(radian) {
    this.clip.rotate = radian
}

Field.prototype.setLocalPosition = function(x, y, w, h) {
    this.clip.setLocalPosition(x, y, w, h)
}

Field.prototype.setClientID = function(clientID) {
    this.clientID = clientID
}


Field.prototype.setObject = function(obj) {
    let id = obj.id
    this.objects[id] = obj
    let encodePosition = this.clip.encodeToLocal(obj.gx, obj.gy)
    this.objects[id].x = encodePosition.x
    this.objects[id].y = encodePosition.y

    this.render()
    let field = this
    this.objects[id].icon.onload = function() {
        field.render()
    }
}

Field.prototype.updateObjects = function(objects) {
    if (!Array.isArray(objects)) {
        let temp = objects
        objects = []
        objects.push(temp)
    }
    objects.forEach((obj) => {
        let id = obj.id
        if (this.objects[id]) {
            let encodePosition = this.clip.encodeToLocal(obj.gx, obj.gy)
            obj.x = encodePosition.x
            obj.y = encodePosition.y
            this.objects[id].update(obj)
            // console.log(id, obj.name, 'update')
        } else {
            // sound
            if (obj.type == 'card') {
                let card = Card(obj.name)
                card.id = obj.id
                this.setObject(card)
                this.updateObjects(obj)
            }
        }
    })
    this.render()
}

Field.prototype.startSound = function(id, bufferName, startTime, option = {}) {
    // sound
    console.log('start')
    let now = Date.now()
    let field = this
    log.text((now - startTime) + '   ' + (startTime < now))
    if (startTime < now) {
        SoundManager.play(bufferName, now, (now - startTime), option, (sound) => {
            field.sounds[id] = sound
        })
    } else {
        SoundManager.play(bufferName, startTime, 0, option, (sound) => {
            field.sounds[id] = sound
        })
    }
}

Field.prototype.updateSounds = function(objects) {
    if (!Array.isArray(objects)) {
        let temp = objects
        objects = []
        objects.push(temp)
    }
    let field = this
    objects.forEach((obj) => {
        let id = obj.id
        console.log(obj.event)
        if (field.sounds[id]) {
            if (obj.event == 'sound_stop') {
                field.sounds[id].syncSound.stop()
                console.log('stop')
                delete field.sounds[id]
            } else {
                let p = this.clip.getPositionInfo(obj.gx, obj.gy)
                p.time = obj.time
                p.areaDist = this.areaDist
                field.sounds[id].setGain(p)
                field.sounds[id].setDoppler(p)
            }
        } else {
            if (obj.event == 'sound_start') {
                // sound
                this.startSound(obj.id, '和風メロディ', obj.startTime, {
                    loop: true
                })
            }
        }
    })
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
    this.context.createBufferSource().start(0)
    for (let id in this.objects) {
        let obj = this.objects[id]
        if (!obj.isOtherMove && obj.isOver(x, y)) {
            obj.isSync = true
            obj.isMove = true
            obj.event = 'sound_start'
            obj.click()
            let out = obj.output()
            this.sendObjectInfoToServer(out, true)
            break
        }
    }
}


Field.prototype.mouseReleased = function(x, y) {
    for (let id in this.objects) {
        let obj = this.objects[id]
        if (!obj.isOtherMove && obj.isMove) {
            // obj.x = x
            // obj.y = y
            obj.isMove = false
            obj.over = false
            obj.isSync = false
            obj.event = 'sound_stop'
            let out = obj.output()
            this.sendObjectInfoToServer(out, true)
            // this.sendObjectInfoToServer(obj, true)
        }
        // this.updatePannerPosition(obj, this.speaker)
    }
    // this.sendSpeakerInfoToServer(this.speaker)
    this.render()
}

Field.prototype.mouseMoved = function(x, y) {
    for (let id in this.objects) {
        if (this.objects[id].isMove) {
            let obj = this.objects[id]
            let out = this.objects[id].output()
            obj.over = true
            out.x = x
            out.y = y
            out.event = 'e'
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
    sendObj.gx = globalPos.x
    sendObj.gy = globalPos.y
    sendObj.clientID = this.clientID
    sendObj.timestamp = Date.now()
    // console.log(sendObj)
    this.callSendObjectInfo(sendObj)
}


Field.prototype.line = (ctx, x1, y1, x2, y2) => {
    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.stroke()
}

const GlobalPosition = require('./position.js')
const SoundManager = require('./sound/soundManager.js')
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
    this.localObjects = {}
    this.objectCase = {}

    this.syncPlay = SoundManager.init(context)

    this.callStart = () => {}
    this.callSendSpeakerInfo = () => {}
    this.callSendNoteInfo = () => {}
    this.callUpdatePannerPosition = () => {}

    this.callSendObjectInfo = () => {}
}

Field.prototype.setClientID = function(clientID) {
    this.clientID = clientID
}

/**
 * LocalPosition
 */

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

/**
 * Object
 */

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
    if (this.objects[id].types.indexOf('card') >= 0) {
        this.objects[id].scale = (this.canvas.width / 5) / this.objects[id].w
    }
}

Field.prototype.removeObject = function(id) {
    delete this.objects[id]
}

Field.prototype.isObject = function(id) {
    if (this.objects[id]) {
        return true
    }
    return false
}

Field.prototype.setLocalObject = function(obj) {
    let id = obj.id
    let field = this
    this.localObjects[id] = obj
    field.render()
}

Field.prototype.removeLocalObject = function(id) {
    delete this.localObjects[id]
}

/**
 * update
 * if null, setObject
 */

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
        } else {

            // card
            if (obj.types.indexOf('card') >= 0) {
                let card = Card(obj.name)
                card.id = obj.id
                this.setObject(card)
                this.updateObjects(obj)
            }
        }
    })
    this.render()
}


/**
 * Sound
 */

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
        if (field.sounds[id]) {
            if (obj.events.indexOf('sound_stop') >= 0) {
                field.sounds[id].stop()
                console.log('stop')
                delete field.sounds[id]
            } else {
                let p = this.clip.getPositionInfo(obj.gx, obj.gy)
                p.time = obj.time
                p.areaDist = this.areaDist
                field.sounds[id].setEffect(p)
            }
        } else {
            if (obj.events.indexOf('sound_start') >= 0) {
                // sound
                this.startSound(obj.id, 'カード', obj.startTime, {
                    loop: true
                })
            }
        }
    })
}

/**
 * ObjectCase
 */

Field.prototype.setObjectCase = function(objectCase) {
    this.objectCase[objectCase.id] = objectCase
}


Field.prototype.render = function() {
    // Draw points onto the canvas element.
    var ctx = this.canvas.getContext('2d')
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    ctx.beginPath()
    ctx.save()



    for (let id in this.objectCase) {
        this.objectCase[id].render(ctx)
    }
    for (let id in this.objects) {
        this.objects[id].draw(ctx)
    }
    for (let id in this.localObjects) {
        this.localObjects[id].draw(ctx)
    }

    this.flexibleDraw(ctx, this)

    ctx.restore()
}

//  override
Field.prototype.flexibleDraw = function() {}


Field.prototype.mousePressed = function(x, y) {

    /**
     * Object (Card)
     */
    // this.context.createBufferSource().start(0)
    let isObjMove = false
    for (let id in this.objects) {
        let obj = this.objects[id]
        if (!obj.isOtherMove && obj.isOver(x, y)) {
            isObjMove = true
            obj.isSync = true
            obj.isMove = true
            obj.click()
            let out = obj.output()
            out.events.push('sound_start')
            this.sendObjectInfoToServer(out, true)
            break
        }
    }
    if (!isObjMove) {
        for (let id in this.objectCase) {
            let objCase = this.objectCase[id]
            let n = objCase.isOver(x, y)
            if (n >= 0) {
                let obj = objCase.pop(n)
                let out = obj.output()
                out.events.push('pop_case')
                this.sendObjectInfoToServer(out, true)
                console.log(obj)
            }
        }

        for (let id in this.localObjects) {
            let obj = this.localObjects[id]
            if (obj.isOver(x, y)) {
                obj.isMove = true
                obj.click()
                break
            }
        }
    }
    this.flexiblePressed(x,y, this)
}


Field.prototype.mouseReleased = function(x, y) {

    /**
     * Object (Card)
     */

    let isObjMove = false
    for (let id in this.objects) {
        let obj = this.objects[id]
        if (!obj.isOtherMove && obj.isMove) {
            isObjMove = true
            obj.isMove = false
            obj.over = false
            obj.isSync = false
            let out = obj.output()
            out.events.push('sound_stop')
            this.sendObjectInfoToServer(out, true)

            for (let id in this.objectCase) {
                let objCase = this.objectCase[id]
                let n = objCase.isOver(x, y)
                if (n >= 0) {
                    objCase.push(obj)
                }
            }

        }
    }

    for (let id in this.localObjects) {
        let obj = this.localObjects[id]
        if (obj.isMove) {
            obj.isMove = false
            obj.release()
            break
        }
    }
    this.flexibleReleased(x,y, this)
    this.render()
}

Field.prototype.mouseMoved = function(x, y) {

    /**
     * Object (Card)
     */
    for (let id in this.objects) {
        if (this.objects[id].isMove) {
            let obj = this.objects[id]
            let out = this.objects[id].output()
            obj.over = true
            out.x = x
            out.y = y
            out.events.push('move')
            this.sendObjectInfoToServer(out, true)
        }
    }

    for (let id in this.localObjects) {
        let obj = this.localObjects[id]
        if (obj.isMove) {
            obj.x = x
            obj.y = y
            obj.move()
            break
        }
    }
    this.flexibleMoved(x,y, this)
    this.render()
}

//  override
Field.prototype.flexiblePressed = function() {}

Field.prototype.flexibleReleased = function() {}

Field.prototype.flexibleMoved = function() {}


Field.prototype.sendObjectInfo = function(callback = () => {}) {
    this.callSendObjectInfo = callback
}

Field.prototype.sendObjectInfoToServer = function(sendObj, release) {
    let globalPos = this.clip.encodeToGloval(sendObj.x, sendObj.y)
    sendObj.gx = globalPos.x
    sendObj.gy = globalPos.y
    sendObj.clientID = this.clientID
    sendObj.timestamp = Date.now()
    this.callSendObjectInfo(sendObj)
}


Field.prototype.line = (ctx, x1, y1, x2, y2) => {
    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.stroke()
}

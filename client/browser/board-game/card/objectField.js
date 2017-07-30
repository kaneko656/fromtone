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
        // this.objects[id].scale = (this.canvas.width / 5) / this.objects[id].w
        this.objects[id].scale = (this.canvas.width / 15) / this.objects[id].w
    }
}

Field.prototype.removeObject = function(id) {
    delete this.objects[id]
}

Field.prototype.getObject = function(id) {
    return this.objects[id]
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
                console.log('stop', id)
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
                console.log('start', id)

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

/**
 *
 */

Field.prototype.autoMove = function(obj, toX, toY, moveInfo = {}) {
    let duration = moveInfo.duration || 100
    let delay = moveInfo.delay || 0
    let diffTime = 30
    let x = obj.x
    let y = obj.y
    let now = Date.now()
    for (let t = 0; t < duration; t += diffTime) {
        let tx = x + (toX - x) / duration * t
        let ty = y + (toY - y) / duration * t
        let out = obj.output()
        out.x = tx
        out.y = ty
        out.timestamp = now + t + delay
        out.events.push('auto_move')
        if (t == 0) {
            out.events.push('sound_start')
        }
        this.sendObjectInfoToServer(out, {
            path: true
        })
        if (t + diffTime >= duration) {
            let tx = toX
            let ty = toY
            let out = obj.output()
            out.x = tx
            out.y = ty
            out.timestamp = now + duration
            out.events.push('auto_move')
            out.events.push('sound_stop')

            this.sendObjectInfoToServer(out, {
                path: true
            })
        }
    }
}



Field.prototype.render = function() {
    // Draw points onto the canvas element.
    var ctx = this.canvas.getContext('2d')
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    // background color
    // ctx.beginPath()
    // ctx.rect(0, 0, this.w, this.h)
    // ctx.fillStyle = 'rgba(245, 245, 245, 1.0)'
    // ctx.fill()

    ctx.beginPath()
    ctx.save()
    let range = {
        minX: 0,
        minY: 0,
        maxX: this.canvas.width,
        maxY: this.canvas.height
    }


    for (let id in this.objectCase) {
        this.objectCase[id].render(ctx)
    }

    let reverse = []
    for (let id in this.objects) {
        reverse.unshift(this.objects[id].draw)
    }
    reverse.forEach((draw) => {
        draw(ctx, range)
    })

    this.flexibleDraw(ctx, this)

    for (let id in this.localObjects) {
        this.localObjects[id].draw(ctx, range)
    }



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
            this.sendObjectInfoToServer(out)
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
                this.sendObjectInfoToServer(out)
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
    this.flexiblePressed(x, y, this)
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
            this.sendObjectInfoToServer(out)

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
    this.flexibleReleased(x, y, this)
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
            this.sendObjectInfoToServer(out)
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
    this.flexibleMoved(x, y, this)
    this.render()
}

//  override
Field.prototype.flexiblePressed = function() {}

Field.prototype.flexibleReleased = function() {}

Field.prototype.flexibleMoved = function() {}


Field.prototype.sendObjectInfo = function(callback = () => {}) {
    this.callSendObjectInfo = callback
}

Field.prototype.sendObjectInfoToServer = function(sendObj, option = {}) {
    let globalPos = this.clip.encodeToGloval(sendObj.x, sendObj.y)
    sendObj.gx = globalPos.x
    sendObj.gy = globalPos.y
    sendObj.clientID = this.clientID
    if (sendObj.events.indexOf('auto_move') == -1) {
        sendObj.timestamp = Date.now()
        // console.log('time')
    }
    this.callSendObjectInfo(sendObj, option)
}


Field.prototype.line = (ctx, x1, y1, x2, y2) => {
    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.stroke()
}

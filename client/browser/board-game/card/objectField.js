const GlobalPosition = require('./position.js')
const SoundManager = require('./sound/soundManager.js')
const Card = require('./../card/cardList.js')
const PositionDistObject = require('./positionDistObject.js')
let connect = require('./../../connect.js')

let log = require('./../player/log.js')
let Job = require('./../Job/cron.js')

module.exports = (canvas, context) => {
    return new Field(canvas, context)
}

function Field(canvas, context) {
    this.canvas = canvas
    this.context = context
    this.user = ''
    this.clientID = ''
    this.center = {
        x: canvas.width / 2,
        y: canvas.height / 2
    }
    this.w = canvas.width
    this.h = canvas.height
    this.areaDist = 3
    this.displayScale = window.devicePixelRatio
    this.fontSize = this.displayScale * 15

    this.globalPosition = GlobalPosition()
    this.clip = this.globalPosition.clip(0, 0, 1, 1)
    this.clip.setLocalPosition(0, 0, this.w, this.h)

    this.sounds = {}
    this.objects = {}
    this.localObjects = {}
    this.objectCase = {}
    this.positionDistObject = null
    this.positionDistTone = 'pizz'
    this.stopAnimation = false

    this.syncPlay = SoundManager.init(context)

    this.callStart = () => {}
    this.callSendSpeakerInfo = () => {}
    this.callSendNoteInfo = () => {}
    this.callUpdatePannerPosition = () => {}

    this.callSendObjectInfo = () => {}
    this.callSendObjectCaseInfo = () => {}
}

Field.prototype.setClientID = function(clientID) {
    this.clientID = clientID
}

/**
 * LocalPosition
 */

Field.prototype.setClip = function(cx, cy, halfW, halfH, radian = 0, isAnimation = false) {

    let field = this

    function getPosition(cx, cy, halfW, halfH, radian) {
        let posObjects = {}
        let posLocalObjects = {}
        for (let id in field.objects) {
            let obj = field.objects[id]
            let p = field.clip.encodeToGloval(obj.x, obj.y)
            p.startX = obj.x
            p.startY = obj.y
            posObjects[id] = p
        }
        for (let id in field.localObjects) {
            let obj = field.localObjects[id]
            let p = field.clip.encodeToGloval(obj.x, obj.y)
            p.startX = obj.x
            p.startY = obj.y
            posLocalObjects[id] = p
        }

        field.clip = field.globalPosition.clip(cx, cy, halfW, halfH)
        field.clip.rotate = radian
        field.clip.setLocalPosition(0, 0, field.w, field.h)
        return {
            posObjects: posObjects,
            posLocalObjects: posLocalObjects
        }
    }



    function animation(pos, t, duration, interval, isRender) {
        let rate = t / duration
        rate = rate > 1 ? 1 : rate
        let anime = (1 - (1 - rate) * (1 - rate))
        if (pos) {
            let posObjects = pos.posObjects
            let posLocalObjects = pos.posLocalObjects
            for (let id in field.objects) {
                let obj = field.objects[id]
                if (posObjects[id]) {
                    let p = posObjects[id]
                    let moveP = field.clip.encodeToLocal(p.x, p.y)
                    obj.x = p.startX + (moveP.x - p.startX) * anime
                    obj.y = p.startY + (moveP.y - p.startY) * anime
                }
            }
            for (let id in field.localObjects) {
                let obj = field.localObjects[id]
                if (posLocalObjects[id]) {
                    let p = posLocalObjects[id]
                    let moveP = field.clip.encodeToLocal(p.x, p.y)
                    obj.x = p.startX + (moveP.x - p.startX) * anime
                    obj.y = p.startY + (moveP.y - p.startY) * anime
                }
            }
        }
        if (rate < 1) {
            let date = new Date(Date.now() + interval)
            Job(date, () => {
                if (t == 0) {
                    field.stopAnimation = false
                    pos = getPosition(cx, cy, halfW, halfH, radian)
                }
                if (field.stopAnimation) {
                    animation(pos, duration, duration, interval, false)
                    return
                }
                animation(pos, t + interval, duration, interval, true)
            })
        }
        if (isRender) {
            field.render()
        }
    }
    if (isAnimation) {
        field.stopAnimation = true
        animation(null, 0, 1000, 30, true)
    } else {
        field.clip = field.globalPosition.clip(cx, cy, halfW, halfH)
        field.clip.rotate = radian
        field.clip.setLocalPosition(0, 0, field.w, field.h)
    }

    // this.render()

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
        this.objects[id].scale = (this.canvas.width / 6) / this.objects[id].w
    }
    // if (this.objects[id].types.indexOf('card') >= 0 && this.objects[id].types.indexOf('reverse') >= 0) {
    //     let reverseCard = Card('裏')
    //     this.objects[id].icon = reverseCard.icon
    // }
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
    let field = this
    objects.forEach((obj) => {
        let id = obj.id

        if (field.objects[id]) {
            let encodePosition = field.clip.encodeToLocal(obj.gx, obj.gy)
            obj.x = encodePosition.x
            obj.y = encodePosition.y
            field.objects[id].update(obj)
            if (field.objects[id].types.indexOf('card') >= 0) {
                field.objects[id].scale = (field.canvas.width / 6) / field.objects[id].w
            }

            if (obj.events.indexOf('in_case') >= 0) {
                // 自分のケースに入っている場合
                console.log('in_case')
                if (field.objectCase[field.user] && field.objectCase[field.user].inCard(obj.id)) {
                    field.objects[id].noDraw = true
                    field.objects[id].noMove = true
                } else {
                    field.objects[id].noDraw = true
                    field.objects[id].noMove = true
                }
            }
            if (obj.events.indexOf('out_case') >= 0) {
                console.log('out_case')
                field.objects[id].noDraw = false
                field.objects[id].noMove = false
            }
            if (field.user == 'Field' && obj.events.indexOf('field_tool') >= 0) {
                if (field.objectCase[field.user] && field.objectCase[field.user].isOver(obj.x, obj.y) >= 0) {
                    // in_case
                    let objCase = this.objectCase[field.user]
                    objCase.push(field.objects[id], obj.x, obj.y)
                    field.objects[id].noMove = true
                    let out = field.objects[id].output()
                    out.events.push('in_case')
                    this.sendObjectInfoToServer(out)
                }
            }
        }

        let types = obj.types
        let events = obj.events
        if (types.indexOf('card') >= 0 && events.indexOf('reverse') >= 0) {
            let reverseCard = Card('裏')
            field.objects[id].icon = reverseCard.icon
        } else if (types.indexOf('card') >= 0 && events.indexOf('open') >= 0) {
            let card = Card(obj.name)
            field.objects[id].icon = card.icon
        }

    })
    field.render()
}

/**
 * ObjectCase
 */

Field.prototype.setObjectCase = function(objectCase) {
    this.objectCase[objectCase.id] = objectCase
    console.log('setObjectCase', objectCase)

    // 他の人の
    if (objectCase.id != this.user) {
        objectCase.noDraw = true
        objectCase.noOperation = true
        objectCase.render = (ctx) => {
            let a = objectCase.area
            ctx.beginPath()
            ctx.rect(a.x, a.y, a.w, a.h)
            ctx.stroke()
            objectCase.objects.forEach((object) => {
                let obj = object.object
                let posX = object.posX
                let posY = object.posY
                let temp = obj.icon
                obj.x = posX
                obj.y = posY
                obj.icon = Card('裏').icon
                obj.scale = objectCase.area.h / obj.h * 0.9
                obj.draw(ctx)
            })
        }

    }
    this.sendObjectCaseInfoToServer(objectCase.id)
}

Field.prototype.getObjectCase = function(id) {
    if (this.objectCase[id]) {
        return this.objectCase[id]
    }
}

Field.prototype.inObjectCase = function(objectCase, obj) {
    this.objectCase[objectCase.id] = objectCase
    objectCase.push(obj)
    // this.removeObject(obj.id)
}



/**
 * Sound
 */

// option.loop
// option.velocityVolumeRate
Field.prototype.startSound = function(id, bufferName, startTime, option = {}) {
    // sound
    let now = Date.now()
    let field = this
    // log.text((now - startTime) + '   ' + (startTime < now))
    if (startTime < now) {
        console.log('delay', (now - startTime))
        SoundManager.play(bufferName, now, (now - startTime), option, (sound) => {
            field.sounds[id] = sound
        })
    } else {
        SoundManager.play(bufferName, startTime, 0, option, (sound) => {
            field.sounds[id] = sound
        })
    }
}

let n = 0
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
                console.log('stop...', obj.time, obj.time - Date.now())
                let date = new Date(obj.time)
                Job(date, () => {
                    console.log('sound_stop', id)
                    field.sounds[id].stop()
                    delete field.sounds[id]
                })
            } else {
                let p = this.clip.getPositionInfo(obj.gx, obj.gy)
                p.time = obj.time
                p.areaDist = this.areaDist
                field.sounds[id].setEffect(p)
            }
        } else {
            // object由来のサウンド
            if (obj.events.indexOf('sound_start') >= 0) {
                // sound
                console.log('sound_start', id)

                //**********//
                this.startSound(obj.id, 'wind', obj.startTime, {
                    loop: true,
                    velocityVolumeRate: 0.8
                })
                //**********//

                // 曲
                // this.startSound(obj.id, 'wind', obj.startTime, {
                //     loop: true,
                //     velocityVolumeRate: 0
                // })
            }
        }
        //**********//
        if (obj.events.indexOf('sound_position') >= 0) {
            let tone = ''
            obj.events.forEach((e) => {
                if (e.indexOf('sound_position_') == 0) {
                    tone = e.replace('sound_position_', '')
                }
            })
            if(tone.indexOf('_') == 0){
                return
            }
            console.log(tone)
            if (field.sounds[tone]) {
                field.sounds[tone].stop()
                delete field.sounds[tone]
            }
            // not use obj.startTime  use obj.time
            this.startSound(tone, tone, obj.time + 100, {
                loop: false,
                velocityVolumeRate: 0,
                limitEffectTimes: 2,
                noDoppler: true,
                start: false
            })
            console.log(tone)
            if (field.sounds[tone]) {
                console.log('start ' + tone)
                field.sounds[tone].positionEffect({
                    gx: obj.gx,
                    gy: obj.gy
                })
            }
        }
        //**********//
    })
}

Field.prototype.setPositionDistObject = function(pos) {
    this.positionDistObject = PositionDistObject(pos)
    this.positionDistObject.positionChanged((res) => {
        console.log(res)
    })
}

Field.prototype.setPositionDistFromTo = function(from, to) {
    this.positionDistObject.setFromTo(from, to)
}

Field.prototype.setPositionDistTone = function(tone) {
    this.positionDistTone = tone
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
        let rate = t / duration
        let anime = (1 - (1 - rate) * (1 - rate))
        let tx = x + (toX - x) * anime
        let ty = y + (toY - y) * anime
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
            out.timestamp = now + duration + delay
            out.events.push('auto_move')
            out.events.push('sound_stop')
            // out.events.push('open')
            // out.events.push('card_case')

            this.sendObjectInfoToServer(out, {
                path: true
            })
        }
    }
}



Field.prototype.render = function() {
    // Draw points onto the canvas element.
    let ctx = this.canvas.getContext('2d')
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    // font
    let font = ctx.font.split(' ')
    let fontSize = this.fontSize
    ctx.font = fontSize + "px '" + font[1] + "'"
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

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
        if (!this.objectCase[id].noDraw) {
            this.objectCase[id].render(ctx)
        }
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
    x = x * this.displayScale
    y = y * this.displayScale
    let field = this
    /**
     * Object (Card)
     */
    // this.context.createBufferSource().start(0)
    let isObjMove = false
    for (let id in this.objects) {
        let obj = this.objects[id]
        if (!obj.noMove && !obj.isOtherMove && obj.isOver(x, y)) {
            isObjMove = true
            obj.isSync = true
            obj.isMove = true
            obj.click()
            let out = obj.output()
            out.events.push('sound_start')

            //



            this.sendObjectInfoToServer(out)
            break
        }
    }
    if (!isObjMove) {

        // out_case
        // ポジションずれる？
        for (let id in this.objectCase) {
            let objCase = this.objectCase[id]
            if (objCase.noOperation) {
                continue
            }
            if (field.user == 'Field') {
                let n = objCase.isNear(x, y)
                if (n >= 0) {
                    let obj = objCase.pop(n)
                    let out = obj.output()
                    out.events.push('out_case')
                    out.events.push('open')
                    this.sendObjectInfoToServer(out)
                }
                continue
            }
            let n = objCase.isOver(x, y)
            if (n >= 0 && n != 0.9) {
                // Field
                let obj = objCase.pop(n)
                let y = 0
                if (id == field.user) {
                    y = objCase.area.y - 15
                } else {
                    y = objCase.area.y + objCase.area.h + 15
                }
                let out = obj.output()
                obj.events.push('out_case')
                let toolMode = connect.get('toolMode')
                if (toolMode == 'Field') {
                    obj.events.push('open')
                } else {
                    obj.events.push('reverse')
                }
                this.autoMove(obj, objCase.area.x + objCase.area.w / 2, y, {
                    duration: 500,
                    delay: 0
                })

                // this.sendObjectInfoToServer(out)
                this.sendObjectCaseInfoToServer(id)
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
    x = x * this.displayScale
    y = y * this.displayScale
    let field = this

    /**
     * Object (Card)
     */

    let isObjMove = false
    for (let id in this.objects) {
        let obj = this.objects[id]
        if (!obj.noMove && !obj.isOtherMove && obj.isMove) {
            isObjMove = true
            obj.isMove = false
            obj.over = false
            obj.isSync = false
            let out = obj.output()
            out.events.push('sound_stop')
            if (connect.get('toolMode') == 'Field') {
                out.events.push('field_tool')
            }

            // in_case
            if (field.user in this.objectCase) {
                let objCase = this.objectCase[field.user]
                if (objCase.noOperation) {
                    continue
                }
                let n = objCase.isOver(x, y)
                if (n >= 0) {
                    if (field.user == 'Field') {
                        objCase.push(obj, x, y)
                    } else {
                        objCase.push(obj, x)
                    }

                    obj.noMove = true
                    out.events.push('in_case')
                    field.sendObjectCaseInfoToServer(field.user)
                }
            }
            this.sendObjectInfoToServer(out)


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
    x = x * this.displayScale
    y = y * this.displayScale
    let field = this

    /**
     * Object (Card)
     */
    for (let id in this.objects) {
        let obj = this.objects[id]
        if (!obj.noMove && obj.isMove) {
            let out = obj.output()
            obj.over = true
            out.x = x
            out.y = y

            if (this.positionDistObject) {
                let p = this.clip.encodeToGloval(x, y)
                let res = this.positionDistObject.updatePosition(p.x, p.y)
                if (res) {
                    out.events.push('sound_start')
                    out.events.push('sound_position')
                    out.events.push('sound_position_' + field.positionDistTone + '_' + res.n)
                }
                // else if (res && res.near == 'to') {
                //     out.events.push('sound_start')
                //     out.events.push('sound_position')
                //     out.events.push('sound_position_guita_' + res.n)
                // }
            }
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

Field.prototype.sendObjectCaseInfo = function(callback = () => {}) {
    this.callSendObjectCaseInfo = callback
}

Field.prototype.sendObjectCaseInfoToServer = function(id, option = {}) {
    // caseはclipの中心
    if (this.user == 'Field') {
        return
    }
    if (this.objectCase[id]) {
        objCase = this.objectCase[id]
        let sendObj = objCase.share()
        sendObj.clientID = this.clientID
        this.callSendObjectCaseInfo(sendObj, option)
    }
}


Field.prototype.line = (ctx, x1, y1, x2, y2) => {
    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.stroke()
}

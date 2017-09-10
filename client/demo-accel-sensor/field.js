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
    this.size = this.w / 2

    this.otherSpeakers = []
    this.notes = {}

    this.callStart = () => {}
    this.callSendSpeakerInfo = () => {}
    this.callSendNoteInfo = () => {}
    this.callUpdatePannerPosition = () => {}
}

Field.prototype.setClientID = function(clientID) {
    this.clientID = clientID
}


Field.prototype.setNote = function(note) {
    let name = note.name
    note.x = note.x * this.w
    note.y = note.y * this.h
    note.size = Math.round(this.w / 13)
    this.notes[name] = note

    // this.note = note
    this.updatePannerPosition(this.notes[name], this.speaker)
    this.render()
    let field = this
    this.notes[name].icon.onload = function() {
        field.render()
    }
}

Field.prototype.updateNote = function(note) {
    let name = note.name
    if (this.notes[name]) {
        let nt = this.notes[name]
        nt.x = note.x * this.w
        nt.y = note.y * this.h
        nt.over = note.over
        nt.isMove = note.isMove
        nt.isOtherMove = note.isOtherMove
        this.updatePannerPosition(nt, this.speaker)
        console.log(name, 'update')
    }
    this.render()

}


Field.prototype.setThisSpeaker = function(speaker) {
    this.speaker = speaker
    this.speaker.x = this.center.x
    this.speaker.y = this.center.y
    this.speaker.size = Math.round(this.w / 13)
    let field = this
    this.speaker.icon.onload = function() {
        field.render()
        field.sendSpeakerInfoToServer(field.speaker)
    }
}

Field.prototype.setOtherSpeaker = function(SpeakerIcon, speakers) {
    let speakerArray = []
    if (typeof speakers == 'object') {
        for (let id in speakers) {
            if (id === this.clientID) {
                continue
            }
            let sp = speakers[id]
            let speaker = SpeakerIcon(this.speaker.icon)
            speaker.x = sp.x * this.w
            speaker.y = sp.y * this.h
            speaker.size = Math.round(this.w / 13)
            speaker.over = sp.over
            speaker.isMove = sp.isMove
            speaker.isThis = false
            speaker.isPlay = sp.isPlay
            speakerArray.push(speaker)
        }
    }
    this.otherSpeakers = speakerArray
    this.render()
}

Field.prototype.toPlayStatus = function(name = 'default') {
    if (this.notes[name]) {
        this.notes[name].isPlay = true
        // this.updatePannerPosition(this.notes[name], this.speaker)
    }
    if (this.speaker) {
        this.speaker.isPlay = true
        this.sendSpeakerInfoToServer(this.speaker)
    }
    this.render()
}

Field.prototype.toStopStatus = function(name = 'default') {
    if (this.notes[name]) {
        this.notes[name].isPlay = false
    }
    if (this.speaker) {
        this.speaker.isPlay = false
        this.sendSpeakerInfoToServer(this.speaker)
    }
    this.render()
}



Field.prototype.render = function() {
    // Draw points onto the canvas element.
    var ctx = this.canvas.getContext('2d');
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    ctx.save()
    // grid
    let size = this.size
    let cnt = 0
    ctx.strokeStyle = 'rgba(0,0,0,0.1)'
    for (let r = 0; r <= size; r += size / 4) {
        let alpha = 0.5 - cnt * 0.1
        ctx.strokeStyle = 'rgba(0,0,0,' + alpha + ')'
        cnt++
        ctx.beginPath()
        ctx.arc(this.center.x, this.center.y, r, 0, Math.PI * 2)
        ctx.stroke()
        ctx.strokeStyle = 'rgba(0,0,0,' + alpha + ')'

        this.line(ctx, 0, this.center.y - r, this.w, this.center.y - r)
        if (cnt > 1) {
            this.line(ctx, 0, this.center.y + r, this.w, this.center.y + r)
            this.line(ctx, this.center.x - r, 0, this.center.x - r, this.h)
        }
        this.line(ctx, this.center.x + r, 0, this.center.x + r, this.h)
    }

    this.speaker.draw(ctx)
    if (this.otherSpeakers) {
        this.otherSpeakers.forEach((sp) => {
            sp.draw(ctx)
        })
    }
    // this.note.draw(ctx)
    for (let name in this.notes) {
        this.notes[name].draw(ctx)
    }
    ctx.restore()
}

Field.prototype.started = function(callback) {
    this.callStart = callback
}


Field.prototype.mousePressed = function(x, y) {
    if (this.speaker.isOver(x, y)) {
        this.speaker.isMove = true
        this.speaker.over = true
        this.speaker.x = x
        this.speaker.y = y
    } else {
        for (let name in this.notes) {
            let note = this.notes[name]
            if (!note.isOtherMove && note.isOver(x, y)) {
                note.isSync = true
                note.click()
                break
            }
        }
    }
    // this.updatePannerPosition(this.note, this.speaker)
    this.render()
}


Field.prototype.mouseReleased = function(x, y) {
    if (this.speaker.isMove) {
        this.speaker.x = x
        this.speaker.y = y
        this.speaker.isMove = false
        this.speaker.over = false
    }
    for (let name in this.notes) {
        let note = this.notes[name]
        if (!note.isOtherMove && note.isMove) {
            note.x = x
            note.y = y
            note.isMove = false
            note.over = false
            note.isSync = false
            this.sendNoteInfoToServer(note, true)
        }
        this.updatePannerPosition(note, this.speaker)
    }
    this.sendSpeakerInfoToServer(this.speaker)
    this.render()
}

Field.prototype.mouseMoved = function(x, y) {
    if (this.speaker.isMove) {
        this.speaker.x = x
        this.speaker.y = y - 2
        this.sendSpeakerInfoToServer(this.speaker)
    }
    for (let name in this.notes) {
        let note = this.notes[name]
        if (!note.isOtherMove && note.isMove) {
            note.over = true
            note.x = x
            note.y = y - 2
            this.sendNoteInfoToServer(note, false)
          }
        this.updatePannerPosition(note, this.speaker)

    }
    this.render()
}

Field.prototype.pannerPosition = function(callback) {
    this.callUpdatePannerPosition = callback
}

Field.prototype.updatePannerPosition = function(note, speaker) {
    // 音源が原点
    let x = note.x - speaker.x
    let y = note.y - speaker.y
    let dx = x / this.size
    let dy = y / this.size
    let body = {
        name: note.name,
        position: {
            x: dx,
            y: dy,
            z: 0
        }
    }
    this.callUpdatePannerPosition(body)
}

Field.prototype.sendSpeakerInfo = function(callback) {
    this.sendSpeakerInfo = callback
}

Field.prototype.sendSpeakerInfoToServer = function(speaker) {
    let sp = Object.assign({}, speaker)
    sp.icon = null
    sp.draw = null
    sp.isOver = null
    sp.x = sp.x / this.w
    sp.y = sp.y / this.h
    this.sendSpeakerInfo(sp)
}

Field.prototype.sendNoteInfo = function(callback) {
    this.sendNoteInfo = callback
}

Field.prototype.sendNoteInfoToServer = function(note, release) {
    let nt = Object.assign({}, note)
    nt.icon = null
    nt.draw = null
    nt.isOver = null
    nt.setParentNote = null
    nt.idMove = false
    nt.isOtherMove = release ? false : true
    nt.x = nt.x / this.w
    nt.y = nt.y / this.h
    nt.id = this.clientID
    nt.release = release
    this.sendNoteInfo(nt)
}


Field.prototype.line = (ctx, x1, y1, x2, y2) => {
    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.stroke()
}

let connect = require('./../connect.js')
// let Tool = require('./tool.js')

module.exports = (canvas) => {
    return new Field(canvas)
}

function Field(canvas) {
    this.canvas = canvas
    this.clientID = ''
    this.w = canvas.width
    this.h = canvas.height

    this.c = {
        x: this.w / 2,
        y: this.h / 2
    }

    this.isSelect = false
    this.isListenerSelect = false
    this.maxD = 10
    this.d = 1
    this.r = 20
    this.listenerPosition = {
        offsetX: 50,
        offsetY: 0,
        target: 'to',
        r: 30
    }

    let field = this
    // canvas
    canvas.addEventListener('mousemove', function(e) {
        field.mouseMoved(e.offsetX, e.offsetY)
    })

    canvas.addEventListener('touchmove', function(e) {
        e.preventDefault()
        let rect = e.target.getBoundingClientRect()
        let x = e.changedTouches[0].clientX - rect.left
        let y = e.changedTouches[0].clientY - rect.top
        field.mouseMoved(x, y)
        return false
    })

    canvas.addEventListener('mousedown', function(e) {
        field.mousePressed(e.offsetX, e.offsetY)
    })

    canvas.addEventListener('touchstart', function(e) {
        e.preventDefault()
        let rect = e.target.getBoundingClientRect()
        let x = e.changedTouches[0].clientX - rect.left
        let y = e.changedTouches[0].clientY - rect.top
        field.mousePressed(x, y)
        return false
    })

    canvas.addEventListener('mouseup', function(e) {
        field.mouseReleased(e.offsetX, e.offsetY)
    })

    canvas.addEventListener('touchend', function(e) {
        e.preventDefault()
        let rect = e.target.getBoundingClientRect()
        let x = e.changedTouches[0].clientX - rect.left
        let y = e.changedTouches[0].clientY - rect.top
        field.mouseReleased(x, y)
        return false
    })

    this.setData()
}

Field.prototype.setData = function() {
    let tr = this.w / this.maxD
    connect.set('positionValue', {
        d: this.d,
        target: this.listenerPosition.target,
        offsetX: this.listenerPosition.offsetX / tr,
        offsetY: this.listenerPosition.offsetY / tr
    })
}

Field.prototype.render = function() {
    // Draw points onto the canvas element.
    let h = this.h
    let w = this.w
    let maxD = this.maxD
    let c = this.c
    let r = this.r
    let d = this.d
    let m = d * w / maxD
    let lisP = this.listenerPosition

    let ctx = this.canvas.getContext('2d')
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    ctx.save()

    // ctx.beginPath()
    // ctx.strokeStyle = 'rgba(0,0,255,1.0)'
    // ctx.rect(0, 0, this.w, this.h)
    // ctx.stroke()

    // center
    ctx.translate(c.x, c.y)
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"

    // center Line
    ctx.strokeStyle = 'rgba(150,150,150,1.0)'
    this.line(ctx, 0, -h / 4, 0, h / 4)
    ctx.save()
    ctx.translate(0, h / 2 * 0.8)
    ctx.scale(1.5, 1.5)
    ctx.fillText(d.toFixed(3) + ' m', 0, 0)
    ctx.restore()

    // From
    ctx.save()
    ctx.beginPath()
    ctx.strokeStyle = 'rgba(50,50,230,1.0)'
    ctx.arc(-m / 2, 0, r, 0, Math.PI * 2)
    ctx.translate(-m / 2, r * 1.8)
    ctx.scale(1.5, 1.5)
    ctx.fillText('From', 0, 0)
    ctx.stroke()
    ctx.restore()

    // To
    ctx.save()
    ctx.beginPath()
    ctx.strokeStyle = 'rgba(230,50,50,1.0)'
    ctx.arc(m / 2, 0, r, 0, Math.PI * 2)
    ctx.translate(m / 2, r * 1.8)
    ctx.scale(1.5, 1.5)
    ctx.fillText('To', 0, 0)
    ctx.stroke()
    ctx.restore()

    // listener
    ctx.save()
    if (lisP.target == 'from') {
        ctx.translate(-m / 2, 0)
    }
    if (lisP.target == 'to') {
        ctx.translate(m / 2, 0)
    }
    ctx.translate(lisP.offsetX, lisP.offsetY)
    ctx.beginPath()
    ctx.strokeStyle = 'rgba(230,50,50,1.0)'
    ctx.rect(-lisP.r / 2, -lisP.r / 2, lisP.r, lisP.r, Math.PI * 2)
    // ctx.translate(0, -lisP.r/2)
    ctx.scale(1.5, 1.5)
    ctx.fillText('P', 0, 0)
    ctx.stroke()
    ctx.restore()

    // dist Line
    ctx.strokeStyle = 'rgba(0,0,0,1.0)'
    if (d > 0.5) {
        this.line(ctx, -m / 2 + r * 1.5, 0, m / 2 - r * 1.5, 0)
        this.line(ctx, -m / 2 + r * 1.5, r / 2, -m / 2 + r * 1.5, -r / 2)
        this.line(ctx, m / 2 - r * 1.5, r / 2, m / 2 - r * 1.5, -r / 2)
    }

    ctx.restore()
}


Field.prototype.mousePressed = function(x, y) {
    let c = this.c
    let d = this.d
    let tr = this.w / this.maxD
    let dx = d / 2 * tr
    let r = this.r

    let difX = x - c.x
    let difY = y - c.y

    let lp = this.listenerPosition
    let lisX, lisY
    let lisR = lp.r
    if (lp.target == 'from') {
        lisX = -d / 2 * tr + lp.offsetX
        lisY = 0 + lp.offsetY
    }
    if (lp.target == 'to') {
        lisX = d / 2 * tr + lp.offsetX
        lisY = 0 + lp.offsetY
    }
    if (difX > lisX - lisR && difY > lisY - lisR &&
        difX < lisX + lisR && difY < lisY + lisR) {
        this.isListenerSelect = true
    }

    if (!this.isListenerSelect && (Math.abs(difX) - dx) * (Math.abs(difX) - dx) + (y - c.y) * (y - c.y) < r * r) {
        this.isSelect = true
    }
    this.render()
}


Field.prototype.mouseReleased = function(x, y) {
    this.isSelect = false
    this.isListenerSelect = false
    this.setData()
    this.render()

}

Field.prototype.mouseMoved = function(x, y) {
    if (this.isListenerSelect) {
        let tr = this.w / this.maxD
        let dx = this.d / 2 * tr
        let c = this.c
        let difX = x - c.x
        let difY = y - c.y
        let lp = this.listenerPosition
        if (difX <= 0) {
            lp.target = 'from'
            lp.offsetX = difX - (-dx)
            lp.offsetY = difY - 0
        }
        if (difX > 0) {
            lp.target = 'to'
            lp.offsetX = difX - dx
            lp.offsetY = difY - 0
        }
        console.log(lp)
        // let m = this.w / this.maxD
        // this.d = Math.abs(x - this.c.x) / this.w * this.maxD * 2
    }
    if (this.isSelect) {
        let m = this.w / this.maxD
        this.d = Math.abs(x - this.c.x) / this.w * this.maxD * 2
    }
    this.render()
}

Field.prototype.line = (ctx, x1, y1, x2, y2) => {
    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.stroke()
}

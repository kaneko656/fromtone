let connect = require('./../connect.js')
let Bezier = require('./bezier.js')

module.exports = (canvas) => {
    return new Field(canvas)
}


function Field(canvas) {
    this.canvas = canvas
    this.clientID = ''
    this.w = canvas.width
    this.h = canvas.height

    this.renderObject = {}
    this.tempRenderObject = []

    this.selectBezier = -1
    this.selectBezierPoint = -1

    this.callStart = () => {}
    this.callSendSpeakerInfo = () => {}
    this.callSendNoteInfo = () => {}
    this.callUpdatePannerPosition = () => {}

    let p = []
    let w = this.w
    let h = this.h

    this.bezier = []
    let b = Bezier([50, h / 2, w - 50, h / 2])
    this.bezier.push(b)

    // this.bezier = b.separate(0.3)

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
}



Field.prototype.render = function() {
    // Draw points onto the canvas element.
    let selectBezier = this.selectBezier
    let h = this.h
    let ctx = this.canvas.getContext('2d')
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    ctx.save()
    // grid
    for (let r = 0; r <= 10; r += 1) {
        ctx.strokeStyle = 'rgba(0,0,0,0.1)'
        let ww = (this.w-100)/10
        this.line(ctx, 50 + r*ww, 0, 50+r*ww, this.h)
    }
    this.bezier.forEach((b, i) => {
        let isSelect = (i == selectBezier)
        if (isSelect) {
            ctx.beginPath()
            ctx.fillStyle = 'rgba(255,150,150, 0.1)'
            ctx.rect(b.minX, 0, b.maxX - b.minX, h)
            ctx.fill()
        }
        b.render(ctx, isSelect)
    })

    let a = this.getValue(10)
    a.forEach((p) => {
        ctx.beginPath()
        ctx.strokeStyle = 'rgba(0,0,0,0.1)'
        ctx.arc(p.x, p.y, 3, 0, Math.PI * 2)
        ctx.stroke()
    })

    this.tempRenderObject.forEach((obj) => {
        ctx.beginPath()
        if (obj.fillStyle) {
            ctx.fillStyle = obj.fillStyle
        }
        if (obj.strokeStyle) {
            ctx.strokeStyle = obj.strokeStyle
        }
        if (obj.type == 'ellipse') {
            ctx.arc(obj.x, obj.y, obj.r, 0, Math.PI * 2)
        }
        if (obj.fillStyle) {
            ctx.fill()
        }
        if (obj.strokeStyle) {
            ctx.stroke()
        }
    })
    this.tempRenderObject = []
    // this.bezier.render(ctx)
    ctx.restore()
}



Field.prototype.mousePressed = function(x, y) {
    let tempSelectBezier = this.selectBezier
    let tempSelectBezierPoint = this.selectBezierPoint
    this.selectBezier = -1
    this.selectBezierPoint = -1
    let my = this

    let mode = connect.get('toolMode')

    if (mode == 'pointMove') {
        let select = false
        this.bezier.forEach((b, i) => {
            let inW = b.inW(x)
            if (inW || i == tempSelectBezier) {
                let onP = b.onPoint(x, y, 7)
                if (onP && !select) {
                    my.selectBezier = i
                    my.selectBezierPoint = onP.pointID
                    onP.r = 7
                    onP.type = 'ellipse'
                    onP.fillStyle = 'rgba(50,50,255,0.5)'
                    my.tempRenderObject.push(onP)
                    select = true
                } else if (inW && !select) {
                    my.selectBezier = i
                }
            }
        })
    }

    if (mode == 'separate') {
        this.bezier.forEach((b, i) => {
            let inW = b.inW(x)
            if (inW) {
                my.selectBezier = i
                let p = b.nearPoint(x, y)
                if (p.d <= 10) {
                    my.separate(i, p.t)
                }
            }
        })
    }
    this.render()
}


Field.prototype.mouseReleased = function(x, y) {
    console.log(this.getValue(10))
    this.selectBezierPoint = -1
    this.render()

}

Field.prototype.mouseMoved = function(x, y) {
    let my = this
    let selectBezier = this.selectBezier
    let selectBezierPoint = this.selectBezierPoint
    let mode = connect.get('toolMode')

    if (mode == 'pointMove' && selectBezier >= 0) {
        let b = this.bezier[selectBezier]
        b.move(selectBezierPoint, x, y)
        let onP = b.onPoint(x, y, 10)
        if (onP) {
            onP.r = 7
            onP.type = 'ellipse'
            onP.fillStyle = 'rgba(50,50,255,0.5)'
            my.tempRenderObject.push(onP)
        }
        if (selectBezierPoint >= 0) {
            let b = this.bezier[selectBezier]
            b.move(selectBezierPoint, x, y)
        }
        this.render()
    }


    if (mode == 'separate') {
        this.bezier.forEach((b, i) => {
            let inW = b.inW(x)
            if (inW) {
                let p = b.nearPoint(x, y)
                if (p.d <= 10) {
                    p.r = 5
                    p.type = 'ellipse'
                    p.fillStyle = 'rgba(250,150,155,1.0)'
                    my.tempRenderObject.push(p)
                }
            }
        })
        this.render()
    }
}


Field.prototype.separate = function(i, t) {
    let sepB = this.bezier[i].separate(t)
    this.bezier.splice(i, 1, sepB[0], sepB[1])

    let my = this
    let link = (idx) => {
        if (idx < 0 || idx >= my.bezier.length - 1) {
            return
        }
        my.bezier[idx].callMovedTail = (e) => {
            let notCall = true
            my.bezier[idx + 1].move(0, e.x, e.y, notCall)
        }
        my.bezier[idx + 1].callMovedHead = (e) => {
            let notCall = true
            my.bezier[idx].move(3, e.x, e.y, notCall)
        }
    }
    link(i - 1)
    link(i)
    link(i + 1)
}

Field.prototype.getValue = function(divNum) {
    let minX = this.bezier[0].minX
    let maxX = this.bezier[this.bezier.length - 1].maxX
    let t = (maxX - minX) / divNum
    let divX = minX
    let value = []
    this.bezier.forEach((b, i) => {
        let mx = b.maxX
        for (divX; divX <= mx; divX += t) {
            value.push(b.getValue(divX))
        }
    })
    return value
}

Field.prototype.line = (ctx, x1, y1, x2, y2) => {
    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.stroke()
}

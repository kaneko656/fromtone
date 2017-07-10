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
    this.minX = 50
    this.maxX = this.w - 50
    this.minY = 50
    this.maxY = this.h - 50

    this.renderObject = {}
    this.tempRenderObject = []

    this.viewValue = []

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
    let b = Bezier([this.minX, this.maxY, this.maxX, this.minY])
    b.limit['minX'] = this.minX
    b.limit['maxX'] = this.maxX
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

    connect.set('editerValue', this.getValue(100))

    connect.on('viewStart', (res) => {
        // duration 3000/20 = 150
        let divNum = res.duration / 20
        field.viewStart(divNum, res.duration / divNum, res.leftTime)
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
        let ww = (this.w - 100) / 10
        this.line(ctx, 50 + r * ww, 0, 50 + r * ww, this.h)
    }
    // min max Line
    ctx.strokeStyle = 'rgba(0,0,0,0.3)'
    this.line(ctx, this.minX, this.minY, this.maxX, this.minY)
    this.line(ctx, this.minX, this.maxY, this.maxX, this.maxY)
    this.line(ctx, this.minX, 0, this.minX, this.h)
    this.line(ctx, this.maxX, 0, this.maxX, this.h)

    //
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillStyle = 'rgba(0,0,0,1.0)'
    ctx.save()
    ctx.translate(20, this.maxY)
    ctx.scale(1.5, 1.5)
    ctx.fillText('From', 0, 0)
    ctx.restore()
    ctx.save()
    ctx.translate(20, this.minY)
    ctx.scale(1.5, 1.5)
    ctx.fillText('To', 0, 0)
    ctx.restore()
    ctx.save()
    ctx.textAlign = "left"
    ctx.translate(this.minX + 4, this.maxY + 20)
    ctx.scale(1.5, 1.5)
    ctx.fillText('Start', 0, 0)
    ctx.restore()
    ctx.save()
    ctx.textAlign = "right"
    ctx.translate(this.maxX - 4, this.maxY + 20)
    ctx.scale(1.5, 1.5)
    ctx.fillText('End', 0, 0)
    ctx.restore()

    // bezier curve
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

    // interval point on bezier
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
                let onP = b.onPoint(x, y, 20)
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
                let p = b.nearPoint(x, y)
                if (p.d <= 20) {
                    my.separate(i, p.t)
                }
            }
        })
    }
    this.render()
}


Field.prototype.mouseReleased = function(x, y) {
    this.selectBezierPoint = -1
    connect.set('editerValue', this.getValue(100))
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
        let onP = b.onPoint(x, y, 20)
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
                if (p.d <= 20) {
                    p.r = 7
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
    if (!sepB) {
        return
    }
    this.bezier.splice(i, 1, sepB[0], sepB[1])
    for (let n = 0; n < 2; n++) {
        sepB[n].limit['minX'] = this.minX
        sepB[n].limit['maxX'] = this.maxX
    }

    let my = this
    let link = (idx) => {
        if (idx < 0 || idx >= my.bezier.length - 1) {
            return
        }
        my.bezier[idx].callMovedTail = (e, callback) => {
            let notCall = true
            my.bezier[idx + 1].move(0, e.x, e.y, notCall, callback)
        }
        my.bezier[idx + 1].callMovedHead = (e, callback) => {
            let notCall = true
            my.bezier[idx].move(3, e.x, e.y, notCall, callback)
        }
    }
    link(i - 1)
    link(i)
    link(i + 1)
}

Field.prototype.getValue = function(divNum) {
    let minX = this.bezier[0].minX
    let maxX = this.bezier[this.bezier.length - 1].maxX
    let h = this.maxY - this.minY
    let w = this.maxX - this.minX
    let t = w / divNum
    let divX = minX
    let value = []
    let my = this
    this.bezier.forEach((b, i) => {
        let mx = b.maxX
        for (divX; divX <= mx; divX += t) {
            if (divX < b.minX) {
                continue
            }
            let v = b.getValue(divX)
            let velocity = b.getVelocity(v.t)
            velocity = velocity * (w / h)
            // x,y,t
            v.value = (v.y - my.minY) / (my.maxY - my.minY)
            v.div = (divX - this.minX) / w
            v.velocity = velocity
            value.push(v)
        }
    })
    return value
}

Field.prototype.viewStart = function(divNum, per, leftTime) {
    this.viewValue = this.getValue(divNum)
    let viewCon = (num) => {
        setTimeout(() => {
            if (num < divNum) {
                this.view(num)
                viewCon(num + 1)
            }
        }, per)
    }
    setTimeout(() => {
        viewCon(0)
    }, leftTime)
}

Field.prototype.view = function(num) {
    if (this.viewValue[num]) {
        let obj = this.viewValue[num]
        obj.r = 7
        obj.type = 'ellipse'
        obj.fillStyle = 'rgba(50,50,255,0.5)'
        this.tempRenderObject.push(obj)
        this.render()
    }
}


Field.prototype.line = (ctx, x1, y1, x2, y2) => {
    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.stroke()
}

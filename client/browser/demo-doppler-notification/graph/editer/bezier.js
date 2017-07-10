module.exports = (p) => {
    return new Bezier(p)
}

function Bezier(p) {
    this.callMovedHead = () => {}
    this.callMovedTail = () => {}

    // x,y anchorx,y anchorx,y x,y
    // length 8
    this.p = p
    this.innerPoint = []
    this.innerAccuracy = 0.1
    this.innerAccuracyTimes = 5
    if (Array.isArray(p) && p.length == 4) {
        let a1 = this.divPoint(p, 0.2)
        let a2 = this.divPoint(p, 0.8)
        p.splice(2, 0, a1.x, a1.y, a2.x, a2.y)
    }
    if (!Array.isArray(p) || p.length != 8) {
        console.log('Bezier 引数は配列（x,yが４つ）')
        return
    }
    this.setInnerPoint()
    this.minX = p[0] < p[6] ? p[0] : p[6]
    this.maxX = p[0] > p[6] ? p[0] : p[6]

    this.edgePointR = 5

    this.bezierLineColor = 'rgba(0,0,0,1.0)'
    this.bezierEdgeColor = 'rgba(100,100,100,1.0)'
    this.anchorLineColor = 'rgba(0,0,255,1.0)'
    this.anchorEdgeColor = 'rgba(150,150,255,1.0)'
}


Bezier.prototype.render = function(ctx, isSelect) {
    let p = this.p
    ctx.beginPath()
    ctx.strokeStyle = this.bezierLineColor
    ctx.moveTo(p[0], p[1])
    ctx.bezierCurveTo(p[2], p[3], p[4], p[5], p[6], p[7])
    ctx.stroke()

    // 補助線
    if (isSelect) {
        ctx.strokeStyle = this.anchorLineColor
        this.line(ctx, p[0], p[1], p[2], p[3])
        this.line(ctx, p[4], p[5], p[6], p[7])
    }

    // 両端
    let r = this.edgePointR
    ctx.beginPath()
    ctx.fillStyle = this.bezierEdgeColor
    ctx.arc(p[0], p[1], r, 0, Math.PI * 2)
    ctx.arc(p[6], p[7], r, 0, Math.PI * 2)
    ctx.fill()

    // アンカー端
    if (isSelect) {
        ctx.beginPath()
        ctx.fillStyle = this.anchorEdgeColor
        ctx.arc(p[2], p[3], r, 0, Math.PI * 2)
        ctx.arc(p[4], p[5], r, 0, Math.PI * 2)
        ctx.fill()
    }
}

Bezier.prototype.line = (ctx, x1, y1, x2, y2) => {
    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.stroke()
}

Bezier.prototype.getBezierPoint = function(t) {
    let mt = 1 - t
    let p = this.p
    let mt3 = mt * mt * mt
    let mt2 = mt * mt
    let t3 = t * t * t
    let t2 = t * t
    let x = mt3 * p[0] + 3 * mt2 * t * p[2] + 3 * mt * t2 * p[4] + t3 * p[6]
    let y = mt3 * p[1] + 3 * mt2 * t * p[3] + 3 * mt * t2 * p[5] + t3 * p[7]
    return {
        x: x,
        y: y,
        t: t
    }
}

Bezier.prototype.separate = function(t) {
    let p = this.p
    // http://d.hatena.ne.jp/shspage/20140625/1403702735
    let sep = this.getBezierPoint(t)

    let d1 = this.divPoint([p[0], p[1], p[2], p[3]], t)
    let d2 = this.divPoint([p[4], p[5], p[6], p[7]], t)
    let d3 = this.divPoint([p[2], p[3], p[4], p[5]], t)

    let r1 = this.divPoint([d1.x, d1.y, d3.x, d3.y], t)
    let r2 = this.divPoint([d3.x, d3.y, d2.x, d2.y], t)

    let sepBezier = []
    sepBezier[0] = new Bezier([p[0], p[1], d1.x, d1.y, r1.x, r1.y, sep.x, sep.y])
    sepBezier[1] = new Bezier([sep.x, sep.y, r2.x, r2.y, d2.x, d2.y, p[6], p[7]])
    return sepBezier
}

Bezier.prototype.divPoint = function(p4, t) {
    let mt = 1 - t
    let x = mt * p4[0] + t * p4[2]
    let y = mt * p4[1] + t * p4[3]
    return {
        x: x,
        y: y,
        t: t
    }
}

Bezier.prototype.move = function(pN, x, y, notCall) {
    if (pN >= 0 && pN <= 3) {
        let p = this.p
        let dx = x - p[pN * 2]
        let dy = y - p[pN * 2 + 1]
        p[pN * 2] = x
        p[pN * 2 + 1] = y
        let obj = {
            x: x,
            y: y
        }
        if (pN == 0) {
            p[2] += dx
            p[3] += dy
            this.setInnerPoint()
            if (!notCall) {
                this.callMovedHead(obj)
            }
        } else if (pN == 3) {
            p[4] += dx
            p[5] += dy
            this.setInnerPoint()
            if (!notCall) {
                this.callMovedTail(obj)
            }
        } else {
            this.setInnerPoint()
        }
    }
}

Bezier.prototype.onPoint = function(x, y, optionR) {
    let p = this.p
    let r = optionR || this.edgePointR
    r = r * r
    for (let i = 0; i < 4; i++) {
        let px = p[i * 2]
        let py = p[i * 2 + 1]
        let d = (px - x) * (px - x) + (py - y) * (py - y)
        if (d < r) {
            return {
                pointID: i,
                x: px,
                y: py
            }
        }
    }
    return null
}

Bezier.prototype.nearPoint = function(x, y) {
    let p = this.p
    let t = performance.now()
    let minD = -1
    let nearP = null
    this.innerPoint.forEach((point) => {
        let d = (point.x - x) * (point.x - x) + (point.y - y) * (point.y - y)
        if (minD == -1 || d < minD) {
            minD = d
            nearP = point
            nearP.d = Math.sqrt(d)
        }
    })
    for (let i = 1; i < this.innerAccuracyTimes; i++) {
        let a = Math.pow(this.innerAccuracy, i)
        let ip = []
        let min = nearP.t - a / 2 > 0 ? nearP.t - a / 2 : 0
        let max = nearP.t + a / 2 < 1 ? nearP.t + a / 2 : 1
        min -= a/10
        max += a/10
        for (let t = min; t <= max; t += a * this.innerAccuracy) {
            let p = this.getBezierPoint(t)
            ip.push(p)
        }
        ip.forEach((point) => {
            let d = (point.x - x) * (point.x - x) + (point.y - y) * (point.y - y)
            if (minD == -1 || d < minD) {
                minD = d
                nearP = point
                nearP.d = Math.sqrt(d)
            }
        })
    }
    return nearP
}

Bezier.prototype.getValue = function(x) {
    let p = this.p
    let minD = -1
    let nearP = null
    this.innerPoint.forEach((point) => {
        let d = Math.abs(point.x - x)
        if (minD == -1 || d < minD) {
            minD = d
            nearP = point
            nearP.d = d
        }
    })
    for (let i = 1; i < this.innerAccuracyTimes; i++) {
        let a = Math.pow(this.innerAccuracy, i)
        let ip = []
        let min = nearP.t - a / 2 > 0 ? nearP.t - a / 2 : 0
        let max = nearP.t + a / 2 < 1 ? nearP.t + a / 2 : 1
        min -= a/10
        max += a/10
        for (let t = min; t <= max; t += a * this.innerAccuracy) {
            let p = this.getBezierPoint(t)
            ip.push(p)
        }
        ip.forEach((point) => {
            let d = Math.abs(point.x - x)
            if (minD == -1 || d < minD) {
                minD = d
                nearP = point
                nearP.d = d
            }
        })
    }
    return nearP
}

Bezier.prototype.setInnerPoint = function() {
    let p = this.p
    this.minX = p[0] < p[6] ? p[0] : p[6]
    this.maxX = p[0] > p[6] ? p[0] : p[6]
    this.innerPoint = []
    for (let t = 0; t <= 1; t += this.innerAccuracy) {
        let p = this.getBezierPoint(t)
        this.innerPoint.push(p)
    }
}

Bezier.prototype.inW = function(x) {
    if (x > this.minX && x < this.maxX) {
        let t = (x - this.minX) / (this.maxX - this.minX)
        return {
            t: (x - this.minX) / (this.maxX - this.minX),

        }
    } else {
        return null
    }
}



Bezier.prototype.tCoe = function() {
    let p = this.p
    let xt3 = 3 * p[2] + p[6] - 3 * p[4] - p[0]
    let xt2 = 3 * (p[0] - 2 * p[2] + p[4])
    let xt1 = 3 * (p[2] - p[0])
    let xt = p[0]

    let yt3 = 3 * p[3] + p[7] - 3 * p[5] - p[1]
    let yt2 = 3 * (p[1] - 2 * p[3] + p[5])
    let yt1 = 3 * (p[3] - p[1])
    let yt = p[1]

    return {
        x: {
            3: xt3,
            2: xt2,
            1: xt1,
            0: xt
        },
        y: {
            3: yt3,
            2: yt2,
            1: yt1,
            0: yt
        }
    }
}

module.exports = () => {
    return new GlobalPosition()
}

function GlobalPosition() {
    this.size = 1.0
    //
    // center 0, 0
    // 周囲にsize分広がる空間
    // size = 1.0 なら　(-1.0, -1.0) ~ (1.0, 1.0)の空間
}

GlobalPosition.prototype.clip = function(cx, cy, halfW, halfH) {
    let g = this
    let clip = {
        cx: cx,
        cy: cy,
        halfW: halfW,
        halfH: halfH,
        localPosition: {
            cx: 0,
            cy: 0,
            halfW: 1,
            halfH: 1
        },
        rotate: 0.0,
        setLocalPosition: (x, y, w, h) => {
            let p = clip.localPosition
            p.cx = x + w / 2
            p.cy = y + h / 2
            p.halfW = w / 2
            p.halfH = h / 2
        },
        encodeToLocal: (gx, gy) => {
            // console.log(gx, gy)
            let x = gx / g.size
            let y = gy / g.size
            let tx = x - clip.cx
            let ty = y - clip.cy
            let ex = 0
            let ey = 0
            if (clip.rotate != 0) {
                let rotate = -clip.rotate
                let x = (Math.cos(rotate) * tx - Math.sin(rotate) * ty) / clip.halfW
                let y = (Math.sin(rotate) * tx + Math.cos(rotate) * ty) / clip.halfH
                ex = x
                ey = y
            } else {
                ex = (tx / clip.halfW)
                ey = (ty / clip.halfH)
            }
            // ex, ey -1 ~ 1
            let lp = clip.localPosition
            let encode = {
                x: lp.cx + ex * lp.halfW,
                y: lp.cy + ey * lp.halfH,
            }
            return encode
        },
        encodeToGloval: (x, y) => {
            let lp = clip.localPosition
            let ex = (x - lp.cx) / lp.halfW
            let ey = (y - lp.cy) / lp.halfH
            let gx = 0
            let gy = 0
            if (clip.rotate != 0) {
                let rotate = clip.rotate
                let x = (Math.cos(rotate) * ex - Math.sin(rotate) * ey) * clip.halfW
                let y = (Math.sin(rotate) * ex + Math.cos(rotate) * ey) * clip.halfH
                gx = x + clip.cx
                gy = y + clip.cy
            } else {
                gx = ex * clip.halfW + clip.cx
                gy = ey * clip.halfH + clip.cy
            }
            gx *= g.size
            gy *= g.size
            return {
                x: gx,
                y: gy
            }
        },
        // localArea
        render: function(ctx) {
            ctx.save()
            let lp = clip.localPosition
            ctx.translate(lp.cx, lp.cy)
            ctx.rotate(clip.rotate)
            ctx.rect(-lp.halfW, -lp.halfH, lp.halfW * 2, lp.halfH * 2)
            let p = clip.encodeToLocal(gx, gy)
            ctx.fillText(p.x + '    ' + p.y, 0, 0)
            ctx.stroke()
            ctx.restore()
        }
    }
    return clip
}

let connect = require('./../connect.js')
let Tool = require('./tool.js')

module.exports = (canvas) => {
    return new Field(canvas)
}

function Field(canvas) {
    this.canvas = canvas
    this.clientID = ''
    this.w = canvas.width
    this.h = canvas.height

    this.tool = []
    this.selectToolNum = 0
    this.selectToolMode = 'pointMove'
    connect.set('toolMode', 'pointMove')

    let tw = this.h
    let th = this.h
    let moveTool = Tool(30, 0, tw, th)
    let plusTool = Tool(30 + tw * 1.1, 0, tw, th)

    moveTool.setID('pointMove')
    plusTool.setID('separate')

    let my = this
    moveTool.callRender = (ctx, tool) => {
        let toolMode = my.selectToolMode

        ctx.save()
        ctx.beginPath()
        ctx.strokeStyle = 'rgba(0,0,100,0.5)'
        ctx.fillStyle = 'rgba(0,0,100,0.15)'
        ctx.rect(tool.x, tool.y, tool.w, tool.h)
        ctx.stroke()
        if (tool.id == toolMode) {
            ctx.fill()
        }

        let cx = tool.x + tool.w / 2
        let cy = tool.y + tool.h / 2
        let r = tool.w / 5
        //
        // ctx.beginPath()
        // ctx.strokeStyle = 'rgba(150,150,150,1)'
        // ctx.arc(cx - r * 1.5, cy, r / 2, 0, Math.PI * 2)
        // ctx.stroke()

        ctx.beginPath()
        ctx.fillStyle = 'rgba(50,50,50,1)'
        ctx.arc(cx, cy, r / 2, 0, Math.PI * 2)
        ctx.fill()

        ctx.translate(cx, cy)
        for (let rot = 0; rot < 4; rot++) {
            ctx.rotate(Math.PI / 2)
            ctx.strokeStyle = 'rgba(50,50,50,1)'
            tool.line(ctx, r, 0, r * 2, 0)
            tool.line(ctx, r * 2, 0, r * 2 - r / 3, - r / 3)
            tool.line(ctx, r * 2, 0, r * 2 - r / 3, r / 3)
        }
        ctx.restore()
    }

    plusTool.callRender = (ctx, tool) => {
        let toolMode = my.selectToolMode

        ctx.save()
        ctx.beginPath()
        ctx.strokeStyle = 'rgba(0,0,100,0.5)'
        ctx.fillStyle = 'rgba(0,0,100,0.15)'
        ctx.rect(tool.x, tool.y, tool.w, tool.h)
        ctx.stroke()
        if (tool.id == toolMode) {
            ctx.fill()
        }

        let cx = tool.x + tool.w / 2
        let cy = tool.y + tool.h / 2
        ctx.translate(cx, cy)
        ctx.scale(2, 2)
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillStyle = 'rgba(0,0,0,1.0)'
        ctx.fillText('＋', 0, 0, tool.w / 2)
        ctx.restore()
    }
    this.tool.push(moveTool)
    this.tool.push(plusTool)

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
    let h = this.h
    let ctx = this.canvas.getContext('2d')
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    ctx.save()

    this.tool.forEach((t) => {
        t.render(ctx)
    })
    ctx.restore()
}


Field.prototype.mousePressed = function(x, y) {
    let my = this
    this.tool.forEach((t, i) => {
        let onID = t.onOver(x, y)
        if (onID) {
            console.log(onID)
            my.selectToolNum = i
            my.selectToolMode = onID.id
            connect.set('toolMode', onID.id)
        }
    })
    this.render()
}


Field.prototype.mouseReleased = function(x, y) {
    this.render()

}

Field.prototype.mouseMoved = function(x, y) {
    this.render()
}

Field.prototype.line = (ctx, x1, y1, x2, y2) => {
    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.stroke()
}

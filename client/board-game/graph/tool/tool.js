

module.exports = (x, y, w, h) => {
    return new Tool(x, y, w, h)
}

function Tool(x, y, w, h) {
    this.x = x
    this.y = y
    this.w = w
    this.h = h
    this.id = ''
    this.callRender = () => {}
}

Tool.prototype.render = function(ctx) {
    this.callRender(ctx, this)
}

Tool.prototype.setID = function(id) {
    this.id = id
}

Tool.prototype.onOver = function(x, y) {
    if (x >= this.x && x <= this.x + this.w &&
        y >= this.y && y <= this.y + this.h) {
        return {
            id: this.id
        }
    }
    return null
}

Tool.prototype.line = (ctx, x1, y1, x2, y2) => {
    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.stroke()
}



module.exports = (noteIcon) => {
    let callClick = () => {}
    let note = {
        name: 'default',
        icon: noteIcon,
        size: noteIcon.width,
        w: noteIcon.width,
        h: noteIcon.height,
        x: 0,
        y: 0,
        over: false,
        isMove: false,
        isOtherMove: false,
        isPlay: false,
        isSync: false,
        isOver: (x, y) => {
            let dx = note.x - x
            let dy = note.y - y
            let d = note.size * 0.8
            return (dx * dx + dy * dy < d * d)
        },
        clicked: (callback) => {
            callClick = callback
        },
        click: () => {
            callClick(note.name)
        },
        draw: (ctx) => {
            let rate = note.size / note.w
            ctx.save()
            ctx.translate(note.x, note.y)
            // circle
            if (note.over) {

                ctx.fillStyle = note.isOtherMove ? 'rgba(150,0,0,0.3)' : 'rgba(0,100,100,0.3)'
                ctx.beginPath()
                ctx.arc(0, 0, note.size * 0.7, 0, Math.PI * 2, true)
                ctx.fill()
            }
            // circle
            if (note.isPlay) {
                ctx.beginPath()
                ctx.strokeStyle = 'rgba(0,0,200,0.9)'
                ctx.arc(0, 0, note.size * 0.6, 0, Math.PI * 2, true)
                ctx.stroke()

                ctx.beginPath()
                ctx.strokeStyle = 'rgba(0,0,200,0.7)'
                ctx.arc(0, 0, note.size * 0.9, 0, Math.PI * 2, true)
                ctx.stroke()

                ctx.beginPath()
                ctx.strokeStyle = 'rgba(0,0,200,0.5)'
                ctx.arc(0, 0, note.size * 1.2, 0, Math.PI * 2, true)
                ctx.stroke()

            }
            // image
            ctx.scale(rate, rate)
            ctx.drawImage(note.icon, -150, -150, 300, 300)
            ctx.restore()
        }
    }
    return note
}

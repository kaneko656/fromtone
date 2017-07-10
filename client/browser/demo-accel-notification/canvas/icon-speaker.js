
module.exports = (speakerIcon) => {
    let speaker = {
        icon: speakerIcon,
        size: speakerIcon.width,
        w: speakerIcon.width,
        h: speakerIcon.height,
        x: 0,
        y: 0,
        over: false,
        isMove: false,
        isThis: true,
        isPlay: false,
        isOver: (x, y) => {
            let dx = speaker.x - x
            let dy = speaker.y - y
            let d = speaker.size * 0.8
            return (dx * dx + dy * dy < d * d)
        },
        draw: (ctx) => {
            let rate = speaker.size / speaker.w
            ctx.save()
            ctx.translate(speaker.x, speaker.y)
            // circle
            if (speaker.over) {
                ctx.fillStyle = speaker.isThis ? 'rgba(0,100,100,0.3)' : 'rgba(150,0,0,0.3)'
                ctx.beginPath()
                ctx.arc(0, 0, speaker.size * 0.7, 0, Math.PI * 2, true)
                ctx.fill()
            }
            // circle
            if (speaker.isThis) {
                let alpha = speaker.isPlay ? 0.7 : 0.5
                let r = speaker.isPlay ? 0.6 : 0.7
                ctx.lineWidth = 2

                ctx.beginPath()
                ctx.strokeStyle = 'rgba(0,150,100,' + alpha + ')'
                ctx.arc(0, 0, speaker.size * r, 0, Math.PI * 2, true)
                ctx.stroke()

                alpha -= 0.2
                r += speaker.isPlay ? 0.3 : 0.15
                ctx.beginPath()
                ctx.strokeStyle = 'rgba(0,150,100,' + alpha + ')'
                ctx.arc(0, 0, speaker.size * r, 0, Math.PI * 2, true)
                ctx.stroke()

                if (speaker.isPlay) {
                    alpha -= 0.2
                    r += 0.3
                    ctx.beginPath()
                    ctx.strokeStyle = 'rgba(0,150, 100,' + alpha + ')'
                    ctx.arc(0, 0, speaker.size * r, 0, Math.PI * 2, true)
                    ctx.stroke()
                }
            } else if (speaker.isPlay) {
                ctx.lineWidth = 2
                ctx.beginPath()
                ctx.strokeStyle = 'rgba(150,0,0,0.5)'
                ctx.arc(0, 0, speaker.size * 0.6, 0, Math.PI * 2, true)
                ctx.stroke()

                ctx.beginPath()
                ctx.strokeStyle = 'rgba(150,0,0,0.3)'
                ctx.arc(0, 0, speaker.size * 0.7, 0, Math.PI * 2, true)
                ctx.stroke()
            }
            // image
            ctx.scale(rate, rate)
            ctx.drawImage(speaker.icon, -150, -150, 300, 300)
            ctx.restore()
        }
    }
    return speaker
}

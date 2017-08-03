module.exports = (element, widthRate = 1, heightRate = 1) => {
    let canvas = document.createElement('canvas')
    canvas.display = 'block'
    canvas.margin = 0
    canvas.pedding = '0px'

    canvas.style.width = window.innerWidth * widthRate+ 'px'
    canvas.style.height = window.innerHeight * heightRate + 'px'
    canvas.width = window.innerWidth * window.devicePixelRatio
    canvas.height = window.innerHeight * window.devicePixelRatio

    sizing()
    element.appendChild(canvas)

    function sizing() {
        var b = document.body
        var d = document.documentElement
        let width = element.width
        let height = element.height
        canvas.style.width = window.innerWidth * widthRate+ 'px'
        canvas.style.height = window.innerHeight * heightRate + 'px'
        canvas.height = window.innerHeight * window.devicePixelRatio * heightRate
        canvas.width = window.innerWidth * window.devicePixelRatio * widthRate
    }

    window.addEventListener('resize', function() {
        (!window.requestAnimationFrame) ? setTimeout(sizing, 150): window.requestAnimationFrame(sizing)
    })

    return canvas
}

module.exports = (element, widthRate = 1, heightRate = 1) => {
    let canvas = document.createElement('canvas')
    canvas.display = 'block'
    canvas.margin = 0
    element.appendChild(canvas)
    sizing()

    function sizing() {
        canvas.height = element.offsetHeight * heightRate
        canvas.width = element.offsetWidth * widthRate
    }

    window.addEventListener('resize', function() {
        (!window.requestAnimationFrame) ? setTimeout(sizing, 150): window.requestAnimationFrame(sizing)
    })

    return canvas
}

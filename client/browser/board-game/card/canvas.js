module.exports = (element, widthRate = 1, heightRate = 1) => {
    let canvas = document.createElement('canvas')
    canvas.display = 'block'
    element.appendChild(canvas)
    // let size = width < height ? width : height
    sizing()

    function sizing() {
        canvas.height = element.offsetHeight * heightRate
        canvas.width = element.offsetWidth * widthRate
    }

    window.addEventListener('resize', function() {
        (!window.requestAnimationFrame) ? setTimeout(sizing, 300): window.requestAnimationFrame(sizing)
    })

    return canvas
}

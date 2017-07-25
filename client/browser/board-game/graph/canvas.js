
module.exports = (element, width, height) => {
    var canvas = document.createElement('canvas')
    // let size = width < height ? width : height
    canvas.setAttribute('width', width)
    canvas.setAttribute('height', height)
    element.appendChild(canvas)
    return canvas
}

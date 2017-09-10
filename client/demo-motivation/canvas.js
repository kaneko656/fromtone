
module.exports = (element) => {
    var canvas = document.createElement('canvas')
    let width = window.innerWidth - 120 > 400 ? window.innerWidth - 120 : 400
    let height = window.innerHeight > 400 ? window.innerHeight : 400
    let size = width < height ? width : height
    canvas.setAttribute('width', size)
    canvas.setAttribute('height', size)
    element.appendChild(canvas)
    return canvas
}


module.exports = (element) => {
    var canvas = document.createElement('canvas')
    let width = window.innerWidth > 300 ? window.innerWidth : 300
    let height = window.innerHeight > 300 ? window.innerHeight : 300
    canvas.setAttribute('width', width)
    canvas.setAttribute('height', height)
    element.appendChild(canvas)
    return canvas
}

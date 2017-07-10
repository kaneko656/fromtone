
module.exports = (element) => {
    var canvas = document.createElement('canvas')
    let width = window.innerWidth - 120 > 500 ? window.innerWidth - 120 : 500
    // let height = window.innerHeight > 500 ? window.innerHeight : 500
    let height = 300
    let size = width < height ? width : height
    canvas.setAttribute('width', size)
    canvas.setAttribute('height', size)
    element.appendChild(canvas)
    return canvas
}

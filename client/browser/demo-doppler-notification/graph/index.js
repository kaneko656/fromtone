let Canvas = require('./canvas.js')
let editer
let tool
let element
let Field = require('./editer/field.js')
let ToolField = require('./tool/toolField.js')

exports.init = (_element) => {
    element = _element
    let width = window.innerWidth - 60 > 500 ? window.innerWidth - 60 : 500
    let eleEditer = document.createElement('editer')
    let eleTool = document.createElement('tool')
    eleEditer.style.margin = '30px'
    eleTool.style.margin = '30px'
    element.appendChild(eleEditer)
    element.appendChild(eleTool)
    let editerCanvas = Canvas(eleEditer, width, 300)
    let toolCanvas = Canvas(eleTool, width, 50)
    field = Field(editerCanvas)
    tool = ToolField(toolCanvas)
    field.render()
    tool.render()
}

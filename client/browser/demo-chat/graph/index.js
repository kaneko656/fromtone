let Canvas = require('./canvas.js')
let editer
let tool
let listener
let element
let Field = require('./editer/field.js')
let ToolField = require('./tool/toolField.js')
let ListenerField = require('./listenerPosition/listenerField.js')

exports.init = (_element) => {
    element = _element
    let width = window.innerWidth - 60 > 300 ? window.innerWidth - 60 : 300
    let eleEditer = document.createElement('editer')
    let eleTool = document.createElement('tool')
    let eleListener = document.createElement('listener')
    eleEditer.style.margin = '30px'
    eleTool.style.margin = '30px'
    eleListener.style.margin = '30px'
    element.appendChild(eleEditer)
    element.appendChild(eleTool)
    element.appendChild(eleListener)
    let editerCanvas = Canvas(eleEditer, width, 300)
    let toolCanvas = Canvas(eleTool, width, 50)
    let listenerCanvas = Canvas(eleListener, width, 150)
    field = Field(editerCanvas)
    tool = ToolField(toolCanvas)
    listener = ListenerField(listenerCanvas)
    field.render()
    tool.render()
    listener.render()
}

// <input type="checkbox" checked data-toggle="switch" name="default-switch" id="switch-01" />

// data-on-color
//  primary
//  info
//  success
//  warning
//  danger

// <input type="checkbox" checked data-toggle="switch" name="info-square-switch" data-on-color="success" id="switch-05" />

module.exports = (element, id, text) => {
    return new Switch(element, id, text)
}

function Switch(element, id, text) {
    this.div = null
    this.id = id || ''

    this.init(element, text)
}

Switch.prototype.init = function(element, text) {
    this.div = document.createElement('div')
    // this.div.setAttribute('id', 'switch' + this.id)
    // this.div.setAttribute('id', 'switch' + this.id)
    let sw = document.createElement('input')
    sw.setAttribute('type', 'checkbox')
    sw.setAttribute('checked', '')
    sw.setAttribute('class', 'checkbox')
    sw.setAttribute('data-toggle', 'switch')
    sw.setAttribute('name', 'default-switch')
    // sw.setAttribute('data-on-color', 'success')
    sw.setAttribute('id', 'switch' + this.id)

    let h = document.createElement('h6')
    h.innerHTML = text || ''

    this.div.appendChild(sw)
    element.appendChild(h)
    element.appendChild(this.div)

    $(':checkbox').radiocheck()
}

// Slider.prototype.set = function() {
//     var slider = $('#slider' + this.id)
// }


Switch.prototype.getValues = function() {
    var switchCheck = $('#switch' + this.id).slider('checked')
    return switchCheck
}

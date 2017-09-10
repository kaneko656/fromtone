// <div id="slider"></div>


module.exports = (element, id, text) => {
    return new Slider(element, id, text)
}

function Slider(element, id, text) {
    this.div = null
    this.value = {}
    this.id = id || ''
    this.onChangeCall = () => {}

    this.init(element, text)
}

Slider.prototype.init = function(element, text) {
    this.div = document.createElement('div')
    this.div.setAttribute('id', 'slider' + this.id)
    let h = document.createElement('h5')
    h.innerHTML = text || ''

    element.appendChild(h)
    element.appendChild(this.div)
}

Slider.prototype.setList = function(nameList) {
    var slider = $('#slider' + this.id)
    if (slider.length > 0) {
        slider.slider({
            animate: 'fast',
            min: 1,
            max: 100,
            value: 30,
            orientation: 'horizontal'
            // range: true
        })
        // }).addSliderSegments($slider.slider("option").max);
    }
}


Slider.prototype.getValue = function() {
    var slider = $('#slider' + this.id).slider('value')
    return slider
}

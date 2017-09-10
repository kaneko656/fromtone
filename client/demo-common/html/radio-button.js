module.exports = (element, id, text) => {
    return new RadioButton(element, id, text)
}

function RadioButton(element, id, text) {
    this.div = null
    this.selectStatus = {}
    this.id = id || ''
    this.onSelectCall = () => {}

    this.init(element, text)
}

RadioButton.prototype.init = function(element, text) {
    this.div = document.createElement('div')
    let h = document.createElement('h5')
    h.innerHTML = text || ''

    element.appendChild(h)
    element.appendChild(this.div)
}


RadioButton.prototype.setList = function(nameList) {
    let div = this.div
    let selectStatus = this.selectStatus
    let id = this.id

    let radio = {
        start: null,
        stop: null
    }

    nameList.forEach((name, i) => {

        let label = document.createElement('label')
        label.setAttribute('class', 'radio')
        label.setAttribute('for', 'radio' + id + i)
        label.setAttribute('data-name', name)

        let input = document.createElement('input')
        input.setAttribute('type', 'radio')
        input.setAttribute('name', id)
        // input.setAttribute('class', 'radio')
        input.setAttribute('value', name)
        input.setAttribute('id', 'radio' + id + i)
        input.setAttribute('data-id', id)
        input.setAttribute('data-toggle', 'radio')
        if (i == 0) {
            input.setAttribute('checked', 'checked')
            selectStatus[name] = true
        } else {
            // input.setAttribute('disabled', '')
            selectStatus[name] = false
        }
        label.innerHTML = name
        label.appendChild(input)
        div.appendChild(label)
    })

    // element.appendChild(div)

    $(':radio').radiocheck()

    let Radio = this
    $(':radio').on('change.radiocheck', function(e) {
        let dataID = e.target.getAttribute('data-id')
        if (id == dataID) {
            for (let name in selectStatus) {
                if (name == e.target.value) {
                    selectStatus[name] = true
                } else {
                    selectStatus[name] = false
                }
            }
            Radio.onSelectCall(e.target.value)
        }
    })

    return radio
}

RadioButton.prototype.onSelect = function(callback = () => {}) {
    this.onSelectCall = callback
}

RadioButton.prototype.getSelected = function() {
    for (let name in this.selectStatus) {
        if (this.selectStatus[name]) {
            return name
        }
    }
    return ''
}

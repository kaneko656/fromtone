
module.exports = (element, id, text) => {
    return new SelectList(element, id, text)
}

function SelectList(element, id, text) {
    this.div = null
    this.selectStatus = {}
    this.userList = {}
    this.number = 0
    this.id = id
    this.init(element, text)
    this.changeCall = () => {}
}

SelectList.prototype.init = function(element, text) {
    this.div = document.createElement('div')
    let h = document.createElement('h5')
    h.innerHTML = text || ''

    element.appendChild(h)
    element.appendChild(this.div)
}

SelectList.prototype.selectUser = function() {
    let list = []
    for (let name in this.selectStatus) {
        if (this.selectStatus[name]) {
            list.push(name)
        }
    }
    return list
}

SelectList.prototype.getSelectUser = function() {
    return this.selectUser()
}

SelectList.prototype.getUserList = function() {
    let list = []
    for (let name in this.userList) {
        if (this.userList[name]) {
            list.push(name)
        }
    }
    return list
}

SelectList.prototype.onChange = function(callback = () => {}) {
    this.changeCall = callback
}

SelectList.prototype.setList = function(nameList) {
    let id = this.id
    let sl = this

    nameList.forEach((name) => {
        if (name in sl.selectStatus) {
            return
        }

        let label = document.createElement('label')
        label.setAttribute('class', 'checkbox')
        label.setAttribute('for', 'checkbox' + id + sl.number)
        label.setAttribute('data-name', name)

        let input = document.createElement('input')
        input.setAttribute('type', 'checkbox')
        input.setAttribute('value', name)
        input.setAttribute('data-id', id)
        input.setAttribute('class', 'checkbox')
        input.setAttribute('id', 'checkbox' + id + sl.number)
        input.setAttribute('data-toggle', 'checkbox')
        label.innerHTML = name
        label.appendChild(input)
        sl.div.appendChild(label)

        sl.selectStatus[name] = false
        sl.userList[name] = true
        sl.number += 1
    })

    $(':checkbox').radiocheck()

    $(':checkbox').on('change.radiocheck', function(e) {
        // e.target.value
        let dataID = e.target.getAttribute('data-id')
        if (id == dataID && sl.selectStatus[e.target.value] != e.target.checked) {
            sl.selectStatus[e.target.value] = e.target.checked
            sl.changeCall()
        }
    })
}

SelectList.prototype.addUser = function(nameList) {
    let id = this.id
    let sl = this
    if (!Array.isArray(nameList) && nameList) {
        let temp = nameList
        nameList = []
        nameList.push(temp)
    }

    nameList.forEach((name, i) => {
        if (name in sl.selectStatus) {
            sl.enable(name)
            return
        }
        let label = document.createElement('label')
        label.setAttribute('class', 'checkbox')
        label.setAttribute('for', 'checkbox' + id + sl.number)
        label.setAttribute('data-name', name)

        let input = document.createElement('input')
        input.setAttribute('type', 'checkbox')
        input.setAttribute('value', name)
        input.setAttribute('data-id', id)
        input.setAttribute('class', 'checkbox')
        input.setAttribute('id', 'checkbox' + id + sl.number)
        input.setAttribute('data-toggle', 'checkbox')
        label.innerHTML = name
        label.appendChild(input)
        sl.div.appendChild(label)

        sl.selectStatus[name] = false
        sl.userList[name] = true
        sl.number += 1
    })

    $(':checkbox').radiocheck()

    $(':checkbox').on('change.radiocheck', function(e) {
        let dataID = e.target.getAttribute('data-id')
        if (id == dataID && sl.selectStatus[e.target.value] != e.target.checked) {
            sl.selectStatus[e.target.value] = e.target.checked
            sl.changeCall()
        }
    })
}

SelectList.prototype.removeUser = function(nameList) {
    let sl = this
    if (!Array.isArray(nameList) && nameList) {
        let temp = nameList
        nameList = []
        nameList.push(temp)
    }
    nameList.forEach((targetName) => {
        sl.disable(targetName)
        sl.userList[targetName] = false
    })
}

SelectList.prototype.disable = function(targetName) {
    let children = this.div.children || []
    for (var i = 0; i < children.length; i++) {
        let name = children[i].getAttribute('data-name')
        if (targetName === name) {
            this.selectStatus[name] = false
            let htmlFor = children[i].htmlFor
            $('#' + htmlFor).radiocheck('indeterminate')
            $('#' + htmlFor).radiocheck('disable')
            return
        }
    }
}

SelectList.prototype.enable = function(targetName) {
    let children = this.div.children || []
    for (var i = 0; i < children.length; i++) {
        let name = children[i].getAttribute('data-name')
        if (targetName === name) {
            this.selectStatus[name] = false
            let htmlFor = children[i].htmlFor
            $('#' + htmlFor).radiocheck('enable')
            $('#' + htmlFor).radiocheck('determinate')
            return
        }
    }
}

SelectList.prototype.check = function(targetName) {
    let children = this.div.children || []
    for (var i = 0; i < children.length; i++) {
        let name = children[i].getAttribute('data-name')
        if (targetName === name) {
            this.selectStatus[name] = true
            let htmlFor = children[i].htmlFor
            $('#' + htmlFor).radiocheck('check')
            return
        }
    }
}

// let getRadio = (targetName) => {
//     let children = div.children || []
//     for (var i = 0; i < children.length; i++) {
//         let name = children[i].getAttribute('data-name')
//         console.log(name)
//         if (targetName === name) {
//             let htmlFor = children[i].htmlFor
//             return $('#' + htmlFor)
//         }
//     }
//     return null
// }

const CallbackChild = require('./CallbackChild.js')
const CallOperator = require('./CallOperator.js')

module.exports = (name) => {
    return new Call(name)
}

function Call(name) {
    this.Callbacks = {}
    this.name = name
    this.type = 'Call'
    this.timeout = 1000
    this.repeatLimit = 3
    this.targetLevel = 10
    this.staticValue = {}

    this.on('onTest', () => {
        console.log('Test:on ' + name)
    })
}

// register
Call.prototype.register = function(key) {
    key = keyCheck(key)
    this.Callbacks[key] = new CallbackChild(this.name, key)
    return this
}

// on (register: if not registered)
Call.prototype.on = function(key, filter, applyCallback = () => {}) {
    if (typeof filter == 'function') {
        applyCallback = filter
        filter = null
    }

    let Callbacks = this.Callbacks
    key = keyCheck(key)

    if (!Callbacks[key]) {
        this.register(key)
    }
    Callbacks[key].setTargetLevel(this.targetLevel)
    let num = Callbacks[key].on(applyCallback, filter)
    let operator = CallOperator(Callbacks[key], num)
    return operator
}

// 可変長引数で実行
Call.prototype.emit = function(key, ...option) {
    key = keyCheck(key)

    let Callbacks = this.Callbacks

    if (Callbacks[key]) {
        Callbacks[key].setTimeout(this.timeout)
        Callbacks[key].setRepeatLimit(this.repeatLimit)

        Callbacks[key].emit.apply(Callbacks[key], option)
    }
    return this
}

// 開く
Call.prototype.noticeEmit = function(key) {
    key = keyCheck(key)
    if (!this.Callbacks[key]) {
        this.Callbacks[key] = new CallbackChild(this.name, key)
    }
    return this
}

// 削除
Call.prototype.remove = function(key, num) {

    let Callbacks = this.Callbacks
    key = keyCheck(key)
    if (!num && Callbacks[key]) {
        Callbacks[key].allRemove()
        return this
    }


    num = key.num ? key.num : num
    key = key.key ? key.key : key
    if (Callbacks[key]) {
        Callbacks[key].remove(num)
    }
    return this
}

// 呼び出し許可、不許可
Call.prototype.setCallStatus = function(status, key, num) {
    let Callbacks = this.Callbacks
    key = keyCheck(key)

    num = key.num ? key.num : num
    key = key.key ? key.key : key

    if (Callbacks[key]) {
        Callbacks[key].setCallStatus(num, status)
    }
    return this
}

// key一覧
Call.prototype.list = function(key) {
    let Callbacks = this.Callbacks

    if (key) {
        if (key in Callbacks) {
            return Callbacks[key].list()
        }
        return null
    }

    let list = {}
    for (let key in Callbacks) {
        list[key] = this.name
    }
    return list
}

// setName
Call.prototype.setName = function(name) {
    this.name = name

    let Callbacks = this.Callbacks
    for (let key in Callbacks) {
        Callbacks[key].setName(name)
    }
    return this
}

// getName
Call.prototype.getName = function() {
    return this.name
}

// setTimeoutMiliis
Call.prototype.setTimeout = function(millis) {
    if (isFinite(millis) && millis >= 0) {
        this.timeout = millis
    }
    return this
}

// getTimeoutMiliis
Call.prototype.getTimeout = function() {
    return this.timeout
}

// setRepeatLimit
Call.prototype.setRepeatLimit = function(num) {
    if (isFinite(num) && num >= 0) {
        this.repeatLimit = num
    }
    return this
}

// getTargetLevel
Call.prototype.getTargetLevel = function() {
    return this.targetlevel
}

// setTargetLevel
Call.prototype.setTargetLevel = function(level) {
    if (isFinite(level) && level >= 0) {
        this.targetLevel = level
    }
    return this
}

// getRepeatLimit
Call.prototype.getRepeatLimit = function() {
    return this.repeatLimit
}

// isMulti
Call.prototype.isMulti = function() {
    return false
}

let keyCheck = (key) => {
    if (typeof key != 'string') {
        key = 'unknown'
    }
    // key = key.toLowerCase()
    return key
}

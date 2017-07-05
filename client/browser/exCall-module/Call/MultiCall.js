module.exports = (...Calls) => {
    let allCalls = []

    Calls.forEach((Call) => {
        if (Array.isArray(Call)) {
            Call.forEach((C) => {
                allCalls.push(C)
            })
        } else {
            allCalls.push(Call)
        }
    })
    try {
        return new MultiCall(allCalls)
    } catch (e) {
        return 'error'
    }
}

function MultiCall(Calls) {
    this.name = ''
    this.tyoe = 'Call'
    Calls.forEach((Call, i) => {
        this.name += i > 0 ? ' & ' : ''
        this.name += Call.getName()
    })
    this.Calls = Calls
}

// register

MultiCall.prototype.register = function(key) {
    this.Calls.forEach((Call) => {
        multiregister(Call, key)
    })
    return this
}

let multiregister = (Call, key) => {
    Call.register(key)
}

// on (register: if not registered)

MultiCall.prototype.on = function(key, filter, applyCallback) {
    let sendCalls = {}
    this.Calls.forEach((Call) => {
        let sendCall = multiOn(Call, key, filter, applyCallback)
        sendCalls[sendCall.getName()] = sendCall
    })
    return sendCalls
}

let multiOn = (Call, key, filter, applyCallback) => {
    return Call.on(key, filter, applyCallback)
}

// emit  (key, ...option)

MultiCall.prototype.emit = function(...arg) {
    this.Calls.forEach((Call) => {
        Call.emit.apply(Call, arg)
    })
    return this
}


// noticeEmit

MultiCall.prototype.noticeEmit = function(key) {
    this.Calls.forEach((Call) => {
        multiNoticeEmit(Call, key)
    })
    return this
}

let multiNoticeEmit = (Call, key) => {
    Call.noticeEmit(key)
}

// 「remove」&「setCallStatus」 on each Call's method

// list

MultiCall.prototype.list = function(key, num) {
    let list = []

    this.Calls.forEach((Call, i) => {
        let childList = Call.list()
        for (let key in childList) {
            if (!list[key]) {
                list[key] = []
            }
            list[key].push(childList[key])
        }
    })
    return list
}

// setName

MultiCall.prototype.setName = function(name) {
    this.name = name
    return this
}

// getName

MultiCall.prototype.getName = function() {
    return this.name
}

// setTimeout

MultiCall.prototype.setTimeout = function(millis) {
    this.Calls.forEach((Call) => {
        Call.setTimeout(millis)
    })
    return this
}

// getTimeout

MultiCall.prototype.getTimeout = function() {
    let list = []
    this.Calls.forEach((Call) => {
        list.push({
            timeout: Call.getTimeout(),
            name: Call.getName()
        })
    })
    return list
}

// setRepeatLimit

MultiCall.prototype.setRepeatLimit = function(num) {
    this.Calls.forEach((Call) => {
        Call.setRepeatLimit(num)
    })
    return this
}

// getRepeatLimit

MultiCall.prototype.getRepeatLimit = function() {
    let list = []
    this.Calls.forEach((Call) => {
        list.push({
            repeatLimit: Call.getRepeatLimit(),
            name: Call.getName()
        })
    })
    return list
}

// setTargetLevel

MultiCall.prototype.setTargetLevel = function(level) {
    this.Calls.forEach((Call) => {
        Call.setTargetLevel(level)
    })
    return this
}

// getTargetLevel

MultiCall.prototype.getTargetLevel = function() {
    let list = []
    this.Calls.forEach((Call) => {
        list.push({
            targetLevel: Call.getTargetLevel(),
            name: Call.getName()
        })
    })
    return list
}


// isMulti

MultiCall.prototype.isMulti = function() {
    return true
}

MultiCall.prototype.multiNum = function() {
    let num = 0
    this.Calls.forEach((Call) => {
        num += Call.isMulti() ? Call.multiNum() : 1
    })
    return num
}

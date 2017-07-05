const CallMeasure = require('./CallMeasure.js')
const CallOperator = require('./CallOperator.js')

/**
 *  Callback manage,ent class corresponding to key
 */

module.exports = CallbackChild

function CallbackChild(name, key) {
    this.name = name
    this.listNum = 0
    this.key = key
    this.callbackList = {}

    this.timeout = 3000
    this.repeatLimit = 3

    this.maxLevel = 10
    this.targetLevel = 10
    this.sectionAmount = 100
    this.sectionCount = {}
    for (let lev = 0; lev <= this.maxLevel; lev++) {
        this.sectionCount[lev] = 0
    }
}

// getNewSectionNumber
// Called in decreasing order

CallbackChild.prototype.getNewSectionNumber = function() {
    let level = this.targetLevel
    if (this.sectionCount[level] + 1 >= this.sectionAmount) {
        level = this.maxLevel
    }
    this.sectionCount[level] += 1
    return this.sectionCount[level] + level * this.sectionAmount
}

// setTargetLevel

CallbackChild.prototype.setTargetLevel = function(level) {
    if (isFinite(level) && level >= 0 && level <= this.maxLevel) {
        this.targetLevel = Math.floor(level)
    }
}

// remove

CallbackChild.prototype.remove = function(num) {
    if (num in this.callbackList) {
        delete this.callbackList[num]
    }
}

// setCallStatus

CallbackChild.prototype.setCallStatus = function(num, status) {
    if (num in this.callbackList) {
        this.callbackList[num].call = status
    }
}

// isStatus

CallbackChild.prototype.isStatus = function(num) {
    if (num in this.callbackList) {
        return this.callbackList[num].call
    }
}

// setName

CallbackChild.prototype.setName = function(name) {
    this.name = name
}

// getName

CallbackChild.prototype.getName = function() {
    return this.name
}

// setTimeout

CallbackChild.prototype.setTimeout = function(millis) {
    if (isFinite(millis) && millis >= 0) {
        this.timeout = millis
    }
}

// setRepeatLimit

CallbackChild.prototype.setRepeatLimit = function(num) {
    if (isFinite(num) && num >= 0) {
        this.repeatLimit = num
    }
}

// on

CallbackChild.prototype.on = function(applyCallback, filter) {

    if (typeof applyCallback == 'function') {
        let sectionNum = this.getNewSectionNumber()
        this.callbackList[sectionNum] = {
            callback: applyCallback,
            num: sectionNum,
            call: true,
            type: 'function',
            filter: filter
        }
        return sectionNum
    } else if (['string', 'number', 'boolean', 'undefined'].indexOf(typeof applyCallback) >= 0) {
        let sectionNum = this.getNewSectionNumber()
        this.callbackList[sectionNum] = {
            callback: () => {
                return applyCallback
            },
            num: sectionNum,
            call: true,
            type: 'value',
            filter: filter
        }
        return sectionNum
    }
}

// emit

CallbackChild.prototype.emit = function(...option) {
    let Child = this

    // callbacks
    let setMeasure = []
    for (let num in Child.callbackList) {
        if (Child.callbackList[num].call) {

            let callback = Child.callbackList[num].callback
            let filter = Child.callbackList[num].filter

            setMeasure.push((operator) => {

                // copy
                let copy = Object.assign([], option)

                // again check callStatus
                if (!Child.callbackList[num] || !Child.callbackList[num].call) {
                    return
                }

                // setOperator
                operator.Call = CallOperator(Child, num)
                copy.unshift(operator)

                // filter
                if (filter && filter.type == 'filter' && typeof filter.judge == 'function') {
                    filter.judge(operator.getContext(), (result) => {
                        if (result && result.judge) {
                            // emit
                            callback.apply(Child, copy)
                        } else {
                            // do not emit
                        }
                    })
                } else {

                    // emit
                    callback.apply(Child, copy)
                }
            })
        }
    }

    let callMeasure = new CallMeasure(setMeasure, Child.timeout, Child.repeatLimit)
    callMeasure.start()
}

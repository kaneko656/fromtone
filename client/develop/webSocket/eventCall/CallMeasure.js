/**
 * 一連の流れで連続するcallback
 * contextInfoを受け継ぐ
 * repeatが可能
 * 音楽スコアの小節のように流れていく
 */


module.exports = CallMeasure

function CallMeasure(callbacks, timeout, repeatLimit) {

    // callbacks  1 ~ n
    callbacks.unshift(() => {})
    this.callbacks = callbacks

    // overall
    this.measureNum = callbacks.length

    // system
    this.repeatHead = 1
    this.runningMeasure = 0
    this.timeout = timeout || 3000
    this.repeatLimit = repeatLimit || 3

    // measure
    this.contextInfo = []
    this.statefulInfo = []
    this.pause = []
    this.repeat = []
    this.stopLower = []
    for (let n = 0; n < this.measureNum; n++) {
        this.pause[n] = false
        this.repeat[n] = false
        this.stopLower[n] = false
        this.contextInfo[n] = {}
        this.statefulInfo[n] = {
            times: 0,
        }
    }
}

CallMeasure.prototype.start = function() {
    this.next()
}

CallMeasure.prototype.next = function() {
    let measure = this
    let n = measure.runningMeasure
    let goNext = false

    // finish
    if (n >= measure.measureNum) {
        return
    }

    // context
    measure.contextInfo[n] = n == 0 ? {} : measure.contextInfo[n - 1]
    measure.statefulInfo[n].times += 1

    // nextProcess
    let next = () => {
        goNext = true

        // reset pause
        measure.pause[n] = false

        // stopLower
        if (measure.stopLower[n]) {
            measure.stopLower[n] = false
            measure.runningMeasure = measure.measureNum
            measure.next()
            return
        }

        // repeatLimit
        if (measure.statefulInfo[n].times >= measure.repeatLimit) {
            measure.repeat[n] = false
        }

        // repeat
        if (measure.repeat[n]) {
            measure.repeat[n] = false
            measure.runningMeasure = measure.repeatHead
            measure.contextInfo[measure.repeatHead - 1] = measure.contextInfo[n]
            measure.next()
            return
        }

        // next
        measure.runningMeasure += 1
        measure.next()
    }

    // next(expressly)
    let expresslyNext = () => {
        if (!goNext) {
            next()
        }
    }

    // emit
    measure.callbacks[n](measure.Operator(n, next))

    // not pause
    if (!measure.pause[n]) {
        if (!goNext) {
            next()
        }
    }

    // setTimeout
    if (!goNext) {
        setTimeout(() => {
            if (!goNext) {
                next()
            }
        }, measure.timeout)
    }

}

CallMeasure.prototype.Operator = function(num, next) {
    let measure = this
    return {
        pause: () => {
            measure.pause[num] = true
        },
        setRepeatHead: () => {
            measure.repeatHead = measure.repeatHead < num ? num : measure.repeatHead
        },
        setContext: (info) => {
            measure.contextInfo[num] = info
        },
        getContext: () => {
            return measure.contextInfo[num]
        },
        getStatefulInfo: () => {
            return Object.assign({}, measure.statefulInfo[num])
        },
        next: () => {
            next()
        },
        repeat: () => {
            measure.repeat[num] = true
            next()
        },
        stopLower: () => {
            measure.stopLower[num] = true
            next()
        },
        timestamp: new Date().getTime()
    }
}

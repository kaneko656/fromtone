/**
 * @overview  一つの時系列データを持つクラス
 * @author {@link https://github.com/kaneko656 Shoma Kaneko}
 * @version 1.0.0
 * @module soundManager/TimeValue
 * @see {@link module:soundManager}
 */


/**
 * TimeValueクラスのコンストラクタ
 * @return {TimeValue} TimeValueのインスタンスを返す
 */

module.exports = () => {
    return new TimeValue()
}

/**
 * TimeValue 一つの時系列データを持つクラス
 * @class
 * @constructor
 */

function TimeValue() {
    this.values = {}
    this.lock = true
    this.lastTime = 0
    this.lastValue = null
}


/**
 * [description]
 * @param  {Object} updateValues { time: value }
 */

TimeValue.prototype.update = function(updateValues) {
    if (this.lastValue && this.lastTime < Date.now()) {
        updateValues[Date.now()] = this.lastValue
    }
    let length = Object.keys(updateValues).length
    let count = 0
    for (let time in updateValues) {
        count++
        // ロック
        if (this.lock && time < this.lastTime) {
            continue
        }
        // 時間切れ
        if (time < Date.now() && count != length) {
            continue
        }

        // Event
        if (this.lastTime && this.lastValue) {
            // pre, next
            this.updateEvent({
                time: this.lastTime,
                value: this.lastValue
            }, {
                time: time,
                value: updateValues[time]
            })
        }

        this.lastTime = time
        this.lastValue = updateValues[time]
    }
}


/**
 * update()で発火 時系列データが一つずつ降ってくるイベント
 * @event
 * @param  {Object} pre { time, value }
 * @param  {Object} next { time, value }
 */

TimeValue.prototype.updateEvent = function(pre, next) {

}

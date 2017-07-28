const GlobalPosition = require('./position.js')
const SoundManager = require('./../sound/soundManager.js')
const Card = require('./../card/cardList.js')

let log = require('./../player/log.js')

module.exports = () => {
    return new ObjectCase()
}

function ObjectCase() {
    this.objects = []
    this.id = 'id'
    this.limit = null
    // this.info = {}
    this.interval = 0
    this.area = {
        x: 0,
        y: 0,
        w: 100,
        h: 100
    }
}


ObjectCase.prototype.push = function(object, posX = 0) {
    this.objects.push({
        info: {},
        object: object,
        posX: posX,
        posY: this.area.y + this.area.h / 2
    })
    this.sort()
}

ObjectCase.prototype.pop = function(num) {
    let obj = this.objects[num].objects
    this.objects.splice(num, 1)
    this.sort()
    return obj
}

ObjectCase.prototype.sort = function() {
    this.objects.sort((a, b) => {
        if (a.posX < b.posX) return -1
        if (a.posX > b.posX) return 1
        return 0
    })
    let interval = this.area.w / this.objects.length
    this.interval = interval
    this.objects.forEach((obj, i) => {
        obj.posX = interval / 2 + interval * i
    })
}

ObjectCase.prototype.isOver = function(x, y) {
    let a = this.area
    let over = (a.x <= x && x <= a.x + a.w && a.y <= y && y <= a.y + a.h)
    if (over) {
        let interval = this.area.w / this.objects.length
        let num = Math.floor((x - a.x) / interval)
        num = num < this.objects.length ? num : this.objects.length - 1
        return num
    }
    return -1
}

ObjectCase.prototype.render = function() {

}

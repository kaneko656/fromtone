const GlobalPosition = require('./position.js')
const SoundManager = require('./sound/soundManager.js')
const Card = require('./../card/cardList.js')

let log = require('./../player/log.js')

module.exports = () => {
    return new ObjectCase()
}

function ObjectCase() {
    this.objects = []
    this.id = 'id'
    this.idList = []
    this.user = ''
    this.types = []
    this.events = []
    // this.info = {}
    this.interval = 0
    this.area = {
        x: 0,
        y: 0,
        w: 100,
        h: 100
    }

    this.callObjectRender = () => {}
}

ObjectCase.prototype.share = function() {
    let objects = []
    this.objects.forEach((obj) => {
        let outObj = obj.object.output()
        objects.push({
            info: Object.Assign({}, obj.info),
            object: outObj,
            posX: obj.posX,
            posY: obj.posY
        })
    })
    let out = {
        id: obj.id,
        user: this.user,
        type: [].concat(this.types),
        events: [].concat(this.events),
        objects: objetcs,
        interal: this.interval,
        area: Object.Assign({}, this.info),
    }
    this.events = []
    return out
}


ObjectCase.prototype.inCard = function(id) {
    console.log(this.idList)
    console.log(id)
    return (this.idList.indexOf(id) >= 0)
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
    let obj = this.objects[num].object
    obj.x = this.objects[num].posX
    obj.y = this.objects[num].posY
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

    this.idList = []
    let me = this
    this.objects.forEach((obj, i) => {
        obj.posX = interval / 2 + interval * i
        me.idList.push(obj.object.id)
    })
}

ObjectCase.prototype.inArea = function(x, y) {
    let a = this.area
    return (a.x <= x && x <= a.x + a.w && a.y <= y && y <= a.y + a.h)
}

ObjectCase.prototype.isOver = function(x, y) {
    let a = this.area
    let over = (a.x <= x && x <= a.x + a.w && a.y <= y && y <= a.y + a.h)
    if (over && this.objects.length >= 1) {
        let interval = this.area.w / this.objects.length
        let num = Math.floor((x - a.x) / interval)
        num = num < this.objects.length ? num : this.objects.length - 1
        return num
    } else if (over) {
        return 0.9
    }
    return -1
}



// override
ObjectCase.prototype.render = function(ctx) {
    // console.log('render')
    // let range = {
    //     minX: this.area.x,
    //     minY: this.area.y,
    //     maxX: this.area.x + this.area.w,
    //     maxY: this.area.y + this.area.h,
    // }
    // this.objects.forEach((object) => {
    //     let x = Math.round(object.posX)
    //     let y = Math.round(object.posY)
    //     let obj = object.object
    //     let objectInfo = object.info
    //     this.callObjectRender(ctx, x, y, obj, object)
    // })
}

module.exports = (icon) => {
    let callClick = () => {}
    let obj = {
        name: 'default',
        id: 'id',
        type: ['unknown'],
        icon: icon,
        w: icon.width,
        h: icon.height,
        x: 0,
        y: 0,
        scale: 1.0,
        isSync: false,
        event: 'e',
        // over: false,
        isMove: false,
        isOtherMove: false,
        isChild: false,
        parentObject: null,
        childPosition: null,
        isOver: (x, y) => {
            let cx = obj.x
            let cy = obj.y
            let tx = x - obj.x
            let ty = y - obj.y
            let objHalfW = obj.w * obj.scale / 2
            let objHalfH = obj.h * obj.scale / 2
            return (tx >= -objHalfW && tx <= objHalfW && ty >= -objHalfH && ty <= objHalfH)
        },
        clicked: (callback) => {
            callClick = callback
        },
        click: () => {
            callClick(obj.name)
        },
        draw: (ctx) => {
            if (obj.isChild) {
                obj.x = obj.parentObject.x + obj.childPosition.x * obj.canvasW
                obj.y = obj.parentObject.y + obj.childPosition.y * obj.canvasH
            }
            ctx.save()
            ctx.translate(obj.x, obj.y)
            // image
            ctx.scale(obj.scale, obj.scale)
            ctx.drawImage(obj.icon, -obj.w / 2, -obj.h / 2, obj.w, obj.h)
            ctx.restore()
        },
        output: () => {
            let out = {
                name: obj.name,
                id: obj.id,
                type: obj.type,
                x: obj.x,
                y: obj.y,
                event: obj.event,
                // scale: obj.scale,
                isSync: obj.isSync
            }
            return out
        },
        update: (upObj) => {
            if(upObj.id == obj.id){
              obj.x = upObj.x
              obj.y = upObj.y
              // obj.scale = obj.scale
              obj.isSync = upObj.isSync
              obj.event = upObj.event
            }
        }
    }
    return obj
}

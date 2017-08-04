module.exports = (_positions = {}) => {
    let callClick = () => {}
    let callMove = () => {}
    let callPositionChanged = () => {}
    let positions = Object.assign({}, _positions)
    let sepNum = 8
    let obj = {
        positions: positions,
        data: {},
        from: '',
        to: '',
        sepNum: sepNum,
        updatePosition: (gx, gy) => {
            let data = obj.data
            let from = obj.from
            let to = obj.to
            console.log(from, to)
            console.log(data)
            if (data[from] && data[from].to[to]) {
                console.log('update')
                let result = data[from].to[to].update(gx, gy)
                if (result) {
                    callPositionChanged(result)
                }
                return result
            }
            return null
        },
        positionChanged: (callback) => {
            callPositionChanged = callback
        },
        setFromTo: (from, to) => {
            obj.from = from
            obj.to = to
        },
        update: () => {
            // gx, gy
            let data = {}
            for (from in positions) {
                let p1 = positions[from]
                data[from] = {
                    gx: p1.gx,
                    gy: p1.gy,
                    to: {}
                }
                for (to in positions) {
                    if (from == to) {
                        continue
                    }
                    let p2 = positions[to]
                    let dist = Math.sqrt((p1.gx - p2.gx) * (p1.gx - p2.gx) + (p1.gy - p2.gy) * (p1.gy - p2.gy))
                    let toObj = {
                        dist: dist,
                        gx: p2.gx,
                        gy: p2.gy,
                        from: data[from],
                        fromDistNum: -1,
                        toDistNum: -1,
                        update: (gx, gy) => {
                            let dist = toObj.dist
                            let p1 = {
                                gx: toObj.from.gx,
                                gy: toObj.from.gy
                            }
                            let p2 = {
                                gx: toObj.gx,
                                gy: toObj.gy
                            }
                            let d1 = Math.sqrt((p1.gx - gx) * (p1.gx - gx) + (p1.gy - gy) * (p1.gy - gy))
                            let d2 = Math.sqrt((gx - p2.gx) * (gx - p2.gx) + (gy - p2.gy) * (gy - p2.gy))
                            console.log(d1, d2, dist)
                            if (d1 < dist / 2) {
                                // 0 ~ sepNum - 1
                                let n1 = Math.floor((d1 / (toObj.dist / 2)) * obj.sepNum)
                                if (toObj.fromDistNum != n1) {
                                    toObj.fromDistNum = n1
                                    return {
                                        near: 'from',
                                        id: from,
                                        n: n1
                                    }
                                }
                            } else if (d2 < dist / 2) {
                                let n2 = Math.floor((d2 / (toObj.dist / 2)) * obj.sepNum)
                                if (toObj.toDistNum != n2) {
                                    toObj.toDistNum = n2
                                    return {
                                        near: 'to',
                                        id: to,
                                        n: (obj.sepNum - 1 - n2) + obj.sepNum
                                    }
                                }
                            }
                            return null
                        }
                    }
                    console.log(from, to)
                    data[from].to[to] = toObj
                }
            }
            return data
        }
    }
    obj.data = obj.update()
    return obj
}

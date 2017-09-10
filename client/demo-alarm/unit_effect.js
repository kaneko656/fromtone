let create = () => {
    // effect - gain
    let gainNode = context.createGain()
    gainNode.gain.value = 2.0
    gainNode.connect(context.destination)

    // effect - panner
    panner = createPanner(side)
    panner.connect(gainNode)
}

let createPanner = (side = 'from') => {
    var panner = context.createPanner();

    // 指向性  Gainは減衰率  InterAngleは減衰しない範囲
    panner.coneOuterGain = 0.1
    panner.coneOuterAngle = 180
    panner.coneInnerAngle = 30

    // "linear" "inverse" "exponential"
    panner.distanceModel = 'exponential'

    // 基準距離
    panner.refDistance = 1.0

    // 最大距離
    panner.maxDistance = 10000

    panner.panningModel = 'HRTF'

    // x: 左右
    // y: 上下  +が上
    // z: 奥と手前  +が手前

    // 音源　向かい合っている
    // 音源の向き
    // 音源の位置
    panner.setPosition(0, 0, 0)
    panner.setOrientation(0, 0, 1)

    return panner
}

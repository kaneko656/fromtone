let isMove = false
let timeout = 10000


// gyro

exports.moved = (text, callback = () => {}) => {
    text.innerHTML = 'stable'

    // DeviceOrientation Event
    window.addEventListener("deviceorientation", deviceorientationHandler)

    // ジャイロセンサーの値が変化
    function deviceorientationHandler(event) {
        // X軸
        let x = event.beta
        // Y軸
        let y = event.gamma
        // Z軸
        let z = event.alpha

        console.log('x',isNaN(x))
        if (isNaN(x) || !x) {
            text.innerHTML = 'Can not use Gyro Sensor on this device.'
            callback(null, 'do not use')
        }else{
            // text.innerHTML = x.toFixed(4)
            callback(x)
        }

    }



    // window.addEventListener('devicemotion', (e) => {
    //     let x = parseFloat(e.acceleration.x)
    //     let y = parseFloat(e.acceleration.y)
    //     let z = parseFloat(e.acceleration.z)
    //     let gx = parseFloat(e.accelerationIncludingGravity.x)
    //     let gy = parseFloat(e.accelerationIncludingGravity.y)
    //     let gz = parseFloat(e.accelerationIncludingGravity.z)
    //
    //     if (isNaN(x)) {
    //         text.innerHTML = 'Can not use Accel Sensor on this device.'
    //     }
    //     // text.innerHTML = 'gx: ' + gx + '　gy: ' + gy + '　gz: ' + gz + '<br>'
    //     // text.innerHTML +='x: ' + x + '　y: ' + y + '　z: ' + z + '<br>'
    //     // text.innerHTML += (x + y + z)
    //     let sum = x + y + z
    //     if (sum && sum > 2) {
    //         text.innerHTML = 'Moved'
    //         if (!isMove) {
    //             isMove = true
    //             callback()
    //             setTimeout(() => {
    //                 text.innerHTML = 'Stable'
    //             }, timeout)
    //             setTimeout(() => {
    //                 isMove = false
    //             }, timeout)
    //         }
    //
    //     }
    // })
}

module.exports = (element) => {
    let s = new SwitchButton(element)
    s.create()
    return s
}

function SwitchButton(element) {
    this.element = element
    this.callGyro = () => {}
    this.callDoppler = () => {}
    this.gyroButton
    this.dopplerButton
}

SwitchButton.prototype.create = function() {

    let my = this

    /**
     * gyroButton
     */

     let gyroSwitch = true
    let p1 = document.createElement('p')
    let gyroButton = document.createElement('button')
    gyroButton.setAttribute('class', 'btn btn-default')
    gyroButton.innerHTML = 'Gyro On -> Off'
    p1.appendChild(gyroButton)
    my.element.appendChild(p1)

    gyroButton.onclick = () => {
        if (gyroSwitch) {
            gyroButton.innerHTML = 'Gyro Off -> On'
            gyroSwitch = false
        } else if (!gyroSwitch) {
            gyroButton.innerHTML = 'Gyro On -> Off'
            gyroSwitch = true
        }
        my.callGyro(gyroSwitch)
    }



    /**
     * dopplerButton
     */

    let p2 = document.createElement('p')
    let dopplerSwitch = true
    let dopplerButton = document.createElement('button')
    dopplerButton.setAttribute('class', 'btn btn-default')
    dopplerButton.innerHTML = 'Doppler On -> Off'
    p2.appendChild(dopplerButton)
    my.element.appendChild(p2)

    dopplerButton.onclick = () => {
        if (dopplerSwitch) {
            dopplerButton.innerHTML = 'Doppler Off -> On'
            dopplerSwitch = false
        } else if (!dopplerSwitch) {
            dopplerButton.innerHTML = 'Doppler On -> Off'
            dopplerSwitch = true
        }
        my.callDoppler(dopplerSwitch)
    }

    my.gyroButton = gyroButton
    my.dopplerButton = dopplerButton
}


SwitchButton.prototype.onGyroSwitch = function(callback = () => {}) {
    this.callGyro = callback
}

SwitchButton.prototype.onDopplerSwitch = function(callback = () => {}) {
    this.callDoppler = callback
}

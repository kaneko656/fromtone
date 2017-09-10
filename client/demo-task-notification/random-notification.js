let first = false
let isRandom = false
let randomRange = [5000, 30000]
let waitTime = 30000
let call = () => {}

exports.on = (callback = () => {}) => {
    first = true
    isRandom = true
    call = callback
    job()
}

let job = () => {
    let time = randomRange[0] + (Math.random() * randomRange[1] - randomRange[0])
    let wait = first ? 0 : waitTime
    console.log('randomNotification', time + wait)
    setTimeout(() => {
        if (isRandom) {
            call()
            first = false
            job()
        }
    }, time + wait)
}


exports.off = () => {
    isRandom = false
}

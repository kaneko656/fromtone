
module.exports = (element) => {
    let button = {
        start: null,
        stop: null
    }

    let start = document.createElement('button')
    start.setAttribute('class', 'button')
    start.innerHTML = 'START'
    element.appendChild(start)

    let stop = document.createElement('button')
    stop.setAttribute('class', 'button')
    stop.innerHTML = 'STOP'
    element.appendChild(stop)

    button.start = start
    button.stop = stop
    return button
}

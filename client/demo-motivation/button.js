
module.exports = (element) => {
    let button = {
        start: null,
        stop: null,
        test: null
    }

    let test = document.createElement('button')
    test.setAttribute('class', 'button')
    test.innerHTML = 'Sound Test'
    element.appendChild(test)

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
    button.test = test
    return button
}

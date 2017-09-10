module.exports = (element) => {
    let button = {
        start: null,
        stop: null
    }

    let p = document.createElement('p')
    p.setAttribute('class', 'mbl')
    let p2 = document.createElement('p')
    p2.innerHTML = 'iosは一度ボタンを押さないと鳴りません<br>'

    let start = document.createElement('button')
    start.setAttribute('class', 'btn btn-wide btn-primary mrm')
    start.innerHTML = 'Test'

    // let stop = document.createElement('button')
    // stop.setAttribute('class', 'btn btn-wide btn-primary mrm')
    // stop.innerHTML = 'STOP'

    let notification = document.createElement('button')
    notification.setAttribute('class', 'btn btn-wide btn-primary mrm')
    notification.innerHTML = '通知音'

    button.start = start
    // button.stop = stop
    button.notification = notification

    p.appendChild(start)
    // p.appendChild(stop)
    p.appendChild(notification)
    p.appendChild(p2)
    element.appendChild(p)

    return button
}

module.exports = (element) => {
    let button = {
        test: null,
        notification: null,
        notificationText: null
    }

    let notification = document.createElement('button')
    notification.setAttribute('class', 'btn btn-hg btn-primary')
    notification.innerHTML = 'Notification'
    let notificationText = document.createElement('h5')
    notificationText.innerHTML = '　'

    let p = document.createElement('p')
    p.setAttribute('class', 'mbl')
    let p2 = document.createElement('p')
    p2.innerHTML = '<br>iosは一度ボタンを押さないと音がなりません<br>'

    let test = document.createElement('button')
    test.setAttribute('class', 'btn btn-default')
    test.innerHTML = 'Test: この端末だけで鳴らす'


    button.test = test
    // button.stop = stop
    button.notification = notification
    button.notificationText = notificationText


    // p.appendChild(stop)
    p.appendChild(notification)
    p.appendChild(notificationText)
    p.appendChild(p2)
    p.appendChild(test)
    element.appendChild(p)

    return button
}

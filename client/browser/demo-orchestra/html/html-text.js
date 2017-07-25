module.exports = (element) => {
    let text = {
        status: null,
        log: null
    }

    let status = document.createElement('p')
    status.innerHTML = 'press START!'
    element.appendChild(status)

    let log = document.createElement('p')
    log.innerHTML = ''
    element.appendChild(log)

    text.status = status
    text.log = log
    return text
}

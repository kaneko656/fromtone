let log
exports.set = (element) => {
    log = document.createElement('p')
    log.innerHTML = 'log'
    element.appendChild(log)
}

exports.text = (text) => {
    if (log) {
        log.innerHTML = text
    }
}

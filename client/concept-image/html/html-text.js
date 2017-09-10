module.exports = (element) => {
    let text = {
        status: null,
        log: null,
        title: null
    }
    let title = document.createElement('h5')
    title.innerHTML = ''
    element.appendChild(title)

    let status = document.createElement('h6')
    status.innerHTML = ''
    element.appendChild(status)

    // let p = document.createElement('p')
    // p.innerHTML = 'Kaneko'
    // element.appendChild(p)



    text.status = status
    // text.log = log
    text.title = title
    return text
}

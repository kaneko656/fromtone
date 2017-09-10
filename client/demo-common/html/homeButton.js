// <button class="btn btn-default">Default</button>
module.exports = (element, user) => {
    let p = document.createElement('p')
    p.setAttribute('class', 'mbl')
    p.innerHTML = '<br>'

    let button = document.createElement('button')
    button.setAttribute('class', 'btn btn-default')
    button.innerHTML = 'Homeに戻る'

    button.onclick = () => {
        let href = window.location.href
        let http = 'http://'
        if (href.indexOf('http://') >= 0) {
            href = href.slice(7)
        }
        if (href.indexOf('https://') >= 0) {
            href = href.slice(8)
            http = 'https://'
        }
        let query_idx = href.indexOf('/')
        if (query_idx >= 1) {
            href = href.slice(0, query_idx)
        }
        let query = user ? '?user=' + user : ''
        location.href = http + href + query
    }

    p.appendChild(button)
    element.appendChild(p)


}

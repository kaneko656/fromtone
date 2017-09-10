let div
let user = null
let userName = null
let nameChangeCall = () => {}
let linkList = {}

exports.init = (element) => {
    div = document.createElement('div')
    div.style.margin = '30px'

    let title = document.createElement('h5')
    title.innerHTML = 'FromTone'
    let explain = document.createElement('p')
    explain.innerHTML = '各デモページに飛びます'
    userName = document.createElement('p')
    div.appendChild(title)
    div.appendChild(userName)
    div.appendChild(explain)

    element.appendChild(div)
}

exports.setUser = (_user) => {
    user = _user ? _user : null
    userName.innerHTML = 'ユーザ名: ' + user
    for (let url in linkList) {
        let link = linkList[url].link
        let url = linkList[url].url
        let query = user ? '?user=' + user : ''
        link.setAttribute('href', url + query)
    }
    console.log(user)
}

exports.setLink = (url, name) => {
    let p = document.createElement('p')
    let link = document.createElement('a')
    let query = user ? '?user=' + user : ''
    console.log(user)
    console.log(div)
    link.setAttribute('href', url + query)
    console.log(url+query)
    link.setAttribute('class', 'home_link')
    link.setAttribute('target', '_self')
    link.innerHTML = name
    linkList[url] = {
        link: link,
        name: name,
        url: url
    }
    p.appendChild(link)
    div.appendChild(p)
}

exports.setNameChangeButton = (callback = () => {}) => {
    let p = document.createElement('p')
    p.innerHTML = '<br><br>'
    let ele = document.createElement('button')
    ele.setAttribute('class', 'btn btn-default')
    ele.innerHTML = 'ユーザ名の変更'
    p.appendChild(ele)
    div.appendChild(p)
    // ele.setAttribute('target', name)
    nameChangeCall = callback
    ele.onclick = () => {
        nameChangeCall()
    }
}

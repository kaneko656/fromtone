(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
exports.userNameCheck = (user, callback = () => {}) => {
    if (!user || typeof user != 'string' || user == 'unknown') {
        module.exports.userNameInput(callback)
    }else{
        callback(user)
    }
}

exports.userNameInput = (callback = () => {}, caution = '') => {

    // 入力ダイアログを表示 ＋ 入力内容を user に代入
    // let user = window.prompt('ユーザー名を入力してください．slackでの名前を推奨（連携できます）' + caution, '')
    let user = window.prompt('ユーザー名を入力してください．' + caution, '')

    if (typeof user == 'string' && user.trim().length >= 1) {
        let href = window.location.href
        let query_idx = href.indexOf('?')
        if(query_idx >= 1){
            href = href.slice(0, query_idx)
        }
        location.href = href + '?user=' + user
        callback(user)
    } else if (user != "" && user != null) {
        caution = '\n入力しないと進めません'
        module.exports.userNameInput(callback, caution)
    } else {
        caution = '\n入力しないと進めません'
        callback('unknown')
        // module.exports.userNameInput(callback, caution)
    }

}

},{}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
window.addEventListener('load', init, false);

function init() {
    let loadMessage = document.getElementById('loading_message')
    loadMessage.innerHTML = ''
    try {
        // Fix up for prefixing
        window.AudioContext = window.AudioContext || window.webkitAudioContext
        context = new AudioContext()
    } catch (e) {
        alert('Web Audio API is not supported in this browser')
    }

    // demo type
    let demo_argument = document.getElementById('demo-argument')
    let demo_type = demo_argument.getAttribute('data-type')
    console.log(demo_type)

    if (demo_type == 'home') {
        let user = demo_argument.getAttribute('data-user')
        let config = {
            user: user
        }
        let inputUserName = require('./../demo-common/prompt.js')
        inputUserName.userNameCheck(config.user, (user) => {
            config.user = user
            let home = require('./home.js')
            let url = window.location.href
            let query_idx = url.indexOf('?')
            if (query_idx >= 1) {
                url = url.slice(0, query_idx)
            }
            // home.setLink

            home.init(document.getElementById('canvas_div'), 'FromTone: 各デモページに飛びます')

            home.setUser(config.user)

            home.setLink(url + 'demo-simple-notification', 'Simple-Notification')
            home.setLink(url + 'demo-task-notification', 'Task-Notification')
            home.setLink(url + 'demo-motivation', 'SyncMusic-surround')
            home.setLink(url + 'demo-chat', 'Chat')
            // home.setLink(url + 'demo-accel-sensor', 'Accel Sensor')
            home.setLink(url + 'demo-accel-notification', 'Accel-Notification')
            home.setLink(url + 'demo-doppler-notification', 'Doppler-Notification')
            home.setLink(url + 'demo-orchestra', 'Orchestra')
            home.setLink(url + 'game', 'Board Game')

            home.setNameChangeButton(() => {
                inputUserName.userNameCheck(null, (user) => {
                    config.user = user
                    home.setUser(config.user)
                })
            })

        })
    }

}

},{"./../demo-common/prompt.js":1,"./home.js":2}]},{},[3]);

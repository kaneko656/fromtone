/**
 * ページにアクセス
 */


window.addEventListener('load', init, false)

// サーバ
let socket = require('./../socket-client/index.js')
let ntp = require('./../ntp-client.js')

// 共有
// データ共有
let shareData = require('./../connect.js')
// イベント共有
// let eventListener = require('./../Call').Call()


function init() {


    // loadMessage
    let loadMessage = document.getElementById('loading_message')
    if (loadMessage && loadMessage.innerHTML) {
        loadMessage.innerHTML = ''
    }

    // web Audio
    let webAudio
    try {
        window.AudioContext = window.AudioContext || window.webkitAudioContext
        webAudio = new AudioContext()
    } catch (e) {
        alert('Web Audio API is not supported in this browser')
    }

    require('./SyncTone/index.js')


    // demo type
    let demo_argument = document.getElementById('demo-argument')
    let demo_type = demo_argument.getAttribute('data-type')
    console.log(demo_type)

    // sokcet
    shareData.set('socket_status', {
        connect: false,
        url: ''
    })
    socket.call.on('connect', (operator, url) => {
        console.log('Socket: connect', url)
        shareData.set('socket_status', {
            connect: true,
            url: url
        })
    })
    socket.call.on('disconnect', (operator, url) => {
        console.log('Socket: disconnect', url)
        shareData.set('socket_status', {
            connect: false,
            url: url
        })
    })

    // ntp
    ntp.setSocket(socket)
    ntp.autoCorrection(60000)
    ntp.getDiff((dif) => {
        let text = 'offset time: ' + (dif.offset).toFixed(1) + 'ms  　trans delay: ' + (dif.delay).toFixed(1) + 'ms<br>'
        text += 'correctionTime: ' + (dif.correctionTime).toFixed(1) + 'ms ==? ' + (dif.temp_delay).toFixed(1) + 'ms  (temporary delay)'
        dif.text = text
        shareData.set('ntp_status', dif)
    })

    // system
    if (demo_type == 'develop') {
        let user = demo_argument.getAttribute('data-user')
        let config = {
            user: user
        }
        let inputUserName = require('./../demo-common/prompt.js')
        inputUserName.userNameCheck(config.user, (user) => {
            config.user = user
            // let game = require('./index.js')
            // game.start(document.getElementById('wrap'), webAudio, socket, ntp, config, shareData, eventListener)
        })
    }
}

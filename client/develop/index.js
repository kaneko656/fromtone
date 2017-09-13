/**
 * ページにアクセス
 */


window.addEventListener('load', init, false)

// サーバ
// let socket = require('./webSocket/socketClient.js')
// let ntp = require('./../ntp-client.js')

// 共有
// データ共有
// let shareData = require('./../connect.js')
// イベント共有
// let eventListener = require('./Call').Call()


function init() {

    // loadMessage
    let loadMessage = document.getElementById('loading_message')
    if (loadMessage && loadMessage.innerHTML) {
        loadMessage.innerHTML = ''
    }

    // web Audio
    // let webAudio
    // try {
    //     window.AudioContext = window.AudioContext || window.webkitAudioContext
    //     webAudio = new AudioContext()
    // } catch (e) {
    //     alert('Web Audio API is not supported in this browser')
    // }

    // require('./SyncTone/index.js')


    // demo type
    let demo_argument = document.getElementById('demo-argument')
    let demo_type = demo_argument.getAttribute('data-type')
    console.log(demo_type)

    // sokcet
    // shareData.set('socket_status', {
    //     connect: false,
    //     url: ''
    // })
    // socket.connect((url) => {
    //     console.log('Socket: connect', url)
    //     shareData.set('socket_status', {
    //         connect: true,
    //         url: url
    //     })
    // })
    //
    // socket.disconnect((url) => {
    //     console.log('Socket: disconnect', url)
    //     shareData.set('socket_status', {
    //         connect: false,
    //         url: url
    //     })
    // })

    // ntp
    // socket.ntp.repeat(60000)


    // system
    if (demo_type == 'develop') {
        let user = demo_argument.getAttribute('data-user')
        let config = {
            user: user
        }
        let inputUserName = require('./../demo-common/prompt.js')
        inputUserName.userNameCheck(config.user, (user) => {
            config.user = user
            let main = require('./main.js')
            main.start(config)
            // let game = require('./index.js')
            // game.start(document.getElementById('wrap'), webAudio, socket, ntp, config, shareData, eventListener)
        })
    }
}

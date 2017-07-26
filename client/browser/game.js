window.addEventListener('load', init, false)

/*
 * 重いので各ページごとにjsを作成する
 * そんな変わらない   websocketが重いんだな
 */

let socket = require('./socket-client/index.js')
let ntp = require('./ntp-client.js')


function init() {

    let loadMessage = document.getElementById('loading_message')
    if (loadMessage && loadMessage.innerHTML) {
        loadMessage.innerHTML = ''
    }

    try {
        window.AudioContext = window.AudioContext || window.webkitAudioContext
        context = new AudioContext()
        startTime = Date.now()
    } catch (e) {
        alert('Web Audio API is not supported in this browser')
    }

    // demo type
    let demo_argument = document.getElementById('demo-argument')
    let demo_type = demo_argument.getAttribute('data-type')
    console.log(demo_type)

    // common
    let websokcet_status = document.getElementById('websocket_status')
    websokcet_status.style.margin = '30px'
    socket.call.on('connect', (operator, url) => {
        console.log(operator, url)
        websokcet_status.innerHTML = 'WebSocket: connect　' + url
    })
    socket.call.on('disconnect', (operator, url) => {
        websokcet_status.innerHTML = 'WebSocket: disconnect　' + url
    })

    let ntp_status = document.getElementById('ntp_status')
    ntp_status.style.margin = '30px'
    ntp.setSocket(socket)
    ntp_status.innerHTML = '...<br>...'

    ntp.getDiff((dif) => {
        let text = 'offset time: ' + (dif.offset).toFixed(1) + 'ms  　trans delay: ' + (dif.delay).toFixed(1) + 'ms<br>'
        text += 'correctionTime: ' + (dif.correctionTime).toFixed(1) + 'ms ==? ' + (dif.temp_delay).toFixed(1) + 'ms  (temporary delay)'
        ntp_status.innerHTML = text
    })

    if (demo_type == 'board-game') {
        let user = demo_argument.getAttribute('data-user')
        let config = {
            user: user
        }
        let game = require('./board-game/main/index.js')
        // let demo_mention = require('./concept-image/main.js')
        let inputUserName = require('./demo-common/prompt.js')
        inputUserName.userNameCheck(config.user, (user) => {
            config.user = user
            game.start(document.getElementById('canvas'), context, socket, ntp, config)
        })
    }

    if (demo_type == 'board-game-player') {
        let user = demo_argument.getAttribute('data-user')
        let config = {
            user: user
        }
        let game = require('./board-game/main.js')
        // let demo_mention = require('./concept-image/main.js')
        let inputUserName = require('./demo-common/prompt.js')
        inputUserName.userNameCheck(config.user, (user) => {
            config.user = user
            game.start(document.getElementById('canvas'), context, socket, ntp, config)
        })
    }
}

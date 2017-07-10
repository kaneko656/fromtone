window.addEventListener('load', init, false);

/*
 * 重いので各ページごとにjsを作成する
 * そんな変わらない   websocketが重いんだな
 */

let socket = require('./socket-client')
let ntp = require('./ntp-client.js')


function init() {

    let loadMessage = document.getElementById('loading_message')
    if (loadMessage && loadMessage.innerHTML) {
        loadMessage.innerHTML = ''
    }

    try {
        // Fix up for prefixing
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

    if (demo_type == 'home') {
        let user = demo_argument.getAttribute('data-user')
        let config = {
            user: user
        }
        let inputUserName = require('./demo-common/prompt.js')
        inputUserName.userNameCheck(config.user, (user) => {
            config.user = user
            let home = require('./home/home.js')
            let url = window.location.href
            let query_idx = url.indexOf('?')
            if (query_idx >= 1) {
                url = url.slice(0, query_idx)
            }
            home.init(document.getElementById('canvas_div'), 'FromTone: 各デモページに飛びます')
            home.setUser(config.user)
            home.setLink(url + 'demo-simple-notification', 'Simple-Notification')
            // home.setLink
            home.setNameChangeButton(() => {
                inputUserName.userNameCheck(null, (user) => {
                    config.user = user
                    home.setUser(config.user)
                })
            })
        })
        return
    }


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



    // if (demo_type == 'webaudio') {
    //     let directionPanner = require('./webaudio/direction-panner.js')
    //     directionPanner.setSocket(socket)
    //     directionPanner.resetButton(document.getElementById('reset_button'))
    //     directionPanner.button(document.getElementById('button_list'))
    //     directionPanner.panner(context, ntp)
    // }
    //
    // if (demo_type == 'syncmusic') {
    //     let syncmusic = require('./sync-music/sync-music.js')
    //     syncmusic.setSocket(socket)
    //
    //     syncmusic.setButton(document.getElementById('menu_button'))
    //     syncmusic.webAudioAPI(context, ntp)
    //     socket.call.on('connect', () => {
    //         syncmusic.connectSocket(socket)
    //     })
    // }

    if (demo_type == 'syncmusic-surround') {
        let syncmusic = require('./sync-music/sync-music-surround.js')
        syncmusic.setSocket(socket)
        syncmusic.setButton(document.getElementById('menu_button'))
        syncmusic.setCanvas(document.getElementById('canvas_div'))
        syncmusic.webAudioAPI(context, ntp)
        socket.call.on('connect', () => {
            syncmusic.connectSocket(socket)
            if (demo_argument.getAttribute('data-reset')) {
                socket.emit('syncmusic_surround_reset', {})
            }
        })
    }

    // if (demo_type == 'touch-surround') {
    //     let syncmusic = require('./unit/main.js')
    //     syncmusic.start(document.getElementById('canvas_div'), context, socket, ntp)
    //     socket.call.on('connect', () => {
    //         if (demo_argument.getAttribute('data-reset')) {
    //             socket.emit('syncmusic_surround_reset', {})
    //         }
    //     })
    // }
    //
    if (demo_type == 'demo-motivation') {
        let syncmusic = require('./demo-motivation/main.js')
        let user = demo_argument.getAttribute('data-user')
        let config = {
            user: user
        }
        syncmusic.start(document.getElementById('canvas_div'), context, socket, ntp, user)
        socket.call.on('connect', () => {
            if (demo_argument.getAttribute('data-reset')) {
                socket.emit('demo_motivation_reset', {})
            }
        })
    }
    //
    // if (demo_type == 'demo-mention') {
    //     let user = demo_argument.getAttribute('data-user')
    //     let config = {
    //         user: user
    //     }
    //     let demo_mention = require('./demo-mention/main.js')
    //     // let demo_mention = require('./concept-image/main.js')
    //     let inputUserName = require('./demo-mention/prompt.js')
    //     inputUserName.userNameCheck(config.user, (user) => {
    //         config.user = user
    //         demo_mention.start(document.getElementById('canvas_div'), context, socket, ntp, config)
    //         socket.call.on('connect', () => {
    //             if (demo_argument.getAttribute('data-reset')) {
    //                 socket.emit('demo_motivation_reset', {})
    //             }
    //         })
    //     })
    // }

    if (demo_type == 'demo-simple-notification') {
        let user = demo_argument.getAttribute('data-user')
        let config = {
            user: user
        }
        let demo_mention = require('./demo-simple-notification/main.js')
        // let demo_mention = require('./concept-image/main.js')
        let inputUserName = require('./demo-common/prompt.js')
        inputUserName.userNameCheck(config.user, (user) => {
            config.user = user
            demo_mention.start(document.getElementById('canvas_div'), context, socket, ntp, config)
            socket.call.on('connect', () => {
                if (demo_argument.getAttribute('data-reset')) {
                    socket.emit('demo_motivation_reset', {})
                }
            })
        })
    }

    if (demo_type == 'demo-accel-notification') {
        let user = demo_argument.getAttribute('data-user')
        let config = {
            user: user
        }
        let demo_mention = require('./demo-accel-notification/main.js')
        // let demo_mention = require('./concept-image/main.js')
        let inputUserName = require('./demo-common/prompt.js')
        inputUserName.userNameCheck(config.user, (user) => {
            config.user = user
            demo_mention.start(document.getElementById('canvas_div'), context, socket, ntp, config)
            socket.call.on('connect', () => {
                if (demo_argument.getAttribute('data-reset')) {
                    socket.emit('demo_motivation_reset', {})
                }
            })
        })
    }

    if (demo_type == 'demo-doppler-notification') {
        let user = demo_argument.getAttribute('data-user')
        let config = {
            user: user
        }
        let demo_mention = require('./demo-doppler-notification/main.js')
        let graph = require('./demo-doppler-notification/graph')
        // let demo_mention = require('./concept-image/main.js')
        let inputUserName = require('./demo-common/prompt.js')
        inputUserName.userNameCheck(config.user, (user) => {
            config.user = user
            demo_mention.start(document.getElementById('canvas_div'), context, socket, ntp, config)
            graph.init(document.getElementById('canvas_graph'))

            socket.call.on('connect', () => {
                if (demo_argument.getAttribute('data-reset')) {
                    socket.emit('demo_motivation_reset', {})
                }
            })
        })
    }

    if (demo_type == 'demo-chat') {
        let user = demo_argument.getAttribute('data-user')
        let config = {
            user: user
        }
        let demo_mention = require('./demo-chat/main.js')
        // let demo_mention = require('./concept-image/main.js')
        let inputUserName = require('./demo-common/prompt.js')
        inputUserName.userNameCheck(config.user, (user) => {
            config.user = user
            demo_mention.start(document.getElementById('canvas_div'), context, socket, ntp, config)
            socket.call.on('connect', () => {
                if (demo_argument.getAttribute('data-reset')) {
                    socket.emit('demo_motivation_reset', {})
                }
            })
        })
    }

    if (demo_type == 'demo-accel-sensor') {
        let syncmusic = require('./demo-accel-sensor/main.js')
        let user = demo_argument.getAttribute('data-user')
        let config = {
            user: user
        }
        syncmusic.start(document.getElementById('canvas_div'), context, socket, ntp, user)
        socket.call.on('connect', () => {
            if (demo_argument.getAttribute('data-reset')) {
                socket.emit('demo_motivation_reset', {})
            }
        })
    }

    if (demo_type == 'demo-task-notification') {
        let user = demo_argument.getAttribute('data-user')
        let config = {
            user: user
        }
        let demo_mention = require('./demo-task-notification/main.js')
        // let demo_mention = require('./concept-image/main.js')
        let inputUserName = require('./demo-common/prompt.js')
        inputUserName.userNameCheck(config.user, (user) => {
            config.user = user
            demo_mention.start(document.getElementById('canvas_div'), context, socket, ntp, config)
            socket.call.on('connect', () => {
                if (demo_argument.getAttribute('data-reset')) {
                    socket.emit('demo_motivation_reset', {})
                }
            })
        })
    }

    if (demo_type == 'demo-alarm') {
        let syncmusic = require('./demo-alarm/main.js')
        syncmusic.start(document.getElementById('canvas_div'), context, socket, ntp)
        socket.call.on('connect', () => {
            if (demo_argument.getAttribute('data-reset')) {
                socket.emit('demo_alarm_reset', {})
            }
        })
    }

}

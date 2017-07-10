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


            home.setNameChangeButton(() => {
                inputUserName.userNameCheck(null, (user) => {
                    config.user = user
                    home.setUser(config.user)
                })
            })

        })
    }
}

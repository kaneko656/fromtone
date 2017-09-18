/**
 * ページにアクセス
 */


window.addEventListener('load', init, false)

const queryString = require('query-string');
let query = queryString.parse(location.search)
console.log(query)

function init() {

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
        let config = query || {}
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

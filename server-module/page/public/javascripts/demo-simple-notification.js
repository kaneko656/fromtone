(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// window.addEventListener('load', init, false);
//
//
// let socket = require('./../socket-client')
// let ntp = require('./../ntp-client.js')
//
//
// function init() {
//     let loadMessage = document.getElementById('loading_message')
//     loadMessage.innerHTML = ''
//
//     try {
//         // Fix up for prefixing
//         window.AudioContext = window.AudioContext || window.webkitAudioContext
//         context = new AudioContext()
//         startTime = Date.now()
//     } catch (e) {
//         alert('Web Audio API is not supported in this browser')
//     }
//
//     // demo type
//     let demo_argument = document.getElementById('demo-argument')
//     let demo_type = demo_argument.getAttribute('data-type')
//     console.log(demo_type)
//
//     // common
//     let websokcet_status = document.getElementById('websocket_status')
//     websokcet_status.style.margin = '30px'
//     socket.call.on('connect', (operator, url) => {
//         console.log(operator, url)
//         websokcet_status.innerHTML = 'WebSocket: connect　' + url
//     })
//     socket.call.on('disconnect', (operator, url) => {
//         websokcet_status.innerHTML = 'WebSocket: disconnect　' + url
//     })
//
//     let ntp_status = document.getElementById('ntp_status')
//     ntp_status.style.margin = '30px'
//     ntp.setSocket(socket)
//     ntp_status.innerHTML = '...<br>...'
//
//     ntp.getDiff((dif) => {
//         let text = 'offset time: ' + (dif.offset).toFixed(1) + 'ms  　trans delay: ' + (dif.delay).toFixed(1) + 'ms<br>'
//         text += 'correctionTime: ' + (dif.correctionTime).toFixed(1) + 'ms ==? ' + (dif.temp_delay).toFixed(1) + 'ms  (temporary delay)'
//         ntp_status.innerHTML = text
//     })
//
//     if (demo_type == 'demo-simple-notification') {
//         let user = demo_argument.getAttribute('data-user')
//         let config = {
//             user: user
//         }
//         let demo_mention = require('./main.js')
//         let inputUserName = require('./../demo-common/prompt.js')
//         inputUserName.userNameCheck(config.user, (user) => {
//             config.user = user
//             demo_mention.start(document.getElementById('canvas_div'), context, socket, ntp, config)
//             socket.call.on('connect', () => {
//                 if (demo_argument.getAttribute('data-reset')) {
//                     socket.emit('demo_motivation_reset', {})
//                 }
//             })
//         })
//     }
// }

},{}]},{},[1]);
